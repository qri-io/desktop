import React from 'react'
import { RouterProps } from 'react-router'

import Store from '../../../models/store'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { setSidebarWidth } from '../../../actions/ui'
import {
  selectSidebarWidth
} from '../../../selections'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import DatasetSidebar from './DatasetSidebar'
import Layout from '../../Layout'
import CheckoutButton from '../headerButtons/CheckoutButton'
import PublishButton from '../headerButtons/PublishButton'
import RenameButton from '../headerButtons/RenameButton'
import ViewInCloudButton from '../headerButtons/ViewInCloudButton'
import ShowFilesButton from '../headerButtons/ShowFilesButton'
import ExportButton from '../headerButtons/ExportButton'
import UnpublishButton from '../headerButtons/UnpublishButton'
import CopyCloudLinkButton from '../headerButtons/CopyCloudLinkButton'
import RemoveButton from '../headerButtons/RemoveButton'
import { NavbarButtonProps } from '../../nav/NavTopbar'
import ViewChangesButton from '../headerButtons/ViewChangesButton'

interface DatasetLayoutProps extends RouterProps {
  // from connect
  sidebarWidth?: number
  qriRef?: QriRef
  onSidebarResize?: (width: number) => void
  // from props
  id: string
  mainContent: React.ReactElement
  sidebarContent: React.ReactElement
  headerContent?: React.ReactElement
}

const DatasetLayoutComponent: React.FunctionComponent<DatasetLayoutProps> = (props) => {
  const {
    id,
    mainContent,
    headerContent,
    sidebarWidth = 0,
    qriRef = { username: '', name: '', path: '' },
    onSidebarResize
  } = props

  let buttons: NavbarButtonProps[]

  if (__BUILD__.REMOTE) {
    buttons = [
      {
        type: 'component',
        component: <ExportButton key='export-button' />
      },
      {
        type: 'component',
        component: <ViewChangesButton key='view-changes' />
      }
    ]
  } else {
    buttons = [
      {
        type: 'component',
        component: <ExportButton key='export-button' />
      },
      {
        type: 'component',
        component: <CheckoutButton key='checkout-button'/>
      },
      {
        type: 'component',
        component: <ShowFilesButton key='show-files-button'/>
      },
      {
        type: 'component',
        component: <PublishButton key='publish-button' />
      },
      {
        type: 'component',
        component: <ViewInCloudButton key='view-in-cloud-button'/>
      },
      {
        type: 'component',
        component: <ViewChangesButton key='view-changes' />
      },
      {
        type: 'button-dropdown',
        dropdownItems: [
          <RenameButton key='rename-button' />,
          <UnpublishButton key='unpublish-button' />,
          <CopyCloudLinkButton key='copy-cloud-link-button' />,
          <RemoveButton key='remove-button' />
        ]
      }
    ]
  }

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
      sidebarWidth: selectSidebarWidth(state, 'workbench')
    }
  },
  {
    onSidebarResize: (width: number) => setSidebarWidth('workbench', width)
  }
)
