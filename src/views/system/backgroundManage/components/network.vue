<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:58:50
 * @LastEditTime: 2024-01-23 17:12:26
 * @LastEditors: FGJ
 * @Description: Network configuration page
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\network.vue
-->
<template>
  <div class="app-container" style="width: 580px">
    <el-row v-loading="loading">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>{{ $t("networkInfoConfig.title") }}</span>
          </div>

          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item
              :label="$t('networkInfoConfig.networkCard')"
              prop="internetCard"
            >
              <el-select
                v-model="form.internetCard"
                :placeholder="$t('commonTips.pleaseSelect')"
                @change="changeInternetCard"
              >
                <el-option label="eth0" value="eth0"></el-option>
                <el-option label="eth1" value="eth1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('networkInfoConfig.IP')" prop="ip" key="1">
              <ip-input v-model="form.ip" />
            </el-form-item>

            <el-form-item
              :label="$t('networkInfoConfig.subnetMask')"
              prop="netMask"
              key="3"
            >
              <ip-input v-model="form.netMask" />
            </el-form-item>

            <el-form-item
              :label="$t('networkInfoConfig.defaultGateway')"
              prop="defaultGateway"
              key="5"
            >
              <ip-input v-model="form.defaultGateway" />
            </el-form-item>

            <el-form-item
              :label="$t('networkInfoConfig.preferredDNS')"
              prop="dns1"
            >
              <ip-input v-model="form.dns1" />
            </el-form-item>
            <el-form-item
              :label="$t('networkInfoConfig.alternateDNS')"
              prop="dns2"
            >
              <ip-input v-model="form.dns2" />
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
import { getConfig, updateConfig } from "@/api/system/network";
import IpInput from "@/components/IpInput";
export default {
  name: "Config",
  components: {
    IpInput,
  },
  data() {
    var checkIp = (rule, value, callback) => {
      if (!value || value == "...") {
        return callback(new Error(this.$t("commonTips.cannotBeEmpty")));
      }
      //Regular Pattern to verify IP address
      var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; // IP address regex
      if (reSpaceCheck.test(value)) {
        value.match(reSpaceCheck);
        if (
          RegExp.$1 <= 255 &&
          RegExp.$1 >= 0 &&
          RegExp.$2 <= 255 &&
          RegExp.$2 >= 0 &&
          RegExp.$3 <= 255 &&
          RegExp.$3 >= 0 &&
          RegExp.$4 <= 255 &&
          RegExp.$4 >= 0
        ) {
          callback();
        } else {
          callback(new Error(this.$t("commonTips.incorrectFormat")));
        }
      } else {
        callback(new Error(this.$t("commonTips.incorrectFormat")));
      }
    };
    return {
      id: "1",
      // Loading state
      loading: true,
      // Form parameters
      form: {},
      // Form verification
      rules: {
        internetCard: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],

        mac: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "chang",
          },
          { validator: checkIp, trigger: "chang" },
        ],
        netMask: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
          { validator: checkIp, trigger: "blur" },
        ],
        defaultGateway: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
          { validator: checkIp, trigger: "blur" },
        ],
        dns1: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
          { validator: checkIp, trigger: "chang" },
        ],
        dns2: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
          { validator: checkIp, trigger: "chang" },
        ],
        port: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        rtspPort: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeInternetCard(e) {
      if (e == "eth0") {
        this.id = 1;
      }
      if (e == "eth1") {
        this.id = 2;
      }
      this.getList();
    },
    /** Edit handler */
    getList() {
      this.loading = true;
      getConfig(this.id).then((response) => {
        this.form = response.data;
        this.loading = false;
      });
    },
    /** Submit handler */
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
<style scoped>
.footer_btn {
  text-align: center;
  margin-top: 20px;
}
</style>
