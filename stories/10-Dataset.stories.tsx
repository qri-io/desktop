import React from 'react'

import DatasetDetailsSubtext from '../app/components/dataset/DatasetDetailsSubtext'
import Dataset from '../app/models/dataset'
import TitleBar from '../app/components/dataset/TitleBar'
import { ActionButtonProps } from '../app/components/chrome/ActionButton'

export default {
  title: 'Dataset',
  parameters: {
    notes: `Dataset components`
  }
}

const titleBarActions: ActionButtonProps[] = [
  { icon: 'publish', text: 'Publish', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Publish!', e) } },
  { icon: 'close', text: 'Unpublish', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('UnPublish!', e) } },
  { icon: 'openInFinder', text: 'Open in finder', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Open in Finder!', e) } },
  { icon: 'clone', text: 'Clone', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Clone!', e) } }
]

export const titleBar = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <TitleBar icon='structure' title='Short test title' data={titleBarActions} />
      <TitleBar title='Long test title with no icon that should overflow ellipsis unless you click it in which case it should expand' data={titleBarActions} />
    </div>
  )
}

titleBar.story = {
  name: 'Title Bar',
  parameters: {
    notes: 'four actions max will appear at the top bar, if the title is long or the space is small, they will collapse into the hamburger'
  }
}

export const detailsSubtext = () => {
  const date: Date = new Date(1579892323028)
  const data: Dataset = {
    commit: { timestamp: date, count: 14 },
    structure: { length: 349200, format: 'csv' }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} size='sm' color='light' />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} color='light' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='muted' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='muted' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='dark' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='dark' />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} size='sm' color='light' noTimestamp />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} color='light' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='muted' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='muted' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='dark' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='dark' noTimestamp />
      </div>
    </div>
  )
}

detailsSubtext.story = {
  name: 'Details Subtext',
  parameters: {
    notes: 'sm/md, light/muted/dark'
  }
}

export const titleBarTest = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', margin: 10, position: 'relative' }}>
      <div style={{
        display: 'flex',
        flexFlow: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden'
      }}>
        <div style={{ height: 100, background: 'red', overflow: 'hidden', whiteSpace: 'nowrap' }}>Here is some text that is</div>
        <div style={{ height: 100, background: 'green', flexGrow: 1, flexBasis: 40 }}>What about now when I add stuff to this one?</div>
      </div>
    </div>
  )
}

titleBarTest.story = {
  name: 'Title Bar Test',
  parameters: {
    notes: 'four actions max will appear at the top bar, if the title is long or the space is small, they will collapse into the hamburger'
  }
}
