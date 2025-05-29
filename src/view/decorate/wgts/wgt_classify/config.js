import { pickBy } from '@/utils'
import CompInner from '../../comps/comp_inner.vue';
import CompStyle from '../../comps/comp_style.vue';
import CompOuter from '../../comps/comp_outer.vue';
import Attrdata from './attr_data.vue';

export default {
    name: 'classify',
    setting: [{
        label: "埋点上报参数",
        key: "track",
        component: "input",
        value: "",
    },
    {
        label: "展示形式",
        key: "animate",
        component: "radiobutton",
        options: [
            { name: "横向排列", label: "horizontal" },
            { name: "纵向排列", label: "vertical" },
        ],
        value: "vertical",
        module: "",
    }, {
        label: "数据类型",
        key: "dataType",
        component: "select",
        options: [
            { label: '按管理分类', value: 'manage' },
            { label: '按销售分类', value: 'sales' },
        ],
        value: "manage",
        onchange: function (v, self) {
            self.value.data = null
        }
    }, {
        label: "数据设置",
        key: "data",
        component: function (h, { key }) {
            return (
                <Attrdata
                    v-model={this.value[key]}
                    dataType={this.value.dataType}
                />
            );
        },
        value: {
            type: 'select',
            category: {
                category_id: '',
            },
            data: []
        },
    }, {
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
    transformIn: (v, wgtList) => {
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
    transformOut: (v, wgtList) => {
        return pickBy(v, {
            name: 'name',
            base: (v) => {
                return pickBy(v, {
                    track: 'track',
                    animate: 'animate',
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
