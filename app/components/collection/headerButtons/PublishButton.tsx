import * as React from 'react'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { setModal } from '../../../actions/ui'

import { selectIsPublished, selectInNamespace, selectLatestPath } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface PublishButtonProps extends RouteProps {
  qriRef: QriRef
  inNamespace: boolean
  isPublished: boolean
  latestPath: string
  setModal: (modal: Modal) => void
  showIcon: boolean
  size: 'sm' | 'md'
}

/**
 * If there is a dataset selected, we are at the latest version, and the version
 * is not published, show the `PublishButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const PublishButtonComponent: React.FunctionComponent<PublishButtonProps> = (props) => {
  const {
    qriRef,
    inNamespace,
    isPublished,
    latestPath,
    setModal,
    size = 'md',
    showIcon = true
  } = props

  const { username, name, path = '' } = qriRef
  const datasetSelected = isDatasetSelected(qriRef)
  const atHead = path !== '' && path === latestPath

  if (!(inNamespace && datasetSelected && !isPublished && atHead)) {
    return null
  }

  return (
    <span data-tip={'Publish this dataset to Qri Cloud'}>
      <HeaderColumnButton
        id='publish-button'
        label='Publish'
        icon={showIcon && faCloudUploadAlt}
        size={size}
        onClick={() => {
          setModal({
            type: ModalType.PublishDataset,
            username,
            name
          })
        }}
      />
    </span>
  )
}

export default connectComponentToPropsWithRouter(
  PublishButtonComponent,
  (state: any, ownProps: PublishButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      inNamespace: selectInNamespace(state, qriRef),
      isPublished: selectIsPublished(state),
      latestPath: selectLatestPath(state, qriRef.username, qriRef.name)
    }
  },
  {
    setModal
  }
)
