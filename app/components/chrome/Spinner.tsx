import * as React from 'react'

export interface SpinnerProps {
  center?: boolean
  button?: boolean
  white?: boolean
  large?: boolean
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ center, button, white, large }) =>
  <div className={`${button ? 'spinner-button' : 'spinner-spinner'} ${center && 'spinner-center'} ${!large && 'spinner-small'}`}>
    <div className={`spinner-block spinner-rect1 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect2 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect3 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect4 ${white ? 'spinner-white' : 'spinner-dark'}`} />
    <div className={`spinner-block spinner-rect5 ${white ? 'spinner-white' : 'spinner-dark'}`} />
  </div>

export default Spinner
