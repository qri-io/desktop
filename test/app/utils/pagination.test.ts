import { initialPageInfo, reducerWithPagination, actionWithPagination, fetchedAll } from "../../../app/utils/pagination"

describe('reducerWithPagination', () => {
  const pageInfoFirstPage = {
    isFetching: false,
    page: 1,
    fetchedAll: false,
    error: '',
    pageSize: 3
  }

  const pageInfoError = {
    isFetching: false,
    page: 7,
    fetchedAll: true,
    error: 'there is an error here',
    pageSize: 3
  }

  const cases = [
    // malformed actions
    {
      describe:'bad action, empty type',
      action: {
        type: ''
      },
      pageInfo: initialPageInfo,
      expected: initialPageInfo
    },
    {
      describe:'bad action, nonsense type',
      action: {
        type: 'foo'
      },
      pageInfo: pageInfoFirstPage,
      expected: pageInfoFirstPage
    },
    // request actions
    {
      describe:'request action, initial page',
      action: {
        type: 'REQUEST',
        pageInfo: {
          page: 1,
          pageSize: 10
        }
      },
      pageInfo: initialPageInfo,
      expected: {
        isFetching: true,
        page: 1,
        fetchedAll: false,
        error: '',
        pageSize: 10
      }
    },
    {
      describe:'request action, any page',
      action: {
        type: 'REQUEST',
        pageInfo: {
          page: 1,
          pageSize: 10
        }
      },
      pageInfo: pageInfoError,
      expected: {
        isFetching: true,
        page: 1,
        fetchedAll: false,
        error: '',
        pageSize: 10
      }
    },
    // success actions
    // pageInfo is in action.payload.request.pageInfo
    {
      describe:'success action: data is object and we have fetched all',
      action: {
        type: 'SUCCESS',
        payload: {
          data: {
            foo: 'bar'
          },
          request: {
            pageInfo: {
              page: 10,
              pageSize: 3
            }
          }
        }
      },
      pageInfo: pageInfoError,
      expected: {
        isFetching: false,
        page: 10,
        fetchedAll: true,
        error: '',
        pageSize: 3
      }
    },
    {
      describe:'success action: data is object and we have not fetched all',
      action: {
        type: 'SUCCESS',
        payload: {
          data: {
            foo: 'bar',
            bar: 'foo',
            baz: 'foo',
          },
          request: {
            pageInfo: {
              page: 10,
              pageSize: 3
            }
          }
        }
      },
      pageInfo: pageInfoError,
      expected: {
        isFetching: false,
        page: 10,
        fetchedAll: false,
        error: '',
        pageSize: 3
      }
    },
    {
      describe:'success action: data is array and we have fetched all',
      action: {
        type: 'SUCCESS',
        payload: {
          data: [1],
          request: {
            pageInfo: {
              page: 10,
              pageSize: 3
            }
          }
        }
      },
      pageInfo: pageInfoError,
      expected: {
        isFetching: false,
        page: 10,
        fetchedAll: true,
        error: '',
        pageSize: 3
      }
    },
    {
      describe:'success action: data is array and we have not fetched all',
      action: {
        type: 'SUCCESS',
        payload: {
          data: [1,2,3],
          request: {
            pageInfo: {
              page: 10,
              pageSize: 3
            }
          }
        }
      },
      pageInfo: pageInfoError,
      expected: {
        isFetching: false,
        page: 10,
        fetchedAll: false,
        error: '',
        pageSize: 3
      }
    },
    // failure actions
    {
      describe: 'failure action',
      action: {
        type: 'FAILURE',
        payload: {
          request: {
            pageInfo: {
              page: 9,
              pageSize: 3
            }
          },
          err: {
            message: 'oh no something went wrong!'
          }
        }
      },
      pageInfo: pageInfoFirstPage,
      expected: {
        page: 9,
        pageSize: 3,
        isFetching: false,
        error: 'oh no something went wrong!',
        fetchedAll: false
      }
    }
  ]
  cases.forEach(({describe, action, pageInfo, expected}) => {
    it(`case '${describe}'`, () => {
      const got = reducerWithPagination(action, pageInfo)
      expect(got).toStrictEqual(expected)
    } )
  })
})

describe('actionWithPagination', () => {
  const cases = [
    {
      describe: 'do not fetch: already fetched all',
      page: 10,
      prevPageInfo: {
        isFetching: false,
        pageSize: 10,
        page: 1,
        fetchedAll: true
      },
      expected: {
        page: 10,
        doNotFetch: true
      }
    },
    {
      describe: 'invalidate pagination',
      page: -1,
      prevPageInfo: {
        isFetching: false,
        pageSize: 10,
        page: 100,
        fetchedAll: true
      },
      expected: {
        page: 1,
        doNotFetch: false
      }
    },
    {
      describe: 'paginate as normal',
      page: 2,
      prevPageInfo: {
        isFetching: false,
        pageSize: 10,
        page: 1,
        fetchedAll: false
      },
      expected: {
        page: 2,
        doNotFetch: false
      }
    },
  ]

  cases.forEach(({describe, page, prevPageInfo, expected}) => {
    it(`case '${describe}'`, () => {
      const got = actionWithPagination(page, prevPageInfo)
      expect(got).toStrictEqual(expected)
    })
  })
})

describe('fetchedAll', () => {
  const cases = [
    {
      describe: 'fetchedAll is true, data is object',
      data: { foo: 'bar' },
      pageSize: 2,
      expected: true
    },
    {
      describe: 'fetchedAll is false, data is object',
      data: { foo: 'bar' },
      pageSize: 1,
      expected: false
    },
    {
      describe: 'fetchedAll is true, data is array',
      data: ['foo'],
      pageSize: 2,
      expected: true
    },
    {
      describe: 'fetchedAll is false, data is array',
      data: ['foo'],
      pageSize: 1,
      expected: false
    },
    {
      describe: 'fetchedAll is false, data is undefined',
      data: undefined,
      pageSize: 1,
      expected: false
    },
    {
      describe: 'fetchedAll is false, data is not object or array',
      data: 'foo',
      pageSize: 1,
      expected: false
    }
  ]

  cases.forEach(({describe, data, pageSize, expected}) => {
    it(`case '${describe}'`, () => {
      const got = fetchedAll(data, pageSize)
      expect(got).toEqual(expected)
    })
  })
})
