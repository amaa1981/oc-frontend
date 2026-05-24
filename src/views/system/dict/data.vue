<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('dictInfo.dictType')" prop="dictType">
        <el-select v-model="queryParams.dictType">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dictInfo.dictLabel')" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('dictInfo.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('commonTips.pleaseSelect')" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
        >{{ $t('commonBtn.close') }}</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('dictInfo.dictCode')" align="center" prop="dictCode" />
      <el-table-column :label="$t('dictInfo.dictLabel')" align="center" prop="dictLabel">
        <template slot-scope="scope">
          <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{scope.row.dictLabel}}</span>
          <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{scope.row.dictLabel}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('dictInfo.dictValue')" align="center" prop="dictValue" />
      <el-table-column :label="$t('dictInfo.dictSort')" align="center" prop="dictSort" />
      <el-table-column :label="$t('dictInfo.status')" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('dictInfo.remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('dictInfo.createTime')" align="center" prop="createTime" width="180">
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
        <el-form-item :label="$t('dictInfo.dictType')">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('dictInfo.dictLabel')" prop="dictLabel">
          <el-input v-model="form.dictLabel" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('dictInfo.dictValue')" prop="dictValue">
          <el-input v-model="form.dictValue" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('dictInfo.cssClass')" prop="cssClass">
          <el-input v-model="form.cssClass" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('dictInfo.dictSort')" prop="dictSort">
          <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('dictInfo.listClass')" prop="listClass">
          <el-select v-model="form.listClass">
            <el-option
              v-for="item in listClassOptions"
              :key="item.value"
              :label="item.label + '(' + item.value + ')'"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dictInfo.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('dictInfo.remark')" prop="remark">
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
import { listData, getData, delData, addData, updateData } from "@/api/system/dict/data";
import { optionselect as getDictOptionselect, getType } from "@/api/system/dict/type";

export default {
  name: "Data",
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
      dataList: [],
      // DefaultDictType
      defaultDictType: "",
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Data Label echo style
      listClassOptions: [
        {
          value: "default",
          label: this.$t('dictInfo.classOptions_1')
        },
        {
          value: "primary",
          label: this.$t('dictInfo.classOptions_2')
        },
        {
          value: "success",
          label: this.$t('dictInfo.classOptions_3')
        },
        {
          value: "info",
          label: this.$t('dictInfo.classOptions_4')
        },
        {
          value: "warning",
          label: this.$t('dictInfo.classOptions_5')
        },
        {
          value: "danger",
          label: this.$t('dictInfo.classOptions_6')
        }
      ],
      // type data dictionary
      typeOptions: [],
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
        dictLabel: [
          { required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: "blur" }
        ]
      }
    };
  },
  created() {
    const dictId = Number(this.$route.params && this.$route.params.dictId);
    this.getType(dictId);
    this.getTypeList();
  },
  methods: {
    /** Query dict type detail */
    getType(dictId) {
      getType(dictId).then(response => {
        this.queryParams.dictType = response.data.dictType;
        this.defaultDictType = response.data.dictType;
        this.getList();
      });
    },
    /** Query dict type list */
    getTypeList() {
      getDictOptionselect().then(response => {
        this.typeOptions = response.data;
      });
    },
    /** Query dict data list */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.rows;
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
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        cssClass: undefined,
        listClass: 'default',
        dictSort: 0,
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
    /** Back handler */
    handleClose() {
      const obj = { path: "/system/dict" };
      this.$tab.closeOpenPage(obj);
    },
    /** Reset handler */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t('dictInfo.dialogTitle_a');
      this.form.dictType = this.queryParams.dictType;
    },
    // Selection change
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const dictCode = row.dictCode || this.ids
      getData(dictCode).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t('dictInfo.dialogTitle_e');
      });
    },
    /** Submit handler */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictCode != undefined) {
            updateData(this.form).then(response => {
              this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
              this.$modal.msgSuccess(this.$t('commonTips.edit_s'));
              this.open = false;
              this.getList();
            });
          } else {
            addData(this.form).then(response => {
              this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
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
      const dictCodes = row.dictCode || this.ids;
      this.$modal.confirm(this.$t('dictInfo.comfirmRemove',{dictCodes})).then(function() {
        return delData(dictCodes);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('commonTips.remove_s'));
        this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
      }).catch(() => {});
    },
    /** Export handler */
    handleExport() {
      this.download('system/dict/data/export', {
        ...this.queryParams
      }, `data_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
