const getActionType = (type: string): string => {
  if (type.includes('REQUEST')) return 'request'
  if (type.includes('SUCCESS')) return 'success'
  if (type.includes('FAILURE')) return 'failure'
  return 'default'
}

export default getActionType
