import * as React from 'react'
import classNames from 'classnames'
import { ApiAction } from '../store/api'

interface SaveFormProps {
  saveWorkingDataset: (title: string, message: string) => Promise<ApiAction>
}

interface SaveFormState {
  title: string
  message: string
  [key: string]: string
}

export default class SaveForm extends React.Component<SaveFormProps, SaveFormState> {
  constructor (props: any) {
    super(props)
    this.state = {
      title: '',
      message: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e: any) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (event: any) {
    const { title, message } = this.state
    this.props.saveWorkingDataset(title, message)
    event.preventDefault()
  }

  render () {
    const { title } = this.state
    const valid = title.length > 3
    return (
      <form id='save-form' onSubmit={this.handleSubmit}>
        <div className='title'>
          <input
            type='text'
            name='title'
            onChange={this.handleChange}
            placeholder='Commit message'
          />
        </div>
        <div className='message'>
          <textarea
            name='message'
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
