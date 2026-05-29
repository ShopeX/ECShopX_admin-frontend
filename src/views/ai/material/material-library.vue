<template>
  <SpPage>
    <div slot="page-header" class="lib-header">
      <el-radio-group v-model="mediaType" size="small" @change="onTypeChange">
        <el-radio-button label="image">图片</el-radio-button>
        <el-radio-button label="video">视频</el-radio-button>
      </el-radio-group>

      <el-input
        v-model="keyword"
        placeholder="搜索素材名称"
        size="small"
        clearable
        style="width: 240px; margin-left: 12px"
        @keyup.enter.native="onSearch"
        @clear="onSearch"
      >
        <i slot="prefix" class="el-icon-search"></i>
      </el-input>

      <span class="header-spacer"></span>

      <router-link :to="{ name: 'aiMaterialStudio' }">
        <el-button size="small" type="primary" icon="el-icon-magic-stick">去制作</el-button>
      </router-link>
    </div>

    <div class="lib-body">
      <!-- 分组栏（复用 espier_uploadimages_cat where source=ai_generate） -->
      <div class="cat-rail">
        <div class="cat-rail-title">
          AI 素材分组
          <el-button type="text" size="mini" icon="el-icon-plus" @click="onAddCat">新建</el-button>
        </div>
        <div class="cat-list">
          <div class="cat-chip" :class="{ active: selectCatId === -1 }" @click="onPickCat(-1)">
            全部
          </div>
          <div class="cat-chip" :class="{ active: selectCatId === 0 }" @click="onPickCat(0)">
            未分组
          </div>
          <div
            v-for="c in cats"
            :key="c.image_cat_id"
            class="cat-chip"
            :class="{ active: selectCatId === c.image_cat_id }"
            @click="onPickCat(c.image_cat_id)"
          >
            {{ c.image_cat_name }}
          </div>
        </div>
      </div>

      <!-- 素材网格 -->
      <div class="grid-wrap" v-loading="loading">
        <el-empty
          v-if="!loading && items.length === 0"
          description="还没有 AI 素材，去制作页生成吧"
        />
        <div v-else class="grid">
          <div v-for="m in items" :key="m.image_id" class="m-card">
            <div class="m-cover" @click="preview(m)">
              <img v-if="mediaKindOf(m) === 'image'" :src="m.url || m.image_full_url" />
              <video
                v-else-if="mediaKindOf(m) === 'video'"
                :src="m.url || m.image_full_url"
                muted
                preload="metadata"
                @loadedmetadata="onMediaMeta(m, $event)"
              />
              <div v-else class="audio-placeholder">
                <i class="el-icon-headset" />
              </div>
              <div v-if="mediaKindOf(m) !== 'image'" class="m-badge">
                {{ mediaKindOf(m) === 'video' ? '视频' : '音频' }}
                <span v-if="m._duration"> · {{ formatDuration(m._duration) }}</span>
              </div>
              <div class="m-mask">
                <div class="m-actions">
                  <el-tooltip content="复制链接" placement="top">
                    <el-button size="mini" circle icon="el-icon-link" @click.stop="copyUrl(m)" />
                  </el-tooltip>
                  <el-tooltip content="移动分组" placement="top">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-folder-checked"
                      @click.stop="onMove(m)"
                    />
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-delete"
                      type="danger"
                      @click.stop="onDelete(m)"
                    />
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="m-info">
              <div class="m-name" :title="m.image_name">{{ m.image_name || '未命名' }}</div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <el-pagination
            background
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next, sizes"
            :page-sizes="[20, 40, 80]"
            @current-change="
              (p) => {
                page = p
                fetch()
              }
            "
            @size-change="
              (s) => {
                pageSize = s
                page = 1
                fetch()
              }
            "
          />
        </div>
      </div>
    </div>

    <!-- 移动分组 -->
    <el-dialog title="移动到分组" :visible.sync="moveDialog" width="380px" append-to-body>
      <el-select v-model="moveTargetCatId" placeholder="选择目标分组" style="width: 100%">
        <el-option :value="0" label="未分组" />
        <el-option
          v-for="c in cats"
          :key="c.image_cat_id"
          :label="c.image_cat_name"
          :value="c.image_cat_id"
        />
      </el-select>
      <div slot="footer">
        <el-button @click="moveDialog = false">取消</el-button>
        <el-button type="primary" :loading="moving" @click="onConfirmMove">确定</el-button>
      </div>
    </el-dialog>

    <!-- 大图/视频/音频预览 -->
    <el-dialog :visible.sync="previewVisible" width="auto" top="6vh" :modal="true">
      <video
        v-if="previewKind === 'video'"
        :src="previewUrl"
        controls
        preload="metadata"
        style="max-width: 80vw; max-height: 80vh; display: block; margin: 0 auto; background: #000"
      />
      <audio
        v-else-if="previewKind === 'audio'"
        :src="previewUrl"
        controls
        style="display: block; margin: 0 auto; min-width: 320px"
      />
      <img
        v-else-if="previewUrl"
        :src="previewUrl"
        style="max-width: 80vw; max-height: 80vh; display: block; margin: 0 auto"
      />
    </el-dialog>
  </SpPage>
