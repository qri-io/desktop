import React from 'react'
import WelcomeTemplate from './onboard/WelcomeTemplate'
import ExternalLink from './ExternalLink'
const backendVersion: string = require('../../version').backendVersion

interface IncompatibleBackendProps {
  incompatibleVersion: string
}

const IncompatibleBackend: React.FC<IncompatibleBackendProps> = ({ incompatibleVersion }) => (
  <WelcomeTemplate title='Incompatible Backend Version'>
    <p>{`The supported backend version is v${backendVersion}, but you are running on v${incompatibleVersion}.`}</p>
    <p>Please file an issue <ExternalLink id="file-issue" href="https://github.com/qri-io/desktop/issues/new">here</ExternalLink>.</p>
  </WelcomeTemplate>
)

export default IncompatibleBackend
