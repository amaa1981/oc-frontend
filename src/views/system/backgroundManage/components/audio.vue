<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
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
          >{{ $t("commonBtn.edit") }}</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-checkbox
          v-model="openAudio"
          :label="$t('device.openAudio')"
          @change="openAudios"
          size="mini"
          border
        ></el-checkbox>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        :label="$t('audioConfig.alarmType')"
        align="center"
        prop="alarmType"
      >
        <template slot-scope="scope">
          {{ $t("dict.v1_alarm_type." + scope.row.alarmType) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('audioConfig.mp3')"
        align="center"
        prop="audioUrl"
      />
      <el-table-column
        :label="$t('httpConfig.opearte')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- Add or Edit playback Audio configuration dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('audioConfig.alarmType')" prop="alarmType">
          <el-select
            v-model="form.alarmType"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_alarm_type"
              :key="dict.value"
              :label="$t('dict.v1_alarm_type.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('audioConfig.playContent')" prop="playContent">
          <el-input
            v-model="form.playContent"
            type="textarea"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item> -->

        <el-form-item :label="$t('audioConfig.mp3')" prop="audioUrl">
          <file-upload
            v-model="form.audioUrl"
            :fileType="['mp3', 'MP3']"
            :limit="1"
            :fileSize="3072"
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
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
} from "@/api/system/audio";
import { audioStatus, getAudioStatus } from "@/api/system/device";
export default {
  name: "Config",
  dicts: ["v1_alarm_type"],
  data() {
    return {
      openAudio: false,
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
      // Play Audio configuration table data
      configList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmType: null,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        alarmType: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        audioUrl: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        playContent: [
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
    this.getAudioStatuss();
  },
  methods: {
    getAudioStatuss() {
      getAudioStatus().then((res) => {
        console.log(res);
        if (res.data == "10") {
          this.openAudio = true;
        } else {
          this.openAudio = false;
        }
      });
    },
    openAudios() {
      console.log(this.openAudio);
      if (this.openAudio) {
        this.setAudio(10);
      } else {
        this.setAudio(20);
      }
    },
    setAudio(e) {
      audioStatus(e).then((res) => {
        this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
      });
    },
    /** Query audio config list */
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
        alarmType: null,
        playContent: null,
        audioUrl: null,
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
      this.title = this.$t("audioConfig.dialogTitle_a");
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("audioConfig.dialogTitle_e");
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then((response) => {
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
        .confirm(this.$t("audioConfig.confirmRemove", { ids: ids }))
        .then(function () {
          return delConfig(ids);
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
        "system/config/export",
        {
          ...this.queryParams,
        },
        `config_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
