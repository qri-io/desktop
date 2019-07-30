import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { Action } from 'redux'
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
    ? <span className='icon-inline'>checkmark</span>
    : <span className='icon-inline'>warning</span>

  React.useEffect(() => {
    // set timeout
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
        {message}
      </div>
    </CSSTransition>
  )
}

export default Toast
