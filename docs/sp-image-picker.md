# SpImagePicker 图片选择器组件

## 组件介绍
SpImagePicker 是一个基于 Vue.js 的图片选择器组件，支持单张或多张图片的选择、上传、预览和管理。

## 基本用法

### 1. 导入组件
```javascript
import SpImagePicker from '@/components/sp-image-picker'
```

### 2. 注册组件
```javascript
export default {
  components: {
    SpImagePicker
  }
}
```

### 3. 在模板中使用
```vue
<template>
  <SpImagePicker
    v-model="imageUrl"
    :max="1"
    size="small"
  />
</template>

<script>
export default {
  data() {
    return {
      imageUrl: ''
    }
  }
}
</script>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value | String/Object/Array | - | 图片数据，支持字符串、对象或数组格式 |
| max | Number | 1 | 最大选择图片数量 |
| size | String | 'normal' | 图片尺寸，可选值：'small', 'normal', 'large' |
| type | String | 'string' | 数据类型，可选值：'string', 'object' |
| drag | Boolean | false | 是否支持拖拽排序 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| input | value | 图片数据变化时触发 |
| onChange | value | 图片数据变化时触发 |

## 尺寸规格

- **small**: 64px × 64px
- **normal**: 80px × 80px
- **large**: 100px × 100px

## 使用示例

### 单张图片选择
```vue
<template>
  <div>
    <SpImagePicker
      v-model="singleImage"
      :max="1"
      size="normal"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      singleImage: ''
    }
  }
}
</script>
```

### 多张图片选择
```vue
<template>
  <div>
    <SpImagePicker
      v-model="multipleImages"
      :max="5"
      size="small"
      :drag="true"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleImages: []
    }
  }
}
</script>
```

### 在 SpForm 中使用
```javascript
formList: [
  {
    label: '商品图片',
    key: 'images',
    type: 'input',
    required: true,
    component: ({ key }, value) => {
      return (
        <div>
          <SpImagePicker
            v-model={value[key]}
            max={9}
            size="small"
            drag
          />
        </div>
      )
    }
  }
]
```

## 功能特性

1. **图片上传**: 支持点击上传新图片
2. **图片预览**: 点击图片可预览大图
3. **图片删除**: 支持删除已选择的图片
4. **图片替换**: 支持替换已选择的图片
5. **拖拽排序**: 支持多张图片的拖拽排序
6. **尺寸控制**: 支持不同尺寸的图片显示
7. **数量限制**: 支持设置最大选择数量

## 注意事项

1. 组件依赖 `@shopex-ui/finder` 的图片选择器
2. 需要配置相应的图片上传接口
3. 图片数据格式需要与后端接口保持一致
4. 建议在生产环境中添加图片格式和大小限制
