import * as React from 'react'
import classNames from 'classnames'

interface DynamicEditFieldProps {
  placeholder?: string
  // validate function expects a value string and returns a boolean
  // called when user changes input value
  // true means the input is valid, false means it's invalid
  validate?: (value: string) => boolean
  onChange?: (name: string, value: string, e?: React.SyntheticEvent) => void
  value: string
  allowEmpty: boolean
  minWidth?: number
  maxLength?: number
  expanded?: boolean
  name: string
  row?: number
  large?: boolean
  // editable defaults to true
  editable?: boolean
}

const DynamicEditField: React.FunctionComponent<DynamicEditFieldProps> = ({
  placeholder = '',
  value,
  name,
  validate,
  onChange,
  allowEmpty = true,
  minWidth,
  maxLength,
  expanded = false,
  row = 0,
  large = false,
  editable = true
}) => {
  const [ newValue, setNewValue ] = React.useState(value)
  const [ isValid, setIsValid ] = React.useState(true)

  const commitEdit = (e: React.SyntheticEvent) => {
    // TODO (ramfox): for some reason, the only way I can get the actual updated
    // state value is by hacking into the `setNewValue` function, which passes
    // the previous value into a function
    // wtf do i have to do this?!?
    let newValueHack = newValue
    setNewValue((prev) => {
      newValueHack = prev
      return prev
    })
    let isValidHack = false
    setIsValid((prev) => {
      isValidHack = prev
      return prev
    })
    if ((value === newValueHack) || !isValidHack || (!allowEmpty && newValueHack === '')) {
      cancelEdit()
    } else if (onChange) {
      onChange(name, newValueHack, e)
    }
    // drop focus
    ref.current.blur()
  }

  const cancelEdit = () => {
    setNewValue(value)
    ref.current.innerHTML = value
    setIsValid(true)
    ref.current.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // cancel on esc
    if (e.keyCode === 27) {
      cancelEdit()
    }

    // submit on enter or tab
    if ((e.keyCode === 13) || (e.keyCode === 9)) {
      commitEdit(e)
    }
  }

  // use a ref so we can set up a click handler
  const ref: any = React.useRef()

  const handleMousedown = (e: React.MouseEvent) => {
    const { target } = e
    // allows the user to resize the sidebar when editing the dataset name
    if (target.classList.contains('resize-handle')) return

    if (!ref.current.contains(target)) {
      commitEdit(e)
    }
  }

  const [focused, setFocused] = React.useState(false)

  // only add event listeners when we are focused
  React.useEffect(() => {
    if (focused) {
      document.addEventListener('keydown', handleKeyDown, false)
      document.addEventListener('mousedown', handleMousedown, false)
    } else {
      document.removeEventListener('keydown', handleKeyDown, false)
      document.removeEventListener('mousedown', handleMousedown, false)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
      document.removeEventListener('mousedown', handleMousedown, false)
    }
  }, [focused])

  const handleChange = async (e: any) => {
    let value = e.target.innerHTML
    if (maxLength && value.length > maxLength) {
      return
    }
    if (validate) {
      setIsValid(validate(value))
    }
    setNewValue(value)
  }

  const onFocus = () => {
    setFocused(true)
    ref.current.scrollLeft = 0
  }

  const onBlur = () => {
    setFocused(false)
    ref.current.scrollLeft = 0
  }

  return (
    <div style={{ minWidth }} className={classNames('dynamic-edit-field', { 'invalid': !isValid, 'dynamic-edit-field-large': large, 'focused': focused, 'dynamic-edit-field-editable': editable })} >
      <div
        suppressContentEditableWarning={true}
        className={classNames({ 'expanded': expanded })}
        contentEditable={editable}
        onInput={handleChange}
        ref={ref}
        id={`${name}-${row}`}
        data-placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      >{value}</div>
    </div>
  )
}

export default DynamicEditField
