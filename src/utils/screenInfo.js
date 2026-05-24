
/*
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-04-12 09:50:49
 * @LastEditTime: 2025-05-12 10:35:42
 * @LastEditors: FGJ
 * @Description: Get the real physical pixel position of dom on the screen
 * @FilePath: \saas_school_platform\src\views\safety\realtimeMonitoring\screenInfo.js
 */
export const getDPI = function () {
    const div = document.createElement('div');
    div.style.cssText = 'height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;';
    document.body.appendChild(div);
    const devicePixelRatio = window.devicePixelRatio || 1,
        dpi = div.offsetWidth * devicePixelRatio;
    document.body.removeChild(div);
    return dpi / 100
}

// export const getElementPosition = function(elem, fullscreen) {
//     const rect = elem.getBoundingClientRect();
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
//     const devicePixelRatio = window.devicePixelRatio || 1;
//     const fullscreenTopOffsetList = {
//         1: 0,
//         1.25: 0,
//         1.5: 4,
//         1.75: 6,
//         2: 5.5,
//         2.25: 8
//     }
//     const noFullscreenTopOffsetList = {
//         2.25: 6.5,
//         2: 6.5,
//         1.75: 6.5,
//         1.5: 6.5,
//         1.25: 8.5,
//         1: 8.5
//     }
//     const devicePixelRatioOffsetTop = fullscreenTopOffsetList[devicePixelRatio] / devicePixelRatio;
//     const devicePixelRatioOffsetLeft = devicePixelRatio > 1.25 ? 0.5 / devicePixelRatio : 0;

//     //The upper and lower offset of the screen
//     let topOffset = window.screenY > 1 ? noFullscreenTopOffsetList[devicePixelRatio] / devicePixelRatio : 0;

//     // Calculate the position of the element relative to the viewport, and consider the impact of the window width change on the left value after the console is opened
//     let correctedLeft = rect.left + scrollLeft;
//     const originalWindowWidth = document.documentElement.clientWidth;

//     if (window.innerWidth < originalWindowWidth) {
//         correctedLeft -= ((originalWindowWidth - window.innerWidth) / 2) + devicePixelRatioOffsetLeft;
//     }

//     //The position of the Backdom element relative to the system desktop
//     return {
//         width: elem.clientWidth,
//         height: elem.clientHeight,
//         top: Math.ceil((rect.top + scrollTop) + (window.screenY + (window.outerHeight - window.innerHeight)) - topOffset - devicePixelRatioOffsetTop),
//         left: Math.ceil(correctedLeft + window.screenLeft)
//     }
// }
export const getElementPosition = function (elem) {
    const isBrowserScreen = window.screen.width === window.outerWidth;
    const rect = elem.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const fullscreenTopOffsetList = {
        1: 0,
        1.25: 0,
        1.5: 4,
        1.75: 6,
        2: 5.5,
        2.25: 8
    }
    const noFullscreenTopOffsetList = {
        2.25: 6.5,
        2: 6.5,
        1.75: 6.5,
        1.5: 6.5,
        1.25: 8.5,
        1: 8.5
    }
    const devicePixelRatioOffsetTop = fullscreenTopOffsetList[devicePixelRatio] / devicePixelRatio;
    const devicePixelRatioOffsetLeft = devicePixelRatio > 1.25 ? 0.5 / devicePixelRatio : 0;
    // The upper and lower offset of the screen
    let topOffset = window.screenY > 1 ? noFullscreenTopOffsetList[devicePixelRatio] / devicePixelRatio : 0;
    return {
        width: elem.clientWidth,
        height: elem.clientHeight,
        // The position of the Backdom element relative to the system desktop
        top: Math.ceil((rect.top + scrollTop) + (window.screenY + ((window.outerHeight - window.innerHeight > 0) ? (window.outerHeight - window.innerHeight) : 0)) - topOffset - devicePixelRatioOffsetTop),
        // top: Math.ceil((rect.top + scrollTop) + (window.screenY + Math.min(window.outerHeight  - window.innerHeight, isBrowserScreen ? 87.5 * getDPI() : 78.5 * getDPI())) - topOffset - devicePixelRatioOffsetTop),
        left: Math.ceil((rect.left + scrollLeft) + window.screenLeft + (Math.min(window.outerWidth - window.innerWidth, isBrowserScreen ? 0 : 15)) / 2 - devicePixelRatioOffsetLeft)
    }
}