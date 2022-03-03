<template>
  <div>
    <el-row :gutter="40">
      <el-col>
        <!-- <el-select
          v-model="params.distributor_id"
          @change="
            () => {
              getList()
            }
          "
          placeholder="请选择店铺"
          clearable
        >
          <el-option v-for="(item, index) in distributorList" :key="index" :label="item.name" :value="item.distributor_id"> </el-option>
        </el-select> -->
        <el-input
          v-model="params.content"
          class="input-b"
          placeholder="关键词"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getList"
          />
        </el-input>
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="handleNew"
          >
            新增关键词
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-card>
      <el-table
        v-loading="loading"
        :data="list"
        :height="wheight - 170"
        element-loading-text="数据加载中"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="content"
          label="关键词"
        >
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="content-padded content-center">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <sideBar
      :visible.sync="show_sideBar"
      :title="editTitle"
    >
      <el-form>
        <!-- <el-form-item label="店铺">
          <el-select v-model="form.distributor_id" placeholder="请选择店铺" style="width: 100%">
            <el-option v-for="(item, index) in distributorList" :key="index" :label="item.name" :value="item.distributor_id"> </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="关键词">
          <el-input
            v-model="form.content"
            placeholder="请填写关键词"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="save"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getKeywords, postKeywords, delKeywords } from '@/api/shopScreen'
import { getDistributorList } from '@/api/marketing'

import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar
  },
  data () {
    return {
      distributor_id: '',
      distributorList: [],
      editTitle: '新增关键词',
      form: {
        distributor_id: '',
        content: ''
      },
      params: {
        page: 1,
        pageSize: 10,
        distributor_id: '',
        content: ''
      },
      list: [],
      loading: false,
      total_count: 0,
      show_sideBar: false
    }
  },
  mounted () {
    this.getList()
    this.getDistributor()
  },
  methods: {
    getDistributor () {
      var params = { page: 1, pageSize: 500 }
      getDistributorList(params).then((response) => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list
        }
      })
    },

    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleDelete (data) {
      this.$confirm('确认删除？')
        .then((_) => {
          delKeywords(data.row.id).then((res) => {
            this.getList()
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch((_) => {})
    },
    handleNew () {
      this.show_sideBar = true
      this.editTitle = '新增关键词'
      this.resetData()
    },
    resetData () {
      this.form = {
        distributor_id: '',
        content: ''
      }
    },
    handleEdit (data) {
      this.show_sideBar = true
      this.editTitle = '编辑关键词'
      this.form = {
        id: data.id,
        distributor_id: data.distributor_id,
        content: data.content
      }
    },
    save () {
      // 如果没有id，则表示为新增
      if (!this.form.id) {
        postKeywords(this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        postKeywords(this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.getList()
        })
      }
    },
    getList () {
      // this.loading = true
      getKeywords(this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss"></style>
