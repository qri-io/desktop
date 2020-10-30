import React from 'react'

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
    <div className={`searchbox ${big && 'big'}`}>
      <svg className='search_icon' width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(1.000000, 0.000000)" fill="#CBCBCB" fillRule="nonzero" id="Shape">
            <path d="M18.7416052,17.2912801 L15.0415299,13.3971292 C14.8745255,13.2213651 14.6481417,13.1237184 14.4106244,13.1237184 L13.8056973,13.1237184 C14.829991,11.7449468 15.4386292,10.0107411 15.4386292,8.12420662 C15.4386292,3.63636364 11.9834937,0 7.71931462,0 C3.45513554,0 0,3.63636364 0,8.12420662 C0,12.6120496 3.45513554,16.2484132 7.71931462,16.2484132 C9.51182855,16.2484132 11.1596053,15.6078508 12.4696621,14.5298311 L12.4696621,15.1664876 C12.4696621,15.4164632 12.5624423,15.6547212 12.7294467,15.8304853 L16.429522,19.7246363 C16.7783757,20.0917879 17.3424794,20.0917879 17.6876219,19.7246363 L18.737894,18.6192755 C19.0867476,18.2521238 19.0867476,17.6584318 18.7416052,17.2912801 Z M7.71931462,13.1237184 C5.09548989,13.1237184 2.96896716,10.8895616 2.96896716,8.12420662 C2.96896716,5.36275754 5.09177868,3.12469485 7.71931462,3.12469485 C10.3431394,3.12469485 12.4696621,5.35885167 12.4696621,8.12420662 C12.4696621,10.8856557 10.3468506,13.1237184 7.71931462,13.1237184 Z"></path>
          </g>
        </g>
      </svg>
      <input id={id} value={value} onChange={onChange} onKeyUp={handleKeyUp} placeholder='search' />
    </div>
  )
}

export default SearchBox
