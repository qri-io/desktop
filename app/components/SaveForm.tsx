import * as React from 'react'

export default class SaveForm extends React.Component<{}> {
  render () {
    return (
      <form id='save-form'>
        <div className='title'>
          <input type='text' name='title' placeholder='Commit message' />
        </div>
        <div className='message'>
          <textarea name='message' placeholder='Detailed description' />
        </div>
        <div className='submit'>
          <input className='submit'type="submit" value="Submit" />
        </div>
      </form>
    )
  }
}
