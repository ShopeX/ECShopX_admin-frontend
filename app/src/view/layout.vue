<template>
  <el-container class="page-layout">
    <!--左侧菜单开始-->
    <el-aside class="aside">
      <div class="menu-warp view-flex">
        <div class="main-menu">
          <div class="brand-con">
            <div v-if="$store.getters.login_type==='merchant'">
              <div class="img-wrap">
                <img :src="brandIco" alt="" />
              </div>
            </div>
            <router-link
              v-else
              class="brand-link"
              :to="`${
                $store.getters.login_type == 'distributor' || $store.getters.login_type == 'dealer'
                  ? $store.getters.menus[0].children[0].url
                  : '/'
              }`"
            >
              <div class="img-wrap">
                <img :src="brandIco" alt="" />
              </div>
            </router-link>
          </div>
          <div class="main-menu__con">
            <el-menu text-color="#fff" :default-active="activeIndex" @select="handleSelectMenu">
              <el-menu-item
                v-for="(item, index) in menuList"
                :index="item.url"
                :key="`menu-item__${index}`"
              >
                <router-link :to="getMenuUrl(item)">
                  <i class="iconfont" :class="`icon-${item.icon}`"></i>
                  <span>{{ item.name }}</span>
                </router-link>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="sub-menu" v-if="$route.meta && !$route.meta.hidemenu">
          <el-menu :default-active="activeSubIndex">
            <template v-for="(child, cindex) in submenuList">
              <el-menu-item-group
                v-if="child.children && child.children[0].is_menu"
                class="menu-group"
                :key="`cmenu-${cindex}`"
              >
                <template slot="title"><i class="iconfont icon-shouqijiantouxiao"></i>{{ child.name }}</template>
                <template v-for="sub in child.children" v-if="sub.is_show && sub.is_menu">
                  <el-menu-item
                    :key="sub.url"
                    :index="sub.url"
                    :class="{ 'is-active': sub.url == activeSubIndex }"
                  >
                    <router-link :to="sub.url">
                      {{ sub.name }}
                    </router-link>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
              <div v-else-if="child.is_show && child.is_menu" :key="`cmenu-${cindex}`">
                <el-menu-item
                  :index="child.url"
                  :class="{ 'is-active': child.url == activeSubIndex }"
                >
                  <router-link :to="child.url">{{ child.name }}</router-link>
                </el-menu-item>
              </div>
            </template>
          </el-menu>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="header" height="48px" v-if="isShowHeader()">
        <div class="header-left">
          <!-- activeIndex: {{activeIndex}}
          activeSubIndex: {{activeSubIndex}} -->
        </div>
        <div class="header-right">
          <div class="icon-nav">
            <el-badge v-if="this.$store.getters.login_type == 'distributor'">
              <i class="iconfont icon-store-alt" @click="handleClickSelectShop"></i>
            </el-badge>
          </div>
          <div class="user-setting">
            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="logout-popper"
              v-model="showUserPopover"
            >
              <div class="popover-row base" @click="handleUserInfo">
                <div class="avatar">
                  <img v-if="avatar" class="user-avatar" :src="avatar" />
                  <i v-else class="user-avatar iconfont icon-user-circle1"></i>
                </div>
                <div class="username" >
                  <div>{{ nick_name || name }}</div>
                  <small class="muted">账号信息</small>
                </div>
              </div>
              <div class="popover-row exit-system" @click="logout">退出登录</div>

              <img slot="reference" v-if="avatar" class="user-avatar" :src="avatar" />
              <i v-else slot="reference" class="iconfont icon-user-circle1"></i>
            </el-popover>
          </div>
        </div>
      </el-header>
      <el-main style="position: relative; background: #F0F2F5;">
        <div class="content-container">
          <router-view></router-view>
        </div>
        <!-- <section id="container" class="content-container">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </section> -->
        <div id="design-view"></div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { getAuthorizelogout } from '@/api/login'
import { log, isInSalesCenter } from '@/utils'
import { micrApp } from '@/utils/micr-app'
import store from '@/store'
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.activeIndex = to.matched[0].path || '/'
    })
  },
  data() {
    return {
      isShowAside: 'false',
      findMenu: false,
      menusList: [],
      homeIndex: '',
      brandIco: '',
      showUserPopover: false,
      activeIndex: ''
    }
  },
  computed: {
    ...mapGetters(['name', 'nick_name', 'avatar', 'wxapp_id', 'template_name', 'login_type']),
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
  },
  methods: {
    ...mapMutations(['SYSTEM_EXIT']),
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
        const companyBrandImg =
          process.env.VUE_APP_PRODUCT_MODEL === 'standard' ? 'onex' : 'ecshopx'
        this.brandIco = require(`@/assets/img/${companyBrandImg}/logo_ico.svg`)
      }
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
      console.log(this.matchInternalRoute('admininfo'));
      // debugger
      this.$router.push({
        path: '/admininfo'
      })
      // this.$router.push({
      //   path: this.matchInternalRoute('admininfo')
      // })
    },
    async logout() {
      await this.$api.login.getAuthorizelogout()
      await this.SYSTEM_EXIT()
      if (this.$store.getters.login_type == 'distributor') {
        window.location.href = `/shopadmin/login`
      } else if (this.$store.getters.login_type == 'dealer') {
        window.location.href = `/dealer/login`
      } else if (this.$store.getters.login_type == 'merchant') {
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
  margin-top: 6px;
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
    display: flex;
    align-items: center;
    padding: 0 8px !important;
    &.is-active {
      a {
        color: $color-primary;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
      }
      .iconfont {
        color: $color-primary;
      }
    }
    &:hover {
      background: transparent;
      a {
        color: $color-primary;
      }
      .iconfont {
        color: $color-primary;
      }
    }
    > a {
      display: block;
      color: #fff;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .iconfont {
      color: #fff;
      font-size: 15px;
      margin-right: 6px;
    }
  }
}
.sub-menu {
  width: 116px;
  overflow-y: auto;
  background: #F6F7F9;
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.06);
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  // .menu-group {
  //   margin-bottom: 20px;
  // }
  .el-menu {
    background: #F6F7F9;
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
        background: rgba(20, 128, 227, 0.1);
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
      color: #545D7A;
      flex: 1;
      display: flex;
      padding-left: 24px;
    }
    i {
      color: $dominant_hue;
    }
  }
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
  }
}
</style>
<style lang="scss">
.popover-row.base {
  padding: 10px;
  cursor:pointer
}
.popover-row.exit-system {
  padding: 0px 12px 7px;
  font-size: 12px;
  cursor:pointer

}
.menu-group {
  .icon-shouqijiantouxiao {
    font-size: 12px;
    color: #3D4355;
    margin-right: 4px;
    transform: scale(.8);
    display: inline-block;
  }
  .el-menu-item-group__title {
    padding: 0 0 0 10px !important;
    height: 40px;
    line-height: 40px;
    color: #3D4355;
    font-size: 14px;
  }
}
</style>