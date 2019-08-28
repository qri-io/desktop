type ValidationError = string | null

// validators return an error message or null
export const validateUsername = (username: string): ValidationError => {
  if (username) {
    const invalidCharacters = !(/^[a-z0-9_-]+$/.test(username))
    if (invalidCharacters) return 'Usernames may only include a-z, 0-9, _ , and -'

    const tooLong = username.length > 50
    if (tooLong) return 'Username must be 50 characters or less'
  }
  return null
}

export const validateEmail = (email: string): ValidationError => {
  if (email) {
    const invalidEmail = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    if (invalidEmail) return 'Enter a valid email address'
  }
  return null
}

export const validatePassword = (password: string) => {
  if (password) {
    const tooShort = password && password.length < 8
    if (tooShort) return 'Password must be at least 8 characters'
  }
  return null
}
