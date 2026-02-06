<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFinder
      ref="finder"
      :data="tableData"
      :setting="setting"
      :show-pager="false"
      no-selection
      :show-tool-bar="false"
    />

    <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
  </SpPage>
</template>
<script>
import { getDomainH5Setting, setDomainSetting } from '@/api/company'
import { createSetting } from '@shopex-ui/finder'

export default {
  data() {
    return {
      loading: false,
      form: {
        pc_domain: '',
        h5_domain: '',
        pc_is_checked: false,
        h5_is_checked: true,
        h5_default_domain: '',
        pc_default_domain: ''
      },
      tableData: []
    }
  },
  computed: {
    setting() {
      return createSetting({
        columns: [
          {
            name: '域名设置',
            key: 'type',
            width: 150,
            render: (h, scope) => {
              return h('span', scope.row.type)
            }
          },
          {
            name: '',
            key: 'default_domain',
            render: (h, scope) => {
              return h('div', { class: 'domain-info' }, [
                h('span', { style: { marginRight: '10px' } }, scope.row.default_domain),
                h(
                  'el-tag',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        const copyText = scope.row.default_domain
                        const textarea = document.createElement('textarea')
                        textarea.value = copyText
                        textarea.style.position = 'fixed'
                        textarea.style.opacity = '0'
                        document.body.appendChild(textarea)
                        textarea.select()
                        try {
                          document.execCommand('copy')
                          this.onCopy()
                        } catch (err) {
                          console.error('复制失败:', err)
                        }
                        document.body.removeChild(textarea)
                      }
                    }
                  },
                  '点我复制'
                )
              ])
            }
          },
          {
            name: '',
            key: 'domain',
            render: (h, scope) => {
              return h('el-input', {
                props: {
                  value: scope.row.domain,
                  placeholder: '请输入绑定的独立域名',
                  size: 'small'
                },
                style: {
                  width: '220px'
                },
                on: {
                  input: (value) => {
                    scope.row.domain = value
                    if (scope.row.type === 'H5域名') {
                      this.form.h5_domain = value
                    } else {
                      this.form.pc_domain = value
                    }
                  }
                }
              })
            }
          }
        ]
      })
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    getConfig() {
      getDomainH5Setting().then((response) => {
        this.form = response.data.data
        this.tableData = [
          {
            id: 1,
            type: 'H5域名',
            default_domain: response.data.data.h5_default_domain,
            domain: response.data.data.h5_domain
          },
          {
            id: 2,
            type: 'PC域名',
            default_domain: response.data.data.pc_default_domain,
            domain: response.data.data.pc_domain
          }
        ]
        this.$nextTick(() => {
          if (this.$refs.finder) {
            this.$refs.finder.refresh()
          }
        })
      })
    },
    onSubmit() {
      this.loading = true

      setDomainSetting({
        pc_domain: this.form.pc_domain,
        h5_domain: this.form.h5_domain
      })
        .then((response) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    }
  }
}
</script>
