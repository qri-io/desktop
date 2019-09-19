export let store: any

if (process.env.NODE_ENV === 'production') {
  store = require('./configureStore.production').default
} else {
  store = require('./configureStore.development').default
}
