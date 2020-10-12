import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { openItem } from './platformSpecific/ButtonActions.TARGET_PLATFORM'
import { selectFsiPath } from '../../../selections'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface ShowFilesButtonProps extends RouteProps {
  qriRef: QriRef
  fsiPath: string
  showIcon: boolean
  size: 'sm' | 'md'
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
    fsiPath,
    size = 'md',
    showIcon = true
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(fsiPath && datasetSelected)) {
    return null
  }
  return (<HeaderColumnButton
    id='show-files-button'
    label='Show Files'
    tooltip='Show the dataset files on your file system'
    icon={showIcon && faFolderOpen}
    size={size}
    onClick={() => {
      openItem && openItem(fsiPath)
    }}
  />)
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
