<template>
  <SpPage>
    <!--搜索添加-->
    <el-row :gutter="40">
      <el-col class="action-container">
        <el-button type="primary" @click="handleNew"> 新增原因 </el-button>
      </el-col>
    </el-row>

    <el-card>
      <el-table
        v-loading="loading"
        :data="reason_list"
        :height="wheight - 300"
        element-loading-text="数据加载中"
      >
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="attribute_name" label="原因" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--新增修改-->
    <sideBar :visible.sync="show_sideBar" :title="'添加售后原因'">
      <el-form>
        <el-form-item label="售后原因">
          <el-input v-model="form.reason" maxlength="20" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add"> 提交 </el-button>
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
      this.$confirm('确认删除该原因么？')
        .then(_ => {
          this.reason_list.splice(data.$index, 1)
          this.save()
        })
        .catch(_ => {})
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
        this.$message({ type: 'warning', message: '请输入原因' })
      }
    },
    // 保存数据
    save() {
      addAftersalesReason({ reason: this.reason_list }).then(res => {
        this.$message({ type: 'success', message: '操作成功' })
        this.resetData()
        this.getList()
      })
    },
    // 获取列表
    getList() {
      // console.log('获取数据')
      // this.loading = true
      getAftersalesReason([]).then(res => {
        console.log('返回数据', res)
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
