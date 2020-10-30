import React from 'react'
import { useDebounce } from 'use-debounce'
import TextInput, { TextInputProps } from './TextInput'

interface DebouncedTextInputProps extends TextInputProps {
  debounceTimer?: number
  onChange: (name: string, value: string) => void
}

const DebouncedTextInput: React.FunctionComponent<DebouncedTextInputProps> = ({ debounceTimer = 500, ...props }) => {
  const { value, name, onChange, onKeyDown } = props

  const [internalValue, setInternalValue] = React.useState(value)
  const [debouncedValue] = useDebounce(internalValue, debounceTimer)
  React.useEffect(() => {
    onChange(name, internalValue)
  }, [debouncedValue])

  // on change, update internalValue
  const handleChange = (e: React.ChangeEvent) => { setInternalValue(e.target.value) }

  return (
    <TextInput
      {...props}
      value={internalValue}
      onChange={handleChange}
      onKeyDown={onKeyDown}
    />
  )
}

export default DebouncedTextInput
