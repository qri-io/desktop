import React from 'react'
import StringDiff from '../app/components/changeReport/StringDiff'
import { StatDiffRow, StatDiffItem } from '../app/components/item/StatDiffRow'
import StatDiff from '../app/components/changeReport/StatDiff'
import CommitDiff from '../app/components/changeReport/CommitDiff'

const res = require('./data/change_report_sample_api_response.json')

export default {
  title: 'Change Report',
  parameters: {
    notes: `Change report comprised of string differs for all components, except for stats which are shown in their own series of components that feature charts!`
  }
}

export const commitDiff = () => {
  const left = {
    username: 'b5',
    name: 'world_bank_population',
    bodySize: res.structure.left.length,
    bodyRows: res.structure.left.entries,
    ...res.commit.left
  }
  const right = {
    username: 'b5',
    name: 'world_bank_population',
    bodySize: res.structure.right.length,
    bodyRows: res.structure.right.entries,
    ...res.commit.right
  }
  return <CommitDiff left={left} right={right}/>
}


export const statDiff = () => {
  return <StatDiff data={res.stats}/>
}

export const statDiffRow = () => {
  return (
    <table style={{verticalAlign: 'top'}} >
      <tbody>
      {res.stats.columns.map((row, i) => {
        return <StatDiffRow key={i} data={row} />
      })}
      </tbody>
    </table>
  )
}

statDiffRow.story = {
  name: 'stat diff row'
}

export const stringDiff = () => {
  return (
    <>
      <StringDiff
        left={res.meta.left}
        right={res.meta.right}
        componentStatus={res.meta.meta.status}
        name='meta'
      />
      <StringDiff
        left={res.structure.left}
        right={res.structure.right}
        componentStatus={res.structure.meta.status}
        name='structure'
      />
      <StringDiff
        left={res.readme.left}
        right={res.readme.right}
        componentStatus={res.readme.meta.status}
        name='readme'
      />
      <StringDiff
        left={res.transform.left}
        right={res.transform.right}
        componentStatus={res.transform.meta.status}
        name='transform'
      />
    </>
  )
}

stringDiff.story = {
  name: 'string differ',
  parameters: { note: 'used for comparing all components except for stats'}
}

export const statDiffItem = () => {
  return (
    <div>{
      res.stats.columns.map((columnStatDiff) => {
        const stat = columnStatDiff.right
        stat["delta"] = columnStatDiff.delta
        return (<div style={{margin: 20}}><StatDiffItem data={stat} /></div>)
      })
    }</div>
  )
}

statDiffItem.story = {
  name: 'stat diff item',
  parameters: {note: 'one side of the stat diff row, shows the stats and a historgram or frequecy chart, if there is data for it'}
}