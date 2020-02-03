import Dataset from './dataset'

export interface SearchResult {
  Type: 'dataset' | 'user'
  ID: string
  URL: string
  Value: Dataset
}
