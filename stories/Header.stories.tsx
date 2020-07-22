import React from 'react'

import { Modal } from '../app/models/modals'

import { Header } from '../app/components/Header'

export default {
  title: 'Header',
  parameters: {
    notes: 'app-wide header'
  }
}

export const collectionViewHeader = () => {
  return (
    <div style={{ width: 960, margin: '0 auto'}}>
      <Header title="Collection" setModal={(modal: Modal) => console.log(`Set modal dispatched action for ${modal}`)}/>
    </div> 
  )
}

collectionViewHeader.story = {
  name: 'Collection View',
  parameters: { note: 'Shows add and create dataset buttons' }
}