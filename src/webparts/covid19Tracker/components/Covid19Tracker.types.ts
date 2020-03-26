import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { DisplayMode } from "@microsoft/sp-core-library";
import {ILatestStats} from '../DataModel/DataTypes';

export interface ICovid19TrackerProps {
  title: string;
  updateTitle: (value: string) => void;
  themeVariant: IReadonlyTheme;
  displayMode: DisplayMode;
  defaultLocation:string;
}

export interface ICovid19TrackerState{
  latest: ILatestStats,
  locStats: Array<ILatestStats>,
  showModal: boolean;
  userLoc:Array<string>,
  loading:boolean;
}