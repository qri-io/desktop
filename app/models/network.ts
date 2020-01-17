import Dataset from './dataset'

export interface NetworkHomeData {
  featured: Dataset[]
  recent: Dataset[]
}

export type P2PConnection = {
  enabled: boolean
}

export type P2PConnectionEvent = (d: P2PConnection, e: React.SyntheticEvent) => void
