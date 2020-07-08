import React from 'react'
import WelcomeTemplate, { WelcomeTemplateProps } from './WelcomeTemplate.base'

const WelcomeTemplateWeb: React.FC<WelcomeTemplateProps> = (props) => {
  // TODO (uhLeeshUh): change onClick functionality here to match desired behavior
  const onExit = () => true
  return <WelcomeTemplate {...props} onExit={onExit}/>
}

export default WelcomeTemplateWeb
