import * as React from 'react'

import ColumnType from './ColumnType'
import TypePickerOverlay from '../overlay/TypePickerOverlay'
import { DataTypes } from '../item/DataType'
import TabPicker from '../nav/TabPicker'

interface TypePickerProps {
  name: string | number
  type: DataTypes | DataTypes[]
  onPickType?: (value: DataTypes | DataTypes[] | undefined, e: React.SyntheticEvent) => void
  expanded?: boolean
  // editable defaults to true
  editable?: boolean
}

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

const handleUnknownTypes = (types: DataTypes | DataTypes[]): DataTypes | DataTypes[] => {
  // if there is an unknown type, return 'any'
  const typeList = typesAndDescriptions.map((el) => el.type)
  if (!types ||
      (typeof types === 'string' && !typeList.includes(types)) ||
      (Array.isArray(types) && (types.length === 0 || types.some((el) => !typeList.includes(el))))) {
    return 'any'
  }
  return types
}

const TypePicker: React.FunctionComponent<TypePickerProps> = ({
  name,
  type = 'any',
  onPickType,
  expanded = false,
  editable = true
}) => {
  const [pickedType, setPickedType] = React.useState(handleUnknownTypes(type))
  const [isOverlayOpen, setOverlayOpen] = React.useState(false)

  const tabs = ['single', 'multi']
  const [activeTab, setActiveTab] = React.useState(Array.isArray(type) ? 'multi' : 'single')

  const handleCancel = () => {
    setOverlayOpen(false)
  }
  const handlePickType = (e: React.MouseEvent) => {
    let picked = e.target.getAttribute('data-value')
    if (typeof pickedType === 'string') {
      setPickedType(picked)
      if (onPickType) {
        let val = picked
        if (val === 'any') {
          val = undefined
        }
        onPickType(val, e)
      }
    } else {
      let pickedTypeList: DataTypes[]
      if (picked === 'any') {
        //
        // if they picked 'any', only 'any' should be picked
        // since 'any' emcompasses all types
        pickedTypeList = ['any']
      } else if (pickedType.includes(picked)) {
        //
        // if an item was already picked and the user clicks it again
        // we should remove the item from the list
        pickedTypeList = pickedType.filter((type: DataTypes) => type !== picked)
      } else {
        //
        // otherwise iterate through the list, filtering out 'any'
        // in the list, including the one just picked
        pickedTypeList = pickedType.filter((el: DataTypes) => el !== 'any')
        pickedTypeList.push(picked)
      }

      setPickedType(pickedTypeList)
      if (onPickType) {
        // if there is only one item choosen,
        let val: DataTypes | DataTypes[] | undefined = pickedTypeList
        if (val.length === 1) {
          val = val[0]
        }
        // if the value is 'any', we don't want to make
        // any type assertions, let's remove 'type' from this
        // row and field
        if (val === 'any') {
          val = undefined
        }
        onPickType(val, e)
      }
    }
  }

  const handleToggleOverlay = () => {
    setOverlayOpen(!isOverlayOpen)
  }

  const handleTabClick = (e: React.MouseEvent) => {
    const tab = e.target.getAttribute('data-value')
    setActiveTab(tab)
  }

  const tabPicker = <TabPicker
    onClick={handleTabClick}
    size='sm'
    color='dark'
    tabs={tabs}
    activeTab={activeTab}
  />

  React.useEffect(() => {
    if (activeTab === 'single' && Array.isArray(pickedType)) {
      if (pickedType.length === 0) setPickedType('any')
      else setPickedType(pickedType[0])
    }
    if (activeTab === 'multi' && typeof pickedType === 'string') {
      setPickedType([pickedType])
    }
  }, [activeTab])

  return (
    <div className='type-picker'>
      <input type='hidden' name={`${name}-type`} value={pickedType} />
      <ColumnType
        type={pickedType}
        active={isOverlayOpen}
        onClick={editable ? handleToggleOverlay : undefined}
        expanded={expanded}
      />
      <div className='type-picker-overlay'>
        <TypePickerOverlay
          onCancel={handleCancel}
          onClick={handlePickType}
          onTabClick={() => {}}
          value={pickedType}
          open={isOverlayOpen}
          navigation={tabPicker}
          activeTab={activeTab}
        />
      </div>
    </div>
  )
}

export default TypePicker
