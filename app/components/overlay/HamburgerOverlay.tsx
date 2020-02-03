import * as React from 'react'
import Overlay from './Overlay'
import { ActionButtonProps } from '../chrome/ActionButton'

interface TypePickerOverlayProps {
  // function to close the picker
  onCancel: () => void
  // list of actions to take in hamburger
  data: ActionButtonProps[]
  // when open is true, the overlay is visible
  open: boolean
}

const HamburgerOverlay: React.FunctionComponent<TypePickerOverlayProps> = ({
  onCancel,
  data,
  open = true
}) => {
  return (
    <Overlay
      title=''
      onCancel={onCancel}
      width={220}
      height={200}
      open={open}
    >
      {data.map((item, i) => {
        return (
          <div
            key={i}
            onClick={(e: MouseEvent<HTMLDivElement, MouseEvent>) => {
              item.onClick(e)
              onCancel()
            }}
          >
            {item.text}
          </div>
        )
      })}
    </Overlay>
  )
}

export default HamburgerOverlay
