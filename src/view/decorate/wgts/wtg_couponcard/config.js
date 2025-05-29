import { pickBy } from '@/utils'
import CompInner from '../../comps/comp_inner.vue';
import CompStyle from '../../comps/comp_style.vue';
import CompOuter from '../../comps/comp_outer.vue';
import CompBtn from '../../comps/comp_btn.vue';
import AttrData from './attr-data.vue';

export default {
    name: 'couponCard',
    setting: [
        {
            label: "埋点上报参数",
            key: "track",
            component: "input",
            value: "",
        },{
            label: '数据设置',
            key: 'data',
            component: function (h, { key }) {
                return <AttrData v-model={this.value[key]} />
            },
            value: []
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
                    />
                );
            },
            value: {
                paddedt: 0,
                paddedb: 14,
                paddedl: 12,
                paddedr: 12,
            },
        },
       
        {
            label: '组件内边距',
            key: 'innerMargin',
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
                paddedt: 0,
                paddedb: 0,
                paddedl: 0,
                paddedr: 0,
            },
        },
        {
            label: '组件外背景',
            key: 'outerBackground',
            component: function (h, { key }) {
                return <CompOuter v-model={this.value[key]} />
            },
           value: { color: '', image: '' }

        },
        {
            label: '组件内背景',
            key: 'innerBackground',
            component: function (h, { key }) {
                return <CompInner v-model={this.value[key]} />
            },
            value: { type: 'solid', color: '', startColor: '', endColor: '' }
        },
        {
            label: '面额颜色',
            key: 'amountColor',
            component: 'color',
            value: '#D4003B'
        },
        {
            label: '领取按钮',
            key: 'receiveBtn',
            component: function (h, { key }) {
                return <CompBtn v-model={this.value[key]} showImage={false} />
            },
            value: {
                color: '#000000',
                textColor: '#fff',
                image: ''
            }
        }
    ],
    transformIn: (v) => {
        return {
            name: v.name,
            ...v.base,
            data: v.data
        }
    },
    transformOut: (v) => {
        return pickBy(v, {
            name: 'name',
            base: (v) => {
                return pickBy(v, {
                    track: 'track', // 埋点上报参数
                    outerMargin: 'outerMargin', // 组件外边距
                    innerMargin: 'innerMargin', // 组件内边距
                    outerBackground: 'outerBackground', // 组件外背景
                    innerBackground: 'innerBackground', // 组件内背景
                    amountColor: 'amountColor', // 面额颜色
                    receiveBtn: 'receiveBtn', // 领取按钮
                })
            },
            data: 'data'
        })
    }
}