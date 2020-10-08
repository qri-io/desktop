import React from 'react'
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'

import Store from '../../../models/store'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { setModal, setSidebarWidth } from '../../../actions/ui'
import {
  selectSidebarWidth,
  selectDatasetRef
} from '../../../selections'
import { Modal, ModalType } from '../../../models/modals'

import DatasetSidebar from './DatasetSidebar'
import Layout from '../../Layout'
import LinkButton from '../headerButtons/LinkButton'
import PublishButton from '../headerButtons/PublishButton'
import RenameButton from '../headerButtons/RenameButton'
import { QriRef } from '../../../models/qriRef'

interface DatasetLayoutProps {
  // from connect
  sidebarWidth?: number
  qriRef?: QriRef
  onSidebarResize?: (width: number) => void
  setModal: (modal: Modal) => void
  // from props
  id: string
  mainContent: React.ReactElement
  sidebarContent: React.ReactElement
  activeTab: string
  headerContent?: React.ReactElement
}

const DatasetLayoutComponent: React.FunctionComponent<DatasetLayoutProps> = (props) => {
  const {
    id,
    mainContent,
    headerContent,
    sidebarWidth = 0,
    qriRef = { username: '', name: '', path: '' },
    onSidebarResize,
    setModal
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
      id: 'remove-dataset',
      icon: faTrash,
      label: 'Remove',
      onClick: () => { setModal({ type: ModalType.RemoveDataset, username: qriRef.username, name: qriRef.name }) }
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

export default connectComponentToProps(
  DatasetLayoutComponent,
  (state: Store, ownProps: DatasetLayoutProps) => {
    return {
      ...ownProps,
      qriRef: selectDatasetRef(state),
      sidebarWidth: selectSidebarWidth(state, 'workbench')
    }
  },
  {
    onSidebarResize: (width: number) => setSidebarWidth('workbench', width),
    setModal
  }
)
