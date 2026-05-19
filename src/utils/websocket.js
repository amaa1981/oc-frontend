let webSocketUrl = "";
let Socket = "";
let setIntervalWebsocketPush = null;
let isCloseByMySelf = false;
let count = 0;

import { getTimestamp, getToken, closeAll, showHistory } from "./wsMessage";
import store from '@/store'
import { watchEffect } from "vue";
// const mqttStore = useMqttStore();
function getPingInfo() {
    let timestamp = getTimestamp();
    let token = getToken("ping", timestamp);
    let ping = {
        type: "ping",
        token: token,
        timestamp: timestamp,
    };
    return ping;
}

// 建立 WebSocket 连接
export const createSocket = (url) => {
    webSocketUrl = url;
    // 建立连接前先判断当前是否有连接，若有使用 close 方法关闭连接
    Socket && Socket.close();
    if (!Socket) {
        if (typeof WebSocket === "undefined") {
            alert("您的浏览器不支持 WebSocket");
            return;
        }
        // 使用构造函数创建 Socket 连接实例
        Socket = new WebSocket(url);
    
        // 当从服务器接受到信息时的回调函数
        Socket.onmessage = onMessageWS;
        // 连接关闭后的回调函数
        Socket.onclose = onCloseWS;
        // 连接失败后的回调函数
        Socket.onerror = onErrorWS;
        console.log("WebSocket 已连接");
        showHistory();
            // 连接成功后的回调函数
        Socket.onopen = onOpenWS;
        // 派发一个自定义事件
        // window.dispatchEvent(
        //     new CustomEvent("onWSOpen", {
        //         detail: {
        //             isOpen: true,
        //         },
        //     })
        // );
    }
    // 重置重连次数
    count = 0;
};
// 连接成功后的回调
const onOpenWS = () => {
    // mqttStore.setConnected(true);
    store.dispatch('mqtt/setConnected', true);
    console.log(store.state.mqtt.connected)
    console.log("WebSocket 连接成功！");
    // 派发一个自定义事件
    window.dispatchEvent(
        new CustomEvent("onWSOpen", {
            detail: {
                isOpen: true,
            },
        })
    );
    // 连接成功后发送心跳
    sendPing();
    // 重置手动关闭标志
    isCloseByMySelf = false;
};

// 连接失败后的回调
const onErrorWS = () => {
    console.log("WebSocket 连接出错，尝试重新连接...");
    // mqttStore.setConnected(false);
    store.dispatch('mqtt/setConnected', false);
    console.log(store.state.mqtt.connected)
    Socket.close(); // 关闭当前连接
    // clearInterval(setIntervalWebsocketPush); // 清除心跳定时器
    window.dispatchEvent(
        new CustomEvent("onWSOpen", {
            detail: {
                isOpen: false,
            },
        })
    );
    // if (!document.hidden) {
    //     Socket = '';
    //     createSocket(webSocketUrl);
    // }
    // 如果连接未关闭，则尝试重新连接
    if (Socket.readyState !== 3) {
        setTimeout(() => {
            Socket = ""; // 重置 Socket
            createSocket(webSocketUrl); // 重新创建连接
        }, 5000); // 5 秒后重连
    }
};

// 收到信息的回调
const onMessageWS = (e) => {
    // 派发一个自定义事件
    window.dispatchEvent(
        new CustomEvent("onMessageWS", {
            detail: {
                data: e.data,
            },
        })
    );
    // 收到信息说明当前连接是正常的
};

// 发送数据但连接未建立时的处理回调
const connecting = (message) => {
    setTimeout(() => {
        // 如果当前处于正在连接状态，开启定时器等稍后再发送
        if (Socket.readyState === 0) {
            connecting(message);
        } else {
            Socket.send(JSON.stringify(message));
        }
    }, 1000);
};

// 数据发送的回调
export const sendWSPush = (message) => {
    if (Socket.readyState === 3) {
        // 如果当前未连接，先建立连接
        Socket.close();
        createSocket(webSocketUrl);
    } else if (Socket.readyState === 1) {
        // 连接已建立
        Socket.send(JSON.stringify(message));
    } else if (Socket.readyState === 0) {
        // 正在建立链接中
        connecting(message);
    }
};
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // 页面不可见时，关闭 WebSocket 连接
        console.log("页面不可见，关闭 WebSocket 连接...");
        // clearInterval(setIntervalWebsocketPush); // 清除心跳定时器
        closeAll();
        closeWebsocket();
    } else {
        console.log("页面重新可见，尝试重新连接 WebSocket...");
        createSocket(webSocketUrl);
    }
});
// 连接关闭的回调
const onCloseWS = () => {
    // mqttStore.connected = false;
    // if (!document.hidden) {
    //     Socket = '';
    //     createSocket(webSocketUrl);
    // }
    // if (document.hidden) {
    // }
    // 页面可见性变化时重新连接
    // 页面重新可见时，重新连接 WebSocket
    // clearInterval(setIntervalWebsocketPush); // 清除心跳定时器
    count++; // 重连次数加 1
    // 如果连接不是手动关闭且重连次数小于 5 次，则尝试重连
    if (!isCloseByMySelf && count < 5) {
        console.log(`WebSocket 断开，尝试第 ${count} 次重连...`);
        setTimeout(() => {
            Socket = ""; // 重置 Socket
            createSocket(webSocketUrl); // 重新创建连接
        }, 5000); // 5 秒后重连
    } else if (count >= 5) {
        console.log("WebSocket 重连次数已达上限，停止重连");
    }
};

// // 发送心跳 --- 默认每隔 5 秒发送一次心跳
// export const sendPing = () => {
//     clearInterval(setIntervalWebsocketPush); // 清除旧的心跳定时器
//     // 发送心跳
//     Socket.send(JSON.stringify(getPingInfo()));
//     setIntervalWebsocketPush = setInterval(() => {
//         if (Socket.readyState === WebSocket.OPEN) {
//             Socket.send(JSON.stringify(getPingInfo()));
//         } else {
//             console.log('WebSocket 未连接，停止发送心跳');
//             clearInterval(setIntervalWebsocketPush); // 停止心跳
//         }
//     }, 5000); // 每 5 秒发送一次心跳
// };

// 发送心跳
const sendPing = () => {
    if (Socket.readyState === WebSocket.OPEN) {
        Socket.send(JSON.stringify(getPingInfo()));
        // 递归调用，实现心跳
        setTimeout(sendPing, 5000);
    } else {
        console.log("WebSocket 未连接，停止发送心跳");
    }
};

// 关闭连接回调
export const closeWebsocket = () => {
    Socket && Socket.close();
    isCloseByMySelf = true;
    Socket = "";
};
