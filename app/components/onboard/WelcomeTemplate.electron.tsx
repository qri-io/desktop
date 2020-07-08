import React from 'react'
import WelcomeTemplate, { WelcomeTemplateProps } from './WelcomeTemplate.base'
import { remote } from 'electron'

const WelcomeTemplateElectron: React.FC<WelcomeTemplateProps> = (props) => {
  const onExit = () => remote.app.quit()
  return <WelcomeTemplate {...props} onExit={onExit}/>
}

export default WelcomeTemplateElectron
