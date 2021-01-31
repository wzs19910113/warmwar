import { DEBUG, CONFIG } from '../config/config';
/*
  获取随机整数
  random(3,8) 的随机区间为 3-8
 */
export function r(min,max){
    return Math.floor(Math.random()*(min-max-1)+max+1);
}
/*
  冒泡排序
  @Param arr {Array} 要进行排序的数组 [{val:30,...},{val:10,...},{val:20,...},...]
  @Param valname? {String} 索引变量名（默认为'val'）
  @Return arr {Array} 排好序的数组

  Example:
  let oldarr = [{
        vote: 30, id: 'A',
    },{
        vote: 10, id: 'B',
    },{
        vote: 20, id: 'C',
    }];
    let newarr = bulbsort(oldarr,'vote');
 */
export function bulbsort(arr,valname='val',type=1){
    let res = [...arr];
    for(let i=0;i<res.length-1;i++){
        for(let j=0;j<res.length-1-i;j++){
            if(type||(res[j][valname]<res[j+1][valname])){
                let temp=res[j];
                res[j] = res[j+1];
                res[j+1] = temp;
            }
        }
    }
    return res;
}
/*
 获取离元素ele最近的父级 tagname 标签
 */
export function getParentNode(ele,tagname='a'){
    if((ele&&((ele.nodeName||ele.tagName).toUpperCase())===tagname.toUpperCase()||ele.parentNode===null))
        return ele;
    else if(ele)
        return getParentNode(ele.parentNode,tagname);
    return false;
}
/*
 计算文本长度（汉字为2，英文和字符为1）
 */
export function getLength(str) {
    let realLength = 0,
        len = str.length,
        charCode = -1;
    for(let i=0;i<len;i++) {
        charCode = str.charCodeAt(i);
        if(charCode>=0&&charCode<=128) // 英文字符
            realLength+=1;
        else // 其他字符
            realLength+=2;
    }
    return realLength;
}
export function timestampToTime(timestamp) {
    let date = new Date(timestamp*1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    strDate = Y+M+D+h+m+s;
    return strDate;
}
export function getQueryVariable(variable){
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i=0;i<vars.length;i++) {
           let pair = vars[i].split('=');
           if(pair[0] == variable){
               return pair[1];
           }
    }
    return false;
}
export function query(url,success,fail,type=0,data={}){ // 通用ajax请求
    $.ajax({
        url,
        type: type?'POST':'GET',
        data,
        success: function(result){
            if(result.code==0){
                success&&success(result);
            }
            else{
                console.error(result);
                fail&&fail(result||{msg:'请求失败'});
            }
        },
        error: function(e){
            console.error(e);
            fail&&fail(e);
        },
        complete: function(e){
        },
    });
    return true;
}
export function numFormat(number){ // 货币表达格式
    // let arr = (number+'').split(''),
    //     tarr = [];
    // for(let i=1;i<arr.length+1;i++){
    //     tarr.push(arr[i-1]);
    //     if(i%3==0&&i!=arr.length){
    //         tarr.push(',');
    //     }
    // }
    // return tarr.join('');
    return number;
}
export function avg(arr,valname){ // 数组平均值
    let total = 0;
    if(valname){
        for(let i of arr){
            total += i[valname];
        }
    }
    else{
        for(let i of arr){
            total += i;
        }
    }
    if(total==0)
        return 0;
    else
        return Math.ceil(total/arr.length);
}
export function percent(val,max){ // 百分比显示
    return Math.floor(val*100/max);
}

