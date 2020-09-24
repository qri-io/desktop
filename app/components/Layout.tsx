// a layout component for the resizable sidebar with main content area
import * as React from 'react'
import NavTopbar from './nav/NavTopbar'

interface LayoutProps {
  id: string
  title: string
  sidebarWidth: number
  sidebarContent: React.ReactElement
  mainContent: React.ReactElement
  headerContent?: React.ReactElement
  onSidebarResize?: (width: number) => void
  maximumSidebarWidth?: number

  /**
   * Some views may not want to display the navbar, setting `showNav` = false
   * will hide it
   * `showNav` defaults to true
   */
  showNav?: boolean
}

const Layout: React.FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const {
    id,
    title,
    mainContent,
    headerContent,
    showNav = true
  } = props

  return (
    <div id={id} className='sidebar-layout'>
      {headerContent}
      <div className='columns'>
        <div id={`${id}-main-content`} className='main-content'>
          {showNav && <NavTopbar title={title} />}
          {mainContent}
        </div>
      </div>
    </div>
  )
}

export default Layout
