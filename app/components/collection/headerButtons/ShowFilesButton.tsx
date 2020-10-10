// only if checked out
import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { selectFsiPath } from '../../../selections'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface ShowFilesButtonProps extends RouteProps {
  qriRef: QriRef
  fsiPath: string
}

/**
 * If there is a dataset selected & there is an fsiPath, show the `ShowFilesButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const ShowFilesButtonComponent: React.FunctionComponent<ShowFilesButtonProps> = (props) => {
  const {
    qriRef,
    fsiPath
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(fsiPath && datasetSelected)) {
    return null
  }
  return <div>ShowFilesButton</div>
}

export default connectComponentToPropsWithRouter(
  ShowFilesButtonComponent,
  (state: any, ownProps: ShowFilesButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      fsiPath: selectFsiPath(state)
    }
  }
)
