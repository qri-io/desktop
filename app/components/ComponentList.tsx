import * as React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'
import { DatasetStatus, ComponentType } from '../models/store'

interface FileRowProps {
  name: string
  displayName: string
  filename?: string
  selected?: boolean
  status?: string
  selectionType?: ComponentType
  disabled?: boolean
  tooltip?: string
  onClick?: (type: ComponentType, activeTab: string) => Action
}

export const FileRow: React.FunctionComponent<FileRowProps> = (props) => {
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

  return (
    <div
      className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
        'selected': props.selected,
        'disabled': props.disabled
      })}
      data-tip={props.tooltip}
      onClick={() => {
        if (props.onClick && props.selectionType && props.name) {
          props.onClick(props.selectionType, props.name)
        }
      }}
    >
      <div className='text-column'>
        <div className='text'>{props.displayName}</div>
        <div className='subtext'>{props.filename}</div>
      </div>
      <div className='status-column'>
        <span className='dot' style={{ backgroundColor: statusColor }} data-tip={statusTooltip}></span>
      </div>
    </div>
  )
}

FileRow.displayName = 'FileRow'

interface ComponentListProps {
  status: DatasetStatus
  selectedComponent: string
  onComponentClick: (type: ComponentType, activeTab: string) => Action
  selectionType: ComponentType
  isLinked?: boolean
}

const components = [
  {
    name: 'meta',
    displayName: 'Meta',
    tooltip: 'View title, description, tags, etc'
  },
  {
    name: 'body',
    displayName: 'Body',
    tooltip: "View the dataset's content"
  },
  {
    name: 'schema',
    displayName: 'Schema',
    tooltip: 'View the structure of the dataset'
  }
]

const ComponentList: React.FunctionComponent<ComponentListProps> = (props: ComponentListProps) => {
  const {
    status,
    selectedComponent,
    onComponentClick,
    selectionType,
    isLinked
  } = props

  return (
    <div>
      <div className='sidebar-list-item sidebar-list-item-text sidebar-list-header'>
        Dataset Components
      </div>
      {
        components.map(({ name, displayName, tooltip }) => {
          if (status[name]) {
            const { filepath, status: fileStatus } = status[name]
            let filename
            if (filepath === 'repo') {
              filename = ''
            } else {
              filename = filepath.substring((filepath.lastIndexOf('/') + 1))
            }

            return (
              <FileRow
                key={name}
                displayName={displayName}
                name={name}
                filename={isLinked ? filename : ''}
                status={fileStatus}
                selected={selectedComponent === name}
                selectionType={selectionType}
                tooltip={tooltip}
                onClick={onComponentClick}
              />
            )
          } else {
            return (
              <FileRow
                key={name}
                displayName={displayName}
                name={displayName}
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
