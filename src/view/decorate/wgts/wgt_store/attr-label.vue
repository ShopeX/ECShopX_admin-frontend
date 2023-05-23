<style lang="scss" scoped>
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<style lang="scss">
.wgt-store-attr-label {
  .tag-container {
    height: 32px;
    line-height: 32px;
    background-color: #fff;
    padding: 0 64px 0 12px;
    position: relative;
    border-radius: 4px;
    font-size: 13px;
    &:hover {
      .ecx-icon {
        display: inline-block;
        position: absolute;
      }
    }
    .icon-tuozhuai {
      top: 0;
      right: 24px;
    }
    .icon-shanchu {
      top: 1px;
      right: 6px;
    }
  }
  .btn-tool {
    display: none !important;
  }
}
</style>
<template>
  <CompButton
    placeholder="选择标签"
    format="{0}个标品"
    :disabled="disabledBtn"
    :value="value.length"
    @click="handleClickAdd"
    @remove="onRemove"
    @view="onViewItem"
  />
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
export default {
  name: 'AttrLabel',
  components: { CompButton },
  props: ['value', 'distributor'],
  data() {
    return {
      localValue: []
    }
  },
  computed: {
    disabledBtn() {
      const { id } = this.distributor
      return id === ''
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
    },
    distributor: function (nVal, oVal) {
      if (JSON.stringify(nVal) != JSON.stringify(oVal)) {
        this.localValue = []
      }
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const ids = this.value.map(({ tag_id }) => tag_id)
      const { data } = await this.$picker.tag({
        data: ids,
        params: {
          distributor_id: this.distributor.id
        }
      })
      this.localValue = data
    },
    onRemove() {
      this.localValue = []
    },
    async onViewItem() {
      const { data } = await this.$picker.editBoard({
        data: this.localValue,
        class: 'wgt-store-attr-label',
        template({ tag_name }, index) {
          return (
            <div class='tag-container'>
              <div class='tag-name'>{tag_name}</div>
              <i class='ecx-icon icon-tuozhuai' />
              <i class='ecx-icon icon-shanchu' on-click={this.deleteItem.bind(this, index)} />
            </div>
          )
        },
        onAdd: async () => {
          const { data } = await this.$picker.tag({
            params: {
              distributor_id: this.distributor.id
            }
          })
          return data
        }
      })
      this.localValue = data
    }
  }
}
</script>
