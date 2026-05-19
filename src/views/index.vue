<!--
 * @Author: LK-5919 1628069508@qq.com
 * @Date: 2023-03-09 20:44:32
 * @LastEditTime: 2023-06-14 18:50:05
 * @LastEditors: FGJ
 * @Description: 
 * @FilePath: \monitor-app\src\App.vue
-->
<template>
  <div id="apps">
    <div>
      <h2>播放器测试页面</h2>
    </div>
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
export default {
  name: "App",
  components: {
    listTree,
    Screen,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  watch: {},
  beforeDestroy() {},
};
</script>
  
  <style lang="scss" >
</style>
  