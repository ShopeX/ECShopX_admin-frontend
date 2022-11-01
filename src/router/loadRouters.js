import Routes, { routesParamsKey } from './routers'
import store from '@/store'

const pathPrefix = process.env.PREFIXES

export default {
  getComponentName: function (path) {
    let name = path.split('/')
    name = name[name.length - 1]
    return `${name.substr(0, 1).toUpperCase()}${name.substr(1)}`
  },
  addRouters: function (menu) {
    console.log('...addRouters')
    const menus = menu || store.getters.menus
    console.log('...menus', menus)
    if (menus) {
      let _routes = []
      menus.forEach((item, index) => {
        const itemPath =
          item.defaultPage || item.isChildrenMenu
            ? item.children[0].isChildrenMenu
              ? item.children[0].children[0].url
              : item.children[0].url
            : item.url
        let routeItem = {
          path: pathPrefix
            ? itemPath == '/'
              ? `/${pathPrefix}`
              : `/${pathPrefix}${itemPath}`
            : itemPath,
          name: item.name,
          component: Routes.Home,
          iconCls: item.icon,
          meta: { sn: `${index}` },
          children: []
        }
        if (!item.isChildrenMenu) {
          const ipath = pathPrefix
            ? item.url == '/'
              ? `/${pathPrefix}`
              : `/${pathPrefix}${item.url}`
            : item.url
          const adminPath = pathPrefix ? `/${pathPrefix}/admininfo` : '/admininfo'
          let childItem = [
            {
              path: ipath,
              component: Routes.Layout,
              name: item.name,
              children: [
                {
                  path: ipath,
                  component: Routes.Dashboard,
                  meta: {
                    sn: `${index}`,
                    hideMenu: true
                  },
                  name: item.name
                }
              ]
            },
            {
              path: adminPath,
              component: Routes.Layout,
              name: item.name,
              children: [
                {
                  path: adminPath,
                  component: Routes.Admininfo,
                  meta: {
                    sn: `${index}`,
                    hideMenu: true
                  },
                  name: '管理员信息'
                }
              ]
            }
          ]
          routeItem.children = [...routeItem.children, ...childItem]
        } else {
          item.children.forEach((child) => {
            const childPath = pathPrefix ? `/${pathPrefix}${child.url}` : child.url
            let childItem = {
              path: childPath,
              component: Routes.Layout,
              name: child.name,
              isLeaf: !!child.children,
              children: [],
              hidden: this.getComponentName(child.url) === 'Design'
            }
            if (child.isChildrenMenu) {
              child.children.forEach((sub) => {
                const subPath = pathPrefix ? `/${pathPrefix}${sub.url}` : sub.url
                //console.log("subPath:", subPath);
                let subItem = {
                  path: subPath,
                  component: Routes[this.getComponentName(sub.url)],
                  meta: {
                    sn: `${index}`,
                    hideMenu:
                      !sub.is_menu || !sub.is_show || this.getComponentName(sub.url) === 'Wxapp'
                  },
                  name: sub.name,
                  children: this.matchRouter(sub.url)
                }
                childItem.children.push(subItem)
              })
            } else {
              // console.log(
              //   "childPath:",
              //   childPath,
              //   this.getComponentName(child.url)
              // );
              let subItem = {
                path: childPath,
                component: Routes[this.getComponentName(child.url)],
                meta: {
                  sn: `${index}`,
                  hideMenu:
                    !child.is_menu ||
                    !child.is_show ||
                    this.getComponentName(child.url) === 'Wxapp' ||
                    this.getComponentName(child.url) === 'Design'
                },
                name: child.name,
                children: this.matchRouter(child.url)
              }
              childItem.children.push(subItem)
            }
            routeItem.children.push(childItem)
          })
        }
        _routes.push(routeItem)
      })
      if (pathPrefix) {
        _routes.push({
          path: '/',
          redirect: `/${pathPrefix}`,
          name: '',
          component: Routes.Home,
          iconCls: '',
          meta: { sn: '0' }
        })
      }

      return _routes
    }
  },
  matchRouter: function (path) {
    const homePath = pathPrefix ? `/${pathPrefix}` : '/'
    if (path !== homePath) {
      let name = this.getComponentName(path)
      let child = []

      for (var key in Routes) {
        const url = pathPrefix
          ? `/${pathPrefix}${path}/${key.toLowerCase()}`
          : `${path}/${key.toLowerCase()}`
        if (key.indexOf(name + '_') == 0) {
          child.push({
            path: url,
            component: Routes[`${key}`],
            name: '新增'
          })

          if (routesParamsKey[key] !== undefined) {
            child.push({
              path: `${url}/:${routesParamsKey[key]}`,
              component: Routes[`${key}`],
              name: '编辑'
            })
          } else {
            child.push({
              path: `${url}/:id`,
              component: Routes[`${key}`],
              name: '编辑'
            })
          }
        }
      }
      return child
    }
  }
}
