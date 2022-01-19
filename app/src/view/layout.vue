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
                <template slot="title">{{ child.name }}</template>
                <template v-for="sub in child.children" v-if="sub.is_show">
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
      <el-header class="header" height="50px" v-if="isShowHeader()">
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
                <div class="username">
                  <div>{{ nick_name || name }}</div>
                  <small class="muted">基础信息</small>
                </div>
              </div>
              <div class="popover-row exit-system" @click="logout">退出登录</div>

              <img slot="reference" v-if="avatar" class="user-avatar" :src="avatar" />
              <i v-else slot="reference" class="iconfont icon-user-circle1"></i>
            </el-popover>
          </div>
        </div>
      </el-header>
      <el-main style="position: relative">
        <section id="container" class="content-container">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </section>
        <div id="design-view"></div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { getAuthorizelogout } from '@/api/login'
import { log, isInSalesCenter } from '@/utils'
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
      const res = await this.$api.system.getBrandLogo()
      if (res.data.data.logo) {
        this.brandIco = res.data.data.logo
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
      // this.$router.push({
      //   path: '/admininfo'
      // })
      this.$router.push({
        path: this.matchInternalRoute('admininfo')
      })
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
  width: 100%;

  padding: 20px;
  .brand-link {
    display: block;
  }
  .img-wrap {
    height: 85px;
    width: 85px;
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
  width: 125px;
  background: $auxiliary_hue;
  position: relative;
  &__con {
    position: absolute;
    top: 125px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
  }
  .el-menu {
    background: $auxiliary_hue;
    border-right-width: 0;
  }
  .el-menu-item {
    height: 45px;
    line-height: 45px;
    display: flex;
    align-items: center;
    &.is-active {
      background-color: #fff;
      a {
        color: #1f273a;
      }
      .iconfont {
        color: #1f273a;
      }
    }
    &:hover {
      background-color: #f4f4f4;
      a {
        color: #1f273a;
      }
      .iconfont {
        color: #1f273a;
      }
    }
    a {
      display: block;
      color: #fff;
      flex: 1;
      display: flex;
      align-items: center;
    }
    .iconfont {
      color: $dominant_hue;
      font-size: 14px;
      width: 14px;
    }
  }
}
.sub-menu {
  width: 125px;
  overflow-y: auto;
  background: #f4f4f4;
  .menu-group {
    margin-bottom: 20px;
  }
  .el-menu {
    background: #f4f4f4;
    border-right-width: 0;
    margin-top: 30px;
  }
  .el-menu-item {
    height: 45px;
    line-height: 45px;
    display: flex;
    align-items: center;
    &.is-active {
      background-color: #fff;
    }
    a {
      display: block;
      color: #666;
      flex: 1;
      display: flex;
    }
    i {
      color: $dominant_hue;
    }
  }
}
.header {
  border-bottom: 1px solid #e6e6e6;
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
</style>
<style>
.popover-row.base {
  padding: 10px;
}
.popover-row.exit-system {
  padding: 0px 12px 7px;
  cursor: pointer;
  font-size: 12px;
}
</style>