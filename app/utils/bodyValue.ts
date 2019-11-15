import { PageInfo } from '../../app/models/store'

export default function bodyValue (prev: Object | any[] | undefined, curr: Object | any[], pageInfo: PageInfo): Object | any[] {
  // work through cases where the current body value is an array
  if (Array.isArray(curr)) {
    if (curr.length === 0) {
      if (!prev) return curr
      return prev
    }

    if (Array.isArray(curr[0])) {
      // for tabular/2D arrays only:
      // shim to insert a unique index as the first item in each Array (row)
      // useful for a react element key to keep track of rendered rows while we paginate
      const { page, pageSize } = pageInfo

      curr.forEach((d, i) => {
        const index = ((page - 1) * pageSize) + i
        d.unshift(index)
      })

      // if there is no previous body value, just return the current body value
      if (!prev || !Array.isArray(prev)) return curr

      if (prev.length !== 0) {
        const currLastIndex = curr[curr.length - 1][0]
        const prevLastIndex = prev[prev.length - 1][0] || 0
        const prevFirstIndex = prev[0][0]

        // if the prevFirstIndex equals page size, and page is equal to 1, then
        // we have scrolled up from fetching the second page. We should therefore
        // keep the previous page
        // however, if page is 1 and the prevFirstIndex is not equal to pageSize,
        // (meaning the previous call was not to the second page, so we most
        // likely reset the pagination) we should return just the current body
        if (page === 1 && prevFirstIndex !== pageSize) {
          return curr
        }

        // user scrolled up and got an earlier page
        if (currLastIndex < prevLastIndex) {
          return [...curr, ...prev.slice(0, pageSize)]
        }
      }

      // check length of prev, remove 1 pageSize of rows from the beginning if greater than 2 pageSizes
      if (prev.length === (pageSize * 2)) {
        return [...prev.slice(pageSize, pageSize * 2), ...curr]
      }

      return [...prev, ...curr]
    }
  }
  // work through cases where the current body value is an object (but not an array)
  if (typeof curr === 'object') {
    // if the previous body value is not an object (or is an object but is also an array)
    // return the current body value
    if (!prev || (!(typeof prev === 'object') && Array.isArray(prev))) {
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
