import '@/i18n/lang/index.js'
import '@/styles/index.scss'
import 'nprogress/nprogress.css'
// TODO:后续要优化掉
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'video.js/dist/video-js.css'

async function initApplication() {
  const { bootstrap } = await import('@/bootstrap/index.js')
  await bootstrap()
}

import('@/composables/useTheme.js').then(res => {
  const { updateThemeColor } = res.useTheme()
  updateThemeColor()

  initApplication()
})
