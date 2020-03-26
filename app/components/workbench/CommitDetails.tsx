import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'

import Store, { ComponentType, SelectedComponent, Selections, Status } from '../../models/Store'
import Dataset from '../../models/dataset'

import HistoryComponentList from '../HistoryComponentList'
import DatasetComponent from './DatasetComponent'
import Layout from '../Layout'
import CommitDetailsHeader from './CommitDetailsHeader'
import { selectHistoryDataset, selectHistoryStatus, selectHistoryDatasetPeername, selectHistoryDatasetName, selectHistoryDatasetPath } from '../../selections'
import { setSelectedListItem } from '../../actions/selections'
import { connect } from 'react-redux'

export interface CommitDetailsProps {
  dataset: Dataset
  peername: string
  name: string
  path: string
  status: Status
  selections: Selections

  setComponent: (type: ComponentType, activeComponent: string) => Action
}

export const CommitDetailsComponent: React.FunctionComponent<CommitDetailsProps> = (props) => {
  const {
    dataset,
    peername,
    name,
    path,
    status,
    selections,
    setComponent
  } = props
  const { commitComponent: selectedComponent } = selections

  const getComponents = () => {
    const components: SelectedComponent[] = []
    if (dataset) {
      Object.keys(dataset).forEach((component: SelectedComponent) => {
        if (dataset[component]) components.push(component)
      })
    }
    return components
  }

  return (
    <div className='dataset-content transition-group'>
      <Layout
        showNav={false}
        id={'commit-details'}
        headerContent={
          <CommitDetailsHeader
            path={path}
            structure={dataset.structure}
            commit={dataset.commit}
          />
        }
        sidebarContent={(
          <HistoryComponentList
            datasetSelected={peername !== '' && name !== ''}
            status={status}
            components={getComponents()}
            selectedComponent={selectedComponent}
            selectionType={'commitComponent' as ComponentType}
            onComponentClick={setComponent}
          />
        )}
        sidebarWidth={150}
        mainContent={(
          <DatasetComponent />
        )}
      />
    </div>
  )
}

const mapStateToProps = (state: Store) => {
  return {
    dataset: selectHistoryDataset(state),
    peername: selectHistoryDatasetPeername(state),
    name: selectHistoryDatasetName(state),
    path: selectHistoryDatasetPath(state),
    status: selectHistoryStatus(state),
    selections: state.selections
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setComponent: setSelectedListItem
  }, dispatch)
}

const mergeProps = (props: any, actions: any): CommitDetailsProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommitDetailsComponent)
