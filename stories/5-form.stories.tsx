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
    <div style={{ margin: 50, padding: 40 }}>
      <button style={{ display: 'inline-block', background: '#fff', marginRight: 10, borderRadius: 3, fontSize: 12, border: 'solid 1px #eee', padding: 4, width: 70 }} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'close' : 'expand'}
      </button>
      <DynamicEditField
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
