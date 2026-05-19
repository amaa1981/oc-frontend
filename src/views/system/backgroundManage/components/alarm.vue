<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 11:04:58
 * @LastEditTime: 2025-05-26 09:51:17
 * @LastEditors: FGJ
 * @Description: 清理告警记录配置
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\alarm.vue
-->
<template>
  <div class="app-container" style="width: 600px">
    <el-row v-loading="loading">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>{{ $t("systemConfig.title") }}</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="200px">
            <el-form-item
              :label="$t('systemConfig.delAlarmTime')"
              prop="delAlarmTime"
            >
              <el-input
                v-model="form.delAlarmTime"
                :placeholder="$t('commonTips.pleaseEnter')"
              >
                <el-select
                  v-model="form.delAlarmStatus"
                  slot="prepend"
                  class="input-with-select"
                >
                  <el-option
                    v-for="dict in dict.type.v1_startup_status"
                    :key="dict.value"
                    :label="$t('dict.v1_startup_status.' + dict.value)"
                    :value="dict.value"
                  ></el-option> </el-select
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('systemConfig.delSysTime')"
              prop="delSysTime"
            >
              <el-input
                v-model="form.delSysTime"
                :placeholder="$t('commonTips.pleaseEnter')"
              >
                <el-select
                  v-model="form.delSysStatus"
                  slot="prepend"
                  class="input-with-select"
                >
                  <el-option
                    v-for="dict in dict.type.v1_startup_status"
                    :key="dict.value"
                    :label="$t('dict.v1_startup_status.' + dict.value)"
                    :value="dict.value"
                  ></el-option> </el-select
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('systemConfig.heartbeatPushTime')"
              prop="heartbeatPushTime"
            >
              <el-input
                v-model="form.heartbeatPushTime"
                :placeholder="$t('commonTips.pleaseEnter')"
              >
                <el-select
                  v-model="form.isHeartbeat"
                  slot="prepend"
                  class="input-with-select"
                >
                  <el-option
                    v-for="dict in dict.type.v1_startup_status"
                    :key="dict.value"
                    :label="$t('dict.v1_startup_status.' + dict.value)"
                    :value="dict.value"
                  ></el-option> </el-select
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('systemConfig.alarmSocketStatus')"
              prop="alarmSocketStatus"
            >
              <el-select
                v-model="form.alarmSocketStatus"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width: 100%"
              >
                <el-option
                  v-for="dict in dict.type.v1_startup_status"
                  :key="dict.value"
                  :label="$t('dict.v1_startup_status.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.boxCode')">
              <el-input
                v-model="form.boxCode"
                :placeholder="$t('commonTips.pleaseEnter')"
              >
              </el-input>
            </el-form-item>

            <el-form-item :label="$t('systemConfig.imageIp')">
              <el-input
                v-model="form.remarks3"
                :placeholder="$t('commonTips.pleaseEnter')"
              >
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="">
              <el-checkbox
                v-model="openAudio"
                :label="$t('device.openAudio')"
                @change="openAudios"
                border
              ></el-checkbox>
            </el-form-item> -->
          </el-form>
          <div class="footer_btn">
            <el-button type="primary" @click="submitForm">{{
              $t("commonBtn.confirm")
            }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getConfig, updateConfig } from "@/api/system/alarm";
import { audioStatus, getAudioStatus } from "@/api/system/device";
export default {
  name: "Config",
  dicts: ["v1_startup_status"],
  data() {
    return {
      openAudio: false,
      id: 1, // 此id固定，数据库只有此记录
      loading: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        delAlarmTime: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        delAlarmStatus: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        alarmSocketStatus: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        delSysTime: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        heartbeatPushTime: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        boxCode: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        delSysStatus: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openAudios() {
      console.log(this.openAudio);
      if (this.openAudio) {
        this.setAudio(10);
      } else {
        this.setAudio(20);
      }
    },
    setAudio(e) {
      audioStatus(e).then((res) => {
        this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
      });
    },
    /** 查询清理告警记录配置列表 */
    getList() {
      this.loading = true;
      getConfig(1).then((response) => {
        this.loading = false;
        this.form = response.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            this.$modal
              .confirm(that.$t("commonTips.confirm"))
              .then(function () {
                updateConfig(that.form).then((response) => {
                  that.$modal.msgSuccess(that.$t("commonTips.edit_s"));
                  that.getList();
                });
              })
              .catch(() => {});
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" >
.input-with-select {
  .el-input--suffix {
    width: 100px !important;
  }
}
.app-container {
  .el-select .el-input {
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
<style scoped>
.footer_btn {
  text-align: center;
  margin-top: 20px;
}
</style>
