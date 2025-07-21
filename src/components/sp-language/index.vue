<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <SpIcon class="p-2" button radius name="translate" :size="16">
      <slot />
    </SpIcon>

    <el-dropdown-menu slot="dropdown" style="width: 130px">
      <el-dropdown-item v-for="item in languageList" :key="item.value" :command="item.value">
        <div class="flex items-center gap-1">
          <div class="w-[14px] h-[14px] flex items-center justify-center">
            <SpIcon v-show="lang === item.value" name="dot" :size="14" />
          </div>
          <span>{{ item.label }}</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import i18n from '@/i18n'
export default {
  name: 'SpLanguage',
  data() {
    const languageList = Object.keys(i18n).map(key => ({
      label: i18n[key],
      value: key
    }))
    return {
      languageList
    }
  },
  computed: {
    lang() {
      return this.$store.state.system.lang
    }
  },
  methods: {
    handleCommand(command) {
      window.localStorage.setItem('lang', command)
      this.$store.commit('system/updateLang', { lang: command })
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped></style>
