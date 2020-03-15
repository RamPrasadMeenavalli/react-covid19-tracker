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
import { ComboBox, IComboBoxOption, SelectableOptionMenuItemType, css } from 'office-ui-fabric-react/lib/index';
import ChangeLocationDialog from './ChangeLocationDialog/ChangeLocationDialog';

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
      locationStats:{
        confirmed: 0,
        deaths: 0,
        recovered: 0,
      }
    };
  }

  public render(): React.ReactElement<ICovid19TrackerProps> {
    const {latest, locationStats} = this.state;
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
                  {latest.confirmed.toLocaleString()}
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
                  {latest.recovered.toLocaleString()}
                </div>
                </div>
              </div>              
            )}
            {this.props.showDeaths && (
              <div className = {secondaryRowCssClass}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Total Deaths
                </div>
                <div className={styles.count}>
                  {latest.deaths.toLocaleString()}
                </div>
                </div>
              </div>              
            )}  
          </div>

          {/* Show the statistics for the selected location */}
          <div className={styles.sectionTitle}>
              {this.state.location.province && (
                <>{this.state.location.province},&nbsp;</>
              )}
              {this.state.location.country}
              <IconButton onClick={() => this.setState({showChangeDialog:true})}>
                <Icon iconName="Edit"></Icon>
              </IconButton>
          </div>
          <div className= { styles.statContainer }>

            {this.props.showConfirmed && (
              <div className = {styles.statBox}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Confirmed
                </div>
                <div className={styles.count}>
                  {locationStats.confirmed.toLocaleString()}

                  <div className={styles.change}>
                    {locationStats.confirmed > locationStats.prevConfirmed ? 
                      // Negative case
                      <div className={css(styles.red, styles.up)}>{locationStats.confirmed - locationStats.prevConfirmed}</div> : 
                      locationStats.confirmed < locationStats.prevConfirmed ? 
                      // Positive case
                      <div className={css(styles.green, styles.down)}>{locationStats.prevConfirmed - locationStats.confirmed}</div> : 
                      // Neutral case
                      <div className={styles.neutral}>0</div>
                    }
                  </div>
                </div>
                </div>
              </div>              
            )}
            {this.props.showRecovered && (
              <div className = {secondaryRowCssClass}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Recovered
                </div>
                <div className={styles.count}>
                  {locationStats.recovered.toLocaleString()}
                  <div className={styles.change}>
                    {locationStats.recovered > locationStats.prevRecovered ? 
                      // Positive case
                      <div className={css(styles.green, styles.up)}>{locationStats.recovered - locationStats.prevRecovered}</div> : 
                      locationStats.recovered < locationStats.prevRecovered ? 
                      // Negative case
                      <div className={css(styles.red, styles.down)}>{locationStats.prevRecovered - locationStats.recovered}</div> : 
                      // Neutral case
                      <div className={styles.neutral}>0</div>
                    }
                  </div>                  
                </div>
                </div>
              </div>              
            )}
            {this.props.showDeaths && (
              <div className = {secondaryRowCssClass}>
                <div className = {styles.wrapper}>
                <div className = {styles.label}>
                  Deaths
                </div>
                <div className={styles.count}>
                  {locationStats.deaths.toLocaleString()}
                  <div className={styles.change}>
                    {locationStats.deaths > locationStats.prevDeaths ? 
                      // Negative case
                      <div className={css(styles.red, styles.up)}>{locationStats.deaths - locationStats.prevDeaths}</div> : 
                      locationStats.deaths < locationStats.prevDeaths ? 
                      // Positive case
                      <div className={css(styles.green, styles.down)}>{locationStats.prevDeaths - locationStats.deaths}</div> : 
                      // Neutral case
                      <div className={styles.neutral}>0</div>
                    }
                  </div>
                </div>
                </div>
              </div>              
            )}  
          </div>

          {latest.lastUpdated && (
            <div className={styles.date}>
            as on {latest.lastUpdated}
            </div>            
          )}
          

          {/* Modal to personalize the selected location */}
          {
            this.state.showChangeDialog && (
              <ChangeLocationDialog
              isOpen={this.state.showChangeDialog}
              onDismiss={()=>{this.setState({showChangeDialog:false});}}
              onLocationChange={this._onLocationChange}
              allLocationsKey={this.CACHE_DATA_KEY}
              defaultValue= {this.state.location}
              />
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
        lastUpdated: this._getLastUpdated(data.confirmed.locations[0].history),
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
        stats.prevConfirmed = this._getPreviousCount(element.history);
        break;
      }
    }

    // Get confirmed count for location
    for (let index = 0; index < data.deaths.locations.length; index++) {
      const element = data.deaths.locations[index];
      if(element.country_code == location.countryCode && element.province == location.province)
      {
        stats.deaths = element.latest;
        stats.prevDeaths = this._getPreviousCount(element.history);
        break;
      }
    }

    // Get confirmed count for location
    for (let index = 0; index < data.recovered.locations.length; index++) {
      const element = data.recovered.locations[index];
      if(element.country_code == location.countryCode && element.province == location.province)
      {
        stats.recovered = element.latest;
        stats.prevRecovered = this._getPreviousCount(element.history);
        break;
      }
    }
    return stats;
  }

  private _getPreviousCount = (history:any):number => {
    let count:number;
    let today:string;
    let previous:string;
    let interval:number = 0;

    const options = {year: '2-digit', month: 'numeric', day: 'numeric' };
    do {
      today = dateAdd(new Date(),"day",interval).toLocaleDateString("en-US", options);
      // Get previous days count
      previous = dateAdd(new Date(),"day",interval-1).toLocaleDateString("en-US", options);
      count = history[previous];
      interval--;
    } while(history[today] == undefined);
    return count;
  }

  private _getLastUpdated = (history:any):string => {
    let lastUpdate:string;
    let interval:number = 0;

    const options = {year: '2-digit', month: 'numeric', day: 'numeric' };
    do {
      lastUpdate = dateAdd(new Date(),"day",interval).toLocaleDateString("en-US", options);
      interval--;
    } while(history[lastUpdate] == undefined);
    return lastUpdate;
  }

  private _onLocationChange = (newLocation:IStatsLocation) => {
    this._storage.local.put(this.CACHE_LOC_KEY, newLocation);
    this.setState({
      location:newLocation,
      showChangeDialog:false,
    },() => {this._getStats();});
  }
}