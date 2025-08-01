# SP-Form-Plus 组件使用手册

## 概述

`sp-form-plus` 是一个基于 Element UI 的增强版表单组件，提供了更灵活的配置方式和更丰富的功能。支持多种表单类型（普通表单、搜索表单）和多种字段组件。

## 基本用法

### 引入组件

```javascript
import SpFormPlus from '@/components/sp-form-plus'

export default {
  components: {
    SpFormPlus
  }
}
```

### 基础示例

```vue
<template>
  <SpFormPlus
    :form-items="formItems"
    :value="formData"
    @submit="handleSubmit"
    @field-change="handleFieldChange"
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        status: ''
      },
      formItems: [
        {
          fieldName: 'name',
          label: '姓名',
          component: 'input',
          componentProps: {
            placeholder: '请输入姓名'
          },
          rules: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        {
          fieldName: 'email',
          label: '邮箱',
          component: 'input',
          componentProps: {
            placeholder: '请输入邮箱'
          },
          rules: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
          ]
        },
        {
          fieldName: 'status',
          label: '状态',
          component: 'select',
          componentProps: {
            options: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 }
            ]
          }
        }
      ]
    }
  },
  methods: {
    handleSubmit(formData) {
      console.log('表单提交:', formData)
    },
    handleFieldChange({ fieldName, value }) {
      console.log('字段变化:', fieldName, value)
      this.formData[fieldName] = value
    }
  }
}
</script>
```

## API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `colon` | Boolean | `false` | 是否在 label 后添加冒号 |
| `formType` | String | `'searchForm'` | 表单类型，可选值：`'searchForm'`、`'normalForm'` |
| `formItems` | Array | `[]` | 表单项配置数组 |
| `formApi` | Object | `{}` | 表单 API 配置 |
| `inline` | Boolean | `false` | 是否内联显示 |
| `labelWidth` | String | `'160px'` | 标签宽度 |
| `layout` | String | `'horizontal'` | 布局方式 |
| `showDefaultActions` | Boolean | `true` | 是否显示默认操作按钮 |
| `value` | Object | `{}` | 表单数据 |

### Form Item 配置

每个表单项支持以下配置：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fieldName` | String | - | 字段名（必填） |
| `label` | String | `''` | 标签文字 |
| `component` | String/Function | `'input'` | 组件类型或自定义组件 |
| `componentProps` | Object | `{}` | 组件属性 |
| `rules` | Array | `[]` | 验证规则 |
| `value` | Any | `''` | 默认值 |
| `formItemClass` | String | `''` | 表单项样式类名 |
| `isShow` | Function | - | 是否显示的判断函数 |
| `tip` | String | `''` | 提示文字 |

### 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `submit` | 表单提交时触发 | `(formData)` |
| `field-change` | 字段值变化时触发 | `({ fieldName, value })` |
| `reset` | 表单重置时触发 | - |

### 方法

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|-------|
| `validate` | 验证表单 | - | `Promise<formData>` |
| `resetField` | 重置指定字段 | `(field)` | - |
| `clearValidate` | 清除验证 | `(props)` | - |

## 支持的字段类型

### 1. Input 输入框

```javascript
{
  fieldName: 'username',
  label: '用户名',
  component: 'input',
  componentProps: {
    placeholder: '请输入用户名',
    maxlength: 50,
    showWordLimit: true
  }
}
```

### 2. Select 选择框

```javascript
{
  fieldName: 'category',
  label: '分类',
  component: 'select',
  componentProps: {
    options: [
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2, disabled: true }
    ],
    multiple: false,
    clearable: true
  }
}
```

### 3. Radio 单选框

```javascript
{
  fieldName: 'gender',
  label: '性别',
  component: 'radio',
  componentProps: {
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  }
}
```

### 4. Checkbox 复选框

```javascript
{
  fieldName: 'hobbies',
  label: '爱好',
  component: 'checkbox',
  componentProps: {
    options: [
      { label: '读书', value: 'reading' },
      { label: '运动', value: 'sports' },
      { label: '音乐', value: 'music' }
    ]
  }
}
```

### 5. DateTimePicker 日期时间选择器

```javascript
{
  fieldName: 'dateRange',
  label: '时间范围',
  component: 'datetimepicker',
  componentProps: {
    type: 'datetimerange'
  }
}
```

### 6. ImagePicker 图片选择器

```javascript
{
  fieldName: 'avatar',
  label: '头像',
  component: 'imagepicker',
  componentProps: {
    multiple: false,
    limit: 1
  }
}
```

### 7. Button 按钮

```javascript
{
  fieldName: 'action',
  label: '操作',
  component: 'button',
  componentProps: {
    text: '点击操作',
    type: 'primary',
    onClick: (event) => {
      console.log('按钮点击')
    }
  }
}
```

### 8. 自定义组件

```javascript
{
  fieldName: 'custom',
  label: '自定义字段',
  component: ({ value, props, onInput, h, formData }) => {
    return h('div', [
      h('span', '当前值：' + value),
      h('button', {
        on: {
          click: () => onInput('新值')
        }
      }, '更改')
    ])
  }
}
```

## 表单类型

### 搜索表单

```vue
<template>
  <SpFormPlus
    form-type="searchForm"
    :form-items="searchFormItems"
    :value="searchData"
    @submit="handleSearch"
    @reset="handleReset"
  />
