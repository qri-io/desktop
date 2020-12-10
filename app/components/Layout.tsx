// a layout component for the resizable sidebar with main content area
import React from 'react'
import { Resizable } from './Resizable'
import NavTopbar, { NavbarButtonProps } from '../components/nav/NavTopbar'

interface LayoutProps {
  id: string
  sidebarWidth?: number
  sidebarContent?: React.ReactElement
  mainContent: React.ReactElement
  headerContent?: React.ReactElement
  topbarButtons?: NavbarButtonProps[]
  onSidebarResize?: (width: number) => void
  maximumSidebarWidth?: number
  subTitle?: string
  title?: string | React.ReactElement

  /**
   * backButtonUrl - when it exists, will override the "back" button push location
   * in the NavTopBar
   */
  backButtonUrl?: string
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
    backButtonUrl,
    sidebarContent,
    sidebarWidth,
    onSidebarResize,
    maximumSidebarWidth = 495,
    mainContent,
    headerContent,
    subTitle,
    title = '',
    topbarButtons,
    showNav = true
  } = props

  return (
    <div id={id} className='sidebar-layout'>
      {showNav && <NavTopbar
        subTitle={subTitle}
        title={title}
        buttons={topbarButtons}
        backButtonUrl={backButtonUrl}
      />}
      {headerContent}
      <div className='columns'>
        {sidebarContent && <Resizable
          id={`${id}-sidebar`}
          width={sidebarWidth}
          onResize={onSidebarResize}
          maximumWidth={maximumSidebarWidth}
        >
          {sidebarContent}
        </Resizable>}
        <div id={`${id}-main-content`} className='main-content'>
          {mainContent}
        </div>
      </div>
    </div>
  )
}

export default Layout
