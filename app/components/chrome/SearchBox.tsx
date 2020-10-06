import * as React from 'react'
import Icon from '../chrome/Icon'

interface SearchBoxProps {
  id?: string
  value?: string // the text written on the button
  onChange?: any
  onEnter?: any
  big?: boolean
}

// SearchBox is a the basic button used throughout the app
const SearchBox: React.FunctionComponent<SearchBoxProps> = ({ id, value, onChange, onEnter, big }) => {
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (onEnter && e.keyCode === 13) {
      onEnter(e)
    }
  }
  return (
    <div className='filter-search-input searchbox'>
      <div className='filter-input-container'>
        <Icon icon='search' />
        <input id={id} className='input' value={value} onChange={onChange} onKeyUp={handleKeyUp} placeholder='search for datasets' />
      </div>
    </div>
  )
}

export default SearchBox
