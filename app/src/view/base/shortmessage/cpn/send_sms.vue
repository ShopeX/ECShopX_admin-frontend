<template>
  <div class="alisms_sendSms">
    <tips>
      <ul>
        根据场景配置好短信，用户进入对应场景时即可触发系统发送对应给用户，支持短信验证码，订单通知，快递提醒等场景。
        <li>· 一条完整的短信由「签名+模板」组成。</li>
        <li>· 每一个场景只能启用一条模板。</li>
      </ul>
    </tips>
    <div
      class="list"
      v-infinite-scroll="load"
      infinite-scroll-distance="20"
      infinite-scroll-delay="200"
      :infinite-scroll-disabled="disabled"
    >
      <div class="serch">
        <el-autocomplete
          clearable
          prefix-icon="el-icon-search"
          style="width: 400px"
          class="inline-input"
          v-model="query.scene_name"
          @select="handleSelect"
          @change="changeSelect"
          :fetch-suggestions="querySearch"
          placeholder="请选择短信场景"
        ></el-autocomplete>
      </div>
      <section class="card" v-for="item in smsScenarioList" :key="item.id">
        <nav>
          <h4>短信场景：{{ item.scene_name }}</h4>
          <div class="type">短信类型：{{ item.template_type }}</div>
          <div class="btn">
            <el-button
              v-if="item.itemList.length < 3"
              size="small"
              type="primary"
              @click="fnAddSms(item.id)"
              >添加短信</el-button
            >
          </div>
        </nav>
        <el-table :data="item.itemList" style="width: 100%" border>
          <el-table-column prop="sign_name" label="签名" width="240"> </el-table-column>
          <el-table-column prop="template_content" label="模板"> </el-table-column>
          <el-table-column prop="status" label="状态" width="180">
            <template slot-scope="scope">
              <div class="fail" v-if="scope.row.status == '0'">未启用</div>
              <div class="success" v-if="scope.row.status == '1'">已启用</div>
            </template>
          </el-table-column>
          <el-table-column prop="sign_name" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deteleSms(scope.row.id)">移除</el-button>
              <el-button
                type="text"
                size="small"
                @click="fnDisablingSms(scope.row.id, scope.row.status == '0' ? true : false)"
                >{{ scope.row.status == '0' ? '启用' : '停用' }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </section>
      <div class="footer">
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
      </div>
    </div>
    <!-- 添加短信 -->
    <el-dialog title="添加短信" :visible="visible" width="30%" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="form" label-width="60px">
        <el-form-item label="签名" prop="sign_id">
          <el-select v-model="form.sign_id" placeholder="请选择签名" style="width: 95%">
            <el-option
              :label="item.sign_name"
              :value="item.id"
              v-for="item in SmsSignatureList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板" prop="template_id">
          <el-select v-model="form.template_id" placeholder="请选择模板" style="width: 95%">
            <el-option
              :label="item.template_name"
              :value="item.id"
              v-for="item in SmsTemplateList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="fnPass('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tips from '@/components/tips'
import { requiredRules } from '@/utils/validate'
import {
  getScenarioList,
  offDisablingSms,
  onDisablingSms,
  deletedDisablingSms,
  getSmsSignatureList,
  getSmsTemplateList,
  addSceneItem
} from '@/api/sms'

export default {
  components: {
    tips
  },
  computed: {
    noMore() {
      return this.smsScenarioList.length >= this.count
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  data() {
    return {
      smsScenarioList: [],
      query: {
        page_size: 3,
        page: 1,
        scene_name: ''
      },
      count: 23,
      loading: false,
      serchNameList: [],
      //
      visible: false,
      form: {
        scene_id: '',
        sign_id: '',
        template_id: ''
      },
      SmsSignatureList: [], //短信签名
      SmsTemplateList: [], //短信模板
      rules: {
        sign_id: [requiredRules('签名', 'change')],
        template_id: [requiredRules('模板', 'change')]
      }
    }
  },
  mounted() {
    this.getSerchNameList()
    this.init()
  },
  methods: {
    async getSerchNameList() {
      const result = await getScenarioList({ page_size: 23 })
      this.serchNameList = result.data.data.list.map((item) => {
        return { value: item.scene_name }
      })
    },
    async init(type) {
      this.loading = true
      const result = await getScenarioList(this.query)
      if (type == 'serch') {
        this.smsScenarioList = result.data.data.list
      } else {
        this.smsScenarioList = [...this.smsScenarioList, ...result.data.data.list]
      }
      this.count = result.data.data.count
      this.loading = false
    },
    // 添加短信
    async fnAddSms(id) {
      this.visible = true
      // 获取选项
      getSmsSignatureList({ params: { status: '1' } }).then((res) => {
        this.SmsSignatureList = res.data.data.list
      })
      getSmsTemplateList({ params: { status: '1', scene_id: id } }).then((res) => {
        this.SmsTemplateList = res.data.data.list
      })
      this.form.scene_id = id
      console.log(id)
    },
    fnPass(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await addSceneItem(this.form)
          this.$message.success('添加成功')
          this.handleClose()
          this.initQuery()
          this.init('serch')
        }

      })
    },
    handleClose() {
      this.visible = false
      // this.form = {
      //   scene_id: '',
      //   sign_id: '',
      //   template_id: ''
      // }
      this.$refs['form'].resetFields();
    },
    // 停用/启用/删除
    fnDisablingSms(id, flag) {
      const message = flag
        ? '每个场景仅可启用一条短信。启用后，该短信将作为当前场景短信使用。'
        : '停用后当前场景将不会触发短信；您仍可启用其他短信作为当前场景短信使用。'
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (flag) {
          //启用
          const result = await onDisablingSms({ id })
          this.$message.success('已启用')
          this.initQuery()
          this.init('serch')
        } else {
          const result = await offDisablingSms({ id })
          this.$message.success('已停用')
          this.initQuery()
          this.init('serch')
        }
      })
    },

    async deteleSms(id) {
      const message =
        '移除后，该短信将不在当前场景。如果移除的是已启用的短信，移除后当前场景可不会触发短信。'
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await deletedDisablingSms(id)
        this.initQuery()
        this.init('serch')
        this.$message.success('删除成功')
      })
    },
    // 下拉加载
    load() {
      this.query.page = this.query.page + 1
      if (!this.noMore) {
        this.loading = true
        this.init()
      }
    },

    /* 搜索相关 */
    handleSelect({ value }) {
      this.query = {
        page_size: 3,
        page: 1,
        scene_name: value
      }
      this.init('serch')
    },
    initQuery(id = 3) {
      // 初始化一下 （修改状态）
      this.query = {
        page_size: id,
        page: 1,
        scene_name: ''
      }
    },
    changeSelect(val) {
      if (val !== '') return
      // 清空会执行 肯定是空值
      this.smsScenarioList = [] // 有可能会存在上一次搜索的值 所以先清空
      this.init()
    },
    querySearch(queryString = '', cb) {
      var restaurants = this.serchNameList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据

      cb(results)
    },
    createFilter(queryString) {
      console.log(queryString)
      return (restaurant) => {
        return restaurant.value.indexOf(queryString) === 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.alisms_sendSms {
  .serch {
    // text-align: center;
    margin: 20px 0 10px 0;
  }
  .list {
    overflow: auto;
    // height: 500px;
    height: calc(100vh - 240px);
    padding-bottom: 100px;
    section {
      padding: 20px 30px;
      margin: 20px 3px 20px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      nav {
        display: flex;
        align-items: center;
        color: #000;
        font-size: 14px;
        h4 {
          flex: 2;
          position: relative;
          color: #000;

          &::before {
            position: absolute;
            width: 4px;
            content: '';
            background: #1480e3;
            left: -8px;
            top: 4px;
            bottom: 4px;
          }
        }
        .type {
          flex: 1;
        }
        .btn {
          text-align: right;
          flex: 3;
        }
      }
      .success {
        position: relative;
        margin-left: 20px;
        &::before {
          width: 12px;
          height: 12px;
          content: '';
          position: absolute;
          top: 5px;
          left: -15px;
          background: #ddd;
          border-radius: 50%;
          background: #67c23a;
        }
      }
      .fail {
        position: relative;
        margin-left: 20px;
        &::before {
          width: 12px;
          height: 12px;
          content: '';
          position: absolute;
          top: 5px;
          left: -15px;
          background: #ddd;
          border-radius: 50%;
        }
      }
    }
    .footer {
      width: 100%;
      text-align: center;
    }
  }
}
</style>

<style lang="scss">
.alisms_sendSms {
  .el-form {
    width: 80%;
  }
  .el-dialog{
    min-width: 540px;
  }
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
  .el-table {
    margin: 20px 0;
    th {
      background: aliceblue;
    }
  }
}
</style>