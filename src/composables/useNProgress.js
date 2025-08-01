import NProgress from 'nprogress'

let nProgressInstance = null

function useNProgress() {
  const loadNprogress = async () => {
    if (nProgressInstance) {
      return nProgressInstance
    }

    nProgressInstance = await import('nprogress')
    nProgressInstance.configure({
      showSpinner: true,
      speed: 300
    })
    return nProgressInstance
  }

  const startProgress = async (fn) => {
    const nprogress = await loadNprogress()
    nprogress?.start()
  }

  const stopProgress = async (fn) => {
    const nprogress = await loadNprogress()
    nprogress?.done()
  }

  return {
    startProgress,
    stopProgress
  }
}

export { useNProgress }
