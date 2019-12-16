import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Spinner from '../chrome/Spinner'

// Mimicing React's DialogHeader
interface IDialogHeaderProps {
  /**
   * The dialog title text. Will be rendered top and center in a dialog.
   * You can also pass JSX for custom styling
   */
  readonly title: string | JSX.Element

  /**
   * An optional id for the h1 element that contains the title of this
   * dialog. Used to aid in accessibility by allowing the h1 to be referenced
   * in an aria-labeledby/aria-describedby attributed
   */
  readonly titleId?: string

  /**
   * Whether or not the implementing dialog is dismissable. This controls
   * whether or not the dialog header renders a close button or not.
   */
  readonly dismissable: boolean

  /**
   * Event triggered when the dialog is dismissed by the user in the
   * ways described in the dismissable prop.
   */
  readonly onDismissed?: () => void

  /**
   * Whether or not the dialog contents are currently involved in processing
   * data, executing an asynchronous operation or by other means working.
   * Setting this value will render a spinning progress icon in the header.
   * Note that the spinning icon will temporarily replace the dialog icon
   * (if present) for the duration of the loading operation.
   */
  readonly loading?: boolean
}

/**
 * A high-level component for Dialog headers.
 *
 * This component should typically not be used by consumers as the title prop
 * of the Dialog component should suffice. There are, however, cases where
 * custom content needs to be rendered in a dialog and in that scenario it
 * might be necessary to use this component directly.
 */
const DialogHeader: React.FunctionComponent<IDialogHeaderProps> = ({ onDismissed, dismissable = true, titleId, title, loading, children }) => {
  const onCloseButtonClick = () => {
    if (onDismissed) {
      onDismissed()
    }
  }

  const renderCloseButton = () => {
    if (!dismissable) {
      return null
    }

    // We're intentionally using <a> here instead of <button> because
    // we can't prevent chromium from giving it focus when the the dialog
    // appears. Setting tabindex to -1 doesn't work. This might be a bug,
    // I don't know and we may want to revisit it at some point but for
    // now an anchor will have to do.
    return (
      <a
        className="close"
        onClick={onCloseButtonClick}
        aria-label="close"
        role="button" ><FontAwesomeIcon icon={faTimes} size='lg'/></a>
    )
  }

  const renderTitle = () => {
    return <div className='title' id={titleId}>{title}</div>
  }

  const spinner = loading ? <Spinner /> : null

  return (
    <header className="dialog-header">
      {renderTitle()}
      {spinner}
      {renderCloseButton()}
      {children}
    </header>
  )
}

export default DialogHeader
