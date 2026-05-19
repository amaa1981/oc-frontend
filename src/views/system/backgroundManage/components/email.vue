<!--
 * @Description: 邮箱推送配置
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
        >{{ $t("commonBtn.add") }}</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dataList"
    >
      <el-table-column :label="$t('push.email')" align="center" prop="email" />
      <el-table-column :label="$t('push.status')" align="center" prop="status">
        <template slot-scope="scope">
          {{ $t("dict.v1_startup_status." + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('push.alarmType')" align="center" prop="alarmType">
        <template slot-scope="scope">
          <span v-if="scope.row.alarmType && scope.row.alarmType != '0'">
            <span v-for="(item, index) in scope.row.alarmType.split(',')" :key="item">
              {{ $t('dict.v1_alarm_type.' + item) }}<span v-if="index < scope.row.alarmType.split(',').length - 1">、</span>
            </span>
          </span>
          <span v-else>{{ $t("push.all") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('commonBtn.operate')"
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
          >{{ $t("commonBtn.edit") }}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
          >{{ $t("commonBtn.remove") }}</el-button>
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

    <!-- 添加或修改邮箱推送配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('push.email')" prop="email">
          <el-input
            v-model="form.email"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('push.status')" prop="status">
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
        <el-form-item :label="$t('push.alarmType')" prop="alarmType">
          <el-select
            v-model="form.alarmType"
            :placeholder="$t('commonTips.pleaseSelect')"
            multiple
            @change="changeAlarmType"
          >
            <el-option key="all" :label="$t('push.all')" value="0" />
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
        <el-button type="primary" @click="submitForm">{{ $t("commonBtn.confirm") }}</el-button>
        <el-button @click="cancel">{{ $t("commonBtn.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listEmailPush,
  getEmailPush,
  delEmailPush,
  addEmailPush,
  updateEmailPush,
} from "@/api/system/email";

export default {
  name: "EmailPush",
  dicts: ["v1_startup_status", "v1_alarm_type"],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      dataList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        email: null,
        status: null,
        alarmType: null,
      },
      form: {},
      rules: {
        email: [
          { required: true, message: this.$t("push.emailRequired"), trigger: "blur" },
          { type: "email", message: this.$t("push.emailFormatError"), trigger: "blur" },
        ],
        status: [
          { required: true, message: this.$t("push.statusRequired"), trigger: "change" },
        ],
        alarmType: [
          { required: true, message: this.$t("push.alarmTypeRequired"), trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeAlarmType(e) {
      if (e[e.length - 1] == "0") {
        this.$nextTick(() => {
          this.$set(this.form, "alarmType", ["0"]);
        });
      } else {
        this.$nextTick(() => {
          this.$set(this.form, "alarmType", e.filter((item) => item != "0"));
        });
      }
    },
    getList() {
      this.loading = true;
      listEmailPush(this.queryParams).then((response) => {
        this.dataList = response.data.records || [];
        this.total = response.data.totalCount || 0;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: null,
        email: null,
        status: null,
        alarmType: null,
      };
      this.resetForm("form");
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t("push.addEmailPush");
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getEmailPush(id).then((response) => {
        this.form = response.data;
        if (this.form.alarmType) {
          this.form.alarmType = this.form.alarmType.split(",");
        }
        this.open = true;
        this.title = this.$t("push.editEmailPush");
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const submitData = { ...this.form };
          submitData.alarmType = submitData.alarmType.join(",");
          if (submitData.id != null) {
            updateEmailPush(submitData).then(() => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addEmailPush(submitData).then(() => {
              this.$modal.msgSuccess(this.$t("commonTips.add_s"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("push.confirmDeleteEmail", { ids }))
        .then(() => {
          return delEmailPush(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
  },
};
</script>
