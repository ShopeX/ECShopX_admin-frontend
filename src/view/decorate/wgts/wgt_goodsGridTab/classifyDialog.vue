<style lang="scss">
.goods-classify-edit-goods {
  padding-bottom: 10px;
}

.el-tabs__item {
  &:hover {
    .edit-title {
      display: inline;
    }
  }
}

.is-active {
  .edit-title {
    display: inline;
  }

}

.edit-title {
  margin-left: 5px;
  display: none;
}

.content-bottom-padded {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .thumbnail {
    display: block;
    width: 60px;
    height: 60px;
    line-height: 55px;
    margin-right: 10px;
    border-radius: 4px;
  }

  .setting-item {
    display: flex;
    margin-top: 10px;
    position: relative;
    margin-bottom: 10px;

    .settingRemove {
      position: absolute;
      top: 0px;
      right: 10px;
      cursor: pointer;
      color: #ddd;
      display: none;
    }

    .active {
      display: block;
    }

    .banner-uploader:last-child {
      margin-bottom: 0;
    }

    .title {
      flex: 1;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-height: 20px;
      padding-top: 10px;
      padding-right: 10px;

      font-size: 13px;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
<template>
  <el-dialog title="商品分类" :visible.sync="dialogVisible" width="820px">
    <div class="goods-classify">
      <div class="goods-classify-edit-goods">
        <el-button size="mini" type="default" class="iconfont icon-cog banner-button-uploader" @click="setGoods">
          编辑商品
        </el-button>
        <span style="font-size: 12px; margin-left: 20px">最多可选择100件商品；左侧实时预览内仅展示前50件；下方商品拖动以排序。</span>
      </div>
      <el-tabs v-model="editableTabsValue" type="card" closable editable @edit="handleAddTab">
        <el-tab-pane v-for="(item, index) in list" :key="index" :label="item.tabTitle" :name="'tab' + index">
          <span slot="label"> {{ item.tabTitle }}
            <el-popover placement="top" width="400">
              <el-input v-model="item.tabTitle" size="small" clearable maxlength="10" show-word-limit />
              <el-button slot="reference" type="text" icon="el-icon-edit" size="mini" class="edit-title" />
            </el-popover>
          </span>
          <el-row v-if="item.goodsList.length > 0" :gutter="20" class="content-bottom-padded"
            style="margin-left: 0px; margin-right: 0px">
            <draggable v-model="item.goodsList" :options="dragItemsOptions" style="width:100%" @end="onEnd">
              <!-- <div class="setting-item item-selected" v-for="(item, index) in items" :key="index"> -->
              <el-col v-for="(item_y, index_y) in item.goodsList" :key="index_y" :span="6"
                class="setting-item item-selected" @mouseover.native="mouseoverHandle(index_y)"
                @mouseleave.native="mouseleaveHandle()">
                <img class="thumbnail" :src="wximageurl + item_y.imgUrl" alt="">
                <div class="title">
                  {{ item_y.title }}
                </div>
                <div :class="[{ active: index_y == activeIndex }, ' settingRemove']"
                  @click="removeItem(index, index_y)">
                  <i class="iconfont el-icon-error" />
                </div>
              </el-col>
            </draggable>
          </el-row>
          <el-empty v-else description="暂无商品" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import { getItemsList } from '@/api/goods'
export default {
  name: 'ClassifyDialog',
  components: {
    draggable
  },
  props: ['value'],
  data() {
    return {
      activeIndex: null,
      list: [],
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      editableTabsValue: 'tab0',
      dialogVisible: false,
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        this.list = this.value?JSON.parse(JSON.stringify(this.value)):[]
      },
      immediate: true
    }
  },
  methods: {
    handleEditTitle(item) {
      console.log(item)
      this.$prompt('Tab名称', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: item.tabTitle,
        maxlength: 10,
      }).then(({ value }) => {
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    handleAddTab(targetName, action) {
      if (action === 'add') {
        let newTabName = this.list.length
        let item = {
          tabTitle: 'newTab',
          goodsList: []
        }
        this.list.push(item)
        this.editableTabsValue = 'tab' + newTabName
      }
      if (action === 'remove') {
        console.log(targetName, this.editableTabsValue, activeName)
        let tabs = this.list
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if ('tab' + (index + 1) === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName =
                  (tabs[index + 1] && 'tab' + (index + 1)) || (tabs[index] && 'tab' + index)
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.list = tabs.filter((tab, index) => 'tab' + index !== targetName);
      }
    },

    mouseoverHandle(index) {
      this.activeIndex = index
    },
    mouseleaveHandle() {
      this.activeIndex = null
    },
    onEnd(evt) {
      console.log(evt)
      // this.temp = this.data[evt.oldIndex]
      // this.data.splice(evt.oldIndex, 1)
      // this.data.splice(evt.newIndex, 0, this.temp)
    },
    async setGoods() {
      const index = this.editableTabsValue.replace('tab', '');
      const { data } = await this.$picker.goods()
      let values = []
      data && data.forEach((item) => {
        if (item.itemId) {
          let obj = {
            imgUrl: item.pics[0],
            title: item.itemName,
            goodsId: item.itemId,
            brand: item.brand_logo,
            price: item.price,
            distributor_id: item.distributor_id,
            itemEnName: item.item_en_name,
            promotionActivity: item.promotion_activity
          }
          values.push(obj)
        }
      })
      this.list[index].goodsList = values
    },
    removeItem(index, i) {
      this.list[index].goodsList.splice(i, 1)
    },
    handleSubmit() {
      this.$emit('submit', this.list)
      this.dialogVisible = false
    }
  }
}
</script>
