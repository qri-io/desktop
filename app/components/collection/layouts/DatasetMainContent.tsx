import * as React from 'react'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { RouteProps } from '../../../models/store'
import { ApiActionThunk } from '../../../store/api'
import { fetchWorkingDatasetDetails } from '../../../actions/api'
import { selectFsiPath, selectMutationsIsDirty } from '../../../selections'

interface DatasetMainContentProps extends RouteProps {
  qriRef: QriRef
  modified: boolean
  fsiPath: string
  fetchWorkingDatasetDetails: (username: string, name: string) => ApiActionThunk
}

const DatasetMainContentComponent: React.FunctionComponent<DatasetMainContentProps> = (props) => {
  const { children } = props
  return (
    <>
      {children}
    </>
  )
}

export default connectComponentToPropsWithRouter(
  DatasetMainContentComponent,
  (state: any, ownProps: DatasetMainContentProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      fsiPath: selectFsiPath(state),
      modified: selectMutationsIsDirty(state)
    }
  },
  {
    fetchWorkingDatasetDetails
  }
)
