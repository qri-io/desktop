import * as React from 'react'
import { Action } from 'redux'

import classNames from 'classnames'
import { ApiAction } from '../store/api'

interface SaveFormProps {
  title: string
  message: string
  saveWorkingDataset: () => Promise<ApiAction>
  setSaveValue: (name: string, value: string) => Action
}

export default class SaveForm extends React.Component<SaveFormProps> {
  constructor (props: any) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e: any) {
    const { name, value } = e.target
    this.props.setSaveValue(name, value)
  }

  handleSubmit (event: any) {
    this.props.saveWorkingDataset()
    event.preventDefault()
  }

  render () {
    const { title, message } = this.props
    const valid = title.length > 3
    return (
      <form id='save-form' onSubmit={this.handleSubmit}>
        <div className='title'>
          <input
            type='text'
            name='title'
            value={title}
            onChange={this.handleChange}
            placeholder='Commit message'
          />
        </div>
        <div className='message'>
          <textarea
            name='message'
            value={message}
            onChange={this.handleChange}
            placeholder='Detailed description'
          />
        </div>
        <div className='submit'>
          <input className={classNames('submit', { 'disabled': !valid })} type="submit" value="Submit" />
        </div>
      </form>
    )
  }
}
