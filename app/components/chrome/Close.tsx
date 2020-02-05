import * as React from 'react'

interface CloseProps {
  right?: boolean
  onClick: (e: React.SyntheticEvent) => void
}

const Close: React.FunctionComponent<CloseProps> = ({ right, onClick }) => (
  <div className='close' style={{ float: right ? 'right' : 'none', cursor: 'pointer' }} onClick={onClick} >
    <svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1">
      <g id="nav/close" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
        <line x1="1" y1="1" x2="9" y2="9" id="Line-2" stroke="#4D4D4D" strokeWidth="2"></line>
        <line x1="9" y1="1" x2="1" y2="9" id="Line-3" stroke="#4D4D4D" strokeWidth="2"></line>
      </g>
    </svg>
  </div>
)

export default Close
