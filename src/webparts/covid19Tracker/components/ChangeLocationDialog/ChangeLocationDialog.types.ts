import { KeyedCollection } from "../KeyedCollection";
import { ILocation, IStatsLocation } from '../Covid19Tracker.types';

export interface IChangeLocationDialogProps{
    allLocationsKey: string;
    defaultValue?: IStatsLocation;
    isOpen:boolean;

    onDismiss: () => void;
    onLocationChange: (loc:IStatsLocation) => void;
}

export interface IChangeLocationDialogState{
    allLocations?:KeyedCollection<ILocation>;
    chosenLocation?:IStatsLocation;
}