import * as React from 'react'
import { RouteProps } from 'react-router-dom'
// faDownload

import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface ExportButtonProps extends RouteProps {
  qriRef: QriRef
}

/**
 *  If there is a dataset selected & we are at a particular verison, show the
 *  `ExportButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const ExportButtonComponent: React.FunctionComponent<ExportButtonProps> = (props) => {
  const {
    qriRef
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(datasetSelected && qriRef.path)) {
    return null
  }
  return <div>ExportButton</div>
}

export default connectComponentToPropsWithRouter(
  ExportButtonComponent,
  (state: any, ownProps: ExportButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef
    }
  }
)
