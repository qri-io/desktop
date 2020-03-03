import * as React from 'react'
import { Action } from 'redux'

import { CommitDetails as ICommitDetails, ComponentType, SelectedComponent, Selections } from '../../models/Store'
import Dataset from '../../models/dataset'
import { Details } from '../../models/details'
import { ApiActionThunk } from '../../store/api'

import HistoryComponentList from '../HistoryComponentList'
import DatasetComponent from './DatasetComponent'
import Layout from '../Layout'
import CommitDetailsHeader from './CommitDetailsHeader'

export interface CommitDetailsProps {
  data: ICommitDetails
  selections: Selections
  details: Details

  fetchCommitBody: (page?: number, pageSize?: number) => ApiActionThunk
  setDetailsBar: (details: Record<string, any>) => Action
  setComponent: (type: ComponentType, activeComponent: string) => Action
  fsiWrite: (peername: string, name: string, dataset: Dataset) => ApiActionThunk
}

const CommitDetails: React.FunctionComponent<CommitDetailsProps> = (props) => {
  const {
    data,
    details,
    selections,
    setDetailsBar,
    setComponent,
    fetchCommitBody
  } = props
  // we have to guard against an odd case when we look at history
  // it is possible that we can get the history of a dataset, but
  // not have every version of that dataset in our repo
  // this will cause a specific error.
  // when we get that error, we should prompt the user to add that
  // version of the dataset.
  // for now, we will tell the user to run a command on the command line
  const { peername, name, status, components, isLoading, path, stats } = data
  const { structure, commit } = components

  const { commitComponent: selectedComponent } = selections

  const getComponents = () => {
    const components: SelectedComponent[] = []
    if (data && data.components) {
      Object.keys(data.components).forEach((component: SelectedComponent) => {
        if (component !== '' && data.components[component].value) components.push(component)
      })
    }
    return components
  }

  let dataset: Dataset = {}

  Object.keys(components).forEach((componentName: string) => {
    dataset[componentName] = components[componentName].value
  })

  const { body } = components
  const { pageInfo } = body

  const loading = !path || path !== selections.commit || isLoading

  return (
    <div id='commit-details' className='dataset-content transition-group'>
      <CommitDetailsHeader structure={structure.value} commit={data.components && commit.value}/>
      <Layout
        showNav={false}
        id={'commit-details'}
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
          <DatasetComponent
            qriRef={{}}
            data={dataset}
            peername={peername}
            name={name}
            details={details}
            setDetailsBar={setDetailsBar}
            fetchBody={fetchCommitBody}
            isLoading={loading}
            bodyPageInfo={pageInfo}
            stats={stats}
            component={selectedComponent}
            componentStatus={status[selectedComponent] || {}}
            history
          />
        )}
      />
    </div>
  )
}

export default CommitDetails
