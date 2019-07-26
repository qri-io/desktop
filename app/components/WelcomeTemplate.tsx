import * as React from 'react' // eslint-disable-line
import { remote } from 'electron'
import { Spinner } from './chrome/Spinner'
export const logo = require('../assets/qri-blob-logo-large.png') // eslint-disable-line

interface WelcomeTemplateProps {
  onAccept?: () => any
  acceptText?: string
  exit?: boolean
  title: string
  subtitle: string
  loading?: boolean
  id?: string
}

const WelcomeTemplate: React.FunctionComponent<WelcomeTemplateProps> = ({ onAccept, acceptText, exit, title, subtitle, loading, id, children }) => {
  return (
    <div className='welcome-page' id={id}>
      <div className='welcome-center'>
        <img className='welcome-graphic' src={logo} />
        <div className='welcome-title'>
          <h2>{title}</h2>
          <h6>{subtitle}</h6>
        </div>
        <div className='welcome-content'>
          {children}
          {
            loading
              ? <div className='welcome-spinner'>
                <Spinner/>
              </div>
              : !!onAccept && <div className='welcome-accept'>
                <a className='linkLarge' onClick={onAccept}>{acceptText}<span className='icon-inline'>right</span></a><br />
                {exit && <a className='linkSmallMuted' onClick={() => { remote.app.quit() }}>exit</a>}
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default WelcomeTemplate
