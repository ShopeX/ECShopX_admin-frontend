<template>
  <div class="flex p-0">
    <el-upload
      ref="uploadRef"
      action=""
      accept="image/jpeg,image/png,image/gif"
      :multiple="true"
      :show-file-list="false"
      :data="localpostData"
      :http-request="handleUpload"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :on-error="uploadError"
    >
    </el-upload>

    <el-button
      v-if="!isPasteMode"
      type="normal"
      @click.stop="selectImage"
      class="h-[calc(1em+16px)] !border-2 !border-solid !border-purple-700 !mr-2 !flex !items-center !justify-center"
    >
      选择
    </el-button>
    <div
      class="w-[300px] h-[calc(1em+16px)] border-2 border-solid border-purple-700 rounded flex items-center justify-center cursor-pointer py-1 px-1 ml-2 hover:bg-purple-50 transition-colors"
      :class="[isPasteMode ? 'color-gray' : '']"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @click="togglePasteMode"
    >
      <div class="flex items-center justify-center">
        <div v-if="isPasteMode" class="hover:cursor-pointer text-gray-400">
          <div v-if="isMac">使用 <kbd>⌘</kbd> + V</div>
          <div v-else>使用 Ctrl + V</div>
        </div>
        <div v-else class="hover:cursor-pointer text-gray-400">
          拖拽或点击后粘贴图片（仅支持单张图片）
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadUtil from '@/utils/uploadUtil'
import { isMac as checkIsMac } from '@/utils'

export default {
  name: 'SpImageUploader',
  props: {
    localpostData: {
      type: Object,
      default: () => ({
        token: '',
        key: '',
        fname: ''
      })
    },
    refresh: {
      type: Function,
      default: () => {}
    },
    currentCategory: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isPasteMode: false,
      pasteListener: null
    }
  },
  computed: {
    isMac() {
      return checkIsMac()
    }
  },
  mounted() {
    this.setupPasteListener()
  },
  beforeDestroy() {
    if (this.pasteListener) {
      document.removeEventListener('paste', this.pasteListener)
    }
  },
  methods: {
    togglePasteMode() {
      this.isPasteMode = !this.isPasteMode
    },
    selectImage() {
      const uploadComponent = this.$refs.uploadRef
      if (uploadComponent) {
        const input = uploadComponent.$el.querySelector('input[type="file"]')
        if (input) {
          input.click()
        }
      }
    },
    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      const imageFiles = files.filter(
        (file) =>
          file.type.startsWith('image/') &&
          ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      )
      if (imageFiles.length === 0) return
      const file = imageFiles[0]
      if (this.beforeAvatarUpload(file)) {
        this.handleUpload({
          file: file,
          onSuccess: async (res) => {
            try {
              const uploadParams = {
                image_cat_id: this.currentCategory,
                image_name: file.name,
                image_url: res.key,
                image_type: file.type,
                storage: 'image'
              }
              await this.$api.qiniu.uploadQiniuPic(uploadParams)
              this.$message.success('图片上传成功')
              this.refresh(true)
            } catch (err) {
              this.$message.error('上传失败')
            }
          },
          onError: (err) => {
            this.$message.error('上传失败')
          }
        })
      }
    },

    getImageExtension(mimeType) {
      const mimeMap = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/svg+xml': 'svg'
      }
      return mimeMap[mimeType]
    },

    setupPasteListener() {
      this.pasteListener = (event) => {
        if (!this.isPasteMode) return

        const items = event.clipboardData.items
        if (!items) return

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            event.preventDefault()
            const blob = items[i].getAsFile()
            if (!blob) continue

            const extension = this.getImageExtension(blob.type)
            const fileName = `image-${Date.now()}.${extension}`
            const file = new File([blob], fileName, { type: blob.type })

            this.uploadPasteImage(file)
            setTimeout(() => {
              this.isPasteMode = false
            }, 3000)
            break
          }
        }
      }
      document.addEventListener('paste', this.pasteListener)
    },

    uploadPasteImage(file) {
      if (this.beforeAvatarUpload(file)) {
        this.handleUpload({
          file: file,
          onSuccess: async (res) => {
            try {
              const uploadParams = {
                image_cat_id: this.currentCategory,
                image_name: file.name,
                image_url: res.key,
                image_type: file.type,
                storage: 'image'
              }
              await this.$api.qiniu.uploadQiniuPic(uploadParams)
              this.$message.success('粘贴图片上传成功')
              this.refresh(true)
            } catch (err) {
              this.$message.error('粘贴图片上传失败')
            }
          },
          onError: (err) => {
            this.$message.error('粘贴图片上传失败')
          }
        })
      }
    },
    //返回boolean
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        return false
      }
      /*if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }*/
      if (this.localpostData) {
        this.localpostData.fname = file.name
      }
      return true
    },

    async handleAvatarSuccess(res, file) {
      const uploadParams = {
        image_cat_id: this.currentCategory,
        image_name: file.name,
        image_url: res.key,
        image_type: file.raw.type,
        storage: 'image'
      }
      try {
        await this.$api.qiniu.uploadQiniuPic(uploadParams)
        this.$message.success('上传成功')
        this.refresh(true)
      } catch (error) {
        this.$message.error('上传失败')
      }
    },
    handleUpload(e) {
      const upload = new UploadUtil()
      upload
        .uploadImg(e.file)
        .then(
          (res) => {
            if (e.onSuccess) e.onSuccess(res)
          },
          (err) => {
            if (e.onError) e.onError(err)
          }
        )
        .catch((err) => {
          if (e.onError) e.onError(err)
        })
    },

    uploadError(e) {
      console.error(e)
      this.$message.error('上传失败')
    }
  }
}
</script>
