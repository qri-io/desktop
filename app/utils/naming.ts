import changeCase from 'change-case'
import path from 'path'

// cast name to meet our specification
export function nameFromTitle (title: string): string {
  if (title.trim() === '') {
    return ''
  }

  // make lowercase
  let coercedName = changeCase.lowerCase(title)
  // make snakecase
  coercedName = changeCase.snakeCase(coercedName)
  // remove invalid characters
  coercedName = coercedName.replace(/^[^a-z0-9_]+$/g, '')

  // there should not be any invalid characters left, but it
  // could still start with a number if it does, prepend `dataset_`
  if (coercedName[0].match(/^[0-9]/)) {
    coercedName = `dataset_${coercedName}`
  }
  return coercedName
}

export function titleFromBodyFile (f: File): string {
  return path.parse(f.name).name
}
