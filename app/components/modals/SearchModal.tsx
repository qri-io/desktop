import * as React from 'react'

import Close from '../chrome/Close'
import SearchBox from '../chrome/SearchBox'
import Dataset from '../item/Dataset'
import { Dataset as IDataset } from '../../models/dataset'
import _ from 'underscore'
import Switch from '../chrome/Switch'
import Modal from './Modal'

interface SearchModalProps {
  q: string
  onDismissed: () => void
}

interface FetchOptions {
  method: string
  headers?: Record<string, string>
  body?: string
}

interface SearchProps {
  Type: string
  ID: string
  URL: string
  Value: IDataset
}

const SearchModal: React.FunctionComponent<SearchModalProps> = (props) => {
  const { q, onDismissed } = props
  const [local, setLocal] = React.useState(false)
  const [results, setResults] = React.useState<SearchProps[]>([])
  const [term, setTerm] = React.useState(q)

  const search = async (): Promise<void> => {
    const options: FetchOptions = {
      method: 'GET'
    }

    const url = local ? `http://localhost:2503/list?term=${term}` : `http://localhost:2503/search?q=${term}`

    const r = await fetch(url, options)
    const res = await r.json()
    if (res.meta.code !== 200) {
      var err = { code: res.meta.code, message: res.meta.error }
      throw err // eslint-disable-line
    }

    const data = local ? res.data.map((item: IDataset) => {
      return {
        Type: 'dataset',
        ID: item.path,
        URL: '',
        Value: {
          ...item.dataset,
          name: item.name
        }
      }
    }) : res.data
    setResults(data)
  }

  React.useEffect(() => {
    if (term !== '') {
      search()
    }
  }, [term, local])

  const handleOnClick = () => {
    if (local) {
      return (peername: string, name: string) => {
        alert(`navigate to /dataset/${peername}/${name}`)
        onDismissed()
      }
    }

    return (peername: string, name: string) => {
      alert(`navigate to /network/${peername}/${name}`)
      onDismissed()
    }
  }
  return (
    <Modal
      id='search'
      dismissable
      onDismissed={onDismissed}
      maxSize
    >
      <div className='search-modal'>
        <header>
          <Close right onClick={onDismissed}/>
          <div className='search-modal-switch'>
            <label className='window-name'>local only</label>
            <div>
              <Switch size='sm' color='dark' name='local' onClick={() => setLocal(!local)} />
            </div>
          </div>
          <label className='window-name'>Search Qri</label>
          <SearchBox
            onChange={(e) => {
              _.debounce(setTerm(e.target.value), 300)
            }}
            onEnter={(e) => setTerm(e.target.value)}
            value={term}
          />
          {term && <p className='response-description'>{results.length} {results.length === 1 ? 'result' : 'results'} for <i>{term}</i></p>}
        </header>
        <div className='results'>
          {term && (results.length !== 0) && results.map((result: SearchProps, i) => <Dataset key={i} data={result.Value} fullWidth onClick={handleOnClick()} />)}
          {term && !results.length && <h4 className='no-results'>No Results</h4>}
        </div>
      </div>
    </Modal>
  )
}

export default SearchModal
