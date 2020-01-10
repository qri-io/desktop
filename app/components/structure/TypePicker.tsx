import * as React from 'react'

import ColumnType from './ColumnType'
import TypePickerOverlay from '../overlay/TypePickerOverlay'
import { DataTypes } from '../item/DataType'
import TabPicker from '../nav/TabPicker'

interface TypePickerProps {
  name: string | number
  type: DataTypes | DataTypes[]
  onPickType: (type: string | string[]) => void
  expanded: boolean
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

const TypePicker: React.FunctionComponent<TypePickerProps> = ({
  name,
  type = 'any',
  onPickType,
  expanded
}) => {
  const [pickedType, setPickedType] = React.useState(type)
  const [isOverlayOpen, setOverlayOpen] = React.useState(false)

  const tabs = ['single', 'multi']
  const [activeTab, setActiveTab] = React.useState('single')

  const handleCancel = () => {
    setOverlayOpen(false)
  }
  const handlePickType = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    let picked = e.target.getAttribute('data-value')
    if (activeTab === 'single') {
      setPickedType(picked)
      onPickType(picked)
    }
    if (activeTab === 'multi') {
      let pickedTypeList
      if (pickedType.includes(picked)) {
        pickedTypeList = pickedType.filter((type) => type !== picked)
      } else {
        pickedTypeList = typesAndDescriptions.filter((el: any) => {
          return el.type === picked || pickedType.includes(el.type)
        })
      }
      setPickedType(pickedTypeList)
      onPickType(pickedTypeList)
    }
  }

  const handleToggleOverlay = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setOverlayOpen(!isOverlayOpen)
  }

  const handleTabClick = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
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
        onClick={handleToggleOverlay}
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
