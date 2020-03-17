import { KeyedCollection } from "./KeyedCollection";
import { ILocation } from "../components/Covid19Tracker.types";

export class Utilities{

    public static getAllLocations(locData:any):KeyedCollection<ILocation> {
        let locations = new KeyedCollection<ILocation>();
        
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