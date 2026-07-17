import { createTypedSection } from '../factory.js'
import { i18nValue } from '../../utils/i18n.js'

const footerDocument = {
  type: 'footer',
  sections: [
    {
      type: 'footer',
      fixedId: 'footer',
      blocks: [
        {
          type: 'footer-text',
          settings: {
            title: i18nValue('a01949a4.add0b7', '品牌介绍'),
            content: i18nValue(
              'a01949a4.2da9ae',
              '<p><strong>关于我们的品牌</strong></p><p>我们专注于提供高品质商品与贴心服务，为每一次购物带来更好的体验。</p>'
            ),
            column_span: 4
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: i18nValue('a01949a4.4d9b19', '购物指南'),
            menu: null,
            menu_items: [
              { label: i18nValue('a01949a4.5e2186', '新品上市'), url: '#' },
              { label: i18nValue('a01949a4.34cb57', '热销商品'), url: '#' },
              { label: i18nValue('a01949a4.81af76', '产品系列'), url: '#' },
              { label: i18nValue('a01949a4.cd5666', '优惠活动'), url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: i18nValue('a01949a4.3b2e36', '关于我们'),
            menu: null,
            menu_items: [
              { label: i18nValue('a01949a4.c0af65', '品牌故事'), url: '#' },
              { label: i18nValue('a01949a4.aee49a', '加入我们'), url: '#' },
              { label: i18nValue('a01949a4.1df098', '新闻资讯'), url: '#' },
              { label: i18nValue('a01949a4.5e2872', '可持续发展'), url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: i18nValue('a01949a4.2039ae', '客户服务'),
            menu: null,
            menu_items: [
              { label: i18nValue('a01949a4.0cbf83', '联系我们'), url: '#' },
              { label: i18nValue('a01949a4.9a10f4', '退换货说明'), url: '#' },
              { label: i18nValue('a01949a4.e38f72', '服务条款'), url: '#' },
              { label: i18nValue('a01949a4.72801f', '配送政策'), url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-text',
          settings: {
            title: i18nValue('a01949a4.3b4325', '订阅我们的电子邮件'),
            content: i18nValue('a01949a4.d99f9d', '<p>请留下您的邮箱以获取最新资讯。</p>'),
            column_span: 4
          }
        },
        {
          type: 'footer-image',
          settings: {
            image: '',
            link: '',
            alt: i18nValue('a01949a4.32e83c', '页脚图片'),
            column_span: 12
          }
        }
      ]
    }
  ]
}

export function createFooterDocumentDsl() {
  const sections = {}
  const order = []

  ;(footerDocument.sections || []).forEach((item) => {
    if (!item?.type) return
    const section = createTypedSection(item.type, {
      fixedId: item.fixedId,
      settings: item.settings,
      blocks: item.blocks
    })
    sections[section.id] = section
    order.push(section.id)
  })

  return {
    pageType: 'footer',
    pageId: 'footer',
    sections,
    order
  }
}

export default footerDocument
