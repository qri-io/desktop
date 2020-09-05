import React from 'react'

const WebappSidebar: React.FunctionComponent = (props) => {
  const { children } = props
  return (
    <div id='network-sidebar'>
      <div className='sidebar' >
        <div className='sidebar-header sidebar-padded-container'>
          <p className='pane-title'>Remote Webapp</p>
        </div>
        <div className='sidebar-content'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default WebappSidebar
