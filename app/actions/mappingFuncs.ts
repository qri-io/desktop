import { Dataset } from '../models/dataset'
import { VersionInfo, ComponentStatus, ComponentState, HistoryItem } from '../models/store'
import { SearchResult } from '../models/search'

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

// versionInfoToDataset converts a detailed ref to a sparsely-populated
// dataset object without using any fetching
export function versionInfoToDataset (vi: VersionInfo): Dataset {
  const theme = (vi.themeList) ? vi.themeList.split(',', -1) : undefined

  return {
    username: vi.username,
    name: vi.name,
    path: vi.path,
    meta: {
      title: vi.commitTitle,
      description: vi.commitMessage,
      theme
    },
    structure: {
      format: 'csv',
      length: vi.bodySize,
      depth: 0,
      entries: vi.bodyRows,
      errCount: vi.numErrors
    },
    commit: {
      timestamp: vi.commitTime
    }
  }
}

// searchResultToVersionInfo converts a search result to a VersionInfo
export function searchResultToVersionInfo (s: SearchResult): VersionInfo {
  console.log(s)
  return datasetToVersionInfo(s.Value)
}

// datasetToVersionInfo converts a dataset to a versionInfo
export function datasetToVersionInfo (d: Dataset): VersionInfo {
  return {
    username: d.peername,
    name: d.name,
    path: d.path,
    metaTitle: d.meta && d.meta.title,
    themeList: d.meta && d.meta.theme && d.meta.theme.join(','),
    bodySize: d.structure && d.structure.length,
    bodyRows: d.structure && d.structure.entries,
    numErrors: d.structure && d.structure.errCount,
    commitTime: d.commit && d.commit.timestamp,
    commitTitle: d.commit && d.commit.title,
    commitMessage: d.commit && d.commit.message,
    bodyFormat: d.structure && d.structure.format,
    fsiPath: d.fsiPath
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
