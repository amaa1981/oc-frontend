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
      <el-form-item :label="$t('post.postCode')" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('post.postName')" prop="postName">
        <el-input
          v-model="queryParams.postName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('post.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="$t('dict.sys_normal_disable.' + dict.value)"
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
          v-hasPermi="['system:post:add']"
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
          v-hasPermi="['system:post:edit']"
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
          v-hasPermi="['system:post:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
          >{{ $t("commonBtn.export") }}</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        :label="$t('post.postId')"
        align="center"
        prop="postId"
      />
      <el-table-column
        :label="$t('post.postCode')"
        align="center"
        prop="postCode"
      />
      <el-table-column
        :label="$t('post.postName')"
        align="center"
        prop="postName"
      />
      <el-table-column
        :label="$t('post.postSort')"
        align="center"
        prop="postSort"
      />
      <el-table-column :label="$t('post.status')" align="center" prop="status">
        <template slot-scope="scope">
          {{ $t("dict.sys_normal_disable." + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('post.createTime')"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
            class="btn-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <span class="action-divider" />
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="btn-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
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

    <!-- Add or Edit Post dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('post.postName')" prop="postName">
          <el-input
            v-model="form.postName"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('post.postCode')" prop="postCode">
          <el-input
            v-model="form.postCode"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('post.postSort')" prop="postSort">
          <el-input-number
            v-model="form.postSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item :label="$t('post.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ $t("dict.sys_normal_disable." + dict.value) }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('post.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
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
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost,
} from "@/api/system/post";

export default {
  name: "Post",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      // Loading
      loading: true,
      // Selected IDs
      ids: [],
      // Single disabled
      single: true,
      // Multiple disabled
      multiple: true,
      // Show search
      showSearch: true,
      // Total count
      total: 0,
      // Job form data
      postList: [],
      // Dialog title
      title: "",
      // Show dialog
      open: false,
      // Query params
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined,
      },
      // Form params
      form: {},
      // Form rules
      rules: {
        postName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        postCode: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        postSort: [
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
    /** Query post list */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then((response) => {
        this.postList = response.rows;
        this.total = response.total;
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
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "0",
        remark: undefined,
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
      this.ids = selection.map((item) => item.postId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t("post.dialogTitle_a");
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids;
      getPost(postId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("post.dialogTitle_e");
      });
    },
    /** Submit handler */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then((response) => {
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
      const postIds = row.postId || this.ids;
      this.$modal
        .confirm(this.$t("post.confirmRemove", { postIds }))
        .then(function () {
          return delPost(postIds);
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
        "system/post/export",
        {
          ...this.queryParams,
        },
        `post_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
