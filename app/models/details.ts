import { IStatTypes } from "./dataset"

export enum DetailsType {
  NoDetails,
  StatsDetails
}

export interface StatsDetails {
  type: DetailsType.StatsDetails
  index: number
  title: string
  stats: IStatTypes
}

export interface NoDetails {
  type: DetailsType.NoDetails
}

export type Details = StatsDetails | NoDetails
