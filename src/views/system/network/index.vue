<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>Network Configuration</span>
          </div>

          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="Network Card" prop="internetCard">
              <!-- <el-input v-model="form.internetCard" placeholder="Please enter network card" />
              -->

              <el-select
                v-model="form.internetCard"
                placeholder="Select network card"
                @change="changeInternetCard"
              >
                <el-option label="eth0" value="eth0"></el-option>
                <el-option label="eth1" value="eth1"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="MACaddress" prop="mac">
              <el-input
                v-model="form.mac"
                placeholder="Enter MAC address"
                :disabled="true"
              />
            </el-form-item> -->
            <!-- <el-form-item label="Whether to enable DHCP" prop="dhcp">
              <el-form-item>
                <el-switch
                  v-model="form.dhcp"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-form-item> -->

            <el-form-item label="IP Address" prop="ip" key="1">
              <ip-input v-model="form.ip" />
            </el-form-item>

            <el-form-item label="Subnet Mask" prop="netMask" key="3">
              <ip-input v-model="form.netMask" />
            </el-form-item>

            <el-form-item label="Default Gateway" prop="defaultGateway" key="5">
              <ip-input v-model="form.defaultGateway" />
            </el-form-item>

            <el-form-item label="Primary DNS" prop="dns1">
              <ip-input v-model="form.dns1" />
            </el-form-item>
            <el-form-item label="Secondary DNS" prop="dns2">
              <ip-input v-model="form.dns2" />
            </el-form-item>
          </el-form>
          <div class="footer_btn">
            <el-button type="primary" @click="submitForm">Confirm</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
} from "@/api/system/network";
import IpInput from "@/components/IpInput";
export default {
  name: "Config",
  components: {
    IpInput,
  },
  data() {
    var checkIp = (rule, value, callback) => {
      if (!value || value == "...") {
        return callback(new Error("This field is required"));
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
          callback(new Error("Invalid format"));
        }
      } else {
        callback(new Error("Invalid format"));
      }
    };
    return {
      id: "1",
      // Loading state
      loading: true,
      // Selected ids
      ids: [],
      // Disable single-action
      single: true,
      // Disable batch-action
      multiple: true,
      // Show search conditions
      showSearch: true,
      // Total count
      total: 0,
      // Network configuration information table data
      configList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        internetCard: null,
        dhcp: null,
        mac: null,
        ip: null,
        netMask: null,
        defaultGateway: null,
        dns1: null,
        dns2: null,
        port: null,
        rtspPort: null,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        internetCard: [
          { required: true, message: "Network card is required", trigger: "blur" },
        ],

        mac: [{ required: true, message: "MAC address is required", trigger: "blur" }],
        ip: [
          { required: true, message: "IP address is required", trigger: "chang" },
          { validator: checkIp, trigger: "chang" },
        ],
        netMask: [
          { required: true, message: "Subnet mask is required", trigger: "blur" },
          { validator: checkIp, trigger: "blur" },
        ],
        defaultGateway: [
          { required: true, message: "Default gateway is required", trigger: "blur" },
          { validator: checkIp, trigger: "blur" },
        ],
        dns1: [{ required: true, message: "Primary DNS is required", trigger: "blur" }],
        dns2: [{ required: true, message: "Secondary DNS is required", trigger: "blur" }],
        port: [{ required: true, message: "Port is required", trigger: "blur" }],
        rtspPort: [
          { required: true, message: "RTSP port is required", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.handleUpdate();
  },
  methods: {
    changeInternetCard(e) {
      if (e == "eth0") {
        this.id = 1;
      }
      if (e == "eth1") {
        this.id = 2;
      }
      this.handleUpdate();
    },
    // Cancel
    cancel() {
      this.open = false;
      this.reset();
    },
    // FormReset
    reset() {
      this.form = {
        id: "1",
        internetCard: null,
        dhcp: true,
        mac: null,
        ip: null,
        netMask: null,
        defaultGateway: null,
        dns1: null,
        dns2: null,
        port: null,
        rtspPort: null,
        createTime: null,
        updateTime: null,
        createId: null,
        updateId: null,
        createBy: null,
        updateBy: null,
      };
      this.resetForm("form");
    },

    /** Reset handler */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** Edit handler */
    handleUpdate() {
      this.reset();
      getConfig(this.id).then((response) => {
        this.form = response.data;
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("Updated successfully");
            });
          } else {
            addConfig(this.form).then((response) => {
              this.$modal.msgSuccess("Added successfully");
            });
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
