<template>
  <el-dialog :visible="dialogVisible" :fullscreen="true" @close="handleClose" append-to-body>
    <div>
      <h1>{{ $t('a696d8cc.1cb6db') }}</h1>
    </div>

    <div class="flex justify-center h-[calc(100vh-95px)]">
      <div class="flex-1 flex flex-col">
        <div class="flex-1 flex items-center justify-center">
          <vue-advanced-cropper
            ref="cropperRef"
            :src="imageSrc"
            :stencil-props="stencilProps"
            @change="onCropChange"
            class="w-[650px] h-[600px]"
          />
        </div>

        <div class="sticky bottom-0 left-0 right-0 p-2 mt-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <el-radio-group v-model="aspectRatio" @change="handleAspectRatioChange">
                <el-radio-button label="free">{{ $t('a696d8cc.0aaabc') }}</el-radio-button>
                <el-radio-button label="1:1">1:1</el-radio-button>
                <el-radio-button label="4:3">4:3</el-radio-button>
                <el-radio-button label="16:9">16:9</el-radio-button>
              </el-radio-group>
              <el-button @click="resetCropper" class="!ml-4">{{ $t('a696d8cc.4b9c32') }}</el-button>
            </div>

            <div v-if="imageList.length > 1" class="flex items-center justify-center gap-4">
              <el-button
                size="small"
                :disabled="currentIndex === 0"
                @click="goToImage(currentIndex - 1)"
                icon="el-icon-arrow-left"
              >
                {{ $t('a696d8cc.1d7cad') }}
              </el-button>

              <span class="text-sm text-gray-600"
                >{{ currentIndex + 1 }} / {{ imageList.length }}</span
              >

              <el-button
                size="small"
                :disabled="currentIndex === imageList.length - 1"
                @click="goToImage(currentIndex + 1)"
              >
                {{ $t('a696d8cc.78374b') }}
                <i class="el-icon-arrow-right" />
              </el-button>
            </div>

            <div class="flex items-center gap-2">
              <el-button @click="handleClose"> {{ $t('a696d8cc.625fb2') }} </el-button>
              <el-button type="primary" @click="handleSave" :loading="uploading">
                {{ $t('a696d8cc.e83a25') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-80 border-l border-gray-200 p-6 overflow-y-auto">
        <h3 class="mb-6">{{ $t('a696d8cc.5eacfe') }}</h3>
        <div>
          <label class="text-sm mb-2 block">{{ $t('a696d8cc.29139c') }}</label>
          <div class="text-sm bg-gray-100 border border-gray-200 rounded px-3 py-2 mb-5">
            {{ currentImage?.image_name }}
          </div>
        </div>

        <div>
          <label class="text-sm mb-2 block">{{ $t('a696d8cc.dbe982') }}</label>
          <div class="flex items-center mb-5">
            <el-input
              v-model="formData.newImageName"
              type="text"
              :placeholder="$t('a696d8cc.d66416')"
              :maxlength="50"
              size="small"
              class="text-sm flex-1"
            />
            <div class="ml-2 text-sm bg-gray-100 px-3 py-1.5 rounded border text-center">
              {{ fileExtension }}
            </div>
          </div>
        </div>

        <div>
          <label class="text-sm mb-2 block">{{ $t('a696d8cc.4bcc9a') }}</label>
          <span>
            {{ getImageType(imageFileInfo?.type) }} / {{ imageFileInfo?.width }} ×
            {{ imageFileInfo?.height }} / {{ formatFileSize(imageFileInfo?.size) }}
          </span>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center mb-4">
            <el-checkbox
              v-model="lockAspectRatio"
              :disabled="aspectRatio !== 'free'"
              @change="handleLockAspectRatioChange"
            >
              {{ $t('a696d8cc.77612d') }}
            </el-checkbox>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-sm mb-1 block">{{ $t('a696d8cc.d66218') }}</label>
              <el-input
                v-model="inputWidth"
                type="number"
                min="1"
                :max="maxWidth"
                size="small"
                @change="handleWidthChange"
              />
            </div>

            <div>
              <label class="text-sm mb-1 block">{{ $t('a696d8cc.683c14') }}</label>
              <el-input
                v-model="inputHeight"
                type="number"
                min="1"
                :max="maxHeight"
                size="small"
                @change="handleHeightChange"
              />
            </div>

            <div v-if="cropCoordinates">
              <label class="text-sm mb-1 block">{{ $t('a696d8cc.f30659') }}</label>
              <div class="flex space-x-2">
                <el-input :value="currentX" type="number" readonly size="small" class="flex-1" />
              </div>
            </div>

            <div v-if="cropCoordinates">
              <label class="text-sm mb-1 block">{{ $t('a696d8cc.17a0bb') }}</label>
              <div class="flex space-x-2">
                <el-input :value="currentY" type="number" readonly size="small" class="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Cropper as VueAdvancedCropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import UploadUtil from '@/utils/uploadUtil'

export default {
  name: 'SpCropper',
  components: {
    VueAdvancedCropper
  },
  data() {
    return {
      uploading: false,
      dialogVisible: false,
      imageSrc: '',

      imageList: [],
      currentIndex: 0,
      currentImage: null,

      aspectRatio: 'free',
      cropCoordinates: null,
      cropDimensions: {
        width: 0,
        height: 0
      },
      stencilProps: {
        aspectRatio: NaN,
        movable: true,
        scalable: true
      },
      formData: {
        newImageName: ''
      },
      cropper: null, //裁剪器实例引用
      imageFileInfo: null,
      lockAspectRatio: false,
      inputWidth: 0,
      inputHeight: 0,
      maxWidth: 0,
      maxHeight: 0,
      originalImageSize: { width: 0, height: 0 },
      originalAspectRatio: 0,
      currentX: 0,
      currentY: 0,
      currentWidth: 0,
      currentHeight: 0,
      currentAspectRatio: 0,
      rafId: null,
      isUpdating: false,
      lastCoordinates: null
    }
  },
  computed: {
    aspectRatioValue() {
      switch (this.aspectRatio) {
        case '1:1':
          return 1
        case '4:3':
          return 4 / 3
        case '16:9':
          return 16 / 9
        case 'free':
          return NaN
        default:
          return NaN
      }
    },
    fileExtension() {
      if (!this.currentImage || !this.currentImage?.image_name) return ''
      const name = this.currentImage.image_name
      const lastDotIndex = name.lastIndexOf('.')
      return lastDotIndex === -1 ? '' : name.substring(lastDotIndex)
    }
  },
  watch: {
    currentImage() {
      if (this.imageFileInfo) {
        this.maxWidth = this.imageFileInfo.width
        this.maxHeight = this.imageFileInfo.height
      }
    },
    dialogVisible(newVal) {
      if (!newVal) {
        //如果对话框关闭了，停止高频更新
        this.stopHighFreqUpdate()
      }
    }
  },
  beforeDestroy() {
    this.stopHighFreqUpdate()
  },
  methods: {
    updateCoordinatesDisplay(coords) {
      this.currentX = Math.round(coords.left)
      this.currentY = Math.round(coords.top)
      this.currentWidth = Math.round(coords.width)
      this.currentHeight = Math.round(coords.height)
      this.inputWidth = this.currentWidth
      this.inputHeight = this.currentHeight
    },
    getFullImageCoordinates() {
      return {
        left: 0,
        top: 0,
        width: this.originalImageSize.width,
        height: this.originalImageSize.height
      }
    },

    initImageDisplayData() {
      this.updateCoordinatesDisplay(this.getFullImageCoordinates())
      this.cropDimensions.width = this.currentWidth
      this.cropDimensions.height = this.currentHeight
    },

    getCurrentCoordinates() {
      return this.cropper.coordinates
    },

    startHighFreqUpdate() {
      this.isUpdating = true
      //定义重复执行的函数
      const updateFrame = () => {
        if (!this.isUpdating || !this.cropper) return

        const coords = this.getCurrentCoordinates()

        if (coords) {
          const newX = Math.round(coords.left)
          const newY = Math.round(coords.top)
          const newWidth = Math.round(coords.width)
          const newHeight = Math.round(coords.height)

          if (
            !this.lastCoordinates ||
            newX !== this.currentX ||
            newY !== this.currentY ||
            newWidth !== this.currentWidth ||
            newHeight !== this.currentHeight
          ) {
            this.updateCoordinatesDisplay(coords)

            this.lastCoordinates = {
              left: newX,
              top: newY,
              width: newWidth,
              height: newHeight
            }
          }
        }
        //请求下一帧继续执行
        this.rafId = requestAnimationFrame(updateFrame)
      }
      //开始第一次执行
      this.rafId = requestAnimationFrame(updateFrame)
    },

    stopHighFreqUpdate() {
      this.isUpdating = false
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    },

    onCropChange(data) {
      if (data.coordinates) {
        this.cropCoordinates = data.coordinates
        this.lastCoordinates = data.coordinates

        this.cropDimensions.width = Math.round(data.coordinates.width)
        this.cropDimensions.height = Math.round(data.coordinates.height)
        this.updateCoordinatesDisplay(data.coordinates)

        if (!this.isUpdating) {
          this.startHighFreqUpdate()
        }
      }
    },

    async showDialog(data) {
      this.dialogVisible = true
      this.imageList = data.imageList
      this.currentIndex = data.currentIndex
      this.currentImage = this.imageList[this.currentIndex]
      if (this.currentImage) {
        this.imageSrc = this.currentImage.url
        const name = this.currentImage?.image_name
        const lastDotIndex = name.lastIndexOf('.')
        this.formData.newImageName = lastDotIndex === -1 ? name : name.substring(0, lastDotIndex)
        await this.createCurrentImageFile()
      }
      this.$nextTick(() => {
        this.cropper = this.$refs.cropperRef
        if (this.cropper) {
          const fullCoords = this.getFullImageCoordinates()
          this.cropper.setCoordinates(fullCoords)

          this.initImageDisplayData()
          this.startHighFreqUpdate()
        }
      })
    },
    async createCurrentImageFile() {
      const response = await fetch(this.currentImage.url)
      const blob = await response.blob()
      const file = new File([blob], this.currentImage?.image_name, { type: blob.type })
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const img = new Image()
          img.onload = () => {
            this.imageFileInfo = {
              file: file,
              width: img.width,
              height: img.height,
              size: file.size,
              type: file.type,
              name: file.name
            }
            this.originalImageSize = {
              width: img.width,
              height: img.height
            }
            this.originalAspectRatio = img.width / img.height
            this.maxWidth = img.width
            this.maxHeight = img.height
            resolve()
          }
          img.src = event.target.result
        }
        reader.readAsDataURL(blob)
      })
    },
    goToImage(index) {
      if (index < 0 || index >= this.imageList.length) return

      this.stopHighFreqUpdate()
      this.currentIndex = index
      this.currentImage = this.imageList[index]
      this.imageSrc = this.currentImage.url
      const name = this.currentImage?.image_name
      const lastDotIndex = name.lastIndexOf('.')
      this.formData.newImageName = lastDotIndex === -1 ? name : name.substring(0, lastDotIndex)

      this.aspectRatio = 'free'
      this.lockAspectRatio = false
      this.stencilProps.aspectRatio = NaN
      this.cropCoordinates = null
      this.lastCoordinates = null

      this.createCurrentImageFile()

      this.$nextTick(() => {
        this.cropper = this.$refs.cropperRef
        if (this.cropper) {
          this.cropper.reset()
          const fullCoords = this.getFullImageCoordinates()
          this.cropper.setCoordinates(fullCoords)
          this.cropCoordinates = fullCoords
          this.lastCoordinates = fullCoords

          this.updateStencilAspectRatio()

          this.initImageDisplayData()
          this.startHighFreqUpdate()
        }
      })
    },
    //公共方法
    updateStencilAspectRatio() {
      if (this.aspectRatio === 'free') {
        this.stencilProps.aspectRatio = this.lockAspectRatio ? this.originalAspectRatio : NaN
      } else {
        this.stencilProps.aspectRatio = this.aspectRatioValue
      }
    },

    handleAspectRatioChange() {
      if (this.aspectRatio !== 'free') {
        this.lockAspectRatio = true
      } else {
        this.lockAspectRatio = false
      }
      this.updateStencilAspectRatio()

      if (this.cropper) {
        this.cropper.reset()
      }
    },

    handleLockAspectRatioChange() {
      //只处理自由模式
      if (this.aspectRatio !== 'free') return
      this.updateStencilAspectRatio()

      if (this.cropper) {
        this.cropper.reset()
      }
    },

    handleWidthChange(value) {
      if (!value || value <= 0 || !this.cropCoordinates) return

      let newWidth = parseInt(value)
      if (newWidth < 1) {
        newWidth = 1
      }
      if (newWidth > this.maxWidth) {
        newWidth = this.maxWidth
      }
      let newHeight = this.inputHeight
      //按比例计算高度
      if (this.aspectRatio !== 'free' && this.aspectRatioValue) {
        newHeight = Math.round(newWidth / this.aspectRatioValue)
      } else if (
        this.aspectRatio === 'free' &&
        this.lockAspectRatio &&
        this.originalAspectRatio > 0
      ) {
        newHeight = Math.round(newWidth / this.originalAspectRatio)
      }

      if (newHeight > this.maxHeight) {
        newHeight = this.maxHeight
        if (this.aspectRatio === 'free' && this.lockAspectRatio && this.originalAspectRatio > 0) {
          newWidth = Math.round(newHeight * this.originalAspectRatio)
        }
      }

      this.inputHeight = newHeight
      this.updateCropDimensions(newWidth, newHeight)
    },

    handleHeightChange(value) {
      if (!value || value <= 0 || !this.cropCoordinates) return

      let newHeight = parseInt(value)
      if (newHeight < 1) {
        newHeight = 1
      }
      if (newHeight > this.maxHeight) {
        newHeight = this.maxHeight
      }

      let newWidth = this.inputWidth

      if (this.aspectRatio !== 'free' && this.aspectRatioValue) {
        newWidth = Math.round(newHeight * this.aspectRatioValue)
      } else if (
        this.aspectRatio === 'free' &&
        this.lockAspectRatio &&
        this.originalAspectRatio > 0
      ) {
        newWidth = Math.round(newHeight * this.originalAspectRatio)
      }

      if (newWidth > this.maxWidth) {
        newWidth = this.maxWidth
        if (this.aspectRatio === 'free' && this.lockAspectRatio && this.originalAspectRatio > 0) {
          newHeight = Math.round(newWidth / this.originalAspectRatio)
        }
      }

      this.inputWidth = newWidth
      this.updateCropDimensions(newWidth, newHeight)
    },

    updateCropDimensions(width, height) {
      let safeWidth = Math.round(width)
      let safeHeight = Math.round(height)
      this.inputWidth = safeWidth
      this.inputHeight = safeHeight
      this.cropDimensions.width = safeWidth
      this.cropDimensions.height = safeHeight
      const currentX = this.cropCoordinates.left
      const currentY = this.cropCoordinates.top
      const maxAllowableX = this.maxWidth - safeWidth
      let newX = currentX
      if (currentX > maxAllowableX) {
        newX = maxAllowableX
      }
      const maxAllowableY = this.maxHeight - safeHeight
      let newY = currentY
      if (currentY > maxAllowableY) {
        newY = maxAllowableY
      }
      if (newX < 0) {
        newX = 0
      }
      if (newY < 0) {
        newY = 0
      }
      const newCoordinates = {
        left: newX,
        top: newY,
        width: safeWidth,
        height: safeHeight
      }
      this.cropper.setCoordinates(newCoordinates)
    },

    resetCropper() {
      if (this.cropper) {
        this.aspectRatio = 'free'
        this.stencilProps.aspectRatio = NaN
        this.lockAspectRatio = false
        this.cropper.reset()

        this.$nextTick(() => {
          const fullCoords = this.getFullImageCoordinates()
          this.cropper.setCoordinates(fullCoords)
        })
      }
    },

    formatFileSize(bytes) {
      if (!bytes) return ''
      if (bytes === 0) return '0 Bytes'

      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      let size = bytes
      let index = 0

      //一直除以1024，直到找到合适的单位
      while (size >= k && index < sizes.length - 1) {
        size = size / k
        index++
      }

      return size.toFixed(1) + ' ' + sizes[index]
    },

    getImageType(mimeType) {
      if (!mimeType) return '-'
      const typeMap = {
        'image/jpeg': 'JPEG',
        'image/png': 'PNG',
        'image/gif': 'GIF',
        'image/webp': 'WebP',
        'image/svg+xml': 'SVG',
        'image/bmp': 'BMP'
      }
      return typeMap[mimeType]
    },

    handleClose() {
      this.stopHighFreqUpdate()
      this.dialogVisible = false
      this.$emit('close')
    },

    async handleSave() {
      this.stopHighFreqUpdate()
      if (this.cropper && this.cropCoordinates) {
        this.uploading = true
        try {
          const cropResult = this.cropper.getResult({
            width: this.cropDimensions.width,
            height: this.cropDimensions.height
          })

          const canvas = cropResult.canvas
          const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg')
          })
          const fileName = `${this.formData.newImageName}${this.fileExtension}`
          const file = new File([blob], fileName, { type: 'image/jpeg' })

          const uploadUtil = new UploadUtil()
          const qiniuResult = await uploadUtil.uploadImg(file, file.name)

          const uploadParams = {
            image_cat_id: this.currentImage?.image_cat_id,
            image_name: fileName,
            image_url: qiniuResult.key,
            image_type: 'image/jpeg',
            storage: 'image'
          }

          const dbResult = await this.$api.qiniu.uploadQiniuPic(uploadParams)

          this.$emit('save-complete', {
            imageId: this.currentImage?.image_id,
            newImageName: fileName,
            qiniuData: qiniuResult,
            dbResult: dbResult,
            cropData: {
              coordinates: this.cropCoordinates,
              dimensions: this.cropDimensions
            }
          })
          this.handleClose()
        } catch (error) {
          this.$message.error(this.$t('a696d8cc.6de920') + ': ' + error.message)
        } finally {
          this.uploading = false
        }
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__header {
  @apply p-0;
}
</style>
