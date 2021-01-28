<template>
    <div class="main" v-if="game.factoryList">
        <!--系统操作-->
        <nut-drag direction="y" :style="{right:'0px',top:'24px'}">
            <a class="touch-dom" @click="showSystemMenu=true">系统<br/>菜单</a>
        </nut-drag>
        <!--页面内容-->
        <div class="panel">
            <div class="block">
                <!--工厂-->
                <div class="tab-panel" v-show="state==1">
                    <div class="row">
                        <h1 class="factory-name"><span>{{game.factoryList[0].name}} <a class="btn btn-edit" @click="showEditFactoryName=true">修改</a></span></h1>
                        <h4 class="my-name">董事长：{{game.workerList[0].name}} <a class="btn btn-icon" @click="jump(game.workerList[0].id,4)">@</a></h4>
                    </div>
                    <div class="row">
                        <div class="index">
                            <div class="index-cell left"><b>总资金: {{game.factoryList[0].money}}$</b></div>
                            <div class="index-cell left"><b>工厂形象: {{game.factoryList[0].image}}</b></div>
                            <div class="index-cell left"><b>人力搜索点数: {{game.factoryList[0].hrp}}</b></div>
                            <div class="index-cell left"><b>房间搜索点数: {{game.factoryList[0].rrp}}</b></div>
                            <div class="index-cell"><b>形象代言人: <span v-if="tempData.imageAgent.name">{{tempData.imageAgent.name}} <a class="btn btn-icon" @click="jump(tempData.imageAgent.id,4)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(1)">+</a>
                                <a v-if="tempData.imageAgent.name" class="btn btn-icon" @click="onTapRemoveWorker(1)">-</a>
                            </b></div>
                        </div>
                    </div>
                    <div class="row">
                        <List title="房间列表" ref="roomList" :data="tempData.myRoomList" :columns="ROOM_LIST_COLUMN" @onDoubleTap="onDoubleTapRoom" />
                    </div>
                </div>
                <!--房间-->
                <div class="tab-panel" v-if="tempData.room" v-show="state==2">
                    <div class="row">
                        <h2 class="room-name">[{{tempData.room.id}}]{{tempData.room.name}}<span> 等级{{tempData.room.level}}</span> <a class="btn btn-edit" @click="showEditRoom=true">操作</a></h2>
                    </div>
                    <div class="row">
                        <div class="index">
                            <div class="index-cell"><b>电力: {{tempData.room.power}}</b></div>
                            <div class="index-cell"><b>管理员:
                                <span v-if="tempData.room.manager">{{tempData.room.manager.name}} <a class="btn btn-icon" @click="jump(tempData.room.manager.id,4)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(2)">+</a>
                                <a v-if="tempData.room.manager" class="btn btn-icon" @click="onTapRemoveWorker(2)">-</a>
                            </b></div>
                            <div class="index-cell"><b>维护工人:
                                <span v-if="tempData.room.maintainer">{{tempData.room.maintainer.name}} <a class="btn btn-icon" @click="jump(tempData.room.maintainer.id,4)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(3)">+</a>
                                <a v-if="tempData.room.maintainer" class="btn btn-icon" @click="onTapRemoveWorker(3)">-</a>
                            </b></div>
                            <div class="index-cell"><b>公关:
                                <span v-if="tempData.room.imageAgent">{{tempData.room.imageAgent.name}} <a class="btn btn-icon" @click="jump(tempData.room.imageAgent.id,4)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(4)">+</a>
                                <a v-if="tempData.room.imageAgent" class="btn btn-icon" @click="onTapRemoveWorker(4)">-</a>
                            </b></div>
                            <div class="index-cell"><b>自动化工人:
                                <span v-if="tempData.room.autoWorker">{{tempData.room.autoWorker.name}} <a class="btn btn-icon" @click="jump(tempData.room.autoWorker.id,4)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(5)">+</a>
                                <a v-if="tempData.room.autoWorker" class="btn btn-icon" @click="onTapRemoveWorker(5)">-</a>
                            </b></div>
                            <div></div>
                            <div class="index-cell left"><b>协调: {{tempData.room.balance}}%</b></div>
                            <div class="index-cell left"><b>策略: {{config.risk_name_map[tempData.room.risk-1]}}</b></div>
                            <div class="index-cell left"><b>老化: {{tempData.room.durab}}%</b></div>
                            <div class="index-cell left"><b>自动化: {{tempData.room.auto}}%</b></div>
                        </div>
                    </div>
                    <div class="row">
                        <List title="终端列表" ref="terminalList" :data="tempData.myTerminalList" :columns="TERMINAL_LIST_COLUMN" @onDoubleTap="onDoubleTapTerminal" />
                    </div>
                </div>
                <!--终端-->
                <div class="tab-panel" v-if="tempData.terminal" v-show="state==3">
                    <div class="row">
                        <h2 class="room-name">{{tempData.room.name}}的终端-{{tempData.terminal.id}} <a class="btn btn-edit" @click="showEditTerminal=true">操作</a></h2>
                    </div>
                    <div class="row">
                        <div class="index">
                            <div class="index-cell">
                                <b>操作员:
                                    <span v-if="tempData.terminal.operator&&tempData.terminal.operator.id">{{tempData.terminal.operator.name}} <a class="btn btn-icon" @click="jump(tempData.terminal.operator.id,4)">@</a></span>
                                    <a class="btn btn-icon" @click="onTapAddWorker(6)">+</a>
                                    <a v-if="tempData.terminal.operator&&tempData.terminal.operator.id" class="btn btn-icon" @click="onTapRemoveWorker(6)">-</a>
                                </b>
                            </div>
                            <div class="index-cell">
                                <b>执行:
                                    <span>{{tempData.terminal.job||'-'}}</span>
                                </b>
                            </div>
                            <div class="index-cell"><b>老化: {{tempData.terminal.durab}}%</b></div>
                            <div class="index-cell"><b>供电等级: {{tempData.terminal.powerLevel}}</b></div>
                            <div class="index-cell"><b>挖矿等级: {{tempData.terminal.digLevel}}</b></div>
                            <div class="index-cell"><b>交易等级: {{tempData.terminal.tradeLevel}}</b></div>
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
                <a class="btn btn-tab" :class="{'active':state==6}" @click="onTapTab(6)">报表</a>
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
        <nut-popup v-model="showEditRoom">
            <div class="row room-board" v-if="tempData.room">
                <div class="row level">
                    <h3>等级 {{tempData.room.level}}</h3><a class="btn" v-if="tempData.room.level<config.max_room_level" @click="onTapRoomLevelUp">提升等级（{{config.room_levelup_cost[tempData.room.level-1]}}$）</a>
                </div>
                <div class="row risk">
                    <h3>策略:</h3>
                    <a class="risk-item" :class="{'select':tempData.room.risk==index}" v-for="index in [1,2,3]" @click="onTapRiskLevel(index)">{{config.risk_name_map[index-1]}}</a>
                </div>
                <div class="row sell">
                    <a class="risk-item" @click="onTapSellRoom(tempData.room)">出售（$）</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showEditTerminal">
            <div class="row room-board" v-if="tempData.terminal">
                <div class="row level">
                    <h3>供电等级 {{tempData.terminal.powerLevel}}</h3><a class="btn" v-if="tempData.terminal.powerLevel<config.max_terminal_level" @click="onTapTerminalLevelUp('power')">提升等级（{{config.power_levelup_cost[tempData.terminal.powerLevel-1]}}$）</a>
                </div>
                <div class="row level">
                    <h3>挖矿等级 {{tempData.terminal.digLevel}}</h3><a class="btn" v-if="tempData.terminal.digLevel<config.max_terminal_level" @click="onTapTerminalLevelUp('dig')">提升等级（{{config.dig_levelup_cost[tempData.terminal.digLevel-1]}}$）</a>
                </div>
                <div class="row level">
                    <h3>交易等级 {{tempData.terminal.tradeLevel}}</h3><a class="btn" v-if="tempData.terminal.tradeLevel<config.max_terminal_level" @click="onTapTerminalLevelUp('trade')">提升等级（{{config.trade_levelup_cost[tempData.terminal.tradeLevel-1]}}$）</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showJobPop">
            <div class="row job room-board">
                <div class="row risk">
                    <h3>选择职能:</h3>
                    <a class="risk-item" :class="{'select':(tempData.terminal||{}).job==index}" v-for="index in [1,2,3,4]" @click="onTapJob(index)">{{config.job_name_map[index]}}</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showWorkerList">
            <div class="row pop-worker-list">
                <List title="选择人员" ref="workerListPop" :data="tempData.myWorkerList" :columns="WORKER_LIST_COLUMN" @onDoubleTap="onDoubleTapPopWorker" />
            </div>
        </nut-popup>
    </div>
