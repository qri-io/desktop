import React from 'react'

import CrashReportSender from '../app/components/CrashReportSender'

export default {
  title: 'Error',
  parameters: {
      notes: 'Application error handling'
  }
}

const crashReportSenderProps = {
  title: 'Storybook test has crashed',
  error: new Error('Test error for Storybook!'),
  errorInfo: { 
    componentStack: `in ComponentThatThrows (created by App)
    in ErrorBoundary (created by App)
    in div (created by App)
    in App` }
}
  
export const crashReportSender = () => (<CrashReportSender {...crashReportSenderProps}/>)
  
crashReportSender.story = {
  name: 'Crash Report Sender',
  parameters: { note: 'Screen when app throws an error and is caught. Prompts error report, issue and reload CTAs' }
}