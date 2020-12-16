import React from 'react'
import StringDiff from '../app/components/changes/StringDiff'
import { StatDiffDetails, StatDiffItem } from '../app/components/changes/StatDiffDetails'
import StatDiffRow from '../app/components/item/StatDiffRow'
import StatDiff from '../app/components/changes/StatDiff'
import DatasetSummaryDiff from '../app/components/changes/DatasetSummaryDiff'
import ChangeReport from '../app/components/changes/ChangeReport'

const res = require('./data/change_report_sample_api_response.json')

export default {
  title: 'Change Report',
  parameters: {
    notes: `Change report comprised of string differs for all components, except for stats which are shown in their own series of components that feature charts!`
  }
}

export const changes = () => {
  const leftCommitTitle = res.commit.left.title
  const rightCommitTitle = res.commit.right.title
  res.versionInfo = res.version_info
  res.versionInfo.left.commitTitle = leftCommitTitle
  res.versionInfo.right.commitTitle = rightCommitTitle
  return <ChangeReport 
    username='b5' 
    name='world_bank_population'
    {...res}
  />
}

export const commitDiff = () => {
  res.version_info.left.commitTitle = res.commit.left.title
  res.version_info.right.commitTitle = res.commit.right.title
  return <DatasetSummaryDiff left={res.version_info.left} right={res.version_info.right}/>
}


export const statDiff = () => {
  return <StatDiff data={res.stats}/>
}

export const statDiffRow = () => {
  return (
  <table style={{verticalAlign: 'top'}} >
    <tbody>
      {/* <StatDiffRow data={res.stats.columns[0]} /> */}
      <StatDiffRow data={res.stats.columns[0]} row={0} title={res.stats.columns[0].title} description='woooo' validation='yayay' />
    </tbody>
  </table>)
}

statDiffRow.story = { 
  name: 'stat diff row'
}

export const statDiffDetails = () => {
  return (
    <table style={{verticalAlign: 'top'}} >
      <tbody>
      {res.stats.columns.map((row, i) => {
        return <StatDiffDetails key={i} data={row} />
      })}
      </tbody>
    </table>
  )
}

statDiffDetails.story = {
  name: 'stat diff details'
}

export const stringDiff = () => {
  return (
    <>
      <StringDiff
        left={res.meta.left}
        right={res.meta.right}
        componentStatus={res.meta.about.status}
        name='meta'
      />
      <StringDiff
        left={res.structure.left}
        right={res.structure.right}
        componentStatus={res.structure.about.status}
        name='structure'
      />
      <StringDiff
        left={res.readme.left}
        right={res.readme.right}
        componentStatus={res.readme.about.status}
        name='readme'
      />
      <StringDiff
        left={res.transform.left}
        right={res.transform.right}
        componentStatus={res.transform.about.status}
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