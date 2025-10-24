<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss">
.picker-edit-board {
  padding: 18px 10px 10px 10px;
  display: flex;
  flex-wrap: wrap;
  background-color: #f5f5f5;
  .drag-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .board-item {
    margin: 0 10px 20px 0;
    position: relative;
    &:nth-child(8n + 8) {
      margin-right: 0;
    }
    .btn-tool {
      .ecx-icon {
        display: none;
      }
    }
    .ecx-icon {
      display: none;
    }
    &:hover {
      .btn-tool {
        display: flex;
        .ecx-icon {
          display: block;
        }
      }
    }
  }
  .btn-tool {
    height: 26px;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    // transition: width 0.3s ease-in;
    .ecx-icon {
      color: #fff;
      margin-right: 6px;
    }
  }
  .btn-add {
    width: 120px;
    height: 120px;
    border: 1px dashed #cdcdcd;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
<!-- <template>
  <div class="picker-edit-board">
    <div>
      <el-button type="primary">添加</el-button>
    </div>
    <draggable
      class="drag-container"
      :list="localValue"
      :options="dragOptions"
      style="width: 100%"
      handle=".icon-quanping"
    >
      <slot >{{ value.template() }}</slot>
      <div v-for="(item, index) in localValue" :key="`item__${index}`" class="board-item">
        <SpImage :src="item.imgUrl" width="120" height="120" />
        <i class="ecx-icon icon-quanping" />
      </div>
      <div class="btn-add" @click="onAddItem">
        <i class="ecx-icon icon-jia" />
        <p>添加商品</p>
      </div>
    </draggable>
  </div>
</template> -->

<script>
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import BasePicker from './base'
export default {
  name: 'PickerEditBoard',
  components: {
    draggable
  },
  extends: BasePicker,
  config: {
    title: '查看商品'
  },
  props: ['value'],
  data() {
    return {
      localValue: [],
      dragOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      }
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.updateVal(nVal)
    }
  },
  created() {
    this.localValue = cloneDeep(this.value.data)
  },
  methods: {
    async onAddItem() {
      const res = await this.value.onAdd()
      this.localValue = this.localValue.concat(res)
    },
    deleteItem(index) {
      this.localValue.splice(index, 1)
    }
  },
  render() {
    const { localValue, dragOptions } = this
    return (
      <div class={['picker-edit-board', this.value?.class]}>
        <div>
          <el-button type="primary" on-click={this.onAddItem}>
            添加
          </el-button>
        </div>
        <draggable
          class="drag-container"
          list={localValue}
          options={dragOptions}
          style="width: 100%"
          handle=".icon-tuozhuai"
        >
          {localValue.map((item, index) => (
            <div key={`item__${index}`} class="board-item">
              {this.value.template.call(this, item, index)}
              <div class="btn-tool">
                <i class="ecx-icon icon-tuozhuai" />
                <i class="ecx-icon icon-shanchu" on-click={this.deleteItem.bind(this, index)} />
              </div>
            </div>
          ))}
        </draggable>
      </div>
    )
  }
}
</script>
