<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 11:02:37
 * @LastEditTime: 2023-07-14 14:24:13
 * @LastEditors: FGJ
 * @Description: MQTT push configuration page
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\mqtt.vue
-->
<template>
  <div class="app-container" style="width: 500px">
    <el-row v-loading="loading">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>{{ $t("mqttConfig.title") }}</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item
              :label="$t('mqttConfig.mqttConnectInfo')"
              prop="connectInfo"
            >
              <el-input
                v-model="form.connectInfo"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('mqttConfig.mqttUserName')"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('mqttConfig.mqttPW')" prop="password">
              <el-input
                v-model="form.password"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('mqttConfig.qosMsg')" prop="qos">
              <el-select
                v-model="form.qos"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width: 100%"
              >
                <el-option key="0" label="0" value="0"></el-option>
                <el-option key="1" label="1" value="1"></el-option>
                <el-option key="2" label="2" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item :label="$t('mqttConfig.clientId')" prop="clientId">
              <el-input
                v-model="form.clientId"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item> -->
            <el-form-item :label="$t('mqttConfig.pushTopic')" prop="topic">
              <el-input
                v-model="form.topic"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('mqttConfig.status')" prop="status">
              <el-select
                v-model="form.status"
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
            <el-form-item
              :label="$t('mqttConfig.connectStatus')"
              prop="connectStatus"
            >
              <el-select
                v-model="form.connectStatus"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width: 100%"
                disabled
              >
                <el-option
                  v-for="dict in dict.type.v1_connection_status"
                  :key="dict.value"
                  :label="$t('dict.v1_connection_status.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('mqttConfig.alarmType')" prop="alarmType">
              <el-select
                v-model="form.alarmType"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width: 100%"
                multiple
                @change="changeAlarmType"
              >
                <el-option
                  key="22222"
                  :label="$t('mqttConfig.all')"
                  value="0"
                />
                <el-option
                  v-for="dict in dict.type.v1_alarm_type"
                  :key="dict.value"
                  :label="$t('dict.v1_alarm_type.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
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
import { getConfig, updateConfig } from "@/api/system/mqtt";

export default {
  name: "Config",
  dicts: ["v1_startup_status", "v1_alarm_type", "v1_connection_status"],
  data() {
    return {
      // Loading state
      loading: false,
      // Form parameters
      form: {},
      // Form verification
      rules: {
        connectInfo: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        qos: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        clientId: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        topic: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        connectStatus: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        alarmType: [
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
    //When Push Alarm All is selected, clear other Options.
    changeAlarmType(e) {
      let that = this;
      if (e[e.length - 1] == "0") {
        that.$nextTick(() => {
          that.$set(that.form, "alarmType", ["0"]);
        });
      } else {
        that.$nextTick(() => {
          that.$set(
            that.form,
            "alarmType",
            e.filter((item) => item != "0")
          );
        });
      }
    },
    /** Edit handler */
    getList() {
      this.loading = true;
      getConfig(1).then((response) => {
        if (response.data) {
          this.form = response.data;
          if (this.form.alarmType) {
            this.form.alarmType = this.form.alarmType.split(",");
          }
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** Submit handler */
    submitForm() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.alarmType = this.form.alarmType.join(",");
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
<style scoped>
.footer_btn {
  text-align: center;
  margin-top: 20px;
}
</style>
