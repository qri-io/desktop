// place to map backend errors to human readable errors
// this is basically a wishlist for what we would prefer the backend to say
const errors: {[key: string]: string} = {
  'error saving profile: handle is taken': 'This peername is already in use.'
}

export default function mapError (err: string): string {
  return errors[err] || err
}
