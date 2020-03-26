export interface ILatestStats {
    id:string;
    displayName:string;

    totalConfirmed:number;
    totalDeaths:number;
    totalRecovered:number;
    
    prevConfirmed?:number;
    prevDeaths?:number;
}