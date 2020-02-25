import Dataset from '../models/dataset'

export function datasetConvertStringToScriptBytes (data: Dataset): Dataset {
  let d = { ...data }
  if (Object.keys(d).includes('readme')) {
    if (typeof d.readme === 'string') {
      d.readme = { scriptBytes: btoa(unescape(encodeURIComponent(d.readme))) }
    }
  }
  return d
}
