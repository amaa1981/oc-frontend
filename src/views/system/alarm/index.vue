<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="Config Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Enter config name"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Select status"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_startup_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-form-item class="form-actions-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:config:add']"
          >Add</el-button
        >
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:config:remove']"
          >Delete</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:config:edit']"
          >Edit</el-button
        >
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:config:export']"
          >Export</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Config Name" align="center" prop="name" />
      <el-table-column
        label="Delete alerts older than (days)"
        align="center"
        prop="time"
      />
      <el-table-column label="Status" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.v1_startup_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
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
            v-hasPermi="['system:config:edit']"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
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

    <!-- Add or Edit Dialog -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Config Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter config name" />
        </el-form-item>
        <el-form-item label="Delete after (days)" prop="time">
          <el-input
            v-model="form.time"
            placeholder="Enter number of days"
          />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status" placeholder="Select status">
            <el-option
              v-for="dict in dict.type.v1_startup_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
} from "@/api/system/alarm";

export default {
  name: "Config",
  dicts: ["v1_startup_status"],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      configList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        status: null,
      },
      form: {},
      rules: {
        name: [
          { required: true, message: "Config name is required", trigger: "blur" },
        ],
        time: [
          { required: true, message: "Please enter number of days", trigger: "blur" },
        ],
        status: [
          { required: true, message: "Status is required", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.data.records || [];
        this.total = response.data.totalCount || 0;
        this.loading = false;
      }).catch(() => {
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
        name: null,
        time: null,
        status: null,
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add Alarm Configuration";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit Alarm Configuration";
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then(() => {
              this.$modal.msgSuccess("Updated successfully");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(() => {
              this.$modal.msgSuccess("Added successfully");
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
        .confirm('Are you sure you want to delete config #' + ids + '?')
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Deleted successfully");
        })
        .catch(() => {});
    },
    handleExport() {
      this.download(
        "system/config/export",
        { ...this.queryParams },
        `config_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>