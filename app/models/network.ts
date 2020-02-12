import { VersionInfo } from './store'

export interface NetworkHomeData {
  featured: VersionInfo[]
  recent: VersionInfo[]
}

export interface P2PConnection {
  enabled: boolean
}

export type P2PConnectionEvent = (d: P2PConnection, e: React.SyntheticEvent) => void
