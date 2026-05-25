<template>
  <div class="app-container">
    <!-- Search Bar -->
    <div class="search-bar">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="Personnel name" prop="name">
          <el-input v-model="queryParams.name" placeholder="Enter name" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="Gender" prop="sex">
          <el-select v-model="queryParams.sex" placeholder="Select" clearable style="width:120px;">
            <el-option v-for="dict in dict.type.v1_sex" :key="dict.value" :label="$t('dict.v1_sex.' + dict.value)" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="queryParams.type" placeholder="Select" clearable style="width:120px;">
            <el-option v-for="dict in dict.type.v1_user_type" :key="dict.value" :label="$t('dict.v1_user_type.'+ dict.value)" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">Search</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">Reset</el-button>
        </el-form-item>
      </el-form>
      <div class="action-buttons">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:people:add']">Add</el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:people:remove']">Remove</el-button>
        <el-button class="btn-green" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:people:edit']">Edit</el-button>
        <el-button class="btn-green" plain icon="el-icon-download" size="mini" @click="downloadTemplate">Template</el-button>
        <el-button class="btn-green" plain icon="el-icon-upload2" size="mini" @click="handleOpenImport">Import</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="peopleList" @selection-change="handleSelectionChange" style="width:100%;">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="Personnel Name" align="center" prop="name" min-width="150" />
      <el-table-column label="Gender" align="center" prop="sex" width="100">
        <template slot-scope="scope">{{ $t('dict.v1_sex.' + scope.row.sex) }}</template>
      </el-table-column>
      <el-table-column label="Type" align="center" prop="type" width="120">
        <template slot-scope="scope">{{ $t('dict.v1_user_type.' + scope.row.type) }}</template>
      </el-table-column>
      <el-table-column label="Face Photo" align="center" width="120">
        <template slot-scope="scope">
          <div class="face-photo">
            <el-image
              v-if="scope.row.image"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              style="width:50px;height:50px;border-radius:6px;object-fit:cover;"
              fit="cover"
            />
            <div v-else class="face-placeholder">
              <i class="el-icon-user"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:people:edit']">Edit</el-button>
          <span class="action-divider" />
          <el-button size="mini" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.row)" v-hasPermi="['system:people:remove']">Remove</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- Import Dialog -->
    <el-dialog title="Import Personnel" :visible.sync="importOpen" width="520px" append-to-body>
      <el-form label-width="120px">
        <el-form-item label="Library ID">
          <el-input :value="queryParams.libId" disabled />
        </el-form-item>
        <el-form-item label="Excel File">
          <el-upload :auto-upload="false" :limit="1" accept=".xls,.xlsx" :on-change="handleExcelChange" :file-list="excelList" :show-file-list="true">
            <el-button size="small" type="primary">Select File</el-button>
            <div slot="tip" class="el-upload__tip">xls/xlsx only</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Picture ZIP">
          <el-upload :auto-upload="false" :limit="1" accept=".zip" :on-change="handlePictureChange" :file-list="pictureList" :show-file-list="true">
            <el-button size="small" type="primary">Select File</el-button>
            <div slot="tip" class="el-upload__tip">zip only</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="importLoading" @click="submitImport">Confirm</el-button>
        <el-button @click="importOpen=false">Cancel</el-button>
      </div>
    </el-dialog>

    <!-- Import Result Dialog -->
    <el-dialog title="Import Result" :visible.sync="importResultOpen" width="750px" append-to-body>
      <div class="import-result-container">
        <div class="stats-cards">
          <div class="stat-card success-card">
            <div class="stat-icon"><i class="el-icon-success"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ importResult.successNum }}</div>
              <div class="stat-label">Success</div>
            </div>
          </div>
          <div class="stat-card warning-card">
            <div class="stat-icon"><i class="el-icon-warning"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ importResult.invalidNum }}</div>
              <div class="stat-label">Invalid</div>
            </div>
          </div>
          <div class="stat-card error-card">
            <div class="stat-icon"><i class="el-icon-error"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ importResult.failureNum }}</div>
              <div class="stat-label">Failed</div>
            </div>
          </div>
        </div>

        <div class="result-summary-text">
          <el-tag :type="importHasError() ? 'warning' : 'success'" size="medium" effect="plain">
            <i :class="importHasError() ? 'el-icon-warning' : 'el-icon-success'"></i>
            {{ importHasError() ? 'Import completed with errors' : 'All records imported successfully' }}
          </el-tag>
        </div>

        <div v-if="importResult.errorList && importResult.errorList.length" class="error-section">
          <div class="section-title"><i class="el-icon-warning-outline"></i> Error Details</div>
          <el-table :data="importResult.errorList" size="small" max-height="300">
            <el-table-column type="index" width="50" label="#" align="center" />
            <el-table-column prop="id" label="Line No." width="100" align="center" />
            <el-table-column prop="errorMsg" label="Error Message" show-overflow-tooltip />
          </el-table>
        </div>

        <div v-else-if="!importHasError()" class="success-section">
          <div class="success-icon"><i class="el-icon-circle-check"></i></div>
          <div class="success-text">All data has been processed successfully</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importResultOpen=false">Close</el-button>
      </div>
    </el-dialog>

    <!-- Add/Edit Dialog -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="Personnel Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter name" />
        </el-form-item>
        <el-form-item label="Gender" prop="sex">
          <el-select v-model="form.sex" placeholder="Select gender" style="width:100%;">
            <el-option v-for="dict in dict.type.v1_sex" :key="dict.value" :label="$t('dict.v1_sex.' + dict.value)" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="form.type" placeholder="Select type" style="width:100%;">
            <el-option v-for="dict in dict.type.v1_user_type" :key="dict.value" :label="$t('dict.v1_user_type.' + dict.value)" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Face Photo" prop="image">
          <image-upload v-model="form.image" limit="3" />
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
import { listPeople, getPeople, delPeople, addPeople, updatePeople } from "@/api/system/people";
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
        image: [],
      },
      importOpen: false,
      importLoading: false,
      excelFile: null,
      pictureFile: null,
      excelList: [],
      pictureList: [],
      importLoadingInstance: null,
      importResultOpen: false,
      importResult: { successNum: 0, failureNum: 0, invalidNum: 0, errorList: [] },
    };
  },
  created() {
    this.queryParams.libId = this.$route.query.libId;
    this.getList();
  },
  methods: {
    importHasError() {
      return this.importResult && (Number(this.importResult.failureNum) > 0 || Number(this.importResult.invalidNum) > 0);
    },
    getList() {
      this.loading = true;
      listPeople(this.queryParams).then((response) => {
        this.peopleList = response.data.records || [];
        this.total = response.data.totalCount || 0;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    cancel() { this.open = false; this.reset(); },
    reset() {
      this.form = { id: null, name: null, sex: null, type: null, image: null, faceList: [] };

      this.resetForm("form");
    },
    handleQuery() { this.queryParams.pageNum = 1; this.getList(); },
    resetQuery() { this.resetForm("queryForm"); this.handleQuery(); },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() { this.reset(); this.open = true; this.title = "Add Personnel"; },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPeople(id).then((response) => {
        this.form = response.data;
        // Map faceImage to image for the upload component
        if (response.data.faceImage) {
          this.form.image = response.data.faceImage;
        }
        this.open = true;
        this.title = "Edit Personnel";
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.faceList = this.form.image ? this.form.image.split(",") : [];
            this.form.faceImage = this.form.image;
          if (this.form.id != null) {
            updatePeople(this.form).then(() => {
              this.$modal.msgSuccess("Updated successfully");
              this.open = false;
              this.getList();
            });
          } else {
            addPeople(this.form).then(() => {
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
      this.$modal.confirm(`Are you sure you want to delete personnel #${ids}?`)
        .then(() => delPeople(ids))
        .then(() => { this.getList(); this.$modal.msgSuccess("Deleted successfully"); })
        .catch(() => {});
    },
    downloadTemplate() {
      this.download("api/people/importTemplate", {}, `people_template_${new Date().getTime()}.xlsx`);
    },
    handleOpenImport() {
      this.importOpen = true;
      this.importLoading = false;
      this.excelFile = null;
      this.pictureFile = null;
      this.excelList = [];
      this.pictureList = [];
      this.importResult = { successNum: 0, failureNum: 0, invalidNum: 0, errorList: [] };
    },
    handleExcelChange(file) {
      const ext = (file.name || "").split(".").pop().toLowerCase();
      if (ext !== "xls" && ext !== "xlsx") { this.$message.error("Only xls/xlsx files allowed"); this.excelList = []; this.excelFile = null; return; }
      this.excelList = [file];
      this.excelFile = file.raw || file;
    },
    handlePictureChange(file) {
      const ext = (file.name || "").split(".").pop().toLowerCase();
      if (ext !== "zip") { this.$message.error("Only zip files allowed"); this.pictureList = []; this.pictureFile = null; return; }
      this.pictureList = [file];
      this.pictureFile = file.raw || file;
    },
    async submitImport() {

      if (!this.excelFile) { this.$message.error("Please select an Excel file"); return; }
      if (!this.pictureFile) { this.$message.error("Please select a ZIP file"); return; }
      const formData = new FormData();
      formData.append("libId", this.queryParams.libId);
      formData.append("excel", this.excelFile);
      formData.append("picture", this.pictureFile);
      this.importLoading = true;
      this.importLoadingInstance = this.$loading({ lock: true, background: 'rgba(0,0,0,0.2)' });
      try {
        const res = await request.post("/api/people/importData", formData, { headers: { "Content-Type": "multipart/form-data" } });
        if (res.code == 200) {
          const data = res.data || {};
          this.importResult = {
            successNum: Number(data.successNum) || 0,
            failureNum: Number(data.failureNum) || 0,
            invalidNum: Number(data.invalidNum) || 0,
            errorList: Array.isArray(data.errorList) ? data.errorList : [],
          };
          this.$modal.msgSuccess("Import completed");
          this.importOpen = false;
          this.importResultOpen = true;
          this.getList();
        } else {
          this.$modal.msgError(res.msg || "Import failed");
        }
      } catch (e) {
        this.$modal.msgError("Import failed");
      } finally {
        this.importLoading = false;
        if (this.importLoadingInstance) { this.importLoadingInstance.close(); this.importLoadingInstance = null; }
      }
    },
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-divider {
  display: inline-block;
  width: 1px;
  height: 12px;
  background: #dcdfe6;
  margin: 0 6px;
  vertical-align: middle;
}

.face-photo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.face-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.face-placeholder i {
  font-size: 24px;
  color: #c0c4cc;
}

/* Green buttons */
.btn-green {
  color: #1a7a6e !important;
  border-color: #1a7a6e !important;
  background: #fff !important;
}

.btn-green:hover {
  background: #1a7a6e !important;
  color: #fff !important;
}

.btn-green:disabled {
  color: #c0c4cc !important;
  border-color: #e4e7ed !important;
  background: #fff !important;
}

.import-result-container { padding: 8px 0; }

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
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
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

.success-card .stat-icon { background: linear-gradient(135deg, #67c23a, #85ce61); color: white; }
.warning-card .stat-icon { background: linear-gradient(135deg, #e6a23c, #ebb563); color: white; }
.error-card .stat-icon { background: linear-gradient(135deg, #f56c6c, #f78989); color: white; }

.stat-number { font-size: 28px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
.success-card .stat-number { color: #67c23a; }
.warning-card .stat-number { color: #e6a23c; }
.error-card .stat-number { color: #f56c6c; }
.stat-label { font-size: 13px; color: #909399; }

.result-summary-text { text-align: center; margin-bottom: 24px; }

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.section-title i { margin-right: 8px; color: #e6a23c; }

.success-section { text-align: center; padding: 40px 20px; }
.success-icon { font-size: 64px; color: #67c23a; margin-bottom: 16px; }
.success-text { font-size: 16px; color: #606266; }
</style>