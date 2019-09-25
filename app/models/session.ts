export interface Session {
  id: string
  peername: string
  created: string
  updated: string
  type?: string
  email?: string
  name?: string
  description?: string
  homeurl?: string
  color?: string
  thumb?: string
  photo?: string
  poster?: string
  twitter?: string
  peerIDs?: string[]
  isLoading?: boolean
}
