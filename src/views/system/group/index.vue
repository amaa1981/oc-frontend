<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item :label="$t('group.libName')" prop="libName">
        <el-input
          v-model="queryParams.libName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('group.algorithmName')" prop="algorithmName">
        <el-input
          v-model="queryParams.algorithmName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
      <el-form-item class="form-actions-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:group:add']"
          >{{ $t("commonBtn.add") }}</el-button
        >
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:group:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:group:edit']"
          >{{ $t("commonBtn.edit") }}</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="groupList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column :label="$t('group.id')" align="center" prop="id" /> -->
      <el-table-column
        :label="$t('group.libName')"
        align="center"
        prop="libName"
      />
      <!-- <el-table-column
        :label="$t('group.algorithmName')"
        align="center"
        prop="algorithmName"
      /> -->
      <el-table-column
        :label="$t('group.operate')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:group:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="getUser(scope.row)"
            v-hasPermi="['system:group:edit']"
            >{{ $t("group.viewPeople") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:group:remove']"
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

    <!-- Add or Edit face database information dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('group.libName')" prop="libName">
          <el-input
            v-model="form.libName"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <!-- <el-form-item :label="$t('group.algorithmName')" prop="algorithmName">
          <el-input
            v-model="form.algorithmName"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item> -->
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
  listGroup,
  getGroup,
  delGroup,
  addGroup,
  updateGroup,
} from "@/api/system/group";

export default {
  name: "Group",
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
      // Face database information table data
      groupList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        libName: null,
        algorithmName: null,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        libName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        algorithmName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
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
    getUser(row) {
      this.$router.push({
        path: "/alarmmanger/people",
        query: { libId: row.libId },
      });
    },
    /** Query face library list */
    getList() {
      this.loading = true;
      listGroup(this.queryParams).then((response) => {
        this.groupList = response.data.records;
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
        libId: null,
        libName: null,
        algorithmName: null,
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
      this.title = this.$t("group.dialogTitle_a");
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getGroup(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("group.dialogTitle_e");
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateGroup(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addGroup(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("group.confirmRemove", { ids: ids }))
        .then(function () {
          return delGroup(ids);
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
        "system/group/export",
        {
          ...this.queryParams,
        },
        `group_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
