# useForm 动态表单组件使用手册

## 概述

`useForm` 是一个基于 Vue 2 的 composable 函数，用于动态创建和管理表单组件。它基于 `sp-form-plus` 组件构建，提供了更高级的抽象层和丰富的 API，使表单的创建、验证和管理更加简单。

## 核心特性

- **动态表单创建**：通过配置对象动态生成表单组件
- **丰富的 API**：提供表单验证、重置、字段操作等完整功能
- **响应式数据**：支持动态更新表单配置和数据
- **类型安全**：提供完整的方法调用接口
- **易于集成**：可以在任何 Vue 组件中使用

## 基本用法

### 引入和使用

```javascript
import { useForm } from '@/composables/useForm'

export default {
  name: 'MyComponent',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        status: 1
      }
    }
  },
  created() {
    this.setupForm()
  },
  methods: {
    setupForm() {
      const [FormComponent, FormApi] = useForm({
        formType: 'normalForm',
        labelWidth: '120px',
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
      })

      // 保存组件和 API 引用
      this.FormComponent = FormComponent
      this.FormApi = FormApi
    }
  }
}
```

### 在模板中使用

```vue
<template>
  <div>
    <FormComponent
      ref="dynamicForm"
      :value="formData"
      @submit="handleSubmit"
      @reset="handleReset"
    />

    <!-- 或者使用 render 函数 -->
    <component
      :is="FormComponent"
      :value="formData"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleSubmit(formData) {
      console.log('表单提交:', formData)
    },

    handleReset() {
      console.log('表单重置')
    }
  }
}
</script>
```

## API 文档

### useForm(options)

创建动态表单组件和 API 对象。

#### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | Object | `{}` | 表单配置选项 |

#### Options 配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `colon` | Boolean | `false` | 是否在 label 后添加冒号 |
| `formItems` | Array | `[]` | 表单项配置数组 |
| `formType` | String | `'search-form'` | 表单类型 |
| `inline` | Boolean | `false` | 是否内联显示 |
| `labelWidth` | String | `'120px'` | 标签宽度 |
| `rules` | Object | `{}` | 校验规则 |
| `showDefaultActions` | Boolean | `true` | 是否显示默认操作按钮 |

#### 返回值

返回一个数组 `[FormComponent, FormApi]`：

- `FormComponent`: 动态创建的表单组件
- `FormApi`: 表单操作 API 对象

### FormApi 方法

#### validate()

验证表单数据。

```javascript
try {
  const formData = await FormApi.validate()
  console.log('验证成功:', formData)
} catch (error) {
  console.log('验证失败:', error)
}
```

#### resetFields()

重置表单字段。

```javascript
FormApi.resetFields()
```

#### clearValidate(props)

清除验证状态。

```javascript
// 清除所有验证
FormApi.clearValidate()

// 清除指定字段验证
FormApi.clearValidate(['name', 'email'])
```

**参数：**
- `props` (Array, optional): 要清除验证的字段名数组

#### setFieldsValue(values)

设置表单字段值。

```javascript
FormApi.setFieldsValue({
  name: '张三',
  email: 'zhangsan@example.com',
  status: 1
})
```

**参数：**
- `values` (Object): 要设置的字段值对象

#### getFieldsValue(fields)

获取表单字段值。

```javascript
// 获取所有字段值
const allValues = FormApi.getFieldsValue()

// 获取指定字段值
const specificValues = FormApi.getFieldsValue(['name', 'email'])
```

**参数：**
- `fields` (Array, optional): 要获取的字段名数组

**返回值：**
- 如果指定 `fields`，返回包含指定字段的对象
- 如果不指定，返回所有字段的对象

#### setFields(fields)

设置表单字段验证状态。

```javascript
FormApi.setFields({
  name: {
    value: '新值',
    errors: ['姓名不能为空']
  },
  email: {
    value: 'invalid-email',
    errors: ['邮箱格式不正确']
  }
})
```

**参数：**
- `fields` (Object): 字段配置对象

#### setFieldComponentProps(fieldName, props)

设置字段组件属性。

```javascript
// 动态更新字段组件属性
FormApi.setFieldComponentProps('status', {
  options: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
    { label: '暂停', value: 2 }
  ]
})
```

**参数：**
- `fieldName` (String): 字段名
- `props` (Object): 要更新的组件属性

