<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>MQTT Push Configuration</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="MQTT Connection Info" prop="connectInfo">
              <el-input
                v-model="form.connectInfo"
                placeholder="Enter MQTT connection info"
              />
            </el-form-item>
            <el-form-item label="MQTT Username" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="Enter MQTT username"
              />
            </el-form-item>
            <el-form-item label="MQTT Password" prop="password">
              <el-input v-model="form.password" placeholder="Enter MQTT password" />
            </el-form-item>
            <el-form-item label="QoS Level" prop="qos">
              <el-select v-model="form.qos" placeholder="" style="width: 100%">
                <el-option key="0" label="0" value="0"></el-option>
                <el-option key="1" label="1" value="1"></el-option>
                <el-option key="2" label="2" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Client ID" prop="clientId">
              <el-input v-model="form.clientId" placeholder="Enter client ID" />
            </el-form-item>
            <el-form-item label="Push Topic" prop="topic">
              <el-input v-model="form.topic" placeholder="Enter push topic" />
            </el-form-item>
            <el-form-item label="Status" prop="status">
              <el-select
                v-model="form.status"
                placeholder="Select status"
                style="width: 100%"
              >
                <el-option
                  v-for="dict in dict.type.v1_startup_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Connection Status" prop="connectStatus">
              <el-select
                v-model="form.connectStatus"
                placeholder="Select connection status"
                style="width: 100%"
                disabled="true"
              >
                <el-option
                  v-for="dict in dict.type.v1_connection_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Push Alarm Type" prop="alarmType">
              <el-select
                v-model="form.alarmType"
                placeholder="Select alarm type"
                style="width: 100%"
                multiple
                @change="changeAlarmType"
              >
                <el-option key="22222" label="All" value="0" />
                <el-option
                  v-for="dict in dict.type.v1_alarm_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
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
} from "@/api/system/mqtt";

export default {
  name: "Config",
  dicts: ["v1_startup_status", "v1_alarm_type", "v1_connection_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // mqtt推送配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        connectInfo: [
          {
            required: true,
            message: "MQTT connection info is required",
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "MQTT username is required", trigger: "blur" },
        ],
        password: [
          { required: true, message: "MQTT password is required", trigger: "blur" },
        ],
        qos: [
          {
            required: true,
            message: "QoS level is required",
            trigger: "blur",
          },
        ],
        clientId: [
          { required: true, message: "Client ID is required", trigger: "blur" },
        ],
        topic: [
          { required: true, message: "Push topic is required", trigger: "blur" },
        ],
        status: [
          { required: true, message: "Status is required", trigger: "change" },
        ],
        connectStatus: [
          { required: true, message: "Connection status is required", trigger: "change" },
        ],
        alarmType: [
          {
            required: true,
            message: "Alarm type is required",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.handleUpdate();
  },
  methods: {
    //选中推送报警全部时，清空其他选项
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

      console.log(e);
    },
    /** Query MQTT push config list */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.data.records;
        this.total = response.data.totalCount;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        connectInfo: null,
        userName: null,
        password: null,
        qos: null,
        clientId: null,
        topic: null,
        status: null,
        connectStatus: null,
        alarmType: null,
        createTime: null,
        updateTime: null,
        createId: null,
        updateId: null,
        createBy: null,
        updateBy: null,
      };
      this.resetForm("form");
    },
    /** Search handler */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** Reset handler */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add MQTT Config";
    },
    /** Edit handler */
    handleUpdate() {
      this.reset();
      const id = 1;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.form.alarmType = this.form.alarmType.split(",");
        this.open = true;
        this.title = "Edit MQTT Config";
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.alarmType = this.form.alarmType.join(",");
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("Updated successfully");
              this.handleUpdate();
            });
          } else {
            addConfig(this.form).then((response) => {
              this.$modal.msgSuccess("Updated successfully");
              this.handleUpdate();
            });
          }
        }
      });
    },
    /** Delete handler */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('Are you sure you want to delete MQTT config #' + ids + '?')
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Deleted successfully");
        })
        .catch(() => {});
    },
    /** Export handler */
    handleExport() {
      this.download(
        "system/config/export",
        {
          ...this.queryParams,
        },
        `config_${new Date().getTime()}.xlsx`
      );
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