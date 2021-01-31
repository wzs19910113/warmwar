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
                    <div class="row no-margin">
                        <h1 class="factory-name"><span>{{game.factoryList[0].name}} <a class="btn btn-edit" @click="showEditFactoryName=true">修改</a></span></h1>
                        <h4 class="my-name">董事长：{{game.workerList[0].name}} <a class="btn btn-icon" @click="jump(4,game.workerList[0].id)">@</a></h4>
                    </div>
                    <div class="row no-margin">
                        <div class="index">
                            <div class="index-cell left"><b>总资金: {{game.factoryList[0].money}} $</b></div>
                            <div class="index-cell left"><b>工厂形象: {{game.factoryList[0].image}}</b></div>
                            <div class="index-cell left"><b>房间搜索点数: {{game.factoryList[0].rrp}}</b></div>
                            <div class="index-cell left"><b>人力搜索点数: {{game.factoryList[0].hrp}}</b></div>
                            <div class="index-cell"><b>形象代言人: <span v-if="tempData.imageAgent.name">{{tempData.imageAgent.name}} <a class="btn btn-icon" @click="jump(4,tempData.imageAgent.id)">@</a></span>
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
                    <div class="row no-margin">
                        <h2 class="room-name">{{tempData.room.name}}[{{tempData.room.id}}]<span> 等级{{tempData.room.level}}</span> <a class="btn btn-edit" @click="showEditRoom=true">操作</a></h2>
                    </div>
                    <div class="row no-margin">
                        <div class="index">
                            <div class="index-cell"><b>电力: {{tempData.room.power}}</b> <a class="btn btn-edit" @click="showAssignPower=true">分配</a></div>
                            <div class="index-cell"><b>策略: {{config.risk_name_map[tempData.room.risk-1]}}</b></div>
                            <div class="index-cell left"><b>管理员:
                                <span v-if="tempData.room.manager">{{tempData.room.manager.name}} <a class="btn btn-icon" @click="jump(4,tempData.room.manager.id)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(2)">+</a>
                                <a v-if="tempData.room.manager" class="btn btn-icon" @click="onTapRemoveWorker(2)">-</a>
                            </b></div>
                            <div class="index-cell pct-wrap left"><b>协调:</b><div class="pct"><nut-progress :text-inside="true" :percentage="tempData.room.balance"></nut-progress></div></div>
                            <div class="index-cell left"><b>维护工人:
                                <span v-if="tempData.room.maintainer">{{tempData.room.maintainer.name}} <a class="btn btn-icon" @click="jump(4,tempData.room.maintainer.id)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(3)">+</a>
                                <a v-if="tempData.room.maintainer" class="btn btn-icon" @click="onTapRemoveWorker(3)">-</a>
                            </b></div>
                            <!-- <div class="index-cell left"><b>老化: {{percent(tempData.room.durab,config.max_durab)}}%</b></div> -->
                            <div class="index-cell pct-wrap left"><b>老化:</b><div class="pct"><nut-progress :text-inside="true" :percentage="percent(tempData.room.durab,config.max_durab)"></nut-progress></div></div>
                            <div class="index-cell" v-if="tempData.room.level>=2"><b>门面<span v-if="tempData.room.basicImage>0">（基础门面+{{tempData.room.basicImage}}）</span>:
                                <span v-if="tempData.room.imageAgent">{{tempData.room.imageAgent.name}} <a class="btn btn-icon" @click="jump(4,tempData.room.imageAgent.id)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(4)">+</a>
                                <a v-if="tempData.room.imageAgent" class="btn btn-icon" @click="onTapRemoveWorker(4)">-</a>
                            </b></div>
                            <div class="index-cell left" v-if="tempData.room.level>=3"><b>自动化工人:
                                <span v-if="tempData.room.autoWorker">{{tempData.room.autoWorker.name}} <a class="btn btn-icon" @click="jump(4,tempData.room.autoWorker.id)">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(5)">+</a>
                                <a v-if="tempData.room.autoWorker" class="btn btn-icon" @click="onTapRemoveWorker(5)">-</a>
                            </b></div>
                            <div></div>
                            <div class="index-cell pct-wrap left" v-if="tempData.room.level>=3"><b>自动化:</b><div class="pct"><nut-progress :text-inside="true" :percentage="percent(tempData.room.auto,config.max_auto)"></nut-progress></div></div>
                        </div>
                    </div>
                    <div class="row">
                        <List title="终端列表" ref="terminalList" :data="tempData.myTerminalList" :columns="TERMINAL_LIST_COLUMN" @onDoubleTap="onDoubleTapTerminal" />
                    </div>
                    <div class="row">
                        <List title="房间人员" ref="roomWorkerList" :data="tempData.myRoomWorkerList" :columns="WORKER_LIST_3_COLUMN" @onDoubleTap="onDoubleTapRoomWorker" />
                    </div>
                </div>
                <!--终端-->
                <div class="tab-panel" v-if="tempData.terminal" v-show="state==3">
                    <div class="row no-margin">
                        <h2 class="room-name">{{tempData.terminal.room.name}}的终端[{{tempData.terminal.id}}] <a class="btn btn-edit" @click="showEditTerminal=true">操作</a></h2>
                    </div>
                    <div class="row">
                        <div class="index">
                            <div class="index-cell">
                                <b>操作员:
                                    <span v-if="tempData.terminal.operator&&tempData.terminal.operator.id">{{tempData.terminal.operator.name}} <a class="btn btn-icon" @click="jump(4,tempData.terminal.operator.id)">@</a></span>
                                    <a class="btn btn-icon" @click="onTapAddWorker(6)">+</a>
                                    <a v-if="tempData.terminal.operator&&tempData.terminal.operator.id" class="btn btn-icon" @click="onTapRemoveWorker(6)">-</a>
                                </b>
                            </div>
                            <div class="index-cell">
                                <b>执行:
                                    <span>{{tempData.terminal.job||'-'}}</span>
                                    <a v-if="tempData.terminal.operator&&tempData.terminal.operator.id" class="btn btn-icon" @click="onTapAddJob(tempData.terminal)">+</a>
                                </b>
                            </div>
                            <!-- <div class="index-cell"><b>老化: {{percent(tempData.terminal.durab,config.max_durab)}}%</b></div> -->
                            <div class="index-cell pct-wrap"><b>老化:</b>&nbsp;<div class="pct"><nut-progress :text-inside="true" :percentage="percent(tempData.terminal.durab,config.max_durab)"></nut-progress></div></div>
                            <div class="index-cell"><b>供电等级: {{tempData.terminal.powerLevel}}</b></div>
                            <div class="index-cell"><b>挖矿等级: {{tempData.terminal.digLevel}}</b></div>
                            <div class="index-cell"><b>交易等级: {{tempData.terminal.tradeLevel}}</b></div>
                        </div>
                    </div>
                </div>
                <!--人员-->
                <div class="tab-panel" v-if="tempData.myWorkerList" v-show="state==4">
                    <div class="row no-margin">
                        <h2 class="room-name">人员管理</h2>
                    </div>
                    <div class="row no-margin">
                        <div class="index filter">
                            <a class="btn" :class="{'select':filter==1&&searchingWorkerID==0}" @click="onTapWorkerListFilter(1)">所有人员</a>
                            <a class="btn" :class="{'select':filter==8&&searchingWorkerID==0}" @click="onTapWorkerListFilter(8)">空闲</a><br/>
                            <a class="btn" :class="{'select':filter==2&&searchingWorkerID==0}" @click="onTapWorkerListFilter(2)">发电</a>
                            <a class="btn" :class="{'select':filter==3&&searchingWorkerID==0}" @click="onTapWorkerListFilter(3)">挖矿</a>
                            <a class="btn" :class="{'select':filter==4&&searchingWorkerID==0}" @click="onTapWorkerListFilter(4)">交易</a>
                            <a class="btn" :class="{'select':filter==5&&searchingWorkerID==0}" @click="onTapWorkerListFilter(5)">终端维护</a><br/>
                            <a class="btn" :class="{'select':filter==6&&searchingWorkerID==0}" @click="onTapWorkerListFilter(6)">房间搜索</a>
                            <a class="btn" :class="{'select':filter==7&&searchingWorkerID==0}" @click="onTapWorkerListFilter(7)">人力搜索</a>
                        </div>
                    </div>
                    <div class="row">
                        <List title="人员列表" ref="workerList" :data="tempData.myWorkerList" :columns="WORKER_LIST_2_COLUMN" @onDoubleTap="onDoubleTapWorker" />
                    </div>
                </div>
                <!--市场-->
                <div class="tab-panel" v-show="state==5">
                    <div class="row no-margin">
                        <h2 class="room-name">市场</h2>
                    </div>
                    <div class="row no-margin">
                        <div class="index">
                            <div class="index-cell"><b>房间搜索点数: {{game.factoryList[0].rrp}}</b> <a class="btn btn-small" @click="onTapSearch(1)">花费所有点数搜索新房间</a></div>
                            <div class="index-cell"><b>人力搜索点数: {{game.factoryList[0].hrp}}</b> <a class="btn btn-small" @click="onTapSearch(2)">花费所有点数搜索新人员</a></div>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="row-column">
                            <List title="房间搜索人员" ref="rrList" :simple="true" option="+" :data="tempData.myRRList" :columns="WORKER_LIST_4_COLUMN" @onDoubleTap="onDoubleTapWorker" @onTapOption="onTapAddWorker(7)" />
                        </div>
                        <div class="row-column">
                            <List title="人力搜索人员" ref="hrList" :simple="true" option="+" :data="tempData.myHRList" :columns="WORKER_LIST_5_COLUMN" @onDoubleTap="onDoubleTapWorker" @onTapOption="onTapAddWorker(8)" />
                        </div>
                    </div>
                    <div class="no-margin">
                        <div class="index market">
                            <a class="btn" :class="{'select':marketType==1}" @click="onTapMarketType(1)">房间市场</a>
                            <a class="btn" :class="{'select':marketType==2}" @click="onTapMarketType(2)">人员市场</a>
                        </div>
                    </div>
                    <div class="row" v-if="marketType==1">
                        <List title="市场房间列表" ref="marketRoomList" :data="tempData.marketRoomList" :columns="ROOM_LIST_2_COLUMN" @onDoubleTap="onDoubleTapMarketRoom" />
                    </div>
                    <div class="row" v-if="marketType==2">
                        <List title="市场人员列表" ref="marketWorkerList" :data="tempData.marketWorkerList" :columns="WORKER_LIST_6_COLUMN" @onDoubleTap="onDoubleTapMarketWorker" />
                    </div>
                </div>
                <!--外交-->
                <div class="tab-panel" v-if="tempData.relationList" v-show="state==6">
                    <div class="row no-margin">
                        <h2 class="room-name">外交</h2>
                    </div>
                    <div class="row flex">
                        <List title="世界工厂列表" ref="relationList" :large="true" :data="tempData.relationList" :columns="RELATION_LIST_COLUMN" @onDoubleTap="onDoubleTapRelation" />
                    </div>
                </div>
                <!--工厂-->
                <div class="tab-panel" v-if="tempData.factory" v-show="state==7">
                    <div class="row no-margin">
                        <h1 class="room-name">{{tempData.factory.name}} <a class="btn btn-edit" @click="onTapEditFactory">操作</a></h1>
                        <h4 class="my-name">董事长：{{tempData.factory.boss.name}}</h4>
                    </div>
                    <div class="row no-margin">
                        <div class="index">
                            <div class="index-cell left"><b>总资金: {{tempData.factory.money}} $</b></div>
                            <div class="index-cell left"><b>形象: {{tempData.factory.image}}</b></div>
                            <div class="index-cell left"><b>投资: {{tempData.relation.invest}} $</b></div>
                            <div class="index-cell left pct-wrap"><b>支持率:</b>&nbsp;<div class="pct"><nut-progress :text-inside="true" :percentage="percent(tempData.relation.support,config.max_support)"></nut-progress></div></div>
                            <div class="index-cell"><b>外交员: <span v-if="tempData.joint">{{tempData.joint.name}} <a class="btn btn-icon" @click="jump(4,tempData.joint.id)" v-if="tempData.joint.name">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(9)">+</a>
                                <a v-if="tempData.joint&&tempData.joint.name" class="btn btn-icon" @click="onTapRemoveWorker(9)">-</a>
                            </b></div>
                            <div class="index-cell"><b>间谍: <span v-if="tempData.spy">{{tempData.spy.name}} <a class="btn btn-icon" @click="jump(4,tempData.spy.id)" v-if="tempData.spy.name">@</a></span>
                                <a class="btn btn-icon" @click="onTapAddWorker(10)">+</a>
                                <a v-if="tempData.spy&&tempData.spy.name" class="btn btn-icon" @click="onTapRemoveWorker(10)">-</a>
                            </b></div>
                        </div>
                    </div>
                    <div class="row">
                        <List title="房间列表" ref="factoryRoomList" :data="tempData.factoryRoomList" :columns="ROOM_LIST_4_COLUMN" @onDoubleTap="onDoubleTapFactoryRoom" />
                    </div>
                    <div class="row">
                        <List title="人员列表" ref="factoryWorkerList" :data="tempData.factoryWorkerList" :columns="WORKER_LIST_7_COLUMN" @onDoubleTap="onDoubleTapFactoryWorker" />
                    </div>
                </div>
                <!--报表-->
                <div class="tab-panel" v-show="state==8">
                    <div class="row no-margin">
                        <h2 class="room-name">经营报表</h2>
                    </div>
                    <div class="row log">
                        <nut-timeline>
                            <nut-timelineitem v-for="(item,index) in game.logList" :key="index">
                                <div class="title" slot="title">{{item.title}}</div>
                                <div class="sub-title" @click="onTapLog(item.id)">{{item.subTitle}}</div>
                            </nut-timelineitem>
                        </nut-timeline>
                        <!-- <List ref="logList" :data="game.logList" :onlyList="true" :columns="LOG_COLUMN" @onDoubleTap="onDoubleTapLog" /> -->
                    </div>
                </div>
            </div>
            <!--底部导航-->
            <div class="tab-wrap">
                <a class="btn btn-tab" :class="{'active':state==1}" @click="onTapTab(1)">工厂</a>
                <a class="btn btn-tab" :class="{'active':state==2}" @click="onTapTab(2)">房间</a>
                <a class="btn btn-tab" :class="{'active':state==3}" @click="onTapTab(3)">终端</a>
                <a class="btn btn-tab" :class="{'active':state==4}" @click="onTapTab(4)">人员</a>
                <a class="btn btn-tab" :class="{'active':state==5}" @click="onTapTab(5)">市场</a>
                <a class="btn btn-tab" :class="{'active':state==6||state==7}" @click="onTapTab(6)">外交</a>
                <a class="btn btn-tab" :class="{'active':state==8}" @click="onTapTab(8)">报表</a>
            </div>
        </div>
        <!--脚部-->
        <div class="footer">
            <div class="fact">
                <div class="fact-item">总资金：{{numFormat(game.factoryList[0].money)}} $</div>
                <div class="fact-item">工厂形象：{{numFormat(game.factoryList[0].image)}}</div>
            </div>
            <!-- <nut-button class="btn btn-save" @click="save">存档</nut-button> -->
            <nut-button class="btn btn-go" @click="onTapGo">第 {{day}} 周<br/>结束</nut-button>
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
                    <h3>等级 {{tempData.room.level}}</h3><a class="btn" v-if="tempData.room.level<config.max_room_level" @click="onTapRoomLevelUp">提升等级（{{config.room_levelup_cost[tempData.room.level-1]}} $）</a>
                </div>
                <div class="row risk">
                    <h3>策略:</h3>
                    <a class="risk-item" :class="{'select':tempData.room.risk==index}" v-for="index in [1,2,3]" @click="onTapRiskLevel(index)">{{config.risk_name_map[index-1]}}</a>
                </div>
                <div class="row risk">
                    <h3>全体命令:</h3>
                    <a class="risk-item" v-for="index in [0,1,2,3,4]" @click="onTapEntireOrder(index)">{{['待命','发电','挖矿','交易','维护'][index]}}</a>
                </div>
                <div class="row sell">
                    <a class="risk-item" @click="onTapSellRoom">出售</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showAssignPower">
            <div class="row pop-room-list" v-if="tempData.myPopRoomList&&tempData.room">
                <div class="row level">
                    <h3><p>分配电力</p><p>{{Math.floor(tempData.room.power*tempData.assignPowerPct/100)}}（{{tempData.assignPowerPct}}%）</p></h3>
                    <nut-slider class="input" v-model="tempData.assignPowerPct" :range="[0,100]" :showLabel="true" :stage="10" ></nut-slider>
                </div>
                <div class="row">
                    <List title="选择房间" ref="roomListPop" option="均匀分配" :data="tempData.myPopRoomList" :columns="ROOM_LIST_3_COLUMN" @onDoubleTap="onDoubleTapPopRoom" @onTapOption="onTapAvgAssign" />
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showEditTerminal">
            <div class="row room-board" v-if="tempData.terminal">
                <div class="row level">
                    <h3>供电等级 {{tempData.terminal.powerLevel}}</h3><a class="btn" v-if="tempData.terminal.powerLevel<config.max_terminal_level" @click="onTapTerminalLevelUp('power')">提升等级（{{config.power_levelup_cost[tempData.terminal.powerLevel-1]}} $）</a>
                </div>
                <div class="row level">
                    <h3>挖矿等级 {{tempData.terminal.digLevel}}</h3><a class="btn" v-if="tempData.terminal.digLevel<config.max_terminal_level" @click="onTapTerminalLevelUp('dig')">提升等级（{{config.dig_levelup_cost[tempData.terminal.digLevel-1]}} $）</a>
                </div>
                <div class="row level">
                    <h3>交易等级 {{tempData.terminal.tradeLevel}}</h3><a class="btn" v-if="tempData.terminal.tradeLevel<config.max_terminal_level" @click="onTapTerminalLevelUp('trade')">提升等级（{{config.trade_levelup_cost[tempData.terminal.tradeLevel-1]}} $）</a>
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
        <nut-popup v-model="showWorkerPop">
            <div class="row worker-board" v-if="tempData.myWorker">
                <div class="title">
                    <h3>{{tempData.myWorker.name}} <span v-if="tempData.myWorker.boss">董事长</span></h3>
                </div>
                <div class="item">
                    <h3>体力:</h3><span>{{tempData.myWorker.str}}</span>
                </div>
                <div class="item">
                    <h3>智力:</h3><span>{{tempData.myWorker.int}}</span>
                </div>
                <div class="item">
                    <h3>交流:</h3><span>{{tempData.myWorker.com}}</span>
                </div>
                <div class="item">
                    <h3>形象:</h3><span>{{tempData.myWorker.img}}</span>
                </div>
                <div class="item">
                    <h3>所属:</h3><span>{{tempData.myWorker.fname||'-'}} {{tempData.myWorker.rname||''}}</span>
                </div>
                <div class="item">
                    <h3>目标工厂:</h3><span>{{tempData.myWorker.tfname||'-'}}</span>
                </div>
                <div class="item">
                    <h3>职能:</h3><span>{{config.job_name_map[tempData.myWorker.job]||'-'}}</span>
                </div>
                <div class="item sell">
                    <a class="risk-item" v-if="tempData.myWorker.fid==game.factoryList[0].id&&tempData.myWorker.job!=0" @click="onTapRelease">解除职务</a>
                    <a class="risk-item" v-if="tempData.myWorker.id!=game.workerList[0].id&&tempData.myWorker.fid==game.factoryList[0].id" @click="onTapSellWorker">出售</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showWorkerList">
            <div class="row pop-worker-list">
                <List title="选择人员" ref="workerListPop" :data="tempData.myPopWorkerList" :columns="WORKER_LIST_COLUMN" :flag="'cho'" @onDoubleTap="onDoubleTapPopWorker" />
            </div>
        </nut-popup>
        <nut-popup v-model="showConfirmSellRoom">
            <div class="row room-board" v-if="tempData.room">
                <div class="row level">
                    <a class="btn" @click="onTapConfirmSellRoom">确认出售房间：{{tempData.room.name}}（{{tempData.room.sell||0}} $）</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showConfirmSellWorker">
            <div class="row room-board" v-if="tempData.myWorker">
                <div class="row level">
                    <a class="btn" @click="onTapConfirmSellWorker">确认出售人员：{{tempData.myWorker.name}}（{{tempData.myWorker.sell||0}} $）</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showConfirmBuyWorker">
            <div class="row worker-board" v-if="tempData.buyWorker">
                <div class="title">
                    <h3>{{tempData.buyWorker.name}}</h3>
                </div>
                <div class="item">
                    <h3>体力:</h3><span>{{tempData.buyWorker.str}}</span>
                </div>
                <div class="item">
                    <h3>智力:</h3><span>{{tempData.buyWorker.int}}</span>
                </div>
                <div class="item">
                    <h3>交流:</h3><span>{{tempData.buyWorker.com}}</span>
                </div>
                <div class="item">
                    <h3>形象:</h3><span>{{tempData.buyWorker.img}}</span>
                </div>
                <div class="item sell">
                    <a class="risk-item" @click="onTapBuyWorker">购买（{{tempData.buyWorker.price}} $）</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showConfirmBuyRoom">
            <div class="row worker-board" v-if="tempData.buyRoom">
                <div class="title">
                    <h3>{{tempData.buyRoom.name}}</h3>
                </div>
                <div class="item">
                    <h3>基础门面:</h3><span>{{tempData.buyRoom.basicImage}}</span>
                </div>
                <div class="item">
                    <h3>老化:</h3><span>{{percent(tempData.buyRoom.durab,config.max_durab)}}%</span>
                </div>
                <div class="item sell">
                    <a class="risk-item" @click="onTapBuyRoom">购买（{{tempData.buyRoom.price}}$）</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showStealRoom">
            <div class="row worker-board" v-if="tempData.stealRoom">
                <div class="title">
                    <h3>{{tempData.stealRoom.name}}</h3>
                </div>
                <div class="item">
                    <h3>电力:</h3><span>{{tempData.stealRoom.power}}</span>
                </div>
                <div class="item">
                    <h3>基础门面:</h3><span>{{tempData.stealRoom.basicImage}}</span>
                </div>
                <div class="item">
                    <h3>老化:</h3><span>{{percent(tempData.stealRoom.durab,config.max_durab)}}%</span>
                </div>
                <div class="item">
                    <h3>自动化:</h3><span>{{percent(tempData.stealRoom.auto,config.max_auto)}}%</span>
                </div>
                <div class="item">
                    <h3>等级:</h3><span>LV.{{tempData.stealRoom.level}}</span>
                </div>
                <div class="item sell">
                    <a class="risk-item" @click="onTapStealRoom">偷取房间</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showStealWorker">
            <div class="row worker-board" v-if="tempData.stealWorker">
                <div class="title">
                    <h3>{{tempData.stealWorker.name}} <span v-if="tempData.stealWorker.boss">董事长</span></h3>
                </div>
                <div class="item">
                    <h3>体力:</h3><span>{{tempData.stealWorker.str}}</span>
                </div>
                <div class="item">
                    <h3>智力:</h3><span>{{tempData.stealWorker.int}}</span>
                </div>
                <div class="item">
                    <h3>交流:</h3><span>{{tempData.stealWorker.com}}</span>
                </div>
                <div class="item">
                    <h3>形象:</h3><span>{{tempData.stealWorker.img}}</span>
                </div>
                <div class="item sell" v-if="!tempData.stealWorker.boss">
                    <a class="risk-item" @click="onTapStealWorker">偷取人员</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showEditFactory">
            <div class="row room-board" v-if="tempData.factory">
                <div class="row btn">
                    <a class="risk-item" @click="onTapInvest"><b>投资</b></a>
                </div>
                <div class="row btn" v-if="!tempData.factory.damaged">
                    <a class="risk-item" @click="onTapDamageFactory"><b>打压（{{config.damage_money_cost}} $）</b></a>
                </div>
                <div class="row btn">
                    <a class="risk-item" @click="onTapBuyFactory"><b>收购（{{tempData.factory.sell}} $）</b></a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showInvest">
            <div class="row room-board" v-if="tempData.factory">
                <div class="row">
                    <nut-textinput placeholder="输入投资金额" v-model="tempData.investMoney" />
                    <nut-numberkeyboard :visible="showKeyborad" v-model="tempData.investMoney" maxlength="8" @close="showKeyborad=false"></nut-numberkeyboard>
                </div>
                <div class="row sell">
                    <a class="risk-item" @click="onTapConfirmInvest">确认投资</a>
                </div>
            </div>
        </nut-popup>
        <nut-popup v-model="showLog">
            <div class="row log-board" v-if="tempData.log">
                <div class="title">
                    <h3>{{tempData.log.title}}</h3>
                </div>
                <div class="para" v-html="tempData.log.content"></div>
            </div>
        </nut-popup>
    </div>
