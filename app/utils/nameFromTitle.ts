import changeCase from 'change-case'

export default function nameFromTitle (title: string) {
  // cast name to meet our specification

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
