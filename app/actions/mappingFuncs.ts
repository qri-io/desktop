import { Dataset } from '../models/dataset'
import { DatasetSummary, ComponentStatus, ComponentState, HistoryItem } from '../models/store'

export function mapDataset (data: Record<string, string>): Dataset {
  return data
}

export function mapBody (data: { data: [] }): [] {
  return data.data
}

export function mapRecord (data: any): Record<string, string> {
  return data
}

export function mapDatasetSummary (data: any[]): DatasetSummary[] {
  // {
  //   "username": "b5",
  //   "profileID": "QmSyDX5LYTiwQi861F5NAwdHrrnd1iRGsoEvCyzQMUyZ4W",
  //   "name": "airport_codes",
  //   "path": "/ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4yQdAhahHtNaMZHcw4V",
  //   "bodySize": 4584827,
  //   "bodyRows": 46235,
  //   "commitTime": "2019-03-07T14:15:42.95212Z",
  //   "numErrors": 3632
  // },
  return data.map((ref: any) => ({
    dataset: ref.dataset,
    peername: ref.username,
    name: ref.name,
    path: ref.path,
    fsiPath: ref.fsiPath,
    published: ref.published
  }))
}

export function mapStatus (data: Array<Record<string, string>>): ComponentStatus[] {
  return data.map((d) => {
    return {
      filepath: d.sourceFile,
      component: d.component,
      status: d.type as ComponentState,
      mtime: new Date(d.mtime)
    }
  })
}

export function mapHistory (data: any[]): HistoryItem[] {
  return data.map((historyItem): HistoryItem => {
    const { username, path } = historyItem.ref
    return {
      author: username,
      timestamp: historyItem.timestamp,
      title: historyItem.commitTitle,
      path: path
    }
  })
}
