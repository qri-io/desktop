import React, { useState } from 'react'
import { Action, AnyAction } from 'redux'
// import { shell, MenuItemConstructorOptions } from 'electron'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { pathToDataset } from '../../../paths'
import { QriRef } from '../../../models/qriRef'
import { Modal } from '../../../models/modals'
import { Store, MyDatasets, WorkingDataset, VersionInfo, RouteProps } from '../../../models/store'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { setFilter } from '../../../actions/myDatasets'
import { fetchMyDatasets } from '../../../actions/api'
import { setWorkingDataset } from '../../../actions/selections'
import { setModal } from '../../../actions/ui'

import VersionInfoItem from '../../item/VersionInfoItem'
import CheckboxInput from '../../form/CheckboxInput'

interface DatasetListProps extends RouteProps {
  qriRef: QriRef
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  sessionUsername: string

  setFilter: (filter: string) => Action
  setWorkingDataset: (username: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
}

export const DatasetListComponent: React.FC<DatasetListProps> = (props) => {
  const { setFilter, myDatasets, history, sessionUsername } = props
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

  const datasetItems = filteredDatasets
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
      />)
    )

  const countMessage = datasetItems.length !== datasets.length
    ? `Showing ${datasetItems.length} local dataset${datasets.length !== 1 ? 's' : ''}`
    : `You have ${datasetItems.length} local dataset${datasets.length !== 1 ? 's' : ''}`

  return (
    <div id='dataset-list'>
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
        <span>{countMessage}</span>
      </div>
      <div>
        <div>
          <button onClick={() => setOnlyMine(true)}>
            {onlyMine ? <strong>My Datasets</strong> : <span>My Datasets</span> }
          </button>
          <button onClick={() => setOnlyMine(false)}>
            {onlyMine ? <span>All Local Datasets</span> : <strong>All Local Datasets</strong> }
          </button>
        </div>
        {checkedCount > 0 &&
        <div>
          <button onClick={() => alert(`Pull Latest: ${Object.keys(checked)}`)}>Pull latest</button>
          <button onClick={() => alert(`quick export CSV: ${Object.keys(checked)}`)}>Quick Export CSV</button>
          <button onClick={() => alert(`remove: ${Object.keys(checked)}`)}>Remove</button>
        </div>}
      </div>

      <div id='list' onScroll={handleScroll}>
        <table>
          <thead>
            <tr>
              <th>
                <CheckboxInput
                  name='all'
                  checked={datasetItems.length > 0 && datasetItems.length === checkedCount }
                  onChange={(name, value) => {
                    if (checkedCount < datasetItems.length) {
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
              <th>commits</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {datasetItems.length > 0 ? datasetItems : renderNoDatasets()}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default connectComponentToPropsWithRouter(
  DatasetListComponent,
  (state: Store, ownProps: DatasetListProps) => {
    const { myDatasets, workingDataset, session } = state

    return {
      ...ownProps,
      myDatasets,
      sessionUsername: session.peername,
      workingDataset
    }
  },
  {
    setFilter,
    setWorkingDataset,
    fetchMyDatasets,
    setModal
  }
)
