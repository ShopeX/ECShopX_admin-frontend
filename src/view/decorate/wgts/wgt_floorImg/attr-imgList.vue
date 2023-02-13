<style lang="scss" scoped>
.img-item {
  display: flex;
  margin-bottom: 20px;
  .img-title{
    display: flex;
    align-items: center;
    justify-content: space-around;
    .title-input{
      width: 80%;
    }
    }
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <div>
    <div v-for="(item, index) in value" :key="`img-item__${index}`" class="img-item">
      <SpImagePicker v-model="item.imgUrl" size="small" />
      <div>
        <div class="img-title">
        <span class="title-text">标题:</span>
        <el-input
          v-model="localValue.ImgTitle"
          type="text"
          placeholder="请填写图片标题"
          class="title-input"
          @change="onChangeTitile"
        />
      </div>
        <CompPickerLink :value="item" @change="(e) => onChangeLink(e, index)" />
      </div>

    </div>
    <el-button class="btn btn-add" size="small" plain @click="handleClickAdd">
      {{ `添加图片(${value.length}/5)` }}
    </el-button>
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink.vue'
export default {
  name: 'AttrImgList',
  components: {
    CompPickerLink
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

      this.localValue = data.map((item) => {
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
    },
    onChangeTitile() {
      console.log(123,this.localValue)
    },
    onChangeLink(e, index) {
      if(e.content === 'delete'){
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
