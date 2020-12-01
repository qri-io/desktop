import React from 'react'
import { faPlus, faMinus, faSquare } from '@fortawesome/free-solid-svg-icons'

import { RouteProps, VersionInfo } from '../../../models/store'
import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { selectFsiPath, selectLog } from '../../../selections'
import { pathToChangeReport } from '../../../paths'

interface ViewChangesProps extends RouteProps {
  qriRef: QriRef
  fsiPath: string
  log: VersionInfo[]
  showIcon: boolean
  size: 'sm' | 'md'
}

/**
 * If there is a dataset selected & the dataset has a history, show the
 * `ViewChangesButton`. However, if we are viewing the working version, only
 * show the change report button if we are 'fsi linked'
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const ViewChangesButtonComponent: React.FunctionComponent<ViewChangesProps> = (props) => {
  const {
    qriRef,
    fsiPath,
    log,
    size = 'md',
    showIcon = true,
    history
  } = props

  const { path } = qriRef
  const datasetSelected = isDatasetSelected(qriRef)

  if (!(
    log.length !== 0 &&
    datasetSelected &&
    // we can only show the changes of a working dataset if that dataset is
    // fsi linked
    (path !== '' || fsiPath !== '') &&
    // if the path is the oldest path in the list, there is no previous
    // version to compare it to
    (path !== log[log.length - 1].path)
  )) {
    return null
  }

  const right = qriRef
  let left
  if (qriRef.path === '') {
    left = log[0]
  } else {
    const rightIndex = log.findIndex(vi => vi.path === qriRef.path)
    // since we have already guarded against the given path being the last index
    // we can add 1 to the rightIndex without worrying about overflow
    left = log[rightIndex + 1]
  }

  const icon = <span className="fa-layers fa-fw">
    <FontAwesomeIcon icon={faSquare} transform='grow-10' />
    <FontAwesomeIcon color='white' icon={faPlus} transform='up-3 shrink-2' />
    <FontAwesomeIcon color='white' icon={faMinus} transform='down-6 shrink-2'/>
  </span>

  return (<HeaderColumnButton
    id='view-changes'
    label='View Changes'
    tooltip='Explore the changes made from the previous version of this dataset to the version you are currently viewing'
    icon={showIcon && icon}
    size={size}
    onClick={() => {
      history.push(pathToChangeReport(left, right))
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  ViewChangesButtonComponent,
  (state: any, ownProps: ViewChangesProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      fsiPath: selectFsiPath(state),
      log: selectLog(state)
    }
  }
)
