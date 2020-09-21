import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateDatasetName,
  validateCommitState,
  ERR_INVALID_USERNAME_CHARACTERS,
  ERR_INVALID_USERNAME_LENGTH,
  ERR_INVALID_EMAIL,
  ERR_INVALID_PASSWORD_LENGTH,
  ERR_INVALID_DATASETNAME_CHARACTERS,
  ERR_INVALID_DATASETNAME_LENGTH,
  ERR_INVALID_DATASETNAME_START
} from '../../../app/utils/formValidation'

import { DatasetStatus } from '../../../app/models/store'

describe('formValidation', () => {
  const usernameGoodCases = [
    'foo_bar',
    'foo27',
    'foo-bar',
    'sp4vsihuof65kgyhcmv0agbjgcwljfufkjidk5wmqhl0mxg61n'
  ]

  usernameGoodCases.forEach((string) => {
    it(`validateUsername accepts ${string}`, () => {
      const got = validateUsername(string)
      expect(got).toBe(null)
    })
  })

  const userNameBadCases = [
    {
      string: 'foo👋bar',
      err: ERR_INVALID_USERNAME_CHARACTERS
    },
    {
      string: 'iceman@34',
      err: ERR_INVALID_USERNAME_CHARACTERS
    },
    {
      string: 'sp4vsihuof65kgyhcmv0agbjgcwljfufkjidk5wmqhl0mxg61n182',
      err: ERR_INVALID_USERNAME_LENGTH
    }
  ]

  userNameBadCases.forEach(({ string, err }) => {
    it(`validateUsername rejects ${string}`, () => {
      const got = validateUsername(string)
      expect(got).toBe(err)
    })
  })

  const emailGoodCases = [
    'foo@bar.com'
  ]

  emailGoodCases.forEach((string) => {
    it(`validateEmail accepts ${string}`, () => {
      const got = validateEmail(string)
      expect(got).toBe(null)
    })
  })

  const emailBadCases = [
    {
      string: 'foobar',
      err: ERR_INVALID_EMAIL
    },
    {
      string: 'foo+bar',
      err: ERR_INVALID_EMAIL
    }
  ]

  emailBadCases.forEach(({ string, err }) => {
    it(`validateEmail rejects ${string}`, () => {
      const got = validateEmail(string)
      expect(got).toBe(err)
    })
  })

  const passwordGoodCases = [
    'someLongPassword'
  ]

  passwordGoodCases.forEach((string) => {
    it(`validatePassword accepts ${string}`, () => {
      const got = validatePassword(string)
      expect(got).toBe(null)
    })
  })

  const passwordBadCases = [
    {
      string: 'imShort',
      err: ERR_INVALID_PASSWORD_LENGTH
    }
  ]

  passwordBadCases.forEach(({ string, err }) => {
    it(`validatePassword rejects ${string}`, () => {
      const got = validatePassword(string)
      expect(got).toBe(err)
    })
  })

  const datasetNameGoodCases = [
    'a',
    'hello_world',
    'hello-world',
    'pmfqbx5bhe7w4nbonqj6zu2abb15txq7vc5yfgysawjbdiqaxghvt4iy3rdyhvxg2v52mcsqeh1yymxe6ciz1lsxwmfsqyzdkhfjdksajfiejfijeilsdjafijdsilafjdkmciejntiesail'
  ]

  datasetNameGoodCases.forEach((string) => {
    it(`validateDatasetName accepts ${string}`, () => {
      const got = validateDatasetName(string)
      expect(got).toBe(null)
    })
  })

  const datasetNameBadCases = [
    {
      string: 'hi👋🏻',
      err: ERR_INVALID_DATASETNAME_CHARACTERS
    },
    {
      string: 'pmfqbx5bhe7w4nbonqj6zu2abb15txq7vc5yfgysawjbdiqaxghvt4iy3rdyhvxg2v52mcsqeh1yymxe6ciz1lsxwmfsqyzdkhfjdksajfiejfijeilsdjafijdsilafjdkmciejntiesailj',
      err: ERR_INVALID_DATASETNAME_LENGTH
    },
    {
      string: '911calls',
      err: ERR_INVALID_DATASETNAME_START
    }
  ]

  datasetNameBadCases.forEach(({ string, err }) => {
    it(`validateDatasetName rejects ${string}`, () => {
      const got = validateDatasetName(string)
      expect(got).toBe(err)
    })
  })

  interface commitStateCase {
    name: string
    title: string
    status: DatasetStatus
  }

  const commitStateGoodCases: commitStateCase[] = [
    {
      name: 'title and one component modified',
      title: 'First Commit',
      status: {
        body: {
          filepath: '',
          status: 'modified'
        },
        meta: {
          filepath: '',
          status: 'unmodified'
        }
      }
    },
    {
      name: 'title and one component added',
      title: 'First Commit',
      status: {
        body: {
          filepath: '',
          status: 'add'
        },
        meta: {
          filepath: '',
          status: 'unmodified'
        }
      }
    }
  ]

  commitStateGoodCases.forEach(({ name, title, status }) => {
    it(`validateCommitState accepts ${name}`, () => {
      const got = validateCommitState(title, status)
      expect(got).toBe(true)
    })
  })

  const commitStateBadCases: commitStateCase[] = [
    {
      name: 'no title and one component modified',
      title: '',
      status: {
        body: {
          filepath: '',
          status: 'modified'
        },
        meta: {
          filepath: '',
          status: 'unmodified'
        }
      }
    },
    {
      name: 'no title and one component added',
      title: '',
      status: {
        body: {
          filepath: '',
          status: 'add'
        },
        meta: {
          filepath: '',
          status: 'unmodified'
        }
      }
    },
    {
      name: 'title and no added or modified components',
      title: 'First Commit',
      status: {
        body: {
          filepath: '',
          status: 'unmodified'
        },
        meta: {
          filepath: '',
          status: 'unmodified'
        }
      }
    }
  ]

  commitStateBadCases.forEach(({ name, title, status }) => {
    it(`validateCommitState rejects ${name}`, () => {
      const got = validateCommitState(title, status)
      expect(got).toBe(false)
    })
  })
})
