import { pickBy } from '@/utils'
import AttrStore from './attr-store'
import CompInner from '../../comps/comp_inner.vue';
import CompStyle from '../../comps/comp_style.vue';
import CompOuter from '../../comps/comp_outer.vue';

export default {
  name: 'shop',
  setting: [
    { 
      label: '展示形式', 
      key: 'displayType', 
      component: 'radiobutton', 
      options: [
        { name: '横向排列', label: 'horizontal' },
        { name: '字母索引表', label: 'alphabet' }
      ],
      value: 'horizontal' ,
      tips: '切换到字母索引表模式,将无法使用其它挂件',
      onchange: function (e,vm) {
        // console.log('e', e)
        // if (e == 'alphabet') {
        //   vm.$confirm('切换到字母索引表模式,将无法使用其它挂件,是否继续？', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     vm.value.displayType = 'alphabet'
        //   }).catch(() => {
        //     vm.value.displayType = 'horizontal'
        //   })
        // }
        vm.value.dataType = e === 'alphabet' ? 'all' : 'specify'
        vm.value.data = []
      },
      isShow: function () {
        const { scene = '' } = this.$route.query
        return scene === '1007'
      },
    },
    { 
      label: '展示形式', 
      key: 'displayType', 
      component: 'radiobutton', 
      options: [
        { name: '横向排列', label: 'horizontal' },
        // { name: '字母索引表', label: 'alphabet' }
      ],
      value: 'horizontal' ,
      onchange: function (e,vm) {
        vm.value.dataType = e === 'alphabet' ? 'all' : 'specify'
        vm.value.data = []
      },
      isShow: function () {
        const { scene = '' } = this.$route.query
        return scene !== '1007'
      },
    },
    { 
      label: '数据类型', 
      key: 'dataType', 
      component: 'select', 
      options: [
        // { label: '所有店铺', value: 'all' },
        { label: '指定店铺', value: 'specify' }
      ],
      value: 'specify' ,
      isShow: function () {
        return this.value.displayType === 'horizontal'
      },
      onchange: function (e,vm) {
        vm.value.data = []
      }
    },
    { 
      label: '数据类型', 
      key: 'dataType', 
      component: 'select', 
      options: [
        { label: '所有店铺', value: 'all' },
        { label: '指定店铺', value: 'specify' }
      ],
      value: 'specify' ,
      isShow: function () {
        return this.value.displayType === 'alphabet'
      },
      onchange: function (e,vm) {
        vm.value.data = []
      }
    },
    
    {
      label: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrStore
            v-model={this.value[key]}
            on-change={() => {
              if (this.value[key].id === '') {
                this.value['items'] = []
                this.value['tags'] = []
              }
            }}
          />
        )
      },
      value: [],
      isShow: function () {
        return this.value.dataType === 'specify'
      }
    },
    {
      label: '组件外边距',
      key: 'outerMargin',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
            showLeft={false}
            showRight={false}
          />
        );
      },
      value: {
        paddedt: 10,
        paddedb: 10,
      },
    }, 
    {
      label: '组件内边距',
      key: 'innerPadding',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
          />
        );
      },
      value: {
        paddedt: 10,
        paddedb: 10,
        paddedl: 10,
        paddedr: 10,
      },
    },
    {
      label: '组件外背景',
      key: 'outerBackground',
      component: function (h, { key }) {
        return (
          <CompOuter
            v-model={this.value[key]}
            uuid={this.value.uuid}
          />
        );
      },
      value: { color: '#f8f8f8', image: '' }
    },
    {
      label: '组件内背景',
      key: 'innerBackground',
      component: function (h, { key }) {
        return (
          <CompInner
            v-model={this.value[key]}
            uuid={this.value.uuid}
          />
        );
      },
      value: { type: 'solid', color: '#ffffff', startColor: '#ffffff', endColor: '#ffffff' }
    },
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      data
    } = v
    return {
      name,
      ...base,
      data: data,
      
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          displayType: 'displayType',
          dataType: 'dataType',
          outerMargin: 'outerMargin',
          innerPadding: 'innerPadding',
          outerBackground: 'outerBackground',
          innerBackground: 'innerBackground',
        })
      },
      data: 'data'
    })
  }
}
