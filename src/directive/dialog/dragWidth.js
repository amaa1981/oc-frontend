/**
* v-dialogDragWidth can drag the pop-up window width (right side)
* Copyright (c) 2019 ruoyi
*/

export default {
    bind(el) {
        const dragDom = el.querySelector('.el-dialog');
        const lineEl = document.createElement('div');
        lineEl.style = 'width: 5px; background: inherit; height: 80%; position: absolute; right: 0; top: 0; bottom: 0; margin: auto; z-index: 1; cursor: w-resize;';
        lineEl.addEventListener('mousedown',
            function (e) {
                // When the mouse is pressed, the distance between the current element and the visible area is calculated.
                const disX = e.clientX - el.offsetLeft;
                // current width
                const curWidth = dragDom.offsetWidth;
                document.onmousemove = function (e) {
                    e.preventDefault(); // Disable default event when moving
                    // Calculate the distance moved through event delegation
                    const l = e.clientX - disX;
                    dragDom.style.width = `${curWidth + l}px`;
                };
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }, false);
        dragDom.appendChild(lineEl);
    }
}