</template>

<script>
import List from '../components/List'
import { query, r, bulbsort, getParentNode, numFormat, avg, percent, getListByID, getMatchList, removeFromList, genRandomWorkerName, genRandomRoomName, genRandomFactoryName, genRandomRoom, genRandomWorker, genRandomTerminal, releaseAllByJob } from '../tools/utils';
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
            filter: 1, // 人员列表页过滤器
            marketType: 1, // 市场页搜索类型
            tempData: {
                myFactoryList: [],
                // 首页
                myRoomList: [],
                imageAgent: {},

                // 房间页
                room: null,
                myPopRoomList: [],
                assignPowerPct: 0,
                myTerminalList: [],
                myRoomWorkerList: [],

                // 终端页
                terminal: null,

                // 员工页
                myWorkerList: [],

                // 员工详情弹窗
                myWorker: null,

                // 弹窗员工列表
                myPopWorkerList: [],

                // 市场
                marketRoomList: [],
                marketWorkerList: [],
                myRRList: [],
                myHRList: [],
                buyRoom: null,
                buyWorker: null,

                // 外交
                relationList: [],
                relation: null,

                // 工厂
                factory: null,
                joint: null,
                spy: null,
                factoryRoomList: [],
                factoryWorkerList: [],
                stealRoom: null,
                stealWorker: null,
                investMoney: '',

                // 报表
                log: null,

                workListPopMode: 0,
            },
            config: CONFIG,

            searchingRoomID: '', // 当前搜索的房间ID
            searchingTerminalID: '', // 当前搜索的终端ID
            searchingWorkerID: '', // 当前搜索的人员ID
            searchingFactoryID: '', // 当前搜索的工厂ID

            // 弹出层
            showSystemMenu: false,
            showEditFactoryName: false,
            showEditRoom: false,
            showAssignPower: false,
            showEditTerminal: false,
            showWorkerList: false,
            showJobPop: false,
            showWorkerPop: false,
            showConfirmSellRoom: false,
            showConfirmSellWorker: false,
            showConfirmSellWorker: false,
            showConfirmBuyRoom: false,
            showConfirmBuyWorker: false,
            showEditFactory: false,
            showStealRoom: false,
            showStealWorker: false,
            showInvest: false,
            showLog: false,
            showKeyborad: false,

            // const
            ROOM_LIST_COLUMN: [ // 房间页房间列表
                {name:'id',title:'ID',width:'10%',},
                {name:'name',title:'房间名',width:'25%',},
                {name:'power',title:'电力',width:'12%',},
                {name:'durab',title:'老化',width:'12%',format:v=>`${percent(v,CONFIG.max_durab)}%`,},
                {name:'risk',title:'策略',width:'8%',format:v=>`${CONFIG.risk_name_map[v-1]}`,},
                {name:'auto',title:'自动化',width:'13%',format:v=>`${percent(v,CONFIG.max_auto)}%`,},
                {name:'basicImage',title:'基门',width:'10%',},
                {name:'level',title:'等级',width:'10%',format:v=>`LV.${v}`,},
            ],
            ROOM_LIST_2_COLUMN: [ // 市场页房间列表
                {name:'id',title:'ID',width:'0',},
                {name:'name',title:'房间名',width:'25%',},
                {name:'basicImage',title:'基础门面',width:'25%',},
                {name:'durab',title:'老化',width:'25%',format:v=>`${percent(v,CONFIG.max_durab)}%`,},
                {name:'price',title:'售价',width:'25%',},
            ],
            ROOM_LIST_3_COLUMN: [ // 房间页弹出房间列表
                {name:'id',title:'ID',width:'15%',},
                {name:'name',title:'房间名',width:'60%',},
                {name:'power',title:'电力',width:'25%',},
            ],
            ROOM_LIST_4_COLUMN: [ // 工厂页房间列表
                {name:'name',title:'房间名',width:'30%',},
                {name:'power',title:'电力',width:'15%',},
                {name:'durab',title:'老化',width:'15%',format:v=>`${percent(v,CONFIG.max_durab)}%`,},
                {name:'auto',title:'自动化',width:'15%',format:v=>`${percent(v,CONFIG.max_auto)}%`,},
                {name:'basicImage',title:'基门',width:'15%',},
                {name:'level',title:'等级',width:'10%',format:v=>`LV.${v}`,},
            ],
            TERMINAL_LIST_COLUMN: [
                {name:'id',title:'ID',width:'.7rem',},
                {name:'powerLevel',title:'供电Lv',width:'1.2rem',format:v=>`LV.${v}`,},
                {name:'digLevel',title:'挖矿Lv',width:'1.2rem',format:v=>`LV.${v}`,},
                {name:'tradeLevel',title:'交易Lv',width:'1.2rem',format:v=>`LV.${v}`,},
                {name:'durab',title:'老化',width:'.7rem',format:v=>`${percent(v,CONFIG.max_durab)}%`,},
                {name:'workerName',title:'工人',width:'1rem',format:v=>`${v||'-'}`},
                {name:'job',title:'运行',width:'1rem',format:v=>`${v||'-'}`},
                {name:'workerStr',title:'体力',width:'.9rem',format:v=>`${v||'-'}`},
                {name:'workerInt',title:'智力',width:'.9rem',format:v=>`${v||'-'}`},
                {name:'workerCom',title:'交流',width:'.9rem',format:v=>`${v||'-'}`},
                {name:'workerImg',title:'形象',width:'.9rem',format:v=>`${v||'-'}`},
            ],
            WORKER_LIST_COLUMN: [ // 弹窗人员列表
                {name:'id',title:'ID',width:'10%',},
                {name:'name',title:'名字',width:'17%',},
                {name:'str',title:'体力',width:'12%',},
                {name:'int',title:'智力',width:'12%',},
                {name:'com',title:'交流',width:'12%',},
                {name:'img',title:'形象',width:'12%',},
                {name:'job',title:'职能',width:'25%',format:v=>`${CONFIG.job_name_map[v]}`,},
            ],
            WORKER_LIST_2_COLUMN: [ // 人员列表
                {name:'id',title:'ID',width:'8%',},
                {name:'name',title:'名字',width:'15%',},
                {name:'str',title:'体力',width:'8%',},
                {name:'int',title:'智力',width:'8%',},
                {name:'com',title:'交流',width:'8%',},
                {name:'img',title:'形象',width:'8%',},
                {name:'rname',title:'房间',width:'30%',format:v=>`${v||'-'}`,},
                {name:'job',title:'职能',width:'11%',format:v=>`${CONFIG.job_name_map[v]}`,},
            ],
            WORKER_LIST_3_COLUMN: [ // 房间人员列表
                {name:'id',title:'ID',width:'0',},
                {name:'name',title:'名字',width:'50%',},
                {name:'job',title:'职能',width:'50%',format:v=>`${CONFIG.job_name_map[v]}`,},
            ],
            WORKER_LIST_4_COLUMN: [ // 房间搜索人员列表
                {name:'id',title:'ID',width:'0',},
                {name:'name',title:'名字',width:'50%',},
                {name:'str',title:'体力',width:'25%',},
                {name:'int',title:'智力',width:'25%',},
            ],
            WORKER_LIST_5_COLUMN: [ // 人力搜索人员列表
                {name:'id',title:'ID',width:'0',},
                {name:'name',title:'名字',width:'50%',},
                {name:'com',title:'交流',width:'25%',},
                {name:'img',title:'形象',width:'25%',},
            ],
            WORKER_LIST_6_COLUMN: [ // 市场页人员列表
                {name:'id',title:'ID',width:'0',},
                {name:'name',title:'名字',width:'26%',},
                {name:'str',title:'体力',width:'12%',},
                {name:'int',title:'智力',width:'12%',},
                {name:'com',title:'交流',width:'12%',},
                {name:'img',title:'形象',width:'12%',},
                {name:'price',title:'售价',width:'26%',},
            ],
            WORKER_LIST_7_COLUMN: [ // 市场页人员列表
                {name:'name',title:'名字',width:'28%',},
                {name:'str',title:'体力',width:'18%',},
                {name:'int',title:'智力',width:'18%',},
                {name:'com',title:'交流',width:'18%',},
                {name:'img',title:'形象',width:'18%',},
            ],
            RELATION_LIST_COLUMN: [ // 外交关系列表
                {name:'toName',title:'工厂名',width:'25%',},
                {name:'money',title:'总资金',width:'15%',},
                {name:'image',title:'形象',width:'10%',},
                {name:'invest',title:'投资',width:'15%',},
                {name:'support',title:'支持率',width:'10%',format:v=>`${percent(v,CONFIG.max_support)}%`,},
                {name:'jointName',title:'外交员',width:'12.5%',format:v=>`${v||'-'}`,},
                {name:'spyName',title:'间谍',width:'12.5%',format:v=>`${v||'-'}`,},
            ],
        };
    },
    mounted(){
        if(DEBUG){
            window.GLOBAL = JSON.parse('{"game":{"factoryList":[{"id":4,"name":"和矿控股","money":100000,"image":0,"hrp":1600,"rrp":2350},{"id":5,"name":"亚光集团","money":38478,"image":483},{"id":6,"name":"洲复传媒","money":8316,"image":629}],"roomList":[{"id":5,"fid":4,"fname":"和矿控股","name":"新汇小区通用房","power":50,"durab":0,"risk":1,"auto":0,"level":1,"type":0,"basicImage":15},{"id":6,"fid":5,"fname":"亚光集团","name":"星乐路通用房","type":0,"basicImage":0,"power":7615,"durab":8127,"risk":2,"auto":2948,"level":2},{"id":7,"fid":5,"fname":"亚光集团","name":"国惠园交易所","type":3,"basicImage":0,"power":1279,"durab":1292,"risk":2,"auto":3528,"level":1},{"id":8,"fid":5,"fname":"亚光集团","name":"漫宇大厦挖矿厂","type":2,"basicImage":0,"power":4325,"durab":1788,"risk":2,"auto":8668,"level":3},{"id":9,"fid":6,"fname":"洲复传媒","name":"柯牛路发电站","type":1,"basicImage":0,"power":230,"durab":4761,"risk":2,"auto":2589,"level":3},{"id":10,"fid":6,"fname":"洲复传媒","name":"凡财街发电站","type":1,"basicImage":0,"power":7099,"durab":4002,"risk":1,"auto":4416,"level":1},{"id":11,"fid":6,"fname":"洲复传媒","name":"亚金镇挖矿厂","type":2,"basicImage":0,"power":1818,"durab":3997,"risk":2,"auto":2625,"level":2}],"terminalList":[{"id":25,"fid":4,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":26,"fid":4,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":27,"fid":4,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":28,"fid":4,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":29,"fid":4,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":30,"fid":4,"rid":5,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":31,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":32,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":33,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":34,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":35,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":36,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":37,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":38,"fid":5,"rid":6,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":39,"fid":5,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":40,"fid":5,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":41,"fid":5,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":42,"fid":5,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":43,"fid":5,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":44,"fid":5,"rid":7,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":45,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":46,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":47,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":48,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":49,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":50,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":51,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":52,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":53,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":54,"fid":5,"rid":8,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":55,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":56,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":57,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":58,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":59,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":60,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":61,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":62,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":63,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":64,"fid":6,"rid":9,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":65,"fid":6,"rid":10,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":66,"fid":6,"rid":10,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":67,"fid":6,"rid":10,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":68,"fid":6,"rid":10,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":69,"fid":6,"rid":10,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":70,"fid":6,"rid":10,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":71,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":72,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":73,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":74,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":75,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":76,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":77,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1},{"id":78,"fid":6,"rid":11,"durab":0,"powerLevel":1,"digLevel":1,"tradeLevel":1}],"workerList":[{"id":14,"tid":0,"rid":0,"fid":4,"fname":"和矿控股","rname":"","tfname":"","tfid":0,"name":"王可","str":72,"int":25,"com":11,"img":90,"job":0,"boss":true},{"id":15,"fid":4,"fname":"和矿控股","rid":0,"rname":"","tid":0,"tfid":0,"ftname":"","name":"滑儿凝","str":31,"int":35,"com":78,"img":13,"job":0,"boss":false},{"id":16,"fid":4,"fname":"和矿控股","rid":0,"rname":"","tid":0,"tfid":0,"ftname":"","name":"孙昊智","str":38,"int":32,"com":42,"img":35,"job":0,"boss":false},{"id":17,"fid":5,"fname":"亚光集团","rid":6,"rname":"星乐路通用房","tid":0,"tfid":0,"ftname":"","name":"诸丘","str":27,"int":91,"com":58,"img":19,"job":0,"boss":true},{"id":18,"fid":5,"fname":"亚光集团","rid":6,"rname":"星乐路通用房","tid":0,"tfid":0,"ftname":"","name":"周菱莲","str":6,"int":24,"com":43,"img":32,"job":0,"boss":false},{"id":19,"fid":5,"fname":"亚光集团","rid":6,"rname":"星乐路通用房","tid":0,"tfid":0,"ftname":"","name":"莫宛莫","str":87,"int":15,"com":68,"img":25,"job":0,"boss":false},{"id":20,"fid":5,"fname":"亚光集团","rid":6,"rname":"星乐路通用房","tid":0,"tfid":0,"ftname":"","name":"姚春风","str":15,"int":42,"com":18,"img":49,"job":0,"boss":false},{"id":21,"fid":5,"fname":"亚光集团","rid":7,"rname":"国惠园交易所","tid":0,"tfid":0,"ftname":"","name":"毛硕云","str":41,"int":27,"com":3,"img":34,"job":0,"boss":false},{"id":22,"fid":5,"fname":"亚光集团","rid":7,"rname":"国惠园交易所","tid":0,"tfid":0,"ftname":"","name":"蒋咏亦","str":10,"int":39,"com":4,"img":50,"job":0,"boss":false},{"id":23,"fid":5,"fname":"亚光集团","rid":7,"rname":"国惠园交易所","tid":0,"tfid":0,"ftname":"","name":"刘奕","str":8,"int":12,"com":42,"img":5,"job":0,"boss":false},{"id":24,"fid":5,"fname":"亚光集团","rid":7,"rname":"国惠园交易所","tid":0,"tfid":0,"ftname":"","name":"伏蕊养","str":49,"int":37,"com":50,"img":26,"job":0,"boss":false},{"id":25,"fid":5,"fname":"亚光集团","rid":7,"rname":"国惠园交易所","tid":0,"tfid":0,"ftname":"","name":"王语安","str":15,"int":6,"com":12,"img":62,"job":0,"boss":false},{"id":26,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"陈藩满","str":48,"int":11,"com":4,"img":59,"job":0,"boss":false},{"id":27,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"廖蕾","str":11,"int":33,"com":33,"img":59,"job":0,"boss":false},{"id":28,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"陈衷意","str":12,"int":33,"com":17,"img":2,"job":0,"boss":false},{"id":29,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"邓美菅","str":20,"int":68,"com":24,"img":12,"job":0,"boss":false},{"id":30,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"周璇","str":82,"int":2,"com":24,"img":49,"job":0,"boss":false},{"id":31,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"裴彤敏","str":6,"int":12,"com":22,"img":43,"job":0,"boss":false},{"id":32,"fid":5,"fname":"亚光集团","rid":8,"rname":"漫宇大厦挖矿厂","tid":0,"tfid":0,"ftname":"","name":"欧阳水慧","str":3,"int":48,"com":81,"img":25,"job":0,"boss":false},{"id":33,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"刘才城","str":69,"int":66,"com":76,"img":36,"job":0,"boss":true},{"id":34,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"顾悦蕊","str":22,"int":60,"com":48,"img":5,"job":0,"boss":false},{"id":35,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"祝闻","str":25,"int":73,"com":64,"img":11,"job":0,"boss":false},{"id":36,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"汲佘慕","str":6,"int":40,"com":31,"img":5,"job":0,"boss":false},{"id":37,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"房闾","str":21,"int":44,"com":44,"img":1,"job":0,"boss":false},{"id":38,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"刘兰","str":44,"int":8,"com":14,"img":57,"job":0,"boss":false},{"id":39,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"管涵龙","str":89,"int":32,"com":67,"img":35,"job":0,"boss":false},{"id":40,"fid":6,"fname":"洲复传媒","rid":9,"rname":"柯牛路发电站","tid":0,"tfid":0,"ftname":"","name":"江露盼","str":26,"int":36,"com":15,"img":62,"job":0,"boss":false},{"id":41,"fid":6,"fname":"洲复传媒","rid":10,"rname":"凡财街发电站","tid":0,"tfid":0,"ftname":"","name":"陈蕴","str":30,"int":48,"com":40,"img":29,"job":0,"boss":false},{"id":42,"fid":6,"fname":"洲复传媒","rid":10,"rname":"凡财街发电站","tid":0,"tfid":0,"ftname":"","name":"周叶琦","str":9,"int":11,"com":18,"img":48,"job":0,"boss":false},{"id":43,"fid":6,"fname":"洲复传媒","rid":10,"rname":"凡财街发电站","tid":0,"tfid":0,"ftname":"","name":"陈尔","str":59,"int":14,"com":36,"img":37,"job":0,"boss":false},{"id":44,"fid":6,"fname":"洲复传媒","rid":10,"rname":"凡财街发电站","tid":0,"tfid":0,"ftname":"","name":"江央焦","str":49,"int":50,"com":33,"img":5,"job":0,"boss":false},{"id":45,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"陈越优","str":94,"int":54,"com":86,"img":64,"job":0,"boss":false},{"id":46,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"李泽瑶","str":88,"int":33,"com":11,"img":1,"job":0,"boss":false},{"id":47,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"李懿淑","str":79,"int":29,"com":41,"img":15,"job":0,"boss":false},{"id":48,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"廖海闻","str":59,"int":88,"com":46,"img":34,"job":0,"boss":false},{"id":49,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"宦吉竹","str":23,"int":48,"com":32,"img":47,"job":0,"boss":false},{"id":50,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"龙乐井","str":46,"int":36,"com":31,"img":11,"job":0,"boss":false},{"id":51,"fid":6,"fname":"洲复传媒","rid":11,"rname":"亚金镇挖矿厂","tid":0,"tfid":0,"ftname":"","name":"张明红","str":95,"int":53,"com":25,"img":15,"job":0,"boss":false}],"relationList":[{"id":"10","from":4,"fromName":"和矿控股","to":5,"toName":"亚光集团","invest":0,"support":0,"jointID":0,"jointName":"","spyID":0,"spyName":""},{"id":"20","from":4,"fromName":"和矿控股","to":6,"toName":"洲复传媒","invest":0,"support":0,"jointID":0,"jointName":"","spyID":0,"spyName":""},{"id":"01","from":5,"fromName":"亚光集团","to":4,"toName":"和矿控股","invest":0,"support":0,"jointID":0,"jointName":"","spyID":0,"spyName":""},{"id":"21","from":5,"fromName":"亚光集团","to":6,"toName":"洲复传媒","invest":0,"support":0},{"id":"02","from":6,"fromName":"洲复传媒","to":4,"toName":"和矿控股","invest":0,"support":0},{"id":"12","from":6,"fromName":"洲复传媒","to":5,"toName":"亚光集团","invest":0,"support":0}],"logList":[]},"accFactoryID":7,"accRoomID":12,"accTerminalID":79,"accWorkerID":52,"day":1}');
        }
        /*{"title":"第2周","id":2,"content":"总收入增加：44&nbsp;&nbsp;&nbsp;&nbsp;总形象增加：5<br/><hr/><br/>春熙路：<br/>收入增加：24&nbsp;&nbsp;&nbsp;&nbsp;形象增加：0<br/><hr/><br/>杰宝路：<br/>收入增加：20&nbsp;&nbsp;&nbsp;&nbsp;形象增加：5"},{"title":"第1周","id":1,"content":"<b>总收入增加</b>：31&nbsp;&nbsp;&nbsp;&nbsp;<b>总形象增加</b>：6<br/><hr/><br/>春熙路：<br/>收入增加 19&nbsp;&nbsp;&nbsp;&nbsp;形象增加：1<br/><hr/><br/>杰宝路：<br/>收入增加：12&nbsp;&nbsp;&nbsp;&nbsp;形象增加：5"}*/
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
        releaseWorker(worker,stayRoom){ // 解除职务
            if(worker){
                worker.job = 0;
                worker.tid = 0;
                if(!stayRoom){
                    worker.rid = 0;
                    worker.rname = '';
                }
                worker.tfid = 0;
                worker.ftname = '';
            }
        },
        calcBalance(myRoomWorkerList){ // 计算协调
            let manager, // 房间管理员
                myWorkerList = []; // 房间内正在终端工作的人员列表
            for(let worker of myRoomWorkerList){
                if(worker.job==1||worker.job==2||worker.job==3||worker.job==4){
                    myWorkerList.push(worker);
                }
                else if(worker.job==7){
                    manager = worker;
                }
            }
            let balance = 0;
            if(myWorkerList.length==1){
                balance = 100;
            }
            else if(manager&&myWorkerList.length>1){
                balance = avg([manager.com,manager.com,manager.com,manager.img,manager.img,manager.int]); // 3点交流，2点形象，1点智力
            }
            else if(myWorkerList.length>1){
                balance = avg(myWorkerList,'com');
            }
            return balance;
        },
        percent(val,max){ // 百分比显示
            return percent(val,max);
        },
        calcRoomValue(room){ // 计算房间价格
            return 350;
        },
        calcWorkerValue(worker){ // 计算人员价格
            return 50;
        },
        calcFactoryValue(factory){ // 计算工厂价格
            return 1200;
        },
        acquireRoom(room){ // 收纳房间
            let myFactory = this.game.factoryList[0],
                troom = getListByID(room.id,'id',this.game.roomList)[0],
                terminalList = getListByID(troom.id,'rid',this.game.terminalList),
                workerList = getListByID(troom.id,'rid',this.game.workerList);
            for(let terminal of terminalList){
                terminal.fid = myFactory.id;
            }
            for(let worker of workerList){
                worker.rid = 0;
                worker.rname = '';
                worker.tid = 0;
                worker.job = 0;
            }
            troom.fid = myFactory.id;
            troom.fname = myFactory.name;
        },
        acquireWorker(worker){ // 收纳人员
            let myFactory = this.game.factoryList[0],
                tworker = getListByID(worker.id,'id',this.game.workerList)[0];
            tworker.fid = myFactory.id;
            tworker.fname = myFactory.name;
            tworker.rid = 0;
            tworker.rname = '';
            tworker.tid = 0;
            tworker.tfid = 0;
            tworker.tfname = '';
            tworker.job = 0;
            tworker.boss = false;
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
            console.log('进入下一周');
        },

        onTapTab(index){ // 点击【标签页码】
            if((index==2&&!this.tempData.room)
                ||(index==3&&!this.tempData.terminal)){
                return ;
            }
            else{
                if(index==2&&this.searchingRoomID){
                    this.jump(index,this.searchingRoomID);
                }
                else if(index==3&&this.searchingTerminalID){
                    this.jump(index,this.searchingTerminalID);
                }
                else if(index==4&&this.searchingWorkerID){
                    this.jump(index,this.searchingWorkerID);
                }
                else{
                    this.jump(index);
                }
            }
        },
        onTapEditFactoryName(){ // 点击【编辑工厂名】按钮
            this.showEditFactoryName = true;
        },
        onTapRoomLevelUp(){ // 点击【房间升级】按钮
            let rid = (this.tempData.room||{}).id,
                tid = (this.tempData.terminal||{}).id,
                room = getListByID(rid,'id',this.game.roomList)[0],
                cost = this.config.room_levelup_cost[room.level-1];
            if(room.level<this.config.max_room_level){
                if(this.game.factoryList[0].money>=cost){
                    this.game.factoryList[0].money -= cost;
                    room.level += 1;
                    let addition = CONFIG.terminal_count_distribution[room.level-1]-this.tempData.myTerminalList.length;
                    for(let i=0;i<addition;i++){
                        this.game.terminalList.push({
                            id: window.GLOBAL.accTerminalID++,
                            fid: this.game.factoryList[0].id,
                            rid: room.id,
                        	durab: CONFIG.init.terminalDurab,
                        	powerLevel: CONFIG.init.terminalPowerLevel,
                        	digLevel: CONFIG.init.terminalDigLevel,
                        	tradeLevel: CONFIG.init.terminalTradeLevel,
                        });
                    }
                    this.asynAllPages();
                }
                else{
                    this.$toast.text('资金不够');
                }
            }
        },
        onTapTerminalLevelUp(type){ // 点击【终端升级】按钮
            let rid = this.tempData.terminal.room.id,
                tid = this.tempData.terminal.id,
                terminal = getListByID(tid,'id',this.game.terminalList)[0];
            if(terminal){
                let level = terminal[type+'Level'];
                if(level<this.config.max_terminal_level){
                    let cost = this.config[type+'_levelup_cost'][level-1];
                    if(this.game.factoryList[0].money>=cost){
                        this.game.factoryList[0].money -= cost;
                        terminal[type+'Level'] += 1;
                        this.asynAllPages();
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
            this.asynAllPages();
        },
        onTapAddWorker(mode){ // 点击【+】按钮
            this.tempData.workListPopMode = mode;
            this.showWorkerList = true;
            this.asynAllPages();
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
                    releaseAllByJob(11,getListByID(1,'fid',this.game.workerList));
                break;
                case 2: // 房间-管理员
                    releaseAllByJob(7,roomWorkerList);
                break;
                case 3: // 房间-维护工人
                    releaseAllByJob(6,roomWorkerList);
                break;
                case 4: // 房间-公关
                    releaseAllByJob(8,roomWorkerList);
                break;
                case 5: // 房间-自动化工人
                    releaseAllByJob(5,roomWorkerList);
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
                case 9: // 工厂-对接员
                    if(this.tempData.factory){
                        let oworker = getMatchList(this.game.workerList,[['tfid',this.tempData.factory.id],['job',12],['fid',this.game.factoryList[0].id]])[0];
                        if(oworker){
                            oworker.job = 0;
                            oworker.tfid = 0;
                            oworker.tfname = '';
                        }
                    }
                break;
                case 10: // 工厂-间谍
                    if(this.tempData.factory){
                        let oworker = getMatchList(this.game.workerList,[['tfid',this.tempData.factory.id],['job',13],['fid',this.game.factoryList[0].id]])[0];
                        if(oworker){
                            oworker.job = 0;
                            oworker.tfid = 0;
                            oworker.tfname = '';
                        }
                    }
                break;
            }
            this.asynAllPages();
        },
        onTapAddJob(){ // 点击【职能+】按钮
            this.showJobPop = true;
        },
        onTapSellRoom(){ // 点击【出售房间】按钮
            this.tempData.room.sell = this.calcRoomValue(this.tempData.room)*CONFIG.sell_factor;
            this.showConfirmSellRoom = true;
        },
        onTapSellWorker(){ // 点击【出售人员】按钮
            this.tempData.myWorker.sell = this.calcWorkerValue(this.tempData.myWorker)*CONFIG.sell_factor;
            this.showConfirmSellWorker = true;
        },
        onTapConfirmSellRoom(){ // 点击【确认出售房间】按钮
            let room = getListByID(this.tempData.room.id,'id',this.game.roomList)[0],
                workerList = getListByID(room.id,'rid',this.game.workerList);
            room.fid = 0;
            room.fname = '';
            for(let i=0;i<workerList.length;i++){ // 解除该房间内所有员工的职务
                let worker = workerList[i];
                this.releaseWorker(worker);
            }
            this.game.factoryList[0].money += this.tempData.room.sell;
            this.showEditRoom = false;
            this.showConfirmSellRoom = false;
            if(this.searchingRoomID==room.id){
                this.searchingRoomID = 0;
            }
            this.searchingTerminalID = 0;
            this.asynAllPages();
            this.jump(1);
        },
        onTapConfirmSellWorker(){ // 点击【确认出售人员】按钮
            let worker = getListByID(this.tempData.myWorker.id,'id',this.game.workerList)[0];
            worker.fid = 0;
            worker.fname = '';
            this.releaseWorker(worker);
            this.game.factoryList[0].money += this.tempData.myWorker.sell;
            this.showWorkerPop = false;
            this.showConfirmSellWorker = false;
            this.asynAllPages();
        },
        onTapJob(index){ // 点击【职能】按钮
            let tid = (this.tempData.terminal||{}).id,
                worker = getListByID(tid,'tid',this.game.workerList)[0];
            if(worker){
                worker.job = index;
            }
            this.asynAllPages();
            this.showJobPop = false;
        },
        onTapEntireOrder(index){ // 点击【房间全体命令】按钮
            let targetJob = [0,1,2,3,4][index]||0,
                rid = (this.tempData.room||{}).id,
                tid = (this.tempData.terminal||{}).id,
                roomWorkerList = getListByID(rid,'rid',this.game.workerList),
                myRoomWorkerList = [...roomWorkerList];
            for(let worker of myRoomWorkerList){
                if(worker.tid!=0)
                    worker.job = targetJob;
            }
            this.showEditRoom = false;
            this.asynAllPages();
        },
        onTapRelease(){ // 点击【解除职务】按钮
            let worker = getListByID(this.tempData.myWorker.id,'id',this.game.workerList)[0];
            this.releaseWorker(worker);
            this.asynAllPages();
            this.showWorkerPop = false;
        },
        onTapWorkerListFilter(mode){ // 点击【人员列表过滤】按钮
            let workerList = getListByID(this.game.factoryList[0].id,'fid',this.game.workerList),
                tempWorkerList = [...workerList],
                myWorkerList;
            this.filter = mode;
            this.searchingWorkerID = 0;
            if(mode!=1){
                myWorkerList = getListByID([1,2,3,4,10,9,0][mode-2],'job',tempWorkerList);
                this.tempData.myWorkerList = myWorkerList;
                setTimeout(e=>{
                    this.$refs.workerList&&this.$refs.workerList.asyn();
                },1000*.1);
            }
            else{
                this.asynAllPages();
            }
        },
        onTapMarketType(type){ // 点击【市场类型】按钮
            this.marketType = type;
            this.asynAllPages();
        },
        onTapSearch(type){ // 点击【搜索】按钮
            let factory = this.game.factoryList[0];
            if(type==1){ // 搜索房间
                let point = factory.rrp;
                if(point<CONFIG.searchRoomPointCost){
                    this.$toast.text(`搜索点数不够（需${CONFIG.searchRoomPointCost}点）`);
                }
                else{ // 生成新房间
                    let count = Math.floor(point/CONFIG.searchRoomPointCost),
                        mod = point%CONFIG.searchRoomPointCost;
                    factory.rrp = mod;
                    for(let i=0;i<count;i++){
                        let newRoom = genRandomRoom(window.GLOBAL.accRoomID++,{fid:0,risk:2,power:0,level:1,auto:r(CONFIG.randmNewRoomAutoRange[0],CONFIG.randmNewRoomAutoRange[1]),durab:r(CONFIG.randmNewRoomDurabRange[0],CONFIG.randmNewRoomDurabRange[1])});
                        this.game.roomList.push(newRoom);
                        for(let t=0;t<CONFIG.terminal_count_distribution[newRoom.level-1];t++){ // 生成新终端
                            this.game.terminalList.push({
                                id: window.GLOBAL.accTerminalID++,
                                fid: newRoom.fid,
                                rid: newRoom.id,
                            	durab: CONFIG.init.terminalDurab,
                            	powerLevel: CONFIG.init.terminalPowerLevel,
                            	digLevel: CONFIG.init.terminalDigLevel,
                            	tradeLevel: CONFIG.init.terminalTradeLevel,
                            });
                        }
                    }
                }
            }
            else if(type==2){ // 搜索人员
               let point = factory.hrp;
               if(point<CONFIG.searchWorkerPointCost){
                   this.$toast.text(`搜索点数不够（需${CONFIG.searchWorkerPointCost}点）`);
               }
               else{ // 生成新人员
                   let count = Math.floor(point/CONFIG.searchWorkerPointCost),
                       mod = point%CONFIG.searchWorkerPointCost;
                   factory.hrp = mod;
                   for(let i=0;i<count;i++){
                       this.game.workerList.push(genRandomWorker(window.GLOBAL.accWorkerID++,{fid:0,}));
                   }
               }
            }
            this.marketType = type;
            this.asynAllPages();
        },
        onTapBuyRoom(){ // 点击【购买房间】按钮
            let factory = this.game.factoryList[0],
                buyRoom = getListByID(this.tempData.buyRoom.id,'id',this.game.roomList)[0];
            buyRoom.fid = factory.id;
            buyRoom.fname = factory.name;
            this.game.factoryList[0].money -= this.tempData.buyRoom.price;
            this.showConfirmBuyRoom = false;
            this.asynAllPages();
        },
        onTapBuyWorker(){ // 点击【购买人员】按钮
            let factory = this.game.factoryList[0],
                buyWorker = getListByID(this.tempData.buyWorker.id,'id',this.game.workerList)[0];
            buyWorker.fid = factory.id;
            buyWorker.fname = factory.name;
            this.game.factoryList[0].money -= this.tempData.buyWorker.price;
            this.showConfirmBuyWorker = false;
            this.asynAllPages();
        },
        onTapLog(id){ // 点击【报表】按钮
            this.tempData.log = getListByID(id,'id',this.game.logList)[0];
            this.showLog = true;
        },
        onTapAvgAssign(){ // 点击【均匀分配电力】按钮
            let myRoomList = getListByID(this.game.factoryList[0].id,'fid',this.game.roomList),
                fromRoom,
                toRoomList = [];
            for(let room of myRoomList){
                if(room.id==this.tempData.room.id){
                    fromRoom = room;
                }
                else{
                    toRoomList.push(room);
                }
            }
            let ind = 0,
                assignPowerPct = this.tempData.assignPowerPct,
                assignPower = Math.floor(fromRoom.power*assignPowerPct/100),
                avgPower = Math.round(assignPower/toRoomList.length);
            if(toRoomList.length>0){
                fromRoom.power -= assignPower;
                for(;ind<toRoomList.length-1;ind++){
                    toRoomList[ind].power += avgPower;
                    assignPower -= avgPower;
                }
                toRoomList[ind].power += assignPower;
            }
            this.asynAllPages();
        },
        onTapEditFactory(){ // 点击【操作】按钮
            this.tempData.factory.sell = this.calcFactoryValue(this.tempData.factory)*CONFIG.sell_factor;
            this.showEditFactory = true;
        },
        onTapStealRoom(){ // 点击【偷取房间】按钮
            if(this.tempData.relation.support<CONFIG.steal_room_support_threshold){
                this.$toast.text(`偷取房间需要至少 ${Math.floor(CONFIG.steal_room_support_threshold*100/CONFIG.max_support)}% 的支持率`);
                return ;
            }
            let value = this.calcRoomValue(this.stealRoom),
                imageCost = CONFIG.steal_room_image_cost+CONFIG.image_price_factor*value,
                supportCost = CONFIG.steal_room_support_cost,
                myFactory = this.game.factoryList[0],
                relation = this.tempData.relation;
            myFactory.image -= imageCost;
            relation.support -= supportCost;
            // 变更房间数据
            this.acquireRoom(this.tempData.stealRoom);
            this.asynAllPages();
            this.showStealRoom = false;
        },
        onTapStealWorker(){ // 点击【偷取人员】按钮
            if(this.tempData.relation.support<CONFIG.steal_worker_support_threshold){
                this.$toast.text(`偷取人员需要至少 ${Math.floor(CONFIG.steal_worker_support_threshold*100/CONFIG.max_support)}% 的支持率`);
                return ;
            }
            let value = this.calcWorkerValue(this.stealWorker),
                imageCost = CONFIG.steal_worker_image_cost+CONFIG.image_price_factor*value,
                supportCost = CONFIG.steal_worker_support_cost,
                myFactory = this.game.factoryList[0],
                relation = this.tempData.relation;
            myFactory.image -= imageCost;
            relation.support -= supportCost;
            // 变更人员数据
            this.acquireWorker(this.tempData.stealWorker);
            this.asynAllPages();
            this.showStealWorker = false;
        },
        onTapInvest(){ // 点击【投资】按钮
            if(this.tempData.relation.support<CONFIG.invest_support_threshold){
                this.$toast.text(`投资需要至少 ${Math.floor(CONFIG.invest_support_threshold*100/CONFIG.max_support)}% 的支持率`);
                return ;
            }
            this.showEditFactory = false;
            this.showInvest = true;
        },
        onTapDamageFactory(){ // 点击【打压】按钮
            let factory = getListByID(this.tempData.factory.id,'id',this.game.factoryList)[0],
                myFactory = this.game.factoryList[0];
            if(myFactory.money<CONFIG.damage_money_cost){
                this.$toast.text(`资金不足`);
                return ;
            }
            if(factory.damaged){
                this.$toast.text(`本周已经打压过了`);
                return ;
            }
            let damage = CONFIG.damage_money_cost*CONFIG.damage_money_cost_factor;
            myFactory.money -= CONFIG.damage_money_cost;
            myFactory.image -= factory.image;
            factory.money -= damage;
            console.log(factory.image);
            factory.damaged = true;
            this.asynAllPages();
            this.showEditFactory = false;
        },
        onTapBuyFactory(){ // 点击【收购工厂】按钮
            if(this.tempData.relation.support<CONFIG.buy_factory_support_threshold){
                this.$toast.text(`收购工厂需要 ${Math.floor(CONFIG.buy_factory_support_threshold*100/CONFIG.max_support)}% 的支持率`);
                return ;
            }
            let myFactory = this.game.factoryList[0];
            if(myFactory.money<this.tempData.factory.sell){
                this.$toast.text(`资金不足`);
                return ;
            }
            // 变更工厂数据
            let roomList = getListByID(this.tempData.factory.id,'fid',this.game.roomList),
                workerList = getListByID(this.tempData.factory.id,'fid',this.game.workerList);
            for(let room of roomList){
                this.acquireRoom(room);
            }
            for(let worker of workerList){
                this.acquireWorker(worker);
            }
            this.game.relationList = removeFromList(this.tempData.factory.id,'to',this.game.relationList);
            this.game.factoryList = removeFromList(this.tempData.factory.id,'id',this.game.factoryList);
            this.showEditFactory = false;
            this.searchingFactoryID = 0;
            this.jump(1);
        },
        onTapConfirmInvest(){ // 点击【确认投资】按钮
            let investMoney = parseInt(this.tempData.investMoney)||0;
            if(investMoney<=0){
                return ;
            }
            if(investMoney<=this.game.factoryList[0].money){
                let relation = getListByID(this.tempData.relation.id,'id',this.game.relationList)[0];
                relation.invest += investMoney;
                this.game.factoryList[0].money -= investMoney;
                this.asynAllPages();
                this.investMoney = '';
                this.showInvest = false;
            }
            else{
                this.$toast.text(`资金不足`);
            }
        },

        onDoubleTapRoom(id){ // 双击【房间】按钮
            this.jump(2,id);
        },
        onDoubleTapRoomWorker(id){ // 双击【房间员工】按钮
            this.jump(4,id);
        },
        onDoubleTapPopRoom(id){ // 双击【弹窗房间】按钮
            let assignPowerPct = this.tempData.assignPowerPct,
                fromRoom = getListByID(this.tempData.room.id,'id',this.game.roomList)[0],
                toRoom = getListByID(id,'id',this.game.roomList)[0],
                assignPower = Math.floor(fromRoom.power*assignPowerPct/100);
            fromRoom.power -= assignPower;
            toRoom.power += assignPower;
            this.tempData.assignPowerPct = 0;
            this.asynAllPages();
        },
        onDoubleTapTerminal(id){ // 双击【终端】按钮
            this.jump(3,id);
        },
        onDoubleTapPopWorker(id){ // 双击【弹窗工人】按钮 @MODIFY
            // console.log('任职',id);
            let worker = getListByID(id,'id',this.game.workerList)[0],
                rid = (this.tempData.room||{}).id,
                tid = (this.tempData.terminal||{}).id,
                roomWorkerList = [];
            if(rid){
                roomWorkerList = getListByID(rid,'rid',this.game.workerList);
            }
            // 解除该员工原有的职务
            this.releaseWorker(worker);
            switch(this.tempData.workListPopMode){
                case 1: // 形象总代言
                    releaseAllByJob(11,getListByID(1,'fid',this.game.workerList));
                    worker.job = 11;
                break;
                case 2: // 房间-管理员
                    releaseAllByJob(7,roomWorkerList);
                    worker.job = 7;
                    worker.rid = rid||0;
                    worker.rname = this.tempData.room.name||'';
                break;
                case 3: // 房间-维护工人
                    releaseAllByJob(6,roomWorkerList);
                    worker.job = 6;
                    worker.rid = rid||0;
                    worker.rname = this.tempData.room.name||'';
                break;
                case 4: // 房间-公关
                    releaseAllByJob(8,roomWorkerList);
                    worker.job = 8;
                    worker.rid = rid||0;
                    worker.rname = this.tempData.room.name||'';
                break;
                case 5: // 房间-自动化工人
                    releaseAllByJob(5,roomWorkerList);
                    worker.job = 5;
                    worker.rid = rid||0;
                    worker.rname = this.tempData.room.name||'';
                break;
                case 6: // 终端-操作员
                    let oworker = getListByID(tid,'tid',this.game.workerList)[0]; // 该终端原来的操作员
                    if(oworker){
                        oworker.job = 0;
                        oworker.tid = 0;
                    }
                    worker.job = 0;
                    worker.tid = tid||0;
                    worker.rid = this.tempData.terminal.room.id;
                    worker.rname = this.tempData.terminal.room.name;
                    this.showJobPop = true;
                break;
                case 7: // 首页-房间资源搜索
                    worker.job = 10;
                break;
                case 8: // 首页-人力资源搜索
                    worker.job = 9;
                break;
                case 9: // 工厂页-外交
                    if(this.tempData.factory){
                        let oworker = getMatchList(this.game.workerList,[['tfid',this.tempData.factory.id],['job',12],['fid',this.game.factoryList[0].id]])[0];
                        if(oworker){
                            oworker.job = 0;
                            oworker.tfid = 0;
                            oworker.tfname = '';
                        }
                        worker.job = 12;
                        worker.tfid = this.tempData.factory.id;
                        worker.tfname = this.tempData.factory.name;
                    }
                break;
                case 10: // 工厂页-间谍
                    if(this.tempData.factory){
                        let oworker = getMatchList(this.game.workerList,[['tfid',this.tempData.factory.id],['job',13],['fid',this.game.factoryList[0].id]])[0];
                        if(oworker){
                            oworker.job = 0;
                            oworker.tfid = 0;
                            oworker.tfname = '';
                        }
                        worker.job = 13;
                        worker.tfid = this.tempData.factory.id;
                        worker.tfname = this.tempData.factory.name;
                    }
                break;
            }
            this.asynAllPages();
            this.showWorkerList = false;
        },
        onDoubleTapWorker(id){ // 双击【人员】按钮
            let worker = getListByID(id,'id',this.game.workerList)[0];
            if(worker)
                this.tempData.myWorker = {...worker};
            this.showWorkerPop = true;
        },
        onDoubleTapMarketRoom(id){ // 双击【市场房间】按钮
            let room = getListByID(id,'id',this.game.roomList)[0];
            if(room)
                this.tempData.buyRoom = {...room,price:this.calcRoomValue(room)};
            this.showConfirmBuyRoom = true;
        },
        onDoubleTapMarketWorker(id){ // 双击【市场人员】按钮
            let worker = getListByID(id,'id',this.game.workerList)[0];
            if(worker)
                this.tempData.buyWorker = {...worker,price:this.calcWorkerValue(worker)};
            this.showConfirmBuyWorker = true;
        },
        onDoubleTapRelation(id){ // 双击【外交关系】按钮
            let relation = getListByID(id,'id',this.game.relationList)[0];
            this.tempData.relation = relation;
            this.jump(7,relation.to);
        },
        onDoubleTapFactoryRoom(id){ // 双击【其他工厂房间】按钮
            let room = getListByID(id,'id',this.game.roomList)[0];
            if(room)
                this.tempData.stealRoom = {...room};
            this.showStealRoom = true;
        },
        onDoubleTapFactoryWorker(id){ // 双击【其他工厂房间人员】按钮
            let worker = getListByID(id,'id',this.game.workerList)[0];
            if(worker)
                this.tempData.stealWorker = {...worker};
            this.showStealWorker = true;
        },

        jump(state,id=0){ // 点击【跳转】按钮
            console.log(`跳转至${['首页','房间','终端','人员','市场','外交','工厂','报表'][state-1]} ID=${id}`);
            switch(state){
                case 1: // 首页
                break;
                case 2: // 房间
                    this.searchingRoomID = id||0;
                break;
                case 3: // 终端
                    this.searchingTerminalID = id||0;
                break;
                case 4: // 人员
                    this.searchingWorkerID = id||0;
                break;
                case 7: // 工厂
                    this.searchingFactoryID = id||0;
                break;
            }
            this.asynAllPages();
            this.filter = 1;
            this.state = state;
        },

        asynAllPages(){ // 刷新所有页面temp数据
            this.asynHomePage();
            this.asynRoomPage();
            this.asynTerminalPage();
            this.asynWorkerPage();
            this.asynMarketPage();
            this.asynRelationPage();
            this.asynFactoryPage();
            setTimeout(e=>{
                this.$refs.roomList&&this.$refs.roomList.asyn();
                this.$refs.terminalList&&this.$refs.terminalList.asyn();
                this.$refs.workerListPop&&this.$refs.workerListPop.asyn();
                this.$refs.roomListPop&&this.$refs.roomListPop.asyn();
                this.$refs.workerList&&this.$refs.workerList.asyn();
                this.$refs.roomWorkerList&&this.$refs.roomWorkerList.asyn();
                this.$refs.rrList&&this.$refs.rrList.asyn();
                this.$refs.hrList&&this.$refs.hrList.asyn();
                this.$refs.marketRoomList&&this.$refs.marketRoomList.asyn();
                this.$refs.marketWorkerList&&this.$refs.marketWorkerList.asyn();
                this.$refs.relationList&&this.$refs.relationList.asyn();
                this.$refs.factoryRoomList&&this.$refs.factoryRoomList.asyn();
                this.$refs.factoryWorkerList&&this.$refs.factoryWorkerList.asyn();
            },1000*.1);
        },
        asynHomePage(){ // 刷新首页temp数据
            let roomList = getListByID(this.game.factoryList[0].id,'fid',this.game.roomList),
                workerList = getListByID(this.game.factoryList[0].id,'fid',this.game.workerList),
                rrList = getListByID(10,'job',workerList),
                hrList = getListByID(9,'job',workerList),
                myRoomList =  [...roomList],
                myWorkerList =  [...workerList],
                myRRList =  [...rrList],
                myHRList =  [...hrList];
            this.tempData.myRoomList = myRoomList;
            this.tempData.myPopWorkerList = myWorkerList;
            this.tempData.myWorkerList = myWorkerList;
            this.tempData.myRRList = myRRList;
            this.tempData.myHRList = myHRList;
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
        asynRoomPage(){ // 刷新房间页temp数据
            let id = this.searchingRoomID;
            if(!id){
                this.tempData.room = null;
                return;
            }
            let room = getListByID(id,'id',this.game.roomList)[0],
                terminalList = getListByID(id,'rid',this.game.terminalList),
                roomList = getListByID(this.game.factoryList[0].id,'fid',this.game.roomList),
                roomWorkerList = getListByID(room.id,'rid',this.game.workerList),
                myRoom = {...room},
                myTerminalList = [...terminalList],
                myRoomList = [...roomList],
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
                    terminal.workerStr = myWorker.str;
                    terminal.workerInt = myWorker.int;
                    terminal.workerCom = myWorker.com;
                    terminal.workerImg = myWorker.img;
                    terminal.job = ['发电','挖矿','交易','维护'][myWorker.job-1]||'-';
                }
            }
            myRoom.balance = this.calcBalance(myRoomWorkerList);
            this.tempData.room = {
                manager,maintainer,imageAgent,autoWorker,
                ...myRoom,
            }
            this.tempData.myPopRoomList = myRoomList;
            this.tempData.myTerminalList = myTerminalList;
            this.tempData.myRoomWorkerList = myRoomWorkerList;
        },
        asynTerminalPage(){ // 刷新终端页temp数据
            let id = this.searchingTerminalID;
            if(!id){
                this.tempData.terminal = null;
                return;
            }
            let terminal = getListByID(id,'id',this.game.terminalList)[0]||{},
                room = getListByID(terminal.rid,'id',this.game.roomList)[0],
                worker = getListByID(id,'tid',this.game.workerList)[0],
                myTerminal = {...terminal},
                myRoom = {...room},
                myWorker = {...worker};
            this.tempData.terminal = {
                ...myTerminal,
                operator: myWorker,
                job: (myWorker&&myWorker.job>0)?(['发电','挖矿','交易','终端维护'][myWorker.job-1]):'',
                room,
            }
        },
        asynWorkerPage(){ // 刷新人员页temp数据
            let id = this.searchingWorkerID;
            if(id){
                let worker = getListByID(id,'id',this.game.workerList)[0],
                    myWorker = {...worker};
                this.tempData.myWorkerList = [myWorker];
            }
            else{
                let workerList = getListByID(this.game.factoryList[0].id,'fid',this.game.workerList),
                    myWorkerList = [...workerList];
                this.tempData.myWorkerList = myWorkerList;
            }
        },
        asynMarketPage(){ // 刷新市场页temp数据
            let marketRoomList = getListByID(0,'fid',this.game.roomList),
                marketWorkerList = getListByID(0,'fid',this.game.workerList),
                myMarketRoomList = [...marketRoomList],
                myMarketWorketList = [...marketWorkerList];
            this.tempData.marketRoomList = Array.from(myMarketRoomList,room=>{
                return {
                    price: this.calcRoomValue(room)+'$',
                    ...room,
                }
            });
            this.tempData.marketWorkerList = Array.from(myMarketWorketList,worker=>{
                return {
                    price: this.calcWorkerValue(worker)+'$',
                    ...worker,
                }
            });
        },
        asynRelationPage(){ // 刷新外交页temp数据
            let factoryList = this.game.factoryList,
                relationList = getListByID(factoryList[0].id,'from',this.game.relationList);
            this.tempData.relationList = Array.from(relationList,relation=>{
                let factory = getListByID(relation.to,'id',factoryList)[0],
                    joint = getMatchList(this.game.workerList,[['tfid',factory.id],['job',12],['fid',this.game.factoryList[0].id]])[0]||{},
                    spy = getMatchList(this.game.workerList,[['tfid',factory.id],['job',13],['fid',this.game.factoryList[0].id]])[0]||{};
                return {
                    ...relation,
                    money: factory.money,
                    image: factory.image,
                    jointName: joint.name,
                    spyName: spy.name,
                }
            });
        },
        asynFactoryPage(){ // 刷新工厂页temp数据
            let id = this.searchingFactoryID;
            if(id){
                let factoryList = this.game.factoryList,
                    factory = getListByID(id,'id',factoryList)[0],
                    factoryRoomList = getListByID(id,'fid',this.game.roomList),
                    factoryWorkerList = getListByID(id,'fid',this.game.workerList),
                    joint = getMatchList(this.game.workerList,[['tfid',factory.id],['job',12],['fid',this.game.factoryList[0].id]])[0],
                    spy = getMatchList(this.game.workerList,[['tfid',factory.id],['job',13],['fid',this.game.factoryList[0].id]])[0],
                    myFactory = {...factory},
                    myJoint = {...joint},
                    mySpy = {...spy},
                    myFactoryRoomList = [...factoryRoomList],
                    myFactoryWorkerList = [...factoryWorkerList];
                this.tempData.factory = myFactory;
                this.tempData.factory.boss = getMatchList(factoryWorkerList,[['boss',true]])[0];
                this.tempData.joint = myJoint;
                this.tempData.spy = mySpy;
                this.tempData.factoryRoomList = myFactoryRoomList;
                this.tempData.factoryWorkerList = myFactoryWorkerList;
            }
            else{
                this.tempData.factory = null;
                this.tempData.joint = null;
                this.tempData.spy = null;
                this.tempData.factoryRoomList = [];
                this.tempData.factoryWorkerList = [];
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
    .tab-panel .row{
        min-height: 1rem;
        margin-bottom: .3rem;
    }
    .tab-panel .no-margin{
        margin-bottom: 0;
    }
    .row .label,.row. .input{

    }
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .row .row-column{
        width: 49%;
        display: inline-block;
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
        width: .22rem;
    }
    .btn-go{
        color: #fff;
    }
    .btn-small{
        margin-left: .2rem;
        font-size: .26rem;
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
        font-size: .26rem;
        display: inline-block;
        width: 100%;
    }
    .pct-wrap b{
        width: 35%;
    }
    .index .pct{
        display: inline-block;
        width: calc( 60% - .12rem );
        margin-left: .12rem;
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
    .filter{
        padding: .1rem 0;
        margin: 0;
        height: 1.8rem;
        line-height: .5rem;
    }
    .filter .select,
    .market .select{
        font-weight: bold;
    }
    .filter .btn,
    .market .btn{
        display: inline-block;
        width: 1.2rem;
        font-size: .26rem;
        text-align: left;
    }
    .market{
        padding: 0;
        margin: 0;
        height: .6rem;
        line-height: .6rem;
    }
    .market .btn{
        width: 49%;
        font-size: .3rem;
    }
    .market .select{
        border-bottom: .01rem solid #ff4f18;
        font-size: .3rem;
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
    .worker-board{
        width: 5rem;
        padding: 0 .2rem;
        padding-bottom: .3rem;
        text-align: left;
    }
    .worker-board .title{
        height: .8rem;
        line-height: .8rem;
        margin-bottom: .2rem;
        font-size: .3rem;
        border-bottom: .01rem solid #ccc;
    }
    .worker-board .title span{
        font-size: .2rem;
        font-weight: normal;
    }
    .worker-board .item{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .worker-board .item h3{
        width: 35%;
        text-align: left;
        height: .58rem;
        line-height: .58rem;
        white-space: nowrap;
        word-break: keep-all;
    }
    .worker-board .item span{
        width: 65%;
        text-align: left;
        white-space: nowrap;
        word-break: keep-all;
    }
    .worker-board .sell{
        color: #ff4f18;
        font-size: .3rem;
        font-weight: bold;
        justify-content: flex-end;
    }
    .worker-board .sell .risk-item{
        height: .72rem;
        line-height: .72rem;
        margin-left: .24rem;
    }
    .pop-worker-list{
        width: 7.2rem;
        padding: .1rem;
        height: 6.2rem;
        overflow: scroll;
    }
    .pop-room-list{
        width: 7.2rem;
        padding: .3rem;
        height: 6.2rem;
        overflow: scroll;
    }
    .pop-room-list h3{
        width: 2.5rem;
    }
    .pop-room-list h3 >p{
        white-space: nowrap;
        word-break: keep-all;
    }
    .pop-room-list .level{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 1.5rem;
    }
    .log{
        padding: .2rem;
    }
    .log .title{
        text-align: left;
        font-size: .26rem;
    }
    .log .sub-title{
        font-size: .26rem;
    }
    .log-board{
        width: 7rem;
        height: 10rem;
        max-height: 90%;
        padding: .2rem;
        text-align: left;
        overflow-y: scroll;
    }
    .log-board .title{
        font-size: .4rem;
        margin-bottom: .2rem;
        border-bottom: .01rem solid #ccc;
    }
    .para{
        font-size: .26rem;
        line-height: .5rem;
    }
</style>
