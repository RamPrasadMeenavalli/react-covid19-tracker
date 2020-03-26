import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'Covid19TrackerWebPartStrings';
import Covid19Tracker from './components/Covid19Tracker';
import { ICovid19TrackerProps } from './components/Covid19Tracker.types';

import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';
import DataService from './DataModel/DataService';

export interface ICovid19TrackerWebPartProps {
  title: string;
  defaultCountry:string;
}

export default class Covid19TrackerWebPart extends BaseClientSideWebPart <ICovid19TrackerWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  protected async onInit(): Promise<void> {
    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();
    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
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
        defaultLocation: this.properties.defaultCountry
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
                })
              ]
            }
          ]
        }
      ]
    };
  }

  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  //   if (propertyPath === 'defaultCountry' &&
  //       newValue) {
  //     // push new list value
  //     super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  //     // Reset the province
  //     const previousItem: string = this.properties.defaultProvince;
  //     this.properties.defaultProvince = this._locations.Item(newValue).provinces.length > 0 ? this._locations.Item(newValue).provinces[0] : "";
  //     this.onPropertyPaneFieldChanged('defaultProvince', previousItem, this.properties.defaultProvince);
  //     // refresh the item selector control by repainting the property pane
  //     this.context.propertyPane.refresh();
  //   }
  //   else {
  //     super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  //   }
  // }

  private _getCountryDropDownOptions = ():IPropertyPaneDropdownOption[] => {
    let options:IPropertyPaneDropdownOption[] = 
    DataService.allLocation
    .sort((a,b)=> {return a.title>b.title?1:a.title<b.title?-1:0;})
    .map(country => {
      return {
        key: country.key,
        text: country.title,
      };
    });
    return options;
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
