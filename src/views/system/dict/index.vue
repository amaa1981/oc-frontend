<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('dictManage.dictName')" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('dictManage.dictType')" prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('dictManage.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dictManage.createTime')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('dictManage.startTime')"
          :end-placeholder="$t('dictManage.endTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('commonBtn.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('commonBtn.reset') }}</el-button>
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
          v-hasPermi="['system:dict:add']"
        >{{ $t('commonBtn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:dict:edit']"
        >{{ $t('commonBtn.edit') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dict:remove']"
        >{{ $t('commonBtn.remove') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
        >{{ $t('commonBtn.export') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          v-hasPermi="['system:dict:remove']"
        >{{ $t('dictManage.refresh') }}</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('dictManage.dictId')" align="center" prop="dictId" />
      <el-table-column :label="$t('dictManage.dictName')" align="center" prop="dictName" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('dictManage.dictType')" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('dictManage.status')" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('dictManage.remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('dictManage.createTime')" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commonBtn.operate')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
          >{{ $t('commonBtn.edit') }}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
          >{{ $t('commonBtn.remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- Add or Edit parameter configuration dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('dictManage.dictName')" prop="dictName">
          <el-input v-model="form.dictName" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('dictManage.dictType')" prop="dictType">
          <el-input v-model="form.dictType" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('dictManage.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('dictManage.remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :placeholder="$t('commonTips.pleaseEnter')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('commonBtn.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('commonBtn.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listType, getType, delType, addType, updateType, refreshCache } from "@/api/system/dict/type";

export default {
  name: "Dict",
  dicts: ['sys_normal_disable'],
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
      // dictionary table data
      typeList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // date range
      dateRange: [],
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        dictName: [
          { required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: "blur" }
        ],
        dictType: [
          { required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** Query dict type list */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // Cancel
    cancel() {
      this.open = false;
      this.reset();
    },
    // FormReset
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
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
      this.handleQuery();
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t('dictManage.dialogTitle_a');
    },
    // Selection change
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t('dictManage.dialogTitle_e');
      });
    },
    /** Submit handler */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess(this.$t('commonTips.edit_s'));
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
              this.$modal.msgSuccess(this.$t('commonTips.add_s'));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** Delete handler */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$modal.confirm(this.$t('dictManage.comfirmRemove',{dictIds})).then(function() {
        return delType(dictIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('commonTips.remove_s'));
      }).catch(() => {});
    },
    /** Export handler */
    handleExport() {
      this.download('system/dict/type/export', {
        ...this.queryParams
      }, `type_${new Date().getTime()}.xlsx`)
    },
    /** Refresh cache handler */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess(this.$t('dicaManage.refresh_s'));
        this.$store.dispatch('dict/cleanDict');
      });
    }
  }
};
</script>
