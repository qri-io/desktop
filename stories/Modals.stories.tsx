import React from 'react'

import SearchModal from '../app/components/modals/SearchModal'

export default {
  title: 'Modals',
  parameters: {
    notes: ''
  }
}

interface FetchOptions {
  method: string
  headers: Record<string, string>
  body?: string
}

async function search<T> (q: string): Promise<T> {
  const options: FetchOptions = {
    method: 'GET'
  }

  const r = await fetch(`http://localhost:2503/search?q=${q}`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as T
}

export const std = () => {
  const [state, setResults] = React.useState({ q: '', results: [] })

  const handleSearch = async function (q: string) {
    setResults({ q: q, results: state.results })
    const res = await search<any[]>(q)
    setResults({ q: q, results: res })
  }

  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <SearchModal q={state.q} onSearch={handleSearch} results={state.results} />
      </div>
    </div>
  )
}

std.story = {
  name: 'Search',
  parameters: { note: 'search results modal' }
}
