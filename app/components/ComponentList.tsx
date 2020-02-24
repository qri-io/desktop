import * as React from 'react'
import { Action } from 'redux'
import path from 'path'
import classNames from 'classnames'
import { clipboard, shell, MenuItemConstructorOptions } from 'electron'
import ContextMenuArea from 'react-electron-contextmenu'

import { ApiActionThunk } from '../store/api'
import { checkClearToCommit } from '../utils/formValidation'
import { Status, SelectedComponent, ComponentType } from '../models/store'
import ComponentItem from './item/ComponentItem'

interface ComponentListProps {
  datasetSelected: boolean
  status: Status
  selectedComponent: string
  onComponentClick: (type: ComponentType, activeTab: string) => Action
  discardChanges?: (component: SelectedComponent) => ApiActionThunk
  selectionType: ComponentType
  fsiPath?: string
}

export const components = [
  {
    name: 'commit',
    displayName: 'Commit',
    tooltip: 'info about the latest changes to the dataset',
    icon: 'commit'
  },
  {
    name: 'readme',
    displayName: 'Readme',
    tooltip: 'a markdown file to familiarize people with the dataset',
    icon: 'readme'
  },
  {
    name: 'meta',
    displayName: 'Meta',
    tooltip: 'the dataset\'s title, description, tags, etc',
    icon: 'meta'
  },
  {
    name: 'body',
    displayName: 'Body',
    tooltip: 'the structured content of the dataset',
    icon: 'body'
  },
  {
    name: 'structure',
    displayName: 'Structure',
    tooltip: 'the structure of the dataset',
    icon: 'structure'
  },
  {
    name: 'transform',
    displayName: 'Transform',
    tooltip: 'commit automation',
    icon: 'transform'
  }
]

export const hiddenComponents = ['transform']
// removes components that don't have content on this dataset
function hiddenComponentFilter (status: Status, selectionType: ComponentType) {
  return (component): boolean => {
    // filtering all componennt, if the component name is NOT in the hidden list, we good, if it is, then it must be in the status
    return !hiddenComponents.includes(component.name) || Object.keys(status).some((statusComponentName: string) => statusComponentName === component.name)
  }
}

// returns the component display details of the given named component
export const getComponentDisplayProps = (name: string) => {
  return components.filter(d => d.name === name)[0]
}

const ComponentList: React.FunctionComponent<ComponentListProps> = (props: ComponentListProps) => {
  const {
    status,
    selectedComponent,
    onComponentClick,
    selectionType,
    discardChanges,
    fsiPath
  } = props

  const visibleComponents = components.filter(hiddenComponentFilter(status, selectionType))

  // reduce visible component statuses into boolean indicating that there are changes ready to be committed

  const clearToCommit = checkClearToCommit(status)

  return (
    <div className={classNames({ 'clear-to-commit': clearToCommit })}>
      {
        visibleComponents.map(({ name, displayName, tooltip, icon }) => {
          if (status[name]) {
            const { filepath, status: fileStatus } = status[name]

            // if filepath is the same as the component name, we are looking at a
            // a commit's component, and should not render a filename
            let filename = ''
            if (filepath !== name) {
              filename = path.basename(filepath)
            }

            const fileRow = (
              <ComponentItem
                key={name}
                displayName={displayName}
                name={name}
                icon={icon}
                filename={filename}
                status={fileStatus}
                selected={selectedComponent === name}
                selectionType={selectionType}
                tooltip={tooltip}
                onClick={onComponentClick}
                color='light'
              />
            )

            if (discardChanges && fsiPath) {
              const menuItems: MenuItemConstructorOptions[] = [
                {
                  label: 'Open in Finder',
                  click: () => { shell.showItemInFolder(`${fsiPath}/${filename}`) }
                },
                {
                  label: 'Copy File Path',
                  click: () => { clipboard.writeText(`${fsiPath}/${filename}`) }
                }
              ]

              // add discard changes option of file is modified
              if (fileStatus !== 'unmodified') {
                menuItems.unshift({
                  label: 'Discard Changes...',
                  click: () => { discardChanges(name as SelectedComponent) }
                },
                {
                  type: 'separator'
                })
              }

              return (
                <ContextMenuArea menuItems={menuItems} key={name}>
                  {fileRow}
                </ContextMenuArea>
              )
            } else {
              return fileRow
            }
          } else {
            return (
              <ComponentItem
                color='light'
                key={name}
                displayName={displayName}
                name={name}
                icon={icon}
                selected={selectedComponent === name}
                selectionType={selectionType}
                // TODO (ramfox): we should create a 'isDisabled' function and add these specifications & test
                tooltip={tooltip}
                onClick={onComponentClick}
              />
            )
          }
        })
      }
    </div>
  )
}

export default ComponentList
