import { Dataset, Commit } from '../models/dataset'
import { DatasetSummary, ComponentStatus, ComponentState } from '../models/store'

export function mapDataset (data: Record<string, string>): Dataset {
  return data
}

export function mapRecord (data: any): Record<string, string> {
  return data
}

export function mapDatasetSummary (data: any[]): DatasetSummary[] {
  return data.map((ref: any) => ({
    title: (ref.dataset && ref.dataset.meta && ref.dataset.meta.title),
    peername: ref.peername,
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
      status: d.type as ComponentState
    }
  })
}

export function mapHistory (data: any[]): Commit[] {
  return data.map((ref): Commit => {
    const { author, message, timestamp, title } = ref.dataset.commit
    return {
      author,
      message,
      timestamp,
      title,
      path: ref.path
    }
  })
}
