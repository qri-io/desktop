import bodyValue from '../../../app/utils/bodyValue'

describe('bodyValue', () => {
  const prevArr = [[0,1,2],[3,4,5]]
  const currArr = [['a','b','c'],['d','e','f']]
  const concatArr = [[0,1,2],[3,4,5],['a','b','c'],['d','e','f']]
  const initPageInfo = {
    isFetching: false,
    page: 1,
    pageSize: 2,
    fetchedAll: false
  }
  const pageInfo2 = {
    isFetching: false,
    page: 2,
    pageSize: 2,
    fetchedAll: false
  }
  const pageInfo3 = {
    isFetching: false,
    page: 3,
    pageSize: 2,
    fetchedAll: false
  }
  const arrayCases = [
    {
      describe: 'all empty',
      prev: [],
      curr: [],
      pageInfo: pageInfo2,
      expected: []
    },
    {
      describe: 'prev is empty',
      prev: [],
      curr: [['a','b','c'],['d','e','f']],
      pageInfo: initPageInfo,
      expected: [[0, 'a','b','c'],[1, 'd','e','f']]
    },
    {
      describe: 'curr is empty',
      prev: [['a','b','c'],['d','e','f']],
      curr: [],
      pageInfo: initPageInfo,
      expected: [['a','b','c'],['d','e','f']],
    },
    {
      describe: 'prev and curr exist, page 2',
      prev: [[0, 'a','b','c'],[1, 'd','e','f']],
      curr: [['g','h','i'],['j','k','l']],
      pageInfo: pageInfo2,
      expected: [[0, 'a','b','c'],[1, 'd','e','f'],[2, 'g','h','i'],[3, 'j','k','l']],
    },
    {
      describe: 'prev has double pageSize, page 3',
      prev: [[0, 'a','b','c'],[1, 'd','e','f'],[2, 'g','h','i'],[3, 'j','k','l']],
      curr: [['m','n','o'],['p','q','r']],
      pageInfo: pageInfo3,
      expected: [[2, 'g','h','i'],[3, 'j','k','l'],[4, 'm','n','o'],[5, 'p','q','r']],
    },
    {
      describe: 'prev and curr exist, init: page 1',
      prev: [[0, 'a','b','c'],[1, 'd','e','f']],
      curr: [['g','h','i'],['j','k','l']],
      pageInfo: initPageInfo,
      expected: [[0, 'g','h','i'],[1, 'j','k','l']]
    },
    {
      describe: 'prev is actually page 2, curr is page 1, init: page 1',
      prev: [[2, 'g','h','i'],[3, 'j','k','l']],
      curr: [['a','b','c'],['d','e','f']],
      pageInfo: initPageInfo,
      expected: [[0, 'a','b','c'],[1, 'd','e','f'],[2, 'g','h','i'],[3, 'j','k','l']]
    }
  ]

  arrayCases.forEach(({describe, prev, curr, pageInfo, expected}) => {
    it (`case '${describe}'`, () => {
      const got = bodyValue(prev, curr, pageInfo)
      expect(got).toStrictEqual(expected)
    })
  })
})