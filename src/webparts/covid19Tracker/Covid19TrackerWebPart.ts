import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'Covid19TrackerWebPartStrings';
import Covid19Tracker from './components/Covid19Tracker';
import { ICovid19TrackerProps } from './components/Covid19Tracker.types';

import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';

export interface ICovid19TrackerWebPartProps {
  title: string;
  showConfirmed: boolean;
  showDeaths: boolean;
  showRecovered: boolean;
}

export default class Covid19TrackerWebPart extends BaseClientSideWebPart <ICovid19TrackerWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  protected onInit(): Promise<void> {
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

        showConfirmed: this.properties.showConfirmed,
        showDeaths: this.properties.showDeaths,
        showRecovered: this.properties.showRecovered,
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
                PropertyPaneToggle('showConfirmed', {
                  label: strings.showConfirmedFieldLabel
                }),
                PropertyPaneToggle('showRecovered', {
                  label: strings.showRecoveredFieldLabel
                }),
                PropertyPaneToggle('showDeaths', {
                  label: strings.showDeathsFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
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
