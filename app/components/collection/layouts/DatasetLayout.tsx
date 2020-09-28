import * as React from 'react'

import Store from '../../../models/store'

import { connectComponentToProps } from '../../../utils/connectComponentToProps'

import { setSidebarWidth } from '../../../actions/ui'

import { selectSidebarWidth } from '../../../selections'

import Layout from '../../Layout'
import DatasetSidebar from './DatasetSidebar'
import DatasetMainContent from './DatasetMainContent'

interface DatasetLayoutProps {
  // from connect
  sidebarWidth?: number
  onSidebarResize?: (width: number) => void
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
    sidebarContent,
    headerContent,
    activeTab,
    sidebarWidth = 0,
    onSidebarResize
  } = props

  return (
    <Layout
      id={id}
      showNav={true}
      title='Collection'
      sidebarWidth={sidebarWidth}
      headerContent={headerContent}
      onSidebarResize={onSidebarResize}
      mainContent={<DatasetMainContent>{mainContent}</DatasetMainContent>}
      sidebarContent={<DatasetSidebar activeTab={activeTab}>{sidebarContent}</DatasetSidebar>}
    />
  )
}

export default connectComponentToProps(
  DatasetLayoutComponent,
  (state: Store, ownProps: DatasetLayoutProps) => {
    return {
      sidebarWidth: selectSidebarWidth(state, 'workbench'),
      ...ownProps
    }
  },
  {
    onSidebarResize: (width: number) => setSidebarWidth('workbench', width)
  }
)
