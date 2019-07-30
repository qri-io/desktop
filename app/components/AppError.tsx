import * as React from 'react'
import WelcomeTemplate from './WelcomeTemplate'
import ExternalLink from './ExternalLink'

export const AppError: React.FunctionComponent<any> = () =>
  <WelcomeTemplate
    title='Error Connecting To Qri'
    subtitle={`The Qri backend isn't responding.`}
    id='app-error'
    loading={false}
  >
    <span>
      <p>Please try restarting the app.</p>
      <p>For more help checkout out our <ExternalLink href='https://qri.io/docs'>documentation</ExternalLink>, our <ExternalLink href='https://github.com/qri-io/frontend'>github org</ExternalLink> or our <ExternalLink href='https://discord.gg/etap8Gb' >discord</ExternalLink>.</p>
    </span>
  </WelcomeTemplate>

export default AppError
