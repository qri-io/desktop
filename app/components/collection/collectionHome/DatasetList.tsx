import React, { useState, useCallback } from 'react'
import { Action, AnyAction } from 'redux'
import classNames from "classnames"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { pathToDataset } from '../../../paths'
import { QriRef } from '../../../models/qriRef'
import { Modal, ModalType } from '../../../models/modals'
import { Store, MyDatasets, WorkingDataset, VersionInfo, RouteProps, qriRefFromVersionInfo, ToastType } from '../../../models/store'
import { onClickOpenInFinder } from '../../platformSpecific/DatasetStatus.TARGET_PLATFORM'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { setFilter } from '../../../actions/myDatasets'
import { pullDatasets, fetchMyDatasets, removeDatasetsAndFetch } from '../../../actions/api'
import { setWorkingDataset } from '../../../actions/selections'
import { setModal, openToast } from '../../../actions/ui'

import { selectSessionUsername, selectWorkingDataset } from '../../../selections'
import DatasetsTable from './DatasetsTable'

interface DatasetListProps extends RouteProps {
  qriRef: QriRef
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  sessionUsername: string
  showFSI: boolean
  setFilter: (filter: string) => Action
  setWorkingDataset: (username: string, name: string) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  pullDatasets: DatasetAction
  removeDatasetsAndFetch: DatasetAction
  setModal: (modal: Modal) => void
  openToast: (type: ToastType, name: string, message: string) => Action
}

type DatasetActionType = 'pull' | 'remove'
type DatasetAction = (refs: QriRef[]) => Promise<AnyAction>

export const DatasetListComponent: React.FC<DatasetListProps> = (props) => {
  const { showFSI, setFilter, myDatasets, history, sessionUsername, pullDatasets, removeDatasetsAndFetch, openToast, setModal } = props
  const { filter, value: datasets } = myDatasets
  const lowercasedFilterString = filter.toLowerCase()

  const [selected, setSelected] = useState([] as VersionInfo[])
  const [onlySessionUserDatasets, setOnlySessionUserDatasets] = useState(false)
  const [bulkActionExecuting, setBulkActionExecuting] = useState(false)

  const handleSetFilter = (value: string) => {
    setFilter(value)
    setSelected([])
  }

  // when a table row is clicked, navigate to dataset workbench
  const handleRowClicked = (row: VersionInfo) => {
    history.push(pathToDataset(row.username, row.name, row.path))
  }

  // keep track of selected items in state
  const handleSelectedRowsChange = useCallback(({ selectedRows }: { selectedRows: VersionInfo[] }) => {
    setSelected(selectedRows)
  }, [])

  // open FSI directory in OS
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
      return <div className='sidebar-list-item-text'>
        <span>no matches found for <strong>&apos;{myDatasets.filter}&apos;</strong></span>
      </div>
    }
    return (
      <div id='no-datasets' className='sidebar-list-item-text'>
        <span>Your datasets will be listed here</span>
      </div>
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

  const handleBulkPullSelectedDatasets = async () => {
    const refs = selected.map(qriRefFromVersionInfo)
    return handleBulkActionForDatasets('pull', 'pulling', 'pulled', pullDatasets, refs)
  }

  const handleBulkRemoveSelectedDatasets = async (keepFiles: boolean) => {
    const refs = selected.map(ds => ({ username: ds.username, name: ds.name, isLinked: !!ds.fsiPath, keepFiles }))
    return handleBulkActionForDatasets('remove', 'removing', 'removed', removeDatasetsAndFetch, refs)
  }

  const handleBulkActionForDatasets = async (actionType: DatasetActionType, actionGerund: string, actionPastTense: string, action: DatasetAction, refs: Array<{username: string, name: string, isLinked?: boolean, keepFiles?: boolean}>) => {
    setBulkActionExecuting(true)
    openToast('info', actionType, `${actionGerund} ${refs.length} ${refs.length === 1 ? 'dataset' : 'datasets'}`)
    let result: AnyAction
    try {
      result = await action(refs)
      setBulkActionExecuting(false)
      openToast('success', `${actionType}-success`, `${actionPastTense} ${refs.length} ${refs.length === 1 ? 'dataset' : 'datasets'}`)
    } catch (reason) {
      setBulkActionExecuting(false)
      openToast('error', `${actionType}-error`, `${actionGerund} datasets: ${reason}`)
      throw (reason)
    }
    return result
  }

  const openRemoveModal = () => {
    setModal(
      {
        type: ModalType.RemoveDataset,
        datasets: selected.map(ds => ({ username: ds.username, name: ds.name, fsiPath: ds.fsiPath })),
        onSubmit: handleBulkRemoveSelectedDatasets
      }
    )
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
            {selected.length === 0 && countMessage}
            {selected.length > 0 && <>
              <span>{selected.length} selected</span>
              <button disabled={bulkActionExecuting} onClick={handleBulkPullSelectedDatasets}>Pull latest</button>
              <button id="button-bulk-remove" disabled={bulkActionExecuting} onClick={openRemoveModal}>Remove</button>
            </>}
          </div>
        </div>
      </header>

      <div id='list'>
        {filteredDatasets.length === 0 && renderNoDatasets()}
        <DatasetsTable
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
    removeDatasetsAndFetch,
    openToast
  }
)
