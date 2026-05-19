<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>网络信息配置</span>
          </div>

          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="网卡" prop="internetCard">
              <!-- <el-input v-model="form.internetCard" placeholder="请输入网卡" />
              -->

              <el-select
                v-model="form.internetCard"
                placeholder="请选择网卡"
                @change="changeInternetCard"
              >
                <el-option label="eth0" value="eth0"></el-option>
                <el-option label="eth1" value="eth1"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="MAC地址" prop="mac">
              <el-input
                v-model="form.mac"
                placeholder="请输入MAC地址"
                :disabled="true"
              />
            </el-form-item> -->
            <!-- <el-form-item label="是否开启DHCP" prop="dhcp">
              <el-form-item>
                <el-switch
                  v-model="form.dhcp"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-form-item> -->

            <el-form-item label="IP地址" prop="ip" key="1">
              <ip-input v-model="form.ip" />
            </el-form-item>

            <el-form-item label="子网掩码" prop="netMask" key="3">
              <ip-input v-model="form.netMask" />
            </el-form-item>

            <el-form-item label="默认网关" prop="defaultGateway" key="5">
              <ip-input v-model="form.defaultGateway" />
            </el-form-item>

            <el-form-item label="首选DNS" prop="dns1">
              <ip-input v-model="form.dns1" />
            </el-form-item>
            <el-form-item label="备选DNS" prop="dns2">
              <ip-input v-model="form.dns2" />
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
        return callback(new Error("不能为空"));
      }
      //验证IP地址的正则表达式
      var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式
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
          callback(new Error("格式不正确"));
        }
      } else {
        callback(new Error("格式不正确"));
      }
    };
    return {
      id: "1",
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
      // 网络配置信息表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        internetCard: [
          { required: true, message: "网卡不能为空", trigger: "blur" },
        ],

        mac: [{ required: true, message: "MAC地址不能为空", trigger: "blur" }],
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "chang" },
          { validator: checkIp, trigger: "chang" },
        ],
        netMask: [
          { required: true, message: "子网掩码不能为空", trigger: "blur" },
          { validator: checkIp, trigger: "blur" },
        ],
        defaultGateway: [
          { required: true, message: "默认网关不能为空", trigger: "blur" },
          { validator: checkIp, trigger: "blur" },
        ],
        dns1: [{ required: true, message: "首选DNS不能为空", trigger: "blur" }],
        dns2: [{ required: true, message: "备选DNS不能为空", trigger: "blur" }],
        port: [{ required: true, message: "端口不能为空", trigger: "blur" }],
        rtspPort: [
          { required: true, message: "RTSP端口不能为空", trigger: "blur" },
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
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

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      getConfig(this.id).then((response) => {
        this.form = response.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
            });
          } else {
            addConfig(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
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
