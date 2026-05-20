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
      <el-form-item :label="$t('group.name')" prop="name">
        <el-input
          v-model="queryParams.name"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('group.sex')" prop="sex">
        <el-select
          v-model="queryParams.sex"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_sex"
            :key="dict.value"
            :label="$t('dict.v1_sex.' + dict.value)"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('group.type')" prop="type">
        <el-select
          v-model="queryParams.type"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_user_type"
            :key="dict.value"
            :label="$t('dict.v1_user_type.'+ dict.value)"
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
      <el-form-item class="form-actions-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:people:add']"
          >{{ $t("commonBtn.add") }}</el-button
        >
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:people:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:people:edit']"
          >{{ $t("commonBtn.edit") }}</el-button
        >
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="downloadTemplate"
          >{{ $t('user.downloadTips') }}</el-button
        >
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleOpenImport"
          >{{ $t('commonBtn.import') }}</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="peopleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column :label="$t('group.id')" align="center" prop="id" /> -->
      <el-table-column :label="$t('group.name')" align="center" prop="name" />
      <el-table-column :label="$t('group.sex')" align="center" prop="sex">
        <template slot-scope="scope">
         {{ $t('dict.v1_sex.' + scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('group.type')" align="center" prop="type">
        <template slot-scope="scope">
         {{ $t('dict.v1_user_type.' + scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('group.image')"
        align="center"
        prop="image"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
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
            v-hasPermi="['system:people:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <span class="action-divider" />
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="btn-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:people:remove']"
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

    <el-dialog :title="$t('commonBtn.import')" :visible.sync="importOpen" width="520px" append-to-body>
      <el-form label-width="120px">
        <el-form-item :label="$t('group.libId')">
          <el-input :value="queryParams.libId" disabled />
        </el-form-item>
        <el-form-item label="Excel">
          <el-upload
            :auto-upload="false"
            :limit="1"
            accept=".xls,.xlsx"
            :on-change="handleExcelChange"
            :file-list="excelList"
            :show-file-list="true"
          >
            <el-button size="small" type="primary">{{ $t('commonBtn.selectFile') }}</el-button>
            <div slot="tip" class="el-upload__tip">xls/xlsx</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Picture">
          <el-upload
            :auto-upload="false"
            :limit="1"
            accept=".zip"
            :on-change="handlePictureChange"
            :file-list="pictureList"
            :show-file-list="true"
          >
            <el-button size="small" type="primary">{{ $t('commonBtn.selectFile') }}</el-button>
            <div slot="tip" class="el-upload__tip">zip</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="importLoading" @click="submitImport">{{ $t('commonBtn.confirm') }}</el-button>
        <el-button @click="importOpen=false">{{ $t('commonBtn.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('importResult.title')" :visible.sync="importResultOpen" width="750px" append-to-body>
      <div class="import-result-container">
        <!-- 统计卡片 -->
        <div class="stats-cards">
          <div class="stat-card success-card">
            <div class="stat-icon">
              <i class="el-icon-success"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ importResult.successNum }}</div>
              <div class="stat-label">{{ $t('importResult.successNum') }}</div>
            </div>
          </div>
          
          <div class="stat-card warning-card">
            <div class="stat-icon">
              <i class="el-icon-warning"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ importResult.invalidNum }}</div>
              <div class="stat-label">{{ $t('importResult.invalidNum') }}</div>
            </div>
          </div>
          
          <div class="stat-card error-card">
            <div class="stat-icon">
              <i class="el-icon-error"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ importResult.failureNum }}</div>
              <div class="stat-label">{{ $t('importResult.failureNum') }}</div>
            </div>
          </div>
        </div>

        <!-- 总结信息 -->
        <div class="result-summary-text">
          <el-tag 
            :type="importHasError() ? 'warning' : 'success'" 
            size="medium"
            effect="plain"
          >
            <i :class="importHasError() ? 'el-icon-warning' : 'el-icon-success'"></i>
            {{ importHasError() ? $t('importResult.hasErrors') : $t('importResult.allSuccess') }}
          </el-tag>
        </div>

        <!-- 错误详情 -->
        <div v-if="importResult.errorList && importResult.errorList.length" class="error-section">
          <div class="section-title">
            <i class="el-icon-warning-outline"></i>
            {{ $t('importResult.errorDetails') }}
          </div>
          <el-table
            :data="importResult.errorList"
            size="small"
            class="error-table"
            max-height="300"
          >
            <el-table-column type="index" width="50" label="#" align="center" />
            <el-table-column prop="id" :label="$t('importResult.lineNo')" width="100" align="center" />
            <el-table-column prop="errorMsg" :label="$t('importResult.errorMsg')" show-overflow-tooltip />
          </el-table>
        </div>
        
        <div v-else-if="!importHasError()" class="success-section">
          <div class="success-icon">
            <i class="el-icon-circle-check"></i>
          </div>
          <div class="success-text">{{ $t('importResult.allDataProcessed') }}</div>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importResultOpen=false">{{ $t('commonBtn.close') }}</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改人员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('group.name')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('group.sex')" prop="sex">
          <el-select
            v-model="form.sex"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_sex"
              :key="dict.value"
              :label="$t('dict.v1_sex.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('group.type')" prop="type">
          <el-select
            v-model="form.type"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_user_type"
              :key="dict.value"
              :label="$t('dict.v1_user_type.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('group.image')" prop="image">
          <image-upload v-model="form.image" limit="3" />
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
  listPeople,
  getPeople,
  delPeople,
  addPeople,
  updatePeople,
} from "@/api/system/people";
import request from "@/utils/request";

export default {
  name: "People",
  dicts: ["v1_sex", "v1_user_type"],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      peopleList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        sex: null,
        type: null,
        libId: null,
      },
      form: {},
      rules: {
        name: [{ required: true, message: "Name is required", trigger: "change" }],
        sex: [{ required: true, message: "Gender is required", trigger: "change" }],
        type: [{ required: true, message: "Type is required", trigger: "change" }],
        image: [{ required: true, message: "Photo is required", trigger: "change" }],
      },
      importOpen: false,
      importLoading: false,
      excelFile: null,
      pictureFile: null,
      excelList: [],
      pictureList: [],
      importLoadingInstance: null,
      importResultOpen: false,
      importResult: {
        successNum: 0,
        failureNum: 0,
        invalidNum: 0,
        errorList: [],
      },
    };
  },
  created() {
    //获取路径参数  人员库id
    this.queryParams.libId = this.$route.query.libId;
    console.log(this.$route.query.libId);
    this.getList();
  },
  methods: {
    importHasError() {
      return (this.importResult && (Number(this.importResult.failureNum) > 0 || Number(this.importResult.invalidNum) > 0));
    },
    /** 查询人员信息列表 */
    getList() {
      this.loading = true;
      listPeople(this.queryParams).then((response) => {
        this.peopleList = response.data.records || [];
        this.total = response.data.totalCount || 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 关闭弹出层 */
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
        sex: null,
        type: null,
        image: null,
        createTime: null,
        updateTime: null,
        createId: null,
        updateId: null,
        createBy: null,
        updateBy: null,
        isDelete: null,
        faceList: [],
        libId: this.$route.query.libId,
      };
      this.queryParams.libId = this.$route.query.libId;

      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t("group.dialogTitle_people_a");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPeople(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("group.dialogTitle_people_a");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.faceList = this.form.image.split(",");
          if (this.form.id != null) {
            updatePeople(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addPeople(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.add_s"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("group.confirmRemovePeople", { ids }))
        .then(function () {
          return delPeople(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/people/export",
        {
          ...this.queryParams,
        },
        `people_${new Date().getTime()}.xlsx`
      );
    },
    /** 下载模板操作 */
    downloadTemplate() {
      this.download(
        "api/people/importTemplate",
        {},
        `people_template_${new Date().getTime()}.xlsx`
      );
    },
    // 打开导入弹窗
    handleOpenImport() {
      this.importOpen = true;
      this.importLoading = false;
      this.excelFile = null;
      this.pictureFile = null;
      this.excelList = [];
      this.pictureList = [];
      this.importResult = { successNum: 0, failureNum: 0, invalidNum: 0, errorList: [] };
    },
    // 选择 Excel 文件（仅 xls/xlsx）
    handleExcelChange(file, fileList) {
      const name = (file && file.name) || "";
      const ext = name.split(".").pop().toLowerCase();
      if (ext !== "xls" && ext !== "xlsx") {
        this.$message.error(this.$t("commonTips.fileTypeError") || "文件类型错误");
        this.excelList = [];
        this.excelFile = null;
        return;
      }
      this.excelList = [file];
      this.excelFile = file.raw || file;
    },
    // 选择图片包（仅 zip）
    handlePictureChange(file, fileList) {
      const name = (file && file.name) || "";
      const ext = name.split(".").pop().toLowerCase();
      if (ext !== "zip") {
        this.$message.error(this.$t("commonTips.fileTypeError") || "文件类型错误");
        this.pictureList = [];
        this.pictureFile = null;
        return;
      }
      this.pictureList = [file];
      this.pictureFile = file.raw || file;
    },
    // 提交导入
    async submitImport() {
      if (!this.queryParams.libId) {
        this.$message.error(this.$t("commonTips.cannotBeEmpty") );
        return;
      }
      if (!this.excelFile) {
        this.$message.error(this.$t("commonTips.selectExcel"));
        return;
      }
      if (!this.pictureFile) {
        this.$message.error(this.$t("commonTips.selectZip") );
        return;
      }
      const formData = new FormData();
      formData.append("libId", this.queryParams.libId);
      formData.append("excel", this.excelFile);
      formData.append("picture", this.pictureFile);
      this.importLoading = true;
      this.importLoadingInstance = this.$loading({ lock: true, background: 'rgba(0, 0, 0, 0.2)' });
      try {
        const res = await request.post("/api/people/importData", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 200) {
          const data = (res && (res.data || res.result)) || {};
          this.importResult = {
            successNum: Number(data.successNum) || 0,
            failureNum: Number(data.failureNum) || 0,
            invalidNum: Number(data.invalidNum) || 0,
            errorList: Array.isArray(data.errorList) ? data.errorList : [],
          };
          this.$modal.msgSuccess(this.$t("commonTips.import_s"));
          this.importOpen = false;
          this.importResultOpen = true;
          this.getList();
        } else {
          this.$modal.msgError((res && res.msg) || this.$t("commonTips.import_f"));
        }
      } catch (e) {
        this.$modal.msgError(this.$t("commonTips.import_f") );
      } finally {
        this.importLoading = false;
        if (this.importLoadingInstance) {
          this.importLoadingInstance.close();
          this.importLoadingInstance = null;
        }
      }
    },
  },
};
</script>
<style scoped>
.import-result-container {
  padding: 8px 0;
}

.stats-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.success-card .stat-icon {
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: white;
}

.warning-card .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
  color: white;
}

.error-card .stat-icon {
  background: linear-gradient(135deg, #f56c6c, #f78989);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.success-card .stat-number {
  color: #67c23a;
}

.warning-card .stat-number {
  color: #e6a23c;
}

.error-card .stat-number {
  color: #f56c6c;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
}

.result-summary-text {
  text-align: center;
  margin-bottom: 24px;
}

.result-summary-text .el-tag {
  font-size: 14px;
  font-weight: 500;
}

.result-summary-text .el-tag i {
  margin-right: 6px;
}

.error-section {
  margin-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
  color: #e6a23c;
}

.error-table {
  border-radius: 6px;
  overflow: hidden;
}

.success-section {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  font-size: 64px;
  color: #67c23a;
  margin-bottom: 16px;
}

.success-text {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}
</style>
