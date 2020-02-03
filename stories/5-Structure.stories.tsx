import React from 'react'
import ColumnType from '../app/components/structure/ColumnType'
import Overlay from '../app/components/overlay/Overlay'
import TabPicker from '../app/components/nav/TabPicker'
import DataType from '../app/components/item/DataType'
import TypePickerOverlay from '../app/components/overlay/TypePickerOverlay'
import TypePicker, { typesAndDescriptions } from '../app/components/structure/TypePicker'
import SchemaItem from '../app/components/item/SchemaItem'
import { Schema as ISchema } from '../app/models/dataset'
import Schema from '../app/components/structure/Schema'
import Structure from '../app/components/Structure'

export default {
  title: 'Structure',
  parameters: {
    notes: ''
  }
}

const sampleSchema: ISchema = {
  type: 'array',
  items: {
    items: [
      {
        'title': 'Numerical',
        'description': 'The integer as represented by a number',
        'type': ['integer', 'number']
      },
      {
        'title': 'English',
        'description': 'The numerical value, in english',
        'type': 'string'
      },
      {
        'title': 'Spanish',
        'description': 'The numerical value, in spanish',
        'type': 'not a type'
      },
      {
        'title': 'Misc',
        'description': 'Can be anything'
      }
    ],
    type: 'array'
  }
}

// const sampleStructure = {
//   schema: sampleSchema,
//   format: 'csv',
//   length: 265000,
//   entries: 2350,
//   errors: 3,
//   depth: 2,
//   strict: false,
//   checksum: 'Qmb9Gy14GuCjrhRSjGJQpf5JkgdEdbZrV81Tz4x3ZDreY3'
// }

// export const structure = () => {
//   return (
//     <div style={{ display: 'flex', justifyContent:'center', alignItems: 'center' }}>
//       <Structure data={sampleStructure} />
//     </div>
//   )
// }

export const schema = () => {
  const [schema, setSchema] = React.useState(sampleSchema)

  const onAccept = (row: number) => {
    return (field: string) => {
      return (value: string) => {
        setSchema((prev) => {
          let s = { ...prev }
          try {
            s.items.items[row][field] = value
          } catch (e) {
            throw e
          }
          return s
        })
      }
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20, width: 700 }}>
      <Schema schema={schema} onAccept={onAccept} />
    </div>
  )
}

schema.story = {
  name: 'Schema',
  parameters: { note: 'The initial schema given has 1) multiple types, 2) a single type, 3) an unknown type, and 4) no type' }
}

export const nonEditableSchema = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20, width: 700 }}>
      <Schema schema={sampleSchema} editable={false}/>
    </div>
  )
}

export const schemaItem = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20, width: 700 }}>
      <SchemaItem
        onAccept={(field: string) => { return (value: string) => console.log(field, value) }}
        title='the title'
        type='string'
        description='here is my description yay!'
        validation=''
        row={1}
      />
    </div>
  )
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
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
      <div>
        Non-editable
        <TypePicker type='string' name='column1' expanded editable={false}/>
      </div>
      <div>
        Editable
        <TypePicker onPickType={() => {}} type='string' name='column1' expanded />
      </div>
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
