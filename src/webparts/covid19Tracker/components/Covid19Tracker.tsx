import * as React from 'react';
import styles from './Covid19Tracker.module.scss';
import { ICovid19TrackerProps, ICovid19TrackerState, IStatsLocation, IStatsInfo, ILocation } from './Covid19Tracker.types';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { PnPClientStorage, dateAdd } from '@pnp/common';
import { KeyedCollection } from './KeyedCollection';
import { IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { ComboBox, IComboBoxOption, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index';

export default class Covid19Tracker extends React.Component<ICovid19TrackerProps, ICovid19TrackerState> {

  private readonly CACHE_LOC_KEY = "SPFX-COVID19-LOC-KEY";
  private readonly CACHE_DATA_KEY:string = "SPFX-COVID19-TRACKER";
  private readonly DEFAULT_LOCATION = {
    country:"India",
    countryCode:"IN",
  };

  private _storage:PnPClientStorage;

  constructor(props:ICovid19TrackerProps){
    super(props);
    this._storage = new PnPClientStorage();

    // Get the selected location from local storage
    // If not found set to default value
    let selectedLoc:IStatsLocation = this._storage.local.get(this.CACHE_LOC_KEY);
    if(!selectedLoc){
      selectedLoc = this.DEFAULT_LOCATION;
    }
    
    // Initialize state
    this.state={
      showChangeDialog:false,
      latest: {
        confirmed: 0,
        deaths: 0,
        recovered: 0,
      },
      location: selectedLoc,
      chosenLocation: selectedLoc,
      locationStats:{
        confirmed: 0,
        deaths: 0,
        recovered: 0,
      }
    };
  }

  public render(): React.ReactElement<ICovid19TrackerProps> {
    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;
    const secondaryRowCssClass = this.props.showDeaths && this.props.showRecovered ? styles.statBoxSecondary : styles.statBoxSecondaryFull;
    return (
      <div className={ styles.covid19Tracker }
        style={{ backgroundColor: semanticColors.bodyBackground }}
      >
          <WebPartTitle
            themeVariant = {this.props.themeVariant}
            displayMode={this.props.displayMode}
            title={this.props.title}
            updateProperty={this.props.updateTitle}
          />

        <div className={ styles.container }>

          {/* Show totals */}
          <div className= { styles.statContainer }>
            {this.props.showConfirmed && (
              <div className = {styles.statBox}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Confirmed
                </div>
                <div className={styles.count}>
                  {this.state.latest.confirmed.toLocaleString()}
                </div>
                </div>
              </div>              
            )}
            {this.props.showRecovered && (
              <div className = {secondaryRowCssClass}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Recovered
                </div>
                <div className={styles.count}>
                  {this.state.latest.recovered.toLocaleString()}
                </div>
                </div>
              </div>              
            )}
            {this.props.showDeaths && (
              <div className = {secondaryRowCssClass} style={{borderRightWidth:"0px"}}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Deaths
                </div>
                <div className={styles.count}>
                  {this.state.latest.deaths.toLocaleString()}
                </div>
                </div>
              </div>              
            )}  
          </div>

          {/* Show the statistics for the selected location */}
          <h3>
            {this.state.location.province && (
              <>{this.state.location.province},&nbsp;</>
            )}
            {this.state.location.country}
            <IconButton onClick={this._showChangeDialog} className={styles.editButton}>
              <Icon iconName="Edit"></Icon>
            </IconButton>
          </h3>
          <div className= { styles.statContainer }>
            {this.props.showConfirmed && (
              <div className = {styles.statBox}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Confirmed
                </div>
                <div className={styles.count}>
                  {this.state.locationStats.confirmed.toLocaleString()}
                </div>
                </div>
              </div>              
            )}
            {this.props.showRecovered && (
              <div className = {secondaryRowCssClass}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Recovered
                </div>
                <div className={styles.count}>
                  {this.state.locationStats.recovered.toLocaleString()}
                </div>
                </div>
              </div>              
            )}
            {this.props.showDeaths && (
              <div className = {secondaryRowCssClass} style={{borderRightWidth:"0px"}}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Deaths
                </div>
                <div className={styles.count}>
                  {this.state.locationStats.deaths.toLocaleString()}
                </div>
                </div>
              </div>              
            )}  
          </div>

          {/* Modal to personalize the selected location */}
          {
            this.state.showChangeDialog && (
            <Dialog
              isOpen={this.state.showChangeDialog}
              onDismiss={()=>{this.setState({showChangeDialog:false});}}
              dialogContentProps={{
                type: DialogType.normal,
                title: 'Change Location',
                subText: 'Select the country/province'
              }}
              modalProps={{
                isBlocking: true,
                styles: { main: { maxWidth: 450 } },
              }}
            >
              <ComboBox
                label="Country"
                placeholder="Select country"
                autoComplete="on"
                value={this.state.chosenLocation.country}
                selectedKey={this.state.chosenLocation.countryCode}
                options={
                  this.state.allLocations.Values().map(loc => {
                    return {
                      key: loc.countryCode,
                      text: loc.country,
                    } as IComboBoxOption;
                  })
                }
                onChange = {
                  (event, option:IComboBoxOption, idx, value) => {
                    this.setState({chosenLocation:{
                      province:"",
                      country: option.text,
                      countryCode: option.key as string,
                    }});
                  }
                }
              />

              <ComboBox
                label="Province"
                hidden={this.state.allLocations.Item(this.state.chosenLocation.countryCode).provinces.length < 1}
                placeholder="Select Province"
                autoComplete="on"
                value={this.state.chosenLocation.province}
                selectedKey={this.state.chosenLocation.province}
                options={
                  this.state.allLocations.Item(this.state.chosenLocation.countryCode).provinces.map(province => {
                    return {
                      key: province,
                      text: province,
                    } as IComboBoxOption;
                  })
                }
                onChange = {
                  (event, option:IComboBoxOption, idx, value) => {
                    this.setState({chosenLocation:{
                      ...this.state.chosenLocation,
                      province: option.text
                    }});
                  }
                }
              />

            <DialogFooter>
              <PrimaryButton onClick={this._onLocationChange} text="Save" />
            </DialogFooter>
            </Dialog>
          )}

        </div>
      </div>
    );
  }

  public componentDidMount(){
    this._getStats();
  }

  private _getStats = async () => {
    const {location} = this.state;

    const STATS_API_URL:string = "https://coronavirus-tracker-api.herokuapp.com/all";
    

    // Fetch the stats from the API and save in session for 60 mins
    let data:any = await this._storage.session.getOrPut(this.CACHE_DATA_KEY, () => {
      return fetch(STATS_API_URL)
      .then(response => response.text()).then(d => JSON.parse(d));
    }, dateAdd(new Date(), "minute", 60));

    this.setState({
      latest: {
        ...data.latest,
        lastUpdated: new Date(data.confirmed.last_updated)
      },
      locationStats: this._getLocationStats(data, location),
      showChangeDialog: false,
    });
  }

  private _getLocationStats = (data:any, location:IStatsLocation):IStatsInfo => {
    let stats:IStatsInfo = {...this.state.locationStats};

    if(!location.province) { location.province=""; }

    // Get confirmed count for location
    for (let index = 0; index < data.confirmed.locations.length; index++) {
      const element = data.confirmed.locations[index];
      if(element.country_code == location.countryCode && element.province == location.province)
      {
        stats.confirmed = element.latest;
        break;
      }
    }

    // Get confirmed count for location
    for (let index = 0; index < data.deaths.locations.length; index++) {
      const element = data.deaths.locations[index];
      if(element.country_code == location.countryCode && element.province == location.province)
      {
        stats.deaths = element.latest;
        break;
      }
    }

    // Get confirmed count for location
    for (let index = 0; index < data.recovered.locations.length; index++) {
      const element = data.recovered.locations[index];
      if(element.country_code == location.countryCode && element.province == location.province)
      {
        stats.recovered = element.latest;
        break;
      }
    }
    return stats;
  }

  private _showChangeDialog = () => {

    let locations = new KeyedCollection<ILocation>();
    const locData:any = this._storage.session.get(this.CACHE_DATA_KEY);
    
    locData.confirmed.locations.map((d,i) => {
      // Adding locations
      if(!locations.ContainsKey(d.country_code))
      {
        locations.Add(d.country_code,{
          country:d.country,
          countryCode:d.country_code,
          provinces:[]
        });
      }

      // Check for provinces
      if(
        d.province && d.province.length > 0 &&
        locations.Item(d.country_code).provinces.indexOf(d.province) == -1
        )
      {
        locations.Item(d.country_code).provinces.push(d.province);
      }
    });

    this.setState({
      allLocations: locations,
      showChangeDialog: true,
    });
  }

  private _onLocationChange = () => {
    this._storage.local.put(this.CACHE_LOC_KEY, this.state.chosenLocation);
    this.setState({
      location:this.state.chosenLocation,
      showChangeDialog:false,
    },() => {this._getStats();});
  }
}