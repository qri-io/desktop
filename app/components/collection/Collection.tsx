import * as React from 'react'
import { Action, AnyAction } from 'redux'

import { MyDatasets, WorkingDataset } from '../../models/store'

import DatasetList from '../DatasetList'
import Layout from '../Layout'
import { Modal } from '../../models/modals'
import CollectionHome from './CollectionHome'

interface CollectionProps {
  sidebarWidth: number
  importFileName: string
  importFileSize: number
  myDatasets: MyDatasets
  workingDataset: WorkingDataset

  toggleCollection: () => Action
  setFilter: (filter: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void

  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
}

const Collection: React.FC<CollectionProps> = (props) => {
  const {
    myDatasets,
    workingDataset,
    sidebarWidth,
    setSidebarWidth,
    setFilter,
    setWorkingDataset,
    setModal,
    importFileName,
    importFileSize,

    openToast,
    closeToast,
    importFile
  } = props

  return (
    <Layout
      id='collection-container'
      sidebarContent={<DatasetList
        myDatasets={myDatasets}
        workingDataset={workingDataset}
        setFilter={setFilter}
        setWorkingDataset={setWorkingDataset}
        setModal={setModal}
        importFileName={importFileName}
        importFileSize={importFileSize}
      />}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={<CollectionHome importFile={importFile} openToast={openToast} closeToast={closeToast} setModal={setModal} />}
    />
  )
}

export default Collection
