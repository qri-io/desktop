import React from 'react'
import { ActionButtonProps } from './ActionButton'
import HamburgerOverlay from '../overlay/HamburgerOverlay'
import Icon from './Icon'

interface HamburgerProps {
  data: ActionButtonProps[]
}

const Hamburger: React.FunctionComponent<HamburgerProps> = (props) => {
  const { data } = props

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
    <div className='hamburger' onClick={() => setIsOpen(!isOpen)}>
      <div className='hamburger-icon'
        onMouseEnter={onHamburgerEnter}
        onMouseLeave={onHamburgerLeave}
      >
        <Icon icon='hamburger' size='lg' color={isOpen ? 'dark' : iconColor} />
      </div>
      <div className='hamburger-overlay'>
        <HamburgerOverlay
          data={data}
          open={isOpen}
          onCancel={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}

export default Hamburger
