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
      <el-form-item label="Version" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="Enter version number"
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
          v-hasPermi="['system:info:add']"
          >Add</el-button
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
          v-hasPermi="['system:info:edit']"
          >Edit</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:info:remove']"
          >Delete</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:info:export']"
          >Export</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="infoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Version" align="center" prop="version" />
      <el-table-column label="HTTP URL" align="center" prop="httpUrl" />
      <el-table-column
        label="Absolute Path"
        align="center"
        prop="absolutePath"
      />
      <el-table-column
        label="Actions"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']"
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

    <!-- Add or Edit service installation package information dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Version" prop="version">
          <el-input v-model="form.version" placeholder="Enter version number" />
        </el-form-item>
        <el-form-item label="HTTP URL" prop="httpUrl">
          <el-input v-model="form.httpUrl" placeholder="Enter HTTP URL" />
        </el-form-item>
        <el-form-item label="Absolute Path" prop="absolutePath">
          <el-input
            v-model="form.absolutePath"
            placeholder="Enter absolute path"
          />
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
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
} from "@/api/system/info";
import { getToken } from "@/utils/auth";
export default {
  name: "Info",
  data() {
    return {
      myHeaders: {
        Authorization: "Bearer " + getToken(),
      },
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
      // Service installation package information table data
      infoList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        version: null,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        version: [
          { required: true, message: "Version number is required", trigger: "blur" },
        ],
        httpUrl: [
          { required: true, message: "HTTP URL is required", trigger: "blur" },
        ],
        absolutePath: [
          {
            required: true,
            message: "Absolute path is required",
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
    /** Query service package list */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.data.records;
        this.total = response.data.totalCount;
        this.loading = false;
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
        id: null,
        version: null,
        httpUrl: null,
        absolutePath: null,
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
    // Selection change
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add Service Package";
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit Service Package";
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then((response) => {
              this.$modal.msgSuccess("Updated successfully");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then((response) => {
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
        .confirm('Are you sure you want to delete service package #' + ids + '?')
        .then(function () {
          return delInfo(ids);
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
        "system/info/export",
        {
          ...this.queryParams,
        },
        `info_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
