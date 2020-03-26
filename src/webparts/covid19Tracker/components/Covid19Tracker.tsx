import * as React from 'react';
import styles from './Covid19Tracker.module.scss';
import DataService from '../DataModel/DataService';
import { ILatestStats } from '../DataModel/DataTypes';
import { Dialog, DialogType, DialogFooter,
  ComboBox, IComboBoxOption, IComboBox, 
  PrimaryButton } from 'office-ui-fabric-react';

import StatsBox from './StatsBox/StatsBox';
import { ICovid19TrackerProps, ICovid19TrackerState } from './Covid19Tracker.types';

export default class Covid19Tracker extends React.Component<ICovid19TrackerProps, ICovid19TrackerState> {

  constructor(props:ICovid19TrackerProps){
    super(props);
    
    this.state={
      latest:{
        id:"",
        displayName:"",
        totalConfirmed:0,
        totalDeaths:0,
        totalRecovered:0,
      },
      locStats:[],
      showModal: false,
      userLoc:[props.defaultLocation],
      loading: false,
    }
  }

  render(){
  const {latest, locStats} = this.state;
  console.dir(locStats);
  return (
    <div className={styles.covid19Tracker}>
      <div className={styles.container}>
        <div className={styles.App}>
        <StatsBox {...latest}
          showChangeLocation
          onLocationChange={this._showModal}
        ></StatsBox>

        {this.state.loading && (
          <div className={styles.loading}>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>
        )}
        {!this.state.loading && (locStats.map((locStat, index) => {
          return <StatsBox {...locStat}></StatsBox>
        }))}
        

            <Dialog
              isOpen={this.state.showModal}
              onDismiss={() => {this.setState({showModal:false});}}
              dialogContentProps={{
                type: DialogType.normal,
                title: 'Change Location',
              }}
              modalProps={{
                isBlocking: true,
                styles: { main: { maxWidth: 550 } },
              }}
            >
              <ComboBox
                multiSelect
                label="Country"
                placeholder="Select country"
                autoComplete="on"
                selectedKey={this.state.userLoc}
                options={
                  DataService.allLocation.sort((a,b)=> {return a.title>b.title?1:a.title<b.title?-1:0;})
                  .map(loc => {
                    return {
                      key: loc.key,
                      text: loc.title,
                    } as IComboBoxOption;
                  })
                }
                onChange = {this._onChangeMulti}
              />
              <DialogFooter>
                <PrimaryButton onClick={this._saveLocations}>Save</PrimaryButton>
              </DialogFooter>
            </Dialog>

    </div>
      
        <div className={styles.footNote}>
          <div className={styles.dataSource}>
            <a href="https://blog.meenavalli.in/post/spfx-covid-19-tracker-webpart#dataSource" target="_blank">Data source</a>
          </div>
        </div>
          
      </div>
    </div>
  );
  }

  componentDidMount(){
    this._loadData(false);
  }

  private _loadData = async (forceRefresh:boolean) => {
    this.setState({loading:true});
    // Get latest stats and update with previous days stats
    let latest:ILatestStats = await DataService.getGlobalStats(forceRefresh);

    // Get the stats for the selected location of the user.
    let userLoc:Array<string> = await DataService.getSelectedLocations();
    if(!userLoc)
    {
      userLoc = [this.props.defaultLocation];
      DataService.setSelectedLocations(userLoc);
    } 
    let locStats:Array<ILatestStats> = await DataService.getCountryStats(forceRefresh);

    this.setState({latest, locStats, userLoc, loading:false});
  }

  private _showModal = () => {
    this.setState({showModal:true});
  }

  private _onChangeMulti = async (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
    const currentSelectedKeys = this.state.userLoc || [];
    if (option) {
      // User selected/de-selected an existing option
      let userLoc:Array<string> = this._updateSelectedOptionKeys(currentSelectedKeys, option);
      this.setState({ userLoc });
      await DataService.setSelectedLocations(userLoc);
    }
  };

  private _updateSelectedOptionKeys = (selectedKeys: string[], option: IComboBoxOption): string[] => {
    selectedKeys = [...selectedKeys]; // modify a copy
    const index = selectedKeys.indexOf(option.key as string);
    if (option.selected && index < 0) {
      selectedKeys.push(option.key as string);
    } else {
      selectedKeys.splice(index, 1);
    }
    return selectedKeys;
  };

  private _saveLocations = () => {
    this.setState({showModal:false}, () => {
      this._loadData(true);
    });
  }
}