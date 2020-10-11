import React from 'react'

import { DatasetAction } from '../../models/dataset'

import HamburgerOverlay from '../overlay/HamburgerOverlay'
import Icon from './Icon'

interface HamburgerProps {
  id: string
  items?: DatasetAction[] | React.ReactElement[]
}

const Hamburger: React.FunctionComponent<HamburgerProps> = (props) => {
  const { items, id } = props

  const [isOpen, setIsOpen] = React.useState(false)
  const [iconColor, setIconColor] = React.useState<'light' |'medium' | 'dark'>('medium')

  const onHamburgerEnter = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIconColor('dark')
  }

  const onHamburgerLeave = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIconColor('medium')
  }

  return (
    <div className='hamburger' id={id} onClick={() => setIsOpen(!isOpen)}>
      <div className='hamburger-icon'
        onMouseEnter={onHamburgerEnter}
        onMouseLeave={onHamburgerLeave}
      >
        <Icon icon='hamburger' color={isOpen ? 'dark' : iconColor} />
      </div>
      <div className='hamburger-overlay'>
        <HamburgerOverlay
          items={items}
          open={isOpen}
          onCancel={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}

export default Hamburger
