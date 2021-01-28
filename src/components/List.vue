<template>
    <div class="list-container list-container-room">
        <div class="list-title">
            <div class="list-title-head left">{{title}}</div>
            <div class="list-title-count left">共 {{localData.length}} 条</div>
            <a class="btn btn-asyn right" @click="asyn">刷新</a>
        </div>
        <div class="list-header">
            <a class="list-cell" v-for="(column,index) in localColumns" :style="{width:column.width}" @click="onTapHead(index)">{{column.title}}</a>
        </div>
        <div class="list">
            <a class="list-item" :class="{'select':item.select}" :data-id="item.id" v-for="(item,index) in localData" @click="onTapListItem($event)">
                <div class="list-cell" v-for="(column,index) in localColumns"  :style="{width:column.width}">{{column.format?column.format(item[column.name]):item[column.name]}}</div>
            </a>
        </div>
    </div>
</template>
<script>
import { query, r, bulbsort, getParentNode, numFormat, genRandomWorkerName, genRandomRoomName, genRandomFactoryName, genRandomWorker, genRandomTerminal, genRandomRoom, getListByID } from '../tools/utils';
import { DEBUG, CONFIG } from '../config/config';
export default {
    props:{
        title: String, // 表标题
        columns: Array, // 表头数组 [{name,sortable,width,format}]
        data: Array, // 列表数组
        onDoubleTap: Function, // 双击事件
    },
    data() {
        return {
            localColumns: [],
            localData: [],
        };
    },
    computed: {},
    mounted(){
        this.asyn();
    },
    methods: {
        asyn(){
            this.localColumns = Array.from(this.columns,column=>{
                return {
                    sort: false,
                    ...column,
                }
            })
            this.localData = Array.from(this.data,d=>{
                return {
                    select: false,
                    ...d,
                }
            })
        },
        onTapHead(index){
            let column = this.localColumns[index];
            column.sort = !column.sort;
            this.localData = bulbsort(this.localData,column.name,column.sort);
        },
        onTapListItem(e){
            let a = getParentNode(e.target);
            if(a){
                let target;
                for(let i=0;i<this.localData.length;i++){
                    let item = this.localData[i];
                    if(item.id==a.dataset.id){
                        if(item.select)
                            target = item;
                        else
                            item.select = true;
                    }
                    else{
                        item.select = false;
                    }
                }
                if(target){
                    this.$emit('onDoubleTap',target.id);
                }
            }
        },
    },
};
</script>
<style scoped>
    .list-container{

    }
    .list{
        border-top: .01rem solid #ccc;
    }
    .list-item,.list-header{
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: .6rem;
        line-height: .3rem;
        border-bottom: .01rem solid #ccc;
    }
    .list-item .list-cell,.list-header .list-cell{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .list .select{
        background-color: #dcdcdc;
    }
    .list-title{
        height: .5rem;
        line-height: .5rem;
        text-align: left;
        padding: 0 .2rem;
        padding-left: .1rem;
        border-left: .04rem solid #ff4f18;
    }
    .list-title::after{
        content: '';
        display: block;
        width: 100%;
        clear: both;
    }
    .list-title .left{
        float: left;
    }
    .list-title .right{
        float: right;
    }
    .list-title-head{
        font-size: .3rem;
        font-weight: bold;
    }
    .list-title-count{
        margin-left: .2rem;
    }
    .btn{
        color: #ff4f18;
    }
</style>
