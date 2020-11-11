import React from 'react'
import StringDiff from '../app/components/changeReport/StringDiff'

const res = require('./data/change_report_sample_api_response.json')

export default {
  title: 'Change Report',
  parameters: {
    notes: `Change report comprised of string differs for all components, except for stats which are shown in their own series of components that feature charts!`
  }
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
