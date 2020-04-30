import { ILatestStats } from "./DataTypes";
import {CacheHelper} from './CacheHelper';

export default class DataService{
    // Cache in seconds
    public static CACHE_TTL = 3600;
    public static CACE_MAX_TTL = 315569520;

    // API ENDPOINT
    public static API_GET_GLOBAL:string = "https://api.thevirustracker.com/free-api?global=stats";
    public static API_GET_COUNTRY:string = "https://api.thevirustracker.com/free-api?countryTotal=";

    // CACHE KEYS
    public static CACHE_GLOBAL = "SPFX-COVID-TRACKER-GLOBAL-V2";
    public static CACHE_COUNTRY = "SPFX-COVID-TRACKER-COUNTRY-V2";
    public static CACHE_USER_LOC = "SPFX-COVID-TRACKER-USERLOC-V2";

    public static getGlobalStats = async (forceRefresh:boolean):Promise<ILatestStats> => {
        let temp:ILatestStats = CacheHelper.get(DataService.CACHE_GLOBAL);
        if(!forceRefresh && temp != null)
        {
            return Promise.resolve(temp);
        }

        let rawData:any = await fetch(DataService.API_GET_GLOBAL, {method:"GET"})
        .then(d => d.json());
        rawData = rawData.results[0];
        temp = {
            displayName:"Global",
            id:"global",

            totalConfirmed: rawData.total_cases,
            totalDeaths: rawData.total_deaths,
            totalRecovered: rawData.total_recovered,

            prevConfirmed: rawData.total_cases - rawData.total_new_cases_today,
            prevDeaths: rawData.total_deaths - rawData.total_new_deaths_today,
        }
        // expiry set to 1 hour
        CacheHelper.set(DataService.CACHE_GLOBAL, temp, DataService.CACHE_TTL);
        return Promise.resolve(temp);
    }

    public static getCountryStats = async (forceRefresh:boolean):Promise<Array<ILatestStats>> => {
        let temp:Array<ILatestStats> = CacheHelper.get(DataService.CACHE_COUNTRY);
        if(!forceRefresh && temp != null)
        {
            console.dir(temp);
            return Promise.resolve(temp);
        }

        temp = [];
        let locs:Array<string> = await DataService.getSelectedLocations();
        if(locs && locs.length > 0)
        {
            for(var i=0; i< locs.length; i++)
            {
                let rawData:any = await fetch(`${DataService.API_GET_COUNTRY}${locs[i]}`, {method:"GET"})
                .then(d => d.json());
                
                rawData = rawData.countrydata[0];
                let _temp:ILatestStats ={
                    id: rawData.info.code,
                    displayName: rawData.info.title,
        
                    totalConfirmed: rawData.total_cases,
                    totalDeaths: rawData.total_deaths,
                    totalRecovered: rawData.total_recovered,
        
                    prevConfirmed: rawData.total_cases - rawData.total_new_cases_today,
                    prevDeaths: rawData.total_deaths - rawData.total_new_deaths_today,
                }
                temp.push(_temp);
            }
        }
        // expiry set to 1 hour
        CacheHelper.set(DataService.CACHE_COUNTRY, temp, DataService.CACHE_TTL);
        return Promise.resolve(temp);
    }

    public static getSelectedLocations = async ():Promise<Array<string>> => {
        let loc:Array<string> = CacheHelper.get(DataService.CACHE_USER_LOC);
        return loc;
    }

    public static setSelectedLocations = async (newLoc:Array<string>):Promise<void> => {
        CacheHelper.set(DataService.CACHE_USER_LOC, newLoc, DataService.CACE_MAX_TTL)
    }

