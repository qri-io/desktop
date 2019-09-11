import { DatasetStatus } from '../models/store'

type ValidationError = string | null

export const ERR_INVALID_USERNAME_CHARACTERS: ValidationError = 'Usernames may only include a-z, 0-9, _ , and -'
export const ERR_INVALID_USERNAME_LENGTH: ValidationError = 'Username must be 50 characters or fewer'

// validators return an error message or null
export const validateUsername = (username: string): ValidationError => {
  if (username) {
    const invalidCharacters = !(/^[a-z0-9_-]+$/.test(username))
    if (invalidCharacters) return ERR_INVALID_USERNAME_CHARACTERS

    const tooLong = username.length > 50
    if (tooLong) return ERR_INVALID_USERNAME_LENGTH
  }
  return null
}

export const ERR_INVALID_EMAIL: ValidationError = 'Enter a valid email address'

export const validateEmail = (email: string): ValidationError => {
  if (email) {
    const invalidEmail = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    if (invalidEmail) return ERR_INVALID_EMAIL
  }
  return null
}

export const ERR_INVALID_PASSWORD_LENGTH: ValidationError = 'Password must be at least 8 characters'

export const validatePassword = (password: string) => {
  if (password) {
    const tooShort = password && password.length < 8
    if (tooShort) return ERR_INVALID_PASSWORD_LENGTH
  }
  return null
}

export const ERR_INVALID_DATASETNAME_CHARACTERS: ValidationError = 'Dataset names may only include a-z, 0-9, and _'
export const ERR_INVALID_DATASETNAME_LENGTH: ValidationError = 'Username must be 100 characters or fewer'

export const validateDatasetName = (name: string): ValidationError => {
  if (name) {
    const invalidCharacters = !(/^[a-z0-9_]+$/.test(name))
    if (invalidCharacters) return ERR_INVALID_DATASETNAME_CHARACTERS

    const tooLong = name.length > 100
    if (tooLong) return ERR_INVALID_DATASETNAME_LENGTH
  }
  return null
}

export const validateCommitState = (title: string, status: DatasetStatus): boolean => {
  let valid = true
  // commit message (title) must be more than 3 characters
  if (title.length < 4) valid = false

  const statuses: string[] = Object.keys(status).map((key) => status[key].status)

  // status must include at least one 'modified'
  // not valid if there is not at least one 'add' or 'modified'
  const noModified = !statuses.includes('modified')
  const noAdd = !statuses.includes('add')
  if (noModified && noAdd) valid = false

  const hasErrors = statuses.reduce((acc, status) => {
    return status.match(/error/g) ? true : acc
  }, false)
  if (hasErrors) valid = false
  return valid
}
