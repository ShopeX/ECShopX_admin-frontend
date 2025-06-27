import '@/styles/index.scss'
import 'nprogress/nprogress.css'
// TODO:后续要优化掉
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

async function initApplication() {
  const { bootstrap } = await import('@/bootstrap/index.js')
  await bootstrap()
}

initApplication()
