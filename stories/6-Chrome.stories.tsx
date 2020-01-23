import React from 'react'
import Switch from '../app/components/chrome/Switch'

export default {
  title: 'Chrome',
  parameters: {
    notes: `list of chrome components`
  }
}

export const switches = () => {
  const [lightSmall, setLightSmall] = React.useState(true)
  const [lightLarge, setLightLarge] = React.useState(false)
  const [darkSmall, setDarkSmall] = React.useState(true)
  const [darkLarge, setDarkLarge] = React.useState(false)
  return (
    <div style={{ background: 'grey', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{lightSmall ? 'on' : 'off'}</span>
        <Switch name='lightSmall' checked={lightSmall} onClick={() => setLightSmall(!lightSmall)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{lightLarge ? 'on' : 'off'}</span>
        <Switch name='lightLarge' checked={lightLarge} onClick={() => setLightLarge(!lightLarge)} large/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{darkSmall ? 'on' : 'off'}</span>
        <Switch name='darkSmall' checked={darkSmall} onClick={() => setDarkSmall(!darkSmall)} dark />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{darkLarge ? 'on' : 'off'}</span>
        <Switch name='darkLarge' checked={darkLarge} onClick={() => setDarkLarge(!darkLarge)} dark large />
      </div>
    </div>
  )
}

switches.story = {
  name: 'Switch',
  parameters: { note: 'on off switch' }
}
