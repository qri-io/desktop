import React from 'react'

interface ArrowProps {
  disabled?: boolean
}

const BackArrow: React.FC<ArrowProps> = ({ disabled = false }) => (
  <svg width="20px" height="18px" viewBox="0 0 20 18" version="1.1">
    <g id="chrome/back_button" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
      <g id="Group" transform="translate(3.000000, 2.000000)" stroke={disabled ? '#c2c2c2' : '#4D4D4D'} strokeWidth="4">
        <line x1="14.75" y1="7.04861111" x2="1.75" y2="7.04861111" id="Line-3"></line>
        <polyline id="Path-3" points="6.125 0.243055556 0.125 7.04861111 6.125 13.8541667"></polyline>
      </g>
    </g>
  </svg>
)

export default BackArrow
