import Home from '@/view/home'
import authloading from '@/view/authloading'

const pathPrefix = process.env.PREFIXES

let auth = {
  path: pathPrefix ? `/${pathPrefix}/auth` : '/auth',
  component: Home,
  name: '',
  hidden: true,
  children: [
    {
      path: pathPrefix ? `/${pathPrefix}/auth/:auth_type` : '/auth/:auth_type',
      component: authloading,
      name: '绑定'
    }
  ]
}

export default auth
