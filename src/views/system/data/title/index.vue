<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2024-01-10 09:25:51
 * @LastEditTime: 2025-05-22 14:50:19
 * @LastEditors: FGJ
 * @Description: 
 * @FilePath: \saas_school_platform\src\views\dataSignage\components\Title.vue
-->
<template>
  <div class="title-wrap">
    <!-- <svg-icon icon-class="data-title"></svg-icon> -->

    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAsCAYAAAAn4+taAAAAAXNSR0IArs4c6QAAAcxJREFUaEPtWrFKA0EQfbMhRcTCH7CIuUtAEMTOTkxhY8DKD7Cx1g/R2sYPsFBBG4vE0k4LQUwuJwF7YxUkmhvZ5JQTLke4vbBs3Kuu2N2bN/Nm9vbNEgx6Kh0uBgFOibEKYAHARV/gsFOkDpmCQ4LgAe5DAFGzu32BNTOAMFP5BecAdsY4/tYkIEECe7qzAoQtkKQi4XhcI4FNOUYEuGu6dKZUVEY5kkSt7CNS8XiXCdWo4Uy48kp0nRqMDiCuz8fEmIsaTYRes0QHRgEpt/kkzuCWQ/tTBVJ65EWax7II8DXooeWv0GvqDwLQBmTJ52oOKEjjWeCzXaQbI4G4Pm9HDVdKSp0RsUDG8E9bjtiI2IikqImT7OyWWpZallrJv/E2R2yO2ByxOZKCAxoPVrZq2aqVgrH/6qfR8XiLBPJDVZDRazrUSOGz3ynaTohSDkIBLjHy/IEnY+UgFe/HzdUWkayBzIxkKvclYtT+aL+MupIiP0nVyjoicj2pyAcC6/I9B9SfVZT4oQSqoa0wDcdYIFPxqsqiI2q9xbSmf1bNvmOlYu/Yuczk+mgQYSN2DOPSjGaoLCAzcWEgDEMI5ii8OPAOxkM/hz15heMbPpfm2AIpyTsAAAAASUVORK5CYII="
      alt=""
    />
    <span :title="title">{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: "Title",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped lang="scss">
.title-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 16px;
    flex-shrink: 0;
    color: #ffffff;
  }
  .svg-icon {
    width: 20px;
    height: 16px;
    flex-shrink: 0;
    color: #ffffff;
  }

  span {
    font-family: "YouSheBiaoTiHei";
    margin-left: 10px;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 26px;
    color: #ffffff;
  }
}
</style>
