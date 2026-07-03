<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="activeName == 'second' ? $t('c5e8d16d.6c1583') : $t('c5e8d16d.36a735')">
    <div class="section-white">
      <el-tabs v-model="activeName" type="card">
        <!-- <el-tab-pane
          label="基础设置"
          name="first"
        >
          <card-setting />
        </el-tab-pane> -->
        <el-tab-pane :label="$t('c5e8d16d.795682')" name="second">
          <card-level ref="cardLevel" :shuyun-open-platform-enabled="shuyunOpenPlatformEnabled" />
        </el-tab-pane>
        <el-tab-pane :label="$t('c5e8d16d.de2408')" name="thrid">
          <card-viplevel
            ref="cardViplevel"
            :shuyun-open-platform-enabled="shuyunOpenPlatformEnabled"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template>
      <div class="text-center">
        <template v-if="activeName == 'second'">
          <el-button
            v-if="shuyunOpenPlatformEnabled"
            :loading="syncLoyaltyGradeLoading"
            @click="handleSyncLoyaltyGrade"
          >
            {{ $t('c5e8d16d.511c58') }}
          </el-button>
          <el-button v-if="!shuyunOpenPlatformEnabled" @click="addGrade('cardLevel')">
            {{ $t('c5e8d16d.0b369f') }}
          </el-button>
          <el-button type="primary" @click="saveGrade('cardLevel')">
            {{ $t('c5e8d16d.be5fbb') }}
          </el-button>
        </template>
        <template v-if="activeName == 'thrid'">
          <el-button v-if="!shuyunOpenPlatformEnabled" @click="addGrade('cardViplevel')">
            {{ $t('c5e8d16d.0b369f') }}
          </el-button>
          <el-button type="primary" @click="saveGrade('cardViplevel')">
            {{ $t('c5e8d16d.be5fbb') }}
          </el-button>
        </template>
      </div>
    </template>
  </SpPage>
</template>
<script>
import { syncLoyaltyGrade as syncLoyaltyGradeApi } from '@/api/membercard'
import cardViplevel from './comps/cpViplevel.vue'
import cardLevel from './comps/cpLevel.vue'
export default {
  components: {
    cardLevel,
    cardViplevel
  },
  data() {
    return {
      activeName: 'second',
      syncLoyaltyGradeLoading: false,
      shuyunOpenPlatformEnabled: false
    }
  },
  mounted() {
    this.loadShuyunOpenPlatformFlag()
  },
  activated() {
    this.loadShuyunOpenPlatformFlag()
  },
  methods: {
    async loadShuyunOpenPlatformFlag() {
      try {
        const data = await this.$api.third.getShuyunCrmSetting()
        this.shuyunOpenPlatformEnabled = Boolean(data && data.is_enabled)
      } catch (e) {
        this.shuyunOpenPlatformEnabled = false
      }
    },
    addGrade(val) {
      this.$refs[val].addGrade()
    },
    saveGrade(val) {
      this.$refs[val].saveGrade()
    },
    getSyncLoyaltyGradeErrorMessage(err) {
      if (err == null || typeof err === 'boolean') return ''
      if (typeof err === 'string') return err
      const payload = err.response?.data != null ? err.response.data : err
      if (!payload || typeof payload !== 'object') return ''
      const inner =
        payload.data != null && typeof payload.data === 'object' ? payload.data : payload
      const msg = inner.message || inner.error || payload.message || payload.error
      return msg != null && msg !== '' ? String(msg) : ''
    },
    handleSyncLoyaltyGrade() {
      this.syncLoyaltyGradeLoading = true
      syncLoyaltyGradeApi()
        .then((res) => {
          const d = res.data && res.data.data ? res.data.data : {}
          const ok =
            d.ok === true || d.status === true || (d.ok !== false && d.synced_count != null)
          if (ok) {
            const n = d.synced_count != null ? d.synced_count : 0
            this.$message.success(this.$t('c5e8d16d.8b6161', [n]))
            const ref = this.$refs.cardLevel
            if (ref && typeof ref.getGradeList === 'function') {
              ref.getGradeList()
            }
          } else if (d.message) {
            this.$message.error(d.message)
          }
        })
        .catch((err) => {
          const msg = this.getSyncLoyaltyGradeErrorMessage(err)
          this.$message.error(msg || this.$t('1f7b7edc.f50bf4'))
        })
        .finally(() => {
          this.syncLoyaltyGradeLoading = false
        })
    }
  }
}
</script>
