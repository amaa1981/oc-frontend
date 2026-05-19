<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>mqtt推送配置</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="mqtt连接信息" prop="connectInfo">
              <el-input
                v-model="form.connectInfo"
                placeholder="请输入mqtt连接信息"
              />
            </el-form-item>
            <el-form-item label="mqtt用户名" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入mqtt用户名"
              />
            </el-form-item>
            <el-form-item label="mqtt密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入mqtt密码" />
            </el-form-item>
            <el-form-item label="qos接收消息的机制" prop="qos">
              <el-select v-model="form.qos" placeholder="" style="width: 100%">
                <el-option key="0" label="0" value="0"></el-option>
                <el-option key="1" label="1" value="1"></el-option>
                <el-option key="2" label="2" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="clientId" prop="clientId">
              <el-input v-model="form.clientId" placeholder="请输入clientId" />
            </el-form-item>
            <el-form-item label="推送消息主题" prop="topic">
              <el-input v-model="form.topic" placeholder="请输入推送消息主题" />
            </el-form-item>
            <el-form-item label="启动状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择启动状态"
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
            <el-form-item label="连接状态" prop="connectStatus">
              <el-select
                v-model="form.connectStatus"
                placeholder="请选择连接状态"
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
            <el-form-item label="推送报警类型 " prop="alarmType">
              <el-select
                v-model="form.alarmType"
                placeholder="请选择推送报警类型 "
                style="width: 100%"
                multiple
                @change="changeAlarmType"
              >
                <el-option key="22222" label="全部" value="0" />
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
            <el-button type="primary" @click="submitForm">确 定</el-button>
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
            message: "mqtt连接信息不能为空",
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "mqtt用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "mqtt密码不能为空", trigger: "blur" },
        ],
        qos: [
          {
            required: true,
            message: "qos接收消息的机制不能为空",
            trigger: "blur",
          },
        ],
        clientId: [
          { required: true, message: "clientId不能为空", trigger: "blur" },
        ],
        topic: [
          { required: true, message: "推送消息主题不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "启动状态不能为空", trigger: "change" },
        ],
        connectStatus: [
          { required: true, message: "连接状态不能为空", trigger: "change" },
        ],
        alarmType: [
          {
            required: true,
            message: "推送报警类型 不能为空",
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
    /** 查询mqtt推送配置列表 */
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加mqtt推送配置";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      const id = 1;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.form.alarmType = this.form.alarmType.split(",");
        this.open = true;
        this.title = "修改mqtt推送配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.alarmType = this.form.alarmType.join(",");
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.handleUpdate();
            });
          } else {
            addConfig(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.handleUpdate();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除mqtt推送配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
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