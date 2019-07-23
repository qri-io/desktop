class Storage {
  constructor () {
    this.store = {}
  }

  getItem (key: string) {
    return this.store[key]
  }

  setItem (key: string, value: any) {
    this.store[key] = value
  }
  removeItem (key: string) {
    delete this.store[key]
  }
  clear () {
    this.store = {}
  }
}

interface Storage {
  store: {
    [key: string]: string
  }
}

export default function store () {
  if (window.localStorage) {
    return window.localStorage
  }
  return new Storage()
}
