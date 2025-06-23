import '@/styles/index.scss'
import 'nprogress/nprogress.css'

async function initApplication() {
  const { bootstrap } = await import('@/bootstrap/index.js')
  await bootstrap()
}

initApplication()
