<template>
  <div class="classify">
    <div class="query">
      <el-input style="width:300px" placeholder="请输入内容" v-model="query.name" class="input-with-select" size="small">
        <el-button slot="append" icon="el-icon-search" @click="getConfig"></el-button>
      </el-input>
    </div>
    <el-divider></el-divider>
    <div class="control">
        <el-button plain size='mini' style="margin-right:10px" @click="addClassify">新增分类 </el-button>
        <el-tooltip content="商户类型" placement="top" effect="light">
            <i class="el-icon-question" style="color:#888"></i>
        </el-tooltip>
    </div>
    <div class="list">
        <el-table
            @sort-change='fnSort'
            :loading='loading'
            :data="merchantsClassificationList"
            style="width: 100%;margin-bottom: 20px;" 
            row-key="id" default-expand-all
            :default-sort = "{prop: 'sort', order: 'ascending'}"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="name" label="分类名称"></el-table-column>
            <el-table-column prop="is_show" label="是否可见">
                <template slot-scope="scope">
                    <span>{{scope.row.is_show=='1'?'可见':'不可见'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" sortable='custom'>
                <template slot-scope="scope">
                    <el-input type='number' min='0' :style="{width:'100px'}" v-model="scope.row.sort" @change="callbackConfirm(scope.row,'edit')"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="操作">
                <template slot-scope="scope">
                    <template v-if="scope.row.children">
                        <el-button @click.native.prevent="addRow(scope.row)" type="text" size="small">新增子类</el-button>
                    </template>
                    <el-button @click.native.prevent="editRow(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
    <template v-if="AddClassifyBox.visible">
        <AddClassifyBox 
            :editInfo='editInfo' 
            :visible='AddClassifyBox.visible' :parent_id='AddClassifyBox.parent_id' :parent_name='AddClassifyBox.parent_name' 
            @switchBoxHandle='switchBoxHandle' @callbackConfirm='callbackConfirm'></AddClassifyBox>
    </template>
    
  </div>
</template>

<script>
import { getMerchantsClassification,deleteMerchantsClassification,editMerchantsClassification,addMerchantsClassification } from '@/api/mall/marketing.js'
import AddClassifyBox from '@/components/addClassifyBox'

export default {
    components:{
        AddClassifyBox
    },
    data(){
        return{
            AddClassifyBox:{
                visible:false,
                parent_id:'',
                parent_name:''
            },
            loading:false,
            editInfo:null, //当前编辑数据
            query:{
                name:'',
                sort_order_by:'asc', //按排序字段进行排序 asc:正序 desc:倒序
            },
            merchantsClassificationList:[]
        }
    },
    mounted(){
        this.getConfig();
    },
    methods:{
        async getConfig(){
            this.loading = false
            const result = await getMerchantsClassification(this.query);
            this.loading = true
            console.log(result);
            this.merchantsClassificationList = result.data.data
        },
        addClassify(){
            this.AddClassifyBox.parent_name='';
            this.AddClassifyBox.parent_id='0';
            this.editInfo ={}
            this.switchBoxHandle();
        },
        fnSort({ column, prop, order }){
            if (order=='ascending') {
                this.query.sort_order_by ='asc'
                this.getConfig();
            }else{
                this.query.sort_order_by ='desc'
                this.getConfig();
            }
        },
        addRow(row){
            console.log(row);
            this.editInfo = row;
            this.editInfo.type= 'add'
            console.log(this.merchantsClassificationList);
            this.AddClassifyBox.parent_id = row.id;
            this.AddClassifyBox.parent_name = row.name;
            this.switchBoxHandle();
        },
        editRow(row){
            console.log(row);
            this.editInfo = row;
            this.editInfo.type = 'edit'
            this.AddClassifyBox = {
                visible:true,
                parent_id:row.cur_level,
                parent_name:row.parent_id!='0'?this.queryParent(row.parent_id).name:null
            }
            this.queryParent(row.parent_id)
        },
        // 查找id
        queryParent(id){
            return this.merchantsClassificationList.find((item)=>{
                return item.id == id
            })
        },
        async deleteRow(row){
            const { id  } = row
            this.$confirm('确认删除吗？','', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                }).then(async () => {
                    const result = await deleteMerchantsClassification(id);
                    if (result.data.data.status) {
                        this.$message.success('删除成功')
                        this.getConfig()
                    }
                })
        },
        async callbackConfirm(row,type){
            console.log(row,type);
            console.log(this.editInfo);
            // you row 代表是主页面input 更改 、没有是弹窗更改
            if (type=='edit') {
                 
                const {name,sort,is_show} =row
                const result = await editMerchantsClassification( row.id || this.editInfo && this.editInfo.id,{name,sort,is_show});
                console.log(result);
                if (result.data.data.status) {
                    this.$message.success('编辑成功')
                    this.switchBoxHandle(true);
                    this.getConfig();
                }
            }else{
                const {name,sort,is_show,parent_id} =row
                const result = await addMerchantsClassification({name,sort,is_show,parent_id});
                if (result.data.data.status) {
                    this.$message.success('添加成功')
                    this.switchBoxHandle(true);
                    this.getConfig();
                }
            }

        },
        switchBoxHandle(status){
            if (status) {
                this.AddClassifyBox.visible = false
            }else{
                 this.AddClassifyBox.visible = true;
            }
           
        }
    }
}
</script>

<style lang="scss" scoped>
.classify{
    .list{
        margin-top: 10px;
    }
}
</style>