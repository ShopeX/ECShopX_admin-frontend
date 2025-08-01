import { SOURCE, POST_SOURCE } from './util'

export default class PostMessage {
  constructor(postUrl, postWind) {
    this.url = postUrl
    this.postWind = postWind || window
  }
  setPostWind(postWind) {
    this.postWind = postWind
  }
  post({ action, payload }) {
    this.postWind.postMessage(
      {
        source: SOURCE,
        payload: payload,
        action
      },
      this.url
    )
  }
  onMessage(callback) {
    window.addEventListener('message', (event) => {
      // 确保消息来源是可信的
      //   if (event.origin !== this.url) return
      if (event.data.source == POST_SOURCE) {
        callback && callback(event)
      }
    })
  }
  removeMessage() {
    window.removeEventListener('message', () => {})
  }
}
