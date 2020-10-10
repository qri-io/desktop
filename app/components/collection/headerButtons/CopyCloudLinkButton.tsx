import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { selectIsPublished } from '../../../selections'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface CopyCloudLinkButtonProps extends RouteProps {
  qriRef: QriRef
  isPublished: boolean
}

/**
 * If there is a dataset selected and the dataset has been published, show the
 * `CopyCloudLinkButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const CopyCloudLinkButtonComponent: React.FunctionComponent<CopyCloudLinkButtonProps> = (props) => {
  const {
    qriRef,
    isPublished
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(datasetSelected && isPublished)) {
    return null
  }
  return <div>CopyCloudLinkButton</div>
}

export default connectComponentToPropsWithRouter(
  CopyCloudLinkButtonComponent,
  (state: any, ownProps: CopyCloudLinkButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      isPublished: selectIsPublished(state)
    }
  }
)
