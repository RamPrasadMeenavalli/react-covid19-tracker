import * as React from 'react';
import { IChangeLocationDialogProps, IChangeLocationDialogState } from './ChangeLocationDialog.types';
import { Dialog, DialogType, ComboBox, IComboBoxOption, DialogFooter, PrimaryButton } from 'office-ui-fabric-react';
import { KeyedCollection } from '../KeyedCollection';
import { ILocation } from '../Covid19Tracker.types';
import { PnPClientStorage, dateAdd } from '@pnp/common';

export default class ChangeLocationDialog extends React.Component<IChangeLocationDialogProps, IChangeLocationDialogState> {
    private _storage:PnPClientStorage;
    constructor(props:IChangeLocationDialogProps){
        super(props);
        this._storage = new PnPClientStorage();
        this.state={
            chosenLocation: this.props.defaultValue,
            allLocations: this._getAllLocations(),
        };
    }

    public render(): React.ReactElement<IChangeLocationDialogProps> {
        return (
            <>
            <Dialog
              isOpen={this.props.isOpen}
              onDismiss={this.props.onDismiss}
              dialogContentProps={{
                type: DialogType.normal,
                title: 'Change Location',
                subText: 'Select the country/province'
              }}
              modalProps={{
                isBlocking: true,
                styles: { main: { maxWidth: 550 } },
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
              <PrimaryButton onClick={() => this.props.onLocationChange(this.state.chosenLocation)} text="Save" />
            </DialogFooter>
            </Dialog>
            </>
        );
    }

    private _getAllLocations = ():KeyedCollection<ILocation> => {
        let locations = new KeyedCollection<ILocation>();
        const locData:any = this._storage.session.get(this.props.allLocationsKey);
        
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
            && d.latest > 0
            )
          {
            locations.Item(d.country_code).provinces.push(d.province);
          }
        });
        return locations;
    }
}
