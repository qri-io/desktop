export const getActionType = (action = { type: '' }): string => {
  if (action.type.includes('REQUEST')) return 'request'
  if (action.type.includes('SUCCESS')) return 'success'
  if (action.type.includes('FAILURE')) return 'failure'
  return ''
}

export function apiActionTypes (endpoint: string): [string, string, string] {
  const name = endpoint.toUpperCase()
  return [`API_${name}_REQUEST`, `API_${name}_SUCCESS`, `API_${name}_FAILURE`]
}

export function isApiAction (endpoint: string): boolean {
  return endpoint.includes('API')
}
