<style lang="scss" scoped>
.attr-img-list {
  .img-item--picker {
    display: flex;
    margin-top: 14px;
  }
  // .cell-value-tip {
  //   position: relative;
  //   top: -12px;
  // }
}
</style>
<template>
  <div class="attr-img-list">
    <CompTodoList v-model="value" :min="3" :max="20" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="img-item--wrap">
          <el-input v-model="scope.data.ImgTitle" placeholder="图片标题" />
          <div class="img-item--picker">
            <SpImagePicker v-model="scope.data.imgUrl" size="small" />
            <CompPickerLink :value="scope.data" @change="e => onChangeLink(e, scope.index)" />
          </div>
          <div class="cell-value-tip">建议尺寸:（宽度128px，高度自适应）</div>
        </div>
      </template>
    </CompTodoList>
    <!-- <div v-for="(item, index) in value" :key="`img-item__${index}`" class="img-item">
      <SpImagePicker v-model="item.imgUrl" size="small" />
      <div>
        <div class="img-title">
          <span class="title-text">标题:</span>
          <el-input
            v-model="item.ImgTitle"
            type="text"
            placeholder="请填写图片标题"
            class="title-input"
          />
        </div>
        <CompPickerLink :value="item" @change="(e) => onChangeLink(e, index)" />
      </div>
    </div>
    <el-button class="btn btn-add" size="small" plain @click="handleClickAdd">
      {{ `添加图片(${value.length}/5)` }}
    </el-button> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompTodoList from '../../comps/comp-todoList'
export default {
  name: 'AttrImgList',
  components: {
    CompPickerLink,
    CompTodoList
  },
  props: ['value'],
  data() {
    return {
      localValue: []
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const { data } = await this.$picker.image({
        data: [],
        multiple: true,
        num: 20 - this.localValue.length
      })
      this.localValue = this.localValue.concat(
        data.map(item => {
          return {
            ImgTitle: '',
            imgUrl: item.url
          }
        })
      )
    },
    onChangeLink(e, index) {
      Vue.set(this.localValue, index, {
        ...this.localValue[index],
        ...e
      })
    }
  }
}
</script>
