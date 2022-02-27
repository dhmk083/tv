import regionsData from "pages/api/fixtures/regions.json";

type RegionsDict = typeof regionsData.regions;
export type Region = RegionsDict[keyof RegionsDict];

export const getName = (x: Region) => x.cityName || x.regionName;

export default regionsData.regions;
