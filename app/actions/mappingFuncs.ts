import { Dataset } from '../models/dataset'
import { VersionInfo, ComponentStatus, ComponentState, HistoryItem } from '../models/store'

export function mapDataset (data: Record<string, string>): Dataset {
  return data
}

export function mapBody (data: { data: [] }): [] {
  return data.data
}

export function mapRecord (data: any): Record<string, string> {
  return data
}

export function mapVersionInfo (data: any[]): VersionInfo[] {
  return data.map((ref: any) => ref as VersionInfo)
}

// detailedDatasetRefToDataset converts a detailed ref to a sparsely-populated
// dataset object without using any fetching
export function detailedDatasetRefToDataset (ddr: VersionInfo): Dataset {
  return {
    username: ddr.username,
    name: ddr.name,
    path: ddr.path,
    meta: {
      title: ddr.metaTitle,
      theme: ddr.themeList && ddr.themeList.split(',', -1)
    },
    structure: {
      format: 'csv',
      length: ddr.bodySize,
      depth: 0,
      entries: ddr.bodyRows,
      errCount: ddr.numErrors
    },
    commit: {
      timestamp: ddr.commitTime
    }
  }
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
