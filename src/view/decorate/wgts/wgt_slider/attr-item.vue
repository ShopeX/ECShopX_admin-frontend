<style lang="scss" scoped>
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <div>
    <CompTodoList v-model="localValue" :max="5" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="slider-item">
          <SpImagePicker v-model="scope.data.imgUrl" size="small" />
          <CompPickerLink :value="scope.data" @change="e => onChangeLink(e, scope.index)" />
        </div>
        <div class="cell-value-tip">建议尺寸:（宽度640px，高度自适应）</div>
      </template>
    </CompTodoList>
    <!-- <el-button class="btn btn-add" size="small" plain @click="handleClickAdd">
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
  name: 'AttrItem',
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
        num: 5 - this.localValue.length
      })

      this.localValue = this.localValue.concat(
        data.map(item => {
          return {
            button: '',
            content: '',
            id: '',
            imgUrl: item.url,
            linkPage: '',
            mainTitle: '',
            subtitle: '',
            subtitleTow: '',
            template: ''
          }
        })
      )
    },
    onChangeLink(e, index) {
      const v = cloneDeep(this.localValue[index])
      Vue.set(this.localValue, index, {
        ...v,
        ...e
      })
    }
  }
}
</script>
