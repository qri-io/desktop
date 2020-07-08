import * as React from 'react'

import Store from '../../../models/store'

import { connectComponentToProps } from '../../../utils/connectComponentToProps'

import { setSidebarWidth } from '../../../actions/ui.TARGET_PLATFORM'

import { selectSidebarWidth } from '../../../selections'

import Layout from '../../Layout'
import WorkbenchSidebar from './WorkbenchSidebar'
import WorkbenchMainContent from './WorkbenchMainContent'

interface WorkbenchLayoutProps {
  // from connect
  sidebarWidth?: number
  onSidebarResize?: (width: number) => void
  // from props
  id: string
  mainContent: React.ReactElement
  sidebarContent: React.ReactElement
  activeTab: string
  showNav?: boolean
  headerContent?: React.ReactElement
}

const WorkbenchLayoutComponent: React.FunctionComponent<WorkbenchLayoutProps> = (props) => {
  const {
    id,
    mainContent,
    sidebarContent,
    headerContent,
    showNav = true,
    activeTab,
    sidebarWidth = 0,
    onSidebarResize
  } = props

  return (
    <Layout
      id={id}
      showNav={showNav}
      sidebarWidth={sidebarWidth}
      headerContent={headerContent}
      onSidebarResize={onSidebarResize}
      mainContent={<WorkbenchMainContent>{mainContent}</WorkbenchMainContent>}
      sidebarContent={<WorkbenchSidebar activeTab={activeTab}>{sidebarContent}</WorkbenchSidebar>}
    />
  )
}

export default connectComponentToProps(
  WorkbenchLayoutComponent,
  (state: Store, ownProps: WorkbenchLayoutProps) => {
    return {
      sidebarWidth: selectSidebarWidth(state, 'workbench'),
      ...ownProps
    }
  },
  {
    onSidebarResize: (width: number) => setSidebarWidth('workbench', width)
  }
)
