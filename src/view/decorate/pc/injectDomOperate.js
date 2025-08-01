import $ from 'jquery'
import { ACTIONS } from './util'
import cssText from './injectCss'

export default class InjectDomOperations {
  constructor({ iframe, rootDomClass, targetClass, callback, bodyDomClass, isedit = true }) {
    this.iframe = iframe
    this.root = $(iframe.document).find(`.${rootDomClass}`)
    this.body = this.root.find(`.${bodyDomClass}`)
    this.bodyDomClass = bodyDomClass
    this.rootDomClass = rootDomClass
    this.targetClass = targetClass
    this.targetDoms = this.body.find(`.${targetClass}`)
    this.callback = callback
    this.isedit = isedit
    this.doms = {
      // mark:() => $(`<div class='sp-iframe--mark'><div>`),
      down: () =>
        $(`<div class='button-item'>位置⬇<div>`).on('click', (e) => {
          e.stopPropagation()
          const options = {
            action: ACTIONS.DOWN,
            payload: { ...this.getActionBaseInfo(e.currentTarget) }
          }
          callback(options)
        }),
      up: () =>
        $(`<div class='button-item'>位置⬆<div>`).on('click', (e) => {
          e.stopPropagation()
          const options = {
            action: ACTIONS.UP,
            payload: { ...this.getActionBaseInfo(e.currentTarget) }
          }
          callback(options)
        }),
      del: () =>
        $(`<div class='button-item'>删除<div>`).on('click', (e) => {
          e.stopPropagation()
          const options = {
            action: ACTIONS.DELETE,
            payload: { ...this.getActionBaseInfo(e.currentTarget) }
          }
          callback(options)
        }),
      add: (btnCls = 'button-item', text = '添加') =>
        $(`<div class=${btnCls}>${text}<div>`).on('click', (e) => {
          e.stopPropagation()
          const options = {
            action: ACTIONS.ADD,
            payload: { ...this.getActionBaseInfo(e.currentTarget) }
          }
          callback(options)
        })
    }

    this.init()
  }
  injectCss() {
    if ($(this.iframe.document).find('#template_css').length == 0) {
      $(this.iframe.document)
        .find('head')
        .append(
          $(
            `<style>
            ${cssText}
          </style>`,
            { type: 'text/css', id: 'template_css' }
          )
        )
    }
  }
  injectHover() {
    this.targetDoms.on('mouseenter', (e) => {
      const current = $(e.currentTarget)
      current.addClass('wgt-hover')
    })
    this.targetDoms.on('mouseleave', (e) => {
      const current = $(e.currentTarget)
      current.removeClass('wgt-hover')
    })
  }
  injectCheck() {
    this.body.on('click', (e) => {
      let current = null
      if ($(e.target).hasClass('mark') || $(e.target).parent().hasClass('mark')) return
      else if ($(e.target).hasClass(this.targetClass)) {
        current = $(e.target)
      } else {
        const parents = $(e.target).parents()
        current = [...parents].find((item) => {
          return $(item).hasClass(this.targetClass)
        })
        current = current ? $(current) : null
      }
      if (!current) return
      this.body.children().removeClass('template-active')
      current.addClass('template-active')
      if (current.find('.mark').length == 0) {
        const actionDoms = $(`<div class='mark'></div>`)
        Object.keys(this.doms).forEach((key) => actionDoms.append(this.doms[key]()))
        current.append(actionDoms)
      }
      this.callback({
        action: ACTIONS.CHECKED,
        payload: { ...this.getActionBaseInfo(current) }
      })
    })
  }
  getTargetState(current) {
    const $current = $(current)
    let doms = [...$current.parents(), current]
    return (targetCls, stateName) => {
      const target = [...doms].find((item) => {
        return $(item).hasClass(targetCls)
      })
      return $(target).attr(stateName)
    }
  }
  getActionBaseInfo(target) {
    const getState = this.getTargetState(target)
    const uuid = getState(this.targetClass, 'data-uuid')
    return { uuid }
  }
  init() {
    this.injectCss()
    if (this.isedit) {
      setTimeout(() => {
        this.root.append(this.doms.add('button-primary', '添加模块'))
        // this.body.append(this.doms.mark())
      }, 500)
      this.injectCheck()
      this.injectHover()
    }
    // this.injectObserver()
  }
}
