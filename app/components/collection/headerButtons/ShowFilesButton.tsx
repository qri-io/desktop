// only if checked out
import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface ShowFilesButtonProps extends RouteProps {
  qriRef: QriRef
}

export const ShowFilesButtonComponent: React.FunctionComponent<ShowFilesButtonProps> = (props) => {
  return <div>ShowFilesButton</div>
}

export default connectComponentToPropsWithRouter(
  ShowFilesButtonComponent,
  (state: any, ownProps: ShowFilesButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef
    }
  }
)
