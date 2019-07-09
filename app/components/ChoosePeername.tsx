import * as React from 'react'

import TextInput from './form/TextInput'
import Spinner from './chrome/Spinner'

export interface ChoosePeernameProps {
  onSave: (newPeername: string) => Promise<any>
  peername: string
}

const SET_PEERNAME_FAILURE = 'SET_PEERNAME_FAILURE'

const ChoosePeername: React.FunctionComponent<ChoosePeernameProps> = (props: ChoosePeernameProps) => {
  const { peername, onSave } = props
  const [newPeername, setNewPeername] = React.useState(peername)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  // handle local change, whihc is just updating local stat
  // handle save

  const handleChange = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    setNewPeername(value)
  }

  const handleSave = () => {
    setLoading(true)
    setError('')
    onSave(newPeername)
      .then((action: any) => {
        if (action.type === SET_PEERNAME_FAILURE) {
          setLoading(false)
          setError(action.error)
        }
      })
  }

  return (
    <div className='choose-peername-page'>
      <div className='choose-peername-center'>
        <div>
          <h1>Choose Your Peername</h1>
          <h6>Your peername is your identity on the Qri network</h6>
        </div>
        <div className='choose-peername-peername'>
          <TextInput
            name= 'peername'
            label='peername: '
            type='text'
            value={peername}
            errorText={error}
            onChange={handleChange} />
        </div>
        <div className='choose-peername-accept'>
          {loading ? <Spinner center={false} /> : <a className='linkLarge' onClick={handleSave}>Take me to Qri <span className='icon-inline'>right</span></a>}
        </div>
      </div>
    </div>
  )
}

export default ChoosePeername
