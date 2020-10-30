import React from 'react'

import ComponentItem from '../item/ComponentItem'
import { components } from './WorkingComponentList'

const DisabledComponentList: React.FunctionComponent = () => {
  return (
    <div id='disabled-component-list'>
      {components.map(({ name, displayName, tooltip, icon }) => {
        return <ComponentItem
          key={name}
          displayName={displayName}
          icon={icon}
          tooltip={tooltip}
          color='light'
          disabled
        />
      }
      )}
    </div>
  )
}

export default DisabledComponentList
