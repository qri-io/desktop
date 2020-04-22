// a layout component for the resizable sidebar with main content area
import * as React from 'react'
import { Resizable } from './Resizable'
import Navbar from '../components/nav/Navbar'

interface LayoutProps {
  id: string
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
    sidebarContent,
    sidebarWidth,
    onSidebarResize,
    maximumSidebarWidth = 495,
    mainContent,
    headerContent,
    showNav = true
  } = props

  return (
    <div id={id} className='sidebar-layout'>
      {headerContent}
      <div className='columns'>
        <Resizable
          id={`${id}-sidebar`}
          width={sidebarWidth}
          onResize={onSidebarResize}
          maximumWidth={maximumSidebarWidth}
        >
          {sidebarContent}
        </Resizable>
        <div id={`${id}-main-content`} className='main-content'>
          {showNav && <Navbar />}
          {mainContent}
        </div>
      </div>
    </div>
  )
}

export default Layout
