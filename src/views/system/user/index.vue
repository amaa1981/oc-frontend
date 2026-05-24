<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--Department data-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            :placeholder="$t('commonTips.pleaseEnter')"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--User data-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item :label="$t('user.userName')" prop="userName">
            <el-input
              v-model="queryParams.userName"
              :placeholder="$t('commonTips.pleaseEnter')"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('user.phonenumber')" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              :placeholder="$t('commonTips.pleaseEnter')"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('user.status')" prop="status">
            <el-select
              v-model="queryParams.status"
              :placeholder="$t('commonTips.pleaseEnter')"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="$t('dict.sys_normal_disable.' + dict.value)"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.dateRange')">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="$t('user.startTime')"
              :end-placeholder="$t('user.endTime')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >{{ $t("commonBtn.search") }}</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
              $t("commonBtn.reset")
            }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
              >{{ $t("commonBtn.add") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
              >{{ $t("commonBtn.edit") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
              >{{ $t("commonBtn.remove") }}</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
              >{{ $t("commonBtn.export") }}</el-button
            >
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
              >{{ $t("commonBtn.import") }}</el-button
            >
          </el-col> -->
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            :label="$t('user.userId')"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible"
          />
          <el-table-column
            :label="$t('user.userName')"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            :label="$t('user.nickName')"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            :label="$t('user.deptName')"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            :label="$t('user.phonenumber')"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            :label="$t('user.status')"
            align="center"
            key="status"
            v-if="columns[5].visible"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('user.createTime')"
            align="center"
            prop="createTime"
            v-if="columns[6].visible"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('user.operate')"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                class="btn-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
                >{{ $t("commonBtn.edit") }}</el-button
              >
              <span class="action-divider" />
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                class="btn-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                >{{ $t("commonBtn.remove") }}</el-button
              >
              <el-dropdown
                size="mini"
                @command="(command) => handleCommand(command, scope.row)"
                v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
              >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-d-arrow-right"
                  >{{ $t("user.more") }}</el-button
                >
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="handleResetPwd"
                    icon="el-icon-key"
                    v-hasPermi="['system:user:resetPwd']"
                    >{{ $t("user.resetPassword") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="handleAuthRole"
                    icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']"
                    >{{ $t("user.assignRoles") }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
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
      </el-col>
    </el-row>

    <!-- Add or Edit User Configuration Dialog -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('user.nickName')" prop="nickName">
              <el-input
                v-model="form.nickName"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('user.deptId')" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :show-count="true"
                :placeholder="$t('commonTips.pleaseSelect')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('user.phonenumber')" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('user.email')" prop="email">
              <el-input
                v-model="form.email"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              :label="$t('user.userName')"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              :label="$t('user.password')"
              prop="password"
            >
              <el-input
                v-model="form.password"
                :placeholder="$t('commonTips.pleaseEnter')"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('user.sex')">
              <el-select
                v-model="form.sex"
                :placeholder="$t('commonTips.pleaseSelect')"
              >
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="$t('dict.sys_user_sex.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('user.status')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ $t("dict.sys_normal_disable." + dict.value) }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('user.postIds')">
              <el-select
                v-model="form.postIds"
                multiple
                :placeholder="$t('commonTips.pleaseSelect')"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('user.roleIds')">
              <el-select
                v-model="form.roleIds"
                multiple
                :placeholder="$t('commonTips.pleaseSelect')"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('user.remark')">
              <el-input
                v-model="form.remark"
                type="textarea"
                :placeholder="$t('commonTips.pleaseEnter')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{
          $t("commonBtn.confirm")
        }}</el-button>
        <el-button @click="cancel">{{ $t("commonBtn.cancel") }}</el-button>
      </div>
    </el-dialog>

    <!-- User import dialog -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{ $t("user.uploadTip1") }}</div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t("user.uploadTip2") }}
          </div>
          <span>{{ $t("user.uploadTip3") }}</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >{{ $t("user.downloadTips") }}</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">{{
          $t("commonBtn.confirm")
        }}</el-button>
        <el-button @click="upload.open = false">{{
          $t("commonBtn.cancel")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  deptTreeSelect,
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  components: { Treeselect },
  data() {
    return {
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
      // user form data
      userList: null,
      // Popup layer Title
      title: "",
      // Department TreeOptions
      deptOptions: undefined,
      // Dialog visible
      open: false,
      // Department name
      deptName: undefined,
      // default password
      initPassword: undefined,
      // date range
      dateRange: [],
      // PositionOptions
      postOptions: [],
      // RoleOptions
      roleOptions: [],
      // Form parameters
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // User import parameters
      upload: {
        // Dialog visible (user import)
        open: false,
        // Pop-up layer Title (imported by user)
        title: "",
        // Disabledupload
        isUploading: false,
        // Whether to update existing user data
        updateSupport: 0,
        // Set upload request headers
        headers: { Authorization: "Bearer " + getToken() },
        // Upload address
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // Column information
      columns: [
        { key: 0, label: this.$t("user.userId"), visible: true },
        { key: 1, label: this.$t("user.userName"), visible: true },
        { key: 2, label: this.$t("user.nickName"), visible: true },
        { key: 3, label: this.$t("user.deptName"), visible: true },
        { key: 4, label: this.$t("user.phonenumber"), visible: true },
        { key: 5, label: this.$t("user.status"), visible: true },
        { key: 6, label: this.$t("user.createTime"), visible: true },
      ],
      // Form verification
      rules: {
        userName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: this.$t("user.userName_r"),
            trigger: "blur",
          },
        ],
        nickName: [
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
          {
            min: 5,
            max: 20,
            message: this.$t("user.password_r"),
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: this.$t("user.eamil_r"),
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: this.$t("user.phonenumber_r"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // Filter department tree by name
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** Query user list */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** Query dept tree */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // Filter nodes
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // Node click event
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // User statusEdit
    handleStatusChange(row) {
      let text =
        row.status === "0"
          ? this.$t("user.enable")
          : this.$t("user.deactivate");
      this.$modal
        .confirm(
          this.$t("user.confirmChangeStatus", { text, username: row.userName })
        )
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(this.$t("user.success", { text }));
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // Cancel
    cancel() {
      this.open = false;
      this.reset();
    },
    // FormReset
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // Selection change
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // More action triggers
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      getUser().then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = this.$t("user.dialogTitle_a");
        this.form.password = this.initPassword;
      });
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = this.$t("user.dialogTitle_e");
        this.form.password = "";
      });
    },
    /** Reset password handler */
    handleResetPwd(row) {
      this.$prompt(
        this.$t("user.confirmResetPassword", { username: row.userName }),
        this.$t("user.tip"),
        {
          confirmButtonText: this.$t("commonBtn.confirm"),
          cancelButtonText: this.$t("commonBtn.cancel"),
          closeOnClickModal: false,
          inputPattern: /^.{5,20}$/,
          inputErrorMessage: this.$t("user.inputErrorMessage"),
        }
      )
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess(this.$t("user.successTip", { value }));
          });
        })
        .catch(() => {});
    },
    /** Assign role handler */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** Submit handler */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.add_s"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** Delete handler */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm(this.$t("user.comfirmRemove", { userIds }))
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
    /** Export handler */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** Import handler */
    handleImport() {
      this.upload.title = this.$t("user.import");
      this.upload.open = true;
    },
    /** Download template handler */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {},
        `user_template_${new Date().getTime()}.xlsx`
      );
    },
    // Processed in File Upload
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // File Upload successfully processed
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "Import Result",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // Submit to upload files
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
