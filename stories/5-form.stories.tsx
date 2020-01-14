import React from 'react'
import DynamicEditField from '../app/components/form/DynamicEditField'

export default {
  title: 'Forms',
  parameters: {
    notes: ''
  }
}

export const dynamicEditField = () => {
  const [val, setVal] = React.useState('start')
  const [expanded, setExpanded] = React.useState(false)

  const validate = (value: string) => {
    // return !value.includes(' ')
    return true
  }
  return (
    <div style={{ margin: 50, padding: 40, display: 'flex' }}>
      <button style={{ display: 'inline-block', background: '#fff', marginRight: 10, borderRadius: 3, fontSize: 12, border: 'solid 1px #eee', padding: 4, width: 70, height: 30 }} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'close' : 'expand'}
      </button>
      <DynamicEditField
        name='edit'
        width={150}
        placeholder='enter text...'
        value={val}
        onAccept={setVal}
        allowEmpty={false}
        validate={validate}
        expanded={expanded}
      />
    </div>
  )
}

dynamicEditField.story = {
  name: 'Editable field that toggles btw closed and expanded view'
}

export const noEditDynamicEditField = () => {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div style={{ margin: 50, padding: 40, display: 'flex' }}>
      <button style={{ display: 'inline-block', background: '#fff', marginRight: 10, borderRadius: 3, fontSize: 12, border: 'solid 1px #eee', padding: 4, width: 70, height: 30 }} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'close' : 'expand'}
      </button>
      <DynamicEditField
        name='no-edit'
        width={150}
        value='important stuff needs to be written here that you cannot edit!!!'
        allowEmpty={false}
        expanded={expanded}
        editable={false}
      />
    </div>
  )
}
