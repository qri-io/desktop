import * as React from 'react'
import { faCloud } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { QRI_CLOUD_URL } from '../../../constants'

import { openExternal } from './platformSpecific/ButtonActions.TARGET_PLATFORM'

import { setModal } from '../../../actions/ui'

import { selectInNamespace } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface ViewInCloudButtonProps extends RouteProps {
  qriRef: QriRef
  isPublished: boolean
  showIcon: boolean
}

// only if published => goes to head
export const ViewInCloudButtonComponent: React.FunctionComponent<ViewInCloudButtonProps> = (props) => {
  const {
    qriRef,
    isPublished,
    showIcon = true
  } = props

  const { username, name } = qriRef
  const datasetSelected = username !== '' && name !== ''

  if (!(isPublished && datasetSelected)) {
    return null
  }

  return (<HeaderColumnButton
    id='checkout'
    label='checkout'
    tooltip='Checkout this dataset to a folder on your computer'
    icon={showIcon && faCloud}
    onClick={() => {
      openExternal && openExternal(`${QRI_CLOUD_URL}/${username}/${name}`)
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  ViewInCloudButtonComponent,
  (state: any, ownProps: ViewInCloudButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef,
      inNamespace: selectInNamespace(state, qriRef),
      ...ownProps
    }
  },
  {
    setModal
  }
)
