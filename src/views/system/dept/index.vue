<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item :label="$t('dept.deptName')" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('dept.status')" prop="status">
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
          v-hasPermi="['system:dept:add']"
          >{{ $t("commonBtn.add") }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >{{ $t("dept.toggleExpandAll") }}</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="deptName"
        :label="$t('dept.deptName')"
        width="260"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        :label="$t('dept.orderNum')"
        width="200"
      ></el-table-column>
      <el-table-column prop="status" :label="$t('dept.status')" width="180">
        <template slot-scope="scope">
          {{ $t("dict.sys_normal_disable." + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('dept.createTime')"
        align="center"
        prop="createTime"
        width="200"
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
            >{{ $t("commonBtn.add") }}</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
            >{{ $t("commonBtn.remove") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Add or Edit Department dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item :label="$t('dept.parentId')" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                :placeholder="$t('commonTips.pleaseSelect')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('dept.deptName')" prop="deptName">
              <el-input
                v-model="form.deptName"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('dept.orderNum')" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('dept.leader')" prop="leader">
              <el-input
                v-model="form.leader"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('dept.phone')" prop="phone">
              <el-input
                v-model="form.phone"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('dept.email')" prop="email">
              <el-input
                v-model="form.email"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('dept.status')">
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
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild,
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      // Loading state
      loading: true,
      // Show search conditions
      showSearch: true,
      // table tree data
      deptList: [],
      // Department TreeOptions
      deptOptions: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Whether to expand, expand all by default
      isExpandAll: true,
      // Re-render table state
      refreshTable: true,
      // Query parameters
      queryParams: {
        deptName: undefined,
        status: undefined,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        parentId: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        deptName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        orderNum: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: this.$t("dept.email_r"),
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: this.$t("dept.phone_r"),
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
    /** Query dept list */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then((response) => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    /** Convert dept data structure */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    // Cancel
    cancel() {
      this.open = false;
      this.reset();
    },
    // FormReset
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0",
      };
      this.resetForm("form");
    },
    /** Search handler */
    handleQuery() {
      this.getList();
    },
    /** Reset handler */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** Add handler */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = this.$t("dept.dialogTitle_a");
      listDept().then((response) => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** Expand/collapse handler */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("dept.dialogTitle_e");
        listDeptExcludeChild(row.deptId).then((response) => {
          this.deptOptions = this.handleTree(response.data, "deptId");
          if (this.deptOptions.length == 0) {
            const noResultsOptions = {
              deptId: this.form.parentId,
              deptName: this.form.parentName,
              children: [],
            };
            this.deptOptions.push(noResultsOptions);
          }
        });
      });
    },
    /** Submit handler */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then((response) => {
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
      this.$modal
        .confirm(this.$t("dept.confirmRemove", { deptName: row.deptName }))
        .then(function () {
          return delDept(row.deptId);
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
