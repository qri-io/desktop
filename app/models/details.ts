
export enum DetailsType {
  NoDetails,
  StatDetails
}

interface StatDetails {
  type: DetailsType.StatDetails
  // eventually replace with a Stats interface
  index: number
  details: Details
}

interface NoDetails {
  type: DetailsType.NoDetails
}

export type Details = StatDetails | NoDetails