function genName(arr1,arr2,arr3){ // 生成名字
    let c1 = arr1[r(0,arr1.length-1)], c2 = '', c3 = '';
    if(arr2){
        c2 = arr2[r(0,arr2.length-1)];
    }
    if(arr3){
        c3 = arr3[r(0,arr3.length-1)];
    }
    return c1+c2+c3;
}
export function genRandomWorkerName(){ // 随机生成工人名字
    return r(0,2)?genName(CONFIG.namespace.worker1,CONFIG.namespace.worker2,CONFIG.namespace.worker2):genName(CONFIG.namespace.worker1,CONFIG.namespace.worker2);
}
export function genRandomRoomName(type){ // 随机生成房间名字
    return genName(CONFIG.namespace.common,CONFIG.namespace.common,CONFIG.namespace.room)+CONFIG.room_type_name_map[type];
}
export function genRandomFactoryName(){ // 随机生成工厂名字
    return genName(CONFIG.namespace.common,CONFIG.namespace.common,CONFIG.namespace.factory);
}
export function genRandomRoom(id,{fid,fname,power,durab,risk,auto,level,type,basicImage}={}){ // 随机生成房间
    type = (type||type==0)?type:r(0,3);
    return {
        id,
        fid: fid||0,
        fname: fname||'',
        name: genRandomRoomName(type),
        type,
        basicImage: (basicImage||basicImage==0)?basicImage:(r(0,100)>CONFIG.randomRoomBasicImageProb?0:r(1,CONFIG.max_basicImage)),
        power: (power||power==0)?power:r(CONFIG.init.randmOtherRoomPowerRange[0],CONFIG.init.randmOtherRoomPowerRange[1]),
        durab: (durab||durab==0)?durab:r(CONFIG.init.randmOtherRoomDurabRange[0],CONFIG.init.randmOtherRoomDurabRange[1]),
        risk: (risk||risk==0)?risk:r(CONFIG.init.randmOtherRoomRiskRange[0],CONFIG.init.randmOtherRoomRiskRange[1]),
        auto: (auto||auto==0)?auto:r(CONFIG.init.randmOtherRoomAutoRange[0],CONFIG.init.randmOtherRoomAutoRange[1]),
        level: (level||level==0)?level:r(CONFIG.init.randmOtherRoomLevelRange[0],CONFIG.init.randmOtherRoomLevelRange[1]),
    }
}
export function genRandomWorker(id,{fid,fname,rid,rname,tid,initJob,boss}={}){ // 随机生成工人
    function rate(){
        let a = r(0,4),
            z;
        if(a) z = r(1,50);
        else{
            z = Math.round(50/Math.pow(r(1,50),.3))+50;
            z += r(-22,22);
            if(z>100) z = Math.round(z/1.5);
            if(z>100) z = 100;
        }
        return z;
    }
    function adjust(val){
        return Math.floor((100-val)/2)+val;
    }
    let res = {
        id,
        fid: fid||0,
        fname: fname||'',
        rid: rid||0,
        rname: rname||'',
        tid: tid||0,
        tfid: 0,
        ftname: '',
        name: genRandomWorkerName(),
        str: rate(),
        int: rate(),
        com: rate(),
        img: rate(),
        job: initJob||0,
        boss: boss?true:false,
    };
    if(boss){
        res.int = adjust(res.int);
        res.com = adjust(res.com);
    }
    return res;
}
export function getListByID(id,idname,arr){ // 根据ID获取列表
    let res = [];
    Array.from(arr,inst=>{
        if(inst[idname]==id){
            res.push(inst);
        }
    });
    return res;
}
export function getMatchList(arr,matchList){ // 根据匹配获取列表 matchList = [['id',1],['job',2]]
    let res = [];
    Array.from(arr,inst=>{
        let isMatch = true;
        for(let m of matchList){
            if(inst[m[0]]!=m[1]){
                isMatch = false;
                break;
            }
        }
        if(isMatch){
            res.push(inst);
        }
    });
    return res;
}
export function removeFromList(id,idname,arr){ // 根据ID从列表中移除
    let res = [];
    Array.from(arr,inst=>{
        if(inst[idname]!=id){
            res.push(inst);
        }
    });
    return res;
}
export function releaseAllByJob(job,arr){ // 解除所有相关职务
    Array.from(arr,inst=>{
        if(inst.job==job){
            inst.job = 0;
        }
    });
}




























//
