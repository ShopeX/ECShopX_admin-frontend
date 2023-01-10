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
    <div v-for="(item, index) in value" :key="`slider-item__${index}`" class="slider-item">
      <SpImagePicker v-model="item.imgUrl" />
      <CompPickerLink :value="item" @change="(e) => onChangeLink(e, index)" />
    </div>
    <el-button class="btn btn-add" size="small" plain @click="handleClickAdd">
      {{ `添加图片(${value.length}/5)` }}
    </el-button>
  </div>
</template>

<script>
import CompPickerLink from '../../comps/comp-pickerLink'
export default {
  name: 'AttrItem',
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
  created() {},
  methods: {
    async handleClickAdd() {
      const { data } = await this.$picker.image({
        data: [],
        multiple: true
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
    }
  }
}
</script>
