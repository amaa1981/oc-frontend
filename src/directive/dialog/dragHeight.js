/**
* v-dialogDragWidth draggable pop-up window height (lower right corner)
* Copyright (c) 2019 ruoyi
*/

export default {
    bind(el) {
        const dragDom = el.querySelector('.el-dialog');
        const lineEl = document.createElement('div');
        lineEl.style = 'width: 6px; background: inherit; height: 10px; position: absolute; right: 0; bottom: 0; margin: auto; z-index: 1; cursor: nwse-resize;';
        lineEl.addEventListener('mousedown',
            function(e) {
                // When the mouse is pressed, the distance between the current element and the visible area is calculated.
                const disX = e.clientX - el.offsetLeft;
                const disY = e.clientY - el.offsetTop;
                // Current width height
                const curWidth = dragDom.offsetWidth;
                const curHeight = dragDom.offsetHeight;
                document.onmousemove = function(e) {
                    e.preventDefault(); // Disable default event when moving
                    // Calculate the distance moved through event delegation
                    const xl = e.clientX - disX;
                    const yl = e.clientY - disY
                    dragDom.style.width = `${curWidth + xl}px`;
                    dragDom.style.height = `${curHeight + yl}px`;
                };
                document.onmouseup = function(e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }, false);
        dragDom.appendChild(lineEl);
    }
}