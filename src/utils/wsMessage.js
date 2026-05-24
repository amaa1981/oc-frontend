/*
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-04-12 15:49:17
 * @LastEditTime: 2025-05-12 14:18:13
 * @LastEditors: FGJ
 * @Description: websocket message processing function
 * @FilePath: \ruoyi-ui\src\utils\wsMessage.js
 */
import { sendWSPush } from './websocket.js';
import md5 from 'js-md5';
import store from '@/store'
export function getToken(type, timestamp) {
    let key = 'Zkkz123456';
    return md5(type + key + timestamp);
}
let showHistoryCheck = false;
export function getTimestamp() {
    return new Date().getTime();
}

function handlerData(data) {
    let info = JSON.parse(JSON.stringify(data));
    let timestamp = getTimestamp();
    info.timestamp = timestamp;
    info.token = getToken(info.type, timestamp);
    return info;
}

export let open = function (data) {
    data.type = 'open';
    sendWSPush(handlerData(data));
    //showList adds a piece of data
    if (showHistoryCheck == false) {
        store.dispatch('mqtt/setShowList', [...store.state.mqtt.showList, data]);
    }

    console.log(store.state.mqtt.showList)
}

export let move = function (data) {
    data.type = 'move';
    sendWSPush(handlerData(data));
}

export let resize = function (data) {
    data.type = 'resize';
    sendWSPush(handlerData(data));
}

export let close = function (data) {
    data.type = 'close';
    sendWSPush(handlerData(data));
    // Remove the corresponding data from the store
    store.dispatch('mqtt/setShowList', store.state.mqtt.showList.filter(item => item.videoId !== data.videoId));
}

export let closeAll = function (data) {
    sendWSPush(handlerData(data));
}

export let hidden = function (data) {
    data.type = 'hidden';
    sendWSPush(handlerData(data));
}

export let show = function (data) {
    data.type = 'show';
    sendWSPush(handlerData(data));
}


export let showHistory = function () {
    console.log("showHistory")
    console.log(store.state.mqtt.showList)
    showHistoryCheck = true;
    store.state.mqtt.showList.forEach(item => {
        // Only call show to restore the display state, and do not call open repeatedly to avoid triggering playback repeatedly.
        show(item);
    });
    showHistoryCheck = false;
}
