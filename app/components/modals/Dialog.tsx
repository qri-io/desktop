import * as React from 'react'
import DialogHeader from './header'

/**
 * Title bar height in pixels. Values taken from 'app/styles/_variables.scss'.
 */
// const titleBarHeight = __DARWIN__ ? 22 : 28
const titleBarHeight = 22

export interface IDialogProps {
  /**
   * An optional dialog title. Most, if not all dialogs should have
   *  When present the Dialog renders a DialogHeader element
   * containing an icon (if the type prop warrants it), the title itself
   * and a close button (if the dialog is dismissable).
   *
   * By omitting this consumers may use their own custom DialogHeader
   * for when the default component doesn't cut it.
   */
  readonly title?: string | JSX.Element

  /**
   * Whether or not the dialog should be dismissable. A dismissable dialog
   * can be dismissed either by clicking on the backdrop or by clicking
   * the close button in the header (if a header was specified). Dismissal
   * will trigger the onDismissed event which callers must handle and pass
   * on to the dispatcher in order to close the dialog.
   *
   * A non-dismissable dialog can only be closed by means of the component
   * implementing a dialog. An example would be a critical error or warning
   * that requires explicit user action by for example clicking on a button.
   *
   * Defaults to true if omitted.
   */
  readonly dismissable?: boolean

  /**
   * Event triggered when the dialog is dismissed by the user in the
   * ways described in the dismissable prop.
   */
  readonly onDismissed: () => void

  /**
   * An optional id for the rendered dialog element.
   */
  readonly id?: string

  /**
   * An optional dialog type. A warning or error dialog type triggers custom
   * styling of the dialog, see _dialog.scss for more detail.
   *
   * Defaults to 'normal' if omitted
   */
  readonly type?: 'normal' | 'warning' | 'error'

  /**
   * An event triggered when the dialog form is submitted. All dialogs contain
   * a top-level form element which can be triggered through a submit button.
   *
   * Consumers should handle this rather than subscribing to the onClick event
   * on the button itself since there may be other ways of submitting a specific
   * form (such as Ctrl+Enter).
   */
  readonly onSubmit?: () => void

  /**
   * Whether or not the dialog should be disabled. All dialogs wrap their
   * content in a <fieldset> element which, when disabled, causes all descendant
   * form elements and buttons to also become disabled. This is useful for
   * consumers implementing a typical save dialog where the save action isn't
   * instantaneous (such as a sign in dialog) and they need to ensure that the
   * user doesn't continue mutating the form state or click buttons while the
   * save/submit action is in progress. Note that this does not prevent the
   * dialog from being dismissed.
   */
  readonly disabled?: boolean

  /**
   * Whether or not the dialog contents are currently involved in processing
   * data, executing an asynchronous operation or by other means working.
   * Setting this value will render a spinning progress icon in the dialog
   * header (if the dialog has a header). Note that the spinning icon
   * will temporarily replace the dialog icon (if present) for the duration
   * of the loading operation.
   */
  readonly loading?: boolean
}

/**
 * A general purpose, versatile, dialog component which utilizes the new
 * <dialog> element. See https://demo.agektmr.com/dialog/
 *
 * A dialog is opened as a modal that prevents keyboard or pointer access to
 * underlying elements. It's not possible to use the tab key to move focus
 * out of the dialog without first dismissing it.
 */
const Dialog: React.FunctionComponent<IDialogProps> = ({ disabled, loading, id, onSubmit, type, onDismissed, dismissable, title, children }) => {
  const [disableClickDismissal, setDisableClickDismissal] = React.useState(true)
  let dialogElement: HTMLElement | null = null

  const onDialogCancel = (e: Event) => {
    e.preventDefault()
    onDismiss()
  }

  const isDismissable = () => {
    return dismissable === undefined || dismissable
  }

  const onDialogClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isDismissable() === false) {
      return
    }

    // This event handler catches the onClick event of buttons in the
    // dialog. Ie, if someone hits enter inside the dialog form an onClick
    // event will be raised on the the submit button which isn't what we
    // want so we'll make sure that the original target for the event is
    // our own dialog element.
    if (e.target !== dialogElement) {
      return
    }

    const isInTitleBar = e.clientY <= titleBarHeight

    if (isInTitleBar) {
      return
    }

    // Ignore the first click right after the window's been focused. It could
    // be the click that focused the window, in which case we don't wanna
    // dismiss the dialog.
    if (disableClickDismissal) {
      setDisableClickDismissal(false)
      return
    }

    // Figure out if the user clicked on the backdrop or in the dialog itself.
    const rect = e.currentTarget.getBoundingClientRect()

    // http://stackoverflow.com/a/26984690/2114
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width

    if (!isInDialog) {
      e.preventDefault()
      onDismiss()
    }
  }

  const onDialogRef = (e: HTMLElement | null) => {
    // We need to explicitly subscribe to and unsubscribe from the dialog
    // element as react doesn't yet understand the element and which events
    // it has.
    if (!e) {
      if (dialogElement) {
        dialogElement.removeEventListener('cancel', onDialogCancel)
        dialogElement.removeEventListener('keydown', onKeyDown)
      }
    } else {
      e.addEventListener('cancel', onDialogCancel)
      e.addEventListener('keydown', onKeyDown)
    }

    dialogElement = e
  }

  const onKeyDown = (event: KeyboardEvent) => {
    // const shortcutKey = __DARWIN__ ? event.metaKey : event.ctrlKey
    const shortcutKey = event.metaKey
    if ((shortcutKey && event.key === 'w') || event.key === 'Escape') {
      onDialogCancel(event)
    }
  }

  const onDismiss = () => {
    if (isDismissable()) {
      if (onDismissed) {
        onDismissed()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (onSubmit) {
      onSubmit()
    } else {
      onDismiss()
    }
  }

  const renderHeader = () => {
    if (!title) {
      return null
    }

    return (
      <DialogHeader
        title={title}
        dismissable={isDismissable()}
        onDismissed={onDismiss}
        loading={loading}
      />
    )
  }
  return (
    <dialog
      open
      ref={onDialogRef}
      id={id}
      onClick={onDialogClick}
      className={`${type === 'error' ? 'error' : type === 'warning' ? 'warning' : ''}`}
    >
      {renderHeader()}
      <form onSubmit={handleSubmit}>
        <fieldset disabled={disabled}>
          {children}
        </fieldset>
      </form>
    </dialog>
  )
}

export default Dialog