export function apiActionTypes (endpoint: string): [string, string, string] {
  const name = endpoint.toUpperCase()
  return [`API_${name}_REQUEST`, `API_${name}_SUCCESS`, `API_${name}_FAILURE`]
}

export const getActionType = (action = { type: '' }): string => {
  if (action.type.endsWith('REQUEST')) return 'request'
  if (action.type.endsWith('SUCCESS')) return 'success'
  if (action.type.endsWith('FAILURE')) return 'failure'
  return ''
}

export function isApiAction (action = { type: '' }): boolean {
  return !!action.type && action.type.startsWith('API')
}
