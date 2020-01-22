import * as React from 'react'
import { Action } from 'redux'

import { DatasetStatus, SelectedComponent, ComponentType } from '../models/store'
import { FileRow, components as componentsInfo } from './ComponentList'

interface HistoryComponentListProps {
  datasetSelected: boolean
  components?: string[]
  status: DatasetStatus
  selectedComponent: SelectedComponent
  onComponentClick: (type: ComponentType, activeTab: string) => Action
  selectionType: ComponentType
}

const HistoryComponentList: React.FunctionComponent<HistoryComponentListProps> = (props: HistoryComponentListProps) => {
  const {
    datasetSelected,
    status,
    components = [],
    selectedComponent,
    onComponentClick,
    selectionType
  } = props

  if (!datasetSelected) return null
  return (
    <div>
      {
        componentsInfo.map(({ name, displayName, tooltip, icon }) => {
          if (components.includes(name)) {
            var fileStatus = 'unmodified'
            if (status[name]) {
              fileStatus = status[name].status
            }

            return (
              <FileRow
                key={name}
                displayName={displayName}
                name={name}
                icon={icon}
                status={fileStatus}
                selected={selectedComponent === name}
                selectionType={selectionType}
                tooltip={tooltip}
                onClick={onComponentClick}
              />
            )
          }
          return (
            <FileRow
              key={name}
              displayName={displayName}
              name={name}
              icon={icon}
              disabled
            />
          )
        })
      }
    </div>
  )
}

export default HistoryComponentList
