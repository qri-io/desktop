import * as React from 'react' // eslint-disable-line
import { remote } from 'electron'
import Spinner from './chrome/Spinner'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export const logo = require('../assets/qri-blob-logo-small.png') // eslint-disable-line

interface WelcomeTemplateProps {
  onAccept?: () => any
  acceptText?: string
  exit?: boolean
  title: string
  subtitle?: string
  loading?: boolean
  id?: string
  acceptEnabled?: boolean
}

const WelcomeTemplate: React.FunctionComponent<WelcomeTemplateProps> = ({ onAccept, acceptText, exit, title, subtitle, loading, id, acceptEnabled = true, children }) => {
  const handleOnClick = () => {
    if (acceptEnabled && onAccept) {
      onAccept()
    }
  }

  return (
    <div className='welcome-page' id={id}>
      <div className='welcome-center'>
        <img className='welcome-graphic' src={logo} />
        <div className='welcome-title'>
          <h2>{title}</h2>
          { subtitle && <h6>{subtitle}</h6>}
        </div>
        <div className='welcome-content'>
          {children}
          {
            loading
              ? <div className='welcome-spinner'>
                <Spinner/>
              </div>
              : !!onAccept && <div className='welcome-accept'>
                <a className={classNames('linkLarge', { 'linkDisabled': !acceptEnabled })} onClick={handleOnClick}>
                  <span>{acceptText}</span>
                  &nbsp;<FontAwesomeIcon icon={faArrowRight} className={classNames({ 'linkDisabled': !acceptEnabled })} size='lg'/>
                </a><br />
                {exit && <a className='linkSmallMuted' onClick={() => { remote.app.quit() }}>exit</a>}
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default WelcomeTemplate
