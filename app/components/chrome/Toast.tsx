import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

interface ToastProps {
  show: boolean
  type: ToastTypes
  text: string
  name: string
}

export enum ToastTypes {
  message = 'message',
  error = 'error',
  success = 'success'
}

const Toast: React.FunctionComponent<ToastProps> = (props: ToastProps) => {
  const { show, type, text, name } = props
  return (
    <CSSTransition
      in={show}
      classNames="body-toast"
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      <div id={`toast-${name}`} className={classNames('body-toast', type)}>{text}</div>
    </CSSTransition>
  )
}

export default Toast
