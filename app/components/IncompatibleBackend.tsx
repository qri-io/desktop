import React from 'react'
import WelcomeTemplate from './onboard/WelcomeTemplate'
import ExternalLink from './ExternalLink'
import { backendVersion } from '../../version.js'

interface IncompatibleBackendProps {
  incompatibleVersion: string
}

const IncompatibleBackend: React.FC<IncompatibleBackendProps> = ({ incompatibleVersion }) => (
  <WelcomeTemplate title='Incompatible Backend Version'>
    <p>{`Incorrect backend version supplied. Expected qri v${backendVersion}, but have v${incompatibleVersion}. Please file an issue `}
      <ExternalLink id="file-issue" href="https://github.com/qri-io/desktop/issues/new">here</ExternalLink>.
    </p>
  </WelcomeTemplate>
)

export default IncompatibleBackend
