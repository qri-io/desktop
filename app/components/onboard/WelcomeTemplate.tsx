import * as React from 'react' // eslint-disable-line
import Spinner from '../chrome/Spinner'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { onExit } from '../platformSpecific/WelcomeTemplate.TARGET_PLATFORM'

export const logo = require('../../assets/qri-blob-logo-small.png') // eslint-disable-line

export interface WelcomeTemplateProps {
  onAccept?: () => any
  acceptText?: string
  exit?: boolean
  title: string
  subtitle?: string
  loading?: boolean
  id?: string
  acceptEnabled?: boolean
  showLogo?: boolean
  fullscreen?: boolean
}

const WelcomeTemplate: React.FunctionComponent<WelcomeTemplateProps> = (props) => {
  const { onAccept, acceptText, exit, title, subtitle, loading, id, acceptEnabled = true, children, showLogo = true, fullscreen = true } = props
  const handleOnClick = () => {
    if (acceptEnabled && onAccept) {
      onAccept()
    }
  }

  return (
    <div className={classNames('welcome-page', { fullscreen })} id={id} >
      <div className={classNames('welcome-center', { 'welcome-no-logo': !showLogo })}>
        {showLogo && <img className='welcome-graphic' src={logo} />}
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
                <a id='accept' className={classNames('linkLarge', { 'linkDisabled': !acceptEnabled })} onClick={handleOnClick}>
                  <span>{acceptText}</span>
                  &nbsp;<FontAwesomeIcon icon={faArrowRight} className={classNames({ 'linkDisabled': !acceptEnabled })} size='lg'/>
                </a><br />
                {exit && <a className='linkSmallMuted' onClick={onExit}>exit</a>}
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default WelcomeTemplate
