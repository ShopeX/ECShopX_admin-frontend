<template>
  <div :class="['nav-sub', store && 'nav-sub-store']">
    <div :class="['nav-sub-wrapper', 'w']">
      <div class="nav-list1">
        <div v-if="store" class="title">店铺首页</div>
        <div v-else class="title">
          所有商品分类
          <ul class="cate-pop">
            <template v-for="(item, index) in cateList" v-if="index < 9">
              <li>
                <a @click="selCate(1, item)">{{ item.category_name }}</a>
                <div class="sub-cate">
                  <div v-for="(childItem, childIndex) in item.children" class="item">
                    <a @click="selCate(2, childItem, item)">{{ childItem.category_name }}</a>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <ul class="nav-list2">
        <li v-if="!store" @click="change(-1)">全部商品</li>
        <li v-for="v in data.data">
          {{ v.tab }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['cateList', 'usage', 'data'],
  data() {
    return {
      searchVal: ''
    }
  },
  computed: {
    store() {
      return this.usage === 'store'
    }
  },
  mounted() {
    console.log('nav', this.data)
  },
  methods: {
    selCate(position, item, parentItem) {
      this.$emit('selCate', position, item, parentItem)
    },
    // 搜索框 获取值
    onEnterSearch(e) {
      console.log('search: ' + this.searchVal)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #ff5000;
.nav-sub {
  position: relative;
  z-index: 20;
  height: 40px;
  // background: #282724;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-bottom: 2px solid;
  &-store {
    background: #fff;
    &-wrapper {
      display: flex;
      justify-content: space-between;
    }
  }
  &.fixed {
    position: fixed;
    z-index: 21;
    height: 60px;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #dadada;
    background-image: -webkit-linear-gradient(#fff, #f1f1f1);
    background-image: linear-gradient(#fff, #f1f1f1);
  }
  .nav-sub-wrapper {
    // padding: 31px 0;
    height: 40px;
    position: relative;
    &.fixed {
      padding: 0;
      height: 100%;
      display: flex;
      align-items: center;
      .nav-list1 {
        background: transparent;
        color: $primary-color;
        .cate-pop {
          color: #fff;
        }
      }
    }
    &:after {
      content: ' ';
      position: absolute;
      top: 89px;
      left: 50%;
      margin-left: -610px;
      width: 1220px;
      // background: #000;
      height: 1px;
      display: none;
      opacity: 0;
      -webkit-transition: opacity 0.3s ease-in;
      transition: opacity 0.3s ease-in;
    }
  }
  .w {
    display: flex;
  }
  .nav-list1 {
    position: relative;
    text-align: center;
    cursor: pointer;
    background: $primary-color;
    width: 200px;
    height: 100%;
    line-height: 40px;
    display: flex;
    align-items: center;
    height: 100%;
    color: #fff;
    .title {
      width: 100%;
      text-align: center;
      &:hover {
        .cate-pop {
          display: block;
        }
      }
    }
  }
  .nav-list2 {
    height: 100%;
    line-height: 40px;
    display: flex;
    align-items: center;
    height: 100%;
    //   color:#fff;
    li:first-child {
      margin-left: 20px;
    }
    li {
      position: relative;
      padding: 0 20px;
      &.active {
        font-weight: bold;
      }
      &:hover {
        cursor: pointer;
        color: $primary-color;
      }
    }
    // li:before {
    //   content: ' ';
    //   position: absolute;
    //   left: 0;
    //   top: 13px;
    //   width: 2px;
    //   height: 2px;
    //   background: #bdbdbd;
    // }
  }
  .fixed .nav-list2 {
    color: #666;
  }
}
.primary-color {
  color: $primary-color;
}
.searchbar-small {
  // float: right;
  display: flex;
  margin-right: 10px;
  height: 40px;
  .icon {
    top: 12px;
  }
  .el-input {
    height: 30px;
    margin: 5px;
  }

  .icon-search {
    line-height: 40px;
    cursor: pointer;
    &:hover {
      color: $primary-color;
    }
  }
}
</style>
<style lang="scss">
$primary-color: red;
.nav-sub {
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: $primary-color;
    outline: 0;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>
