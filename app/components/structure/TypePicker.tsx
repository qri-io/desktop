import * as React from 'react'

import ColumnType from './ColumnType'
import TypePickerOverlay from '../overlay/TypePickerOverlay'
import { DataTypes } from '../item/DataType'
import TabPicker from '../nav/TabPicker'

interface TypePickerProps {
  name: string
  type: DataTypes | DataTypes[]
  onPickType: () => void
}

const order = [
  'any',
  'string',
  'number',
  'integer',
  'object',
  'array',
  'boolean',
  'null'
]

const TypePicker: React.FunctionComponent<TypePickerProps> = ({
  name,
  type = 'any',
  onPickType
}) => {
  const [pickedType, setPickedType] = React.useState(type)
  const [isOverlayOpen, setOverlayOpen] = React.useState(false)

  const tabs = ['single', 'multi']
  const [activeTab, setActiveTab] = React.useState('single')

  const handleCancel = () => {
    setOverlayOpen(false)
  }
  const handlePickType = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (activeTab === 'single') setPickedType(e.target.getAttribute('data-value'))
    if (activeTab === 'multi') {
      const picked = e.target.getAttribute('data-value')
      let pickedTypeList
      if (pickedType.includes(picked)) {
        pickedTypeList = pickedType.filter((type) => type !== picked)
      } else {
        pickedTypeList = order.filter((type: DataTypes) => {
          return type === picked || pickedType.includes(type)
        })
      }
      setPickedType(pickedTypeList)
    }
    onPickType()
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
