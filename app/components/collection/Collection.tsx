import * as React from 'react'
import { Action, AnyAction } from 'redux'

import WelcomeTemplate from '../onboard/WelcomeTemplate'
import DatasetList from '../DatasetList'
import LocalPreview from '../dataset/LocalPreview'
import Layout from '../Layout'
import { MyDatasets, WorkingDataset } from '../../models/store'
import { Modal } from '../../models/modals'
import { RouteComponentProps } from 'react-router'

interface CollectionProps extends RouteComponentProps {
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
      match,
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

    const { params } = match

    const renderMainContent = () => {
      if (params && (!params.username || !params.dataset)) {
        return (
          <div className='main-content-header'>
            <WelcomeTemplate
              title='Welcome to Qri!'
              subtitle={`drop a file to create a new dataset`}
              id='drop-file'
              loading={false}
              fullscreen={false}
            />
          </div>
        )
      }

      return <LocalPreview peername={params.username} name={params.dataset} path={params.path} />
    }

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
        mainContent={renderMainContent()}
      />
    )
  }
}

export default Collection
