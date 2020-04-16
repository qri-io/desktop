import * as React from 'react'
import _ from 'underscore'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { BACKEND_URL } from '../../constants'
import { FetchOptions } from '../../store/api'
import { VersionInfo } from '../../models/store'
import { SearchModal } from '../../models/modals'

import { searchResultToVersionInfo } from '../../actions/mappingFuncs'
import { setWorkingDataset } from '../../actions/selections'
import { dismissModal } from '../../actions/ui'

import { selectModal } from '../../selections'

import SearchBox from '../chrome/SearchBox'
import DatasetItem from '../item/DatasetItem'
import Switch from '../chrome/Switch'
import Modal from './Modal'
import Close from '../chrome/Close'
import { pathToHistory, pathToNetworkDataset } from '../../paths'

interface SearchProps extends RouteComponentProps {
  modal: SearchModal
  onDismissed: () => void
  setWorkingDataset: (username: string, name: string) => void
}

// time in milliseconds to wait for debounce
const debounceTime = 300

const SearchComponent: React.FunctionComponent<SearchProps> = (props) => {
  const { modal, onDismissed, history } = props
  const { q } = modal
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
      return (username: string, name: string, path: string) => {
        history.push(pathToHistory(username, name, path || ''))
        onDismissed()
      }
    }

    return (username: string, name: string, path: string) => {
      history.push(pathToNetworkDataset(username, name, path))
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
              <Switch size='sm' color='dark' name='local' onClick={() => setLocal(!local)} checked={local} />
            </div>
          </div>
          <label className='window-name'>Search Qri</label>
          <SearchBox
            onChange={(e) => {
              _.debounce(setTerm(e.target.value), debounceTime)
            }}
            onEnter={(e) => setTerm(e.target.value)}
            value={term}
            id='modal-search-box'
          />
          {term && <p className='response-description'>{results.length} {results.length === 1 ? 'result' : 'results'} for <i>{term}</i></p>}
        </header>
        <div className='results'>
          {term && (results.length !== 0) && results.map((result: VersionInfo, i) => <DatasetItem key={i} id={`result-${i}`} data={result} fullWidth onClick={handleOnClick()} />)}
          {term && !results.length && <h4 className='no-results'>No Results</h4>}
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state: any, ownProps: SearchProps) => {
  return {
    modal: selectModal(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    onDismissed: dismissModal,
    setWorkingDataset
  }, dispatch)
}

const mergeProps = (props: any, actions: any): SearchProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withRouter(SearchComponent))
