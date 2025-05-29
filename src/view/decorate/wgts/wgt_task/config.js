import { pickBy } from '@/utils'
import CompInner from '../../comps/comp_inner.vue';
import CompStyle from '../../comps/comp_style.vue';
import CompOuter from '../../comps/comp_outer.vue';
import CompBtn from '../../comps/comp_btn.vue';

export default {
    name: 'task',
    setting: [
        {
            label: "埋点上报参数",
            key: "track",
            component: "input",
            value: "",
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
                paddedb: 0,
                paddedl: 12,
                paddedr: 12,
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
            value: { type: 'gradient', color: '#FFF', startColor: '#FFF1CE', endColor: '#FFFFFF' }
        },
        // 

        {
            label: '组件标题',
            key: 'titleText',
            component: 'input',
            placeholder: '请输入标题',
            value: '热销榜单'
        },
        {
            label: '标题颜色',
            key: 'titleColor',
            component: 'color',
            value: '#CB9800'
        },
        {
            label: '更多颜色',
            key: 'moreColor',
            component: 'color',
            value: '#CB9800'
        },
        {
            label: '任务按钮',
            key: 'taskBtn',
            component: function (h, { key }) {
                return <CompBtn v-model={this.value[key]} />
            },
            value: {
                color: '#404040',
                textColor: '#ffffff',
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
                    outerBackground: 'outerBackground', // 组件外背景
                    innerBackground: 'innerBackground', // 组件内背景
                    titleText: 'titleText', // 组件标题
                    titleColor: 'titleColor', // 标题颜色
                    moreColor: 'moreColor', // 更多颜色
                    taskBtn: 'taskBtn', // 任务按钮
                })
            },
        })
    }
}