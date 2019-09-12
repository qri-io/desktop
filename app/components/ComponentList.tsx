import * as React from 'react'
import { Action } from 'redux'
import path from 'path'
import classNames from 'classnames'
import { clipboard, shell, MenuItemConstructorOptions } from 'electron'
import ContextMenuArea from 'react-electron-contextmenu'
import { ApiActionThunk } from '../store/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faArchive, faTh, IconDefinition, faExclamation } from '@fortawesome/free-solid-svg-icons'

import { DatasetStatus, ComponentType } from '../models/store'

interface StatusDotProps {
  status: string | undefined
}

export const StatusDot: React.FunctionComponent<StatusDotProps> = (props) => {
  let statusColor, statusTooltip
  switch (props.status) {
    case 'modified':
      statusColor = '#cab081'
      statusTooltip = 'modified'
      break
    case 'add':
      statusColor = '#83d683'
      statusTooltip = 'added'
      break
    case 'removed':
      statusColor = '#e04f4f'
      statusTooltip = 'removed'
      break
    default:
      statusColor = 'transparent'
      statusTooltip = ''
  }
  if (props.status === 'parse error') {
    return <FontAwesomeIcon icon={faExclamation} className='parse-error' style={{ color: '#e04f4f' }} data-tip='parsing error' size='sm' />
  }
  return <div className='status-dot' style={{ backgroundColor: statusColor }} data-tip={statusTooltip}></div>
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

export const FileRow: React.FunctionComponent<FileRowProps> = (props) => (
  <div
    className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
      'selected': props.selected,
      'disabled': props.disabled
    })}
    onClick={() => {
      if (props.onClick && props.selectionType && props.name) {
        props.onClick(props.selectionType, props.name)
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
      <StatusDot status={props.status} />
    </div>
  </div>
)

FileRow.displayName = 'FileRow'

interface ComponentListProps {
  status: DatasetStatus
  selectedComponent: string
  onComponentClick: (type: ComponentType, activeTab: string) => Action
  discardChanges?: (component: ComponentType) => ApiActionThunk
  selectionType: ComponentType
  isLinked?: boolean
  linkpath?: string
}

const components = [
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
    icon: faArchive
  },
  {
    name: 'schema',
    displayName: 'Schema',
    tooltip: 'the structure of the dataset',
    icon: faTh
  }
]

export const getComponentDisplayProps = (name: string) => {
  return components.filter(d => d.name === name)[0]
}

const ComponentList: React.FunctionComponent<ComponentListProps> = (props: ComponentListProps) => {
  const {
    status,
    selectedComponent,
    onComponentClick,
    selectionType,
    isLinked,
    discardChanges,
    linkpath
  } = props

  return (
    <div>
      <div className='sidebar-list-item sidebar-list-item-text sidebar-list-header'>
          Dataset Components
      </div>
      {
        components.map(({ name, displayName, tooltip, icon }) => {
          if (status[name] && isLinked) {
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

            if (discardChanges && linkpath) {
              const menuItems: MenuItemConstructorOptions[] = [
                {
                  label: 'Open in Finder',
                  click: () => { shell.showItemInFolder(`${linkpath}/${filename}`) }
                },
                {
                  label: 'Copy File Path',
                  click: () => { clipboard.writeText(`${linkpath}/${filename}`) }
                }
              ]

              // add discard changes option of file is modified
              if (fileStatus !== 'unmodified') {
                menuItems.unshift({
                  label: 'Discard Changes...',
                  click: () => { discardChanges(name as ComponentType) }
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
              <FileRow
                key={name}
                displayName={displayName}
                name={displayName}
                icon={icon}
                disabled={true}
                tooltip={tooltip}
              />
            )
          }
        })
      }
    </div>
  )
}

export default ComponentList
