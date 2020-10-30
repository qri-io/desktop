import React from 'react'
import { remote, MenuItemConstructorOptions } from 'electron'

const { Menu } = remote

export type MenuItems = MenuItemConstructorOptions

export interface Props<T> {
  menuItemsFactory: (data: T) => MenuItems[]
  data: T
  style?: any
}

/**
 * taken from dperetti's response to https://github.com/johot/react-electron-contextmenu/issues/2
 */
export class ContextMenuArea<T> extends React.Component<Props<T>> {
  private _rootElement: HTMLDivElement | null = null

  componentDidMount () {
    if (this._rootElement) {
      this._rootElement.addEventListener(
        'contextmenu',
        e => {
          e.preventDefault()
          const menu = Menu.buildFromTemplate(this.props.menuItemsFactory(this.props.data))
          menu.popup({
            window: remote.getCurrentWindow()
          })
        },
        false
      )
    }
  }

  render () {
    return (
      <div style={{ ...this.props.style }} ref={ref => (this._rootElement = ref)}>
        {this.props.children}
      </div>
    )
  }
}

export default ContextMenuArea
