export const pow2ceil = (v: number) => {
  var p = 2
  while ((v >>= 1)) {
    p <<= 1
  }
  return p
}
