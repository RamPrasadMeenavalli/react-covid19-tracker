import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'Covid19TrackerWebPartStrings';
import Covid19Tracker from './components/Covid19Tracker';
import { ICovid19TrackerProps, ILocation } from './components/Covid19Tracker.types';
import { PnPClientStorage, dateAdd } from '@pnp/common';

import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';
import { KeyedCollection } from './Utilities/KeyedCollection';
import { Utilities } from './Utilities/Utilities';

export interface ICovid19TrackerWebPartProps {
  title: string;

  defaultCountry:string;
  defaultProvince:string;
}

export default class Covid19TrackerWebPart extends BaseClientSideWebPart <ICovid19TrackerWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  private _storage:PnPClientStorage;
  private _apiData:any;
  private _locations:KeyedCollection<ILocation>;

  protected async onInit(): Promise<void> {
    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();
    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    // Initilize the PnP Client storage object
    this._storage = new PnPClientStorage();

    // Get the external data
    this._apiData = await this._getTrackerStats();
    this._locations = Utilities.getAllLocations(this._apiData);

    return super.onInit();
  }

  public render(): void {

    const element: React.ReactElement<ICovid19TrackerProps> = React.createElement(
      Covid19Tracker,
      {
        title: this.properties.title,
        updateTitle: (value: string) => {
          this.properties.title = value;
        },
        displayMode: this.displayMode,
        themeVariant: this._themeVariant,

        apiData:this._apiData,
        defaultLocation: {
          countryCode : this.properties.defaultCountry ? this.properties.defaultCountry : "IN",
          province: this.properties.defaultProvince ? this.properties.defaultProvince : "",
          country: this._locations.ContainsKey(this.properties.defaultCountry) ? this._locations.Item(this.properties.defaultCountry).country : "India"
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown('defaultCountry',{
                  label: strings.countryFieldLabel,
                  selectedKey: this.properties.defaultCountry,
                  options: this._getCountryDropDownOptions(),
                }),
                PropertyPaneDropdown('defaultProvince',{
                  label: strings.provinceFieldLabel,
                  selectedKey: this.properties.defaultProvince,
                  options: this._getProvinceDropDownOptions(),
                  disabled: this._getProvinceDropDownOptions().length == 0
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onPropertyPaneConfigurationStart(): void {
    // var self = this;
    // this._getTrackerStats().then(res => {
    //   self._locations = Utilities.getAllLocations(res);
    //   self.context.propertyPane.refresh();
    // });
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'defaultCountry' &&
        newValue) {
      // push new list value
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      // Reset the province
      const previousItem: string = this.properties.defaultProvince;
      this.properties.defaultProvince = this._locations.Item(newValue).provinces.length > 0 ? this._locations.Item(newValue).provinces[0] : "";
      this.onPropertyPaneFieldChanged('defaultProvince', previousItem, this.properties.defaultProvince);
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
    }
    else {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
  }

  private _getCountryDropDownOptions = ():IPropertyPaneDropdownOption[] => {
    let options:IPropertyPaneDropdownOption[] = 
    this._locations.Values()
    .sort((a,b)=> {return a.country>b.country?1:a.country<b.country?-1:0;})
    .map(country => {
      return {
        key: country.countryCode,
        text: country.country,
      };
    });
    return options;
  }

  private _getProvinceDropDownOptions = ():IPropertyPaneDropdownOption[] => {
    let options:IPropertyPaneDropdownOption[] = [];
    if(this.properties.defaultCountry && 
      this._locations.Item(this.properties.defaultCountry).provinces.length > 0
    )
      {
        options = this._locations.Item(this.properties.defaultCountry)
        .provinces
        .sort()
        .map(p => {
          return {
            key: p,
            text: p
          };
        });
      }
      
    return options;
  }

  private _getTrackerStats = async ():Promise<any> => {
    const STATS_API_URL:string = "https://coronavirus-tracker-api.herokuapp.com/all";
    const CACHE_DATA_KEY:string = "SPFX-COVID19-TRACKER";

    // Fetch the stats from the API and save in session for 60 mins
    return await this._storage.session.getOrPut(CACHE_DATA_KEY, () => {
      return fetch(STATS_API_URL)
      .then(response => response.text()).then(d => JSON.parse(d));
    }, dateAdd(new Date(), "minute", 60));
  }

  /**
  * Update the current theme variant reference and re-render.
  *
  * @param args The new theme
  */
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }
}
