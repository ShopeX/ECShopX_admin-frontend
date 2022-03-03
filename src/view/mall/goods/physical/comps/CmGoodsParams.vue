<style lang="scss">
.form-block-head {
  .block-head-hd {
    font-weight: bold;
    color: #333;;
    height: 40px;
    line-height:40px;
  }
  border-bottom: 1px solid #efefef;
}
.width-full {
  width: 100%;
}
.tip-info {
  color: #1480e3;
  position: relative;
  top: 2px;
  left: 6px;
}
.form-block-body {
  padding: 20px;
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
<template>
  <div class="comp-goodsparams">
    <div class="form-block-head clearfix">
      <div class="block-head-hd">商品参数</div>
    </div>
    <div class="form-block-body">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in value" :key="`params-data__${index}`">
          <el-form label-position="right" label-width="80px">
            <el-form-item :label="item.label">
              <el-select v-if="item.children.length > 0" 
                class="width-full"
                clearable
                v-model="item.attribute_value_id" 
                placeholder="请选择" 
                @change="(e) => { paramsChange(e, item )}">
                <el-option
                  v-for="child in item.children"
                  :key="child.value"
                  :label="child.label"
                  :value="child.value">
                </el-option>
              </el-select>
              <el-input v-else v-model="item.value" :maxlength="60" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CmGoodsParams',
  props: ['value'],
  data() {
    return {
    }
  },
  created() {},
  methods: {
    paramsChange (e, item) {
      if (e) {
        const fd = item.children.find(k => k.value == e)
        item.attribute_value_name = fd.label
        this.$emit('input', this.value)
      } else {
        item.attribute_value_name = ''
      }
    },
  }
}
</script>

