export default function bodyValue (prev: Object | any[] | undefined, curr: Object | any[]): Object | any[] {
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
