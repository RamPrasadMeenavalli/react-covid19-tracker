import { KeyedCollection } from "../../Utilities/KeyedCollection";
import { ILocation, IStatsLocation } from '../Covid19Tracker.types';

export interface IChangeLocationDialogProps{
    allLocations?:KeyedCollection<ILocation>;
    defaultValue?: IStatsLocation;
    isOpen:boolean;

    onDismiss: () => void;
    onLocationChange: (loc:IStatsLocation) => void;
}

export interface IChangeLocationDialogState{
    chosenLocation?:IStatsLocation;
}