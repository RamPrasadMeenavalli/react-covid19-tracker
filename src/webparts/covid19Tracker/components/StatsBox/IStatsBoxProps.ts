import { ILatestStats } from "../../DataModel/DataTypes";

export interface IStatsBoxProps extends ILatestStats {
    onLocationChange?:() => void;
    showChangeLocation?:boolean;
}