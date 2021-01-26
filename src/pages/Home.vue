<template>
    <div class="main" v-if="game.factoryList">
        <!--系统操作-->
        <nut-drag direction="y" :style="{right:'0px',top:'24px'}">
            <a class="touch-dom" @click="showSystemMenu=true">系统<br/>菜单</a>
        </nut-drag>
        <!--页面内容-->
        <div class="panel">
            <div class="block">
                <div class="tab-panel" v-show="state==1">
                    <div class="row">
                        <h1 class="factory-name"><span>{{game.factoryList[0].name}} <a class="btn btn-edit" @click="showEditFactoryName=true">修改</a></span></h1>
                        <h4 class="my-name">董事长：{{game.workerList[0].name}} <a class="btn btn-icon icon-my-name" @click="onTapViewMy">@</a></h4>
                    </div>
                    <div class="row">
                        <div class="index">
                        </div>
                    </div>
                    <div class="row">
                        <div class="list-container list-container-room">
                            <div class="list-header item-room">
                                <div class="list-cell id">ID</div>
                                <div class="list-cell name">房间名</div>
                                <div class="list-cell power">电量</div>
                                <div class="list-cell durab">老化</div>
                                <div class="list-cell risk">策略</div>
                                <div class="list-cell auto">自动化</div>
                                <div class="list-cell level">等级</div>
                            </div>
                            <div class="list list-room">
                                <a class="list-item item-room" :class="{'select':item.select}" :data-id="item.id" v-for="(item,index) in tempData.myRoomList" @click="onTapListItem($event,'room')">
                                    <div class="list-cell id">{{item.id}}</div>
                                    <div class="list-cell name">{{item.name}}</div>
                                    <div class="list-cell power">{{item.power}}</div>
                                    <div class="list-cell durab">{{item.durab}}%</div>
                                    <div class="list-cell risk">{{config.risk_name[item.risk-1]}}</div>
                                    <div class="list-cell auto">{{item.auto}}%</div>
                                    <div class="list-cell level">LV.{{item.level}}</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--底部导航-->
            <div class="tab-wrap">
                <a class="btn btn-tab" :class="{'active':state==1}" @click="onTapTab(1)">工厂</a>
                <a class="btn btn-tab" :class="{'active':state==2}" @click="onTapTab(2)">房间</a>
                <a class="btn btn-tab" :class="{'active':state==3}" @click="onTapTab(3)">终端</a>
                <a class="btn btn-tab" :class="{'active':state==4}" @click="onTapTab(4)">人员</a>
                <a class="btn btn-tab" :class="{'active':state==5}" @click="onTapTab(5)">外交</a>
            </div>
        </div>
        <!--脚部-->
        <div class="footer">
            <div class="fact">
                <div class="fact-item">总资金：{{numFormat(game.factoryList[0].money)}} $</div>
                <div class="fact-item">工厂形象：{{numFormat(game.factoryList[0].image)}}</div>
            </div>
            <!-- <nut-button class="btn btn-save" @click="save">存档</nut-button> -->
            <nut-button class="btn btn-go" @click="onTapGo">第{{day}}天<br/>结束</nut-button>
        </div>
        <!--弹出层-->
        <nut-popup class="pop pop-system-menu" :round="true" v-model="showSystemMenu">
            <a @click="onTapDrag(1)">存档</a>
            <a @click="onTapDrag(2)">说明</a>
            <a @click="onTapDrag(3)">退出</a>
        </nut-popup>
        <nut-popup v-model="showEditFactoryName">
            <nut-textinput class="input" v-model="game.factoryList[0].name" placeholder="工厂名字" :disabled="false"/>
        </nut-popup>
    </div>
</template>

