<!--
 * @Author: LK-5919 1628069508@qq.com
 * @Date: 2023-03-09 20:44:32
 * @LastEditTime: 2023-06-12 17:13:05
 * @LastEditors: NULL 1628069508@qq.com
 * @Description:
 * @FilePath: \ruoyi-ui\src\views\system\camera\index.vue
-->
<template>
  <div id="apps">
    <page-banner
      :title="$t('monitor.title')"
      :subtitle="$t('monitor.subtitle')"
      :deco-image="decoImage"
    />
    <div class="container">
      <div class="left">
        <listTree></listTree>
      </div>
      <div class="right">
        <Screen></Screen>
      </div>
    </div>
  </div>
</template>

<script>
import listTree from "@/components/listTree/index.vue";
import Screen from "@/components/playerScreen/index.vue";
import decoImg from '@/assets/images/top_bg_right_1.png'
export default {
  name: "camera",
  components: {
    listTree,
    Screen,
  },
  data() {
    return {
      decoImage: decoImg
    }
  },
  mounted() {},
  methods: {},
  watch: {},
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
#apps {
  height: calc(100vh - 50px);
  margin: 0;
  // padding: 16px;
  box-sizing: border-box;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;

  .container {
    display: flex;
    flex: 1;
    min-height: 0;
    width: 100%;
    gap: 16px;
    box-sizing: border-box;

    .left {
      flex-shrink: 0;
      height: 100%;
      overflow: hidden;
    }

    .right {
      flex: 1;
      min-width: 0;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
