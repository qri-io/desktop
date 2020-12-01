import React from 'react'
import Store, { RouteProps } from '../../models/store'
import { qriRefsFromChangeReportPath } from '../../paths'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

type TempChangeReportProps = RouteProps

const TempChangeReportComponent: React.FC<TempChangeReportProps> = (props) => {
  const { history } = props
  const { location } = history
  const refs = qriRefsFromChangeReportPath(location.pathname)
  return <div className='margin' >
    <a id='left' className='margin' onClick={() => history.push(`/collection/${refs.left}`)}>left</a>
    <a id='right' className='margin' onClick={() => history.push(`/collection/${refs.right}`)}>right</a>
  </div>
}

export default connectComponentToPropsWithRouter(
  TempChangeReportComponent,
  (state: Store, ownProps: TempChangeReportProps) => {
    return ownProps
  }
)
