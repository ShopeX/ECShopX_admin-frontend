import { createTypedSection } from '../factory.js'

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
            title: '品牌介绍',
            content:
              '<p><strong>关于我们的品牌</strong></p><p>我们专注于提供高品质商品与贴心服务，为每一次购物带来更好的体验。</p>',
            column_span: 4
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: '购物指南',
            menu: null,
            menu_items: [
              { label: '新品上市', url: '#' },
              { label: '热销商品', url: '#' },
              { label: '产品系列', url: '#' },
              { label: '优惠活动', url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: '关于我们',
            menu: null,
            menu_items: [
              { label: '品牌故事', url: '#' },
              { label: '加入我们', url: '#' },
              { label: '新闻资讯', url: '#' },
              { label: '可持续发展', url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: '客户服务',
            menu: null,
            menu_items: [
              { label: '联系我们', url: '#' },
              { label: '退换货说明', url: '#' },
              { label: '服务条款', url: '#' },
              { label: '配送政策', url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-text',
          settings: {
            title: '订阅我们的电子邮件',
            content: '<p>请留下您的邮箱以获取最新资讯。</p>',
            column_span: 4
          }
        },
        {
          type: 'footer-image',
          settings: {
            image: '',
            link: '',
            alt: '页脚图片',
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
