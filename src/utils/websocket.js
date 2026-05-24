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

// Establish a WebSocket connection
export const createSocket = (url) => {
    webSocketUrl = url;
    // Before establishing a connection, first determine whether there is currently a connection. If so, use the close method to close the connection.
    Socket && Socket.close();
    if (!Socket) {
        if (typeof WebSocket === "undefined") {
            alert("Your browser does not support WebSocket");
            return;
        }
        // Create a Socket connection instance using the constructor
        Socket = new WebSocket(url);
    
        // Callback function when information is received from the server
        Socket.onmessage = onMessageWS;
        // Callback function after connection is closed
        Socket.onclose = onCloseWS;
        // Callback function after connection failure
        Socket.onerror = onErrorWS;
        console.log("WebSocket connected");
        showHistory();
            // Callback function after successful connection
        Socket.onopen = onOpenWS;
        // dispatch a custom event
        // window.dispatchEvent(
        //     new CustomEvent("onWSOpen", {
        //         detail: {
        //             isOpen: true,
        //         },
        //     })
        // );
    }
    // Reset reconnect times
    count = 0;
};
// Callback after successful connection
const onOpenWS = () => {
    // mqttStore.setConnected(true);
    store.dispatch('mqtt/setConnected', true);
    console.log(store.state.mqtt.connected)
    console.log("WebSocket connection successful!");
    // dispatch a custom event
    window.dispatchEvent(
        new CustomEvent("onWSOpen", {
            detail: {
                isOpen: true,
            },
        })
    );
    // Send heartbeat after successful connection
    sendPing();
    // Reset manual close flag
    isCloseByMySelf = false;
};

// Callback after connection failure
const onErrorWS = () => {
    console.log("WebSocket connection error, try to reconnect...");
    // mqttStore.setConnected(false);
    store.dispatch('mqtt/setConnected', false);
    console.log(store.state.mqtt.connected)
    Socket.close(); // Close current connection
    // clearInterval(setIntervalWebsocketPush); // Clear heartbeat timer
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
    // If the connection is not closed, try to reconnect
    if (Socket.readyState !== 3) {
        setTimeout(() => {
            Socket = ""; // Reset Socket
            createSocket(webSocketUrl); // Re-create the connection
        }, 5000); // 5 Reconnect after seconds
    }
};

// callback after receiving information
const onMessageWS = (e) => {
    // dispatch a custom event
    window.dispatchEvent(
        new CustomEvent("onMessageWS", {
            detail: {
                data: e.data,
            },
        })
    );
    // Received a message indicating that the current connection is normal
};

// Processing callback when data is sent but the connection is not established
const connecting = (message) => {
    setTimeout(() => {
        // If you are currently connecting, start the timer and wait for sending again later.
        if (Socket.readyState === 0) {
            connecting(message);
        } else {
            Socket.send(JSON.stringify(message));
        }
    }, 1000);
};

// Data sending callback
export const sendWSPush = (message) => {
    if (Socket.readyState === 3) {
        // If not currently connected, establish a connection first
        Socket.close();
        createSocket(webSocketUrl);
    } else if (Socket.readyState === 1) {
        // Connection established
        Socket.send(JSON.stringify(message));
    } else if (Socket.readyState === 0) {
        // Link is being established
        connecting(message);
    }
};
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // Close the WebSocket connection when the page is not visible
        console.log("The page is not visible, closing the WebSocket connection...");
        // clearInterval(setIntervalWebsocketPush); // Clear heartbeat timer
        closeAll();
        closeWebsocket();
    } else {
        console.log("Page is visible again, try reconnecting WebSocket...");
        createSocket(webSocketUrl);
    }
});
// Connection close callback
const onCloseWS = () => {
    // mqttStore.connected = false;
    // if (!document.hidden) {
    //     Socket = '';
    //     createSocket(webSocketUrl);
    // }
    // if (document.hidden) {
    // }
    // Reconnect when page visibility changes
    // When the page becomes visible again, reconnect to the WebSocket
    // clearInterval(setIntervalWebsocketPush); // Clear heartbeat timer
    count++; // Increase the number of reconnections 1
    // If the connection is not closed manually and the number of reconnections is less than 5 times, try to reconnect
    if (!isCloseByMySelf && count < 5) {
        console.log(`WebSocket disconnect，Try the ${count} reconnection...`);
        setTimeout(() => {
            Socket = ""; // Reset Socket
            createSocket(webSocketUrl); // Re-create the connection
        }, 5000); // 5 Reconnect after seconds
    } else if (count >= 5) {
        console.log("The number of WebSocket reconnections has reached the upper limit, stop reconnecting.");
    }
};

// //Send heartbeat --- Send heartbeat every 5 seconds by default
// export const sendPing = () => {
//     clearInterval(setIntervalWebsocketPush); // Clear old heartbeat timer
//     //Send heartbeat
//     Socket.send(JSON.stringify(getPingInfo()));
//     setIntervalWebsocketPush = setInterval(() => {
//         if (Socket.readyState === WebSocket.OPEN) {
//             Socket.send(JSON.stringify(getPingInfo()));
//         } else {
//             console.log('WebSocket is not connected, stop sending heartbeats');
//             clearInterval(setIntervalWebsocketPush); // Stop heartbeat
//         }
//     }, 5000); // Send a heartbeat every 5 seconds
// };

// Send heartbeat
const sendPing = () => {
    if (Socket.readyState === WebSocket.OPEN) {
        Socket.send(JSON.stringify(getPingInfo()));
        // Recursive call to achieve heartbeat
        setTimeout(sendPing, 5000);
    } else {
        console.log("WebSocket not connected, stopped sending heartbeats");
    }
};

// Close connection callback
export const closeWebsocket = () => {
    Socket && Socket.close();
    isCloseByMySelf = true;
    Socket = "";
};
