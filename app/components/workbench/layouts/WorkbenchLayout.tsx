import * as React from 'react'

import Store from '../../../models/store'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { setSidebarWidth } from '../../../actions/ui'
import { selectSidebarWidth } from '../../../selections'

import WorkbenchSidebar from './WorkbenchSidebar'
import WorkbenchMainContent from './WorkbenchMainContent'
import { Resizable } from '../../Resizable'

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
  // headerContent?: React.ReactElement
}

const WorkbenchLayoutComponent: React.FunctionComponent<WorkbenchLayoutProps> = (props) => {
  const {
    id,
    mainContent,
    sidebarContent,
    // headerContent,
    activeTab,
    sidebarWidth = 0,
    onSidebarResize
  } = props

  return (
    <div id={id}>
      <Resizable
        id={`${id}-sidebar`}
        width={sidebarWidth}
        onResize={onSidebarResize}
        maximumWidth={400}
      >
        <WorkbenchSidebar activeTab={activeTab}>{sidebarContent}</WorkbenchSidebar>
      </Resizable>
      <div id={`${id}-main-content`} className='main-content'>
        <WorkbenchMainContent>{mainContent}</WorkbenchMainContent>
      </div>
    </div>
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