</template>

<script>
import List from '../components/List'
import { query, r, bulbsort, getParentNode, numFormat, genRandomWorkerName, genRandomRoomName, genRandomFactoryName, genRandomRoom, genRandomWorker, genRandomTerminal, getListByID, retireAllByJob } from '../tools/utils';
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
                myFactoryList: [],
                // 首页
                myRoomList: [],
                imageAgent: {},

                // 房间页
                room: null,
                myTerminalList: [],

                // 终端页
                terminal: null,

                // 通用
                myWorkerList: [],

                workListPopMode: 0,
            },
            config: CONFIG,

            searchingID: '', // 当前搜索的ID
            // 弹出层
            showSystemMenu: false,
            showEditFactoryName: false,
            showEditRoom: false,
            showEditTerminal: false,
            showWorkerList: false,
            showJobPop: false,

            // const
            ROOM_LIST_COLUMN: [
                {name:'id',title:'ID',width:'10%',},
                {name:'name',title:'房间名',width:'20%',},
                {name:'power',title:'电力',width:'15%',},
                {name:'durab',title:'老化',width:'15%',format:v=>`${v}%`,},
                {name:'risk',title:'策略',width:'10%',format:v=>`${CONFIG.risk_name_map[v-1]}`,},
                {name:'auto',title:'自动化',width:'15%',format:v=>`${v}%`,},
                {name:'level',title:'等级',width:'15%',format:v=>`LV.${v}`,},
            ],
            TERMINAL_LIST_COLUMN: [
                {name:'id',title:'ID',width:'8%',},
                {name:'powerLevel',title:'供电等级',width:'18%',format:v=>`LV.${v}`,},
                {name:'digLevel',title:'挖矿等级',width:'18%',format:v=>`LV.${v}`,},
                {name:'tradeLevel',title:'交易等级',width:'18%',format:v=>`LV.${v}`,},
                {name:'durab',title:'老化',width:'10%',format:v=>`${v}%`,},
                {name:'workerName',title:'工人',width:'15%',format:v=>`${v||'-'}`},
                {name:'job',title:'运行',width:'13%',format:v=>`${v||'-'}`},
            ],
            WORKER_LIST_COLUMN: [
                {name:'id',title:'ID',width:'10%',},
                {name:'name',title:'名字',width:'15%',},
                {name:'str',title:'体力',width:'15%',},
                {name:'int',title:'智力',width:'15%',},
                {name:'com',title:'交流',width:'15%',},
                {name:'img',title:'形象',width:'15%',},
                {name:'job',title:'职能',width:'15%',format:v=>`${CONFIG.job_name_map[v]}`,},
            ],
        };
    },
    mounted(){
        if(DEBUG){
            window.GLOBAL = JSON.parse('{"game":{"factoryList":[{"id":1,"name":"京夏集团","money":1000,"image":0,"hrp":0,"rrp":0},{"id":2,"name":"光定控股","money":12100,"image":765},{"id":3,"name":"漫它控股","money":9887,"image":143}],"roomList":[{"id":1,"fid":1,"name":"索银山","power":50,"durab":0,"risk":1,"auto":0,"level":1},{"id":2,"fid":2,"name":"小资冲","power":456,"durab":0,"risk":3,"auto":29,"level":1},{"id":3,"fid":2,"name":"湖鲁公园","power":3913,"durab":0,"risk":2,"auto":8,"level":3},{"id":4,"fid":3,"name":"环泽广场","power":1402,"durab":0,"risk":1,"auto":27,"level":2},{"id":5,"fid":3,"name":"想门区","power":7457,"durab":0,"risk":3,"auto":56,"level":2},{"id":6,"fid":3,"name":"紫艺区","power":6658,"durab":0,"risk":2,"auto":6,"level":3},{"id":7,"fid":3,"name":"花合路","power":2295,"durab":0,"risk":3,"auto":81,"level":2},{"id":8,"fid":3,"name":"麦仁镇","power":3606,"durab":0,"risk":2,"auto":11,"level":1}],"terminalList":[{"id":1,"fid":1,"rid":1,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":2,"fid":1,"rid":1,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":3,"fid":1,"rid":1,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":4,"fid":1,"rid":1,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":5,"fid":1,"rid":1,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":6,"fid":1,"rid":1,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":7,"fid":2,"rid":2,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":8,"fid":2,"rid":2,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":9,"fid":2,"rid":2,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":10,"fid":2,"rid":2,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":11,"fid":2,"rid":2,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":12,"fid":2,"rid":2,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":13,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":14,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":15,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":16,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":17,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":18,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":19,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":20,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":21,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":22,"fid":2,"rid":3,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":23,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":24,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":25,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":26,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":27,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":28,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":29,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":30,"fid":3,"rid":4,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":31,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":32,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":33,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":34,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":35,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":36,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":37,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":38,"fid":3,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":39,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":40,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":41,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":42,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":43,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":44,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":45,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":46,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":47,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":48,"fid":3,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":49,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":50,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":51,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":52,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":53,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":54,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":55,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":56,"fid":3,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":57,"fid":3,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":58,"fid":3,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":59,"fid":3,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":60,"fid":3,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":61,"fid":3,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":62,"fid":3,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1}],"workerList":[{"id":1,"tid":0,"rid":0,"fid":1,"tfid":0,"name":"高级鱼","str":100,"int":100,"com":100,"img":98,"job":0},{"id":2,"fid":1,"rid":0,"tid":0,"ftid":0,"name":"易函雪","str":46,"int":41,"com":13,"img":30,"job":0},{"id":3,"fid":1,"rid":0,"tid":0,"ftid":0,"name":"王婷謇","str":19,"int":10,"com":44,"img":66,"job":11},{"id":4,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"苏罗","str":40,"int":84,"com":29,"img":42,"job":0},{"id":5,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"周旅宾","str":19,"int":10,"com":9,"img":43,"job":0},{"id":6,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"顾帆麴","str":30,"int":71,"com":86,"img":98,"job":0},{"id":7,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"莫清昕","str":9,"int":16,"com":14,"img":9,"job":0},{"id":8,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"沈罗","str":16,"int":17,"com":47,"img":22,"job":0},{"id":9,"fid":2,"rid":2,"tid":0,"ftid":0,"name":"张谯芷","str":37,"int":60,"com":11,"img":36,"job":0},{"id":10,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"刘衷","str":31,"int":22,"com":43,"img":49,"job":0},{"id":11,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"宰芸","str":76,"int":76,"com":11,"img":8,"job":0},{"id":12,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"范璞子","str":1,"int":37,"com":13,"img":6,"job":0},{"id":13,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"陈懿公","str":50,"int":40,"com":7,"img":35,"job":0},{"id":14,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"堵馨","str":4,"int":27,"com":17,"img":58,"job":0},{"id":15,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"周卜","str":49,"int":20,"com":24,"img":20,"job":0},{"id":16,"fid":2,"rid":3,"tid":0,"ftid":0,"name":"廖怀晓","str":17,"int":6,"com":31,"img":37,"job":0},{"id":17,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"郁白皓","str":24,"int":23,"com":2,"img":22,"job":0},{"id":18,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"胡弘英","str":50,"int":47,"com":55,"img":44,"job":0},{"id":19,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"冉惜芬","str":10,"int":15,"com":40,"img":27,"job":0},{"id":20,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"张庄","str":27,"int":30,"com":74,"img":52,"job":0},{"id":21,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"高晓天","str":48,"int":83,"com":34,"img":45,"job":0},{"id":22,"fid":3,"rid":4,"tid":0,"ftid":0,"name":"武樊寄","str":10,"int":83,"com":39,"img":10,"job":0},{"id":23,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"陈楠紫","str":33,"int":60,"com":77,"img":1,"job":0},{"id":24,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"王竹","str":42,"int":25,"com":14,"img":45,"job":0},{"id":25,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"康山贞","str":44,"int":14,"com":55,"img":19,"job":0},{"id":26,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"刘帖","str":41,"int":63,"com":49,"img":34,"job":0},{"id":27,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"刘泽叔","str":50,"int":33,"com":84,"img":26,"job":0},{"id":28,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"戴濯严","str":11,"int":4,"com":44,"img":72,"job":0},{"id":29,"fid":3,"rid":5,"tid":0,"ftid":0,"name":"刘赧飞","str":49,"int":15,"com":12,"img":38,"job":0},{"id":30,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"黄云冼","str":43,"int":37,"com":18,"img":57,"job":0},{"id":31,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"朱贤霞","str":18,"int":49,"com":28,"img":11,"job":0},{"id":32,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"农昆","str":53,"int":18,"com":40,"img":30,"job":0},{"id":33,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"尤凡奚","str":4,"int":40,"com":33,"img":67,"job":0},{"id":34,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"廖明倚","str":88,"int":51,"com":12,"img":44,"job":0},{"id":35,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"王如","str":81,"int":43,"com":4,"img":84,"job":0},{"id":36,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"王拜波","str":40,"int":16,"com":17,"img":7,"job":0},{"id":37,"fid":3,"rid":6,"tid":0,"ftid":0,"name":"万阚厚","str":34,"int":37,"com":17,"img":24,"job":0},{"id":38,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"刘任","str":8,"int":73,"com":81,"img":33,"job":0},{"id":39,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"罗芳","str":42,"int":18,"com":25,"img":38,"job":0},{"id":40,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"嵇雅琴","str":45,"int":66,"com":15,"img":38,"job":0},{"id":41,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"庾碧","str":54,"int":37,"com":68,"img":77,"job":0},{"id":42,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"王光豪","str":7,"int":13,"com":91,"img":88,"job":0},{"id":43,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"王简检","str":96,"int":30,"com":56,"img":79,"job":0},{"id":44,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"满英畅","str":64,"int":19,"com":48,"img":29,"job":0},{"id":45,"fid":3,"rid":7,"tid":0,"ftid":0,"name":"韩施","str":4,"int":26,"com":19,"img":23,"job":0},{"id":46,"fid":3,"rid":8,"tid":0,"ftid":0,"name":"段仪兰","str":87,"int":22,"com":15,"img":4,"job":0},{"id":47,"fid":3,"rid":8,"tid":0,"ftid":0,"name":"彭桃欣","str":1,"int":47,"com":10,"img":13,"job":0}],"relationList":[{"from":1,"to":2,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":1,"to":3,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":2,"to":1,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":2,"to":3,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":3,"to":1,"invest":0,"support":0,"jointID":0,"spyID":0},{"from":3,"to":2,"invest":0,"support":0,"jointID":0,"spyID":0}]},"accFactoryID":4,"accRoomID":9,"accTerminalID":63,"accWorkerID":48,"day":1}');
        }
        if(window.GLOBAL&&window.GLOBAL.game){
            this.game = window.GLOBAL.game;
            this.day = window.GLOBAL.day;
            this.asynHomePage();
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
        onTapRoomLevelUp(){ // 点击【房间升级】按钮
            let room = this.tempData.room,
                cost = this.config.room_levelup_cost[room.level-1];
            if(room.level<this.config.max_room_level){
                if(this.game.factoryList[0].money>=cost){
                    this.game.factoryList[0].money -= cost;
                    room.level += 1;
                    this.$refs.roomList&&this.$refs.roomList.asyn();
                }
                else{
                    this.$toast.text('资金不够');
                }
            }
        },
        onTapTerminalLevelUp(type){ // 点击【房终端升级】按钮
            let terminal = this.tempData.terminal;
            if(terminal){
                let level = this.tempData.terminal[type+'Level'];
                if(level<this.config.max_terminal_level){
                    let cost = this.config[type+'_levelup_cost'][level-1];
                    if(this.game.factoryList[0].money>=cost){
                        this.game.factoryList[0].money -= cost;
                        terminal[type+'Level'] += 1;
                        this.$refs.roomList&&this.$refs.roomList.asyn();
                        this.$refs.terminalList&&this.$refs.terminalList.asyn();
                    }
                    else{
                        this.$toast.text('资金不够');
                    }
                }
            }
        },
        onTapRiskLevel(index){ // 点击【策略等级】按钮
            let room = this.tempData.room;
            room.risk = index;
            let aroom = getListByID(room.id,'id',this.game.roomList)[0];
            if(aroom)
                aroom.risk = room.risk;
            this.$refs.roomList.asyn();
        },
        onTapAddWorker(mode){ // 点击【+】按钮 @MODIFY
            this.$refs.workerListPop.asyn();
            this.tempData.workListPopMode = mode;
            this.showWorkerList = true;
        },
        onTapRemoveWorker(mode){ // 点击【-】按钮 @MODIFY
            let rid = (this.tempData.room||{}).id,
                tid = (this.tempData.terminal||{}).id,
                roomWorkerList = [];
            if(rid){
                roomWorkerList = getListByID(rid,'rid',this.game.workerList);
            }
            switch(mode){
                case 1: // 形象总代言
                    retireAllByJob(11,getListByID(1,'fid',this.game.workerList));
                break;
                case 2: // 房间-管理员
                    retireAllByJob(7,roomWorkerList);
                break;
                case 3: // 房间-维护工人
                    retireAllByJob(6,roomWorkerList);
                break;
                case 4: // 房间-公关
                    retireAllByJob(8,roomWorkerList);
                break;
                case 5: // 房间-自动化工人
                    retireAllByJob(5,roomWorkerList);
                break;
                case 6: // 终端-操作员
                    if(tid){
                        let worker = getListByID(tid,'tid',this.game.workerList)[0];
                        if(worker){
                            worker.job = 0;
                            worker.tid = 0;
                        }
                    }
                break;
            }
            this.asynHomePage();
            rid&&this.asynRoomPage(rid);
            tid&&this.asynTerminalPage(tid);
            this.$refs.roomList&&this.$refs.roomList.asyn();
            this.$refs.terminalList&&this.$refs.terminalList.asyn();
            this.$refs.workerListPop&&this.$refs.workerListPop.asyn();
        },
        onTapJob(index){ // 点击【职能】按钮
            let rid = (this.tempData.room||{}).id,
                tid = (this.tempData.terminal||{}).id,
                worker = getListByID(tid,'tid',this.game.workerList)[0];
            if(worker){
                worker.job = index;
            }
            this.asynHomePage();
            rid&&this.asynRoomPage(rid);
            tid&&this.asynTerminalPage(tid);
            this.$refs.roomList&&this.$refs.roomList.asyn();
            this.$refs.terminalList&&this.$refs.terminalList.asyn();
            this.$refs.workerListPop&&this.$refs.workerListPop.asyn();
            this.showJobPop = false;
        },
        onDoubleTapRoom(id){ // 双击【房间】按钮
            this.jump(id,2);
        },
        onDoubleTapTerminal(id){ // 双击【终端】按钮
            this.jump(id,3);
        },
        onDoubleTapPopWorker(id){ // 双击【弹窗工人】按钮
            console.log('点击【弹窗工人】按钮',id);
            let worker = getListByID(id,'id',this.game.workerList)[0],
                rid = (this.tempData.room||{}).id,
                tid = (this.tempData.terminal||{}).id,
                roomWorkerList = [];
            if(rid){
                roomWorkerList = getListByID(rid,'rid',this.game.workerList);
            }
            switch(this.tempData.workListPopMode){
                case 1: // 形象总代言
                    retireAllByJob(11,getListByID(1,'fid',this.game.workerList));
                    worker.job = 11;
                    worker.tid = 0;
                    worker.rid = 0;
                break;
                case 2: // 房间-管理员
                    retireAllByJob(7,roomWorkerList);
                    worker.job = 7;
                    worker.tid = 0;
                    worker.rid = rid||0;
                break;
                case 3: // 房间-维护工人
                    retireAllByJob(6,roomWorkerList);
                    worker.job = 6;
                    worker.tid = 0;
                    worker.rid = rid||0;
                break;
                case 4: // 房间-公关
                    retireAllByJob(8,roomWorkerList);
                    worker.job = 8;
                    worker.tid = 0;
                    worker.rid = rid||0;
                break;
                case 5: // 房间-自动化工人
                    retireAllByJob(5,roomWorkerList);
                    worker.job = 5;
                    worker.tid = 0;
                    worker.rid = rid||0;
                break;
                case 6: // 终端-操作员
                    let oworker = getListByID(tid,'tid',this.game.workerList)[0];
                    if(oworker){
                        oworker.job = 0;
                        oworker.tid = 0;
                    }
                    worker.job = 0;
                    worker.tid = tid||0;
                    worker.rid = (this.tempData.terminal||{}).rid||0;
                    this.showJobPop = true;
                break;
            }
            this.asynHomePage();
            rid&&this.asynRoomPage(rid);
            tid&&this.asynTerminalPage(tid);
            this.$refs.roomList&&this.$refs.roomList.asyn();
            this.$refs.terminalList&&this.$refs.terminalList.asyn();
            this.$refs.workerListPop&&this.$refs.workerListPop.asyn();
            this.showWorkerList = false;
        },
        jump(id,state){ // 点击【跳转】按钮
            console.log(`跳转至${['房间','终端','人员','外交'][state-2]} ID=${id}`);
            switch(state){
                case 1: // 首页
                    this.asynHoomPage();
                break;
                case 2: // 房间
                    this.asynRoomPage(id);
                case 3: // 终端
                    this.asynTerminalPage(id);
                break;
            }
            this.searchingID = id;
            this.state = state;
        },
        asynHomePage(){ // 刷新首页temp数据
            let myRoomList = getListByID(this.game.factoryList[0].id,'fid',this.game.roomList);
            let myWorkerList = getListByID(this.game.factoryList[0].id,'fid',this.game.workerList);
            this.tempData.myRoomList = [...myRoomList];
            this.tempData.myWorkerList = [...myWorkerList];
            // for(let i=0;i<23;i++){ // @TEST
            //     let a = genRandomRoom(window.GLOBAL.accRoomID++,{fid:this.game.factoryList[0].id});
            //     this.tempData.myRoomList.push(a);
            // }
            this.tempData.imageAgent = {};
            for(let worker of myWorkerList){
                if(worker.job==11){
                    this.tempData.imageAgent = worker;
                }
            }
        },
        asynRoomPage(id){ // 刷新房间页temp数据
            let room = getListByID(id,'id',this.game.roomList)[0],
                terminalList = getListByID(id,'rid',this.game.terminalList),
                roomWorkerList = getListByID(room.id,'rid',this.game.workerList),
                myRoom = {...room},
                myTerminalList = [...terminalList],
                myRoomWorkerList = [...roomWorkerList],
                getWorkerByJob = job=>{
                    for(let worker of myRoomWorkerList){
                        if(worker.job==job)
                            return worker;
                    }
                    return '';
                },
                manager = getWorkerByJob(7),
                maintainer = getWorkerByJob(6),
                imageAgent = getWorkerByJob(8),
                autoWorker = getWorkerByJob(5);
            for(let terminal of myTerminalList){
                let worker = getListByID(terminal.id,'tid',this.game.workerList)[0],
                    myWorker = {...worker};
                if(myWorker){
                    terminal.workerName = myWorker.name;
                    switch(myWorker.job){
                        case 1: terminal.job = '发电';break;
                        case 2: terminal.job = '挖矿';break;
                        case 3: terminal.job = '交易';break;
                        case 4: terminal.job = '维护';break;
                        default: terminal.job = '-';
                    }
                }
            }
            this.tempData.room = {
                manager,maintainer,imageAgent,autoWorker,
                ...myRoom,
            }
            this.tempData.myTerminalList = myTerminalList;
        },
        asynTerminalPage(id){ // 刷新终端页temp数据
            let terminal = getListByID(id,'id',this.game.terminalList)[0],
                worker = getListByID(id,'tid',this.game.workerList)[0],
                myTerminal = {...terminal},
                myWorker = {...worker};
            this.tempData.terminal = {
                operator: myWorker,
                job: myWorker?myWorker.job:'',
                ...myTerminal,
            }
        },
    },
    components:{
        List,
    },
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
        color: #ff4f18;
    }
    .btn-icon{
        display: inline-block;
        color: #ff4f18;
        text-align: center;
        font-size: .3rem;
        width: .32rem;
    }
    .btn-go{
        color: #fff;
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
    .btn-edit{
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
    .room-name{
        height: .9rem;
        line-height: .9rem;
        text-align: left;
        border-bottom: 1px solid #414141;
    }
    .room-name >span{
        font-weight: normal;
        font-size: .28rem;
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
    .index{
        text-align: left;
        padding: .12rem 0;
        margin-bottom: .18rem;
    }
    .index::after{
        content: '';
        display: block;
        width: 100%;
        clear: both;
    }
    .index-cell{
        height: .5rem;
        line-height: .5rem;
        font-size: .3rem;
        display: inline-block;
        width: 100%;
    }
    .index-cell b{
        padding-left: .1rem;
        border-left: .04rem solid #ff4f18;
    }
    .index .left{
        float: left;
        width: 50%;
    }
    .index .right{
        float: right;
        width: 50%;
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
    /* 弹窗 */
    .room-board{
        width: 6rem;
        padding: 0 .5rem;
    }
    .room-board .row{
        padding: .3rem 0;
        border-bottom: .01rem solid #ccc;
    }
    .room-board .level{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.5rem;
    }
    .room-board .level a{
        font-weight: bold;
        font-size: .3rem;
    }
    .room-board .risk{
        text-align: left;
        height: 2rem;
    }
    .room-board .risk h3{
        height: .6rem;
        line-height: .6rem;
    }
    .room-board .risk .select{
        color: #ff4f18;
    }
    .room-board .risk .risk-item{
        display: inline-block;
        margin-right: .2rem;
    }
    .room-board .sell{
        color: #ff4f18;
        font-size: .3rem;
        font-weight: bold;
        text-align: right;
    }
    .pop-worker-list{
        width: 7.2rem;
        padding: .1rem;
        height: 6.2rem;
        overflow: scroll;
    }
</style>
