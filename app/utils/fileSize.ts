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
