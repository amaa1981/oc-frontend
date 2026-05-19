<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 11:06:24
 * @LastEditTime: 2023-07-31 13:53:09
 * @LastEditors: FGJ
 * @Description: http推送配置
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\http.vue
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:config:add']"
          >{{ $t("commonBtn.add") }}</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
    >
      <el-table-column
        :label="$t('httpConfig.connectInfo')"
        align="center"
        prop="connectInfo"
      />
      <el-table-column
        :label="$t('httpConfig.status')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          {{ $t("dict.v1_startup_status." + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('httpConfig.type')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          {{ $t("dict.v1_http." + scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('httpConfig.alarmType')"
        align="center"
        prop="alarmType"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.alarmType && scope.row.alarmType != '0'">
            <span v-for="(item, index) in scope.row.alarmType.split(',')" :key="item">
              {{ $t('dict.v1_alarm_type.' + item) }}<span v-if="index < scope.row.alarmType.split(',').length - 1">、</span>
            </span>
          </span>
          <span v-else>{{ $t("httpConfig.all") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('httpConfig.opearte')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
            >{{ $t("commonBtn.remove") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改http推送配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('httpConfig.connectInfo')" prop="connectInfo">
          <el-input
            v-model="form.connectInfo"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('httpConfig.status')" prop="status">
          <el-select
            v-model="form.status"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_startup_status"
              :key="dict.value"
              :label="$t('dict.v1_startup_status.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('httpConfig.type')" prop="type">
          <el-select
            v-model="form.type"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_http"
              :key="dict.value"
              :label="$t('dict.v1_http.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('httpConfig.alarmType')"
          prop="alarmType"
          v-if="form.type != 20"
        >
          <el-select
            v-model="form.alarmType"
            :placeholder="$t('commonTips.pleaseSelect')"
            multiple
            @change="changeAlarmType"
          >
            <el-option key="22222" :label="$t('httpConfig.all')" value="0" />
            <el-option
              v-for="dict in dict.type.v1_alarm_type"
              :key="dict.value"
              :label="$t('dict.v1_alarm_type.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{
          $t("commonBtn.confirm")
        }}</el-button>
        <el-button @click="cancel">{{ $t("commonBtn.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
} from "@/api/system/http";

export default {
  name: "Config",
  dicts: ["v1_startup_status", "v1_alarm_type", "v1_http"],
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
      // http推送配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        connectInfo: null,
        status: null,
        alarmType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        connectInfo: [
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

        type: [
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
    /** 查询http推送配置列表 */
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
        status: null,
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
      this.title = this.$t("httpConfig.dialogTitle_a");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.form.alarmType = this.form.alarmType.split(",");
        this.open = true;
        this.title = this.$t("httpConfig.dialogTitle_e");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.alarmType = this.form.alarmType.join(",");
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commmonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commmonTips.add_s"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("httpConfig.confirmRemove", { ids: ids }))
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commmonTips.remove_s"));
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
