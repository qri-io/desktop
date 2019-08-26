import * as React from 'react'
import { useDebounce } from 'use-debounce'
import WelcomeTemplate from './WelcomeTemplate'
import TextInput from './form/TextInput'
import getActionType from '../utils/actionType'
import { ApiAction } from '../store/api'
import { Action } from 'redux'

type ValidationError = string | null

// validators return an error message or null
const validateUsername = (username: string): ValidationError => {
  if (username) {
    const invalidCharacters = !(/^[a-z0-9_-]+$/.test(username))
    if (invalidCharacters) return 'Usernames may only include a-z, 0-9, _ , and -'

    const tooLong = username.length > 50
    if (tooLong) return 'Username must be 50 characters or less'
  }
  return null
}

const validateEmail = (email: string): ValidationError => {
  if (email) {
    const invalidEmail = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    if (invalidEmail) return 'Enter a valid email address'
  }
  return null
}

const validatePassword = (password: string) => {
  if (password) {
    const tooShort = password && password.length < 8
    if (tooShort) return 'Password must be at least 8 characters'
  }
  return null
}

export interface SignupProps {
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
  setHasSignedUp: () => Action
}

const Signup: React.FunctionComponent<SignupProps> = (props: SignupProps) => {
  const { signup, setHasSignedUp } = props

  // track three form values
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  // track error messages to be displayed for the three form values
  const [usernameError, setUsernameError] = React.useState()
  const [emailError, setEmailError] = React.useState()
  const [passwordError, setPasswordError] = React.useState()

  // debounce changes to the form values (only validate after debounce)
  const [debouncedUsername] = useDebounce(username, 500)
  const [debouncedEmail] = useDebounce(email, 500)
  const [debouncedPassword] = useDebounce(password, 500)

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
  }, [debouncedUsername, debouncedEmail, debouncedPassword])

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
            // TODO (ramfox): possibly these should move to the reducer
            if (getActionType(action) === 'failure') {
              const { errors } = action.payload.data
              const { username, email, password } = errors

              // set server-side errors for each field
              username && setUsernameError(username)
              email && setEmailError(email)
              password && setPasswordError(password)
            } else {
              // SUCCESS!
              setHasSignedUp()
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
      subtitle='Already have an account? Sign In'
      loading={loading}
      id='signup-page'
    >
      <div className='welcome-form'>
        <TextInput
          name= 'username'
          label='Username'
          type='text'
          maxLength={100}
          value={username}
          errorText={usernameError}
          onChange={handleChange} />
        <TextInput
          name= 'email'
          label='Email'
          type='email'
          maxLength={100}
          value={email}
          errorText={emailError}
          onChange={handleChange} />
        <TextInput
          name= 'password'
          label='Password'
          type='password'
          maxLength={100}
          value={password}
          errorText={passwordError}
          onChange={handleChange} />
      </div>
    </WelcomeTemplate>
  )
}

export default Signup