## 完整示例

### 基础表单示例

```vue
<template>
  <div class="form-container">
    <h2>用户信息表单</h2>

    <component
      :is="FormComponent"
      :value="formData"
      @submit="handleSubmit"
      @reset="handleReset"
    />

    <div class="form-actions">
      <el-button @click="handleValidate">验证表单</el-button>
      <el-button @click="handleSetValues">设置值</el-button>
      <el-button @click="handleGetValues">获取值</el-button>
      <el-button @click="handleClearValidate">清除验证</el-button>
    </div>
  </div>
</template>

<script>
import { useForm } from '@/composables/useForm'

export default {
  name: 'UserForm',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        gender: '',
        hobbies: [],
        birthDate: '',
        address: ''
      },
      FormComponent: null,
      FormApi: null
    }
  },

  created() {
    this.initForm()
  },

  methods: {
    initForm() {
      const [FormComponent, FormApi] = useForm({
        formType: 'normalForm',
        labelWidth: '100px',
        colon: true,
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
            fieldName: 'phone',
            label: '手机号',
            component: 'input',
            componentProps: {
              placeholder: '请输入手机号'
            },
            rules: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
            ]
          },
          {
            fieldName: 'gender',
            label: '性别',
            component: 'radio',
            componentProps: {
              options: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' }
              ]
            },
            rules: [
              { required: true, message: '请选择性别', trigger: 'change' }
            ]
          },
          {
            fieldName: 'hobbies',
            label: '爱好',
            component: 'checkbox',
            componentProps: {
              options: [
                { label: '读书', value: 'reading' },
                { label: '运动', value: 'sports' },
                { label: '音乐', value: 'music' },
                { label: '旅游', value: 'travel' }
              ]
            }
          },
          {
            fieldName: 'birthDate',
            label: '出生日期',
            component: 'datetimepicker',
            componentProps: {
              type: 'date',
              placeholder: '请选择出生日期'
            }
          },
          {
            fieldName: 'address',
            label: '地址',
            component: 'input',
            componentProps: {
              type: 'textarea',
              placeholder: '请输入详细地址',
              rows: 3
            }
          }
        ]
      })

      this.FormComponent = FormComponent
      this.FormApi = FormApi
    },

    async handleSubmit(formData) {
      console.log('表单提交:', formData)

      try {
        // 模拟 API 调用
        await this.submitUserInfo(formData)
        this.$message.success('提交成功')
      } catch (error) {
        this.$message.error('提交失败')
      }
    },

    handleReset() {
      console.log('表单重置')
      this.FormApi.resetFields()
    },

    async handleValidate() {
      try {
        const formData = await this.FormApi.validate()
        console.log('验证成功:', formData)
        this.$message.success('验证通过')
      } catch (error) {
        console.log('验证失败:', error)
        this.$message.error('验证失败')
      }
    },

    handleSetValues() {
      this.FormApi.setFieldsValue({
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        gender: 'male',
        hobbies: ['reading', 'sports']
      })
    },

    handleGetValues() {
      const values = this.FormApi.getFieldsValue()
      console.log('当前表单值:', values)
      this.$message.info('请查看控制台输出')
    },

    handleClearValidate() {
      this.FormApi.clearValidate()
      this.$message.info('验证状态已清除')
    },

    async submitUserInfo(data) {
      // 模拟 API 调用
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true })
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}

.form-actions .el-button {
  margin: 0 10px;
}
</style>
```

### 动态表单示例

