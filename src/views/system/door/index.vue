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
      <el-form-item label="Access Control ID" prop="accessControlId">
        <el-input
          v-model="queryParams.accessControlId"
          placeholder="Enter access control ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Enter name"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安装位置" prop="position">
        <el-input
          v-model="queryParams.position"
          placeholder="Enter installation location"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="recordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="Access Control ID" align="center" prop="accessControlId" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="安装位置" align="center" prop="position" />
      <el-table-column label="进出类型" align="center" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" type="success">{{
            $t("dict.v1_door_type.1")
          }}</el-tag>
          <el-tag v-else type="danger">{{ $t("dict.v1_door_type.0") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="门禁序号" align="center" prop="gatewayIndex" />
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
        label="Created At"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:door:remove']"
            >删除</el-button
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
  </div>
</template>

<script>
import {
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
} from "@/api/system/recorddoor";

export default {
  name: "Record",
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
      // 门禁操作记录信息表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accessControlId: null,
        name: null,
        position: null,
        type: null,
        staic: null,
        isDelete: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.queryParams.accessControlId = this.$route.query.id;
    this.getList();
  },
  methods: {
    /** Query door operation record list */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then((response) => {
        this.recordList = response.data.records;
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
        accessControlId: null,
        name: null,
        position: null,
        type: null,
        gatewayIndex: null,
        staic: null,
        createTime: null,
        updateTime: null,
        createId: null,
        updateId: null,
        createBy: null,
        updateBy: null,
        isDelete: null,
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
      this.title = "Add Door Record";
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "Edit Door Record";
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateRecord(this.form).then((response) => {
              this.$modal.msgSuccess("Updated successfully");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then((response) => {
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
        .confirm('Are you sure you want to delete door record #' + ids + '?')
        .then(function () {
          return delRecord(ids);
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
        "system/record/export",
        {
          ...this.queryParams,
        },
        `record_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
