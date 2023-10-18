<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      :show-close="false"
      width="50%"
    >
      <div>
        <div class="result">
          <el-row>
            <el-col :span="16">
              <span class="text"> {{ tips }}</span>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="params.topic_name"
                placeholder="请输入标题关键字"
                size="small"
                @keyup.enter.native="getFetch(1)"
              >
                <el-button slot="append" icon="el-icon-search" size="small" @click="getFetch(1)" />
              </el-input>
            </el-col>
          </el-row>
        </div>

        <div v-loading="modalLoad" class="flag-list">
          <el-row>
            <el-col :span="18" class="lbox">
              <el-checkbox-group v-model="def_check_id" :max="limit">
                <el-checkbox
                  v-for="(item, index) in topicList"
                  :key="index"
                  :label="item.topic_id"
                  :checked="item.checked"
                  border
                  @change="checkTopicChange($event, item)"
                >
                  {{ item.topic_name }}
                </el-checkbox>
              </el-checkbox-group>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="pagers.total"
                :page-size="params.pageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-col>
            <el-col :span="6" class="rbox">
              <div class="ftitle">已选话题 <span class="text"> 上下拖动以排序</span></div>
              <draggable
                v-model="checkTopic"
                class="topic-drag"
                :options="dragIssuesOptions"
                style="position: 'relative'"
              >
                <li v-for="(item, index) in checkTopic" :key="index" class="topic">
                  <div class="text">
                    {{ item.topic_name }}
                  </div>
                  <div class="iconfont icon-arrows-alt" />
                </li>
              </draggable>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="modalHandle"> 确认 </el-button>
        <el-button size="small" @click="handleCancelLabelsDialog"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTopics } from '@/api/ugc'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    dialogIsShow: Boolean,
    topicType: String,
    dufCheckTopic: Array
  },
  data() {
    return {
      modalLoad: false,
      dialogTitle: '关联话题',
      tips: '多选，选择后在小程序笔记详情中展示；话题的设置需在「关联话题管理」中调整。',
      topicList: [],
      checkTopic: [],
      def_check_id: [],
      limit: 8,
      params: {
        page: 1,
        pageSize: 32,
        status: '1'
      },
      pagers: {
        total: 0
      },
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.icon-arrows-alt',
        draggable: '.topic'
      }
    }
  },
  computed: {},
  watch: {
    // dufCheckTopic:{
    //   handler (newValue, oldValue) {
    //     this.defCheckStatus();
    //   },
    //    immediate: true
    // }
  },
  mounted() {
    const { topicType } = this.$props
    if (topicType == 'sort') {
      this.$data.dialogTitle = '话题置顶'
      this.$data.tips = '最多选择8个话题置顶，选择并确认后在社区首页顶部展示标签。'
    }
    this.defCheckStatus()
  },
  methods: {
    modalInit() {
      const { topicList } = this.$data
      console.log('modal topic', topicList)
      if (topicList.length) {
        this.$data.topicList = topicList
      } else {
        this.getFetch()
      }
    },
    getFetch(page) {
      const that = this
      const { params, def_check_id } = this.$data
      const { topicType } = this.$props
      if (page) {
        params.page = page
      }
      console.log('modal params', params)
      this.$data.topicList = []
      this.$data.modalLoad = true
      getTopics(params).then((res) => {
        var { list, total_count } = res.data.data
        that.$data.pagers = { total: total_count }
        // console.log('list',list)
        if (list) {
          this.$data.topicList = list
          if (topicType == 'sort' && def_check_id.length < 1) {
            this.sortDefCheckStatus()
          }
        }
        this.$data.modalLoad = false
      })
    },
    defCheckStatus() {
      var check_id = []
      const { topicList } = this.$data
      const { dufCheckTopic } = this.$props
      //console.log('defCheckStatus',dufCheckTopic)
      //传入的默认选中
      if (dufCheckTopic) {
        dufCheckTopic.forEach((item) => {
          check_id.push(item.topic_id)
        })
        this.$data.def_check_id = check_id
        this.$data.checkTopic = dufCheckTopic
      }
      this.modalInit()
      //console.log('modal defCheckStatus',check_id.length,check_id)
    },
    sortDefCheckStatus() {
      const { topicList } = this.$data
      var check_id = []
      var dufCheckTopic = []
      //默认置顶选中状态
      topicList.forEach((item) => {
        if (item.is_top == '1') {
          check_id.push(item.topic_id)
          dufCheckTopic.push(item)
        }
      })
      //console.log('sortDefCheckStatus')
      this.$data.def_check_id = check_id
      this.$data.checkTopic = dufCheckTopic
    },
    checkTopicChange(check, item) {
      const { def_check_id, topicList } = this.$data
      var checkTopic = [...this.checkTopic]
      if (check) {
        checkTopic.push(item)
      } else {
        var topic = checkTopic.find((topic, index) => {
          topic.index = index
          if (topic.topic_id == item.topic_id) {
            return item
          }
        })
        //console.log('cf checkTopic',topic,checkTopic)
        checkTopic.splice(topic.index, 1)
      }
      //console.log('checkTopicChange',def_check_id,check,item)
      this.$data.checkTopic = checkTopic
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getFetch()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getFetch()
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    },
    modalHandle() {
      const { checkTopic } = this.$data
      //console.log('modalHandle',checkTopic)
      this.$emit('modalHandle', checkTopic)
    }
  }
}
</script>
<style scoped lang="css">
.result {
  position: absolute;
  top: 15px;
  left: 0;
  padding: 0 20px 0 110px;
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  color: #999;
}
.result .text {
  line-height: 32px;
}
.btn-bar {
  position: relative;
  margin-top: 20px;
  text-align: right;
}
.btn-bar .el-pagination {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  text-align: left;
}

.flag-list {
  height: 320px;
  border-radius: 5px;
  background: #f8f8f8;
  border: 1px solid #ccc;
}
.flag-list .el-row {
  margin: auto !important;
  height: 100%;
}
.flag-list .lbox {
  padding: 20px;
  height: 100%;
}
.flag-list .rbox {
  padding: 20px;
  height: 100%;
  border-left: 1px solid #ccc;
}
.flag-list .rbox .ftitle .text {
  font-size: 12px;
  color: #999;
}
.flag-list .rbox .topic-drag {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.flag-list .rbox .topic {
  display: flex;
  margin: 10px auto;
}
.flag-list .rbox .topic .iconfont {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
.flag-list .rbox .topic .iconfont:hover {
  color: #1480e3;
}
.flag-list .el-checkbox {
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}
.flag-list .el-checkbox.is-bordered {
  margin-left: 0;
}

.flag-list /deep/ .el-checkbox .el-checkbox__inner {
  display: none;
}
.flag-list /deep/ .el-checkbox .el-checkbox__label {
  padding-left: 0;
}
.flag-list /deep/ .el-checkbox.is-checked {
  background: #1480e3;
}
.flag-list /deep/ .el-checkbox.is-checked .el-checkbox__label {
  color: #fff;
}
</style>
