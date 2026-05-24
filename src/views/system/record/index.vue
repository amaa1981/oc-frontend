<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      class="search-form"
    >
      <el-form-item label="Event type" prop="eventTypeId">
        <el-select v-model="queryParams.eventTypeId" placeholder="Select" filterable clearable>
          <el-option
            v-for="(dict, index) in dict.type.v1_alarm_type"
            :key="index"
            :label="$t('dict.v1_alarm_type.' + dict.value)"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Occurrence time" prop="sendTime">
        <el-date-picker
          v-model="queryParams.sendTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>

      <el-form-item label="Device name" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="Enter"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="Task name" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="Enter"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">Search</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">Reset</el-button>
      </el-form-item>

      <el-form-item class="form-actions-right">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:record:remove']">Remove</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">Export</el-button>
      </el-form-item>
    </el-form>

    <div style="overflow-x: auto; width: 100%;">
      <el-table
        v-loading="loading"
        :data="recordList"
        @selection-change="handleSelectionChange"
        style="width: 100%; min-width: 1100px;"
      >
        <el-table-column type="selection" width="45" align="center" />

        <el-table-column label="Picture" align="center" width="90">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.imageData"
              :src="'data:image/jpeg;base64,' + scope.row.imageData"
              :preview-src-list="['data:image/jpeg;base64,' + scope.row.imageData]"
              style="width:60px;height:50px;object-fit:cover;border-radius:4px;"
              fit="cover"
            />
            <video
              v-else-if="scope.row.videoUrl"
              controls
              loop
              :width="80"
              :height="60"
              :src="scope.row.videoUrl"
            />
            <span v-else style="color:#aaa;font-size:12px;">No image</span>
          </template>
        </el-table-column>

        <el-table-column label="Event Type" align="center" width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ $t('dict.v1_alarm_type.' + scope.row.eventTypeId) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Occurrence Time" align="center" width="170">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.sendTime || scope.row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Device" align="center" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.equipmentName || scope.row.deviceName || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Area" align="center" width="110">
          <template slot-scope="scope">
            <dict-tag
              v-if="scope.row.installationArea"
              :options="dict.type.v1_device_area"
              :value="scope.row.installationArea"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="Task" align="center" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.taskName || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" align="center" width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="warning" size="small">Untreated</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="success" size="small">Processed</el-tag>
            <el-tag v-else type="danger" size="small">Rejected</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Handle Time" align="center" width="170">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.operateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Remarks" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.remarks || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="center" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-search" @click="handleUpdate(scope.row)" v-hasPermi="['system:record:edit']">View</el-button>
            <span class="action-divider" />
            <el-button size="mini" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.row)" v-hasPermi="['system:record:remove']">Remove</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- Alarm Detail Dialog -->
    <alarm-detail
      :visible.sync="open"
      :alarm-data="form"
      @refresh="getList"
      @close="cancel"
    />
  </div>
</template>

<script>
import { listRecord, getRecord, delRecord } from "@/api/system/record";
import AlarmDetail from "@/components/AlarmDetail";

export default {
  name: "Record",
  dicts: ["v1_set_status", "v1_alarm_type", "v1_device_area"],
  components: { AlarmDetail },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      recordList: [],
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eventTypeId: null,
        equipmentId: null,
        equipmentName: null,
        status: null,
        sendTime: null,
        startTime: null,
        endTime: null,
        installationArea: localStorage.getItem('installationArea') || null,
      },
      form: {},
      rules: {},
    };
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 7 days",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 30 days",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate(time) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return time.getTime() >= tomorrow.getTime();
        },
      };
    },
  },
  created() {
    this.handleUrlParams();
    if (!this.queryParams.sendTime) {
      const today = this.getNowFormatDate();
      this.queryParams.sendTime = [today + " 00:00:00", today + " 23:59:59"];
    }
    this.getList();
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange);
  },
  beforeDestroy() {
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  methods: {
    formatDate(val) {
      if (!val) return '-';
      const d = new Date(val);
      if (isNaN(d)) return val;
      const pad = n => String(n).padStart(2, '0');
      const year = String(d.getFullYear()).slice(2); // 26 instead of 2026
      return `${year}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    onInstallationAreaChange(val) {
      this.queryParams.installationArea = val || null;
      this.handleQuery();
    },
    handleUrlParams() {
      const { eventTypeId, startTime, endTime, equipmentName } = this.$route.query;
      if (eventTypeId) this.queryParams.eventTypeId = eventTypeId;
      if (equipmentName) this.queryParams.equipmentName = equipmentName;
      if (startTime && endTime) {
        this.queryParams.sendTime = [startTime, endTime];
        this.queryParams.startTime = startTime;
        this.queryParams.endTime = endTime;
      }
    },
    getNowFormatDate() {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    },
    getList() {
      this.loading = true;
      if (this.queryParams.sendTime && this.queryParams.sendTime.length > 0) {
        this.queryParams.startTime = this.queryParams.sendTime[0];
        this.queryParams.endTime = this.queryParams.sendTime[1];
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
      listRecord(this.queryParams).then((response) => {
        this.recordList = response.data.records || [];
        this.total = response.data.totalCount || 0;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    cancel() { this.open = false; },
    reset() {
      this.form = { id: null, imageData: null, eventTypeId: null, sendTime: null, equipmentName: null, status: null, remarks: null };
      this.resetForm("form");
    },
    handleQuery() { this.queryParams.pageNum = 1; this.getList(); },
    resetQuery() { this.resetForm("queryForm"); this.handleQuery(); },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then((response) => {
        this.form = response.data;
        this.open = true;
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`Are you sure you want to delete record #${ids}?`)
        .then(() => delRecord(ids))
        .then(() => { this.getList(); this.$modal.msgSuccess("Deleted successfully"); })
        .catch(() => {});
    },
    handleExport() {
      const params = new URLSearchParams();
      if (this.queryParams.eventTypeId) params.append("eventTypeId", this.queryParams.eventTypeId);
      if (this.queryParams.equipmentName) params.append("equipmentName", this.queryParams.equipmentName);
      if (this.queryParams.status) params.append("status", this.queryParams.status);
      if (this.queryParams.startTime) params.append("startTime", this.queryParams.startTime);
      if (this.queryParams.endTime) params.append("endTime", this.queryParams.endTime);
      const url = `/api/alarm/record/export?${params.toString()}`;
      const link = document.createElement("a");
      link.href = url;
      link.download = `alarm_records_${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-divider {
  display: inline-block;
  width: 1px;
  height: 12px;
  background: #dcdfe6;
  margin: 0 6px;
  vertical-align: middle;
}
</style>