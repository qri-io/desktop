import * as React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Store from '../models/store'

// want to return two objects,
export function connectComponentToProps<T> (mapStateToPropsFunc: (state: Store, ownProps: T) => T, mapDispatchToPropsFunc: (ownProps?: T) => any, component: React.FunctionComponent | React.ComponentClass, needHistory?: boolean) {
  const mapStateToProps = (state: any, ownProps: T) => {
    // need access to this state and ownProps
    return mapStateToPropsFunc(state, ownProps)
  }

  const mapDispatchToProps = (dispatch: Dispatch, ownProps: T) => {
    // need access to this dispatch and ownProps
    return bindActionCreators({
      ...mapDispatchToPropsFunc(ownProps)
    }, dispatch)
  }

  const mergeProps = (props: any, actions: any): T => {
    return { ...props, ...actions }
  }

  if (needHistory) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(component))
  }
  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(component)
}
