import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Status, SelectedComponent, ComponentStatus } from '../../models/store'
import { selectedComponentFromQriRef, QriRef } from '../../models/qriRef'

import { setHistoryComponent } from '../../actions/selections'

import { selectHistoryStatus, selectHistoryComponentsList } from '../../selections'

import ComponentItem from '../item/ComponentItem'
import { components as componentsInfo } from './WorkingComponentList'

interface HistoryComponentListProps {
  qriRef: QriRef
  components?: SelectedComponent[]
  status: Status
  selectedComponent: SelectedComponent
  onComponentClick: (activeTab: string) => Action
}

export const HistoryComponentListComponent: React.FunctionComponent<HistoryComponentListProps> = (props: HistoryComponentListProps) => {
  const {
    status,
    components = [],
    selectedComponent,
    onComponentClick
  } = props

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
                icon={icon}
                status={fileStatus}
                selected={selectedComponent === name}
                tooltip={tooltip}
                onClick={onComponentClick}
              />
            )
          }
          return (
            <ComponentItem
              key={name}
              displayName={displayName}
              icon={icon}
              disabled
            />
          )
        })
      }
    </div>
  )
}

const mapStateToProps = (state: any, ownProps: HistoryComponentListProps) => {
  return {
    ...ownProps,
    status: selectHistoryStatus(state),
    selectedComponent: selectedComponentFromQriRef(ownProps.qriRef),
    components: selectHistoryComponentsList(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: HistoryComponentListProps) => {
  return bindActionCreators({
    onComponentClick: setHistoryComponent
  }, dispatch)
}

const mergeProps = (props: any, actions: any): HistoryComponentListProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HistoryComponentListComponent)
