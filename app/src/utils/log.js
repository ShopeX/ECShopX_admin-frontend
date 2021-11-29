const numb = () => {}

const debug = (...args) => {
  let cArgs = []
  args.forEach((item, index) => {
    let cItem
    if (index === 0) {
      cItem = ['%c ' + item, 'color: #3e76f6']
    } else {
      cItem = item
    }
    cArgs = cArgs.concat(cItem)
  })
  console.log.apply(null, cArgs)
}
const log = {
  ...console,
  debug: process.env.NODE_ENV === 'development' ? debug : numb
}

export default log
