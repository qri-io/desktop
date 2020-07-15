import React from 'react'
import WelcomeTemplate from './onboard/WelcomeTemplate'

const MigratingBackend: React.FC<{}> = () => (
  <WelcomeTemplate title='Migrating the Qri backend' subtitle='This might take a minute...' loading/>
)

export default MigratingBackend
