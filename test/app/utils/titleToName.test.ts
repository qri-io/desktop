import nameFromTitle from "../../../app/utils/nameFromTitle"

describe('nameFromTitle', () => {
  const cases = [
    {
      describe: 'lowercases and replaces spaces with underscores',
      title: 'The Quick Brown Fox Jumps Over the Lazy Dog',
      expectedName: 'the_quick_brown_fox_jumps_over_the_lazy_dog'
    },
    {
      describe: 'prepends dataset_ if the title would start with a number',
      title: '2020 Demographic Data by Borough - New York City',
      expectedName: 'dataset_2020_demographic_data_by_borough_new_york_city'
    },
    {
      describe: 'removes special characters',
      title: 'Tweets by @qri_io & hashtag #opendata, January 2020, 100% coverage',
      expectedName: 'tweets_by_qri_io_hashtag_opendata_january_2020_100_coverage'
    },
    {
      describe: 'rejects emoji',
      title: '🚀 New Fun Data for Great Good 🤓',
      expectedName: 'new_fun_data_for_great_good'
    }
  ]

  cases.forEach(({ describe, title, expectedName }) => {
    it(`case '${describe}'`, () => {
      const got = nameFromTitle(title)
      expect(got).toStrictEqual(expectedName)
    })
  })
})
