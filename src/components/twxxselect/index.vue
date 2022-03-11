<template>
  <el-dialog
    title="选择图文消息"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    width="726px"
    :before-close="cancelAction"
  >
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="已发送"
        name="first"
      >
        <ul class="select_list">
          <li v-for="(item, index) in dataList">
            <el-row>
              <el-col
                :span="18"
                class="frm-tips"
              >
                <input
                  type="radio"
                  name="sendItem"
                  :value="index"
                >&nbsp;{{ item.title }}
              </el-col>
              <el-col
                :span="6"
                class="tr"
              >
                <span class="frm-tips">{{ item.date }}</span>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane
        label="素材库"
        name="second"
      >
        <el-input
          icon="el-icon-search"
          placeholder="搜索相关文章"
          style="width: 50%"
        />
        <ul class="select_list">
          <li v-for="(item, index) in scDataList">
            <el-row>
              <el-col
                :span="18"
                class="frm-tips"
              >
                <input
                  type="radio"
                  name="scItem"
                  :value="index"
                >&nbsp;{{ item.title }}
              </el-col>
              <el-col
                :span="6"
                class="tr"
              >
                <span class="frm-tips">{{ item.date }}</span>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane
        label="历史消息"
        name="thrie"
        vi-if="showHistory"
      >
        <div class="history_msg clearfix">
          <div class="preview_area f_l">
            <div class="preview_box">
              <img :src="demoimg">
            </div>
            <p>公众帐号历史消息列表示例</p>
          </div>
          <div class="form_area f_l">
            <el-checkbox v-model="historyItem.url">
              跳转到历史消息列表
            </el-checkbox>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div
      v-if="!showHistory || activeName !== 'thrie'"
      class="tr"
      style="margin-top: 20px"
    >
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="100"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancelAction">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="saveAction"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
var dimg = require('@/assets/img/history_msg.png')
export default {
  props: ['twxxVisible', 'showHistory'],
  data () {
    return {
      demoimg: dimg,
      currentPage: 1,
      activeName: 'first',
      itemchecked: 1,
      dataList: [
        {
          id: 1,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 2,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 3,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 4,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 5,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 6,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的！',
          url: '',
          date: '2016年11月11日',
          type: ''
        }
      ],
      scDataList: [
        {
          id: 1,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的2！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 2,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的2！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 3,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的2！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 4,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的2！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 5,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的2！',
          url: '',
          date: '2016年11月11日',
          type: ''
        },
        {
          id: 6,
          desc: 'testtesttest',
          title: '一周热门事件，肯定有你不知道的2！',
          url: '',
          date: '2016年11月11日',
          type: ''
        }
      ],
      selectedItem: {},
      historyItem: { url: 'http://www.badiu.com', type: '' }
    }
  },
  computed: {
    showDialog () {
      return this.twxxVisible
    }
  },
  mounted () {},
  methods: {
    handleClick (tab, event) {
      console.log(tab)
    },
    saveAction () {
      var radio = []
      if (this.activeName === 'first') {
        radio = document.getElementsByName('sendItem')
      } else if (this.activeName === 'second') {
        radio = document.getElementsByName('scItem')
      }
      var index = -1
      for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          index = radio[i].value
        }
      }
      if (this.activeName === 'first') {
        this.selectedItem = this.dataList[index]
        this.selectedItem.type = '已发送'
      } else if (this.activeName === 'second') {
        this.selectedItem = this.scDataList[index]
        this.selectedItem.type = '素材库'
      } else {
        this.selectedItem = this.historyItem
        this.selectedItem.type = '历史消息'
      }
      this.$emit('chooseTW', this.selectedItem)
    },
    cancelAction () {
      this.$emit('closeTWDialog')
    },
    handleSizeChange (size) {
      console.log(size)
    },
    handleCurrentChange (curPage) {
      console.log(curPage)
    }
  }
}
</script>

<style scoped lang="scss">
.select_list {
  margin-top: 20px;
  border: 1px solid #e7e7eb;
  li {
    padding: 15px 20px;
    border-bottom: 1px solid #e7e7eb;
    cursor: pointer;
    &:last-child {
      border-bottom: 0;
    }
    &:hover {
      color: #20a0ff;
    }
    input[type='radio'] {
      width: 18px;
      height: 18px;
    }
  }
}
.history_msg {
  margin-top: 20px;
  overflow: hidden;
  p {
    margin-top: 5px;
    text-align: center;
  }
}
.preview_area {
  margin: 0 80px 0 160px;
}
.preview_box {
  width: 240px;
  height: 348px;
  border: 1px solid #e7e7eb;
  img {
    width: 100%;
    height: 100%;
  }
}
.form_area {
  padding-top: 150px;
}
</style>
