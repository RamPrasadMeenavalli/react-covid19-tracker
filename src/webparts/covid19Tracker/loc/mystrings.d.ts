declare interface ICovid19TrackerWebPartStrings {
  showConfirmedFieldLabel:string;
  showDeathsFieldLabel:string;
  showRecoveredFieldLabel: string;
  countryFieldLabel:string;
  provinceFieldLabel:string;
}

declare module 'Covid19TrackerWebPartStrings' {
  const strings: ICovid19TrackerWebPartStrings;
  export = strings;
}
