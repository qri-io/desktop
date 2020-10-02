import React from 'react'

const NetworkSidebar: React.FunctionComponent = (props) => {
  const { children } = props
  return (
    <div id='network-sidebar'>
      <div className='sidebar' >
        <div className='sidebar-content'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default NetworkSidebar
