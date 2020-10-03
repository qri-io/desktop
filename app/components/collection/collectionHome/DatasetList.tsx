import React, { useState } from 'react'
import { Action, AnyAction } from 'redux'
import classNames from "classnames"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { pathToDataset } from '../../../paths'
import { QriRef } from '../../../models/qriRef'
import { Modal } from '../../../models/modals'
import { Store, MyDatasets, WorkingDataset, VersionInfo, RouteProps, qriRefFromVersionInfo, ToastType } from '../../../models/store'
import { onClickOpenInFinder } from '../../platformSpecific/DatasetStatus.TARGET_PLATFORM'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { setFilter } from '../../../actions/myDatasets'
import { pullDatasets, fetchMyDatasets } from '../../../actions/api'
import { setWorkingDataset } from '../../../actions/selections'
import { setModal, openToast } from '../../../actions/ui'

import { selectSessionUsername, selectWorkingDataset } from '../../../selections'
import DataTable from './DataTable'

interface DatasetListProps extends RouteProps {
  qriRef: QriRef
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  sessionUsername: string
  showFSI: boolean
  setFilter: (filter: string) => Action
  setWorkingDataset: (username: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  pullDatasets: (refs: QriRef[]) => Promise<AnyAction>
  setModal: (modal: Modal) => void
  openToast: (type: ToastType, name: string, message: string) => Action
}

const initialChecked: Record<string, boolean> = {}

export const DatasetListComponent: React.FC<DatasetListProps> = (props) => {
  const { showFSI, setFilter, myDatasets, history, sessionUsername, pullDatasets, openToast } = props
  const { filter, value: datasets } = myDatasets
  const lowercasedFilterString = filter.toLowerCase()

  const [checked, setChecked] = useState(initialChecked)
  const [onlySessionUserDatasets, setOnlySessionUserDatasets] = useState(false)
  const checkedCount = Object.keys(checked).length
  const [bulkActionExecuting, setBulkActionExecuting] = useState(false)

  const handleSetFilter = (value: string) => {
    setFilter(value)
    setChecked({})
  }

  const handlePullSelectedDatasets = () => {
    const refs = filteredDatasets
      .filter((vi) => checked[`${vi.username}/${vi.name}`])
      .map(qriRefFromVersionInfo)

    setBulkActionExecuting(true)
    openToast('info', 'pull', `pulling ${refs.length} ${refs.length === 1 ? 'dataset' : 'datasets'}`)
    pullDatasets(refs)
      .then(() => {
        setBulkActionExecuting(false)
        openToast('success', 'pull-success', `pulled ${refs.length} ${refs.length === 1 ? 'dataset' : 'datasets'}`)
      })
      .catch((reason) => {
        setBulkActionExecuting(false)
        openToast('error', 'pull-error', `pulling datasets: ${reason}`)
      })
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
    .filter(({ username }) => onlySessionUserDatasets ? (username === sessionUsername) : true)
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
    .map((d) => ({
      id: `${d.username}-${d.name}`, // used by react-data-table-component to give each row a unique id
      ...d
    }))

  const countMessage = (onlySessionUserDatasets && filter === '')
    ? `You have ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`
    : `Showing ${filteredDatasets.length} local dataset${filteredDatasets.length !== 1 ? 's' : ''}`

  // when a table row is clicked, navigate to dataset workbench
  const handleRowClicked = (row: VersionInfo) => {
    history.push(pathToDataset(row.username, row.name, row.path))
  }

  // keep track of selected items in state
  const handleSelectedRowsChange = ({ selectedRows }: { selectedRows: VersionInfo[] }) => {
    setChecked(selectedRows.reduce((acc: any, vi: VersionInfo) => {
      acc[`${vi.username}/${vi.name}`] = true
      return acc
    }, {}))
  }

  // open FSI directory in OS
  let handleOpenInFinder: (data: VersionInfo) => void
  if (showFSI) {
    handleOpenInFinder = (data: VersionInfo) => {
      if (data.fsiPath) {
        onClickOpenInFinder(data.fsiPath)
      }
    }
  }

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
            <button className={classNames({ active: onlySessionUserDatasets })} onClick={() => setOnlySessionUserDatasets(true)}>
              My Datasets <span className='count-indicator'>{datasets.filter(({ username }) => (username === sessionUsername)).length}</span>
            </button>
            <button className={classNames({ active: !onlySessionUserDatasets })} onClick={() => setOnlySessionUserDatasets(false)}>
              All Datasets <span className='count-indicator'>{datasets.length}</span>
            </button>
          </div>
          <div className='bulk-actions'>
            {checkedCount === 0 && countMessage}
            {checkedCount > 0 && <>
              <span>{checkedCount} selected</span>
              <button disabled={bulkActionExecuting} onClick={handlePullSelectedDatasets}>Pull latest</button>
              <button disabled={bulkActionExecuting} onClick={() => alert(`quick export CSV: ${Object.keys(checked)}`)}>Quick Export CSV</button>
              <button disabled={bulkActionExecuting} onClick={() => alert(`remove: ${Object.keys(checked)}`)}>Remove</button>
            </>}
          </div>
        </div>
      </header>

      <div id='list'>
        {filteredDatasets.length === 0 && renderNoDatasets()}
        <DataTable
          filteredDatasets={filteredDatasets}
          onRowClicked={handleRowClicked}
          onSelectedRowsChange={handleSelectedRowsChange}
          onOpenInFinder={handleOpenInFinder}
        />
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
    setModal,
    pullDatasets,
    openToast
  }
)
