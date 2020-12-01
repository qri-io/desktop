import React from 'react'
import { faPlus, faMinus, faSquare } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { selectChangeReportParams } from '../../../selections'
import { pathToChangeReport } from '../../../paths'
import { IChangeReportRefs } from '../../../models/changeReport'

interface ViewChangesProps extends RouteProps {
  data?: IChangeReportRefs
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
    data,
    size = 'md',
    showIcon = true,
    history
  } = props

  if (!data) {
    return null
  }

  const icon = <span className="fa-layers fa-fw">
    <FontAwesomeIcon icon={faSquare} transform='grow-10' />
    <FontAwesomeIcon color='white' icon={faPlus} transform='up-3 shrink-2' />
    <FontAwesomeIcon color='white' icon={faMinus} transform='down-6 shrink-2'/>
  </span>

  return (<HeaderColumnButton
    id='view-changes'
    label='View Changes'
    tooltip='Summarize changes from this version to the one before it'
    icon={showIcon && icon}
    size={size}
    onClick={() => {
      history.push(pathToChangeReport(data.left, data.right))
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  ViewChangesButtonComponent,
  (state: any, ownProps: ViewChangesProps) => {
    return {
      ...ownProps,
      data: selectChangeReportParams(state)
    }
  }
)
