<template>
  <div class="app-container" style="width: 500px">
    <el-row v-loading="loading">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>{{ $t("publicAccountConfig.title") }}</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <!-- <el-form-item
              :label="$t('publicAccountConfig.pushAccount')"
              prop="pushAccount"
            >
              <el-input
                v-model="form.pushAccount"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item> -->

            <el-form-item
              :label="$t('publicAccountConfig.httpUrl')"
              prop="httpUrl"
            >
              <el-input
                v-model="form.httpUrl"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('publicAccountConfig.alarmType')"
              prop="alarmType"
            >
              <el-select
                v-model="form.alarmType"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width: 100%"
                multiple
                @change="changeAlarmType"
              >
                <el-option
                  key="22222"
                  :label="$t('publicAccountConfig.all')"
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
            <el-form-item
              :label="$t('publicAccountConfig.status')"
              prop="status"
            >
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
              v-for="(item, index) in form.pushAccount"
              :label="$t('publicAccountConfig.pushAccount') + index"
              :key="index"
              :rules="{
                required: true,
                message: '',
                trigger: 'blur',
              }"
            >
              <el-input v-model="form.pushAccount[index]">
                <el-button
                  slot="append"
                  icon="el-icon-delete"
                  @click.prevent="removeDomain(index)"
                ></el-button
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="footer_btn">
            <el-button type="primary" @click="submitForm">{{
              $t("commonBtn.confirm")
            }}</el-button>

            <el-button type="success" @click="addDomain">{{
              $t("commonBtn.adduser")
            }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getPublicAccountConfig,
  editPublicAccountConfig,
} from "@/api/system/publicAccount";

export default {
  name: "puclicAccount",
  dicts: ["v1_startup_status", "v1_alarm_type"],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表单参数
      form: {
        id: "",
        pushAccount: [],
        httpUrl: "",
        alarmType: "",
        status: "",
      },
      // 表单校验
      rules: {
        pushAccount: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        httpUrl: [
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
    addDomain() {
      if (this.form.pushAccount == null) {
        this.form.pushAccount = [];
      }
      this.form.pushAccount.push("");
    },
    removeDomain(index) {
      this.form.pushAccount.splice(index, 1);
    },
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
    /** 修改按钮操作 */
    getList() {
      this.loading = true;
      getPublicAccountConfig(1).then((response) => {
        if (response.code === "200") {
          this.loading = false;
          this.form = response.data;
          this.form.alarmType = this.form.alarmType.split(",");
          // this.form.pushAccount = response.data.pushAccount.toString();
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.alarmType = this.form.alarmType.join(",");
          // this.form.pushAccount = this.form.pushAccount.split(",");
          if (this.form.id != null) {
            this.$modal
              .confirm(that.$t("commonTips.confirm"))
              .then(function () {
                editPublicAccountConfig(that.form).then((response) => {
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
