// a component that displays the dataset reference including edit-in-place UI
// for dataset rename
import React from 'react'
import { AnyAction } from 'redux'
import classNames from 'classnames'

import { QriRef } from '../models/qriRef'

import { connectComponentToPropsWithRouter } from '../utils/connectComponentToProps'
import { validateDatasetName, ValidationError } from '../utils/formValidation'

import { renameDataset } from '../actions/api'

interface DatasetReferenceProps {
  /**
   * the qriRef is particularly important in this component: it's where we get
   * the username and original dataset name
   */
  qriRef: QriRef
  /**
   * the optional isValid function allows us to inject additional actions when
   * the dataset rename has been validated or invalidated
   */
  isValid?: (err: ValidationError) => void
  /**
   * if used as a container, the DatasetReference will get the `renameDataset`
   * api action as it's submit function. The `DatasetReferenceComponent` may
   * or may not use the onSubmit action
   */
  onSubmit?: (username: string, name: string, newName: string) => Promise<AnyAction>
  /**
   * the optional onChange function allows us to inject additional actions when
   * any input has changed
   */
  onChange?: (newName: string) => void
  /**
   * if focusOnFirstRender is true, the dataset name input will be focused when the
   * component is first rendered
   */
  focusOnFirstRender?: boolean
  /**
   * default true: when inline is true, the UI will not show that the reference
   * is editable until clicked. When false, the component looks like a more
   * traditional editable inpu
   */
  inline?: boolean
}

export const DatasetReferenceComponent: React.FunctionComponent<DatasetReferenceProps> = (props) => {
  const {
    qriRef,
    onSubmit,
    onChange,
    isValid,
    inline = true,
    focusOnFirstRender = false
  } = props

  const { username, name } = qriRef
  const [ nameEditing, setNameEditing ] = React.useState(focusOnFirstRender)
  const [ newName, setNewName ] = React.useState(name)
  const [ invalidErr, setInvalidErr ] = React.useState<ValidationError | null>(null)

  const datasetSelected = username !== '' && name !== ''

  // use a ref so we can set up a click handler
  const nameRef: any = React.useRef(null)

  const confirmRename = (username: string, name: string, newName: string) => {
    // cancel if no change, change invalid, or empty
    if (name === newName || invalidErr || newName === '') {
      cancelRename()
    } else {
      if (onSubmit) {
        onSubmit(username, name, newName)
          .then(() => {
            setNameEditing(false)
          })
        return
      }
      setNameEditing(false)
    }
  }

  const cancelRename = () => {
    setNewName(name)
    onChange && onChange(name)
    setInvalidErr(null)
    isValid && isValid(null)
    setNameEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // cancel on esc
    if (e.keyCode === 27) {
      cancelRename()
    }

    // submit on enter or tab
    if ((e.keyCode === 13) || (e.keyCode === 9)) {
      e.preventDefault()
      inline && confirmRename(username, name, newName)
    }
  }

  const handleMousedown = (e: MouseEvent) => {
    const { target } = e
    // allows the user to resize the sidebar when editing the dataset name
    if (target.classList.contains('resize-handle')) return

    if (nameRef.current.isSameNode(target)) {
      setNameEditing(true)
      return
    }

    if (!nameRef.current.contains(target)) {
      e.preventDefault()
      inline && confirmRename(username, name, newName)
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    document.addEventListener('mousedown', handleMousedown, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
      document.removeEventListener('mousedown', handleMousedown, false)
    }
  }, [ name, newName ])

  const handleInputChange = (e: any) => {
    let { value } = e.target
    const err = validateDatasetName(value)
    setInvalidErr(err)
    isValid && isValid(err)
    setNewName(value)
    onChange && onChange(value)
  }

  // when the input is focused, set the cursor to the left, and scroll all the way to the left
  const onFocus = () => {
    const el = document.getElementById('dataset-name') as HTMLInputElement
    el.scrollLeft = 0
  }

  return (
    <div id='dataset-reference' className='dataset-reference'>
      <div className={classNames('dataset-username', { 'input-label': !inline })}>{username}/</div>
      <div className={classNames('dataset-name', { 'no-pointer': !datasetSelected, 'text-input-container': !inline })} id='dataset-name' ref={nameRef}>
        { (!inline || (nameEditing && datasetSelected)) && <input
          id='dataset-name-input'
          className={classNames('input', { 'inline-input': inline, invalid: invalidErr })}
          type='text'
          value={newName}
          maxLength={150}
          onChange={handleInputChange}
          autoFocus
          onFocus={onFocus}
          pattern='^(?![0_9])[a-z0-9_]{1,144}$'
        /> }
        { !nameEditing && (<>{name}</>)}
      </div>
    </div>
  )
}

export default connectComponentToPropsWithRouter<DatasetReferenceProps>(
  DatasetReferenceComponent,
  {},
  { onSubmit: renameDataset }
)
