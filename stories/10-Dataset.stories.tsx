import React from 'react'

import DatasetDetailsSubtext from '../app/components/dataset/DatasetDetailsSubtext'
import { Dataset as IDataset } from '../app/models/dataset'
import TitleBar from '../app/components/dataset/TitleBar'
import Overview from '../app/components/dataset/Overview'
import Dataset from '../app/components/dataset/Dataset'
// import Navbar from '../app/components/nav/Navbar'
import { BrowserRouter as Router } from 'react-router-dom'
import { ActionButtonProps } from '../app/components/chrome/ActionButton'
const cities = require('./data/cities.dataset.json')

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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding: 15 }}>
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
  const data: Dataset = overviewDataset
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

const overviewDataset: IDataset = {
  meta: {
    title: 'Earthquakes in the last month',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    theme: ['geology']
  },
  structure: {
    format: 'csv',
    length: 24000000,
    depth: 2,
    entries: 2206,
    errCount: 0
  },
  commit: {
    author: 'chriswhong',
    title: 'Added metadata',
    timestamp: new Date(1579892323028),
    count: 247
  }
}

export const overview = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: 20 }}>
      <Overview data={overviewDataset} actions={[]}/>
    </div>
  )
}

export const dataset = () => {
  return (
    <div style={{ margin: 0, padding: 30, minHeight: '100%', background: '#F5F7FA' }}>
      <div style={{ width: '90%', margin: '2em auto', background: 'white' }}>
        <Router>
          {/* <Navbar location='foo/bar' /> */}
          <Dataset data={cities} actions={[]} />
        </Router>
      </div>
    </div>
  )
}

dataset.story = {
  name: 'Dataset'
}

export const bodySegment = () => {

}