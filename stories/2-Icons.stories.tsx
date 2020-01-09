import React from 'react'
import Icon, { iconsList } from '../app/components/chrome/Icon'

export default {
  title: 'Icons',
  parameters: {
    notes: `listing all available icons`
  }
}

export const allIcons = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {iconsList.map((icon, i) => {
        return (
          <div key={i} style={{ width: 150, margin: 15, display: 'flex', flexDirection: 
          'column', justifyContent: 'center', alignItems: 'space-between' }}>
            <p>{icon}</p>
            <p style={{display: 'flex', justifyContent:'space-between'}}>
              <Icon icon={icon} size='sm' color='dark' />
              <Icon icon={icon} size='sm' color='medium' />
              <span style={{background: '#000'}}><Icon icon={icon} size='sm' color='light' /></span>
            </p>
            <p style={{display: 'flex', justifyContent:'space-between'}}>
              <Icon icon={icon} size='md' color='dark' />
              <Icon icon={icon} size='md' color='medium' />
              <span style={{background: '#000'}}><Icon icon={icon} size='md' color='light' /></span>
            </p>
            <p style={{display: 'flex', justifyContent:'space-between'}}>
              <Icon icon={icon} size='lg' color='dark' />
              <Icon icon={icon} size='lg' color='medium' />
              <div style={{background: '#000', display: 'inline-block'}}><Icon icon={icon} size='lg' color='light' /></div>
            </p>
          </div>
        )
      })}
    </div>
  )
}

allIcons.story = {
  name: 'All Icons',
  parameters: { note: 'each icon in small and dark' }
}