import * as React from 'react'
import WelcomeTemplate from './onboard/WelcomeTemplate.TARGET_PLATFORM'
const version: string = require('../../version').desktopVersion

export const AppLoading: React.FunctionComponent<any> = () =>
  <WelcomeTemplate
    title='Starting Qri Desktop'
    subtitle={`version ${version}`}
    id='app-loading'
    loading={true}
  ></WelcomeTemplate>

export default AppLoading
