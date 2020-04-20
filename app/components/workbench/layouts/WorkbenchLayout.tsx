import * as React from 'react'

import Layout from '../../Layout'
import WorkbenchSidebar from './WorkbenchSidebar'
import { selectSidebarWidth } from '../../../selections'
import Store from '../../../models/store'
import { bindActionCreators, Dispatch } from 'redux'
import { setSidebarWidth } from '../../../actions/ui'
import { connect } from 'react-redux'
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

const mapStateToProps = (state: Store, ownProps: WorkbenchLayoutProps) => {
  return {
    sidebarWidth: selectSidebarWidth(state, 'workbench'),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    onSidebarResize: (width: number) => setSidebarWidth('workbench', width)
  }, dispatch)
}

const mergeProps = (props: any, actions: any): WorkbenchLayoutProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkbenchLayoutComponent)
