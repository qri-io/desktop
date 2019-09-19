import * as React from 'react'
import classNames from 'classnames'

export interface SpinnerProps {
  center?: boolean
  button?: boolean
  white?: boolean
  large?: boolean
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ center, button, white, large }) =>
  <div className={classNames('spinner', { 'spinner-button': button, 'spinner-spinner': !button, 'spinner-center': center, 'spinner-small': !large })}>
    <div className={`spinner-block spinner-rect1 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect2 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect3 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect4 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect5 ${white ? 'spinner-white' : 'spinner-dark'}`} />
  </div>

export default Spinner
