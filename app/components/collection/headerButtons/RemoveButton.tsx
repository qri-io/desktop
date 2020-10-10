// always show
import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface RemoveButtonProps extends RouteProps {
  qriRef: QriRef
}

export const RemoveButtonComponent: React.FunctionComponent<RemoveButtonProps> = (props) => {
  return <div>RemoveButton</div>
}

export default connectComponentToPropsWithRouter(
  RemoveButtonComponent,
  (state: any, ownProps: RemoveButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef
    }
  }
)
