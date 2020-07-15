import React from 'react'

import ReportCrashAndReload from '../app/components/ReportCrashAndReload'

export default {
  title: 'Error',
  parameters: {
      notes: 'Application error handling'
  }
}

const reportCrashAndReloadProps = {
  title: 'Storybook test has crashed',
  error: new Error('Test error for Storybook!'),
  errorInfo: { 
    componentStack: `in ComponentThatThrows (created by App)
    in ErrorBoundary (created by App)
    in div (created by App)
    in App` }
}
  
export const reportCrashAndReload = () => (<ReportCrashAndReload {...reportCrashAndReloadProps}/>)
  
reportCrashAndReload.story = {
  name: 'Report Crash and Reload',
  parameters: { note: 'Screen when app throws an error and is caught. Prompts error report, issue and reload CTAs' }
}