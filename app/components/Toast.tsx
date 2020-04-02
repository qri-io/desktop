import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { Action, Dispatch, bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'

import { Toast } from '../models/store'

import { closeToast } from '../actions/ui'

import { selectToast } from '../selections'

interface ToastProps {
  toast: Toast
  timeout: number
  onClose: () => Action
}

export const ToastComponent: React.FunctionComponent<ToastProps> = (props: ToastProps) => {
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

const mapStateToProps = (state: any, ownProps: ToastProps) => {
  return {
    toast: selectToast(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    onClose: closeToast
  }, dispatch)
}

const mergeProps = (props: any, actions: any): ToastProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ToastComponent)
