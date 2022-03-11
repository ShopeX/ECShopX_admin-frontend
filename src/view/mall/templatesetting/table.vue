<!--
 * @Author: your name
 * @Date: 2021-02-22 16:33:10
 * @LastEditTime: 2021-02-26 14:50:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/espier-shop/app/src/view/mall/templatesetting/table.vue
-->
<template>
  <el-table
    class="template_table"
    :data="dataSource"
    border
    style="width: 100%"
    header-row-class-name="header_row_class"
  >
    <el-table-column prop="date">
      <template
        slot="header"
        slot-scope="slot"
      >
        <div class="first_header">
          <span>积分区间</span><span>*</span><span>最多添加5个区间</span>
        </div>
      </template>
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.score1"
          class="input-s"
          type="number"
          size="mini"
          :min="0"
          :class="{ 'haveError': scope.row.isHaveError && scope.row.score1 === '' }"
          @blur="handleBlur(scope.row, scope.$index)"
        />
        <span>～</span>
        <el-input
          v-model="scope.row.score2"
          class="input-s"
          type="number"
          size="mini"
          :min="0"
          :class="{ 'haveError': scope.row.isHaveError && scope.row.score2 === '' }"
          @blur="handleBlur(scope.row, scope.$index)"
        />
        <span>积分</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="操作"
      width="200"
    >
      <template
        slot="header"
        slot-scope="slot"
      >
        <div class="second_header">
          <span>操作</span>
        </div>
      </template>
      <template slot-scope="scope">
        <a
          :class="{ 'disabled': dataSource.length === 1 }"
          @click="handleDelete(scope)"
        >删除</a>
      </template>
    </el-table-column>
    <template
      v-if="dataSource.length < 5"
      slot="append"
    >
      <div
        class="footer"
        :class="{ 'noValue': !dataSource.length }"
      >
        <span @click="handleAddScore">添加积分筛选区间</span>
      </div>
    </template>
  </el-table>
</template>

<script>
export default {
  props: ['value'],
  data () {
    const _this = this
    return {
      dataSource: _this.value || [],
      titleCustom: '积分区间*最多添加5个区间'
    }
  },
  methods: {
    handleAddScore: function () {
      this.dataSource = [
        ...this.dataSource,
        {
          score1: 0,
          score2: 5,
          isHaveError: false
        }
      ]
      this.$emit('update:value', this.dataSource)
    },
    handleBlur: function (row, index) {
      console.log('----row---', row)
      console.log('----index---', index)
      if (row.score1 === '' || row.score2 === '') {
        this.dataSource[index].isHaveError = true
      } else {
        this.dataSource[index].isHaveError = false
      }
      this.$emit('update:value', this.dataSource)
    },
    handleDelete: function (row) {
      if (this.dataSource.length === 1) {
        this.$message.info('少于一行无法删除!')
        return
      }
      const { $index } = row
      this.dataSource.splice($index, 1)
      this.$emit('update:value', this.dataSource)
    }
  }
}
</script>

<style lang="scss">
.template_table {
  width: 100%;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.3);

  a {
    cursor: pointer;
  }

  .disabled {
    color: grey;
  }

  .haveError {
    input {
      border-color: red;
    }
  }

  .first_header {
    span:nth-child(1) {
      font-size: 16px;
      font-weight: bold;
      color: #666;
    }
    span:nth-child(2) {
      color: red;
      margin: 0 6px;
    }
    span:nth-child(3) {
      color: #909399;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .second_header {
    span:nth-child(1) {
      font-size: 16px;
      font-weight: bold;
      color: #666;
    }
  }

  .el-table__append-wrapper,
  .el-table__body-wrapper {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  th {
    border-color: rgba(0, 0, 0, 0.3);

    &.is-leaf {
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    }
  }

  tbody {
    td {
      border-color: rgba(0, 0, 0, 0.3) !important;
    }
  }

  a {
    color: #78c9ec;
  }

  .header_row_class {
    th {
      background: #f0f0f0 !important;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    padding: 12px 0;
    color: #78c9ec;
    font-weight: 600;

    span {
      cursor: pointer;
    }
  }
  .noValue {
    border-top: 1px solid rgba(0, 0, 0, 0.3);
  }
}
</style>
