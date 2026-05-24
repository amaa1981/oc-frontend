<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 11:06:24
 * @LastEditTime: 2023-08-03 10:51:02
 * @LastEditors: FGJ
 * @Description: HTTP push configuration
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\jar.vue
-->
<template>
  <div class="app-container">
    <el-upload
      class="upload-demo"
      drag
      :action="IP1"
      multiple
      :headers="myHeaders"
      :on-success="handleUploadSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("jarUpload.uploadTip", { fileType: "JAR" }) }}
      </div>
    </el-upload>

    <el-upload
      class="upload-demo"
      drag
      :action="IP2"
      multiple
      :headers="myHeaders"
      :data="{ version: version }"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("jarUpload.uploadTip", { fileType: "WEB" }) }}
      </div>
    </el-upload>
    <el-input
      type="text"
      style="width: 360px; margin-top: 20px"
      placeholder="version"
      v-model="version"
    ></el-input>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "Config",

  data() {
    return {
      IP1: process.env.VUE_APP_BASE_API + "/service/update/updateJar",
      IP2: process.env.VUE_APP_BASE_API + "/service/update/updateWeb",
      myHeaders: {
        Authorization: "Bearer " + getToken(),
      },
      //version number
      version: "",
    };
  },
  created() {
    let da = new Date();
    //When the obtained month is less than 10, 0 will be added automatically.
    let month =
      da.getMonth() + 1 < 10 ? "0" + (da.getMonth() + 1) : da.getMonth() + 1;
    //When the acquisition date is less than 10, 0 will be added automatically.
    let date = da.getDate() < 10 ? "0" + da.getDate() : da.getDate();
    this.version = "1.23." + month + "." + date + "1";
  },
  methods: {
    beforeUpload(res) {
      if (this.version == "") {
        this.$modal.msgError("Please enter version number");
        return false;
      }
    },
    handleUploadSuccess(res) {
      if (res.code == 200) {
        this.$modal.msgSuccess("ok");
      } else {
        this.$modal.msgError(res.msg);
      }
    },
  },
};
</script>
