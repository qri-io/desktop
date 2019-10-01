// place to map backend errors to human readable errors
// this is basically a wishlist for what we would prefer the backend to say
const errors: {[key: string]: string} = {
  'error saving profile: handle is taken': 'This peername is already in use.',
  'working directory is already linked, .qri-ref exists': 'This directory already contains a linked dataset.',
  // this backend error seems like a mistake
  'error resolving ref: error 404: ': 'Dataset not found.',
  'error resolving ref: p2p network responded with incomplete reference': 'Dataset not found.',
  'error resolving ref: resolving dataset ref from remote failed: repo: not found': 'Dataset not found.'
}

export default function mapError (err: string): string {
  var errMessage = err
  if (err && err.includes('@')) {
    const start = err.indexOf('@')
    const errSlice = err.slice(start)
    const end = errSlice.indexOf(' ') + start
    errMessage = err.slice(0, start) + err.slice(end)
  }
  return errors[errMessage] || errMessage
}
