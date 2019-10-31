import { PageInfo } from '../../app/models/store'

export default function bodyValue (prev: Object | any[] | undefined, curr: Object | any[], pageInfo: PageInfo): Object | any[] {
  // if there is no previous body value, just return the current body value
  if (!prev) return curr
  // work through cases where the current body value is an array
  if (Array.isArray(curr)) {
    // if the previous body value is not an array
    // just return the current body value
    if (!Array.isArray(prev)) {
      return curr
    }
    // otherwise, it is an array and we should concat the lists

    if (Array.isArray(curr[0])) {
      // for tabular/2D arrays only:
      // shim to insert a unique index as the first item in each Array (row)
      // useful for a react element key to keep track of rendered rows while we paginate
      const { page, pageSize } = pageInfo
      curr.forEach((d, i) => {
        const index = ((page - 1) * pageSize) + i
        d.unshift(index)
      })

      if (prev.length !== 0) {
        const currLastIndex = curr[curr.length - 1][0]
        const prevLastIndex = prev[prev.length - 1][0] || 0

        // user scrolled up and got an earlier page
        if (currLastIndex < prevLastIndex) {
          prev.splice(pageSize, pageSize)

          return curr.concat(prev)
        }
      }

      // check length of prev, remove 1 pageSize of rows from the beginning if greater than 2 pageSizes
      if (prev.length === (pageSize * 2)) {
        prev.splice(0, pageSize)
      }

      return prev.concat(curr)
    }

    return prev.concat(curr)
  }
  // work through cases where the current body value is an object (but not an array)
  if (typeof curr === 'object') {
    // if the previous body value is not an object (or is an object but is also an array)
    // return the current body value
    if (!(typeof prev === 'object') && Array.isArray(prev)) {
      return curr
    }
    // otherwise return the spread!
    return {
      ...prev,
      ...curr
    }
  }
  // if current body value is not an array or object
  // something went wrong, let's return an empty array
  return []
}
