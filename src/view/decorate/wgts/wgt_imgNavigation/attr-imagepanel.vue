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
                (e) => {
                  handleChangeGoods(e, scope.index)
                }
              "
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
export default {
  name: 'AttrNavItem',
  components: { CompPickerLink, CompTodoList },
  props: {
    value: [Object, Array]
  },
  methods: {
    handleClickAdd() {
      this.value.push({
        content: '导航名称',
        imgUrl: ''
      })
    },
    handleChangeGoods(e, index) {
      Vue.set(this.value, index, {
        ...this.value[index],
        ...e
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
