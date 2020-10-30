/**
 * Context menus only make sense in context of the electron app right now
 * as all the actions that one can take are dependent on the dataset being
 * either in your namespace and/or should be actions that happen only if
 * you are working locally
 */
import React from 'react'

export type MenuItems = any

export const ContextMenuArea: React.FC<any> = (props) => {
  return (
    <div style ={{ ...props.style }} >
      { props.children }
    </div>
  )
}

export default ContextMenuArea