```vue
<template>
  <div class="dynamic-form-container">
    <h2>动态表单示例</h2>

    <div class="form-controls">
      <el-button @click="addField">添加字段</el-button>
      <el-button @click="removeField">删除字段</el-button>
      <el-button @click="updateFieldProps">更新字段属性</el-button>
    </div>

    <component
      :is="FormComponent"
      :value="formData"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { useForm } from '@/composables/useForm'

export default {
  name: 'DynamicForm',
  data() {
    return {
      formData: {},
      FormComponent: null,
      FormApi: null,
      formItems: []
    }
  },

  created() {
    this.initForm()
  },

  methods: {
    initForm() {
      this.formItems = [
        {
          fieldName: 'name',
          label: '姓名',
          component: 'input',
          componentProps: {
            placeholder: '请输入姓名'
          }
        },
        {
          fieldName: 'email',
          label: '邮箱',
          component: 'input',
          componentProps: {
            placeholder: '请输入邮箱'
          }
        }
      ]

      const [FormComponent, FormApi] = useForm({
        formType: 'normalForm',
        labelWidth: '100px',
        formItems: this.formItems
      })

      this.FormComponent = FormComponent
      this.FormApi = FormApi
    },

    addField() {
      const newField = {
        fieldName: 'phone',
        label: '手机号',
        component: 'input',
        componentProps: {
          placeholder: '请输入手机号'
        }
      }

      this.formItems.push(newField)
      this.recreateForm()
    },

    removeField() {
      if (this.formItems.length > 1) {
        this.formItems.pop()
        this.recreateForm()
      }
    },

    updateFieldProps() {
      // 更新邮箱字段为选择框
      this.FormApi.setFieldComponentProps('email', {
        component: 'select',
        options: [
          { label: 'Gmail', value: 'gmail.com' },
          { label: 'QQ邮箱', value: 'qq.com' },
          { label: '163邮箱', value: '163.com' }
        ]
      })
    },

    recreateForm() {
      const [FormComponent, FormApi] = useForm({
        formType: 'normalForm',
        labelWidth: '100px',
        formItems: this.formItems
      })

      this.FormComponent = FormComponent
      this.FormApi = FormApi
    },

    handleSubmit(formData) {
      console.log('动态表单提交:', formData)
    }
  }
}
</script>

<style scoped>
.dynamic-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-controls {
  margin-bottom: 20px;
}

.form-controls .el-button {
  margin-right: 10px;
}
</style>
```

### 搜索表单示例

```vue
<template>
  <div class="search-form-container">
    <h2>搜索表单示例</h2>

    <component
      :is="SearchFormComponent"
      :value="searchData"
      @submit="handleSearch"
      @reset="handleReset"
    />

    <div class="search-results">
      <h3>搜索结果</h3>
      <pre>{{ JSON.stringify(searchResults, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { useForm } from '@/composables/useForm'

export default {
  name: 'SearchForm',
  data() {
    return {
      searchData: {},
      searchResults: null,
      SearchFormComponent: null,
      SearchFormApi: null
    }
  },

  created() {
    this.initSearchForm()
  },

  methods: {
    initSearchForm() {
      const [SearchFormComponent, SearchFormApi] = useForm({
        formType: 'search-form',
        labelWidth: '80px',
        inline: true,
        formItems: [
          {
            fieldName: 'keyword',
            label: '关键词',
            component: 'input',
            componentProps: {
              placeholder: '请输入关键词'
            }
          },
          {
            fieldName: 'category',
            label: '分类',
            component: 'select',
            componentProps: {
              placeholder: '请选择分类',
              options: [
                { label: '全部', value: '' },
                { label: '商品', value: 'product' },
                { label: '文章', value: 'article' },
                { label: '用户', value: 'user' }
              ]
            }
          },
          {
            fieldName: 'status',
            label: '状态',
            component: 'select',
            componentProps: {
              placeholder: '请选择状态',
              options: [
                { label: '全部', value: '' },
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 }
              ]
            }
          },
          {
            fieldName: 'dateRange',
            label: '时间范围',
            component: 'datetimepicker',
            componentProps: {
              type: 'daterange',
              placeholder: '请选择时间范围'
            }
          }
        ]
      })

      this.SearchFormComponent = SearchFormComponent
      this.SearchFormApi = SearchFormApi
    },

    async handleSearch(searchData) {
      console.log('搜索条件:', searchData)

      try {
        // 模拟搜索 API
        const results = await this.performSearch(searchData)
        this.searchResults = results
      } catch (error) {
        console.error('搜索失败:', error)
        this.$message.error('搜索失败')
      }
    },

    handleReset() {
      this.searchResults = null
      this.SearchFormApi.resetFields()
    },

    async performSearch(params) {
      // 模拟 API 调用
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            total: 100,
            data: [
              { id: 1, name: '商品1', category: 'product', status: 1 },
              { id: 2, name: '文章1', category: 'article', status: 1 },
              { id: 3, name: '用户1', category: 'user', status: 0 }
            ]
          })
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>
.search-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-results {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.search-results pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
```

## 最佳实践

### 1. 表单配置管理

