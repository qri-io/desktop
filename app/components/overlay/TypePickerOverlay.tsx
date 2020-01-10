import * as React from 'react'
import Overlay from './Overlay'
import DataType, { DataTypes } from '../item/DataType'
import Icon from '../chrome/Icon'

interface TypePickerOverlayProps {
  // function to close the picker
  onCancel: () => void
  // function called when a data type is selected
  onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void
  // function called when a tab is selected
  onTabClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void
  // type or types that are currently selected
  value: string | string[]
  // is the overlay open?
  open: boolean
  // navigation component, if it exists
  navigation: Element | undefined
}

// TODO (ramfox):
// help with descriptions please
// this should be turned into a type and be moved into models
// then imported when needed
export const typesAndDescriptions: Array<{ type: DataTypes, description: string }> = [
  { type: 'any', description: 'accept any value type' },
  { type: 'string', description: 'text values' },
  { type: 'number', description: 'floating point numbers' },
  { type: 'integer', description: 'whole numbers' },
  { type: 'array', description: 'list of items' },
  { type: 'object', description: 'key/value pairs' },
  { type: 'boolean', description: 'true or false values' },
  { type: 'null', description: 'empty values' }
]

const TypePickerOverlay: React.FunctionComponent<TypePickerOverlayProps> = ({
  onCancel,
  onClick,
  value,
  navigation,
  open = true
}) => {
  const handleOnClick = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    onClick(e)
  }
  return (
    <Overlay
      title='data type'
      onCancel={onCancel}
      width={220}
      height={200}
      open={open}
      navigation={navigation}
    >
      {typesAndDescriptions.map((item, i) => {
        return (
          <div
            key={i}
            className='type-picker-overlay-row'
            onClick={handleOnClick}
            data-value={item.type}
          >
            <div className='icon-wrap'><Icon
              icon='check'
              size='xs'
              color={
                (typeof value === 'string' && value === item.type) || (Array.isArray(value) && value.includes(item.type)) ? 'dark' : 'light'}/>
            </div>
            <DataType type={item.type} description={item.description} />
          </div>
        )
      })}
    </Overlay>
  )
}

export default TypePickerOverlay
