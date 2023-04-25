<template>
  <el-container class="page-layout">
    <!--左侧菜单开始-->
    <el-aside class="aside">
      <div class="menu-warp view-flex">
        <div class="main-menu">
          <!-- brand logo -->
          <div class="brand-con">
            <div v-if="login_type === 'merchant'">
              <div class="img-wrap">
                <img :src="brandIco" alt="">
              </div>
            </div>
            <router-link
              v-else
              class="brand-link"
              :to="`${
                login_type == 'distributor' || login_type == 'dealer'
                  ? $store.getters.menus[0].children[0].url
                  : '/'
              }`"
            >
              <div class="img-wrap">
                <img :src="sys_logo" alt="">
              </div>
            </router-link>
          </div>
          <!-- menu list -->
          <div class="main-menu__con">
            <el-menu text-color="#fff" :default-active="activeIndex" @select="handleSelectMenu">
              <el-menu-item
                v-for="(item, index) in menuList"
                :key="`menu-item__${index}`"
                :index="item.url"
              >
                <router-link :to="getMenuUrl(item)">
                  <!-- <i class="iconfont" :class="`icon-${item.icon}`" /> -->
                  <i :class="['ecx-icon', `icon-${getIconName(item.icon)}`]" />
                  <span>{{ item.name }}</span>
                </router-link>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <!-- 二级菜单 -->
        <div v-if="$route.meta && !$route.meta.hidemenu" class="sub-menu">
          <el-menu :default-active="activeSubIndex">
            <template v-for="(child, cindex) in submenuList">
              <el-submenu
                v-if="child.children && child.children[0].is_menu"
                :key="`cmenu-${cindex}`"
                :index="`${cindex}`"
                class="menu-group"
              >
                <template slot="title">
                  <i class="iconfont icon-xiala" />{{ child.name }}
                </template>
                <template v-for="sub in child.children">
                  <div :key="sub.url" class="menu-three">
                    <el-menu-item
                      v-if="sub.is_show && sub.is_menu"
                      :index="sub.url"
                      :class="{ 'is-active': sub.url == activeSubIndex }"
                    >
                      <router-link :to="sub.url">
                        {{ sub.name }}
                      </router-link>
                    </el-menu-item>
                  </div>
                </template>
              </el-submenu>
              <div
                v-else-if="child.is_show && child.is_menu"
                :key="`cmenu-${cindex}`"
                :index="cindex"
                class="sub-menu-item"
              >
                <el-menu-item
                  :index="child.url"
                  :class="{ 'is-active': child.url == activeSubIndex }"
                >
                  <router-link :to="child.url">
                    {{ child.name }}
                  </router-link>
                </el-menu-item>
              </div>
            </template>
          </el-menu>
        </div>
      </div>
    </el-aside>

    <el-container class="app-container">
      <el-header v-if="isShowHeader()" class="header" height="48px">
        <div class="header-left">
          <!-- activeIndex: {{activeIndex}}
          activeSubIndex: {{activeSubIndex}} -->
        </div>
        <div class="header-right">
          <div class="icon-nav">
            <el-badge v-if="login_type == 'distributor'">
              <i class="iconfont icon-store-alt" @click="handleClickSelectShop" />
            </el-badge>
          </div>
          <div class="user-setting">
            <el-popover
              v-model="showUserPopover"
              placement="bottom"
              trigger="hover"
              popper-class="logout-popper"
            >
              <div class="popover-row base" @click="handleUserInfo">
                <div class="avatar">
                  <img v-if="avatar" class="user-avatar" :src="avatar">
                  <i v-else class="user-avatar iconfont icon-user-circle1" />
                </div>
                <div class="username">
                  <div>{{ nick_name || name }}</div>
                  <small class="muted">账号信息</small>
                </div>
              </div>
              <div class="popover-row exit-system" @click="logout">退出登录</div>

              <img v-if="avatar" slot="reference" class="user-avatar" :src="avatar">
              <i v-else slot="reference" class="iconfont icon-user-circle1" />
            </el-popover>
          </div>
        </div>
      </el-header>
      <el-main style="position: relative; background: #f0f2f5">
        <router-view
          class="content-container"
          :class="{ 'footer-fixed': $route.meta && $route.meta.footerFixed }"
        />
        <div class="system-release">
          <img v-if="VERSION_B2C" :src="loginBottomB2c" alt="" class="system-image">
          <img
            v-if="VERSION_IN_PURCHASE"
            :src="loginBottomInpurchase"
            alt=""
            class="system-image"
          >
          <img v-if="VERSION_PLATFORM" :src="loginBottomPlatform" alt="" class="system-image">
          <img v-if="VERSION_STANDARD" :src="loginBottomStandard" alt="" class="system-image">
          <!-- {{ VUE_APP_SYSTEM_NAME }} -->
        </div>
        <div id="design-view" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
const loginBottomB2c = require('@/assets/logo_bottom/b2c.png')
const loginBottomInpurchase = require('@/assets/logo_bottom/in_purchase.png')
const loginBottomPlatform = require('@/assets/logo_bottom/platform.png')
const loginBottomStandard = require('@/assets/logo_bottom/standard.png')

import { mapGetters, mapMutations, mapState } from 'vuex'
import { getAuthorizelogout } from '@/api/login'
import { ICON_MAP } from '@/consts'
import { VERSION_STANDARD, isInSalesCenter } from '@/utils'
import { micrApp } from '@/utils/micr-app'
import store from '@/store'
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.activeIndex = to.matched[0].path || '/'
    })
  },
  beforeRouteUpdate(to, from, next) {
    // console.log('beforeRouteUpdate', to, from, this.submenuList)
    this.submenuList.forEach((menu, index) => {
      if (typeof menu.children == 'undefined') {
        if (menu.url == to.path) {
          this.menuOpeneds = [`${index}`]
        }
      } else {
        if (menu.children.find((item) => item.url == to.path)) {
          this.menuOpeneds = [`${index}`]
        }
      }
    })
    next()
  },
  data() {
    return {
      isShowAside: 'false',
      findMenu: false,
      menusList: [],
      homeIndex: '',
      brandIco: '',
      showUserPopover: false,
      activeIndex: '',
      menuOpeneds: [],
      loginBottomB2c,
      loginBottomInpurchase,
      loginBottomPlatform,
      loginBottomStandard
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'nick_name',
      'avatar',
      'wxapp_id',
      'template_name',
      'login_type',
      'sys_logo'
    ]),
    ...mapState({
      menuList: (state) => {
        const { menus } = state.menu
        if (store.getters.login_type == 'distributor') {
          menus.forEach((menu) => {
            const paths = menu.url.match(/\/\w+/g)
            menu.url = `${paths[0]}${paths[1]}`
          })
        }
        return menus
      }
    }),
    submenuList() {
      let list = []
      const fd = this.menuList.find((item) => {
        // const paths = item.url.match(/\/[a-z]+/g)
        const paths = item.url.match(/\/\w+/g)
        if ((paths && paths[0] == '/shopadmin') || (paths && paths[0] == '/dealer')) {
          // return `${paths[0]}${paths[1]}` == this.activeIndex
          return `${paths[0]}${paths[1]}` == this.$route.matched[0].path
        } else {
          // return item.url == this.activeIndex
          return item.url == this.$route.matched[0].path
        }
      })
      return fd ? fd.children : []
    },
    activeSubIndex() {
      return this.$route.matched.length > 1 ? this.$route.matched[1].path : ''
    }
  },
  mounted() {
    this.getSystemSetting()
    micrApp.init()

    console.log(this.$route)
    console.log(this.VUE_APP_PRODUCT_MODEL, '----version----')
  },
  methods: {
    ...mapMutations(['SYSTEM_EXIT']),
    getIconName(icon) {
      return ICON_MAP[icon] || ''
    },
    isShowHeader() {
      return !isInSalesCenter()
    },
    handleSelectMenu(key) {
      const paths = key.match(/\/\w+/g)
      if ((paths && paths[0] == '/shopadmin') || (paths && paths[0] == '/dealer')) {
        this.activeIndex = `${paths[0]}${paths[1]}`
      } else {
        this.activeIndex = key
      }
      // const activeMenu = this.menuList.find(item => item.url == key)
      // const getUrl = this.getMenuUrl(activeMenu)
      // this.activeSubIndex = getUrl
    },
    // 获取系统配置信息
    async getSystemSetting() {
      const { logo } = await this.$api.system.getBrandLogo()
      if (logo) {
        this.brandIco = logo
      } else {
        if (this.VERSION_STANDARD) {
          this.brandIco = require(`@/assets/logo/logo_standard.png`)
        } else if (this.VERSION_B2C) {
          this.brandIco = require(`@/assets/logo/logo_b2c.png`)
        } else if (this.VERSION_IN_PURCHASE) {
          this.brandIco = require(`@/assets/logo/logo_inpurchase.png`)
        } else if (this.VERSION_PLATFORM && this.VUE_APP_FREE) {
          this.brandIco = require(`@/assets/logo/logo_ecshopx.png`)
        } else if (this.VERSION_PLATFORM && !this.VUE_APP_FREE) {
          this.brandIco = require(`@/assets/logo/logo_ecshopx.png`)
        }
      }
      this.$store.dispatch('setSysLogo', this.brandIco)
    },
    // 获取菜单url
    getMenuUrl(item) {
      let url = ''
      if (item.children) {
        if (item.children[0].children) {
          url = item.children[0].children[0].url
        } else {
          url = item.children[0].url
        }
      } else {
        url = item.url
      }
      return url
    },
    handleClickSelectShop() {
      this.$router.push({
        path: '/shopadmin/shoplist'
      })
    },
    handleUserInfo() {
      // debugger
      if (this.$store.getters.login_type === 'distributor') {
        this.$router.push({
          path: '/shopadmin/admininfo'
        })
      } else {
        this.$router.push({
          path: '/admininfo'
        })
      }
      // this.$router.push({
      //   path: this.matchInternalRoute('admininfo')
      // })
    },
    async logout() {
      const loginType = this.login_type
      await this.$api.login.getAuthorizelogout()
      await this.SYSTEM_EXIT()
      if (loginType == 'distributor') {
        window.location.href = `/shopadmin/login`
      } else if (loginType == 'dealer') {
        window.location.href = `/dealer/login`
      } else if (loginType == 'merchant') {
        window.location.href = `/merchant/login`
      } else {
        window.location.href = `/login`
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page-layout {
  height: 100%;
}
.aside {
  z-index: 22;
  width: auto !important;
}
.menu-warp {
  height: 100%;
}
.brand-con {
  margin-top: 10px;
  .brand-link {
    display: block;
  }
  .img-wrap {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
.main-menu {
  width: 92px;
  background: #353439;
  position: relative;
  &__con {
    position: absolute;
    top: 72px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
  }
  .el-menu {
    background: #353439;
    border-right-width: 0;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    // display: flex;
    // align-items: center;
    padding: 0 8px !important;
    &.is-active {
      a {
        color: $color-primary;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
      }
      .ecx-icon {
        color: $color-primary;
      }
    }
    &:hover {
      background: transparent;
      a {
        color: $color-primary;
      }
      .ecx-icon {
        color: $color-primary;
      }
    }
    > a {
      display: block;
      color: #fff;
      padding-left: 10px;

      // flex: 1;
      // display: flex;
      // align-items: center;
      // justify-content: center;
    }
    .ecx-icon {
      color: #fff;
      font-size: 15px;
      margin-right: 4px;
    }
  }
}
.sub-menu {
  width: 130px;
  overflow-y: auto;
  background: #fff;
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.06);
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  // .menu-group {
  //   margin-bottom: 20px;
  // }
  .el-menu {
    background: #fff;
    border-right-width: 0;
    margin-top: 8px;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0 8px !important;
    display: flex;
    align-items: center;
    &.is-active {
      > a {
        // background: rgba(20, 128, 227, 0.1);
        background: rgba(var(--themeColorRgb), 0.1);
        border-radius: 2px;
        color: $color-primary;
      }
    }
    &:hover {
      background: transparent;
      a {
        color: $color-primary;
      }
    }
    a {
      display: block;
      color: #545d7a;
      // flex: 1;
      // display: flex;
      // padding-left: 24px;
      padding: 0 4px;
    }
    i {
      color: $dominant_hue;
    }
  }
}
.sub-menu-item {
  margin-left: 14px;
}
.header {
  display: flex;
  justify-content: space-between;
  &-right {
    display: flex;
    align-items: center;
    height: 100%;
    .icon-store-alt {
      font-size: 24px;
      margin-right: 20px;
    }
    .icon-user-circle1 {
      font-size: 28px;
    }
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
}

.el-main {
  padding: 16px;
  .content-container {
    background-color: #fff;
    padding: 16px;
    border-radius: 0;
    min-height: calc(100vh - 70px);
    &.footer-fixed {
      margin-bottom: 57px;
    }
  }
}
.menu-three {
  margin-left: 10px;
  .el-menu-item {
    min-width: inherit;
  }
}
</style>
<style lang="scss">
.page-layout {
  .el-menu {
    background: #fff;
  }
  .el-submenu {
    &.is-opened {
      .icon-xiala {
        transform: rotate(0deg);
        transition: all 0.3s ease-in-out;
      }
    }
    &__title {
      height: 40px;
      line-height: 40px;
      padding-left: 25px !important;
      display: flex;
      align-items: center;
      position: relative;

      .icon-xiala {
        color: #666;
        font-size: 14px;
        margin-right: 4px;
        position: absolute;
        left: 8px;
        transform: rotate(-90deg);
        transition: all 0.3s ease-in-out;
      }
      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }
}
.popover-row.base {
  padding: 10px;
  cursor: pointer;
}
.popover-row.exit-system {
  padding: 0px 12px 7px;
  font-size: 12px;
  cursor: pointer;
}
.menu-group {
  .icon-shouqijiantouxiao {
    font-size: 12px;
    color: #3d4355;
    margin-right: 4px;
    transform: scale(0.8);
    display: inline-block;
  }
  .el-menu-item-group__title {
    padding: 0 0 0 10px !important;
    height: 40px;
    line-height: 40px;
    color: #3d4355;
    font-size: 14px;
  }
  > ul {
    margin-left: 14px;
  }
}
.app-container {
  // padding-bottom: 50px;
  .header {
    background-color: #fff;
  }
}
.system-release {
  text-align: center;
  font-size: 16px;
  color: #cdcbcb;
  margin-top: 16px;
}
.system-image {
  height: 22px;
}
</style>
