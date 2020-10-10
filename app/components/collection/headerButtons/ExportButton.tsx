// don't show when in path is empty
import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface ExportButtonProps extends RouteProps {
  qriRef: QriRef
}

export const ExportButtonComponent: React.FunctionComponent<ExportButtonProps> = (props) => {
  return <div>ExportButton</div>
}

export default connectComponentToPropsWithRouter(
  ExportButtonComponent,
  (state: any, ownProps: ExportButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef
    }
  }
)
