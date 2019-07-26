import * as React from 'react'
import WelcomeTemplate from './WelcomeTemplate'
import TextInput from './form/TextInput'

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

  React.useEffect(() => {
    setNewPeername(peername)
  }, [peername])

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
    <WelcomeTemplate
      onAccept={handleSave}
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
