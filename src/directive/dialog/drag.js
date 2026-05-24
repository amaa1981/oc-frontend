/**
* v-dialogDrag pop-up drag
* Copyright (c) 2019 ruoyi
*/

export default {
  bind(el, binding, vnode, oldVnode) {
    const value = binding.value
    if (value == false) return
    // Get the drag content header
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';
    // Get the original attributes ie dom element.currentStyle Firefox Google window.getComputedStyle(dom element, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    dragDom.style.position = 'absolute';
    dragDom.style.marginTop = 0;
    let width = dragDom.style.width;
    if (width.includes('%')) {
      width = +document.body.clientWidth * (+width.replace(/\%/g, '') / 100);
    } else {
      width = +width.replace(/\px/g, '');
    }
    dragDom.style.left = `${(document.body.clientWidth - width) / 2}px`;
    // mouse press event
    dialogHeaderEl.onmousedown = (e) => {
      // When the mouse is pressed, calculate the distance between the current element and the visual area (the distance between the mouse click position and the visual window)
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // The obtained value has px regular matching and replacement
      let styL, styT;

      // Note that in IE, the value obtained for the first time is 50% of the component. After moving, the value is assigned to px.
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      };

      // Mouse drag event
      document.onmousemove = function (e) {
        // Calculate the moving distance through event delegation (the distance from the start of dragging to the end of dragging)
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        let finallyL = l + styL
        let finallyT = t + styT

        // Move the current element
        dragDom.style.left = `${finallyL}px`;
        dragDom.style.top = `${finallyT}px`;

      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
};