    public static allLocation:Array<any> = [
        {key:'AF', title:'Afghanistan'},
        {key:'AL', title:'Albania'},
        {key:'DZ', title:'Algeria'},
        {key:'AO', title:'Angola'},
        {key:'AR', title:'Argentina'},
        {key:'AM', title:'Armenia'},
        {key:'AU', title:'Australia'},
        {key:'AT', title:'Austria'},
        {key:'AZ', title:'Azerbaijan'},
        {key:'BS', title:'Bahamas'},
        {key:'BD', title:'Bangladesh'},
        {key:'BY', title:'Belarus'},
        {key:'BE', title:'Belgium'},
        {key:'BZ', title:'Belize'},
        {key:'BJ', title:'Benin'},
        {key:'BT', title:'Bhutan'},
        {key:'BO', title:'Bolivia'},
        {key:'BA', title:'Bosnia and Herzegovina'},
        {key:'BW', title:'Botswana'},
        {key:'BR', title:'Brazil'},
        {key:'BN', title:'Brunei Darussalam'},
        {key:'BG', title:'Bulgaria'},
        {key:'BF', title:'Burkina Faso'},
        {key:'BI', title:'Burundi'},
        {key:'KH', title:'Cambodia'},
        {key:'CM', title:'Cameroon'},
        {key:'CA', title:'Canada'},
        {key:'CI', title:'Ivory Coast'},
        {key:'CF', title:'Central African Republic'},
        {key:'TD', title:'Chad'},
        {key:'CL', title:'Chile'},
        {key:'CN', title:'China'},
        {key:'CO', title:'Colombia'},
        {key:'CG', title:'Congo'},
        {key:'CD', title:'Democratic Republic of Congo'},
        {key:'CR', title:'Costa Rica'},
        {key:'HR', title:'Croatia'},
        {key:'CU', title:'Cuba'},
        {key:'CY', title:'Cyprus'},
        {key:'CZ', title:'Czechia'},
        {key:'DK', title:'Denmark'},
        {key:'DP', title:'Diamond Princess'},
        {key:'DJ', title:'Djibouti'},
        {key:'DO', title:'Dominican Republic'},
        {key:'EC', title:'Ecuador'},
        {key:'EG', title:'Egypt'},
        {key:'SV', title:'El Salvador'},
        {key:'GQ', title:'Equatorial Guinea'},
        {key:'ER', title:'Eritrea'},
        {key:'EE', title:'Estonia'},
        {key:'ET', title:'Ethiopia'},
        {key:'FK', title:'Falkland Islands'},
        {key:'FJ', title:'Fiji'},
        {key:'FI', title:'Finland'},
        {key:'FR', title:'France'},
        {key:'GF', title:'French Guiana'},
        {key:'TF', title:'French Southern Territories'},
        {key:'GA', title:'Gabon'},
        {key:'GM', title:'Gambia'},
        {key:'GE', title:'Georgia'},
        {key:'DE', title:'Germany'},
        {key:'GH', title:'Ghana'},
        {key:'GR', title:'Greece'},
        {key:'GL', title:'Greenland'},
        {key:'GT', title:'Guatemala'},
        {key:'GN', title:'Guinea'},
        {key:'GW', title:'Guinea-Bissau'},
        {key:'GY', title:'Guyana'},
        {key:'HT', title:'Haiti'},
        {key:'HN', title:'Honduras'},
        {key:'HK', title:'Hong Kong'},
        {key:'HU', title:'Hungary'},
        {key:'IS', title:'Iceland'},
        {key:'IN', title:'India'},
        {key:'ID', title:'Indonesia'},
        {key:'IR', title:'Iran'},
        {key:'IQ', title:'Iraq'},
        {key:'IE', title:'Ireland'},
        {key:'IL', title:'Israel'},
        {key:'IT', title:'Italy'},
        {key:'JM', title:'Jamaica'},
        {key:'JP', title:'Japan'},
        {key:'JO', title:'Jordan'},
        {key:'KZ', title:'Kazakhstan'},
        {key:'KE', title:'Kenya'},
        {key:'KP', title:'Korea'},
        {key:'KW', title:'Kuwait'},
        {key:'KG', title:'Kyrgyzstan'},
        {key:'LA', title:'Lao'},
        {key:'LV', title:'Latvia'},
        {key:'LB', title:'Lebanon'},
        {key:'LS', title:'Lesotho'},
        {key:'LR', title:'Liberia'},
        {key:'LY', title:'Libya'},
        {key:'LT', title:'Lithuania'},
        {key:'LU', title:'Luxembourg'},
        {key:'MK', title:'Macedonia'},
        {key:'MG', title:'Madagascar'},
        {key:'MW', title:'Malawi'},
        {key:'MY', title:'Malaysia'},
        {key:'ML', title:'Mali'},
        {key:'MR', title:'Mauritania'},
        {key:'MX', title:'Mexico'},
        {key:'MD', title:'Moldova'},
        {key:'MN', title:'Mongolia'},
        {key:'ME', title:'Montenegro'},
        {key:'MA', title:'Morocco'},
        {key:'MZ', title:'Mozambique'},
        {key:'MM', title:'Myanmar'},
        {key:'NA', title:'Namibia'},
        {key:'NP', title:'Nepal'},
        {key:'NL', title:'Netherlands'},
        {key:'NC', title:'New Caledonia'},
        {key:'NZ', title:'New Zealand'},
        {key:'NI', title:'Nicaragua'},
        {key:'NE', title:'Niger'},
        {key:'NG', title:'Nigeria'},
        {key:'NO', title:'Norway'},
        {key:'OM', title:'Oman'},
        {key:'PK', title:'Pakistan'},
        {key:'PS', title:'Palestine'},
        {key:'PA', title:'Panama'},
        {key:'PG', title:'Papua New Guinea'},
        {key:'PY', title:'Paraguay'},
        {key:'PE', title:'Peru'},
        {key:'PH', title:'Philippines'},
        {key:'PL', title:'Poland'},
        {key:'PT', title:'Portugal'},
        {key:'PR', title:'Puerto Rico'},
        {key:'QA', title:'Qatar'},
        {key:'XK', title:'Republic of Kosovo'},
        {key:'RO', title:'Romania'},
        {key:'RU', title:'Russia'},
        {key:'RW', title:'Rwanda'},
        {key:'SA', title:'Saudi Arabia'},
        {key:'SN', title:'Senegal'},
        {key:'RS', title:'Serbia'},
        {key:'SL', title:'Sierra Leone'},
        {key:'SG', title:'Singapore'},
        {key:'SK', title:'Slovakia'},
        {key:'SI', title:'Slovenia'},
        {key:'SB', title:'Solomon Islands'},
        {key:'SO', title:'Somalia'},
        {key:'ZA', title:'South Africa'},
        {key:'KR', title:'South Korea'},
        {key:'SS', title:'South Sudan'},
        {key:'ES', title:'Spain'},
        {key:'LK', title:'Sri Lanka'},
        {key:'SD', title:'Sudan'},
        {key:'SR', title:'Suriname'},
        {key:'SJ', title:'Svalbard and Jan Mayen'},
        {key:'SZ', title:'Swaziland'},
        {key:'SE', title:'Sweden'},
        {key:'CH', title:'Switzerland'},
        {key:'SY', title:'Syrian Arab Republic'},
        {key:'TW', title:'Taiwan'},
        {key:'TJ', title:'Tajikistan'},
        {key:'TZ', title:'Tanzania'},
        {key:'TH', title:'Thailand'},
        {key:'TL', title:'Timor-Leste'},
        {key:'TG', title:'Togo'},
        {key:'TT', title:'Trinidad and Tobago'},
        {key:'TN', title:'Tunisia'},
        {key:'TR', title:'Turkey'},
        {key:'TM', title:'Turkmenistan'},
        {key:'AE', title:'UAE'},
        {key:'UG', title:'Uganda'},
        {key:'GB', title:'United Kingdom'},
        {key:'UA', title:'Ukraine'},
        {key:'US', title:'USA'},
        {key:'UY', title:'Uruguay'},
        {key:'UZ', title:'Uzbekistan'},
        {key:'VU', title:'Vanuatu'},
        {key:'VE', title:'Venezuela'},
        {key:'VN', title:'Vietnam'},
        {key:'EH', title:'Western Sahara'},
        {key:'YE', title:'Yemen'},
        {key:'ZM', title:'Zambia'},
        {key:'ZW', title:'Zimbabwe'},
        
    ]
}