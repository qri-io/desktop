import { ColumnStats } from "../components/item/StatDiffRow"
import { Meta, Structure } from "./dataset"
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
  stats: IStatDiffRes
  commit: ICommitDiff
  name: string
  username: string
}

export interface ICommitItem extends VersionInfo {
  title: string
  timestamp: Date
}

export interface ICommitDiff {
  left: ICommitItem
  right: ICommitItem
}

export interface ISummaryStats {
  [key: string]: any
  entries: number
  columns: number
  nullValues: number
  totalSize: number
  delta: ISummaryStats
}

export interface ISummaryDiff {
  left: ISummaryStats
  right: ISummaryStats
}

export interface IComponentMeta {
  status: ComponentStatus
}

export interface IStatDiffRes {
  summary: ISummaryDiff
  columns: ColumnStats[]
  meta: IComponentMeta
}

export interface IStructureDiff {
  left: Structure
  right: Structure
  name: string
  meta: IChangeReportMeta
}

export interface IMetaDiff {
  left: Meta
  right: Meta
  name: string
  meta: IChangeReportMeta
}

export interface IStringDiff {
  left: string
  right: string
  name: string
  meta: IChangeReportMeta
}

interface IChangeReportMeta {
  status: ComponentStatus
}
