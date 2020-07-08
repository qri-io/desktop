import React from 'react'
import versions from '../../version'
import { CRASH_REPORTER_URL } from '../constants'

import localStore from '../utils/localStore'
import ExternalLink from './ExternalLink'
import Button from './chrome/Button'

export default class ErrorHandler extends React.Component {
  state = {
    error: undefined,
    errorInfo: undefined,
    sendingReport: false,
    sentReport: false
  }

  constructor (props) {
    super(props)

    this.handleSendCrashReport = this.handleSendCrashReport.bind(this)
    this.handleReload = this.handleReload.bind(this)
  }

  componentDidCatch (error, errorInfo) {
    this.setState({ error, errorInfo, sendingReport: false })

    // clear local storage, which may cause re-crashing if in an error put us
    // into an un-recoverable state
    localStore().setItem('peername', '')
    localStore().setItem('name', '')
    localStore().setItem('activeTab', 'status')
    localStore().setItem('component', '')
    localStore().setItem('commitComponent', '')
  }

  handleSendCrashReport (e: React.MouseEvent) {
    const { error, errorInfo } = this.state
    this.setState({ error, errorInfo, sendingReport: true })

    console.log('sending report')
    postCrashReport(error, errorInfo)
      .then(() => {
        this.setState({
          sentReport: true,
          sendingReport: false
        })
      })
      .catch((e) => {
        console.log(e)
        this.setState({
          sendingReport: false
        })
      })
  }

  handleReload (e: React.MouseEvent) {
    window.location.hash = '/'
    window.location.reload()
  }

  render () {
    if (!this.state.error) {
      return this.props.children
    }

    const { sendingReport, sentReport } = this.state

    return (
      <div className="error-container">
        <div className="dialog">
          <h1>Dang. It broke.</h1>
          <p>Apologies, Qri desktop encountered an error. Send us a crash report!</p>
          <div className="reporting actions">
            {sentReport
              ? <p>Thanks!</p>
              : <Button
                id="send-crash-report"
                text="Send Crash Report"
                color="primary"
                loading={sendingReport}
                onClick={this.handleSendCrashReport}
              />}
          </div>
          <div className="reload">
            <p>If you have additional info or questions, feel free to <ExternalLink id="file-issue" href="https://github.com/qri-io/desktop/issues/new">file an issue</ExternalLink> describing where things went wrong. The more detail, the better. Reload to get back to Qri.</p>
            <Button
              id="error-reload"
              text="Reload Qri Desktop"
              color="dark"
              onClick={this.handleReload}
            />
          </div>
        </div>
      </div>
    )
  }
}

// TODO (b5) - bring this back in the near future for fetching home feed
async function postCrashReport (err, errInfo): Promise<any> {
  const options: FetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app: 'desktop',
      version: versions.desktopVersion,
      platform: navigator.platform,
      error: err.toString(),
      info: errInfo.componentStack
    })
  }

  console.log(CRASH_REPORTER_URL)
  const r = await fetch(CRASH_REPORTER_URL, options)
  const res = await r.json()
  return res
}
