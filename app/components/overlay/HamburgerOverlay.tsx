import * as React from 'react'

import { DatasetAction } from '../../models/dataset'

import Overlay from './Overlay'

interface TypePickerOverlayProps {
  // function to close the picker
  onCancel: () => void
  // list of actions to take in hamburger
  items: DatasetAction[] | React.ReactElement[]
  // when open is true, the overlay is visible
  open: boolean
}

function isDatasetAction (data: DatasetAction | React.ReactElement): boolean {
  return (data as React.ReactElement).props === undefined
}

const HamburgerOverlay: React.FunctionComponent<TypePickerOverlayProps> = ({
  onCancel,
  items,
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
      {items && items.map((item: DatasetAction | React.ReactElement, i: number) => {
        if (isDatasetAction(item)) {
          return (
            <div
              key={i}
              id={`hamburger-action-${item.text.toLowerCase()}`}
              onClick={(e: MouseEvent<HTMLDivElement, MouseEvent>) => {
                item.onClick(e)
                onCancel()
              }}
            >
              {item.text}
            </div>
          )
        }
        return item
      })}
    </Overlay>
  )
}

export default HamburgerOverlay
