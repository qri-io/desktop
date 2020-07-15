import React from 'react'

import CrashReportSender, { ErrorProps } from './CrashReportSender'
import localStore from '../utils/localStore'

export default class ErrorHandler extends React.Component {
  state = {
    error: undefined,
    errorInfo: undefined
  }

  componentDidCatch (error: ErrorProps['error'], errorInfo: ErrorProps['errorInfo']) {
    this.setState({ error, errorInfo })

    // clear local storage, which may cause re-crashing if in an error put us
    // into an un-recoverable state
    localStore().setItem('peername', '')
    localStore().setItem('name', '')
    localStore().setItem('activeTab', 'status')
    localStore().setItem('component', '')
    localStore().setItem('commitComponent', '')
  }

  render () {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <CrashReportSender
        title='Dang. It broke.'
        error={this.state.error}
        errorInfo={this.state.errorInfo}/>
    )
  }
}
