import '@/styles/index.scss'

async function initApplication() {
  const { bootstrap } = await import('@/bootstrap/index.js')
  await bootstrap()
}

initApplication()
