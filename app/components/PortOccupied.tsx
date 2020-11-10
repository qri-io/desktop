import React from 'react'
import ExternalLink from './ExternalLink'
import WelcomeTemplate from './onboard/WelcomeTemplate'
import { PORT, DISCORD_URL } from '../constants'

const PortOccupied: React.FC<{}> = () => (
  <WelcomeTemplate title='Cannot Load App'>
    <div className='port-occupied'>
      <div>Qri Desktop cannot start because another process is occupying port <strong>{PORT}</strong>, which the app relies on in order to function properly.</div>
      <div>Please close that process and restart <br /> Qri Desktop. Reach out to us on
        <ExternalLink
          id='discord'
          href={DISCORD_URL}
        > Discord </ExternalLink>
      if you have any questions!</div>
    </div>
  </WelcomeTemplate>
)

export default PortOccupied
