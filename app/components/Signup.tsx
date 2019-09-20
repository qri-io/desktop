import * as React from 'react'
import { Action } from 'redux'
import { Link } from 'react-router-dom'

import WelcomeTemplate from './WelcomeTemplate'
import DebouncedTextInput from './form/DebouncedTextInput'
import { getActionType } from '../utils/actionType'
import { ApiAction } from '../store/api'

import { validateUsername, validateEmail, validatePassword } from '../utils/formValidation'

export interface SignupProps {
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
  onSuccess: () => Action | void
}

const Signup: React.FunctionComponent<SignupProps> = (props: SignupProps) => {
  const { signup, onSuccess } = props

  const [serverError, setServerError] = React.useState()
  // track three form values
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  // track error messages to be displayed for the three form values
  const [usernameError, setUsernameError] = React.useState()
  const [emailError, setEmailError] = React.useState()
  const [passwordError, setPasswordError] = React.useState()

  // loading state, ready to proceed state
  const [loading, setLoading] = React.useState(false)
  const [acceptEnabled, setAcceptEnabled] = React.useState(false)

  // when the debounced form values are updated, validate everything
  React.useEffect(() => {
    const usernameError = validateUsername(username)
    setUsernameError(usernameError)
    const emailError = validateEmail(email)
    setEmailError(emailError)
    const passwordError = validatePassword(password)
    setPasswordError(passwordError)

    // if there are no errors and the values are not empty, enable the proceed button
    const acceptEnabled = (usernameError === null && emailError === null && passwordError === null) &&
    (username !== '' && email !== '' && password !== '')
    setAcceptEnabled(acceptEnabled)
  }, [username, email, password])

  const handleChange = (name: string, value: any) => {
    if (name === 'username') setUsername(value)
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  const handleSave = async () => {
    new Promise(resolve => {
      setLoading(true)
      resolve()
    })
      .then(async () => {
        signup(username, email, password)
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
      title='Sign up for Qri'
      loading={loading}
      id='signup-page'
    >
      <h6>Already have account? <Link to='/signin'>Sign In</Link></h6>
      <div className='welcome-form'>
        <DebouncedTextInput
          name='username'
          label='Username'
          type='text'
          maxLength={100}
          value={username}
          errorText={usernameError}
          onChange={handleChange}
        />
        <DebouncedTextInput
          name='email'
          label='Email'
          type='email'
          maxLength={100}
          value={email}
          errorText={emailError}
          onChange={handleChange}
        />
        <DebouncedTextInput
          name='password'
          label='Password'
          type='password'
          maxLength={100}
          value={password}
          errorText={passwordError}
          onChange={handleChange}
        />
        <div className='error'> { serverError } </div>
      </div>
    </WelcomeTemplate>
  )
}

export default Signup
