import React from 'react'
import LogListItem, { LogListItemProps } from '../app/components/item/LogListItem'
import WorkingLogListItem from '../app/components/item/WorkingLogListItem'
import { VersionInfo } from '../app/models/store'

export default {
  title: 'LogList',
  parameters: {
    notes: `the dataset history railroad track!`
  }
}

export const items = () => {
  return (
    <div style={{ display: 'flex', flexDirection:'column', flexWrap: 'wrap', justifyContent:'center', margin: 100 }}>
      <WorkingLogListItem onClick={() => console.log('clicked!')} />
      <LogListItem {...historyLogData} first />
      <LogListItem {...historyLogData} selected/>
      <LogListItem {...historyLogData} last />
    </div>
  )
}

const historyLog: VersionInfo = {
  username: 'ramfox',
  name: 'earthquakes',
  path: '/ipfs/Qmfoo',
  commitTitle: 'Added dataset',
  commitTime: new Date("2020-09-29"),
  foreign: false
}

const historyLogData: LogListItemProps = {
  id: 'history-log',
  data: historyLog,
  selected: false,
  first: false,
  last: false,
  onClick: () => { console.log('clicked!') }
}

items.story = {
  name: 'All Stats',
  parameters: { note: 'idealized overview of each stat' }
}