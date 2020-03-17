import * as React from 'react';
import { IChangeLocationDialogProps, IChangeLocationDialogState } from './ChangeLocationDialog.types';
import { Dialog, DialogType, ComboBox, IComboBoxOption, DialogFooter, PrimaryButton } from 'office-ui-fabric-react';

export default class ChangeLocationDialog extends React.Component<IChangeLocationDialogProps, IChangeLocationDialogState> {
    constructor(props:IChangeLocationDialogProps){
        super(props);
        this.state={
            chosenLocation: this.props.defaultValue,
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
                  this.props.allLocations.Values()
                  .sort((a,b)=> {return a.country>b.country?1:a.country<b.country?-1:0;})
                  .map(loc => {
                    return {
                      key: loc.countryCode,
                      text: loc.country,
                    } as IComboBoxOption;
                  })
                }
                onChange = {
                  (event, option:IComboBoxOption, idx, value) => {
                    this.setState({chosenLocation:{
                      province:this.props.allLocations.Item(option.key as string).provinces.length > 0 ?
                      this.props.allLocations.Item(option.key as string).provinces[0] : "",
                      country: option.text,
                      countryCode: option.key as string,
                    }});
                  }
                }
              />

              <ComboBox
                label="Province"
                hidden={this.props.allLocations.Item(this.state.chosenLocation.countryCode).provinces.length < 1}
                placeholder="Select Province"
                autoComplete="on"
                value={this.state.chosenLocation.province}
                selectedKey={this.state.chosenLocation.province}
                options={
                  this.props.allLocations.Item(this.state.chosenLocation.countryCode)
                  .provinces.sort().map(province => {
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
}
