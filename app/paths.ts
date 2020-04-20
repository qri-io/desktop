import { SelectedComponent } from "./models/store"

export function pathToEdit (username: string, name: string, component?: SelectedComponent): string {
  let uri = `/workbench/edit/${username}/${name}`
  if (!component || component === '') {
    return uri
  }
  return uri + `/${component}`
}

// assumes path is of the format `/ipfs/Qmhash`
export function pathToHistory (username: string, name: string, path: string, component?: SelectedComponent): string {
  let uri = `/workbench/${username}/${name}`
  if (path === '') {
    return uri
  }
  uri += `/at${path}`
  if (!component || component === '') {
    return uri
  }

  return uri + `/${component}`
}

export function pathToNoDatasetSelected (): string {
  return `/workbench`
}

export function pathToCollection (): string {
  return `/collection`
}

export function pathToNetworkDataset (username: string, name: string, path?: string): string {
  let uri = `/network/${username}/${name}`
  if (path && path !== '') {
    uri += `/at${path}`
  }
  return uri
}

export function isEditPath (path: string): boolean {
  return path.includes('/edit')
}
