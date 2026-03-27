<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <!--搜索添加-->
    <el-row :gutter="40">
      <el-col class="action-container">
        <el-button type="primary" @click="handleNew"> {{ $t('2090c821.454c5b') }} </el-button>
      </el-col>
    </el-row>

    <el-card>
      <el-table
        v-loading="loading"
        :data="reason_list"
        :height="wheight - 300"
        :element-loading-text="$t('2090c821.f09b12')"
      >
        <el-table-column :label="$t('2090c821.2b6bc0')" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope)">
              {{ $t('2090c821.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="attribute_name" :label="$t('2090c821.41dfb0')">
          <template slot-scope="scope">
            <div>{{ scope.row }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--新增修改-->
    <sideBar :visible.sync="show_sideBar" :title="$t('2090c821.049ca9')">
      <el-form>
        <el-form-item :label="$t('2090c821.160adc')">
          <el-input v-model="form.reason" maxlength="120" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add"> {{ $t('2090c821.939d53') }} </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import sideBar from '@/components/element/sideBar'
import { getAftersalesReason, addAftersalesReason } from '../../../api/aftersalesreason'

export default {
  components: {
    sideBar
  },

  data() {
    return {
      loading: false,
      imgDialog: false,
      isGetImage: false,
      show_sideBar: false,
      // 提交数据
      form: {
        reason: ''
      },
      // 列表数据
      list: [],
      reason_list: []
    }
  },
  mounted() {
    this.getList() // 获取列表
  },
  methods: {
    // 新增编辑
    handleNew() {
      this.show_sideBar = true
      this.resetData()
    },
    // 删除
    handleDelete(data) {
      this.$confirm(this.$t('2090c821.e9eff5'))
        .then((_) => {
          this.reason_list.splice(data.$index, 1)
          this.save()
        })
        .catch((_) => {})
    },
    // 初始化
    resetData() {
      this.form = {
        reason: ''
      }
    },
    add() {
      // this.form.reason
      if (this.form.reason !== '') {
        this.reason_list.push(this.form.reason)
        this.save()
      } else {
        this.$message({ type: 'warning', message: this.$t('2090c821.d63114') })
      }
    },
    // 保存数据
    save() {
      addAftersalesReason({ reason: this.reason_list }).then((res) => {
        this.$message({ type: 'success', message: this.$t('2090c821.33130f') })
        this.resetData()
        this.getList()
      })
    },
    // 获取列表
    getList() {
      // console.log('获取数据')
      // this.loading = true
      getAftersalesReason([]).then((res) => {
        console.log('Response data', res)
        this.reason_list = res.data.data
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 100px;
  height: 100px;

  .avatar-uploader-icon {
    line-height: 100px;
  }
}
</style>
