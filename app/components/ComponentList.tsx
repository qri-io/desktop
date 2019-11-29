import * as React from 'react'
import { Action } from 'redux'
import path from 'path'
import classNames from 'classnames'
import { clipboard, shell, MenuItemConstructorOptions } from 'electron'
import ContextMenuArea from 'react-electron-contextmenu'
import { ApiActionThunk } from '../store/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTags,
  faUniversity,
  faTh,
  IconDefinition,
  faExclamation,
  faRobot,
  faGlasses,
  faSave,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

import { checkClearToCommit } from '../utils/formValidation'
import { DatasetStatus, SelectedComponent, ComponentType } from '../models/store'

interface StatusDotProps {
  status: string | undefined
}

export const StatusDot: React.FunctionComponent<StatusDotProps> = (props) => {
  let statusTooltip
  switch (props.status) {
    case 'modified':
      statusTooltip = 'modified'
      break
    case 'add':
      statusTooltip = 'added'
      break
    case 'removed':
      statusTooltip = 'removed'
      break
    default:
      statusTooltip = ''
  }
  if (props.status === 'parse error') {
    return <FontAwesomeIcon icon={faExclamation} className='parse-error' style={{ color: '#e04f4f' }} data-tip='Parsing Error' size='sm' />
  }
  return <div className={classNames('status-dot', { 'status-dot-modified': statusTooltip === 'modified', 'status-dot-removed': statusTooltip === 'removed', 'status-dot-added': statusTooltip === 'added', 'status-dot-transparent': statusTooltip === '' })} data-tip={statusTooltip}></div>
}

interface FileRowProps {
  name: string
  displayName: string
  icon?: IconDefinition
  filename?: string
  selected?: boolean
  status?: string
  selectionType?: ComponentType
  disabled?: boolean
  tooltip?: string
  onClick?: (type: ComponentType, activeTab: string) => Action
}

export const FileRow: React.FunctionComponent<FileRowProps> = (props) => {
  let statusIcon = <StatusDot status={props.status} />

  if (props.name === 'commit') {
    statusIcon = <FontAwesomeIcon icon={faArrowRight} style={{ color: '#FFF' }} size='lg' />
  }

  return (
    <div
      id={`${props.displayName.toLowerCase()}_status`}
      className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
        'selected': props.selected,
        'disabled': props.disabled
      })}
      onClick={() => {
        if (props.onClick && props.selectionType && props.name) {
          props.onClick(props.selectionType, props.name.toLowerCase())
        }
      }}
    >
      {props.icon && (<div className='icon-column'>
        <FontAwesomeIcon icon={props.icon} size='sm'/>
      </div>)}
      <div className='text-column'>
        <div className='text'>{props.displayName}</div>
        <div className='subtext'>{props.filename}</div>
      </div>
      <div className='status-column'>
        {statusIcon}
      </div>
    </div>
  )
}

FileRow.displayName = 'FileRow'

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
    icon: faSave
  },
  {
    name: 'readme',
    displayName: 'Readme',
    tooltip: 'a markdown file to familiarize people with the dataset',
    icon: faGlasses
  },
  {
    name: 'meta',
    displayName: 'Meta',
    tooltip: 'the dataset\'s title, description, tags, etc',
    icon: faTags
  },
  {
    name: 'body',
    displayName: 'Body',
    tooltip: 'the structured content of the dataset',
    icon: faTh
  },
  {
    name: 'structure',
    displayName: 'Structure',
    tooltip: 'the structure of the dataset',
    icon: faUniversity
  },
  {
    name: 'transform',
    displayName: 'Transform',
    tooltip: 'commit automation',
    icon: faRobot
  }
]

function removeHiddenComponents (status: DatasetStatus, selectionType: ComponentType) {
  const showWhenMissing = {
    'readme': 'component',
    'commit': true
  }
  return (component): boolean => {
    return !!status[component.name] || showWhenMissing[component.name] === selectionType || showWhenMissing[component.name] === true
  }
}

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

  const isEnabled = (name: string): boolean => {
    return (datasetSelected && selectionType === 'component' &&
      components.map(d => d.name).includes(name)
    )
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
              <FileRow
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
            // if (name === 'commit' && selectionType === 'commitComponent') return null

            return (
              <FileRow
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
