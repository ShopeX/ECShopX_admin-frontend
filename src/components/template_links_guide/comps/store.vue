<template>
  <div class="view-flex-item">
    <div class="store-picker view-flex view-flex-middle">
      <div class="store-info view-flex-item" v-if="checked">
        <div class="store-name">
          {{checked.name}}
        </div>
        <div class="store-address">
          {{checked.address}}
        </div>
      </div>
      <div class="view-flex-item" v-else>全部店铺</div>
      <div v-if="checked" class="iconfont icon-times" @click="handleResetClick"></div>
      <div class="iconfont icon-sync-alt" @click="handleClick"></div>
    </div>
    <el-dialog title="选择店铺" :visible.sync="visible" width="500px" append-to-body>
      <ul class="store-list" v-loading="loading">
        <li class="store-list-item" v-for="item in list" @click="handleItemClick(item)" :class="current.id === item.id ? 'active' : ''">
          <div class="store-name">{{item.name}}</div>
          <div class="store-address">{{item.address}}</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/api'

  export default {
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        visible: false,
        loading: false,
        params: {
          page: 1,
          pageSize: 10,
          is_valid: true
        },
        total: 0,
        list: [],
        current: '',
        checked: ''
      }
    },
    watch: {
      data (val) {
        if (val.id) {
          this.checked = val
        } else {
          this.checked = ''
        }
      }
    },
    methods: {
      handleClick () {
        this.visible = true
      },
      handleItemClick (val) {
        this.current = val
      },
      handleResetClick () {
        this.$emit('change', {})
      },
      handleConfirm () {
        this.$emit('change', this.current)
        this.visible = false
      },
      async fetch () {
        const { list, total_count } = await this.$api.marketing.getDistributorList(this.params)
        let _list = []
        list.map(item => {
          _list.push({
            id: item.distributor_id,
            name: item.name,
            address: item.store_address
          })
        })
        this.list = _list
        this.total = total_count
        this.loading = false
      }
    },
    mounted () {
      if (this.data.id) {
        this.checked = this.data
      }
      this.fetch()
    }
  }
</script>

<style scoped lang="scss">
  .finder {
    margin-bottom: 20px;
  }
  .store-picker {
    padding: 10px 15px;
    margin-right: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 3px;
    &:hover {
      background: #f5f7fa;
    }
    .store-info {
      padding-right: 20px;
    }
    .iconfont {
      margin-left: 10px;
    }
  }
  .store-list {
    .store-list-item {
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 6px;
      &:hover {
        background: #f5f7fa;
      }
      &.active {
        background: #ecf5ff;
        box-shadow: 0 0 0 1px #b5dafb;
      }
    }
  }
  .store-name {
    @include text-overflow();
    font-size: 16px;
    color: #333;
  }
  .store-address {
    @include text-overflow();
    font-size: 12px;
    color: #999;
  }
</style>
