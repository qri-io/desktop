import React, { useState } from 'react'
import { Action, AnyAction } from 'redux'
import classNames from "classnames"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { pathToDataset } from '../../../paths'
import { QriRef } from '../../../models/qriRef'
import { Modal } from '../../../models/modals'
import { Store, MyDatasets, WorkingDataset, VersionInfo, RouteProps } from '../../../models/store'
import { onClickOpenInFinder } from '../../platformSpecific/DatasetStatus.TARGET_PLATFORM'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { setFilter } from '../../../actions/myDatasets'
import { fetchMyDatasets } from '../../../actions/api'
import { setWorkingDataset } from '../../../actions/selections'
import { setModal } from '../../../actions/ui'

import VersionInfoItem from '../../item/VersionInfoItem'
import CheckboxInput from '../../form/CheckboxInput'
import { selectSessionUsername, selectWorkingDataset } from '../../../selections'

interface DatasetListProps extends RouteProps {
  qriRef: QriRef
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  sessionUsername: string
  showFSI: boolean

  setFilter: (filter: string) => Action
  setWorkingDataset: (username: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
}

export const DatasetListComponent: React.FC<DatasetListProps> = (props) => {
  const { showFSI, setFilter, myDatasets, history, sessionUsername } = props
  const { filter, value: datasets } = myDatasets
  const lowercasedFilterString = filter.toLowerCase()

  const [checked, setChecked] = useState({})
  const [onlyMine, setOnlyMine] = useState(false)
  const checkedCount = Object.keys(checked).length

  const handleSetFilter = (value: string) => {
    setFilter(value)
    setChecked({})
  }

  const handleScroll = (e: any) => {
    // this assumes myDatasets is being called for the first time by the App component
    if (!myDatasets.pageInfo) return
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchMyDatasets(myDatasets.pageInfo.page + 1, myDatasets.pageInfo.pageSize)
    }
  }

  let handleOpenInFinder: (data: VersionInfo) => void
  if (showFSI) {
    handleOpenInFinder = (data: VersionInfo) => {
      if (data.fsiPath) {
        onClickOpenInFinder(data.fsiPath)
      }
    }
  }

  const renderNoDatasets = () => {
    if (myDatasets.value.length !== 0) {
      return <tr className='sidebar-list-item-text'>
        <td colSpan={4}>no matches found for <strong>&apos;{myDatasets.filter}&apos;</strong></td>
      </tr>
    }
    return (
      <tr id='no-datasets' className='sidebar-list-item-text'>
        <td colSpan={4}>Your datasets will be listed here</td>
      </tr>
    )
  }

  const filteredDatasets = datasets
    .filter(({ username }) => onlyMine ? (username === sessionUsername) : true)
    .filter(({ username, name, metaTitle = '' }) => {
      // if there's a non-empty filter string, only show matches on username, name, and title
      // TODO (chriswhong) replace this simple filtering with an API call for deeper matches
      if (lowercasedFilterString !== '') {
        if (username.toLowerCase().includes(lowercasedFilterString)) return true
        if (name.toLowerCase().includes(lowercasedFilterString)) return true
        if (metaTitle.toLowerCase().includes(lowercasedFilterString)) return true
        return false
      }
      return true
    })

  const countMessage = (onlyMine && filter === '')
    ? `You have ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`
    : `Showing ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`

  return (
    <div id='dataset-list'>

      <header>
        <div id='dataset-list-filter'>
          <div className='filter-input-container'>
            <input
              type='text'
              name='filter'
              placeholder='Filter datasets'
              value={filter}
              onChange={(e: React.SyntheticEvent<HTMLInputElement>) => handleSetFilter(e.target.value) }
            />
            { filter !== '' &&
              <a
                className='close'
                onClick={() => handleSetFilter('')}
                aria-label='close'
                role='button' ><FontAwesomeIcon icon={faTimes} size='lg'/>
              </a>
            }
          </div>
        </div>
        <div className='list-picker-and-bulk-actions'>
          <div className='list-picker'>
            <button className={classNames({ active: onlyMine })} onClick={() => setOnlyMine(true)}>
              My Datasets
            </button>
            <button className={classNames({ active: !onlyMine })} onClick={() => setOnlyMine(false)}>
              All Local Datasets
            </button>
          </div>
          {checkedCount > 0 &&
          <div className='bulk-actions'>
            <button onClick={() => alert(`Pull Latest: ${Object.keys(checked)}`)}>Pull latest</button>
            <button onClick={() => alert(`quick export CSV: ${Object.keys(checked)}`)}>Quick Export CSV</button>
            <button onClick={() => alert(`remove: ${Object.keys(checked)}`)}>Remove</button>
          </div>}
          <div className='count-message'>
            {countMessage}
          </div>
        </div>
      </header>

      <div id='list' onScroll={handleScroll}>
        <table>
          <thead>
            <tr>
              <th>
                <CheckboxInput
                  name='all'
                  checked={filteredDatasets.length > 0 && filteredDatasets.length === checkedCount }
                  onChange={(name, value) => {
                    if (checkedCount < filteredDatasets.length) {
                      setChecked(filteredDatasets.reduce((acc, vi) => {
                        acc[`${vi.username}/${vi.name}`] = true
                        return acc
                      }, {}))
                    } else {
                      setChecked({})
                    }
                  }}
                />
              </th>
              <th>name</th>
              <th>updated</th>
              <th>size</th>
              <th>rows</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDatasets.length === 0 && renderNoDatasets()}
            {filteredDatasets
              .map((vi: VersionInfo) => (
                <VersionInfoItem
                  data={vi}
                  key={`${vi.username}/${vi.name}`}
                  selected={!!checked[`${vi.username}/${vi.name}`]}
                  onToggleSelect={(data: VersionInfo, value: boolean) => {
                    const updated = Object.assign({}, checked)
                    if (!value) {
                      delete updated[`${vi.username}/${vi.name}`]
                    } else {
                      updated[`${vi.username}/${vi.name}`] = true
                    }
                    setChecked(updated)
                  }}
                  onClick={(data: VersionInfo) => {
                    history.push(pathToDataset(data.username, data.name, data.path))
                  }}
                  onClickFolder={handleOpenInFinder}
                />)
              )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default connectComponentToPropsWithRouter(
  DatasetListComponent,
  (state: Store, ownProps: DatasetListProps) => ({
    ...ownProps,
    myDatasets: state.myDatasets,
    sessionUsername: selectSessionUsername(state),
    setWorkingDataset: selectWorkingDataset(state)
  }),
  {
    setFilter,
    setWorkingDataset,
    fetchMyDatasets,
    setModal
  }
)
