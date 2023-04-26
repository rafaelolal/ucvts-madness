export const pow2ceil = (v: number) => {
  var p = 2
  while ((v >>= 1)) {
    p <<= 1
  }
  return p
}

export const addEllipsis = (str: string, length: number) => {
  if (str.length <= length) {
    return str
  }

  return str.slice(0, length - 3) + '...'
}
