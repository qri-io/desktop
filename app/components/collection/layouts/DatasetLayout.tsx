import React from 'react'
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { RouterProps } from 'react-router'

import Store, { VersionInfo } from '../../../models/store'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { setModal, setSidebarWidth } from '../../../actions/ui'
import {
  selectFsiPath,
  selectSidebarWidth
} from '../../../selections'
import { removeDatasetsAndFetch } from '../../../actions/api'
import { Modal, ModalType } from '../../../models/modals'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import DatasetSidebar from './DatasetSidebar'
import Layout from '../../Layout'
import LinkButton from '../headerButtons/LinkButton'
import PublishButton from '../headerButtons/PublishButton'
import RenameButton from '../headerButtons/RenameButton'
import { ApiAction } from '../../../store/api'

interface DatasetLayoutProps extends RouterProps {
  // from connect
  sidebarWidth?: number
  qriRef?: QriRef
  versionInfo?: VersionInfo
  onSidebarResize?: (width: number) => void
  setModal: (modal: Modal) => void
  // from props
  id: string
  mainContent: React.ReactElement
  sidebarContent: React.ReactElement
  activeTab: string
  headerContent?: React.ReactElement
  fsiPath: string
  removeDatasetsAndFetch: (datasets: VersionInfo[], keepFiles: boolean) => Promise<ApiAction>
}

const DatasetLayoutComponent: React.FunctionComponent<DatasetLayoutProps> = (props) => {
  const {
    id,
    mainContent,
    headerContent,
    sidebarWidth = 0,
    qriRef = { username: '', name: '', path: '' },
    onSidebarResize,
    setModal,
    removeDatasetsAndFetch,
    fsiPath
  } = props

  const buttons = [
    {
      type: 'button',
      id: 'export-dataset',
      icon: faDownload,
      label: 'Export',
      onClick: () => { setModal({ type: ModalType.ExportDataset, version: qriRef }) }
    },
    { type: 'component', component: <LinkButton key='link-button' /> },
    { type: 'component', component: <PublishButton key='publish-button' /> },
    { type: 'component', component: <RenameButton key='rename-button' /> },
    {
      type: 'button',
      id: 'remove',
      icon: faTrash,
      label: 'Remove',
      onClick: () => {
        setModal({
          type: ModalType.RemoveDataset,
          datasets: [{ ...qriRef, fsiPath }],
          onSubmit: async (keepfiles: boolean) => removeDatasetsAndFetch([{ ...qriRef, fsiPath }], keepfiles)
        })
      }
    }
  ]

  return (
    <Layout
      id={id}
      subTitle={`${qriRef.username}/`}
      title={qriRef.name}
      sidebarWidth={sidebarWidth}
      headerContent={headerContent}
      onSidebarResize={onSidebarResize}
      mainContent={mainContent}
      sidebarContent={<DatasetSidebar />}
      topbarButtons={buttons}
    />
  )
}

export default connectComponentToPropsWithRouter(
  DatasetLayoutComponent,
  (state: Store, ownProps: DatasetLayoutProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      sidebarWidth: selectSidebarWidth(state, 'workbench'),
      fsiPath: selectFsiPath(state)
    }
  },
  {
    onSidebarResize: (width: number) => setSidebarWidth('workbench', width),
    setModal,
    removeDatasetsAndFetch
  }
)
