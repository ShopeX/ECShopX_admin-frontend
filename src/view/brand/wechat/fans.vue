<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <div class="section-white content-padded">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="8">
            <el-input
              v-model="nickname"
              placeholder="用户昵称"
              class="search-input"
            /><el-button
              type="primary"
              icon="el-icon-search"
              class="search-btn"
              @click="search"
            />
          </el-col>
          <el-col
            :span="14"
            class="content-right"
          >
            <el-button
              type="primary"
              :loading="syncFansLoading"
              @click="syncFans"
            >
              同步微信粉丝
            </el-button>
            <el-button
              type="primary"
              :loading="syncTagLoading"
              @click="syncTags"
            >
              同步微信标签
            </el-button>
            <el-popover
              v-model="createPop"
              placement="bottom"
              width="300"
              trigger="click"
            >
              <div class="tag-pop">
                <div class="pop-title">
                  标签名称
                </div>
                <div class="pop-input">
                  <el-input
                    ref="tagName"
                    :maxlength="6"
                  />
                </div>
                <el-row :gutter="10">
                  <el-col
                    :span="12"
                  >
                    <el-button
                      type="primary"
                      style="width: 100%"
                      @click="createTag"
                    >
                      确定
                    </el-button>
                  </el-col>
                  <el-col
                    :span="12"
                  >
                    <el-button
                      style="width: 100%"
                      @click="createPop = false"
                    >
                      取消
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-button
                slot="reference"
                type="primary"
              >
                <i class="el-icon-plus" /> 新建标签
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
        <div class="fans-list-header">
          <el-row>
            <el-col :span="12">
              <span>{{ tagname ? tagname : '全部用户' }}</span>
              <template v-if="tagname">
                <el-popover
                  v-model="renamePop"
                  placement="bottom"
                  width="300"
                  trigger="click"
                >
                  <div class="tag-pop">
                    <div class="pop-title">
                      标签名称
                    </div>
                    <div class="pop-input">
                      <el-input
                        v-model="renameTag"
                        :maxlength="6"
                      />
                    </div>
                    <el-row :gutter="10">
                      <el-col
                        :span="12"
                      >
                        <el-button
                          type="primary"
                          style="width: 100%"
                          :loading="renameLoading"
                          @click="updateTagName"
                        >
                          确定
                        </el-button>
                      </el-col>
                      <el-col
                        :span="12"
                      >
                        <el-button
                          style="width: 100%"
                          @click="renamePop = false"
                        >
                          取消
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <a
                    slot="reference"
                    href="#"
                  >重命名</a>
                </el-popover>
                <el-popover
                  v-model="removePop"
                  placement="bottom"
                  width="300"
                  trigger="click"
                >
                  <div class="tag-pop">
                    <div class="pop-title">
                      删除标签后，该标签下的所有用户将失去该标签属性。是否确定删除？
                    </div>
                    <el-row :gutter="10">
                      <el-col
                        :span="12"
                      >
                        <el-button
                          type="primary"
                          style="width: 100%"
                          :loading="removeLoading"
                          @click="removeTag"
                        >
                          确定
                        </el-button>
                      </el-col>
                      <el-col
                        :span="12"
                      >
                        <el-button
                          style="width: 100%"
                          @click="removePop = false"
                        >
                          取消
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <a
                    slot="reference"
                    href="#"
                  >删除</a>
                </el-popover>
              </template>
            </el-col>
            <el-col
              :span="12"
              class="content-right"
            >
              <el-popover
                v-model="tagsPop"
                placement="bottom"
                width="400"
                trigger="click"
              >
                <div class="tag-pop">
                  <div class="tag-list">
                    <el-checkbox-group v-model="groupTag">
                      <el-checkbox
                        v-for="item in tags"
                        :key="item.tag_id"
                        :label="item.tag_id"
                        :disabled="groupTagSame.indexOf(item.tag_id) >= 0 ? true : false"
                        class="tag-pop-item"
                      >
                        {{ item.tag_name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-row :gutter="10">
                    <el-col
                      :span="12"
                    >
                      <el-button
                        type="primary"
                        style="width: 100%"
                        @click="editTag(-1)"
                      >
                        确定
                      </el-button>
                    </el-col>
                    <el-col
                      :span="12"
                    >
                      <el-button
                        style="width: 100%"
                        @click="tagsPop = false"
                      >
                        取消
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
                <el-button
                  slot="reference"
                  :disabled="fansOpenids.length > 0 ? false : true"
                >
                  打标签
                </el-button>
              </el-popover>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="loading"
          class="fans-list"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="46"
          />
          <el-table-column
            prop="headimgurl"
            label="用户信息"
            width="80"
          >
            <template slot-scope="scope">
              <img
                class="fan-avatar"
                :src="scope.row.headimgurl"
                alt=""
              >
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              {{
                scope.row.remark
                  ? scope.row.remark + ' (' + scope.row.nickname + ')'
                  : scope.row.nickname
              }}<br>
              <el-popover
                ref="tag"
                v-model="scope.row.tagpop"
                placement="bottom"
                width="400"
                trigger="click"
              >
                <div class="tag-pop">
                  <div class="tag-list">
                    <el-checkbox-group v-model="scope.row.tagids">
                      <el-checkbox
                        v-for="item in tags"
                        :key="item.tag_id"
                        :label="item.tag_id"
                        class="tag-pop-item"
                      >
                        {{ item.tag_name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-row :gutter="10">
                    <el-col
                      :span="12"
                    >
                      <el-button
                        type="primary"
                        style="width: 100%"
                        @click="editTag(scope.$index)"
                      >
                        确定
                      </el-button>
                    </el-col>
                    <el-col
                      :span="12"
                    >
                      <el-button
                        style="width: 100%"
                        @click="scope.row.tagpop = false"
                      >
                        取消
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>

              <template v-if="scope.row.tags.length > 0">
                <span
                  v-for="item in scope.row.tags"
                  class="tag-item"
                >{{ item.tag_name }}</span>
              </template>
              <template v-else>
                无标签
              </template>
              <i
                v-popover:tag
                class="el-icon-caret-bottom tag-pop-handler"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-popover
                ref="remark"
                v-model="scope.row.remarkpop"
                placement="bottom"
                width="300"
                trigger="click"
              >
                <div class="tag-pop">
                  <div class="pop-title">
                    备注名称
                  </div>
                  <div class="pop-input">
                    <el-input v-model="tempRemark" />
                  </div>
                  <el-row :gutter="10">
                    <el-col
                      :span="12"
                    >
                      <el-button
                        type="primary"
                        style="width: 100%"
                        @click="editRemark(scope.$index)"
                      >
                        确定
                      </el-button>
                    </el-col>
                    <el-col
                      :span="12"
                    >
                      <el-button
                        style="width: 100%"
                        @click="scope.row.remarkpop = false"
                      >
                        取消
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>
              <el-button
                v-popover:remark
                @click="bindRemark(scope.row.remark)"
              >
                修改备注
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="total > pageSize"
          class="content-padded tc"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            :total="total"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="tags section-white">
        <div
          class="tags-header"
          :class="{ 'current': tagname === '' }"
          @click="tagFilter"
        >
          全部用户 <span class="tags-num">({{ total_count }})</span>
        </div>
        <div class="tags-body">
          <ul class="tags-list">
            <li
              v-for="item in tags"
              :class="{ 'current': item.tag_name === tagname }"
              @click="tagFilter(item.tag_id, item.tag_name)"
            >
              {{ item.tag_name }} <span class="tags-num">({{ item.total }})</span>
            </li>
          </ul>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  getFansList,
  getFansOfTag,
  getTagsOfFans,
  getTagList,
  getFansInfo,
  remark,
  createTag,
  updateTag,
  deleteTag,
  batchSetUserTags,
  syncFans,
  syncTags
} from '../../../api/fans'

export default {
  data () {
    return {
      loading: false,
      pageLimit: 20,
      nickname: '',
      currentTag: '',
      tagname: '',
      renameTag: '',
      tempRemark: '',
      isDefault: true,
      createPop: false,
      renamePop: false,
      removePop: false,
      tagsPop: false,
      renameLoading: false,
      removeLoading: false,
      syncFansLoading: false,
      syncTagLoading: false,
      tableData: [],
      pageSize: 20,
      params: {},
      currentPage: 1,
      total_count: 0,
      total: 0,
      tags: [],
      fansOpenids: [],
      groupTag: [],
      groupTagSame: []
    }
  },
  mounted () {
    this.params = { page_no: 1, pageSize: this.pageLimit }
    this.getFansList()
    this.getTagList()
  },
  methods: {
    getFansList () {
      this.loading = true
      var params = {
        nickname: this.nickname,
        tag_id: this.currentTag,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      getFansList(params).then((response) => {
        this.tableData = response.data.data.list
        this.total_count = +response.data.data.total_count
        this.total = +response.data.data.total_count
        this.loading = false
      })
    },
    search () {
      if (1 == this.currentPage) {
        this.currentTag = ''
        this.tagname = ''
        this.getFansList()
      } else {
        this.currentPage = 1
      }
    },
    handleCurrentChange (val) {
      this.loading = false
      this.currentPage = val
      this.getFansList(val)
    },
    getTagList () {
      getTagList().then((response) => {
        this.tags = response.data.data
      })
    },
    createTag () {
      let tag = this.$refs.tagName.$refs.input.value
      let params = { tag_name: tag }
      createTag(params).then((response) => {
        var newTag = response.data.data
        newTag.total = '0'
        this.tags.push(response.data.data)
        this.createPop = false
      })
    },
    bindRemark (data) {
      this.tempRemark = data
    },
    editTag (index) {
      var param = {
        tagIds: '',
        openIds: ''
      }

      var tagidsArr = []
      if (index < 0) {
        param.tagIds = this.groupTag.join(',')
        param.openIds = this.fansOpenids.join(',')
        this.tagsPop = false

        batchSetUserTags(param).then((response) => {
          this.groupTag = []
          this.fansOpenids = []
          this.getFansList()
          this.getTagList()
        })
      } else {
        var tempTag = []
        var ids = this.tableData[index].tagids
        var tags = this.tags
        for (var i = 0; i < tags.length; i++) {
          for (var k = 0; k < ids.length; k++) {
            if (tags[i].tag_id === ids[k]) {
              tempTag.push(tags[i])
            }
          }
        }
        this.tableData[index].tags = tempTag
        this.tableData[index].tagpop = false
        let paramId = ids.join(',')
        param.tagIds = paramId
        param.openIds = this.tableData[index].open_id
        batchSetUserTags(param).then((response) => {
          this.getFansList()
          this.getTagList()
        })
      }
    },
    editRemark (index) {
      if (index !== '') {
        let param = {}
        param.remark = this.tableData[index].remark = this.tempRemark
        param.open_id = this.tableData[index].open_id
        this.tableData[index].remarkpop = false
        remark(param).then((response) => {})
      }
    },
    tagFilter (id, name) {
      if (id && name) {
        this.currentTag = id
        this.tagname = name
      } else {
        this.currentTag = ''
        this.tagname = ''
      }
      this.getFansList()
    },
    updateTagName () {
      this.renameLoading = true
      var param = {
        tag_id: this.currentTag,
        tag_name: this.renameTag
      }
      updateTag(param)
        .then((response) => {
          this.tagname = this.renameTag
          this.tags.forEach((item, index) => {
            if (this.currentTag === item.tag_id) {
              this.renameLoading = false
              this.renamePop = false
              item.tag_name = this.renameTag
              this.getFansList()
            }
          })
        })
        .catch((error) => {
          this.renameLoading = false
        })
    },
    removeTag () {
      this.removeLoading = true
      var param = {
        tag_id: this.currentTag
      }
      deleteTag(param)
        .then((response) => {
          this.tags.forEach((item, index) => {
            if (this.currentTag === item.tag_id) {
              this.tags.splice(index, 1)
              this.removeLoading = false
              this.removePop = false
              this.currentTag = ''
              this.tagname = ''
              this.getFansList()
            }
          })
        })
        .catch((error) => {
          this.removeLoading = false
        })
    },
    syncTags () {
      this.syncTagLoading = true
      syncTags()
        .then((response) => {
          this.syncTagLoading = false
          this.getTagList()
        })
        .catch((error) => {
          this.syncTagLoading = false
        })
    },
    syncFans () {
      this.syncFansLoading = true
      syncFans()
        .then((response) => {
          this.syncFansLoading = false
          this.getFansList()
        })
        .catch((error) => {
          this.syncFansLoading = false
        })
    },
    handleSelectionChange (val) {
      this.fansOpenids = []
      this.groupTag = []
      this.groupTagSame = []
      for (var i = 0; i < val.length; i++) {
        this.fansOpenids.push(val[i].open_id)
      }
      if (val.length > 0) {
        var tagidsToal = []
        var idsstr = ''
        if (val.length == 1) {
          this.groupTag = val[0].tagids
        } else {
          for (var k = 0; k < val.length; k++) {
            tagidsToal = tagidsToal.concat(val[k].tagids)
          }

          if (tagidsToal.length > 0) {
            idsstr = tagidsToal.join(',') + ','
            var count = 0
            for (var j = 0; j < tagidsToal.length; j++) {
              count = this.repeatVal(tagidsToal[j] + ',', idsstr)
              if (count == val.length) {
                this.groupTagSame.push(tagidsToal[j])
                this.groupTag.push(tagidsToal[j])
              }
            }
          }
        }
      }
    },
    repeatVal (val, str) {
      return str.split(val).length - 1
    }
  }
}
</script>

<style scoped lang="scss">
.el-button + .el-button {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 15px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.fan-avatar {
  display: block;
  width: 48px;
  height: 48px;
}
.fans-list-header {
  margin-top: 20px;
  padding: 10px 15px;
  border: 1px solid #e7e7eb;
  line-height: 36px;
}
.fans-list tbody .cell {
  padding-top: 10px;
  padding-bottom: 10px;
}
.tags {
  &-header {
    padding: 10px 15px;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    &.current {
      background: #f8f8f8;
    }
  }
  &-body {
    padding: 10px;
  }
  &-list {
    cursor: pointer;
    li {
      padding: 5px 20px;
      &.current {
        background: #f8f8f8;
      }
    }
  }
  &-num {
    color: #999;
  }
}
.tag-pop-handler {
  cursor: pointer;
  color: #999;
}
.tag-pop {
  padding: 15px;
  .tag-list {
    margin-bottom: 15px;
  }
  .pop-title {
    font-size: 14px;
    padding-bottom: 10px;
  }
  .pop-input {
    padding-bottom: 15px;
  }
  .tag-pop-item {
    width: 9em;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    vertical-align: top;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
.tag-item {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  line-height: 1.3;
  color: #8d8d8d;
  overflow: hidden;
  margin-right: 0.5em;
}
.search-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
<style lang="scss">
.search-input {
  width: 70%;
  .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
}
</style>
