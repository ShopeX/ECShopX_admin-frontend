import { SpPickerPlugin } from '@/components/sp-picker'

function installComponent(Vue) {
  const plugins = {
    SpPickerPlugin
  }

  const baseContext = require.context('./../components', true, /index(\.vue|\.js)$/)
  const components = {}
  function resloveModule(mod) {
    Object.keys(mod).forEach((key) => {
      mod[key].name && (components[mod[key].name] = mod[key])
    })
  }

  baseContext.keys().forEach((key) => {
    const mod = baseContext(key)
    resloveModule(mod)
  })

  console.log('components:', components, plugins)
  Object.keys(components).forEach((key) => {
    const comp = components[key]
    Vue.component(comp.name, comp)
  })

  Object.keys(plugins).forEach((name) => {
    const plugin = plugins[name]
    Vue.use(plugin)
  })
}

export { installComponent }
