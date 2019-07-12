import * as React from 'react'
import { logo } from './AppLoading'
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

  const handleChange = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    setNewPeername(value)
  }

  const handleSave = () => {
    setLoading(true)
    setError('')
    setTimeout(async () =>
      onSave(newPeername)
        .then((action: any) => {
          if (action.type === SET_PEERNAME_FAILURE) {
            setLoading(false)
            setError(action.error)
          }
        }), 2000)
  }

  return (
    <div id='choose-peername-page' className='welcome-page'>
      <div className='welcome-center'>
        <img className='welcome-graphic' src={logo} />
        <div className='welcome-title'>
          <h2>Choose Your Peername</h2>
          <h6>We&apos;ve generated a peername for you</h6>
        </div>
        <div className='choose-peername-text'>
          <p style={{ textAlign: 'center' }}>Your peername is your identity on the Qri network.</p>
          <div className='choose-peername-input'>
            <TextInput
              name= 'peername'
              label='Choose your peername: '
              type='text'
              maxLength={100}
              value={newPeername}
              errorText={error}
              onChange={handleChange} />
          </div>
        </div>
        {
          loading
            ? <div className='flex-center' id='choose-peername-spinner'>
              <Spinner/>
            </div>
            : <div className='choose-peername-accept'>
              <a className='linkLarge' onClick={handleSave}>Take me to Qri <span className='icon-inline'>right</span></a>
            </div>
        }
      </div>
    </div>
  )
}

export default ChoosePeername
