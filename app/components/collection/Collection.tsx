import * as React from 'react'
import { Action, Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { QriRef } from '../../models/qriRef'

import { selectSidebarWidth } from '../../selections'
import { setSidebarWidth } from '../../actions/ui'

import DatasetList from '../DatasetList'
import Layout from '../Layout'
import CollectionHome from './CollectionHome'

interface CollectionProps {
  qriRef: QriRef
  sidebarWidth: number
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

export const CollectionComponent: React.FunctionComponent<CollectionProps> = (props) => {
  const {
    qriRef,
    sidebarWidth,
    setSidebarWidth
  } = props

  return (
    <Layout
      id='collection-container'
      sidebarContent={<DatasetList qriRef={qriRef} />}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={<CollectionHome qriRef={qriRef} />}
    />
  )
}

const mapStateToProps = (state: any, ownProps: CollectionProps) => {
  return {
    ...ownProps,
    sidebarWidth: selectSidebarWidth(state, 'collection')
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setSidebarWidth
  }, dispatch)
}

const mergeProps = (props: any, actions: any): CollectionProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CollectionComponent)