</template>

<script>
import { getImageList, getImageAllCatgory, addImageCatgory, moveImageGroup } from '@/api/picker'
import { deleteImage } from '@/api/qiniu'

export default {
  name: 'MaterialLibrary',
  data() {
    return {
      mediaType: 'image',
      keyword: '',

      page: 1,
      pageSize: 40,
      total: 0,
      items: [],
      loading: false,

      cats: [],
      selectCatId: -1,

      moveDialog: false,
      moving: false,
      moveTarget: null,
      moveTargetCatId: 0,

      previewVisible: false,
      previewUrl: '',
      previewKind: 'image'
    }
  },
  mounted() {
    this.fetchCats()
    this.fetch()
  },
  methods: {
    async fetchCats() {
      try {
        const { data } = await getImageAllCatgory({ image_cat_id: 0, source: 'ai_generate' })
        const list = (data && data.list) || (data && data.data && data.data.list) || []
        this.cats = list
      } catch (e) {
        /* silent */
      }
    },
    async fetch() {
      this.loading = true
      try {
        const params = {
          source: 'ai_generate',
          media_type: this.mediaType,
          page: this.page,
          pageSize: this.pageSize
        }
        if (this.selectCatId === 0) params.image_cat_id = 0
        else if (this.selectCatId > 0) params.image_cat_id = this.selectCatId
        if (this.keyword) params.image_name = this.keyword
        const { data } = await getImageList(params)
        this.items = (data && data.list) || (data && data.data && data.data.list) || []
        this.total = (data && data.total_count) || (data && data.data && data.data.total_count) || 0
      } catch (e) {
        this.$message.error(e.message || '加载素材失败')
      } finally {
        this.loading = false
      }
    },
    onTypeChange() {
      this.page = 1
      this.fetch()
    },
    onSearch() {
      this.page = 1
      this.fetch()
    },
    onPickCat(id) {
      this.selectCatId = id
      this.page = 1
      this.fetch()
    },

    async onAddCat() {
      try {
        const { value } = await this.$prompt('请输入分组名称', '新建 AI 素材分组', {
          confirmButtonText: '创建',
          cancelButtonText: '取消',
          inputValidator: (v) =>
            (v && v.trim().length > 0 && v.length <= 20) || '名称必填且不超过 20 字'
        })
        await addImageCatgory({
          image_cat_name: (value || '').trim(),
          parent_id: 0,
          source: 'ai_generate'
        })
        await this.fetchCats()
        this.$message.success('分组已创建')
      } catch (e) {
        if (e !== 'cancel' && e && e.message) this.$message.error(e.message)
      }
    },

    onMove(m) {
      this.moveTarget = m
      this.moveTargetCatId = m.image_cat_id || 0
      this.moveDialog = true
    },
    async onConfirmMove() {
      if (!this.moveTarget) return
      this.moving = true
      try {
        await moveImageGroup({
          image_cat_id: this.moveTargetCatId,
          image_id: String(this.moveTarget.image_id)
        })
        this.$message.success('已移动')
        this.moveDialog = false
        this.fetch()
      } catch (e) {
        this.$message.error(e.message || '移动失败')
      } finally {
        this.moving = false
      }
    },

    async onDelete(m) {
      try {
        await this.$confirm('确定删除这个素材吗？', '提示', { type: 'warning' })
        await deleteImage({ image_id: String(m.image_id) })
        this.$message.success('已删除')
        this.fetch()
      } catch (e) {
        /* canceled */
      }
    },

    async copyUrl(m) {
      try {
        await this.$copyText(m.url || m.image_full_url || '')
        this.$message.success('已复制 URL')
      } catch (e) {
        /* ignore */
      }
    },

    /** 按 image_type MIME 前缀辨型，兜底用 url 后缀 */
    mediaKindOf(item) {
      const mime = item && item.image_type ? String(item.image_type).toLowerCase() : ''
      if (mime.indexOf('video/') === 0) return 'video'
      if (mime.indexOf('audio/') === 0) return 'audio'
      if (mime.indexOf('image/') === 0) return 'image'
      const url = String((item && (item.url || item.image_full_url || item.image_url)) || '')
      const ext = (url.split('?')[0].split('.').pop() || '').toLowerCase()
      if (['mp4', 'mov', 'webm', 'm4v'].indexOf(ext) > -1) return 'video'
      if (['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].indexOf(ext) > -1) return 'audio'
      return 'image'
    },
    onMediaMeta(item, ev) {
      const dur = ev && ev.target && ev.target.duration
      if (dur && isFinite(dur)) this.$set(item, '_duration', Math.round(dur))
    },
    formatDuration(sec) {
      if (!sec) return ''
      const s = Math.max(0, Math.round(Number(sec) || 0))
      const m = Math.floor(s / 60)
      const r = s % 60
      return m + ':' + (r < 10 ? '0' + r : r)
    },
    preview(m) {
      this.previewUrl = m.url || m.image_full_url || ''
      this.previewKind = this.mediaKindOf(m)
      this.previewVisible = true
    }
  }
}
</script>

<style scoped>
.lib-header {
  display: flex;
  align-items: center;
}
.header-spacer {
  flex: 1;
}

.lib-body {
  display: flex;
  gap: 16px;
}
.cat-rail {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  height: fit-content;
}
.cat-rail-title {
  font-size: 13px;
  color: #303133;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.cat-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cat-chip {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.cat-chip:hover {
  background: #f4f6fa;
  color: #409eff;
}
.cat-chip.active {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

.grid-wrap {
  flex: 1;
}
/* 卡片尺寸对齐素材管理（picker-image）：固定 120px 缩略图 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
  gap: 8px;
}
.m-card {
  width: 120px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}
.m-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.m-cover {
  position: relative;
  cursor: zoom-in;
  width: 120px;
  height: 120px;
  background: #ddd;
  overflow: hidden;
}
.m-cover img,
.m-cover video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.m-cover .audio-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 36px;
  background: linear-gradient(135deg, #36383d 0%, #1f2024 100%);
}
.m-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
  line-height: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
}
.m-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.m-cover:hover .m-mask {
  opacity: 1;
}
.m-actions {
  display: flex;
  gap: 4px;
}
.m-actions .el-button {
  padding: 4px;
}
.m-info {
  padding: 4px 6px 6px;
}
.m-name {
  font-size: 12px;
  line-height: 16px;
  color: #303133;
  height: 32px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
