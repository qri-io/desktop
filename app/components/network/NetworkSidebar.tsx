import React from 'react'

const NetworkSidebar: React.FC<void> = (props) => {
  const { children } = props
  return (
    <div id='network-sidebar'>
      <div className='sidebar' >
        <div className='sidebar-header sidebar-padded-container'>
          <p className='pane-title'>Network</p>
        </div>
        <div className='sidebar-content'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default NetworkSidebar
