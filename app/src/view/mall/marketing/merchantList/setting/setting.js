import { createSetting } from '@shopex/finder'
import { Divider, Message, MessageBox } from 'element-ui'
export default (vm) => {
  const formatDate = (timestamp) => {
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }
  return createSetting({
    search: [
      { key: 'merchant_name', name: '商户名称' },
      { key: 'legal_name', name: '联系人' },
      { key: 'legal_mobile', name: '联系电话' },
      { key: 'test', name: '入驻时间', slot: 'date' },
    ],
    columns: [
      { name: '商户名称', key: 'merchant_name' },
      { name: '联系人', key: 'legal_name' },
      { name: '联系电话', key: 'legal_mobile' },
      { name: '入驻时间', key: 'settled_succ_sendsms' },
      {
        name: "商品审核（商户商家商品是否需通过平台审核）",
        key: "audit_goods",
        // showType: "text",
        // componentProps: {
        //   inactiveValue: false,
        //   activeValue: true,
        //   handler(val, row) {
        //     console.log(val);
        //     console.log(row);
        //   },
        //   // onChange:(v,row)=>{
        //   //   console.log(v);
        //   //   console.log(row);

        //   // }


        // },
        render: (h, {row}) =>
          h(
            'el-button',
            {
              class:'yahh',
              props: { type: 'text' },
              on: { click: () => { console.log(row) } },

            },
            [h('span',{class:'aaa'},row.audit_goods? '是':'否'),h('i',{class:'el-icon-question'},'')]
        
        ),

        renderHeader() {
          return (
            <div>
              <span>商品审核 </span>
              <el-tooltip class="item" effect="light" content="商户商家商品是否需通过平台审核" placement="top-start">
                {/* <span slot='content'>
                      商户商家商品是否<br/>需通过平台审核
                      </span> */}
                <i class='el-icon-question'></i>
              </el-tooltip></div>)
        }
      }
    ],
    actions: [
      {
        name: '详情',
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async val => {
            console.log(val[0].log_id);
            const result = await vm.$api.adapay.logDetail(val[0].log_id);
            vm.result = result.data.data.result;
            vm.params = result.data.data.params;
            vm.visible = true;
          }
        }
      }
    ],
  })
}