```javascript
// 推荐：将表单配置提取为单独的文件
// forms/userForm.js
export const userFormConfig = {
  formType: 'normalForm',
  labelWidth: '100px',
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
    }
    // ... 其他字段
  ]
}

// 在组件中使用
import { userFormConfig } from '@/forms/userForm'

export default {
  created() {
    const [FormComponent, FormApi] = useForm(userFormConfig)
    this.FormComponent = FormComponent
    this.FormApi = FormApi
  }
}
```

### 2. 错误处理

```javascript
// 推荐：统一错误处理
methods: {
  async handleSubmit(formData) {
    try {
      await this.FormApi.validate()
      await this.submitData(formData)
      this.$message.success('提交成功')
    } catch (error) {
      if (error.response) {
        // API 错误
        this.$message.error(error.response.data.message)
      } else {
        // 验证错误
        this.$message.error('请检查表单输入')
      }
    }
  }
}
```

### 3. 性能优化

```javascript
// 推荐：避免频繁重新创建表单
export default {
  data() {
    return {
      formInstance: null
    }
  },

  created() {
    if (!this.formInstance) {
      this.formInstance = useForm(config)
    }
  }
}
```

### 4. 类型定义

```javascript
// 推荐：使用 JSDoc 提供类型提示
/**
 * @typedef {Object} FormConfig
 * @property {string} formType - 表单类型
 * @property {string} labelWidth - 标签宽度
 * @property {Array} formItems - 表单项配置
 */

/**
 * 创建用户表单
 * @param {FormConfig} config - 表单配置
 * @returns {Array} [FormComponent, FormApi]
 */
function createUserForm(config) {
  return useForm(config)
}
```

## 常见问题

### Q: 如何动态添加/删除表单字段？

A: 可以通过重新创建表单实例或使用 `setFieldComponentProps` 方法：

```javascript
// 方法1：重新创建表单
addField() {
  this.formItems.push(newField)
  const [FormComponent, FormApi] = useForm({
    formItems: this.formItems
  })
  this.FormComponent = FormComponent
  this.FormApi = FormApi
}

// 方法2：使用 setFieldComponentProps
updateField() {
  this.FormApi.setFieldComponentProps('fieldName', newProps)
}
```

### Q: 如何处理表单联动？

A: 可以在表单组件的 `@field-change` 事件中处理联动逻辑：

```javascript
handleFieldChange({ fieldName, value }) {
  if (fieldName === 'category') {
    // 根据分类更新子分类选项
    this.FormApi.setFieldComponentProps('subCategory', {
      options: this.getSubCategories(value)
    })
  }
}
```

### Q: 如何自定义验证规则？

A: 在 `formItems` 配置中添加自定义验证器：

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

### Q: 如何处理异步验证？

A: 在自定义验证器中使用 Promise：

```javascript
{
  fieldName: 'username',
  label: '用户名',
  component: 'input',
  rules: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'))
        } else {
          // 异步验证用户名是否存在
          this.checkUsername(value).then(exists => {
            if (exists) {
              callback(new Error('用户名已存在'))
            } else {
              callback()
            }
          })
        }
      },
      trigger: 'blur'
    }
  ]
}
```

### Q: 如何获取表单引用？

A: 可以通过 `FormApi` 直接操作表单，或者在组件上添加 `ref`：

```javascript
// 方法1：使用 FormApi
this.FormApi.validate()

// 方法2：使用 ref
<component :is="FormComponent" ref="myForm" />
this.$refs.myForm.validate()
```

## 注意事项

1. **内存管理**：避免频繁重新创建表单实例，可能导致内存泄漏
2. **响应式数据**：确保表单数据是响应式的，使用 `Vue.set` 或 `this.$set`
3. **验证时机**：合理设置验证触发时机（blur、change 等）
4. **性能考虑**：对于大型表单，考虑使用虚拟滚动或分页
5. **浏览器兼容性**：确保所使用的组件在目标浏览器中正常工作

## 总结

`useForm` 提供了一种声明式的方式来创建和管理表单，通过配置对象即可快速构建功能完整的表单。它封装了常见的表单操作，提供了丰富的 API，使得表单开发更加高效和一致。

合理使用 `useForm` 可以显著提升开发效率，减少重复代码，并确保表单功能的一致性和可维护性。
