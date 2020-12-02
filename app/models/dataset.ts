import { JSONSchema7 } from 'json-schema'

// meta.citations
export interface Citation {
  name: string
  url: string
  email: string
  [key: string]: any
}

// meta.contributors
export interface User {
  id: string
  name: string
  email: string
  [key: string]: any
}

export interface License {
  type: string
  url: string
}

export interface Meta {
  accessURL?: string
  accrualPeriodicity?: string
  citations?: Citation[]
  contributors?: User[]
  description?: string
  downloadURL?: string
  homeURL?: string
  identifier?: string
  keywords?: string[]
  language?: string[]
  license?: License
  readmeURL?: string
  title?: string
  theme?: string[]
  version?: string
  [key: string]: any
}

export interface Commit {
  author?: string
  message?: string
  path?: string
  timestamp?: Date
  title?: string

  count?: number // commit chain height
}

export interface CSVFormatConfig {
  headerRow: boolean
  lazyQuotes: boolean
  variadicFields: boolean
  [key: string]: any
}

export interface JSONFormatConfig {
  pretty: boolean
  [key: string]: any
}

export interface XLSXFormatConfig {
  sheetName: string
  [key: string]: any
}

export interface Structure {
  depth?: number
  entries: number
  format?: string
  length: number
  errCount: number
  formatConfig?: CSVFormatConfig | JSONFormatConfig | XLSXFormatConfig
  schema?: Schema
}

export interface ColumnProperties {
  title?: string
  type?: string | string[]
  [key: string]: any
}

export type Schema = JSONSchema7

export interface IStats {
  path: string
  stats: IStatTypes[]
}

export type IStatTypes = IBooleanStats | IStringStats | INumericStats

// boolean
export interface IBooleanStats {
  // needed so we can index into the object using a string field name
  [key: string]: any
  type: 'boolean'
  true: number
  false: number
  count: number
  delta?: IBooleanStats
}

// string
export interface IStringStats {
  // needed so we can index into the object using a string field name
  [key: string]: any
  type: 'string'
  count: number
  maxLength: number
  minLength: number
  unique: number
  frequencies: {
    [key: string]: number
  }
  delta: IStringStats
}

// numeric
export interface INumericStats {
  // needed so we can index into the object using a string field name
  [key: string]: any
  type: 'numeric'
  count: number
  max: number
  mean: number
  median: number
  min: number
  histogram: {
    bins: number[]
    frequencies: number[]
  }
  delta: INumericStats
}

export interface Dataset {
  meta?: Meta
  structure?: Structure
  body?: Body
  bodyPath?: string
  commit?: Commit
  readme?: string
  transform?: string
  stats?: IStats
  [key: string]: any
}

export type Body = Record<string, any> | any[][]

export interface DatasetAction {
  icon: string
  onClick: (e: React.MouseEvent) => void
  text: string
}

export default Dataset
