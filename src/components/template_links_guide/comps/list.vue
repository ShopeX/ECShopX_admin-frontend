<template>
  <div v-loading="loading">
    <div v-if="type !== 'category'">
      <el-table
        :data="list"
        width="100%"
        height="420"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column
          property="id"
          :label="type === 'other_wxapp' ? 'APPID' : 'ID'"
          width="120">
        </el-table-column>
        <el-table-column
          property="title"
          :label="type === 'other_wxapp' ? '页面路径' : '标题名称'"
          >
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        :page-size="params.pageSize"
        layout="prev, pager, next"
        :total="total"
        @current-change="pageChange">
      </el-pagination>
    </div>
    <el-table
      v-else
      :data="list"
      height="420"
      row-key="id"
      default-expand-all
      highlight-current-row
      @current-change="handleCurrentChange"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="分类名">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '@/api'

  export default {
    props: {
      type: {
        type: String,
        default: ''
      },
      keywords: {
        type: String,
        default: ''
      },
      store: {
        type: Object,
        default: () => {
          return {}
        }
      },
      appid: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        list: [],
        params: {
          pageSize: 10,
          page: 1
        },
        total: 0,
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'template_name'
      ])
    },
    watch: {
      type(val) {
        if (val) {
          this.params.page = 1
          this.fetch(val)
        }
      },
      keywords(val) {
        this.params.page = 1
        this.fetch(this.type)
      },
      store(val) {
        this.params.page = 1
        this.fetch(this.type)
      },
      appid(val) {
        this.params.page = 1
        this.fetch(this.type)
      }
    },
    methods: {
      fetch (type) {
        this.loading = true
        let query = JSON.parse(JSON.stringify(this.params))
        switch (type) {
          case 'goods':
            Object.assign(query, {
              item_type: 'normal',
              keywords: this.keywords,
              distributor_id: this.store.id || ''
            })
            if(this.system_mode == 'platform' || query.distributor_id == '0' || !query.distributor_id) {
              api.goods.getItemsList(query).then(({list, total_count}) => {
                let _list = []
                list.map(item => {
                  _list.push({
                    id: item.itemId,
                    title: item.itemName,
                    imgUrl: item.pics[0]
                  })
                })
                this.list = _list
                this.total = total_count
                this.loading = false
              })
            } else { 
              api.marketing.getDistributorItems(query).then(({list, total_count}) => {
                let _list = []
                list.map(item => {
                  _list.push({
                    id: item.itemId,
                    title: item.itemName,
                    imgUrl: item.pics[0]
                  })
                })
                this.list = _list
                this.total = total_count
                this.loading = false
              })
            }
            break;
          case 'regactivity':
            Object.assign(query, {
              is_valid: true
            })
            api.selfhelpform.regActivityEasylist(query).then(({ list, total_count }) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.activity_id,
                  title: item.activity_name
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'store':
            Object.assign(query, {
              is_valid: true,
              name: this.keywords
            })
            api.marketing.getDistributorList(query).then(({ list, total_count }) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.distributor_id,
                  title: item.name
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'category':
            api.goods.getCategory(this.params).then(res => {
              let items = []
              res.map(item => {
                let itemObj = {
                  id: item.category_id,
                  title: item.category_name
                }
                if (item.children.length) {
                  let childs = []
                  item.children.map(child => {
                    let childObj = {
                      id: child.category_id,
                      title: child.category_name
                    }
                    if (child.children.length) {
                      let grands = []
                      child.children.map(grand => {
                        const grandObj = {
                          id: grand.category_id,
                          title: grand.category_name
                        }
                        grands.push(grandObj)
                      })
                      Object.assign(childObj, { children: grands })
                    }
                    childs.push(childObj)
                  })
                  Object.assign(itemObj, { children: childs })
                }
                items.push(itemObj)
              })
              this.list = items
              this.loading = false
            })
            break;
          case 'tag':
            Object.assign(query, {
              tag_name: this.keywords
            })
            api.goods.getTagList(query).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.tag_id,
                  title: item.tag_name
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'article':
            Object.assign(query, {
              title: this.keywords
            })
            api.article.getArticleList(this.params).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.article_id,
                  title: item.title
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'planting':
            console.log(query)
            Object.assign(query, {
              article_type: 'bring',
              title: this.keywords,
              distributor_id: this.store.id
            })
            console.log(query)
            api.article.getArticleList(query).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.article_id,
                  title: item.title
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'link':
            let list =  [{
              title: '会员开通',
              id: 'vipgrades'
            },{
              title: '积分商城',
              id: 'pointitems'
            }]
            if(this.system_mode !== 'standard') {
              list.push({
                title: '楼层引导',
                id: 'floorguide'
              })
            }
            this.list = list
            this.total = 1
            this.loading = false
            break;
          case 'marketing':
            this.list = [{
              title: '限时团购',
              id: 'groups_list'
            }]
            this.total = 1
            this.loading = false
            break;
          case 'seckill':
            Object.assign(query, {
              status: 'valid',
              name: this.keywords
            })
            api.promotions.seckillActivityGetList(query).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.seckill_id,
                  title: item.activity_name
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'custom_page':
            Object.assign(query, {
              template_name: this.template_name,
              page_name: this.keywords
            })
            api.wxa.getCustomPageList(query).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.id,
                  title: item.page_name
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'liverooms':
            Object.assign(query, {
              template_name: this.template_name
            })
            api.promotions.getLiverooms(query).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.roomid,
                  title: item.name
                })
              })
              this.list = _list
              this.total = total_count
              this.loading = false
            })
            break;
          case 'other_wxapp':
            Object.assign(query, {
              app_id: this.appid,
              page_size: 10,
              route_info: this.keywords
            })
            api.wxa.getWxConfigLink(query).then(({list, total_count}) => {
              let _list = []
              list.map(item => {
                _list.push({
                  id: item.app_id,
                  title: item.route_info
                })
              })
              this.list = _list
              this.total = Number(total_count)
              this.loading = false
            })
            break;
          default:

        }
      },
      pageChange (val) {
        this.params.page = val
        this.fetch(this.type)
      },
      handleCurrentChange (val) {
        this.$emit('onClick', val)
      }
    },
    mounted () {
      this.fetch(this.type)
    }
  }
</script>

<style scoped lang="scss">
  .pager {
    margin-top: 20px;
  }
</style>
