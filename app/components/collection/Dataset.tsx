import React from 'react'

import {
  addRendererListener,
  removeRendererListener,
  openDirectory
} from './platformSpecific/Dataset.TARGET_PLATFORM'

import { Modal, ModalType } from '../../models/modals'
import Store, { RouteProps } from '../../models/Store'
import Dataset from '../../models/dataset'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { LaunchedFetchesAction } from '../../store/api'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { fetchWorkbench } from '../../actions/workbench'
import { selectDataset, selectFsiPath, selectInNamespace, selectWorkingDatasetIsPublished } from '../../selections'
import { setModal } from '../../actions/ui'

import ComponentList from './ComponentList'
import ComponentRouter from './ComponentRouter'
import DatasetHeader from './DatasetHeader'
import DatasetLayout from './layouts/DatasetLayout'
import Layout from '../Layout'
import LogList from './LogList'

export interface DatasetProps extends RouteProps {
  qriRef: QriRef
  dataset: Dataset
  isPublished: boolean
  inNamespace: boolean
  fsiPath: string
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
  setModal: (modal: Modal) => void
}

export const DatasetComponent: React.FunctionComponent<DatasetProps> = (props) => {
  const {
    qriRef,
    dataset,
    isPublished,
    fsiPath,
    inNamespace,
    fetchWorkbench,
    setModal
  } = props

  const publishUnpublishDataset = () => {
    inNamespace && isPublished
      ? setModal({
        type: ModalType.UnpublishDataset,
        username: qriRef.username,
        name: qriRef.name
      })
      : setModal({
        type: ModalType.PublishDataset,
        username: qriRef.username,
        name: qriRef.name
      })
  }

  const openWorkingDirectory = () => {
    openDirectory(fsiPath)
  }

  React.useEffect(() => {
    if (addRendererListener) {
      addRendererListener('open-working-directory', openWorkingDirectory)
      addRendererListener('publish-unpublish-dataset', publishUnpublishDataset)
    }
    return () => {
      if (removeRendererListener) {
        removeRendererListener('open-working-directory', openWorkingDirectory)
        removeRendererListener('publish-unpublish-dataset', publishUnpublishDataset)
      }
    }
  }, [])

  React.useEffect(() => {
    fetchWorkbench(qriRef)
  }, [qriRef.location])

  return (
    <DatasetLayout
      id='dataset-history'
      mainContent={
        <div className='dataset-content transition-group'>
          <Layout
            showNav={false}
            id='commit-details'
            headerContent={
              <DatasetHeader
                path={qriRef.path || ''}
                structure={dataset.structure}
                commit={dataset.commit}
              />
            }
            sidebarContent={<ComponentList qriRef={qriRef}/>}
            sidebarWidth={150}
            mainContent={<ComponentRouter qriRef={qriRef}/>}
          />
        </div>}
      sidebarContent={<LogList qriRef={qriRef}/>}
    />
  )
}

export default connectComponentToPropsWithRouter(
  DatasetComponent,
  (state: Store, ownProps: DatasetProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      dataset: selectDataset(state),
      isPublished: selectWorkingDatasetIsPublished(state),
      fsiPath: selectFsiPath(state),
      inNamespace: selectInNamespace(state, qriRef)
    }
  },
  {
    fetchWorkbench,
    setModal
  }
)
