import React from 'react'
import WelcomeTemplate from './onboard/WelcomeTemplate'
import ExternalLink from './ExternalLink'

interface IncompatibleBackendProps {
  incompatibleVersion: string
}

// TODO: this variable needs to be replaced when the
// lowestCompatibleBackend variable exists in backend.js
const lowestCompatibleBackend = '0.9.8'

const IncompatibleBackend: React.FC<IncompatibleBackendProps> = ({ incompatibleVersion }) => (
  <WelcomeTemplate title='Incompatible Backend Version'>
    <p>{`The lowest supported backend version is v${lowestCompatibleBackend}, but you are running on v${incompatibleVersion}.`}</p>
    <p>Please file an issue <ExternalLink id="file-issue" href="https://github.com/qri-io/desktop/issues/new">here</ExternalLink>.</p>
  </WelcomeTemplate>
)

export default IncompatibleBackend
