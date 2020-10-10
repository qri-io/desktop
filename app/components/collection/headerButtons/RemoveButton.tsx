import * as React from 'react'
import { RouteProps } from 'react-router-dom'
//  icon: faTrash
import { QriRef, qriRefFromRoute, isDatasetSelected } from '../../../models/qriRef'
import { selectInNamespace } from '../../../selections'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface RemoveButtonProps extends RouteProps {
  qriRef: QriRef
  inNamespace: boolean
}

/**
 * If there is a dataset selected, show the `RemoveButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const RemoveButtonComponent: React.FunctionComponent<RemoveButtonProps> = (props) => {
  const {
    qriRef,
    inNamespace
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(inNamespace && datasetSelected)) {
    return null
  }
  return <div>RemoveButton</div>
}

export default connectComponentToPropsWithRouter(
  RemoveButtonComponent,
  (state: any, ownProps: RemoveButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      inNamespace: selectInNamespace(state, qriRef)
    }
  }
)
