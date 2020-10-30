import React from 'react'
import { faCloud } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { QRI_CLOUD_URL } from '../../../constants'

import { openInExternalWindow } from './platformSpecific/ButtonActions.TARGET_PLATFORM'

import { selectIsPublished } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface ViewInCloudButtonProps extends RouteProps {
  qriRef: QriRef
  isPublished: boolean
  showIcon: boolean
  size: 'sm' | 'md'
}

/**
 * If there is a dataset selected & the dataset is published, show the
 * `ViewInCloudButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const ViewInCloudButtonComponent: React.FunctionComponent<ViewInCloudButtonProps> = (props) => {
  const {
    qriRef,
    isPublished,
    size = 'md',
    showIcon = true
  } = props

  const { username, name } = qriRef
  const datasetSelected = isDatasetSelected(qriRef)

  if (!(isPublished && datasetSelected)) {
    return null
  }

  return (<HeaderColumnButton
    id='view-in-cloud'
    label='View in Cloud'
    tooltip='View this dataset on the Qri Cloud website'
    icon={showIcon && faCloud}
    size={size}
    onClick={() => {
      openInExternalWindow(`${QRI_CLOUD_URL}/${username}/${name}`)
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  ViewInCloudButtonComponent,
  (state: any, ownProps: ViewInCloudButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      isPublished: selectIsPublished(state)
    }
  }
)
