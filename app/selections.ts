import Dataset from "./models/dataset"
import cloneDeep from 'clone-deep'

import Store, { CommitDetails, Status } from "./models/store"

export function selectDatasetFromMutations (state: Store): Dataset {
  const { mutations } = state
  const mutationsDataset = mutations.dataset.value

  const dataset = selectWorkingDataset(state)
  const d = { ...dataset, ...mutationsDataset }
  return d
}

export function selectWorkingDataset (state: Store): Dataset {
  return datasetFromCommitDetails(state.workingDataset)
}

export function selectHistoryDataset (state: Store): Dataset {
  return datasetFromCommitDetails(state.commitDetails)
}

function datasetFromCommitDetails (commitDetails: CommitDetails): Dataset {
  const { components } = commitDetails
  let d: Dataset = {}

  Object.keys(components).forEach((componentName: string) => {
    if (componentName === 'bodyPath') return
    if (components[componentName].value) {
      d[componentName] = cloneDeep(components[componentName].value)
    }
  })
  return d
}

export function selectStatusFromMutations (state: Store): Status {
  const { workingDataset, mutations } = state
  const mutationsStatus = mutations.status.value

  return { ...workingDataset.status, ...mutationsStatus }
}

export function selectWorkingStatus (state: Store): Status {
  return state.workingDataset.status
}

export function selectHistoryStatus (state: Store): Status {
  return state.commitDetails.status
}
