<template>
  <div>
    <div class="store-picker view-flex view-flex-middle">
      <div class="store-info view-flex-item" >
        <div class="store-name">
          {{ currentStoreName }}
        </div>
        <div class="store-address">
          {{ checked.address }}
        </div>
      </div>
      <!-- <div class="view-flex-item default-store" v-else>总店</div> -->
      <template v-if="!lock">
        <div
          v-if="checked.id && checked.id != '0'"
          class="iconfont icon-times"
          @click="handleResetClick"
        ></div>
        <!-- <div class="iconfont icon-sync-alt" @click="handleClick"></div> -->
      </template>
    </div>
    <storeList :visible="visible" :data="checked" @changeStore="handleChangeStore" @onClose="handleClose" @change="handleChange" />
  </div>
</template>

<script>
import api from '@/api'
import district from '@/common/district.json'
import storeList from './storeList'

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    lock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        name: '',
        is_valid: true
      },
      total: 0,
      list: [],
      regions: district,
      checked: {},
      currentStoreName:''
    }
  },
  components: {
    storeList
  },
  watch: {
    data(val) {
      if (val.id) {
        this.checked = val
      } else {
        this.checked = {}
      }
    }
  },
  methods: {
    handleClick() {
      this.visible = true
    },
    handleResetClick() {
      this.$emit('change', {})
    },
    handleChange(val) {
      this.$emit('change', val)
      this.visible = false
    },
    handleClose() {
      this.visible = false
    },
    handleChangeStore(list){ 
      //如果返回只有一个则为店铺端
      this.currentStoreName=list.length===1?list[0].name:'总店';
      console.log("==currentStoreName",this.currentStoreName)
    }
  },
  mounted() {
    if (this.data.id) {
      this.checked = this.data
    }
  }
}
</script>

<style scoped lang="scss">
.finder {
  margin-bottom: 20px;
}
.store-picker {
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 3px;
  &:hover {
    background: #f5f7fa;
  }
  .store-info {
    padding-right: 20px;
  }
  .iconfont {
    margin-left: 10px;
  }
}
.store-list {
  .store-list-item {
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 6px;
    &:hover {
      background: #f5f7fa;
    }
    &.active {
      background: #ecf5ff;
      box-shadow: 0 0 0 1px #b5dafb;
    }
  }
}
.default-store {
  font-size: 18px;
  font-weight: 600;
  color: $dominant_hue;
}
.store-name {
  @include text-overflow();
  font-size: 16px;
  color: $dominant_hue;
}
.store-address {
  @include text-overflow();
  font-size: 12px;
  color: #999;
}
</style>
