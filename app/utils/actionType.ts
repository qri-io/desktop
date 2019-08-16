const getActionType = (action = { type: '' }): string => {
  if (action.type.includes('REQUEST')) return 'request'
  if (action.type.includes('SUCCESS')) return 'success'
  if (action.type.includes('FAILURE')) return 'failure'
  return ''
}

export default getActionType
