<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('push.httpPush')" name="http">
        <!-- HTTP push configuration -->
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="100px"
        >
          <el-form-item :label="$t('push.httpAddress')" prop="connectInfo">
            <el-input
              v-model="queryParams.connectInfo"
              :placeholder="$t('commonTips.pleaseEnter')"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('push.status')" prop="status">
            <el-select
              v-model="queryParams.status"
              :placeholder="$t('commonTips.pleaseSelect')"
              clearable
            >
              <el-option
                v-for="dict in dict.type.v1_startup_status"
                :key="dict.value"
                :label="$t('dict.v1_startup_status.' + dict.value)"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('push.alarmType')" prop="alarmType">
            <el-select
              v-model="queryParams.alarmType"
              :placeholder="$t('commonTips.pleaseSelect')"
              clearable
            >
              <el-option key="1111" :label="$t('push.all')" value="0" />
              <el-option
                v-for="dict in dict.type.v1_alarm_type"
                :key="dict.value"
                :label="$t('dict.v1_alarm_type.' + dict.value)"
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
            >{{ $t('commonBtn.search') }}</el-button>
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
              v-hasPermi="['system:config:add']"
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
              v-hasPermi="['system:config:edit']"
            >{{ $t('commonBtn.edit') }}</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="configList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column :label="$t('push.id')" align="center" prop="id" />
          <el-table-column :label="$t('push.httpAddress')" align="center" prop="connectInfo" />
          <el-table-column :label="$t('push.status')" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.v1_startup_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('push.alarmType')" align="center" prop="alarmType">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.v1_alarm_type"
                :value="scope.row.alarmType.split(',')"
                v-if="scope.row.alarmType != '0'"
              />
              <div v-else>{{ $t('push.all') }}</div>
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
                v-hasPermi="['system:config:edit']"
              >{{ $t('commonBtn.edit') }}</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:config:remove']"
              >{{ $t('commonBtn.remove') }}</el-button>
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
      </el-tab-pane>

      <el-tab-pane :label="$t('push.phonePush')" name="phone">
        <!-- Mobile push configuration -->
        <el-form
          :model="phoneQueryParams"
          ref="phoneQueryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="100px"
        >
          <el-form-item :label="$t('push.phone')" prop="phone">
            <el-input
              v-model="phoneQueryParams.phone"
              :placeholder="$t('commonTips.pleaseEnter')"
              clearable
              @keyup.enter.native="handlePhoneQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('push.status')" prop="status">
            <el-select
              v-model="phoneQueryParams.status"
              :placeholder="$t('commonTips.pleaseSelect')"
              clearable
            >
              <el-option
                v-for="dict in dict.type.v1_startup_status"
                :key="dict.value"
                :label="$t('dict.v1_startup_status.' + dict.value)"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('push.alarmType')" prop="alarmType">
            <el-select
              v-model="phoneQueryParams.alarmType"
              :placeholder="$t('commonTips.pleaseSelect')"
              clearable
            >
              <el-option key="1111" :label="$t('push.all')" value="0" />
              <el-option
                v-for="dict in dict.type.v1_alarm_type"
                :key="dict.value"
                :label="$t('dict.v1_alarm_type.' + dict.value)"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handlePhoneQuery"
            >{{ $t('commonBtn.search') }}</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetPhoneQuery">{{ $t('commonBtn.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handlePhoneAdd"
              v-hasPermi="['system:config:add']"
            >{{ $t('commonBtn.add') }}</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="phoneSingle"
              @click="handlePhoneUpdate"
              v-hasPermi="['system:config:edit']"
            >{{ $t('commonBtn.edit') }}</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="phoneLoading"
          :data="phoneList"
          @selection-change="handlePhoneSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column :label="$t('push.id')" align="center" prop="id" />
          <el-table-column :label="$t('push.phone')" align="center" prop="phone" />
          <el-table-column :label="$t('push.status')" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.v1_startup_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('push.alarmType')" align="center" prop="alarmType">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.v1_alarm_type"
                :value="scope.row.alarmType.split(',')"
                v-if="scope.row.alarmType != '0'"
              />
              <div v-else>{{ $t('push.all') }}</div>
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
                @click="handlePhoneUpdate(scope.row)"
                v-hasPermi="['system:config:edit']"
              >{{ $t('commonBtn.edit') }}</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handlePhoneDelete(scope.row)"
                v-hasPermi="['system:config:remove']"
              >{{ $t('commonBtn.remove') }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="phoneTotal > 0"
          :total="phoneTotal"
          :page.sync="phoneQueryParams.pageNum"
          :limit.sync="phoneQueryParams.pageSize"
          @pagination="getPhoneList"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- Add or Edithttp push configuration dialog -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('push.httpAddress')" prop="connectInfo">
          <el-input
            v-model="form.connectInfo"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('push.status')" prop="status">
          <el-select v-model="form.status" :placeholder="$t('commonTips.pleaseSelect')">
            <el-option
              v-for="dict in dict.type.v1_startup_status"
              :key="dict.value"
              :label="$t('dict.v1_startup_status.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('push.alarmType')" prop="alarmType">
          <el-select
            v-model="form.alarmType"
            :placeholder="$t('commonTips.pleaseSelect')"
            multiple
            @change="changeAlarmType"
          >
            <el-option key="22222" :label="$t('push.all')" value="0" />
            <el-option
              v-for="dict in dict.type.v1_alarm_type"
              :key="dict.value"
              :label="$t('dict.v1_alarm_type.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('commonBtn.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('commonBtn.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!-- Add or Edit mobile push configuration dialog box -->
    <el-dialog :title="phoneTitle" :visible.sync="phoneOpen" width="500px" append-to-body>
      <el-form ref="phoneForm" :model="phoneForm" :rules="phoneRules" label-width="100px">
        <el-form-item :label="$t('push.phone')" prop="phone">
          <el-input
            v-model="phoneForm.phone"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item :label="$t('push.status')" prop="status">
          <el-select v-model="phoneForm.status" :placeholder="$t('commonTips.pleaseSelect')">
            <el-option
              v-for="dict in dict.type.v1_startup_status"
              :key="dict.value"
              :label="$t('dict.v1_startup_status.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('push.alarmType')" prop="alarmType">
          <el-select
            v-model="phoneForm.alarmType"
            :placeholder="$t('commonTips.pleaseSelect')"
            multiple
            @change="changePhoneAlarmType"
          >
            <el-option key="22222" :label="$t('push.all')" value="0" />
            <el-option
              v-for="dict in dict.type.v1_alarm_type"
              :key="dict.value"
              :label="$t('dict.v1_alarm_type.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPhoneForm">{{ $t('commonBtn.confirm') }}</el-button>
        <el-button @click="cancelPhone">{{ $t('commonBtn.cancel') }}</el-button>
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
} from "@/api/system/http";
import {
  listPhonePush,
  getPhonePush,
  delPhonePush,
  addPhonePush,
  updatePhonePush,
} from "@/api/system/phone";

