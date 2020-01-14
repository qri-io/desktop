import React from 'react'
import ColumnType from '../app/components/structure/ColumnType'
import Overlay from '../app/components/overlay/Overlay'
import TabPicker from '../app/components/nav/TabPicker'
import DataType from '../app/components/item/DataType'
import TypePickerOverlay from '../app/components/overlay/TypePickerOverlay'
import TypePicker, { typesAndDescriptions } from '../app/components/structure/TypePicker'

export default {
  title: 'Structure',
  parameters: {
    notes: ''
  }
}

export const typePickerList = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      List of TypePickers:
      {typesAndDescriptions.map((el, i) => {
        return (
          <div key={i} style={{ margin: 20 }}>
            <TypePicker onPickType={() => {}} type={el.type} name={`column-${i}`} />
          </div>
        )
      })}
    </div>
  )
}

export const typePicker = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <TypePicker onPickType={() => {}} type='string' name='column1'/>
    </div>
  )
}

export const typePickerOverlay = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <TypePickerOverlay onCancel={() => {}} onClick={() => {}} onTabClick={() => {}} value='string'/>
    </div>
  )
}

export const columnTypes = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold' }}>Active</div>
        {typesAndDescriptions.map((el, i) => {
          return (
            <div key={i} style={{ margin: 15 }}>
              <ColumnType type={el.type} onClick={() => {}} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

columnTypes.story = {
  name: 'All Column Types',
  parameters: { note: 'each column type in the active state' }
}

export const overlay = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
      <Overlay height={300} width={200} title='title' onCancel={() => {}} open >
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
      </Overlay>
    </div>
  )
}

overlay.story = {
  name: 'Overlay',
  parameters: { note: 'overlay for the picker, will also be used elsewhere' }
}

export const tabPicker = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: 100 }}>
      <TabPicker tabs={['single', 'multi']} size= 'sm' color='dark' onClick={() => {}} activeTab='single'/>
      <TabPicker tabs={['status', 'history']} size= 'md' color='light' onClick={() => {}} activeTab='status'/>
    </div>
  )
}

tabPicker.story = {
  name: 'Tab Picker',
  parameters: { note: 'used in picker pop-over, but also can be used wherever we need tabs' }
}

export const dataType = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      { typesAndDescriptions.map((item, i) => {
        return (
          <DataType type={item.type} description={item.description} />
        )
      })}
    </div>
  )
}
