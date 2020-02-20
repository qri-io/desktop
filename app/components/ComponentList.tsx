import * as React from 'react'
import { Action } from 'redux'
import path from 'path'
import classNames from 'classnames'
import { clipboard, shell, MenuItemConstructorOptions } from 'electron'
import ContextMenuArea from 'react-electron-contextmenu'

import { ApiActionThunk } from '../store/api'
import { checkClearToCommit } from '../utils/formValidation'
import { DatasetStatus, SelectedComponent, ComponentType } from '../models/store'
import Spinner from './chrome/Spinner'
import ComponentItem from './item/ComponentItem'

interface ComponentListProps {
  datasetSelected: boolean
  status: DatasetStatus
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

// removes components that don't have content on this dataset
function removeHiddenComponents (status: DatasetStatus, selectionType: ComponentType) {
  const showWhenMissing = {
    'readme': 'component',
    'meta': 'component',
    'commit': true
  }
  return (component): boolean => {
    return !!status[component.name] || showWhenMissing[component.name] === selectionType || showWhenMissing[component.name] === true
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
    datasetSelected,
    fsiPath
  } = props

  // if we don't have an fsiPath (the dataset is not yet checked out) or we are
  // still waiting for status to return, display all of the possible components
  if (!fsiPath || Object.keys(status).length === 0) {
    return (
      <div>
        {components.map(({ name, displayName, tooltip, icon }) => {
          return <ComponentItem
            key={name}
            displayName={displayName}
            name={name}
            icon={icon}
            selected={false}
            disabled={true}
            tooltip={tooltip}
            onClick={undefined}
            color='light'
          />
        })}
        {
          // TODO (ramfox): need better loading indicator
          Object.keys(status).length === 0 && <Spinner white />
        }

      </div>
    )
  }

  const isEnabled = (name: string): boolean => {
    return (datasetSelected && selectionType === 'component' && (name === 'meta' || name === 'structure' || name === 'readme' || name === 'transform' || name === 'commit'))
  }

  const visibleComponents = components.filter(removeHiddenComponents(status, selectionType))

  // reduce visible component statuses into boolean indicating that there are changes ready to be committed
  const clearToCommit = checkClearToCommit(status)

  return (
    <div className={classNames({ 'clear-to-commit': clearToCommit })}>
      {
        visibleComponents.map(({ name, displayName, tooltip, icon }) => {
          if (status[name] && !!fsiPath) {
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
                disabled={!isEnabled(name)}
                tooltip={tooltip}
                // ditto, this should relate to the above
                onClick={isEnabled(name) ? onComponentClick : undefined}
              />
            )
          }
        })
      }
    </div>
  )
}

export default ComponentList
