<template>
    <div class="main">
        <h1 class="title"><i>Molopoly</i></h1>
        <div class="warp" v-show="state==0">
            <nut-button class="btn btn-newgame" @click="newgame">新游戏</nut-button>
            <nut-button class="btn btn-read" @click="read">读档</nut-button>
        </div>
        <div class="warp" v-show="state==1">
            <div class="row">
                <div class="label">你的名字：</div>
                <nut-textinput class="input" v-model="myname" placeholder="公司创始人的姓名" :disabled="false"/>
            </div>
            <div class="row">
                <div class="label">你的体力</div>
                <nut-slider class="input" v-model="mystrength" :range="[1,100]" :showLabel="true" :showLabelAlways="true" ></nut-slider>
            </div>
            <div class="row">
                <div class="label">你的智力</div>
                <nut-slider class="input" v-model="myintelligence" :range="[1,100]" :showLabel="true" :showLabelAlways="true" ></nut-slider>
            </div>
            <div class="row">
                <div class="label">你的交流力</div>
                <nut-slider class="input" v-model="mycommunication" :range="[1,100]" :showLabel="true" :showLabelAlways="true" ></nut-slider>
            </div>
            <div class="row">
                <div class="label">你的形象</div>
                <nut-slider class="input" v-model="myimage" :range="[1,100]" :showLabel="true" :showLabelAlways="true" ></nut-slider>
            </div>
            <div class="row">
                <div class="label">世界工厂数量</div>
                <nut-slider class="input" v-model="factoryCount" :range="[3,8]" :showLabel="true" :showLabelAlways="true" :showRangeTxt="true" ></nut-slider>
            </div>
            <nut-textinput class="row code" v-model="newcode" label="" placeholder="输入新的存档代码" :disabled="false"/>
            <nut-button class="btn btn-start" @click="start">开始游戏</nut-button>
            <nut-button class="btn btn-back" @click="back">返回</nut-button>
        </div>
        <div class="warp" v-show="state==2">
            <nut-textinput class="row code" v-model="loadcode" label="" placeholder="输入存档代码" :disabled="false"/>
            <nut-button class="btn btn-load" @click="load">继续游戏</nut-button>
            <nut-button class="btn btn-back" @click="back">返回</nut-button>
        </div>
        <!-- <div id="t" style="box-shadow:0 0 4px 4px grey;width:100px;height:100px;margin: 0 auto;overflow:hidden;position:relative"></div> -->
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, bulbsort, genRandomWorkerName, genRandomRoomName, genRandomFactoryName, genRandomRoom, genRandomWorker, genRandomTerminal, getListByID } from '../tools/utils';
import { DEBUG, CONFIG } from '../config/config';
export default {
    name: 'Start',
    data(){
        return {
            loading: false,
            state: 0,
            loadcode: localStorage.getItem('CODE')||'',
            newcode: '',
            myname: '',
            mystrength: 1,
            myintelligence: 1,
            mycommunication: 1,
            myimage: 1,
            factoryCount: 3,
        };
    },
    mounted(){
        window.GLOBAL = {
            game: null, // 游戏数据
            accFactoryID: 1, // 工厂ID累加基数
            accRoomID: 1, // 房间ID累加基数
            accTerminalID: 1, // 终端ID累加基数
            accWorkerID: 1, // 工人ID累加基数
        }
        // @TEST
        // function y(x){
        //     return Math.sin(Math.pow(x/5,.5))*20+50;
        // }
        // for(let i=0;i<100;i++){
        //     let x = r(0,100);
        //     $('#t').append(`<div style="width:2px;height:2px;background:blue;position:absolute;border-radius: 2px;bottom:${y(x)}px;left:${x}px"></div>`);
        // }
    },
    methods: {
        start(){
            if(this.loading) return;
            if(this.myname.length<=0) return;
            if(this.newcode.length<=0) return;
            let initConfig = {
                    myname: this.myname,
                    mystrength: this.mystrength,
                    myintelligence: this.myintelligence,
                    mycommunication: this.mycommunication,
                    myimage: this.myimage,
                    factoryCount: this.factoryCount,
                },
                game = this.genGameData(initConfig); // 生成游戏初始数据
            if(DEBUG){
                window.GLOBAL.game = game;
                // console.log(window.GLOBAL);
                // let wl = [];
                // for(let i=0;i<100;i++){
                //     wl.push(genRandomWorker(-1));
                // }
                // let sort = bulbsort(wl,'str');
                // for(let i=0;i<sort.length;i++){
                //     let y = sort[i].str;
                //     $('#t').append(`<div style="width:2px;height:2px;background:blue;position:absolute;border-radius: 2px;bottom:${y}px;left:${i}px"></div>`);
                // }
                this.$router.push('home');
                // for(let i=0;i<100;i++){
                //     console.log(genName(CONFIG.namespace.common,CONFIG.namespace.common,CONFIG.namespace.factory));
                //     console.log(r(0,2)?genName(CONFIG.namespace.worker1,CONFIG.namespace.worker2,CONFIG.namespace.worker2):genName(CONFIG.namespace.worker1,CONFIG.namespace.worker2));
                //     console.log(genName(CONFIG.namespace.common,CONFIG.namespace.common,CONFIG.namespace.room));
                // }
                return;
            }
            this.loading = true;
            this.loading = this.$toast.loading();
            window.GLOBAL.game = game;
            window.GLOBAL.day = 1;
            query('http://darkmirror.cn/api/monopoly_new.php',rdata=>{ // 新建存档
                this.loading.hide();
                this.loading = null;
                localStorage.setItem('CODE',this.newcode);
                this.$router.push('home');
            },edata=>{
                this.loading.hide();
                this.loading = null;
                this.$toast.text(edata.msg);
            },1,{
                code: this.newcode,
                data: JSON.stringify(window.GLOBAL),
            });
        },
        back(){
            if(this.loading) return;
            this.state = 0;
        },
        newgame(){
            if(this.loading) return;
            this.myname = genRandomWorkerName();
            this.state = 1;
        },
        read(){
            if(this.loading) return;
            this.state = 2;
        },
        load(){
            if(DEBUG){
                return;
            }
            if(this.loading) return;
            if(this.loadcode.length<=0) return;
            this.loading = true;
            this.loading = this.$toast.loading();
            query('http://darkmirror.cn/api/monopoly_load.php',rdata=>{ // 读取存档
                this.loading.hide();
                this.loading = null;
                window.GLOBAL = JSON.parse(rdata.data.data);
                this.$router.push('home');
            },edata=>{
                this.loading.hide();
                this.loading = null;
                this.$toast.text(edata.msg);
            },1,{
                code: this.loadcode,
            });
        },
        genGameData({myname,mystrength,myintelligence,mycommunication,myimage,factoryCount}){ // 生成随机的游戏数据
            let factoryList = [],
                roomList = [],
                terminalList = [],
                workerList = [],
                relationList = [],
                logList = [],
                data,
                init = CONFIG.init;
            // 生成工厂列表
            factoryList.push({
                id: window.GLOBAL.accFactoryID++,
                name: genRandomFactoryName(),
                money: init.money,
                image: init.image,
                hrp: init.humanResourcePoint,
                rrp: init.roomResourcePoint,
            });
            for(let i=1;i<factoryCount;i++){
                factoryList.push({
                    id: window.GLOBAL.accFactoryID++,
                    name: genRandomFactoryName(),
                    money: r(init.randomOtherMoney[0],init.randomOtherMoney[1]),
                    image: r(init.randomOtherImage[0],init.randomOtherImage[1]),
                });
            }
            // 生成房间列表
            roomList.push({
                id: window.GLOBAL.accRoomID++,
                fid: factoryList[0].id,
                name: genRandomRoomName(),
                power: init.roomPower,
                durab: init.roomDurab,
                risk: init.roomRisk,
                auto: init.roomAuto,
                level: init.roomLevel,
            });
            for(let f=1;f<factoryList.length;f++){
                for(let i=0;i<r(init.randomOtherRoomRange[0],init.randomOtherRoomRange[1]);i++){
                    roomList.push(genRandomRoom(window.GLOBAL.accRoomID++,{fid:factoryList[f].id}));
                }
            }
            // 生成终端列表
            for(let i=0;i<CONFIG.terminal_count_distribution[roomList[0].level-1];i++){ // 循环添置我的第一个房间的终端
                terminalList.push({
                    id: window.GLOBAL.accTerminalID++,
                    fid: factoryList[0].id,
                    rid: roomList[0].id,
                	durab: init.terminalDurab,
                	powerLevel: init.terminalPowerLevel,
                	digLevel: init.terminalDigLevel,
                	tradeLevel: init.terminalTradeLevel,
                });
            }
            for(let r=1;r<roomList.length;r++){ // 遍历每个其他工厂的房间
                let room = roomList[r];
                for(let i=0;i<CONFIG.terminal_count_distribution[room.level-1];i++){ // 循环添置终端
                    terminalList.push({
                        id: window.GLOBAL.accTerminalID++,
                        fid: room.fid,
                        rid: room.id,
                    	durab: init.terminalDurab,
                    	powerLevel: init.terminalPowerLevel,
                    	digLevel: init.terminalDigLevel,
                    	tradeLevel: init.terminalTradeLevel,
                    });
                }
            }
            // 生成工人列表
            workerList.push({ // 我
                id: window.GLOBAL.accWorkerID++,
            	tid: 0,
                rid: 0,
                fid: factoryList[0].id,
            	tfid: 0,
            	name: myname,
            	str: mystrength,
            	int: myintelligence,
            	com: mycommunication,
            	img: myimage,
            	job: 0,
            });
            for(let i=0;i<init.workerCount;i++){ // 我的初始员工
                workerList.push(genRandomWorker(window.GLOBAL.accWorkerID++,{fid:factoryList[0].id,}));
            }
            for(let f=1;f<factoryList.length;f++){ // 生成其他工厂员工
                let factory = factoryList[f],
                    thisRoomList = getListByID(factory.id,'fid',roomList);
                for(let room of thisRoomList){
                    let rand = r(1,CONFIG.terminal_count_distribution[room.level-1]);
                    for(let i=0;i<rand;i++){
                        workerList.push(genRandomWorker(window.GLOBAL.accWorkerID++,{fid:factory.id,rid:room.id}));
                    }
                }
            }
            // 生成外交关系列表
            for(let i=0;i<factoryList.length;i++){
                let afactory = factoryList[i];
                for(let j=0;j<factoryList.length;j++){
                    let bfactory = factoryList[j];
                    if(afactory.id!=bfactory.id){
                        relationList.push({
                            from: afactory.id,
                            to: bfactory.id,
                            invest: 0,
                            support: 0,
                            jointID: 0,
                            spyID: 0
                        });
                    }
                }
            }
            // 合成初始数据
            data = { factoryList, roomList, terminalList, workerList, relationList, logList, };
            return data;
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
        margin-bottom: 1rem;
    }
    .warp{
        margin-bottom: 1.2rem;
    }
    .row{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: .55rem;
    }
    .row .label,.row. .input{

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
</style>
