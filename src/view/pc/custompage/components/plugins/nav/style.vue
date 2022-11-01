<template>
  <section class="section nav-wrap">
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form>
        <el-form-item label="导航设置">
          <draggable
            v-model="t_data.data"
            class="content-bottom-padded"
            :options="dragItemsOptions"
            @end="onEnd"
          >
            <div
              v-for="(item, index) in t_data.data"
              :key="index"
              class="setting-item item-selected"
            >
              <el-input
                v-model="item.tab"
                placeholder="请输入导航名"
                size="small"
                style="width: 200px"
              />
              <div
                class="goods-title"
                @click="editLink(index)"
              >
                <template v-if="item.linkPage === 'goods'">
                  【商品】{{ item.title }}
                </template>
                <template v-if="item.linkPage === 'store'">
                  【店铺】{{ item.name }}
                </template>
              </div>
              <div
                class="setting-remove"
                @click="removeItem(index)"
              >
                <i class="iconfont icon-trash-alt" />
              </div>
            </div>
          </draggable>
          <el-button
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setNav"
          >
            设置导航
          </el-button>
          <p class="desc">
            (
            导航说明：导航菜单数量限制为8，不过建议根据实际菜单名称的长度，选择性显示导航菜单数量。)
          </p>
        </el-form-item>
      </el-form>
      <linkSetter
        :links="linksArr"
        usage="pc"
        :visible="linksVisible"
        :show_article="false"
        :show_planting="false"
        :show_page="false"
        :show_marketing="false"
        :show_category="false"
        :show_store="show_store"
        @setLink="setLink"
        @closeDialog="closeDialog"
      />
    </div>
  </section>
</template>
<script>
import goodsPicker from '@/components/goods_picker'
import linkSetter from '@/components/template_links'

import draggable from 'vuedraggable'

export default {
  name: 'NavStyle',
  components: {
    goodsPicker,
    draggable,
    linkSetter
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    usage: {
      type: String
    }
  },
  data () {
    return {
      linksArr: ['goods', 'store'],
      t_data: this.data,
      linksVisible: false,
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      checkAction: true, // true=添加导航  false=修改导航
      cur_index: 0 //将要修改导航的位置
    }
  },
  computed: {
    show_store () {
      return this.usage !== 'store'
    }
  },
  watch: {
    t_data: {
      handler (newVal, oldVal) {
        this.$emit('data', newVal)
      },
      deep: true
    }
  },
  methods: {
    /**
     * 设置导航
     */
    setNav () {
      this.checkAction = true
      this.linksVisible = true
    },
    /**
     * 设置导航和编辑导航
     */
    setLink (data, type) {
      // 添加导航
      if (this.checkAction) {
        data = Object.assign(data, { linkPage: type })
        this.t_data.data = [...this.t_data.data, ...[data]]
      } else {
        // 修改导航
        let tmp = [...this.t_data.data] // 利用索引直接修改数组值，vue无法监听数组变化的解决方案
        tmp[this.cur_index] = Object.assign({}, tmp[this.cur_index], { linkPage: type }, data)
        this.t_data.data = tmp
      }
      this.linksVisible = false
    },
    /**
     * 导航关闭
     */
    closeDialog () {
      this.linksVisible = false
    },
    /**
     * 推拽结束
     */
    onEnd (evt) {
      this.temp = this.t_data.data[evt.oldIndex]
      this.t_data.data.splice(evt.oldIndex, 1)
      this.t_data.data.splice(evt.newIndex, 0, this.temp)
    },
    /**
     * 修改定位要修改的导航
     */
    editLink (index) {
      this.checkAction = false
      this.linksVisible = true
      this.cur_index = index
    },
    /**
     * 删除指定位置导航
     */
    removeItem (index) {
      this.t_data.data.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.nav-wrap {
  .setting-item {
    cursor: pointer;
  }
  .desc {
    line-height: 25px;
    margin-top: 10px;
  }
  .setting-remove {
    padding: 0 5px;
  }
  .goods-title {
    padding: 0 10px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
