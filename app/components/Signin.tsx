import * as React from 'react'
import { Action } from 'redux'
import { Link } from 'react-router-dom'

import WelcomeTemplate from './WelcomeTemplate'
import DebouncedTextInput from './form/DebouncedTextInput'
import { getActionType } from '../utils/actionType'
import { ApiAction } from '../store/api'

import { validateUsername, validatePassword } from '../utils/formValidation'

export interface SigninProps {
  signin: (username: string, password: string) => Promise<ApiAction>
  onSuccess: () => Action | void
}

const Signin: React.FunctionComponent<SigninProps> = (props: SigninProps) => {
  const { signin, onSuccess } = props

  const [serverError, setServerError] = React.useState()

  // track two form values
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  // track error messages to be displayed for the two form values
  const [usernameError, setUsernameError] = React.useState()
  const [passwordError, setPasswordError] = React.useState()

  // loading state, ready to proceed state
  const [loading, setLoading] = React.useState(false)
  const [acceptEnabled, setAcceptEnabled] = React.useState(false)

  // when the debounced form values are updated, validate everything
  React.useEffect(() => {
    const usernameError = validateUsername(username)
    setUsernameError(usernameError)
    const passwordError = validatePassword(password)
    setPasswordError(passwordError)

    // if there are no errors and the values are not empty, enable the proceed button
    const acceptEnabled = (usernameError === null && passwordError === null) &&
    (username !== '' && password !== '')
    setAcceptEnabled(acceptEnabled)
  }, [username, password])

  const handleChange = (name: string, value: any) => {
    if (name === 'username') setUsername(value)
    if (name === 'password') setPassword(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && acceptEnabled) handleSave()
  }

  const handleSave = async () => {
    new Promise(resolve => {
      setLoading(true)
      resolve()
    })
      .then(async () => {
        signin(username, password)
          .then((action) => {
            setLoading(false)
            // TODO (chriswhong): the server should be able to return field-specific errors
            // e.g. err.username = 'The username is not available'
            if (getActionType(action) === 'failure') {
              setServerError(action.payload.err.message)
            } else {
              onSuccess()
            }
          })
      })
  }

  return (
    <WelcomeTemplate
      onAccept={handleSave}
      acceptEnabled={acceptEnabled}
      acceptText='Take me to Qri '
      title='Sign in to Qri'
      loading={loading}
      id='signin-page'
    >
      <h6>Don&apos;t have an account yet? <Link to='/signup'>Sign Up</Link></h6>
      <div className='welcome-form'>
        <DebouncedTextInput
          name= 'username'
          label='Username'
          type='text'
          maxLength={100}
          value={username}
          errorText={usernameError}
          onChange={handleChange} />
        <DebouncedTextInput
          name= 'password'
          label='Password'
          type='password'
          maxLength={100}
          value={password}
          errorText={passwordError}
          onChange={handleChange}
          onKeyDown={handleKeyDown} />
        <div className = 'error'> { serverError } </div>
      </div>
    </WelcomeTemplate>
  )
}

export default Signin
