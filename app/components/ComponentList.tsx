import * as React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'
import { DatasetStatus, ComponentType } from '../models/store'

interface StatusDotProps {
  status: string | undefined
}

export const StatusDot: React.FunctionComponent<StatusDotProps> = (props) => {
  let statusColor
  switch (props.status) {
    case 'modified':
      statusColor = '#cab081'
      break
    case 'add':
      statusColor = '#83d683'
      break
    case 'removed':
      statusColor = '#e04f4f'
      break
    default:
      statusColor = 'transparent'
  }
  return (
    <div className='status-dot' style={{ backgroundColor: statusColor }}></div>
  )
}

interface FileRowProps {
  name: string
  displayName: string
  filename?: string
  selected?: boolean
  status?: string
  selectionType?: ComponentType
  disabled?: boolean
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
  selectionType: ComponentType
  isLinked?: boolean
}

const components = [
  {
    name: 'meta',
    displayName: 'Meta'
  },
  {
    name: 'body',
    displayName: 'Body'
  },
  {
    name: 'schema',
    displayName: 'Schema'
  }
]

export const getComponentDisplayName = (name: string) => {
  const match = components.find(d => d.name === name)
  return match && match.displayName
}

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
        components.map(({ name, displayName }) => {
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
              />
            )
          }
        })
      }
    </div>
  )
}

export default ComponentList
