<template>
  <div class="attr-nav-item">
    <CompTodoList v-model="value" :max="5" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="nav-item--wrap">
          <el-input v-model="scope.data.content" placeholder="导航名称" />
          <div class="nav-item--picker">
            <SpImagePicker v-model="scope.data.imgUrl" size="small" />
            <CompPickerLink
              :value="scope.data"
              @change="
                e => {
                  handleChangeGoods(e, scope.index)
                }
              "
            />
          </div>
          <div v-if="isBusinessShow" class="cell-value-tip">
            商家：
            <CompButton
              placeholder="选择店铺签"
              format="{0}个店铺签"
              :value="scope.data.seletedTags.length"
              :view-btn="false"
              @remove="onRemoveItem(scope.index)"
              @click="onAddLabel(scope.index)"
            />
          </div>
          <div class="cell-value-tip">建议尺寸:（128px * 128px）</div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import Vue from 'vue'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompTodoList from '../../comps/comp-todoList'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrNavItem',
  components: { CompPickerLink, CompTodoList, CompButton },
  props: {
    value: [Object, Array],
    isBusinessShow: Boolean
  },
  methods: {
    handleClickAdd() {
      this.value.push({
        content: '导航名称',
        seletedTags: [],
        imgUrl: ''
      })
    },
    handleChangeGoods(e, index) {
      Vue.set(this.value, index, {
        ...this.value[index],
        ...e
      })
    },
    onRemoveItem(index) {
      Vue.set(this.value, index, {
        ...this.value[index],
        seletedTags: []
      })
    },
    async onAddLabel(index) {
      const ids = this.value[index].seletedTags?.map(({ tag_id }) => tag_id)
      const { data } = await this.$picker.shopTag({
        data: ids
      })
      Vue.set(this.value, index, {
        ...this.value[index],
        seletedTags: data
      })
    }
  }
}
</script>
<style lang="scss">
.attr-nav-item {
  .nav-item--picker {
    display: flex;
    margin-top: 10px;
  }
  // .cell-value-tip {
  //   position: relative;
  //   top: -12px;
  // }
}
</style>
