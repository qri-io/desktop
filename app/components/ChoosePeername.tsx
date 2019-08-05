import * as React from 'react'
import WelcomeTemplate from './WelcomeTemplate'
import TextInput from './form/TextInput'
import getActionType from '../utils/actionType'
import { ApiAction } from '../store/api'
import { Action } from 'redux'

export interface ChoosePeernameProps {
  setPeername: (newPeername: string) => Promise<ApiAction>
  setHasSetPeername: () => Action
  peername: string
}

const ChoosePeername: React.FunctionComponent<ChoosePeernameProps> = (props: ChoosePeernameProps) => {
  const { peername, setPeername, setHasSetPeername } = props
  const [newPeername, setNewPeername] = React.useState(peername)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [acceptEnabled, setAcceptEnabled] = React.useState(true)

  React.useEffect(() => {
    if (newPeername === '' && acceptEnabled) setAcceptEnabled(false)
    else if (!acceptEnabled) setAcceptEnabled(true)
  }, [newPeername])

  React.useEffect(() => {
    setNewPeername(peername)
  }, [peername])

  const handleChange = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    setNewPeername(value)
  }

  async function handleSave () {
    new Promise(resolve => {
      error && setError('')
      setLoading(true)
      resolve()
    })
      .then(async () => {
        setPeername(newPeername)
          .then((action) => {
            setLoading(false)
            // TODO (ramfox): possibly these should move to the reducer
            if (getActionType(action.type) === 'failure') {
              setError(action.payload.err.message)
            }
            if (getActionType(action.type) === 'success') {
              setHasSetPeername()
            }
          })
      })
  }

  return (
    <WelcomeTemplate
      onAccept={handleSave}
      acceptEnabled={acceptEnabled}
      acceptText='Take me to Qri '
      title='Choose Your Peername'
      subtitle='We&apos;ve generated a peername for you'
      loading={loading}
      id='choose-peername-page'
    >
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
    </WelcomeTemplate>
  )
}

export default ChoosePeername
