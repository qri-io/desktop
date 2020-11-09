import React from 'react'
import WelcomeTemplate from './onboard/WelcomeTemplate'
const version: string = require('../../version').desktopVersion

export const AppLoading: React.FunctionComponent<any> = () =>
  <WelcomeTemplate
    title={__BUILD__.REMOTE ? 'Loading Qri Webui' : 'Starting Qri Desktop'}
    subtitle={`version ${version}`}
    id='app-loading'
    loading={true}
  ></WelcomeTemplate>

export default AppLoading
