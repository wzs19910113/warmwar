<template>
    <div class="main">
        <h1 class="title">临时页面</h1>

        <div class="wrap" v-show="state==0" style="margin-bottom:1.2rem">
            <div class="row">
                <div class="label">口令：</div>
                <nut-textinput class="input" v-model="token" placeholder="" :disabled="false"/>
            </div>
            <nut-button class="btn btn-back" @click="onTapEnter">确认</nut-button>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, bulbsort, percent, genRandomWorkerName, genRandomRoomName, genRandomFactoryName, genRandomRoom, genRandomWorker, genRandomPartner, genRandomTerminal, getListByID, storageSaveFilter, storageReadFilter, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE, } from '../config/config';
export default {
    name: 'Influ',
    data(){
        return {
            loading: false,
            state: 0,
            token: '',
        };
    },
    mounted(){

    },
    methods: {
        onTapEnter(){ // 点击【确认】按钮
            console.log(this.token);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        text-align: center;
        width: 100%;
        min-height: 100%;
        padding: 2rem .3rem 0 .3rem;
        border: #ff4f18 .2rem solid;
    }
    .title{
        font-size: 1rem;
        margin-bottom: .1rem;
    }
    .version{
        font-style: normal;
        font-weight: normal;
        color: #777;
        height: .6rem;
        line-height: .6rem;
        margin-bottom: .8rem;
    }
    .h-line{
        margin: .8rem 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to right, rgba(0,0,0,0) 0%, #aaa 50%, rgba(0,0,0,0) 100%);
    }
    .wrap{

    }
    .row{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: .55rem;
    }
    .row .label,.row. .input{

    }
    .row .label .label-tip{
        color: #777;
    }
    .row .label{
        width: 2.5rem;
        white-space: nowrap;
        word-break: keep-all;
        text-align: right;
        padding-right: .1rem;
    }
    .row .input{
        width: 5rem;
    }
    .row .abi-point{
        text-align: left;
        padding: 0 10px;
    }
    .row .abi-point b{
        font-size: 18px;
    }
    .row .abi-point-ban{
        color: #f0250f;
    }
    .btn{
        display: block;
        width: 4rem;
        margin: 0 auto .3rem auto;
    }
    .code{
        width: 6rem;
        margin-left: auto;
        margin-right: auto;
    }
    .radio-group{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .radio-group .btn{
        display: inline-block;
        width: 50%;
        margin: 0;
    }
    .radio-group .btn-sel{
        color: #fff;
        background-color: #f0250f;
        font-weight: bold;
        border: 1px solid #f0250f;
    }

    /* 存档列表 */
    .storage-list-wrap{
        width: 6rem;
        margin: 0 auto;
        color: #4a4a4a;
    }
    .storage-list-title{
        height: .5rem;
        line-height: .5rem;
        text-align: left;
        border-bottom: 1px solid #848484;
        font-size: .3rem;
    }
    .btn-truncate{
        display: inline-block;
        float: right;
        color: orange;
        margin: 0;
        width: auto;
        padding: 0 4px;
        font-size: .2rem;
    }
    .storage-list-head,.storage{
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: .5rem;
        line-height: .5rem;
        font-size: .24rem;
    }
    .storage-list-head{
        color: #848484;
    }
    .storage-list{
        max-height: 2rem;
        overflow-y: auto;
    }
    .storage{
        background-color: #eaeaea;
        border-bottom: 1px solid #fff;
    }
    .storage-code,.storage-boss,.storage-day,.storage-factoryCount{
        white-space: nowrap;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 4px;
    }
    .storage-code{
        width: 30%;
    }
    .storage-boss{
        width: 20%;
    }
    .storage-day{
        width: 20%;
    }
    .storage-factoryCount{
        width: 30%;
    }
</style>
