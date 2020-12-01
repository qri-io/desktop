import React from 'react'
import Store, { RouteProps } from '../../models/store'
import { parseRefsFromChangeReportPath } from '../../paths'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

type TempChangeReportProps = RouteProps

const TempChangeReportComponent: React.FC<TempChangeReportProps> = (props) => {
  const { history } = props
  const { location } = history
  // TODO (ramfox): when refactoring to the actual change report component
  // the component should expect the refs already parsed & we should use a selector
  // to do the parsing
  const refs = parseRefsFromChangeReportPath(location.pathname)
  if (!refs) {
    return <div>unable to parse refs from route path: {location.pathname}</div>
  }
  return <div className='margin' >
    <a id='left' className='margin' onClick={() => history.push(`/collection/${refs[0]}`)}>left</a>
    <a id='right' className='margin' onClick={() => history.push(`/collection/${refs[1]}`)}>right</a>
  </div>
}

export default connectComponentToPropsWithRouter(
  TempChangeReportComponent,
  (state: Store, ownProps: TempChangeReportProps) => {
    return ownProps
  }
)