<script>
import { query, r, bulbsort, getParentNode, numFormat, genRandomWorkerName, genRandomRoomName, genRandomFactoryName, genRandomWorker, genRandomTerminal, genRandomRoom, getListByID } from '../tools/utils';
import { DEBUG, CONFIG } from '../config/config';
export default {
    name: 'Home',
    data(){
        return {
            loading: false,
            dragActive: false,
            state: 1,
            day: 0,
            game: {},
            tempData: {
                myRoomList: [],
                myTerminalList: [],
                myWorkerList: [],
            },
            config: CONFIG,

            searchingID: '', // 当前搜索的ID
            // 弹出层
            show1: false,
            showSystemMenu: false,
            showEditFactoryName: false,
        };
    },
    mounted(){
        if(DEBUG){
            window.GLOBAL = JSON.parse('{"game":{"factoryList":[{"id":1,"name":"京夏集团","money":1000,"image":0},{"id":2,"name":"光定控股","money":12100,"image":765},{"id":3,"name":"漫它控股","money":9887,"image":143}],"roomList":[{"id":1,"fid":1,"name":"索银山","power":50,"durab":0,"risk":1,"auto":0,"level":1},{"id":2,"fid":2,"name":"小资冲","power":456,"durab":0,"risk":3,"auto":29,"level":1},{"id":3,"fid":2,"name":"湖鲁公园","power":3913,"durab":0,"risk":2,"auto":8,"level":3},{"id":4,"fid":3,"name":"环泽广场","power":1402,"durab":0,"risk":1,"auto":27,"level":2},{"id":5,"fid":3,"name":"想门区","power":7457,"durab":0,"risk":3,"auto":56,"level":2},{"id":6,"fid":3,"name":"紫艺区","power":6658,"durab":0,"risk":2,"auto":6,"level":3},{"id":7,"fid":3,"name":"花合路","power":2295,"durab":0,"risk":3,"auto":81,"level":2},{"id":8,"fid":3,"name":"麦仁镇","power":3606,"durab":0,"risk":2,"auto":11,"level":1}],"terminalList":[{"id":1,"fid":1,"rid":1,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":2,"fid":1,"rid":1,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":3,"fid":1,"rid":1,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":4,"fid":1,"rid":1,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":5,"fid":1,"rid":1,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":6,"fid":1,"rid":1,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":7,"fid":2,"rid":2,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":8,"fid":2,"rid":2,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":9,"fid":2,"rid":2,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":10,"fid":2,"rid":2,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":11,"fid":2,"rid":2,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":12,"fid":2,"rid":2,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":13,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":14,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":15,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":16,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":17,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":18,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":19,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":20,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":21,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":22,"fid":2,"rid":3,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":23,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":24,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":25,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":26,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":27,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":28,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":29,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":30,"fid":3,"rid":4,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":31,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":32,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":33,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":34,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":35,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":36,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":37,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":38,"fid":3,"rid":5,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":39,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":40,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":41,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":42,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":43,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":44,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":45,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":46,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":47,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":48,"fid":3,"rid":6,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":49,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":50,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":51,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":52,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":53,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":54,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":55,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":56,"fid":3,"rid":7,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":57,"fid":3,"rid":8,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":58,"fid":3,"rid":8,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":59,"fid":3,"rid":8,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":60,"fid":3,"rid":8,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":61,"fid":3,"rid":8,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":62,"fid":3,"rid":8,"durab":100,"powerLevel":1,"digLevel":1,"tradeLevel":1}],"workerList":[{"id":1,"tid":0,"rid":0,"fid":1,"tfid":0,"name":"高级鱼","str":100,"int":100,"com":100,"img":98,"job":0},{"id":2,"fid":1,"rid":0,"tid":0,"ftid":0,"name":"易函雪","str":46,"int":41,"com":13,"img":30,"job":0},{"id":3,"fid":1,"rid":0,"tid":0,"ftid":0,"name":"王婷謇","str":19,"int":10,"com":44,"img":66,"job":0},{"id":4,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"苏罗","str":40,"int":84,"com":29,"img":42,"job":0},{"id":5,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"周旅宾","str":19,"int":10,"com":9,"img":43,"job":0},{"id":6,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"顾帆麴","str":30,"int":71,"com":86,"img":98,"job":0},{"id":7,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"莫清昕","str":9,"int":16,"com":14,"img":9,"job":0},{"id":8,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"沈罗","str":16,"int":17,"com":47,"img":22,"job":0},{"id":9,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"张谯芷","str":37,"int":60,"com":11,"img":36,"job":0},{"id":10,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"刘衷","str":31,"int":22,"com":43,"img":49,"job":0},{"id":11,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"宰芸","str":76,"int":76,"com":11,"img":8,"job":0},{"id":12,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"范璞子","str":1,"int":37,"com":13,"img":6,"job":0},{"id":13,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"陈懿公","str":50,"int":40,"com":7,"img":35,"job":0},{"id":14,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"堵馨","str":4,"int":27,"com":17,"img":58,"job":0},{"id":15,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"周卜","str":49,"int":20,"com":24,"img":20,"job":0},{"id":16,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"廖怀晓","str":17,"int":6,"com":31,"img":37,"job":0},{"id":17,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"郁白皓","str":24,"int":23,"com":2,"img":22,"job":0},{"id":18,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"胡弘英","str":50,"int":47,"com":55,"img":44,"job":0},{"id":19,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"冉惜芬","str":10,"int":15,"com":40,"img":27,"job":0},{"id":20,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"张庄","str":27,"int":30,"com":74,"img":52,"job":0},{"id":21,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"高晓天","str":48,"int":83,"com":34,"img":45,"job":0},{"id":22,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"武樊寄","str":10,"int":83,"com":39,"img":10,"job":0},{"id":23,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"陈楠紫","str":33,"int":60,"com":77,"img":1,"job":0},{"id":24,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"王竹","str":42,"int":25,"com":14,"img":45,"job":0},{"id":25,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"康山贞","str":44,"int":14,"com":55,"img":19,"job":0},{"id":26,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"刘帖","str":41,"int":63,"com":49,"img":34,"job":0},{"id":27,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"刘泽叔","str":50,"int":33,"com":84,"img":26,"job":0},{"id":28,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"戴濯严","str":11,"int":4,"com":44,"img":72,"job":0},{"id":29,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"刘赧飞","str":49,"int":15,"com":12,"img":38,"job":0},{"id":30,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"黄云冼","str":43,"int":37,"com":18,"img":57,"job":0},{"id":31,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"朱贤霞","str":18,"int":49,"com":28,"img":11,"job":0},{"id":32,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"农昆","str":53,"int":18,"com":40,"img":30,"job":0},{"id":33,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"尤凡奚","str":4,"int":40,"com":33,"img":67,"job":0},{"id":34,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"廖明倚","str":88,"int":51,"com":12,"img":44,"job":0},{"id":35,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"王如","str":81,"int":43,"com":4,"img":84,"job":0},{"id":36,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"王拜波","str":40,"int":16,"com":17,"img":7,"job":0},{"id":37,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"万阚厚","str":34,"int":37,"com":17,"img":24,"job":0},{"id":38,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"刘任","str":8,"int":73,"com":81,"img":33,"job":0},{"id":39,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"罗芳","str":42,"int":18,"com":25,"img":38,"job":0},{"id":40,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"嵇雅琴","str":45,"int":66,"com":15,"img":38,"job":0},{"id":41,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"庾碧","str":54,"int":37,"com":68,"img":77,"job":0},{"id":42,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"王光豪","str":7,"int":13,"com":91,"img":88,"job":0},{"id":43,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"王简检","str":96,"int":30,"com":56,"img":79,"job":0},{"id":44,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"满英畅","str":64,"int":19,"com":48,"img":29,"job":0},{"id":45,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"韩施","str":4,"int":26,"com":19,"img":23,"job":0},{"id":46,"fid":3,"rid":8,"tid":0,"ftid":0,"name":"段仪兰","str":87,"int":22,"com":15,"img":4,"job":0},{"id":47,"fid":3,"rid":8,"tid":0,"ftid":0,"name":"彭桃欣","str":1,"int":47,"com":10,"img":13,"job":0}],"relationList":[{"from":1,"to":2,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":1,"to":3,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":2,"to":1,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":2,"to":3,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":3,"to":1,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":3,"to":2,"invest":0,"support":0,"jointID":0,"spyID":0}]},"accFactoryID":4,"accRoomID":9,"accTerminalID":63,"accWorkerID":48,"day":1}');
        }
        if(window.GLOBAL&&window.GLOBAL.game){
            this.game = window.GLOBAL.game;
            this.day = window.GLOBAL.day;
            this.formTempData();
            console.log(window.GLOBAL);
        }
        else{
            this.$router.push('/');
        }
    },
    methods: {
        numFormat(num){
            return numFormat(num);
        },
        save(tip){
            if(this.loading) return;
            let code = localStorage.getItem('CODE')||'';
            if(!code){
                this.$toast.text('获取存档代码错误');
                return ;
            }
            this.loading = true;
            this.loading = this.$toast.loading();
            window.GLOBAL.game = this.game;
            window.GLOBAL.day = this.day;
            query('http://darkmirror.cn/api/monopoly_save.php',rdata=>{ // 覆盖存档
                this.loading.hide();
                this.loading = null;
                tip&&this.$toast.text(rdata.msg);
            },edata=>{
                this.loading.hide();
                this.loading = null;
                this.$toast.text(edata.msg);
            },1,{
                code,
                data: JSON.stringify(window.GLOBAL),
            });
        },
        formTempData(){ // 同步临时数据
            // 清空
            this.tempData.myRoomList = [];
            // 生成
            let myRoomList = getListByID(this.game.factoryList[0].id,'fid',this.game.roomList);
            this.tempData.myRoomList = Array.from(myRoomList,item=>{
                return {
                    select: false,
                    ...item,
                };
            });
            // for(let i=0;i<23;i++){
            //     this.tempData.myRoomList.push({...myRoomList[0],id:i+1,select:false});
            // }
        },

        onTapDrag(index){ // 点击【悬浮拖拽】按钮
            if(this.loading) return;
            switch(index){
                case 1: // 手动存档
                    this.save(1);
                break;
                case 2: // 游戏说明
                    this.$toast.text('暂无说明');
                break;
                case 3: // 退出游戏
                    this.$router.push('/');
                break;
            }
        },
        onTapGo(){ // 点击【结束】按钮

        },
        onTapTab(index){ // 点击【标签页码】
            this.state = index;
        },
        onTapEditFactoryName(){ // 点击【编辑工厂名】按钮
            this.showEditFactoryName = true;
        },
        onTapViewMy(){ // 点击【查看我】按钮
            this.searchingID = 0;
            this.state = 4;
        },
        onTapListItem(e,list){
            let a = getParentNode(e.target);
            if(a){
                if(list=='room'){
                    let room;
                    for(let i=0;i<this.tempData.myRoomList.length;i++){
                        room = this.tempData.myRoomList[i];
                        room.select = false;
                        if(room.id==a.dataset.id){
                            room.select = true;
                        }
                    }
                    this.searchingID = room.id;
                    this.state = 2;
                }
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        text-align: center;
        width: 100%;
        height: 100%;
        color: #4a4a4a;
        font-size: .24rem;
    }
    .panel{
        position: relative;
        width: 100%;
        height: calc( 100% - 1.2rem );
    }
    .title{
        font-size: 1rem;
        margin-bottom: 1rem;
    }
    .block{
        height: 100%;
        width: 100%;
        overflow: scroll;
        padding-bottom: 1.5rem;
    }
    .pop{
        background-color: #fff;
    }
    .pop-system-menu >a{
        display: block;
        width: 2.5rem;
        height: .8rem;
        line-height: .8rem;
        font-size: .28rem;
        white-space: nowrap;
        word-break: keep-all;
        text-align: center;
    }
    .tab-panel{
        padding: 0 .12rem;
    }
    .row{
        min-height: 1rem;
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

    }
    .btn-icon{
        color: #ff4f18;
    }
    .touch-dom{
        display: block;
        padding-left: .2rem;
        width: 1.2rem;
        height: .8rem;
        line-height: .4rem;
        font-size: .24rem;
        word-break: break-all;
        color: #fff;
        border-top-left-radius: .4rem;
        border-bottom-left-radius: .4rem;
        background: linear-gradient(315deg, #ff4f18 0%, #f20000 100%);
        border: .02rem solid #fff;
        border-right: 0;
    }
    .icon-my-name{
        margin-left: .1rem;
    }
    .factory-name{
        position: relative;
        width: 100%;
        height: 1.05rem;
        line-height: 1.05rem;
        text-align: left;
        font-size: .5rem;
    }
    .factory-name >span{
        display: block;
        height: 1rem;
        border-bottom: 1px solid #414141;
    }
    .factory-name .btn{
        color: #ff4f18;
        display: inline-block;
        font-size: .2rem;
    }
    .my-name{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: .46rem;
        line-height: .46rem;
        font-weight: normal;
        text-align: left;
    }
    .tab-wrap{
        position: absolute;
        z-index: 999;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;
        /* border-top: .01rem solid #ff4f18; */
        box-shadow: 0 0 .2rem .03rem grey;
    }
    .tab-wrap .btn{
        width: 1.5rem;
        font-size: .26rem;
        white-space: nowrap;
        word-break: keep-all;
    }
    .tab-wrap .active{
        background: linear-gradient(315deg, #ff4f18 0%, #f20000 100%);
        color: #fff;
    }
    .footer{
        position: absolute;
        z-index: 999;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.2rem;
        width: 100%;
        background: white;
    }
    .footer .fact{
        padding: 0 .23rem;
        width: 4.8rem;
        text-align: center;
        height: 1.2rem;
        border-top: .01rem solid #ccc;
    }
    .footer .fact .fact-item{
        width: 4.8rem;
        height: .6rem;
        line-height: .6rem;
        text-align: left;
        font-size: .34rem;
    }
    .footer .btn{
        width: 2.7rem;
        height: 1.2rem;
        font-size: .32rem;
    }
    /* 列表 */
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
    .item-room .id{
        width: 15%;
    }
    .item-room .name{
        width: 20%;
    }
    .item-room .power{
        width: 15%;
    }
    .item-room .durab{
        width: 10%;
    }
    .item-room .risk{
        width: 15%;
    }
    .item-room .auto{
        width: 10%;
    }
    .item-room .level{
        width: 15%;
    }
</style>
