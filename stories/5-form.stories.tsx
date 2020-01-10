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

  const validate = (value: string) => {
    return !value.includes(' ')
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <DynamicEditField
        placeholder='hmmm'
        value={val}
        onAccept={setVal}
        allowEmpty={false}
        validate={validate}
      />
    </div>
  )
}
