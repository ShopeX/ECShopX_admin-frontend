<template>
  <div class="menu-item-form-sp w-full max-w-[600px]">
    <SpFormPlus
      ref="formPlusRef"
      v-model="form"
      form-type="form"
      label-width="100px"
      class="w-full"
      :show-default-actions="false"
      :form-items="formItems"
    />
  </div>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import SpImagePicker from '@/components/sp-image-picker/index.vue'
import SpPathSelector from '@/components/sp-path-selector/index.vue'

export default {
  name: 'MenuItemForm',
  components: { SpFormPlus, SpImagePicker, SpPathSelector },
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: '',
        path: null,
        imageUrl: '',
        sort: 0
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'name',
          label: this.$t('7856f5b5.d7ec2d'),
          component: 'input',
          formItemClass: 'w-full',
          rules: [{ required: true, message: this.$t('7856f5b5.06e2f8'), trigger: 'blur' }],
          componentProps: {
            clearable: true,
            placeholder: this.$t('7856f5b5.2ff819')
          }
        },
        {
          fieldName: 'path',
          label: this.$t('7856f5b5.0fec18'),
          component: ({ value, onInput }) => (
            <SpPathSelector value={value} platform='web' on-input={onInput} />
          ),
          formItemClass: 'w-full'
        },
        {
          fieldName: 'imageUrl',
          label: this.$t('d6124b35.6bfb9b'),
          component: ({ value, onInput }) => <SpImagePicker value={value} on-input={onInput} />,
          formItemClass: 'w-full'
        },
        {
          fieldName: 'sort',
          label: this.$t('7856f5b5.c360e9'),
          component: ({ value, onInput }) => (
            <el-input-number
              class='menu-item-form-sp__sort-input'
              value={Number.isFinite(Number(value)) ? Number(value) : 0}
              min={0}
              step={1}
              precision={0}
              controlsPosition='right'
              onInput={onInput}
            />
          ),
          formItemClass: 'menu-item-form-sp__sort'
        }
      ]
    }
  },
  watch: {
    initialValue: {
      deep: true,
      handler() {
        this.syncForm()
      }
    }
  },
  created() {
    this.syncForm()
  },
  methods: {
    validate() {
      return this.$refs.formPlusRef.validate()
    },
    syncForm() {
      const iv = this.initialValue || {}
      this.form = {
        name: iv.name != null ? iv.name : '',
        path: iv.path || null,
        imageUrl: iv.imageUrl != null ? iv.imageUrl : iv.image_url != null ? iv.image_url : '',
        sort: iv.sort != null ? Number(iv.sort) : 0
      }
    },
    handleAction(conf) {
      if (!conf || conf.key === 'close') {
        this.$emit('close', null)
        return
      }
      if (conf.key === 'confirm' || conf.key === 'save') {
        this.submit()
      }
    },
    async submit() {
      this.$emit('loading', true)
      try {
        await this.validate()
        const iv = this.initialValue || {}
        this.$emit('close', {
          id: iv.id,
          name: this.form.name,
          path: this.form.path,
          imageUrl: this.form.imageUrl,
          sort: this.form.sort
        })
      } catch (e) {
        // 校验失败保持弹窗
      } finally {
        this.$emit('loading', false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item-form-sp ::v-deep {
  .menu-item-form-sp__sort .el-input-number {
    width: 180px;
  }
}
</style>
