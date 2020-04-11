import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Status, SelectedComponent, ComponentStatus } from '../../models/store'
import { selectedComponentFromQriRef, QriRef, qriRefFromRoute } from '../../models/qriRef'

import { setHistoryComponent } from '../../actions/selections'

import { selectHistoryStatus, selectHistoryComponentsList } from '../../selections'

import ComponentItem from '../item/ComponentItem'
import { components as componentsInfo } from './WorkingComponentList'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { pathToHistoryComponent } from '../../paths'

interface HistoryComponentListProps extends RouteComponentProps {
  qriRef: QriRef
  components?: SelectedComponent[]
  status: Status
  selectedComponent: SelectedComponent
}

export const HistoryComponentListComponent: React.FunctionComponent<HistoryComponentListProps> = (props: HistoryComponentListProps) => {
  const {
    qriRef,
    status,
    components = [],
    selectedComponent,
    history
  } = props

  const {
    username = '',
    name: datasetName = '',
    path = ''
  } = qriRef

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
                onClick={(component: SelectedComponent) => history.push(pathToHistoryComponent(username, datasetName, path, component))}
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
    qriRef: qriRefFromRoute(ownProps),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(HistoryComponentListComponent))
