import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { DisplayMode } from "@microsoft/sp-core-library";
import { KeyedCollection } from "../Utilities/KeyedCollection";

export interface ICovid19TrackerProps {
  title: string;
  updateTitle: (value: string) => void;
  themeVariant: IReadonlyTheme;
  displayMode: DisplayMode;

  apiData: any;
  defaultLocation:IStatsLocation;
}

export interface ICovid19TrackerState{
  // selected location
  location:IStatsLocation;
  // latest global stats
  latest: IStatsInfo;
  // stats for the selected location
  locationStats:IStatsInfo;

  // to show/hide the change location dialog
  showChangeDialog:boolean;
}

export interface IStatsInfo{
  confirmed: number;
  prevConfirmed?: number;

  deaths: number;
  prevDeaths?: number;

  recovered: number;
  prevRecovered?: number;

  active: number;
  prevActive?: number;

  lastUpdated?: string;
}

export interface IStatsLocation{
  country:string;
  countryCode:string;
  province?:string;
}

export interface ILocation{
  country:string;
  countryCode:string;
  provinces: Array<string>;
}