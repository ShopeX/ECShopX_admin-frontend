<template>
  <div class="coupon-box">
    <aside :class="collapsed ? 'collapsed' : ''">
      <template
        v-for="(item, index) in $router.options.routes"
        v-if="!item.hidden"
      >
        <el-menu
          :default-active="subActiveIndex"
          :collapse="collapsed"
          unique-opened
          @open="handleopen"
          @close="handleclose"
          @select="handleSubChange"
        >
          <template
            v-for="(child, index) in item.children"
            v-if="child.name == '派券大师'"
          >
            <el-submenu
              v-if="!child.leaf"
              :index="child.sn"
            >
              <template slot="title">
                <i
                  class="iconfont"
                  :class="'icon-' + child.iconCls"
                /><span slot="title">{{ child.name }}</span>
              </template>
              <el-menu-item
                v-for="(sub, index) in child.children"
                v-if="!sub.hidden"
                :key="index"
                :index="sub.sn"
                @click="toRoute(sub.path)"
              >
                {{ sub.name }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="child.leaf"
              :index="child.sn"
              @click="toRoute(child.path)"
            >
              <i
                class="iconfont"
                :class="'icon-' + child.iconCls"
              /><span slot="title">{{ child.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </template>
    </aside>
    <section
      id="container"
      class="content-container"
    >
      <div class="grid-content bg-purple-light">
        <el-col
          :span="24"
          class="content-wrapper"
        >
          <transition
            name="fade"
            mode="out-in"
          >
            <router-view />
          </transition>
        </el-col>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      collapsed: false,
      subActiveIndex: '1'
    }
  },
  methods: {
    handleopen () {},
    handleclose () {},
    handleSubChange (key) {
      this.subActiveIndex = key
    },
    toRoute (path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style scoped lang="scss">
.coupon-box {
  display: flex;
  position: absolute;
  top: 120px;
  bottom: 0px;
  left: 0;
  right: 0;
  aside {
    width: 200px;
    background: #fff;
    &.collapsed {
      width: auto;
    }
    .el-menu {
      background: #fff;
    }
    .el-menu-item {
      color: #999;
    }
    .el-menu .el-menu-item:hover {
      background-color: #fff;
      color: #ff5000;
    }
    .el-menu-item.is-active,
    .el-menu-item.is-active:hover {
      color: #ff5000;
    }
    .el-submenu .el-menu-item.is-active {
      color: #ff5000;
    }
    overflow-y: auto;
  }
  .content-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #efefef;
    .content-wrapper {
      box-sizing: border-box;
    }
  }
}
</style>
