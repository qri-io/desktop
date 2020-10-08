import React, { useState } from 'react'

import { Dataset } from '../../models/dataset'

import CheckboxInput from './CheckboxInput'
import TristateCheckboxInput from './TristateCheckboxInput'
import RadioInput from './RadioInput'

interface ComponentAndFormatPickerProps {
  dataset: Dataset
  value: ComponentConfig
  onChange: (v: ComponentConfig) => void
}

interface ComponentConfig {
  body: boolean

  other: boolean | 'indeterninate'
  meta: boolean
  structure: boolean
  readme: boolean
}

export const defaultConfig: ComponentConfig = {
  body: true,
  // otherChecked has three states, 'true', 'false', 'indeterminate'
  // indeterminate state means the checkbox shows a '-' instead of checked or unchecked
  other: false as boolean | 'indeterminate',
  meta: false,
  structure: false,
  readme: false
}

export const ComponentAndFormatPicker: React.FC<ComponentAndFormatPickerProps> = ({ dataset, value }) => {
  const { meta, readme } = dataset
  const enabledOtherComponents = ['structure'] // structure is always enabled
  if (meta) enabledOtherComponents.push('meta')
  if (readme) enabledOtherComponents.push('readme')

  const [bodyFormat, setBodyFormat] = useState('csv')
  const [config, setConfig] = useState(value)

  const setConfigField = (field: string, value: boolean) => {
    const update = { ...config, [field]: value }

    if (field === 'other') {
      enabledOtherComponents.forEach((compName: string) => {
        update[compName] = value
      })
    } else {
      const enabledCount = enabledOtherComponents.length
      const checkedCount = [update.meta, update.structure, update.readme].reduce((acc, curr) => (curr ? acc + 1 : acc), 0)

      // set state of parent checkbox
      if (checkedCount === 0) {
        update.other = false
      } else if (checkedCount === enabledCount) {
        update.other = true
      } else {
        update.other = 'indeterminate'
      }
    }

    setConfig(update)
  }

  return (
    <div className='component-and-format-picker dialog-text-small'>
      <div className='input-label'>Components</div>
      <div className='options-row'>
        <div className='options-column'>
          <CheckboxInput
            name='body'
            checked={config.body}
            onChange={() => { setConfigField('body', !config.body) }}
            label='Body'
            strong
          />
          <div className='options-column-content'>
            <RadioInput
              name='csv'
              checked={bodyFormat === 'csv'}
              onChange={() => { setBodyFormat('csv') }}
              label='body.csv'
              disabled={!config.body}
            />
            <RadioInput
              name='should-remove-files'
              checked={bodyFormat === 'json'}
              onChange={() => { setBodyFormat('json') }}
              label='body.json'
              disabled={!config.body}
            />
          </div>
        </div>
        <div className='options-column'>
          <TristateCheckboxInput
            name='other-components'
            value={config.other}
            onChange={(_: string, v: boolean) => { setConfigField('other', v) }}
            label='Other Components'
            strong
          />
          <div className='options-column-content'>
            <CheckboxInput
              name='meta'
              checked={config.meta}
              onChange={() => { setConfigField('meta', !config.meta) }}
              label='meta.json'
              disabled={meta === undefined}
            />
            <CheckboxInput
              name='structure'
              checked={config.structure}
              onChange={() => { setConfigField('structure', !config.structure) }}
              label='structure.json'
            />
            <CheckboxInput
              name='readme'
              checked={ config.readme }
              onChange={() => { setConfigField('readme', !config.readme) }}
              label='readme.md'
              disabled={readme === undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentAndFormatPicker
