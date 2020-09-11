// a layout component for the resizable sidebar with main content area
import * as React from 'react'

interface LayoutProps {
  id: string
  sidebarWidth: number
  sidebarContent: React.ReactElement
  mainContent: React.ReactElement
  headerContent?: React.ReactElement
}

const Layout: React.FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const {
    id,
    sidebarContent,
    sidebarWidth,
    mainContent,
    headerContent
  } = props

  return (
    <div id={id} className='sidebar-layout'>
      {headerContent}
      <div className='columns'>
        <div
          id={`${id}-sidebar`}
          style={{ width: sidebarWidth }}
        >
          {sidebarContent}
        </div>
        <div id={`${id}-main-content`} className='main-content'>
          {mainContent}
        </div>
      </div>
    </div>
  )
}

export default Layout
