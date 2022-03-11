<template>
  <div class="block">
    <div class="image">
      <img :src="info.logo">
    </div>
    <div class="info">
      <div class="name">
        {{ info.corp_name }}
      </div>
      <div class="code">
        {{ info.phone }}
      </div>
    </div>
    <div class="switch">
      <el-switch
        v-model="info.is_enable"
        :disabled="disabled"
        @change="setEnable()"
      />
    </div>
  </div>
</template>

<script>
import { createCompanyLogistics, deleteCompanyLogistics } from '@/api/logistics'
export default {
  props: ['info', 'disabled'],
  methods: {
    setEnable () {
      console.log('setEnable', this.info)
      if (this.info.is_enable) {
        createCompanyLogistics(this.info).then((response) => {
          this.$message.success(`${this.info.corp_name}已开启`)
          // this.$emit("refreshList");
        })
      } else {
        deleteCompanyLogistics(this.info.corp_id).then((response) => {
          // this.getLogisticsListData();
          // this.$emit("refreshList");
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.block {
  padding: 10px;
  display: flex;
  border-radius: 4px;
  align-items: center;
  margin-bottom: 20px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;

  &:hover {
    background: #f7f7f7;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    transition: all 0.3s;
  }

  .image {
    width: 50px;
    height: 50px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    flex-shrink: 0;
    flex-grow: 0;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    flex: 1;
    padding-left: 10px;
    max-width: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
    }

    .code {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
    }
  }

  .switch {
    width: 40px;
    flex-shrink: 0;
    flex-grow: 0;
    align-self: flex-start;
  }
}
</style>
