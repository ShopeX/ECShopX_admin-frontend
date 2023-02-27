<style lang="scss" scoped>
.attr-img-list {
  .img-item--picker {
    display: flex;
    margin-top: 14px;
  }
  .cell-value-tip {
    position: relative;
    top: -12px;
  }
}
</style>
<template>
  <div class="attr-img-list">
    <CompTodoList v-model="value" :max="5" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="img-item--wrap">
          <el-input v-model="scope.data.ImgTitle" placeholder="图片标题" />
          <div class="img-item--picker">
            <SpImagePicker v-model="scope.data.imgUrl" size="small" />
            <CompPickerLink :value="scope.data" @change="(e) => onChangeLink(e, index)" />
          </div>
          <div class="cell-value-tip">建议尺寸: （128px * 128px）</div>
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
        num: 5
      })
      console.log(2, data)
      this.localValue = data.map((item) => {
        return {
          ImgTitle: '',
          title: '',
          id: '',
          imgUrl: item.url,
          linkPage: '',
          linkType: 0
        }
      })
      // console.log(2, data, this.localValue)
    },
    onChangeLink(e, index) {
      if (e.content === 'delete') {
        Vue.delete(this.localValue, index)
        return
      }
      const v = cloneDeep(this.localValue[index])
      Vue.set(this.localValue, index, {
        ...v,
        ...e
      })
    }
  }
}
</script>
