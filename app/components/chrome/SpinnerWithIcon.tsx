import * as React from 'react'
import Spinner from './Spinner'
import { logo } from '../WelcomeTemplate'
import { CSSTransition } from 'react-transition-group'

interface SpinnerWithIconProps {
  title?: string
  subtitle?: string
  loading: boolean
  spinner?: boolean
}

const SpinnerWithIcon: React.FunctionComponent<SpinnerWithIconProps> = ({ loading, title, subtitle, spinner = true, children }) => {
  return (
    <CSSTransition
      in={loading}
      classNames='fade'
      component='div'
      timeout={300}
      appear={true}
      mountOnEnter
      unmountOnExit
    >
      <div className='welcome-center' id='spinner-with-icon-wrap'>
        <img className='welcome-graphic' id='spinner-with-icon-graphic' src={logo} />
        <div className='welcome-title'>
          <h2>{title}</h2>
          <h6>{subtitle}</h6>
        </div>
        <div className='welcome-content'>
          {children}
          <div className='welcome-spinner'>
            {spinner && <Spinner/>}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default SpinnerWithIcon
