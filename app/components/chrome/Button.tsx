import * as React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import Spinner from './Spinner'

interface ButtonProps {
  id: string
  text: string // the text written on the button
  downloadName?: string // the name of the file that will be downloaded.
  // color should be one of 5 options:
  // dark - dark blue
  // danger - red
  // muted - white
  // primary - bright blue
  color: 'primary' | 'dark' | 'danger' | 'muted' // the color of the button, default is 'primary'
  onClick?: (e?: React.MouseEvent) => void | Promise<void> // function that will trigger when the button is clicked
  full?: boolean // when full is true, the button has width 100%
  loading?: boolean // when true, the button is disabled and the loading spinner replaces the text
  download?: string // the href of what you want to make available for download. Requires download and downloadName to function properly
  link?: string // location that clicking the button will send you
  disabled?: boolean // if true, the button is not clickable
  type?: string // can be download
  large?: boolean // if true, the button is a larger size
}

// Button is a the basic button used throughout the app
const Button: React.FunctionComponent<ButtonProps> = ({ color = 'primary',
  id,
  onClick,
  full,
  loading,
  downloadName,
  disabled,
  download,
  link,
  type,
  large,
  text }) => {
  let options: { [key: string]: any } = {}
  options['id'] = id
  options['className'] = classNames('btn', 'btn-' + color, { 'button-full': full, 'btn-large': large })
  options['disabled'] = loading || disabled
  options['onClick'] = onClick
  options['type'] = type

  if (link) {
    return (
      <Link to={link}>
        <button {...options}>
          {loading ? <Spinner button center={false} white large={large} /> : text}
        </button>
      </Link>
    )
  }

  if (download) {
    options['href'] = download
    options['download'] = downloadName || true
    return (
      <a {...options}>
        {loading ? <Spinner button center={false} white large={large} /> : text}
      </a>
    )
  }
  return (
    <button {...options}>
      {loading ? <Spinner button center={false} white large={large} /> : text}
    </button>
  )
}

export default Button
