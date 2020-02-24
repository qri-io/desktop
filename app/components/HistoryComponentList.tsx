import * as React from 'react'
import { Action } from 'redux'

import { Status, SelectedComponent, ComponentType, ComponentStatus } from '../models/store'
import { components as componentsInfo } from './ComponentList'
import ComponentItem from './item/ComponentItem'

interface HistoryComponentListProps {
  datasetSelected: boolean
  components?: string[]
  status: Status
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
            var fileStatus: ComponentStatus = 'unmodified'
            if (status[name]) {
              fileStatus = status[name].status
            }

            return (
              <ComponentItem
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
            <ComponentItem
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
