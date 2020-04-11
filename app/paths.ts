import { SelectedComponent } from "./models/store"

export function pathToEditComponent (username: string, name: string, component: SelectedComponent): string {
  return `${pathToEdit(username, name)}/${component}`
}

export function pathToEdit (username: string, name: string): string {
  return `/workbench/edit/${username}/${name}`
}

// assumes path is of the format `/ipfs/Qmhash`
export function pathToHistory (username: string, name: string, path: string): string {
  if (path === '') return `/workbench/${username}/${name}`
  return `/workbench/${username}/${name}/at${path}`
}

export function pathToHistoryComponent (username: string, name: string, path: string, component: SelectedComponent): string {
  if (path === '') return pathToHistory(username, name, path)
  return `${pathToHistory(username, name, path)}/${component}`
}
