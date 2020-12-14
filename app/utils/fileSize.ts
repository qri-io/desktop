export default function fileSize (l: number): string {
  var length = { name: '', value: 0 }
  if (l > Math.pow(2, 80)) {
    length.name = 'YB'
    length.value = Math.trunc(l / Math.pow(2, 80))
  } else if (l > Math.pow(2, 70)) {
    length.name = 'ZB'
    length.value = Math.trunc(l / Math.pow(2, 70))
  } else if (l > Math.pow(2, 60)) {
    length.name = 'EB'
    length.value = Math.trunc(l / Math.pow(2, 60))
  } else if (l > Math.pow(2, 50)) {
    length.name = 'PB'
    length.value = Math.trunc(l / Math.pow(2, 50))
  } else if (l > Math.pow(2, 40)) {
    length.name = 'TB'
    length.value = Math.trunc(l / Math.pow(2, 40))
  } else if (l > Math.pow(2, 30)) {
    length.name = 'GB'
    length.value = Math.trunc(l / Math.pow(2, 30))
  } else if (l > Math.pow(2, 20)) {
    length.name = 'MB'
    length.value = Math.trunc(l / Math.pow(2, 20))
  } else if (l > Math.pow(2, 10)) {
    length.name = 'KB'
    length.value = Math.trunc(l / Math.pow(2, 10))
  } else if (l > 0) {
    length.name = 'byte'
    length.value = l
  }
  if (l !== 1) {
    length.name += 's'
  }
  return `${length.value}${length.name}`
}

var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export function abbreviateNumber (number: number) {
  if (number === undefined) {
    return undefined
  }
  // what tier? (determines SI symbol)
  var tier = Math.log10(number) / 3 | 0

  // if zero, we don't need a suffix
  if (tier === 0) {
    if (Number.isInteger(number)) {
      return number
    }
    return number.toFixed(3)
  }

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier]
  var scale = Math.pow(10, tier * 3)

  // scale the number
  var scaled = number / scale

  // format number and add suffix
  return scaled.toFixed(1) + suffix
}
