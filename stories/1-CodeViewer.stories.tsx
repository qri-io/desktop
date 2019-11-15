import React from 'react'
import Code from '../app/components/Code'

export default {
  title: 'Code'
}

const wrap = (component) => {
  return (
    <div style={{ maxWidth: 650, margin: '0 auto' }}>
      {component}
    </div>
  )
}

const basicTransformText = `
def transform(ds,ctx):
  ds.set_body([[1,2,3,4],[5,6,7,8]])
`

export const basicTransform = () => wrap(<Code data={basicTransformText} />)

basicTransform.story = {
  name: 'Transform: Basic Starlark',
  parameters: {
    notes: `short code viewer`
  }
}