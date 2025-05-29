import { pickBy } from '@/utils'
import CompInner from '../../comps/comp_inner.vue';
import CompStyle from '../../comps/comp_style.vue';
import CompOuter from '../../comps/comp_outer.vue';
import CompBtn from '../../comps/comp_btn.vue';

export default {
    name: 'signIn',
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
            value: { type: 'solid', color: '#FFF', startColor: '', endColor: '' }
        },
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
            value: '#1A1A1A'
        },
        {
            label: '订阅按钮',
            key: 'subscribeBtn',
            component: function (h, { key }) {
                return <CompBtn v-model={this.value[key]} showImage={false} />
            },
            value: {
                color: '#EED277',
                textColor: '#ffffff',
                image: ''
            }
        },
        {
            label: '签到按钮',
            key: 'signInBtn',
            component: function (h, { key }) {
                return <CompBtn v-model={this.value[key]} />
            },
            value: {
                color: '#000000',
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
                    subscribeBtn: 'subscribeBtn', // 订阅按钮
                    signInBtn: 'signInBtn', // 签到按钮
                })
            },
        })
    }
}