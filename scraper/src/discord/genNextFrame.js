export default function(time) {
  return new Promise((res, rej) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        res()
      }, time || 0)
    })
  })
}
