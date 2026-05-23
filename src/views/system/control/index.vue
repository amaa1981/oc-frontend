<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Enter name"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Access Control IP" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="Enter access control IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >Search</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >Reset</el-button
        >
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
          >Add</el-button
        >
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:control:edit']"
        >Edit</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:control:remove']"
        >Delete</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:control:export']"
        >Export</el-button>
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="controlList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Installation Location" align="center" prop="position" />
      <el-table-column label="Access Type" align="center" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" type="success">{{
            $t("dict.v1_door_type.1")
          }}</el-tag>
          <el-tag v-else type="danger">{{ $t("dict.v1_door_type.0") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Access Control IP" align="center" prop="ip" />
      <el-table-column label="Device Port" align="center" prop="port" />
      <el-table-column label="Username" align="center" prop="userName" />
      <el-table-column label="Password" align="center" prop="passWord" />
      <el-table-column label="Access Control Index" align="center" prop="gatewayIndex" />
      <el-table-column label="Status" align="center" prop="staic">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.staic === 1" type="success">{{
            $t("dict.v1_door_status.1")
          }}</el-tag>
          <el-tag v-else type="danger">{{
            $t("dict.v1_door_status.0")
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        class-name="small-padding fixed-width"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >Edit</el-button
          >

          <el-button
            type="text"
            icon="el-icon-view"
            size="mini"
            @click="handleViewDoor(scope.row)"
            >View Access Records</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:control:remove']"
            >Delete</el-button
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

    <!-- 添加或修改门禁设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter name" />
        </el-form-item>
        <el-form-item label="Installation Location" prop="position">
          <el-input v-model="form.position" placeholder="Enter installation location" />
        </el-form-item>
        <el-form-item label="Entry/Exit Type" prop="type">
          <el-select v-model="form.type" placeholder="Select">
            <el-option
              :label="$t('dict.v1_door_type.1')"
              :value="1"
            ></el-option>
            <el-option
              :label="$t('dict.v1_door_type.0')"
              :value="0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Access Control IP" prop="ip">
          <el-input v-model="form.ip" placeholder="Enter access control IP" />
        </el-form-item>
        <el-form-item label="Access Control Port" prop="port">
          <el-input v-model="form.port" placeholder="Enter access control port" />
        </el-form-item>
        <el-form-item label="Username" prop="userName">
          <el-input v-model="form.userName" placeholder="Enter username" />
        </el-form-item>
        <el-form-item label="Password" prop="passWord">
          <el-input v-model="form.passWord" placeholder="Enter password" />
        </el-form-item>
        <el-form-item label="Gateway Index" prop="gatewayIndex">
          <el-input
            v-model="form.gatewayIndex"
            placeholder="Enter gateway index"
            type="number"
          />
        </el-form-item>

        <el-form-item label="Status" prop="staic">
          <el-select v-model="form.staic" placeholder="Select">
            <el-option
              :label="$t('dict.v1_door_status.1')"
              :value="1"
            ></el-option>
            <el-option
              :label="$t('dict.v1_door_status.0')"
              :value="0"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listControl,
  getControl,
  delControl,
  addControl,
  updateControl,
} from "@/api/system/control";

export default {
  name: "Control",
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
      // 门禁设备信息表格数据
      controlList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        ip: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "Name is required", trigger: "blur" }],
        type: [
          { required: true, message: "Entry/Exit type is required", trigger: "change" },
        ],
        ip: [{ required: true, message: "Access control IP is required", trigger: "blur" }],
        port: [
          { required: true, message: "Access control port is required", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "Username is required", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "Password is required", trigger: "blur" },
        ],
        staic: [{ required: true, message: "Status is required", trigger: "change" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleViewDoor(row) {
      this.$router.push({
        path: "/alarmmanger/door",
        query: {
          id: row.id,
        },
      });
    },
    /** Query access control device list */
    getList() {
      this.loading = true;
      listControl(this.queryParams).then((response) => {
        this.controlList = response.data.records;
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
        name: null,
        position: null,
        type: null,
        ip: null,
        port: null,
        userName: null,
        passWord: null,
        gatewayIndex: null,
        staic: null,
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
      this.title = "Add Access Control Device";
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getControl(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit Access Control Device";
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateControl(this.form).then((response) => {
              this.$modal.msgSuccess("Updated successfully");
              this.open = false;
              this.getList();
            });
          } else {
            addControl(this.form).then((response) => {
              this.$modal.msgSuccess("Added successfully");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** Delete handler */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('Are you sure you want to delete access control device #' + ids + '?')
        .then(function () {
          return delControl(ids);
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
        "system/control/export",
        {
          ...this.queryParams,
        },
        `control_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