</template>

<script>
export default {
  data() {
    return {
      searchData: {},
      searchFormItems: [
        {
          fieldName: 'keyword',
          label: '关键词',
          component: 'input',
          componentProps: {
            placeholder: '请输入关键词'
          }
        },
        {
          fieldName: 'status',
          label: '状态',
          component: 'select',
          componentProps: {
            options: [
              { label: '全部', value: '' },
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 }
            ]
          }
        }
      ]
    }
  },
  methods: {
    handleSearch(formData) {
      console.log('搜索:', formData)
    },
    handleReset() {
      console.log('重置搜索')
    }
  }
}
</script>
```

### 普通表单

```vue
<template>
  <SpFormPlus
    form-type="normalForm"
    :form-items="formItems"
    :value="formData"
    label-width="120px"
    @submit="handleSubmit"
  />
</template>
```

## 表单验证

### 基本验证

```javascript
{
  fieldName: 'email',
  label: '邮箱',
  component: 'input',
  rules: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}
```

### 自定义验证

```javascript
{
  fieldName: 'phone',
  label: '手机号',
  component: 'input',
  rules: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
```

## 条件显示

```javascript
{
  fieldName: 'reason',
  label: '原因',
  component: 'input',
  isShow: (value) => {
    // 只有当状态为禁用时才显示
    return this.formData.status === 0
  }
}
```

## 内联表单

```vue
<template>
  <SpFormPlus
    :form-items="formItems"
    :value="formData"
    inline
    @submit="handleSubmit"
  />
</template>
```

## 高级用法

### 动态表单项

```javascript
computed: {
  formItems() {
    const items = [
      {
        fieldName: 'type',
        label: '类型',
        component: 'select',
        componentProps: {
          options: [
            { label: '个人', value: 'personal' },
            { label: '企业', value: 'company' }
          ]
        }
      }
    ]

    if (this.formData.type === 'company') {
      items.push({
        fieldName: 'companyName',
        label: '公司名称',
        component: 'input',
        rules: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ]
      })
    }

    return items
  }
}
```

### 表单联动

```javascript
{
  fieldName: 'province',
  label: '省份',
  component: 'select',
  componentProps: {
    options: this.provinces,
    onChange: (value) => {
      // 清空城市选择
      this.formData.city = ''
      // 加载对应城市数据
      this.loadCities(value)
    }
  }
}
```

## 样式定制

### 自定义样式类

```javascript
{
  fieldName: 'special',
  label: '特殊字段',
  component: 'input',
  formItemClass: 'custom-form-item'
}
```

```css
.custom-form-item {
  .el-form-item__label {
    color: #f56c6c;
    font-weight: bold;
  }
}
```

## 最佳实践

1. **合理使用表单类型**：搜索表单用于筛选，普通表单用于数据录入
2. **统一验证规则**：建议将常用验证规则提取为公共方法
3. **合理设置 labelWidth**：根据实际标签长度调整
4. **善用条件显示**：通过 `isShow` 函数实现动态表单
5. **组件复用**：将常用的表单项配置提取为公共配置
6. **性能优化**：大量表单项时考虑使用 `v-show` 而非 `v-if`

## 常见问题

### Q: 如何获取表单数据？
A: 通过 `@submit` 事件获取，或者通过 `ref` 调用 `validate()` 方法。

### Q: 如何重置表单？
A: 调用组件的 `resetField()` 方法或使用 `@reset` 事件。

### Q: 如何自定义组件？
A: 将 `component` 属性设置为函数，返回 Vue 组件。

### Q: 如何实现表单联动？
A: 在 `componentProps` 中添加事件处理函数，或监听 `@field-change` 事件。

### Q: 如何处理异步验证？
A: 在 `rules` 中使用自定义验证器，支持 Promise 和 callback 两种方式。
