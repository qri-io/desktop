import * as React from 'react'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'

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
    showIcon = true
  } = props

  // The `ReactTooltip` component relies on the `data-for` and `data-tip` attributes
  // we need to rebuild `ReactTooltip` so that it can recognize the `data-for`
  // or `data-tip` attributes that are rendered in this component
  React.useEffect(ReactTooltip.rebuild, [])

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
