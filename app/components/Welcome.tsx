import * as React from 'react'
import ExternalLink from './ExternalLink'
import { remote } from 'electron'
import { logo } from './AppLoading'

export interface WelcomeProps {
  onAccept: () => void
}

const Welcome: React.FunctionComponent<WelcomeProps> = ({ onAccept }) => {
  return (
    <div className='welcome-page'>
      <div className='welcome-center'>
        <img className='welcome-graphic' src={logo} />
        <div className='welcome-title'>
          <h2>Welcome To Qri Desktop!</h2>
          <h6>Qri helps you manage and version your datasets</h6>
        </div>
        <div className='welcome-text'>
          <p>We’re currently in Beta. There will be bugs. Features will change quickly &amp; often. We hope you’ll come on this adventure with us! Our <ExternalLink href='https://github.com/qri-io/frontend'>github org</ExternalLink> and our <ExternalLink href='https://discord.gg/etap8Gb' >discord</ExternalLink> are the best places to stay informed.</p>
          <div>
              A few notes before we get started:<br />
            <ul>
              <li>By using Qri you agree to our <ExternalLink href='https://qri.io/legal/tos'>Terms of Service</ExternalLink></li>
              <li>All Data on Qri is Public</li>
            </ul>
          </div>
        </div>
        <div className='welcome-accept'>
          <a className='linkLarge' onClick={onAccept}>Let&apos;s Get Started <span className='icon-inline'>right</span></a><br />
          <a className='linkSmallMuted' onClick={() => { remote.app.quit() }}>exit</a>
        </div>
      </div>
    </div>
  )
}

export default Welcome
