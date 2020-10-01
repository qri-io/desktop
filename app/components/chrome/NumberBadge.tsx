import React from 'react'

interface NumberBadgeProps {
  size: 'sm' | 'md' | 'lg' | 'xl'
  count: number
  onClick?: (e?: React.MouseEvent) => void
}

const NumberBadge: React.FC<NumberBadgeProps> = ({ count, onClick, size = 'sm' }) => (
  <div className={`number-badge ${size}`} onClick={onClick}>
    {count}
  </div>
)

export default NumberBadge
