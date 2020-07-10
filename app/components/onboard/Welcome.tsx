import * as React from 'react'
import { Action } from 'redux'
import ExternalLink from '../ExternalLink'
import WelcomeTemplate from './WelcomeTemplate'
import { DISCORD_URL, GITHUB_ORG_URL, QRI_IO_URL } from '../../constants'

export interface WelcomeProps {
  onAccept: () => Action
}
const Welcome: React.FunctionComponent<WelcomeProps> = ({ onAccept }) =>
  <WelcomeTemplate
    title='Welcome To Qri Desktop'
    subtitle='Qri helps you manage and version your datasets'
    onAccept={onAccept}
    acceptText='Let&apos;s Get Started'
    id='welcome-page'
    exit
  >
    <span>
      <p>We’re currently in Beta. There will be bugs. Features will change quickly &amp; often. We hope you’ll come on this adventure with us! Our <ExternalLink href={GITHUB_ORG_URL}>github org</ExternalLink> and our <ExternalLink href={DISCORD_URL} >discord</ExternalLink> are the best places to stay informed.</p>
      <div>
          A few notes before we get started:<br />
        <ul>
          <li>By using Qri you agree to our <ExternalLink id='tos' href={`${QRI_IO_URL}/legal/tos`}>Terms of Service</ExternalLink></li>
          <li>All Data on Qri is Public</li>
        </ul>
      </div>
    </span>
  </WelcomeTemplate>

export default Welcome
