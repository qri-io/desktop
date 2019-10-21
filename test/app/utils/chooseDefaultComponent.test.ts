import chooseDefaultComponent from '../../../app/utils/chooseDefaultComponent'
import { Dataset } from '../../../app/models/dataset'

describe('chooseDefaultComponent', () => {
  const cases = [
    {
      describe: 'full dataset (has meta, body, and schema)',
      dataset: {meta: {title: 'test'}, body: {foo: 'bar'}, structure: {foo: 'bar'}, commit: {foo: 'bar'}},
      component: 'meta', 
    },
    {
      describe: 'dataset with body and schema',
      dataset: {schema: {$id:'test'}, body: {foo: 'bar'}},
      component: 'body', 
    },
    {
      describe: 'dataset with bodyPath',
      dataset: {bodyPath: 'bodyPath'},
      component: 'body', 
    },
    {
      describe: 'dataset with schema (should not return schema, "schema" is refactored to "structure")',
      dataset: {schema: {$id:'test'}},
      component: '', 
    },
    {
      describe: 'dataset with structure',
      dataset: {structure: {$id:'test'}},
      component: 'structure', 
    },
    {
      describe: 'dataset is empty object',
      dataset: {},
      component: '', 
    },
    {
      describe: 'dataset is undefined',
      dataset: undefined,
      component: '', 
    }
  ]
  cases.forEach(({describe, dataset, component}) => {
    it (`case '${describe}'`, () => {
      const got = chooseDefaultComponent(dataset as Dataset)
      expect(got).toBe(component)
    })
  })
})