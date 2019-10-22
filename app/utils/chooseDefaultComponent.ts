import { Dataset } from '../models/dataset'
// chooseDefaultComponent takes a dataset and returns a string of the component
// that we should display on default
// Order of preference:
// 1) meta
// 2) body
// 3) structure
// If none of these exist, or if the given dataset is empty, return an empty string
export default function chooseDefaultComponent (dataset: Dataset): string {
  if (!dataset) return ''
  if (dataset.meta) return 'meta'
  if (dataset.body) return 'body'
  if (dataset.bodyPath) return 'body'
  if (dataset.structure) return 'structure'
  return ''
}
