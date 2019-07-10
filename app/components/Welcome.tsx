import * as React from 'react'
import ExternalLink from './ExternalLink'
import { remote } from 'electron'
import { logo } from './AppLoading'

const version = require('../../version').default // eslint-disable-line

export interface WelcomeProps {
  onAccept: () => void
}

const Welcome: React.FunctionComponent<WelcomeProps> = (props: WelcomeProps) => {
  return (
    <div className='welcome-page'>
      <div className='welcome-center'>
        <img className='welcome-graphic' src={logo} />
        <div className='welcome-title'>
          <h2>Welcome To Qri Desktop!</h2>
          <h6>You&#39;re using Qri Desktop version {version}</h6>
        </div>
        <div>
          <p>We’re currently in Beta. There will be bugs, and features will change quickly &amp; often. We hope you’ll come on this adventure with us! Our <ExternalLink href='https://github.com/qri-io/frontend'>github org</ExternalLink> is the best place to stay informed.</p>
          <div>
              A few notes before we get started:<br />
            <ul>
              <li>By using Qri you agree to our <ExternalLink href='https://qri.io/legal/tos'>Terms of Service</ExternalLink></li>
              <li>All Data on Qri is Public</li>
            </ul>
          </div>
        </div>
        <div className='welcome-accept'>
          <a className='linkLarge' onClick={props.onAccept}>Let&#39;s Get Started <span className='icon-inline'>right</span></a><br />
          <a className='linkSmallMuted' onClick={() => { remote.app.quit() }}>exit</a>
        </div>
      </div>
    </div>
  )
}

export default Welcome
