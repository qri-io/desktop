import * as React from 'react'

interface SearchBoxProps {
  id?: string
  value?: string // the text written on the button
  onChange?: any
}

// SearchBox is a the basic button used throughout the app
const SearchBox: React.FunctionComponent<SearchBoxProps> = ({ id, value, onChange }) => (
  <div className='searchbox'>
    <input id={id} value={value} onChange={onChange} placeholder='search' />
  </div>
)

export default SearchBox
