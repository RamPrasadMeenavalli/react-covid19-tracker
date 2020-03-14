import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { DisplayMode } from "@microsoft/sp-core-library";
import { KeyedCollection } from "./KeyedCollection";

export interface ICovid19TrackerProps {
  title: string;
  updateTitle: (value: string) => void;
  themeVariant: IReadonlyTheme;
  displayMode: DisplayMode;

  showConfirmed: boolean;
  showDeaths: boolean;
  showRecovered: boolean;
}

export interface ICovid19TrackerState{
  location:IStatsLocation;
  latest: IStatsInfo;
  locationStats:IStatsInfo;

  showChangeDialog:boolean;
  allLocations?:KeyedCollection<ILocation>;
  chosenLocation?:IStatsLocation;
}

export interface IStatsInfo{
  confirmed: number;
  deaths: number;
  recovered: number;
  lastUpdated?: Date;
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