import React from 'react'
import Switch from '../app/components/chrome/Switch'
import Segment from '../app/components/chrome/Segment'

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

export const segments = () => {
  const content = <div style={{ padding: 15 }}><h4>Some content here</h4><div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div></div>
  return (
    <div style={{background: 'grey', height: '100%'}}>
      <div style={{height: 80 }}></div>
      <Segment
        content={content}
        name='Structure'
        icon='structure'
        subhead='this is a subheading'
        collapsable={true}
        expandable={true}
        contentHeight={200}
      />
    </div>
  )
}

segments.story = {
  name: 'Segments',
  paramaters: { note: 'collapse, untwirl, expand and contract' }
}
