import React from 'react'
import { Dispatch, bindActionCreators, ActionCreatorsMapObject } from 'redux'
import { connect, Matching } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Store from '../models/store'

type MapStateToProps<T> = (state?: Store, ownProps?: T) => T
type MapDispatchToProps<T> = (ownProps? : T) => ActionCreatorsMapObject<any>

/**
 * connectComponentToProps wraps the redux `connect` function
 * it connects the component params to the store and binds the actions to dispatch
 *  - `component` - takes a component, it should have props defined
 *  - `mapStateToPropsFunc` - either a function with `state` and `ownProps`
 *  params, or an object (can be an object)
*/
export function connectComponentToProps<T> (
  component: React.ComponentType<Matching <T, T>>,
  mapStateToPropsFunc?: MapStateToProps<T> | T,
  mapDispatchToPropsFunc?: MapDispatchToProps<T> | ActionCreatorsMapObject<any>
) {
  let mapStateToProps = (state: any, ownProps: T) => {
    return ownProps
  }
  if (mapStateToPropsFunc && typeof mapStateToPropsFunc === 'function') {
    mapStateToProps = (state: any, ownProps: T) => {
      return mapStateToPropsFunc(state, ownProps)
    }
  } else {
    mapStateToProps = (state: any, ownProps: T) => {
      if (mapStateToPropsFunc) {
        return {
          ...ownProps,
          ...mapStateToPropsFunc
        }
      }
      return ownProps
    }
  }

  let mapDispatchToProps = (dispatch: Dispatch, ownProps: T) => {
    return bindActionCreators({
    }, dispatch)
  }
  if (mapDispatchToPropsFunc && typeof mapDispatchToPropsFunc === 'function') {
    mapDispatchToProps = (dispatch: Dispatch, ownProps: T) => {
      return bindActionCreators({
        ...mapDispatchToPropsFunc(ownProps)
      }, dispatch)
    }
  } else {
    mapDispatchToProps = (dispatch: Dispatch, ownProps: T) => {
      return bindActionCreators({
        ...mapDispatchToPropsFunc
      }, dispatch)
    }
  }

  const mergeProps = (props: any, actions: any): T => {
    return { ...props, ...actions }
  }
  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(component)
}

export function connectComponentToPropsWithRouter<T> (
  component: React.ComponentType<Matching <T, T>>,
  mapStateToPropsFunc?: MapStateToProps<T> | {},
  mapDispatchToPropsFunc?: MapDispatchToProps<T> | ActionCreatorsMapObject<any>
) {
  return withRouter(connectComponentToProps(component, mapStateToPropsFunc, mapDispatchToPropsFunc))
}
