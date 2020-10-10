import * as React from 'react'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RouteProps } from 'react-router-dom'

import { QRI_CLOUD_URL } from '../../../constants'
import { addToClipboard } from './platformSpecific/ButtonActions.TARGET_PLATFORM'

import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { selectIsPublished } from '../../../selections'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface CopyCloudLinkButtonProps extends RouteProps {
  qriRef: QriRef
  isPublished: boolean
  showIcon: boolean
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
    isPublished,
    showIcon = true
  } = props

  const { username, name } = qriRef
  const datasetSelected = isDatasetSelected(qriRef)

  if (!(datasetSelected && isPublished)) {
    return null
  }
  return (<HeaderColumnButton
    id='copy-cloud-link'
    label='Copy Cloud Link'
    tooltip='Copy the url of this dataset on the cloud to your clipboard'
    icon={(showIcon &&
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faFile} size='lg'/>
        <FontAwesomeIcon icon={faLink} transform='shrink-8' />
      </span>
    )}
    onClick={() => {
      addToClipboard && addToClipboard(`${QRI_CLOUD_URL}/${username}/${name}`)
    }}
  />)
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
