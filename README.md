# react-covid19-tracker
[![Tweet](https://img.shields.io/twitter/url?url=https://github.com/RamPrasadMeenavalli/react-covid19-tracker)](https://twitter.com/intent/tweet?text=SPFx%20COVID-19%20tracker%20webpart&url=https://github.com/RamPrasadMeenavalli/react-covid19-tracker) 
[![Github all releases](https://img.shields.io/github/downloads/RamPrasadMeenavalli/react-covid19-tracker/total.svg)](https://github.com/RamPrasadMeenavalli/react-covid19-tracker/releases/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/RamPrasadMeenavalli/react-covid19-tracker)
## Summary
This webpart shows the number of COVID-19 cases recorded from different countries on a sharepoint site. It allows the users to select their personal choice of a particular country. And shows the information for the chosen country.

Refer the [blog](https://blog.meenavalli.in/post/spfx-covid-19-tracker-webpart) for more details
##  
![covid19-tracker](/assets/screen-one.gif) 

## Data Respository
This webpart used the data repository of the 2019 Novel Coronavirus Visual Dashboard operated by the Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE).
The data is collected from WHO, Health Departments and other Government functions of different countries. More details and usage guidelines can be found on this repository - [https://github.com/CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19)

## How to use
- Download the latest app package file from the [Releases](https://github.com/RamPrasadMeenavalli/react-covid19-tracker/releases) section. 
- Add the .sppkg file to your App Catalog 
- Install the app in a SharePoint site.
- From the Webpart Toolbox search for Covid-19 Tracker webpart and add it to the page.

## Used SharePoint Framework Version 
![drop](https://img.shields.io/badge/version-1.10.0-green.svg)

## Applies to

* [SharePoint Framework](https:/dev.office.com/sharepoint)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)


## WebPart Properties
 
Property |Type|Default| Comments
--------------------|----|--------|----------
Default Country | Dropdown |  | The default country to be shown
Default Province | Dropdown |   | The default province to be shown
## Solution
This Web Part uses PnPjs library, Office-UI-Fabric-react components and [coronavirus-tracker-api](https://github.com/ExpDev07/coronavirus-tracker-api) which is a wrapper on top of [Johns Hopkins CSSE data respository](https://github.com/CSSEGISandData/COVID-19)

Solution|Author
--------|---------
react-covid-19-tracker|[Ram](https://twitter.com/ram_meenavalli) [![Twitter](https://img.shields.io/twitter/follow/ram_meenavalli.svg?style=social&label=@ram_meenavalli)](https://twitter.com/ram_meenavalli)

## Version history

Version|Date|Comments
-------|----|--------
1.0.0.0|March 15, 2020|Initial release
1.0.0.1|March 17, 2020|Added property to select default Country/Province. Changed the display format for the stats.

## Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Run the following in the command window:
  - `npm install`
  - `gulp build`
  - `gulp bundle --ship`
  - `gulp package-solution --ship`
