import React from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import { Toast } from '../models/store'
import { closeToast } from '../actions/ui'
import { selectToast } from '../selections'
import { connectComponentToProps } from '../utils/connectComponentToProps'

interface ToastProps {
  toast: Toast
  timeout: number
  onClose: () => Action
}

export const ToastComponent: React.FunctionComponent<ToastProps> = (props) => {
  const { toast, onClose, timeout = 3000 } = props
  const { type, message, visible: isVisible, name } = toast
  const icon = type === 'success'
    ? <FontAwesomeIcon icon={faCheck} size='lg'/>
    : <FontAwesomeIcon icon={faExclamationTriangle} size='lg'/>

  React.useEffect(() => {
    // set timeout for the toast
    // TODO(chriswhong): handle cancelling the timeout so it will behave if
    // you fire multiple toasts in succession
    if (isVisible) {
      setTimeout(onClose, timeout)
    }
  }, [isVisible])

  return (
    <CSSTransition
      in={isVisible}
      classNames="toast"
      timeout={300}
    >
      <div id={`toast-${name}`} className={classNames('toast', {
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

export default connectComponentToProps(
  ToastComponent,
  (state: any, ownProps: ToastProps) => {
    return {
      toast: selectToast(state),
      ...ownProps
    }
  },
  {
    onClose: closeToast
  }
)
