import * as React from 'react'
import _ from 'underscore'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { searchResultToVersionInfo } from '../../actions/mappingFuncs'
import { FetchOptions } from '../../store/api'
import { BACKEND_URL } from '../../constants'
import { VersionInfo } from '../../models/store'

import SearchBox from '../chrome/SearchBox'
import DatasetItem from '../item/DatasetItem'
import Switch from '../chrome/Switch'
import Modal from './Modal'
import Close from '../chrome/Close'

interface SearchModalProps extends RouteComponentProps {
  q: string
  onDismissed: () => void
  setWorkingDataset: (username: string, name: string) => void
}

// time in milliseconds to wait for debounce
const debounceTime = 300

const SearchModal: React.FunctionComponent<SearchModalProps> = (props) => {
  const { q, onDismissed, setWorkingDataset, history } = props
  const [local, setLocal] = React.useState(false)
  const [results, setResults] = React.useState<VersionInfo[]>([])
  const [term, setTerm] = React.useState(q)

  const search = async (): Promise<void> => {
    const options: FetchOptions = {
      method: 'GET'
    }

    const url = local ? `${BACKEND_URL}/list?term=${term}` : `${BACKEND_URL}/search?q=${term}`

    const r = await fetch(url, options)
    const res = await r.json()
    if (res.meta.code !== 200) {
      var err = { code: res.meta.code, message: res.meta.error }
      throw err // eslint-disable-line
    }

    const data = local ? res.data : res.data.map(searchResultToVersionInfo)
    setResults(data)
  }

  React.useEffect(() => {
    if (term !== '') {
      search()
    }
  }, [term, local])

  const handleOnClick = () => {
    if (local) {
      return (username: string, name: string) => {
        setWorkingDataset(username, name)
        history.push(`/workbench/${username}/${name}`)
        onDismissed()
      }
    }

    return (username: string, name: string) => {
      history.push(`/network/${username}/${name}`)
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
              _.debounce(setTerm(e.target.value), debounceTime)
            }}
            onEnter={(e) => setTerm(e.target.value)}
            value={term}
          />
          {term && <p className='response-description'>{results.length} {results.length === 1 ? 'result' : 'results'} for <i>{term}</i></p>}
        </header>
        <div className='results'>
          {term && (results.length !== 0) && results.map((result: VersionInfo, i) => <DatasetItem key={i} data={result} fullWidth onClick={handleOnClick()} />)}
          {term && !results.length && <h4 className='no-results'>No Results</h4>}
        </div>
      </div>
    </Modal>
  )
}

export default withRouter(SearchModal)
