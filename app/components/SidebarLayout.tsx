// a layout component for the resizable sidebar with main content area
import * as React from 'react'
import { Resizable } from './Resizable'

interface SidebarLayoutProps {
  id: string
  sidebarContent: any
  sidebarWidth: number
  onSidebarResize?: (width: number) => void
  maximumSidebarWidth?: number
  mainContent: any
}

const SidebarLayout: React.FunctionComponent<SidebarLayoutProps> = (props: SidebarLayoutProps) => {
  const {
    id,
    sidebarContent,
    sidebarWidth,
    onSidebarResize,
    maximumSidebarWidth = 495,
    mainContent
  } = props

  return (
    <div id={id} className='sidebar-layout'>
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
          {mainContent}
        </div>
      </div>
    </div>
  )
}

export default SidebarLayout
