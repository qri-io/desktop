// get the Commitish from a path. Two formats expected:
// /network/QmHash
// QmHash
export const getCommitishFromPath = (path: string): string => {
  if (path.includes('/')) {
    return path.split('/')[path.split('/').length - 1].substr(0, 9)
  }
  return path.substr(0, 9)
}
