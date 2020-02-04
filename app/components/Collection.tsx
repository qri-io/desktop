import * as React from 'react'
import { Action, AnyAction } from 'redux'

import HeaderColumnButton from './chrome/HeaderColumnButton'
import WelcomeTemplate from './onboard/WelcomeTemplate'
import DatasetList from './DatasetList'
import SidebarLayout from './SidebarLayout'
import { MyDatasets, WorkingDataset } from '../models/store'
import { Modal, ModalType } from '../models/modals'

import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons'

interface CollectionProps {
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  toggleCollection: () => Action
  setFilter: (filter: string) => Action
  sidebarWidth: number
  setWorkingDataset: (peername: string, name: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchMyDatasets: (page: number, pageSize: number) => Promise<AnyAction>
  setModal: (modal: Modal) => void
  importFileName: string
  importFileSize: number
}

class Collection extends React.Component<CollectionProps> {
  render () {
    const {
      myDatasets,
      workingDataset,
      sidebarWidth,
      setSidebarWidth,
      setFilter,
      setWorkingDataset,
      setModal,
      importFileName,
      importFileSize
    } = this.props

    const mainContent = (
      <>
        <div className='main-content-header'>
          <HeaderColumnButton
            id='create-dataset'
            icon={faPlus}
            label='Create new Dataset'
            onClick={() => { setModal({ type: ModalType.CreateDataset }) }}
          />
          <HeaderColumnButton
            icon={faDownload}
            id='add-dataset'
            label='Add existing Dataset'
            onClick={() => { setModal({ type: ModalType.AddDataset }) }}
          />
        </div>
        <div className='main-content-flex'>
          <WelcomeTemplate
            title='Welcome to Qri!'
            subtitle={`drop a file to create a new dataset`}
            id='drop-file'
            loading={false}
            fullscreen={false}
          />
        </div>
      </>
    )

    return (
      <SidebarLayout
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
        mainContent={mainContent}
      />
    )
  }
}

export default Collection
