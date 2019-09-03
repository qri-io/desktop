import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

// import classNames from 'classnames'
import { ToastType } from '../models/store'

interface ToastProps {
  type: ToastType
  message: string
  isVisible: boolean
  timeout: number
  onClose: () => Action
}

const Toast: React.FunctionComponent<ToastProps> = (props: ToastProps) => {
  const { type, message, isVisible, timeout, onClose } = props
  const icon = type === 'success'
    ? <FontAwesomeIcon icon={faCheck} size='lg'/>
    : <FontAwesomeIcon icon={faExclamationTriangle} size='lg'/>

  React.useEffect(() => {
    // set timeout for the toast
    // TODO(chriswhong): handle cancelling the timeout so it will behave if
    // you fire multiple toasts in succession
    if (isVisible === true) {
      setTimeout(onClose, timeout)
    }
  }, [isVisible])

  return (
    <CSSTransition
      in={isVisible}
      classNames="toast"
      timeout={300}
    >
      <div className={classNames('toast', {
        'success': type === 'success',
        'error': type === 'error'
      })}>
        {icon}
        &nbsp;
        {message}
      </div>
    </CSSTransition>
  )
}

export default Toast
