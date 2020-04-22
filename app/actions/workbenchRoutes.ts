import { QriRef } from '../models/qriRef'

import {
  WORKBENCH_ROUTES_HISTORY_REF,
  WORKBENCH_ROUTES_EDIT_REF
} from '../reducers/workbenchRoutes'

export const setRecentDatasetRef = (qriRef: QriRef) => {
  return {
    type: WORKBENCH_ROUTES_HISTORY_REF,
    qriRef
  }
}

export const setRecentEditRef = (qriRef: QriRef) => {
  return {
    type: WORKBENCH_ROUTES_EDIT_REF,
    qriRef
  }
}
