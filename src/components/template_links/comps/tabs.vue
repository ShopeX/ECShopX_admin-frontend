<template>
  <div class="links">
    <ul>
      <template v-for="item in links">
        <li
          v-if="item.value !== 'store'"
          :key="item.value"
          class="links-item"
          :class="current === item.value && 'active'"
          @click="handleClick(item.value)"
        >
          {{ item.label }}
        </li>
        <li
          v-if="item.value === 'store' && VERSION_PLATFORM()"
          :key="item.value"
          class="links-item"
          :class="current === item.value && 'active'"
          @click="handleClick(item.value)"
        >
          {{ item.label }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import store from '@/store'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    showlinks: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      links: [
        {
          label: '商品',
          value: 'goods'
        },
        {
          label: '店铺',
          value: 'store'
        },
        {
          label: '销售分类',
          value: 'sale_category'
        },
        {
          label: '管理分类',
          value: 'management_category'
        },
        {
          label: '商品标签',
          value: 'tag'
        },
        {
          label: '文章',
          value: 'article'
        },
        {
          label: '软文',
          value: 'planting'
        },
        {
          label: '页面',
          value: 'link'
        },
        // {
        //   label: '营销',
        //   value: 'marketing'
        // },
        {
          label: '活动报名',
          value: 'regactivity'
        },
        {
          label: '内购活动',
          value: 'purchase_activity'
        },
        {
          label: '秒杀',
          value: 'seckill'
        },
        {
          label: '自定义页面',
          value: 'custom_page'
        },
        {
          label: '直播',
          value: 'liverooms'
        },
        {
          label: '外部小程序',
          value: 'other_wxapp'
        }
      ],
      current: ''
    }
  },
  created() {
    if (this.showlinks.length) {
      this.links = this.links.filter((item) => {
        return this.showlinks.includes(item.value)
      })
    }
  },
  mounted() {
    if (this.$route.path === '/store/storemanager/marketingdistributor') {
      let index = this.links.findIndex((n) => n.value == 'custom_page')
      this.links.splice(index, 1)
    }
    this.current = this.type
  },
  methods: {
    handleClick(val) {
      this.$emit('onClick', val)
      this.current = val
    }
  }
}
</script>

<style scoped lang="scss">
.links {
  padding-right: 20px;
  width: 180px;
  border-right: 1px solid #efefef;
  .links-item {
    padding: 10px 0;
    text-align: center;
    cursor: pointer;
    &.active {
      background: #ecf5ff;
      border: 1px solid #b4d9fd;
      border-radius: 60px;
      color: #1f82e0;
    }
  }
}
</style>
