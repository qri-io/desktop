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
  timestamp: Date
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

export type Schema = JSONSchema7

export interface Dataset {
  meta?: Meta
  structure?: Structure
  body?: Body
  commit?: Commit
  [key: string]: any
}

export type Body = Record<string, any> | any[][]

export default Dataset
