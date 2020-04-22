import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Status, SelectedComponent, ComponentStatus, RouteProps } from '../../models/store'
import { pathToDataset } from '../../paths'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { selectDatasetStatus, selectDatasetComponentsList } from '../../selections'

import ComponentItem from '../item/ComponentItem'
import { components as componentsInfo } from './WorkingComponentList'

interface ComponentListProps extends RouteProps {
  qriRef: QriRef
  components?: SelectedComponent[]
  status: Status
  selectedComponent: SelectedComponent
}

export const ComponentListComponent: React.FunctionComponent<ComponentListProps> = (props: ComponentListProps) => {
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
                onClick={(component: SelectedComponent) => history.push(pathToDataset(username, datasetName, path, component))}
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

const mapStateToProps = (state: any, ownProps: ComponentListProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  return {
    ...ownProps,
    qriRef,
    status: selectDatasetStatus(state),
    selectedComponent: qriRef.component,
    components: selectDatasetComponentsList(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ComponentListProps) => {
  return bindActionCreators({
  }, dispatch)
}

const mergeProps = (props: any, actions: any): ComponentListProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComponentListComponent))
