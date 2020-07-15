import React, { useState } from 'react'
import Button from './chrome/Button'
import ExternalLink from './ExternalLink'
import WelcomeTemplate from './onboard/WelcomeTemplate'
import { FetchOptions } from '../store/api'
import versions from '../../version'
import { CRASH_REPORTER_URL } from '../constants'

interface ReportCrashAndReloadProps extends ErrorProps {
  title: string
}

export interface ErrorProps {
  error?: Error
  errorInfo?: React.ErrorInfo
}

const ReportCrashAndReload: React.FC<ReportCrashAndReloadProps> = ({ title, error, errorInfo }) => {
  const [sendingReport, setSendingReport] = useState(false)
  const [sentReport, setSentReport] = useState(false)

  const handleSendCrashReport = async () => {
    setSendingReport(true)
    try {
      console.log('sending report')
      await postCrashReport(error, errorInfo)
      setSendingReport(true)
      setSentReport(true)
    } catch (e) {
      console.log(e)
      setSendingReport(false)
    }
  }

  const handleReload = () => {
    window.location.hash = '/'
    window.location.reload()
  }

  return (
    <WelcomeTemplate title={title}>
      <div className="reporting actions">
        <p>Apologies, Qri desktop encountered an error. Send us a crash report!</p>
        {sentReport
          ? <p>Thanks!</p>
          : <Button
            id="send-crash-report"
            text="Send Crash Report"
            color="primary"
            loading={sendingReport}
            onClick={handleSendCrashReport}
          />}
      </div>
      <br />
      <div className="reload">
        <p>If you have additional info or questions, feel free to <ExternalLink id="file-issue" href="https://github.com/qri-io/desktop/issues/new">file an issue</ExternalLink> describing where things went wrong. The more detail, the better. Reload to get back to Qri.</p>
        <Button
          id="error-reload"
          text="Reload Qri Desktop"
          color="dark"
          onClick={handleReload}
        />
      </div>
    </WelcomeTemplate>
  )
}

// TODO (b5) - bring this back in the near future for fetching home feed
const postCrashReport = async (error: ErrorProps['error'], errorInfo: ErrorProps['errorInfo']): Promise<any> => {
  const options: FetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app: 'desktop',
      version: versions.desktopVersion,
      platform: navigator.platform,
      error: error?.toString(),
      info: errorInfo?.componentStack
    })
  }

  console.log(CRASH_REPORTER_URL)
  const r = await fetch(CRASH_REPORTER_URL, options)
  const res = await r.json()
  return res
}

export default ReportCrashAndReload
