import { JSONSchema7 } from 'json-schema'

// meta.citations
interface Citation {
  name: string
  URL: string
  email: string
}

// meta.contributors
interface User {
  id: string
  fullName: string
  email: string
}

interface Meta {
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
  license?: {
    type: string
    url: string
  }
  qri: string
  readmeURL?: string
  title?: string
  theme?: string[]
  version?: string
}

export interface Commit {
  author: string
  message: string
  path: string
  timestamp: Date
  title: string
}

export default interface Dataset {
  meta?: Meta
  schema?: JSONSchema7
  body?: Object | []
  commit?: Commit
}
