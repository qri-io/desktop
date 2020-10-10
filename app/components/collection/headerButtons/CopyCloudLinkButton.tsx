// show if published point to head
import * as React from 'react'
import { RouteProps } from 'react-router-dom'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

interface CopyCloudLinkButtonProps extends RouteProps {
  qriRef: QriRef
}

export const CopyCloudLinkButtonComponent: React.FunctionComponent<CopyCloudLinkButtonProps> = (props) => {
  return <div>CopyCloudLinkButton</div>
}

export default connectComponentToPropsWithRouter(
  CopyCloudLinkButtonComponent,
  (state: any, ownProps: CopyCloudLinkButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef
    }
  }
)
