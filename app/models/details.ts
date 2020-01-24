
export enum DetailsType {
  NoDetails,
  StatsDetails
}

export interface StatsDetails {
  type: DetailsType.StatsDetails
  // eventually replace with a Stats interface
  index: number
  title: string
  stats: Record<string, any>
}

export interface NoDetails {
  type: DetailsType.NoDetails
}

export type Details = StatsDetails | NoDetails