export default {
  name: "Config",
  dicts: ["v1_startup_status", "v1_alarm_type"],
  data() {
    return {
      // Currently active tab
      activeTab: "http",
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
      // http push configuration form data
      configList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        connectInfo: null,
        status: null,
        alarmType: null,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        connectInfo: [
          { required: true, message: this.$t('push.httpAddressRequired'), trigger: "blur" },
        ],
        status: [
          { required: true, message: this.$t('push.statusRequired'), trigger: "change" },
        ],
        alarmType: [
          { required: true, message: this.$t('push.alarmTypeRequired'), trigger: "change" },
        ],
      },
      // Mobile push related
      phoneLoading: true,
      phoneIds: [],
      phoneSingle: true,
      phoneMultiple: true,
      phoneTotal: 0,
      phoneList: [],
      phoneTitle: "",
      phoneOpen: false,
      phoneQueryParams: {
        pageNum: 1,
        pageSize: 10,
        phone: null,
        status: null,
        alarmType: null,
      },
      phoneForm: {},
      phoneRules: {
        phone: [
          { required: true, message: this.$t('push.phoneRequired'), trigger: "blur" },
        ],
        status: [
          { required: true, message: this.$t('push.statusRequired'), trigger: "change" },
        ],
        alarmType: [
          { required: true, message: this.$t('push.alarmTypeRequired'), trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // Tab switch
    handleTabClick(tab) {
      if (tab.name === "http") {
        this.getList();
      } else if (tab.name === "phone") {
        this.getPhoneList();
      }
    },
    //When Push Alarm All is selected, clear other Options.
    changeAlarmType(e) {
      let that = this;
      if (e[e.length - 1] == "0") {
        that.$nextTick(() => {
          that.$set(that.form, "alarmType", ["0"]);
        });
      } else {
        that.$nextTick(() => {
          that.$set(
            that.form,
            "alarmType",
            e.filter((item) => item != "0")
          );
        });
      }
    },
    /** Query HTTP push config list */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.data.records;
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
        connectInfo: null,
        status: null,
        alarmType: null,
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
      this.title = this.$t('push.addHttpPush');
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.form.alarmType = this.form.alarmType.split(",");
        this.open = true;
        this.title = this.$t('push.editHttpPush');
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const submitData = { ...this.form };
          submitData.alarmType = submitData.alarmType.join(",");
          if (submitData.id != null) {
            updateConfig(submitData).then(() => {
              this.$modal.msgSuccess(this.$t('commonTips.edit_s'));
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(submitData).then(() => {
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
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t('push.confirmDeleteHttp', { ids }))
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t('commonTips.remove_s'));
        })
        .catch(() => {});
    },

    // ========== Mobile push related methods ==========
    changePhoneAlarmType(e) {
      let that = this;
      if (e[e.length - 1] == "0") {
        that.$nextTick(() => {
          that.$set(that.phoneForm, "alarmType", ["0"]);
        });
      } else {
        that.$nextTick(() => {
          that.$set(
            that.phoneForm,
            "alarmType",
            e.filter((item) => item != "0")
          );
        });
      }
    },
    /** Query mobile push config list */
    getPhoneList() {
      this.phoneLoading = true;
      listPhonePush(this.phoneQueryParams).then((response) => {
        this.phoneList = response.data.records;
        this.phoneTotal = response.data.totalCount;
        this.phoneLoading = false;
      });
    },
    cancelPhone() {
      this.phoneOpen = false;
      this.resetPhone();
    },
    resetPhone() {
      this.phoneForm = {
        id: null,
        phone: null,
        status: null,
        alarmType: null,
      };
      this.resetForm("phoneForm");
    },
    handlePhoneQuery() {
      this.phoneQueryParams.pageNum = 1;
      this.getPhoneList();
    },
    resetPhoneQuery() {
      this.resetForm("phoneQueryForm");
      this.handlePhoneQuery();
    },
    handlePhoneSelectionChange(selection) {
      this.phoneIds = selection.map((item) => item.id);
      this.phoneSingle = selection.length !== 1;
      this.phoneMultiple = !selection.length;
    },
    handlePhoneAdd() {
      this.resetPhone();
      this.phoneOpen = true;
      this.phoneTitle = this.$t('push.addPhonePush');
    },
    handlePhoneUpdate(row) {
      this.resetPhone();
      const id = row.id || this.phoneIds;
      getPhonePush(id).then((response) => {
        this.phoneForm = response.data;
        this.phoneForm.alarmType = this.phoneForm.alarmType.split(",");
        this.phoneOpen = true;
        this.phoneTitle = this.$t('push.editPhonePush');
      });
    },
    submitPhoneForm() {
      this.$refs["phoneForm"].validate((valid) => {
        if (valid) {
          const submitData = { ...this.phoneForm };
          submitData.alarmType = submitData.alarmType.join(",");
          if (submitData.id != null) {
            updatePhonePush(submitData).then(() => {
              this.$modal.msgSuccess(this.$t('commonTips.edit_s'));
              this.phoneOpen = false;
              this.getPhoneList();
            });
          } else {
            addPhonePush(submitData).then(() => {
              this.$modal.msgSuccess(this.$t('commonTips.add_s'));
              this.phoneOpen = false;
              this.getPhoneList();
            });
          }
        }
      });
    },
    handlePhoneDelete(row) {
      const ids = row.id || this.phoneIds;
      this.$modal
        .confirm(this.$t('push.confirmDeletePhone', { ids }))
        .then(function () {
          return delPhonePush(ids);
        })
        .then(() => {
          this.getPhoneList();
          this.$modal.msgSuccess(this.$t('commonTips.remove_s'));
        })
        .catch(() => {});
    },
  },
};
</script>
