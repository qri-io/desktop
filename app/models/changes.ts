import { IStatTypes, Meta, Structure } from "./dataset"
import { QriRef } from "./qriRef"
import { ComponentStatus, VersionInfo } from "./store"

export interface IChangeReportRefs {
  left: QriRef
  right: QriRef
}

export interface IChangeReport {
  meta?: IMetaDiff
  structure: IStructureDiff
  readme?: IStringDiff
  transform?: IStringDiff
  viz?: IStringDiff
  stats: IStatDiff
  versionInfo: IVersionInfoDiff
}

export interface IVersionInfoDiff {
  left: VersionInfo
  right: VersionInfo
}

export interface ISummaryStats {
  [key: string]: any
  entries: number
  columns: number
  nullValues: number
  totalSize: number
}

export interface ISummaryDiff {
  left: ISummaryStats
  right: ISummaryStats
  delta: ISummaryStats
}

export interface IAboutComponent {
  // if a component's status is "missing",
  // then the backend could not find what it was looking for
  // and there will be no content to display
  status: ComponentStatus | "missing"
}

export interface IColumnStatsChanges {
  left: IStatTypes
  right: IStatTypes
  delta: IStatTypes
  title: string
}

export interface IStatDiff {
  summary: ISummaryDiff
  columns: IColumnStatsChanges[]
  about: IAboutComponent
}

export interface IStructureDiff {
  left: Structure
  right: Structure
  name: string
  about: IAboutComponent
}

export interface IMetaDiff {
  left: Meta
  right: Meta
  name: string
  about: IAboutComponent
}

export interface IStringDiff {
  left: string
  right: string
  name: string
  about: IAboutComponent
}
