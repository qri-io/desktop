import React from 'react'
import classNames from 'classnames'
import stripHtml from 'string-strip-html'

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

  React.useEffect(() => {
    if (value !== newValue) setNewValue(value)
  }, [value])

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
    if (!editable) return
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
        // TODO (ramfox): refactor as a util `onPasteSanitized` func
        onPaste={(e) => {
          e.preventDefault()
          e.stopPropagation()
          var paste = stripHtml(e.clipboardData.getData('text')).result

          // we currently don't allow new lines in the description
          paste = paste.replace(/[\r\n]/gm, " ")

          // the selection is where we want to paste over/into
          var sel = window.getSelection()
          if (!sel) {
            return
          }
          // get the start of the selection
          // get the end of the selection
          var text = e.currentTarget.innerText
          var start = sel.anchorOffset
          var end = sel.focusOffset
          if (!text) {
            text = ''
            start = 0
            end = 0
          }

          // if start is after end, switch them
          if (start - end > 0) {
            var temp = start
            start = end
            end = temp
          }

          // slice the pasted content
          text = text.slice(0, start) + paste + text.slice(end)
          // set the text to be the new content
          e.currentTarget.innerText = text
          // force an update!
          handleChange(e)

          // adjust the selection range to cover the pasted content
          var range = sel.getRangeAt(0)

          if (!e.currentTarget.firstChild) {
            return
          }
          // determine where the range should end
          // and adjust the range to start and end over the pasted content
          end = start + paste.length

          // because we striped html & line breaks we can trust
          // there is only one node in the current target
          range.setStart(e.currentTarget.firstChild, start)
          range.setEnd(e.currentTarget.firstChild, end)
        }}
      >{value}</div>
    </div>
  )
}

export default DynamicEditField
