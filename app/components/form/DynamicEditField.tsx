import * as React from 'react'
import classNames from 'classnames'

interface DynamicEditFieldProps {
  placeholder: string
  // validate function expects a value string and returns a boolean
  // called when user changes input value
  // true means the input is valid, false means it's invalid
  validate?: (value: string) => boolean
  onAccept: (value: string) => void
  value: string
  allowEmpty: boolean
  width?: number
  maxLength?: number
  expanded?: boolean
  name: string
}

const DynamicEditField: React.FunctionComponent<DynamicEditFieldProps> = ({
  placeholder = '',
  value,
  name,
  validate,
  onAccept,
  allowEmpty = true,
  width,
  maxLength,
  expanded = false
}) => {
  const [ newValue, setNewValue ] = React.useState(value)
  const [ isValid, setIsValid ] = React.useState(true)

  const commitEdit = () => {
    // TODO (ramfox): for some reason, the only way I can get the actual updated
    // state value is by hacking into the `setNewValue` function, which passes
    // the previous value into a function
    // wtf do i have to do this?!?
    let newValueHack = ''
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
    } else if (onAccept) {
      onAccept(newValueHack)
    }
    // drop focus
    ref.current.blur()
  }

  const cancelEdit = () => {
    setNewValue(value)
    setIsValid(true)
  }

  const handleKeyDown = (e: any) => {
    // cancel on esc
    if (e.keyCode === 27) {
      cancelEdit()
    }

    // submit on enter or tab
    if ((e.keyCode === 13) || (e.keyCode === 9)) {
      commitEdit()
    }
  }

  // use a ref so we can set up a click handler
  const ref: any = React.useRef()

  const handleMousedown = (e: MouseEvent) => {
    const { target } = e
    // allows the user to resize the sidebar when editing the dataset name
    if (target.classList.contains('resize-handle')) return

    if (!ref.current.contains(target)) {
      commitEdit()
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
    let { value } = e.target
    if (validate) {
      setIsValid(validate(value))
    }
    setNewValue(value)
  }

  const handleInput = (e) => {
    console.log(e.target.style)
    console.log(e.target.scrollHeight)
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  if (expanded) {
    return (<textarea
      // style={{ height: ref.current.scrollHeight }}
      onInput={handleInput}
      onChange={handleChange}
      ref={ref}
      id={name}
      className={classNames('dynamic-edit-field', { 'invalid': !isValid })}
      placeholder={placeholder}
      value={newValue}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      maxLength={maxLength}
    />)
  }

  return (
    <input
      style={{ width }}
      onChange={handleChange}
      type='text'
      ref={ref}
      id={name}
      className={classNames('dynamic-edit-field', { 'invalid': !isValid })}
      placeholder={placeholder}
      value={newValue}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      maxLength={maxLength}
    />
  )
}

export default DynamicEditField
