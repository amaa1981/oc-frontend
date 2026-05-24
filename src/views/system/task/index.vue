<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('task.taskName')" prop="taskName">
        <el-input v-model="queryParams.taskName" :placeholder="$t('commonTips.pleaseEnter')" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('task.algorithmType')" prop="algorithmType">
        <el-select v-model="queryParams.algorithmType" :placeholder="$t('commonTips.pleaseSelect')" filterable>
          <el-option v-for="(dict, index) in dict.type.v1_alarm_type" :key="index"
            :label="$t('dict.v1_alarm_type.' + dict.value)" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('task.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('commonTips.pleaseSelect')" clearable>
          <el-option v-for="dict in dict.type.v1_startup_status" :key="dict.value"
            :label="$t('dict.v1_startup_status.' + dict.value)" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t("commonBtn.search")
          }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t("commonBtn.reset")
          }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:task:add']">{{ $t("commonBtn.add") }}</el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:task:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->

      <el-table-column :label="$t('task.algorithmType')" align="center" prop="algorithmType">
        <template slot-scope="scope">
          {{ $t("dict.v1_alarm_type." + scope.row.algorithmType) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('task.taskName')" align="center" prop="taskName" />
      <el-table-column :label="$t('task.alarmInterval')" align="center" prop="alarmInterval" />
      <!-- <el-table-column
        :label="$t('task.analysisAlgorithmJson')"
        align="center"
        prop="analysisJson"
      /> -->
      <!-- <el-table-column :label="$t('task.status')" align="center" prop="status">
        <template slot-scope="scope">
          {{ $t("dict.v1_startup_status." + scope.row.status) }}
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('task.time1')" align="center" prop="time1" />
      <el-table-column :label="$t('task.operate')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-search" class="btn-view" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:task:edit']">{{ $t("commonBtn.edit") }}</el-button>
          <span class="action-divider" />
          <el-button size="mini" type="text" icon="el-icon-delete" class="btn-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:task:remove']">{{ $t("commonBtn.remove") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- Add or Edit device task information dialog box -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :destroy-on-close="true">
      <div class="main">
        <div class="operation">
          <div class="button-wrap">
            <el-button type="text" class="el-icon-minus" @click="setMode('LINE')" v-if="
              form.algorithmType == '5FFA8DB9-DC3F-49ED-B0BB-A2AEA1F9FD3F' ||
              form.algorithmType == '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F' ||
              form.algorithmType == '0264CA9D-0200-4FE5-9793-859741E689C1' ||
              form.algorithmType == '174CA9D-0200-4FE5-9793-859741E689C6' ||
              form.algorithmType == '374CA9D-0200-4FE5-9793-859741E689D1' ||
              form.algorithmType == '45BB561E-EA54-4F13-A7E6-A11DE5C75648'||
              form.algorithmType == '76B27D32-5274-A1A5-2DA7-8F827B1C8616'||
              form.algorithmType == '0234CA9A-0200-4FE5-9793-859741E689C3'
            ">{{ $t("task.line") }}</el-button>

            <el-button type="text" class="el-icon-location" @click="setMode('POINT')" v-if="
              form.algorithmType == '9982D74C-BDAC-49E2-BDA0-CB906D28E69A'
            ">{{ $t("task.point") }}</el-button>

            <el-button type="text" class="el-icon-full-screen" v-if="
              form.algorithmType == 'B6A27D32-5274-A1C3-2DA7-8F827B1C8622'
            " @click="setMode('RECT')">{{ $t("task.rect") }}</el-button>

            <el-button type="text" class="el-icon-house" @click="setMode('POLYGON')">{{ $t("task.startPaint")
              }}</el-button>

            <el-button type="text" class="el-icon-refresh-left" @click="Revoke()">{{ $t("commonBtn.reset")
              }}</el-button>
            <!-- <el-button type="text" @click="getFeatures()"
              >Get Annotation Data</el-button
            > -->
          </div>
        </div>

        <div id="map" :style="'width:' + map.width + 'px;height:' + map.height + 'px'"></div>
      </div>

      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('task.algorithmType')" prop="algorithmType">
          <el-select ref="selectLable" v-model="form.algorithmType" :placeholder="$t('commonTips.pleaseSelect')"
            @change="changeAlgorithmType" filterable>
            <el-option v-for="(dict, index) in dict.type.v1_alarm_type" :key="index + 100"
              :label="$t('dict.v1_alarm_type.' + dict.value)" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('task.taskName')" prop="taskName">
          <el-input v-model="form.taskName" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>

        <el-form-item :label="$t('task.alarmInterval')" prop="alarmInterval">
          <div class="input-with-unit">
            <el-input :placeholder="$t('task.second')" type="number" v-model="form.alarmInterval" />
            <span class="unit-tag">{{ $t("task.s") }}</span>
          </div>
        </el-form-item>
        <!-- Whether to enable the recognition box -->
        <el-form-item :label="$t('task.enableRecognitionBox')">
          <el-switch v-model="form.enableRecognitionBox" @change="handleRecognitionBoxChange"></el-switch>
        </el-form-item>
        <!-- Frame rate - only shown when the recognition box is turned on -->
        <el-form-item :label="$t('task.frameRate')" v-if="form.enableRecognitionBox" prop="frameRate">
          <el-input-number v-model="form.frameRate" :min="1" :max="25" :placeholder="$t('commonTips.pleaseEnter')"></el-input-number>
        </el-form-item>
        <!-- Illegal parking, leftovers, detention, gas station detection No sensitivity -->
        <el-form-item :label="$t('task.fVal')" v-if="
          form.algorithmType != 'BDDBB500-62F3-4A93-AC9E-11C9CC6EA4BE' &&
          form.algorithmType != '6C4483AA-83E1-49AD-B06D-297D267BD80B' &&
          form.algorithmType != '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d' &&
          form.algorithmType != '45BB561E-EA54-4F13-A7E6-A11DE5C75648' &&
          form.algorithmType != '374CA9D-0200-4FE5-9793-859741E689D1' &&
          form.algorithmType != '7f954cb2-b29c-48b9-9a78-8fecf957a212' &&
          form.algorithmType != 'DAA64F89-9E21-45C9-9FC6-9F4E9C1CB794' &&
          form.algorithmType != 'B6B27D32-5274-A1C3-2DA7-8F827B1C8676' &&
          form.algorithmType != 'B6A27D32-5274-A1C3-2DA7-8F827B1C8622' &&
          form.algorithmType != '33BB561E-EAE4-4F13-A7E6-A11DE5C7F167' &&
          form.algorithmType != '0234CA9A-0200-4FE5-9793-859741E689C3' &&
          form.algorithmType != '65EB561E-EAE4-4F13-A7E6-A11DE5C7D163'&&
          form.algorithmType != '9982D74C-BDAC-49E2-BDA0-CB906D28E69A' &&
          form.algorithmType != '8742D74B-BDAC-49E2-BDA0-CB906D28E6E4' &&
          form.algorithmType != '25BB561D-D154-4F13-A7E6-671DE5C7F134'&&
          form.algorithmType != 'DACD8C81-FCDC-47E3-80A9-B648CE558456' &&
          form.algorithmType != 'BBEF5D75-26FC-4F3A-B2A3-F1C8B77FC5E1'
        ">
          <el-input placeholder="%" type="number" v-model="other.options.fVal" min="0" max="1" />
        </el-form-item>

        <!-- Gesture recognition for playing with mobile phone -->
        <template v-if="form.algorithmType == 'D432D747-BDAC-49E2-BDA0-CB906D28E141'">
          <el-form-item :label="$t('task.faceDetectionThreshold')" prop="">
            <el-input type="number" v-model="other.options.personThreshold" min="0" max="1" />
          </el-form-item>
        </template>
        <!-- Headgear recognition -->
        <template v-if="form.algorithmType == '9132D74B-BDAC-49E2-BDA0-CB906D28E66E'">
          <el-form-item :label="$t('task.faceDetectionThreshold')" prop="">
            <el-input type="number" v-model="other.options.personThreshold" min="0" max="1" />
          </el-form-item>
        </template>

        <!-- Fence detection -->
        <template v-if="form.algorithmType == '9982D74C-BDAC-49E2-BDA0-CB906D28E69A'">
          <el-form-item :label="$t('task.fenceThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.fenceThresh" min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.fencePersonThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.fencePersonThresh" min="0" max="1" />
          </el-form-item>
        </template>

        <!-- Glove and shoe cover testing -->
        <template v-if="form.algorithmType == '25BB561D-D154-4F13-A7E6-671DE5C7F134'">
          <el-form-item :label="$t('task.glovesPersonThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.glovesPersonThresh" min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.glovesThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.glovesThresh" min="0" max="1" />
          </el-form-item>
        </template>
       <!-- Special field for charging gun detection -->
        <template v-if="form.algorithmType == 'DACD8C81-FCDC-47E3-80A9-B648CE558456'">
          <el-form-item :label="$t('task.carThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.carThreshold" min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.chargingThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.chargingThreshold" min="0" max="1" />
          </el-form-item>
        </template>
        <!-- Non-employee intrusion detection -->
        <template v-if="form.algorithmType == '8742D74B-BDAC-49E2-BDA0-CB906D28E6E4'">
          <el-form-item :label="$t('task.intrusionPersonThresh')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.intrusionPersonThresh" min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.intrusionFrontPic')" prop="">
            <el-upload
              class="intrusion-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res) => handleIntrusionUploadSuccess(res, 'front')"
              :before-upload="beforeIntrusionUpload"
              accept="image/*"
            >
              <img v-if="other.options.intrusionFrontPic" :src="other.options.intrusionFrontPic" class="intrusion-image">
              <i v-else class="el-icon-plus intrusion-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('task.intrusionBackPic')" prop="">
            <el-upload
              class="intrusion-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res) => handleIntrusionUploadSuccess(res, 'back')"
              :before-upload="beforeIntrusionUpload"
              accept="image/*"
            >
              <img v-if="other.options.intrusionBackPic" :src="other.options.intrusionBackPic" class="intrusion-image">
              <i v-else class="el-icon-plus intrusion-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </template>

        <!-- Motor vehicle illegal parking identification -->
        <template v-if="form.algorithmType == 'DD32D74B-BDAC-49E2-BDA0-CB906D28E14E'">
          <el-form-item :label="$t('task.illegalParkingTimeout')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text"
              v-model="other.options.IllegalParkingTimeout" />
          </el-form-item>
          <el-form-item :label="$t('task.illegalParkingType')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text"
              v-model="other.options.IllegalParkingtype" />
          </el-form-item>
        </template>
        <!-- Age and gender identification -->
        <template v-if="form.algorithmType == '76B27D32-5274-A1A5-2DA7-8F827B1C8616'">
          <!-- <el-form-item :label="$t('task.type')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text" v-model="other.options.facetype" />
          </el-form-item> -->
          <el-form-item :label="$t('task.faceColor')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text" v-model="other.options.faceColors" />
          </el-form-item>
          <el-form-item :label="$t('task.faceWeight')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text" v-model="other.options.faceWeights" />
          </el-form-item>
          <el-form-item :label="$t('task.ageGenderAlarmInterval')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.ageGenderAlarmInterval">
              <template slot="append">{{ $t("task.s") }}</template>
            </el-input>
          </el-form-item>
        </template>

        <!-- Door status detection -->
        <template v-if="form.algorithmType == '65EB561E-EAE4-4F13-A7E6-A11DE5C7D163'">
          <el-form-item :label="$t('task.Threshold1')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.Threshold1"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.Threshold2')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.Threshold2"
              min="0" max="1" />
          </el-form-item>
        </template>
        <!-- Mask testing -->
        <template v-if="form.algorithmType == 'B6B27D32-5274-A1C3-2DA7-8F827B1C8676'">
          <el-form-item :label="$t('task.types')" prop="">
            <el-select v-model="other.options.types">
              <el-option :label="$t('task.types_0')" value="0"></el-option>
              <el-option :label="$t('task.types_1')" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('task.faceColor')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.faceColor"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.faceWeight')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.faceWeight"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.maskScore')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.maskScore"
              min="0" max="1" />
          </el-form-item>
        </template>

        <!-- Platform water detection -->
        <template v-if="form.algorithmType == 'DAA64F89-9E21-45C9-9FC6-9F4E9C1CB794'">
          <el-form-item :label="$t('task.waterThresh')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.waterThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.scaleThresh')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.scaleThresh"
              min="0" max="1" />
          </el-form-item>
        </template>
        <!-- Thailand license plate recognition special field -->
        <template v-if="form.algorithmType == '33BB561E-EAE4-4F13-A7E6-A11DE5C7F167'">
          <el-form-item :label="$t('task.vehicleThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.vehicleThreshs"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.licenseThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.licenseThreshs"
              min="0" max="1" />
          </el-form-item>
        </template>

        <!-- University of Hong Kong UWB display dedicated fields -->
        <template v-if="form.algorithmType == 'BBEF5D75-26FC-4F3A-B2A3-F1C8B77FC5E1'">
          <el-form-item :label="$t('task.personCheckThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.personCheckThreshold"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.floorId')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.floorId" />
          </el-form-item>
          <el-form-item :label="$t('task.personCoordinateDistance')" prop="">
            <div class="input-with-unit">
              <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.personCoordinateDistance" />
              <span class="unit-tag">{{ $t("task.cm") }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('task.coordinateUpdateInterval')" prop="">
            <div class="input-with-unit">
              <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.coordinateUpdateInterval" />
              <span class="unit-tag">{{ $t("task.ms") }}</span>
            </div>
          </el-form-item>
        </template>

        <!-- Special fields for vehicle statistics -->
        <template v-if="form.algorithmType == '0234CA9A-0200-4FE5-9793-859741E689C3'">
          <el-form-item :label="$t('task.vehicleCarThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.vehicleCarThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.vehicleMotorcycleThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.vehicleMotorcycleThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.vehicleFrameInterval')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.vehicleFrameInterval"
              min="1" />
          </el-form-item>
        </template>

        <!-- Special field for mask and earphone detection -->
        <template v-if="form.algorithmType == '27DB5613-D184-4F13-A7E6-671DE5C7F4E6'">
          <el-form-item :label="$t('task.earphoneThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.earphoneThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.faceMaskThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.faceMaskThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.maskEarphoneFrameInterval')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.maskEarphoneFrameInterval"
              min="1" />
          </el-form-item>
          <el-form-item :label="$t('task.mllm')" prop="">
            <el-select v-model="other.options.mllm">
              <el-option :label="$t('task.mllmOff')" value="0"></el-option>
              <el-option :label="$t('task.mllmOn')" value="1"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <!-- Special field for motorcycle helmet detection -->
        <template v-if="form.algorithmType == '7f954cb2-b29c-48b9-9a78-8fecf957a212'">
          <!-- personnel threshold -->
          <el-form-item :label="$t('task.personThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.mtpersonThresh"
              min="0" max="1" />
          </el-form-item>
          <!-- Hard hat threshold -->
          <el-form-item :label="$t('task.helmetThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.helmetThresh"
              min="0" max="1" />
          </el-form-item>
          <!-- motorcycle threshold -->
          <el-form-item :label="$t('task.motorcycleThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.motorcycleThresh"
              min="0" max="1" />
          </el-form-item>
        </template>
        <!-- Special fields for sleep guard detection-->
        <template v-if="form.algorithmType == 'E7017EDA-4EFD-493E-97DF-4156ECB39656'">
          <el-form-item :label="$t('task.lVal')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.sleeptimeOut"
              min="0"><template slot="append">{{ $t("task.s") }}</template>
            </el-input>
          </el-form-item>
        </template>
        <!-- Dedicated fields for detention detection-->
        <template v-if="form.algorithmType == '6C4483AA-83E1-49AD-B06D-297D267BD80B'">
          <el-form-item :label="$t('task.retentionTime')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.timeOut"
              min="0"><template slot="append">{{ $t("task.s") }}</template>
            </el-input>
          </el-form-item>
        </template>
        <!-- Vehicle driving in reverse direction Dedicated field-->
        <template v-if="form.algorithmType == '0264CA9D-0200-4FE5-9793-859741E689C0'">
          <el-form-item :label="$t('task.type')" prop="">
            <el-select :placeholder="$t('commonTips.pleaseSelect')" v-model="other.options.type">
              <el-option :label="$t('task.type_0')" value="0"></el-option>
              <el-option :label="$t('task.type_1')" value="1"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- Hard hat dedicated field-->

        <template v-if="form.algorithmType == '7F954CB2-B29C-48B9-9A78-8FECF957A290'">
          <el-form-item :label="$t('task.type')" prop="">
            <el-select v-model="other.options.anquanmao">
              <el-option :label="$t('task.type_00')" value="0"></el-option>
              <el-option :label="$t('task.type_11')" value="1"></el-option>
              <el-option :label="$t('task.type_22')" value="2"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <!-- Legacy Detection Special Field-->
        <template v-if="form.algorithmType == 'BDDBB500-62F3-4A93-AC9E-11C9CC6EA4BE'">
          <el-form-item :label="$t('task.tempsRestant')" prop="alarmInterval">
            <el-input :placeholder="$t('task.second')" type="number" v-model="other.options.DelayTime"><template
                slot="append">{{ $t("task.s") }}</template>
            </el-input>
          </el-form-item>
        </template>
        <!-- Off-duty detection special field-->
        <template v-if="form.algorithmType == 'F7581B40-A9F9-498E-A510-14F40009C545'">
          <el-form-item :label="$t('task.tuotime')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.tuotime"
              min="0" />
          </el-form-item>
        </template>
        <!-- Special fields for in-store customer detection -->
        <template v-if="form.algorithmType == '45BB561E-EA54-4F13-A7E6-A11DE5C75648'">
          <el-form-item :label="$t('task.personThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.fValperson"
              min="0" />
          </el-form-item>
          <el-form-item :label="$t('task.assistantThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.fValassistant"
              min="0" />
          </el-form-item>

          <el-form-item :label="$t('task.retentionStartTime')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.retentionTime"
              min="0" />
          </el-form-item>
          <el-form-item :label="$t('task.conversationStartTime')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.conversationTime"
              min="0" />
          </el-form-item>
          <el-form-item :label="$t('task.cameraIP')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text" v-model="other.options.cameraIP2" />
          </el-form-item>
          <!-- Area name List -->
          <el-form-item :label="$t('task.areaNameList')" prop="" v-if="other.options.areaNameList.length > 0">
            <div v-for="(areaName, index) in other.options.areaNameList" :key="index" style="margin-bottom: 10px;">
              <el-input v-model="other.options.areaNameList[index]" :placeholder="$t('task.areaName') + (index + 1)"
                style="width: calc(100% - 40px); margin-right: 10px;">
                <template slot="prepend">{{ index + 1 }}</template>
              </el-input>
            </div>
          </el-form-item>
        </template>

        <!-- Garbage detection algorithm ID: 1f954cb2-b29c-48b9-9a78-8fecf957a515 -->
        <template v-if="form.algorithmType == '1f954cb2-b29c-48b9-9a78-8fecf957a515'">
            
          <el-form-item :label="$t('task.garbageType')" prop="">
            <el-select :placeholder="$t('commonTips.pleaseSelect')" v-model="other.options.garbageType">
              <el-option :label="$t('task.garbageType0')" :value="0"></el-option>
              <el-option :label="$t('task.garbageType1')" :value="1"></el-option>
              <el-option :label="$t('task.garbageType2')" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <!-- Face recognition dedicated fields -->
        <template v-if="form.algorithmType == 'B7A27D32-5274-A1C3-2DA7-8F827B1C8644'">
          <el-form-item :label="$t('group.libName')" prop="">
            <el-select v-model="other.options.faceGroupList" multiple>
              <el-option :label="item.libName" :value="item.libName" v-for="item in faceGroupList"
                :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item :label="$t('task.similarity')" prop="">
            <el-input
              placeholder="%"
              type="number"
              max="100"
              min="0"
              v-model="form.similarity"
            />
          </el-form-item>
          <el-form-item :label="$t('task.sf25Type')" prop="">
            <el-select
              :placeholder="$t('commonTips.pleaseSelect')"
              v-model="other.sf25.type"
            >
              <el-option :label="$t('task.sf25Type0')" value="0"></el-option>
              <el-option :label="$t('task.sf25Type1')" value="1"></el-option>
            </el-select>
          </el-form-item> -->
        </template>

        <template v-if="form.algorithmType == 'B6A27D32-5274-A1C3-2DA7-8F827B1C8622'">
          <el-form-item :label="$t('task.faceWeight')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.faceWeightwin"
              min="0" />
          </el-form-item>
          <el-form-item :label="$t('task.frameInterval')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.frameInterval"
              min="0" />
          </el-form-item>
        </template>
        <!-- Special fields for density detection -->
        <template v-if="form.algorithmType == 'F7581B40-A9F9-498E-A510-14F40010C545'">
          <el-form-item :label="$t('task.alarmType')" prop="">
            <el-select :placeholder="$t('commonTips.pleaseSelect')" v-model="other.options.alarmType">
              <el-option :label="$t('task.alarmType3')" value="3"></el-option>
              <el-option :label="$t('task.alarmType1')" value="1"></el-option>
              <el-option :label="$t('task.alarmType2')" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('task.userNum')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.userNum"
              min="0" />
          </el-form-item>
        </template>

        <!-- Play with mobile phone-specific fields -->
        <template v-if="form.algorithmType == '28E4800E-01AF-4647-8F9B-966497DBE20B'">
          <el-form-item :label="$t('task.lVal')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.lVal" min="0" />
          </el-form-item>
        </template>

        <!-- Special fields for illegal refueling -->
        <template v-if="form.algorithmType == 'D2985710-425A-4DC9-AD61-C876FA5F5E9D'">
          <el-form-item :label="$t('task.distance')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.distance"
              min="0" />
          </el-form-item>
        </template>
        <!-- Special fields for statistics on the number of people entering the store in Thailand -->
        <template v-if="form.algorithmType == '374CA9D-0200-4FE5-9793-859741E689D1'">
          <el-form-item :label="$t('task.passThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.passThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.enterThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.enterThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.cameraIP')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="text" v-model="other.options.cameraIP" />
          </el-form-item>
        </template>

        <!-- Special fields for people and vehicles statistics -->
        <template v-if="form.algorithmType == '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F'">
          <el-form-item :label="$t('task.vehicleThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.vehicleThresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.personThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.personThresh"
              min="0" max="1" />
          </el-form-item>
        </template>

        <!-- Special fields for gas station detection -->
        <template v-if="form.algorithmType == '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d'">
          <el-form-item :label="$t('task.helmetThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.helmetthresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.personThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.personthresh"
              min="0" max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.clothingThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number"
              v-model="other.options.staffidentithresh" min="0" max="1" />
          </el-form-item>

          <el-form-item :label="$t('task.tankerThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.tanker" min="0"
              max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.fireExtinguisherThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.fireex" min="0"
              max="1" />
          </el-form-item>
          <el-form-item :label="$t('task.antiStaticThreshold')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.tankerstat"
              min="0" max="1" />
          </el-form-item>

          <el-form-item :label="$t('task.antiStaticInterval')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number"
              v-model="other.options.staticeleAlarmInterval" min="0" />
          </el-form-item>

          <el-form-item :label="$t('task.fireExtinguisherInterval')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number"
              v-model="other.options.fireexAlarmInterval" min="0" />
          </el-form-item>
        </template>

        <!-- Special field for illegal parking -->
        <template v-if="form.algorithmType == 'ED32D74B-BDAC-49E2-BDA0-CB906D28E14F'">
          <el-form-item :label="$t('task.MaxCount')" prop="">
            <el-input :placeholder="$t('commonTips.pleaseEnter')" type="number" v-model="other.options.MaxCount"
              min="1" />
          </el-form-item>
        </template>

        <!-- Special field for smoking -->
        <!-- <template
          v-if="form.algorithmType == '118D34A0-4FEB-4906-A622-C7974AB3C637'"
        >
          <el-form-item :label="$t('task.sf25Type')" prop="">
            <el-select
              :placeholder="$t('commonTips.pleaseSelect')"
              v-model="other.options.fVal2"
            >
              <el-option :label="$t('task.posture1')" value="0"></el-option>
              <el-option :label="$t('task.posture2')" value="1"></el-option>
            </el-select>
          </el-form-item>
        </template> -->

        <!-- Multimodal model (MLLM) 0 off 1 on Default off -->
        <template v-if="
          form.algorithmType == '118D34A0-4FEB-4906-A622-C7974AB3C637' ||
          form.algorithmType == '28E4800E-01AF-4647-8F9B-966497DBE20B' ||
          form.algorithmType == '7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5' ||
          form.algorithmType == '7F954CB2-B29C-48B9-9A78-8FECF957A290' ||
          form.algorithmType == 'ADEE06F4-9D5F-44A8-8681-507BBF3CADF8' ||
          form.algorithmType == '99BB561E-EA54-4F13-A7E6-A11DE5C7F142' ||
          form.algorithmType == '3864E531-F909-4E37-A544-B557A8490D80'
        ">
          <el-form-item :label="$t('task.mllm')" prop="">
            <el-select v-model="other.options.mllm" :placeholder="$t('commonTips.pleaseSelect')">
              <el-option :label="$t('task.mllmOff')" value="0"></el-option>
              <el-option :label="$t('task.mllmOn')" value="1"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- <el-form-item :label="$t('task.status')" prop="status">
          <el-select
            v-model="form.status"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_startup_status"
              :key="dict.value"
              :label="$t('dict.v1_startup_status.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 
        <el-form-item :label="$t('task.audioStatus')" prop="audioStatus">
          <el-select
            v-model="form.audioStatus"
            :placeholder="$t('commonTips.pleaseSelect')"
          >
            <el-option
              v-for="dict in dict.type.v1_startup_status"
              :key="dict.value"
              :label="$t('dict.v1_startup_status.' + dict.value)"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item :label="$t('task.executionTime')" prop="time1">
          <el-time-picker is-range arrow-control v-model="form.time1" :range-separator="$t('task.to')"
            :start-placeholder="$t('task.startTime')" :end-placeholder="$t('task.endTime')"
            :placeholder="$t('commonTips.pleaseSelect')" format="HH:mm:ss" value-format="HH:mm:ss">
          </el-time-picker>
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
  listTask,
  getTask,
  delTask,
  addTask,
  updateTask,
} from "@/api/system/task";
import { listGroup } from "@/api/system/group";
//Get device details
import { getDevice } from "@/api/system/device";
//Get the issued task json
import { getJson } from "@/utils/json/parameter";
//Annotation plug-in
import AILabel from "ailabel";

export default {
  name: "Task",
  dicts: ["v1_startup_status", "v1_alarm_type"],
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
      // Equipment task information table data
      taskList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: null,
        algorithmType: null,
        status: null,
        deviceId: null,
      },
      // Form parameters
      form: {},
      //Other algorithm parameters
      other: {
        options: {
          //coordinate
          points: {
            //straight line
            LINE: [],
            //rectangle
            RECT: [],
            //Polygon Default full screen
            POLYGON: [],
            //point
            POINTS: [],
          },
          //Sensitivity
          fVal: 0.5,
          //Fence detection--fence threshold
          fenceThresh: 0.6,
          //Fence detection--person detection threshold
          fencePersonThresh: 0.6,
          //Glove and shoe cover detection-personnel threshold
          glovesPersonThresh: 0.6,
          //Glove and shoe cover detection--glove and shoe cover threshold
          glovesThresh: 0.6,
          //Garbage type
          garbageType: 2,
          //Human detection threshold
          personThreshold: 0.6,
          //Violation of parking time limit
          IllegalParkingTimeout: 0,
          //Type of illegal stop
          IllegalParkingtype: "",
          //type
          facetype: "",
          //faceColor
          faceColors: "0.55",
          //faceWeight
          faceWeights: "0.83",
          //Door status detection--threshold 1
          Threshold1: 0.5,
          //Door status detection--Threshold 2
          Threshold2: 0,
          //Mask detection--0 Alarm for not wearing a mask 1 Alarm for wearing a mask
          types: "0",
          //Mask detection-face color threshold
          faceColor: 0.55,
          //Mask detection--face quality weight
          faceWeight: 0.83,
          //Face recognition (win version)--face quality weight
          faceWeightwin: 7,
          //Face recognition (win version)--face detection interval (milliseconds)
          frameInterval: 400,
          //Mask detection--mask threshold
          maskScore: 0.6,
          //Platform water accumulation detection-water accumulation threshold
          waterThresh: 0.5,
          //Platform water detection--scale threshold
          scaleThresh: 0.5,
          //Motorcycle helmet detection-personnel detection threshold
          mtpersonThresh: 0.6,
          //Motorcycle helmet detection - helmet detection threshold
          helmetThresh: 0.6,
          //Motorcycle helmet detection--motorcycle detection threshold
          motorcycleThresh: 0.6,
          //Thailand License Plate Recognition--Vehicle Detection Threshold
          vehicleThreshs: 0.6,
          //Thailand License Plate Recognition--License Plate Recognition Threshold
          licenseThreshs: 0.6,
          //Person detection threshold
          fValperson: 0.6,
          //Store clerk detection threshold
          fValassistant: 0.6,
          //Guest stay start time
          retentionTime: 60,
          //Start time of conversation between customer and store clerk
          conversationTime: 5,
          //Camera IP
          cameraIP2: "",
          //Area name List (in-store customer detection)
          areaNameList: [],
          //Density detection
          alarmType: null,
          userNum: null,
          //Playing on mobile phone - seconds
          lVal: 4,
          //Illegal refueling - distance between oil barrels and personnel (meters)
          distance: 10,
          //Statistics of people entering stores in Thailand--passing the threshold
          passThresh: 0.6,
          //Statistics of people entering stores in Thailand--store entry threshold
          enterThresh: 0.6,
          //Statistics of people entering stores in Thailand--Camera IP
          cameraIP: "",
          //People and vehicles statistics--Vehicle detection threshold
          vehicleThresh: 0.5,
          //People and vehicles statistics--people detection threshold
          personThresh: 0.5,
          //Gas Station Detection--Safety Hat Detection Threshold
          helmetthresh: 0.4,
          //Gas Station Detection-Personnel Recognition Threshold
          personthresh: 0.6,
          //Gas Station Detection--Employee Identification Threshold
          staffidentithresh: 0.4,
          //Gas station detection-tank truck threshold
          tanker: 0.4,
          //fire extinguisher threshold
          fireex: 0.4,
          //Oil truck anti-static threshold
          tankerstat: 0.4,
          //Anti-static push interval
          staticeleAlarmInterval: 60,
          //Fire extinguisher push interval
          fireexAlarmInterval: 3600,
          //Illegal parking - congestion alarm time (seconds)
          MaxCount: 10,
          //Remaining object detection--remaining time (seconds)
          DelayTime: 30,
          //Vehicle traveling in the wrong direction--0Vehicle alarm detected  1Rear alarm detected
          type: "1",
          //Retention detection--time (seconds)
          timeOut: "30",
          //Sleeping duty detection--time (seconds)
          sleeptimeOut: "10",
          //Face database list
          faceGroupList: "",
          //Whether to wear a safety helmet 0 No 1 Yes
          anquanmao: "0",
          //Non-employee intrusion detection-personnel inspection threshold
          intrusionPersonThresh: 0.5,
          //Non-employee intrusion detection--Image address on the front of clothes
          intrusionFrontPic: "",
          //Non-employee intrusion detection--Image address on the back of clothes
          intrusionBackPic: "",
          //Multimodal model 0 off 1 on
          mllm: "0",
          //Charging gun detection--car threshold
          carThreshold: 0.6,
          //Charging gun detection-charging gun threshold
          chargingThreshold: 0.6,
          //Vehicle Statistics--Car Threshold
          vehicleCarThresh: 0.6,
          //Vehicle Statistics--Motorcycle Threshold
          vehicleMotorcycleThresh: 0.6,
          //Vehicle statistics--detection frame rate
          vehicleFrameInterval: 200,
          //Mask and earphone detection--earphone threshold
          earphoneThresh: 0.6,
          //Mask earphone detection--mask threshold
          faceMaskThresh: 0.6,
          //Mask and earphone detection--detection frame rate interval (milliseconds)
          maskEarphoneFrameInterval: 1000,
          //University of Hong Kong UWB display--Personnel inspection threshold
          personCheckThreshold: 0.6,
          //University of Hong Kong UWB display--floor id
          floorId: null,
          //University of Hong Kong UWB display--Personnel coordinate distance
          personCoordinateDistance: 500,
          //University of Hong Kong UWB display--coordinate update interval
          coordinateUpdateInterval: 1000,
        },
        sf25: {
          type: "0",
        },
      },
      // Upload URL
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      // Form verification
      rules: {
        taskName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        algorithmType: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],

        status: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        audioStatus: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],

        time1: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        alarmInterval: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        fVal: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
      },

      imgUrl: "",
      drawingStyle: {},
      mode: "",
      itemName: "",
      editId: "", // Pending shape ID
      deleteIconId: "delete01",
      gMap: null, // AILabel instance
      gFirstFeatureLayer: null, // Vector layer instance (rect, polygon etc)
      allFeatures: null, // All features
      //Set the width and height of the cropping area
      map: {
        width: 0,
        height: 0,
      },
      //Face database list
      faceGroupList: [],
      // No.Counter
      sequenceCounter: 1,
    };
  },
  watch: {
    mode(mode) {
      this.gMap.setMode(mode);
      this.setDrawingStyle(mode);
    },
  },

  created() {
    //Get device id
    this.queryParams.deviceId = this.$route.query.deviceId;
    this.getList();
    //Get camera screen image
    getDevice(this.$route.query.deviceId).then((response) => {
      this.imgUrl = "data:image/png;base64," + response.data.imageData;
    });
  },
  computed: {
    uploadHeaders() {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      };
    }
  },
  methods: {
    /** Non-employee intrusion detection - image upload success */
    handleIntrusionUploadSuccess(res, type) {
      if (res.code === 200) {
        if (type === 'front') {
          this.other.options.intrusionFrontPic = res.url;
        } else {
          this.other.options.intrusionBackPic = res.url;
        }
        this.$message.success(this.$t('commonTips.uploadSuccess'));
      } else {
        this.$message.error(res.msg || this.$t('commonTips.uploadFailed'));
      }
    },
    /** Non-employee intrusion detection - image upload validation */
    beforeIntrusionUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        this.$message.error(this.$t('commonTips.pleaseUploadImage'));
        return false;
      }
      if (!isLt5M) {
        this.$message.error(this.$t('commonTips.imageSizeLimit'));
        return false;
      }
      return true;
    },
    //Select algorithm type
    changeAlgorithmType(e) {
      this.$nextTick((res) => {
        this.form.taskName = this.$refs.selectLable.selected.label;
      });
      console.log(e);
      //Face recognition view face library
      if (e == "B7A27D32-5274-A1C3-2DA7-8F827B1C8644") {
        listGroup({ pageNum: 1, pageSize: 1000 }).then((response) => {
          this.faceGroupList = response.data.records;
        });
      }
    },
    /** Query device task list */
    getList() {
      this.loading = true;
      listTask(this.queryParams).then((response) => {
        this.taskList = response.data.records;
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
        deviceId: this.$route.query.deviceId,
        taskId: null,
        taskName: "",
        alarmInterval: 30,
        similarity: 80,
        algorithmType: null,
        analysisJson: null,
        requestJson: null,
        status: "10",
        audioStatus: "20",
        createTime: null,
        updateTime: null,
        createId: null,
        updateId: null,
        createBy: null,
        updateBy: null,
        isDelete: null,
        time1: ["00:00:00", "23:59:59"],
        time2: null,
        time3: null,
        time4: null,
        dimension: [],
        enableRecognitionBox: false,
        frameRate: 4,
      };
      //Other algorithm parameters
      this.other = {
        options: {
          //coordinate
          points: {
            //straight line
            LINE: [],
            //rectangle
            RECT: [],
            //Polygon Default full screen
            POLYGON: [],
            //point
            POINTS: [],
          },
          //Sensitivity
          fVal: 0.5,
          //Fence detection--fence threshold
          fenceThresh: 0.6,
          //Fence detection--person detection threshold
          fencePersonThresh: 0.6,
          //Glove and shoe cover detection-personnel threshold
          glovesPersonThresh: 0.6,
          //Glove and shoe cover detection--glove and shoe cover threshold
          glovesThresh: 0.6,
          //Garbage type
          garbageType: 2,
          //Human detection threshold
          personThreshold: 0.6,
          //Violation of parking time limit
          IllegalParkingTimeout: 0,
          //Type of illegal stop
          IllegalParkingtype: "",
          //type
          facetype: "",
          //faceColor
          faceColors: "0.55",
          //faceWeight
          faceWeights: "0.83",
          //Door status detection--threshold 1
          Threshold1: 0.5,
          //Door status detection--Threshold 2
          Threshold2: 0,
          //Mask detection--0 Alarm for not wearing a mask 1 Alarm for wearing a mask
          types: "0",
          //Mask detection-face color threshold
          faceColor: 0.55,
          //Mask detection--face quality weight
          faceWeight: 0.83,
          //Face recognition (win version)--face quality weight
          faceWeightwin: 7,
          //Face recognition (win version)--face detection interval (milliseconds)
          frameInterval: 400,
          //Mask detection--mask threshold
          maskScore: 0.6,
          //Platform water accumulation detection-water accumulation threshold
          waterThresh: 0.5,
          //Platform water detection--scale threshold
          scaleThresh: 0.5,
          //Motorcycle helmet detection-personnel detection threshold
          mtpersonThresh: 0.6,
          //Motorcycle helmet detection - helmet detection threshold
          helmetThresh: 0.6,
          //Motorcycle helmet detection--motorcycle detection threshold
          motorcycleThresh: 0.6,
          //Thailand License Plate Recognition--Vehicle Detection Threshold
          vehicleThreshs: 0.6,
          //Thailand License Plate Recognition--License Plate Recognition Threshold
          licenseThreshs: 0.6,
          //Person detection threshold
          fValperson: 0.6,
          //Store clerk detection threshold
          fValassistant: 0.6,
          //Guest stay start time
          retentionTime: 60,
          //Start time of conversation between customer and store clerk
          conversationTime: 5,
          //Camera IP
          cameraIP2: "",
          //Area name List (in-store customer detection)
          areaNameList: [],
          //Density detection
          alarmType: null,
          userNum: null,
          //Playing on mobile phone - seconds
          lVal: 4,
          //Illegal refueling - distance between oil barrels and personnel (meters)
          distance: 10,
          //Statistics of people entering stores in Thailand--passing the threshold
          passThresh: 0.6,
          //Statistics of people entering stores in Thailand--store entry threshold
          enterThresh: 0.6,
          //Statistics of people entering stores in Thailand--Camera IP
          cameraIP: "",
          //People and vehicles statistics--Vehicle detection threshold
          vehicleThresh: 0.5,
          //People and vehicles statistics--people detection threshold
          personThresh: 0.5,
          //Gas Station Detection--Safety Hat Detection Threshold
          helmetthresh: 0.4,
          //Gas Station Detection-Personnel Recognition Threshold
          personthresh: 0.6,
          //Gas Station Detection--Employee Identification Threshold
          staffidentithresh: 0.4,
          //Gas station detection-tank truck threshold
          tanker: 0.4,
          //fire extinguisher threshold
          fireex: 0.4,
          //Oil truck anti-static threshold
          tankerstat: 0.4,
          //Anti-static push interval
          staticeleAlarmInterval: 60,
          //Fire extinguisher push interval
          fireexAlarmInterval: 3600,
          //Illegal parking - congestion alarm time (seconds)
          MaxCount: 10,
          //Remaining object detection--remaining time (seconds)
          DelayTime: 30,
          //The vehicle is driving in the wrong direction--0 The alarm is detected at the front of the vehicle 1 The alarm at the rear is detected
          type: "1",
          //Retention detection--time (seconds)
          timeOut: "30",
          //Sleeping duty detection--time (seconds)
          sleeptimeOut: "10",
          //Face database list
          faceGroupList: "",
          //Whether to wear a safety helmet 0 No 1 Yes
          anquanmao: "0",
          //Non-employee intrusion detection-personnel inspection threshold
          intrusionPersonThresh: 0.5,
          //Non-employee intrusion detection--Image address on the front of clothes
          intrusionFrontPic: "",
          //Non-employee intrusion detection--Image address on the back of clothes
          intrusionBackPic: "",
          //Multimodal model 0 off 1 on
          mllm: "0",
          //Charging gun detection--car threshold
          carThreshold: 0.6,
          //Charging gun detection-charging gun threshold
          chargingThreshold: 0.6,
          //Vehicle Statistics--Car Threshold
          vehicleCarThresh: 0.6,
          //Vehicle Statistics--Motorcycle Threshold
          vehicleMotorcycleThresh: 0.6,
          //Vehicle statistics--detection frame rate
          vehicleFrameInterval: 200,
          //Mask and earphone detection--earphone threshold
          earphoneThresh: 0.6,
          //Mask earphone detection--mask threshold
          faceMaskThresh: 0.6,
          //Mask and earphone detection--detection frame rate interval (milliseconds)
          maskEarphoneFrameInterval: 1000,
          //University of Hong Kong UWB display--Personnel inspection threshold
          personCheckThreshold: 0.6,
          //University of Hong Kong UWB display--floor id
          floorId: 2,
          //University of Hong Kong UWB display--Personnel coordinate distance
          personCoordinateDistance: 500,
          //University of Hong Kong UWB display--coordinate update interval
          coordinateUpdateInterval: 1000,
        },
        sf25: {
          type: "0",
        },
      };
      this.resetForm("form");
      // ResetNo. counter
      this.sequenceCounter = 1;
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
    /** Recognition box toggle handler */
    handleRecognitionBoxChange(val) {
      if (!val) {
        this.form.frameRate = null;
      } else {
        this.form.frameRate = 4;
      }
    },
    /** Add handler */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t("task.dialogTitle_a");
    
      
      this.mode = "";
      this.sequenceCounter = 1; // Initialize sequence counter
      this.initMap();
    },
    /** View detail */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTask(id).then((response) => {
        this.form = response.data;
        this.form.dimension = JSON.parse(response.data.dimension);
        this.form.time1 = response.data.time1.split("-");
        // Determine whether to open the recognition frame based on frameRate
        this.$set(this.form, 'enableRecognitionBox', response.data.frameRate != null && response.data.frameRate !== '' && response.data.frameRate !== 0);
        this.open = true;
        this.title = this.$t("commonBtn.edit");
        let teshu = JSON.parse(response.data.analysisJson);
        console.log(teshu);
        //Get the object of array name=sensitivity
        try {
          this.other.options.fVal = teshu[0].abilityterm.find(
            (item) => item.name == "sensitivity"
          ).fVal;
        } catch (error) {
          console.log("No sensitivity");
        }

        //Fill special algorithm special value
        switch (this.form.algorithmType) {
          //Fence detection
          case "9982D74C-BDAC-49E2-BDA0-CB906D28E69A":
            this.other.options.fenceThresh = teshu[0].abilityterm.find(
              (item) => item.name == "fence Threshold"
            )?.fVal;
            this.other.options.fencePersonThresh = teshu[0].abilityterm.find(
              (item) => item.name == "person Threshold"
            )?.fVal;
            break;
          //Glove and shoe cover testing
          case "25BB561D-D154-4F13-A7E6-671DE5C7F134":
            this.other.options.glovesPersonThresh = teshu[0].abilityterm.find(
              (item) => item.name == "person Threshold"
            )?.fVal;
            this.other.options.glovesThresh = teshu[0].abilityterm.find(
              (item) => item.name == "Glove Threshold"
            )?.fVal;
            break;
          //Garbage overflow detection
          case "1f954cb2-b29c-48b9-9a78-8fecf957a515":
            this.other.options.garbageType = teshu[0].abilityterm.find(
              (item) => item.name == "type"
            )?.lVal;
            break;
          //Gesture recognition for playing with mobile phone
          case "D432D747-BDAC-49E2-BDA0-CB906D28E141":
            this.other.options.personThreshold = teshu[0].abilityterm.find(
              (item) => item.name == "person Threshold"
            )?.fVal;
            break;
          //Headgear recognition
          case "9132D74B-BDAC-49E2-BDA0-CB906D28E66E":
            this.other.options.personThreshold = teshu[0].abilityterm.find(
              (item) => item.name == "person Threshold"
            )?.fVal;
            break;
          //Motor vehicle illegal parking identification
          case "DD32D74B-BDAC-49E2-BDA0-CB906D28E14E":
            this.other.options.IllegalParkingTimeout = teshu[0].abilityterm.find(
              (item) => item.name == "IllegalParking Timeout"
            )?.lVal;
            this.other.options.IllegalParkingtype = teshu[0].abilityterm.find(
              (item) => item.name == "type"
            )?.lVal;
            break;
          //Age and gender identification
          case "76B27D32-5274-A1A5-2DA7-8F827B1C8616":
            // this.other.options.facetype = teshu[0].abilityterm.find(
            //   (item) => item.name == "type"
            // )?.lVal;
            this.other.options.faceColors = teshu[0].abilityterm.find(
              (item) => item.name == "faceColor"
            )?.fVal;
            this.other.options.faceWeights = teshu[0].abilityterm.find(
              (item) => item.name == "faceWeight"
            )?.fVal;
            this.other.options.ageGenderAlarmInterval = teshu[0].abilityterm.find(
              (item) => item.name == "AlarmInterval"
            )?.fVal;
            break;
          //Door status detection
          case "65EB561E-EAE4-4F13-A7E6-A11DE5C7D163":
            this.other.options.Threshold1 = teshu[0].abilityterm.find(
              (item) => item.name == "Threshold1"
            )?.fVal;
            this.other.options.Threshold2 = teshu[0].abilityterm.find(
              (item) => item.name == "Threshold2"
            )?.lVal;
            break;
          //Thailand license plate recognition
          case "33BB561E-EAE4-4F13-A7E6-A11DE5C7F167":
            this.other.options.vehicleThreshs = teshu[0].abilityterm.find(
              (item) => item.name == "vehicle Threshold"
            )?.fVal;
            this.other.options.licenseThreshs = teshu[0].abilityterm.find(
              (item) => item.name == "license Threshold"
            )?.fVal;
            break;
          //vehicle statistics
          case "0234CA9A-0200-4FE5-9793-859741E689C3":
            this.other.options.vehicleCarThresh = teshu[0].abilityterm.find(
              (item) => item.name == "car thresh"
            )?.fVal;
            this.other.options.vehicleMotorcycleThresh = teshu[0].abilityterm.find(
              (item) => item.name == "motorcycle thresh"
            )?.fVal;
            this.other.options.vehicleFrameInterval = teshu[0].abilityterm.find(
              (item) => item.name == "FrameInterval"
            )?.lVal;
            break;
          //Mask and earphone detection
          case "27DB5613-D184-4F13-A7E6-671DE5C7F4E6":
            this.other.options.earphoneThresh = teshu[0].abilityterm.find(
              (item) => item.name == "earphoneThresh"
            )?.fVal;
            this.other.options.faceMaskThresh = teshu[0].abilityterm.find(
              (item) => item.name == "faceMaskThresh"
            )?.fVal;
            this.other.options.maskEarphoneFrameInterval = teshu[0].abilityterm.find(
              (item) => item.name == "FrameInterval"
            )?.lVal;
            this.other.options.mllm = String(teshu[0].abilityterm.find(
              (item) => item.name == "MLLM"
            )?.lVal || "0");
            break;
          //Face recognition (win version)
          case "B6A27D32-5274-A1C3-2DA7-8F827B1C8622":
            this.other.options.faceWeightwin = teshu[0].abilityterm.find(
              (item) => item.name == "ExtractionDetect Weight"
            )?.lVal;
            this.other.options.frameInterval = teshu[0].abilityterm.find(
              (item) => item.name == "ExtractionDetect Frame interval"
            )?.lVal;
            break;
          //Mask testing
          case "B6B27D32-5274-A1C3-2DA7-8F827B1C8676":
            this.other.options.types = String(teshu[0].abilityterm.find(
              (item) => item.name == "type"
            )?.lVal || "0");
            this.other.options.faceColor = teshu[0].abilityterm.find(
              (item) => item.name == "faceColor"
            )?.fVal;
            this.other.options.faceWeight = teshu[0].abilityterm.find(
              (item) => item.name == "faceWeight"
            )?.fVal;
            this.other.options.maskScore = teshu[0].abilityterm.find(
              (item) => item.name == "maskScore"
            )?.fVal;
            break;
          //Platform water detection
          case "DAA64F89-9E21-45C9-9FC6-9F4E9C1CB794":
            this.other.options.waterThresh = teshu[0].abilityterm.find(
              (item) => item.name == "Waterlogging thresh"
            )?.fVal;
            this.other.options.scaleThresh = teshu[0].abilityterm.find(
              (item) => item.name == "ScaleDetect thresh"
            )?.fVal;
            break;
          //Motorcycle helmet inspection
          case "7f954cb2-b29c-48b9-9a78-8fecf957a212":
            this.other.options.mtpersonThresh = teshu[0].abilityterm.find(
              (item) => item.name == "personThresh Threshold"
            )?.fVal;
            this.other.options.helmetThresh = teshu[0].abilityterm.find(
              (item) => item.name == "helmetThresh Pattern"
            )?.fVal;
            this.other.options.motorcycleThresh = teshu[0].abilityterm.find(
              (item) => item.name == "motorcycleThresh Pattern"
            )?.fVal;
            break;
          //Statistics of people entering stores in Thailand
          case "374CA9D-0200-4FE5-9793-859741E689D1":
            this.other.options.passThresh = teshu[0].abilityterm.find(
              (item) => item.name == "pass thresh"
            )?.fVal;
            this.other.options.enterThresh = teshu[0].abilityterm.find(
              (item) => item.name == "enter thresh"
            )?.fVal;
            this.other.options.cameraIP = teshu[0].abilityterm.find(
              (item) => item.name == "cameraIP"
            )?.strVal;
            break;
          //In-store customer detection
          case "45BB561E-EA54-4F13-A7E6-A11DE5C75648":
            console.log(teshu[0].abilityterm);
            console.log(
              teshu[0].abilityterm.find(
                (item) => item.name == "person Threshold"
              )?.fVal
            );
            this.other.options.fValperson = teshu[0].abilityterm.find(
              (item) => item.name == "person Threshold"
            )?.fVal;
            this.other.options.fValassistant = teshu[0].abilityterm.find(
              (item) => item.name == "Assistant Threshold"
            )?.fVal;
            this.other.options.retentionTime = teshu[0].abilityterm.find(
              (item) => item.name == "retention time"
            )?.lVal;
            this.other.options.conversationTime = teshu[0].abilityterm.find(
              (item) => item.name == "conversation time"
            )?.lVal;
            this.other.options.cameraIP2 = teshu[0].abilityterm.find(
              (item) => item.name == "camera IP"
            )?.strVal;
            // List of restored area names (obtained from abilityterm of type emVT_POLYGON)
            const polygonTerms = teshu[0].abilityterm.filter(
              (item) => item.type == "emVT_POLYGON" && item.name != "cross" && item.name != "direction"
            );
            this.other.options.areaNameList = polygonTerms.map(term => term.name || "");
            break;
          //Sleeping duty test
          case "E7017EDA-4EFD-493E-97DF-4156ECB39656":
            this.other.options.sleeptimeOut = teshu[0].abilityterm[4].lVal;
            break;
          //Retention detection
          case "6C4483AA-83E1-49AD-B06D-297D267BD80B":
            this.other.options.timeOut = teshu[0].abilityterm[1].lVal;
            break;
          //Vehicle traveling in the wrong direction
          case "0264CA9D-0200-4FE5-9793-859741E689C0":
            this.other.options.type = teshu[0].abilityterm[4].fVal;
            break;
          //legacy
          case "BDDBB500-62F3-4A93-AC9E-11C9CC6EA4BE":
            this.other.options.DelayTime = teshu[0].abilityterm[3].DelayTime;
            break;
          //Off-duty testing
          case "F7581B40-A9F9-498E-A510-14F40009C545":
            //Off-duty time (minutes)
            this.other.options.tuotime = teshu[0].abilityterm[2].lVal;
            break;
          //Density detection
          case "F7581B40-A9F9-498E-A510-14F40010C545":
            //Alarm type
            this.other.options.alarmType = teshu[0].abilityterm[5].lVal;
            //Number of people
            this.other.options.userNum = teshu[0].abilityterm[2].fVal;
            break;
          //Play with mobile phone
          case "28E4800E-01AF-4647-8F9B-966497DBE20B":
            this.other.options.lVal = teshu[0].abilityterm[4].lVal;
            this.other.options.mllm = (teshu[0].abilityterm.find(item => item.name === 'MLLM') || {}).lVal || '0';
            break;
          //Illegal refueling
          case "D2985710-425A-4DC9-AD61-C876FA5F5E9D":
            this.other.options.distance = teshu[0].abilityterm[6].fVal;
            break;
          //Statistics of people and vehicles
          case "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F":
            this.other.options.vehicleThresh = teshu[0].abilityterm[8].fVal;
            this.other.options.personThresh = teshu[0].abilityterm[9].fVal;
            break;
          //  Gas station inspection
          case "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d":
            console.log(teshu[0].abilityterm);
            this.other.options.helmetthresh = teshu[0].abilityterm[8].fVal;
            this.other.options.personthresh = teshu[0].abilityterm[9].fVal;
            this.other.options.staffidentithresh =
              teshu[0].abilityterm[10].fVal;
            this.other.options.tanker = teshu[0].abilityterm[12].fVal;
            this.other.options.fireex = teshu[0].abilityterm[13].fVal;
            this.other.options.tankerstat = teshu[0].abilityterm[14].fVal;
            this.other.options.staticeleAlarmInterval =
              teshu[0].abilityterm[16].fVal;
            this.other.options.fireexAlarmInterval =
              teshu[0].abilityterm[17].fVal;
            break;
          //Illegal parking
          case "ED32D74B-BDAC-49E2-BDA0-CB906D28E14F":
            this.other.options.MaxCount = teshu[0].abilityterm[2].lVal;
            break;
          //helmet
          case "7F954CB2-B29C-48B9-9A78-8FECF957A290":
            this.other.options.anquanmao = teshu[0].abilityterm[2].lVal;
            this.other.options.mllm = (teshu[0].abilityterm.find(item => item.name === 'MLLM') || {}).lVal || '0';
            break;
          //face recognition
          case "B7A27D32-5274-A1C3-2DA7-8F827B1C8644":
            listGroup({ pageNum: 1, pageSize: 1000 }).then((response) => {
              this.faceGroupList = response.data.records;
            });
            this.other.options.faceGroupList =
              teshu[0].abilityterm[5].strVal.split(",");
            console.log(this.other.options.faceGroupList);
            break;
          //Non-employee intrusion detection
          case "8742D74B-BDAC-49E2-BDA0-CB906D28E6E4":
            this.other.options.intrusionPersonThresh = teshu[0].abilityterm.find(
              (item) => item.name == "person Threshold"
            )?.fVal || 0.5;
            this.other.options.intrusionFrontPic = teshu[0].abilityterm.find(
              (item) => item.name == "Front pic path"
            )?.strVal || "";
            this.other.options.intrusionBackPic = teshu[0].abilityterm.find(
              (item) => item.name == "Back pic path"
            )?.strVal || "";
            break;
            //Charging gun detection
          case "DACD8C81-FCDC-47E3-80A9-B648CE558456":
            this.other.options.carThreshold = teshu[0].abilityterm.find(
              (item) => item.name == "car Threshold"
            )?.fVal || "0.6";
            this.other.options.chargingThreshold = teshu[0].abilityterm.find(
              (item) => item.name == "Charging Threshold"
            )?.fVal || "0.6";
            break;
          //University of Hong Kong UWB display
          case "BBEF5D75-26FC-4F3A-B2A3-F1C8B77FC5E1":
            this.other.options.personCheckThreshold = teshu[0].abilityterm.find(
              (item) => item.name == "Threshold"
            )?.fVal;
            this.other.options.floorId = teshu[0].abilityterm.find(
              (item) => item.name == "floorId"
            )?.lVal;
            this.other.options.personCoordinateDistance = teshu[0].abilityterm.find(
              (item) => item.name == "distance"
            )?.lVal;
            this.other.options.coordinateUpdateInterval = teshu[0].abilityterm.find(
              (item) => item.name == "person interval"
            )?.lVal;
            break;
          //Smoking test
          case "118D34A0-4FEB-4906-A622-C7974AB3C637":
          //Pyrotechnic detection
          case "7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5":
          //fall
          case "ADEE06F4-9D5F-44A8-8681-507BBF3CADF8":
          //Knife and gun detection
          case "99BB561E-EA54-4F13-A7E6-A11DE5C7F142":
          //Electric vehicles entering the home
          case "3864E531-F909-4E37-A544-B557A8490D80":
            this.other.options.mllm = (teshu[0].abilityterm.find(item => item.name === 'MLLM') || {}).lVal || '0';
            break;
          default:
            break;
        }

        setTimeout(() => {
          this.initMap();
        }, 500);
      });
    },
    /** Submit handler */
    submitForm() {
      // if (this.form.algorithmType != "25" && this.form.dimension == []) {
      //   that.$message.error(this.$t("task.paintTips1"));
      //   return;
      // }
      // if (this.form.algorithmType == "45" && this.form.dimension.length != 3) {
      //   that.$message.error(this.$t("task.paintTips2"));
      //   return;
      // }
      let that = this;

      //If the drawing is empty, draw the whole picture
      if (that.form.dimension.length == 0) {
        that.form.dimension = [
          {
            type: "POLYGON",
            data: [
              { x: 0, y: 0 },
              { x: 0.5 * that.map.width, y: 0 },
              { x: 1 * that.map.width, y: 0 },
              { x: 1 * that.map.width, y: 0.5 * that.map.height },
              { x: 1 * that.map.width, y: 1 * that.map.height },
              { x: 0.5 * that.map.width, y: 1 * that.map.height },
              { x: 0, y: 1 * that.map.height },
              { x: 0, y: 0.5 * that.map.height },
            ],
          },
        ];
      }

      if (this.form.algorithmType == 'BBEF5D75-26FC-4F3A-B2A3-F1C8B77FC5E1' && this.form.dimension.length != 3) {
        this.$message.error(this.$t("task.paintTips2"));
        return;
      }

      console.log(that.form.dimension);
      //Loop through dimensions
      this.form.dimension.forEach((item) => {
        //point
        if (item.type == "POINT") {
          that.other.options.points.POINTS.push({
            x: String(item.data.x / that.map.width),
            y: String(item.data.y / that.map.height),
          });
        }
        //Lines and polygons
        else if (item.type == "LINE" || item.type == "POLYGON") {
          that.other.options.points[item.type].push(
            item.data.map((item) => {
              return {
                x: item.x / that.map.width,
                y: item.y / that.map.height,
              };
            })
          );
        } else if (item.type == "RECT") {
          //rectangle
          that.other.options.points[item.type].push({
            x: item.data.x / that.map.width,
            y: item.data.y / that.map.height,
            width: item.data.width / that.map.width,
            height: item.data.height / that.map.height,
          });
        }
      });

      // Non-employee intrusion detectionRequired authentication
      if (this.form.algorithmType == "8742D74B-BDAC-49E2-BDA0-CB906D28E6E4") {
        if (!this.other.options.intrusionPersonThresh && this.other.options.intrusionPersonThresh !== 0) {
          this.$message.error(this.$t("task.intrusionPersonThreshRequired"));
          return;
        }
        if (!this.other.options.intrusionFrontPic) {
          this.$message.error(this.$t("task.intrusionFrontPicRequired"));
          return;
        }
        if (!this.other.options.intrusionBackPic) {
          this.$message.error(this.$t("task.intrusionBackPicRequired"));
          return;
        }
      }

      // If the recognition box is closed, frameRate is not transmitted
      if (!this.form.enableRecognitionBox) {
        this.form.frameRate = null;
      }

      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          switch (this.form.algorithmType) {
            //Off-duty testing
            case "F7581B40-A9F9-498E-A510-14F40009C545":
              this.other.options.deviceId = this.$route.query.deviceCode;
              this.form.analysisJson = JSON.stringify(
                getJson(this.form.algorithmType, this.other.options)
              );
              break;
            //Density detection
            case "F7581B40-A9F9-498E-A510-14F40010C545":
              this.other.options.deviceId = this.$route.query.deviceCode;
              this.form.analysisJson = JSON.stringify(
                getJson(this.form.algorithmType, this.other.options)
              );
              break;

            //face recognition
            // case "B7A27D32-5274-A1C3-2DA7-8F827B1C8644":
            //   this.form.analysisJson = JSON.stringify(
            //     getJson(this.form.algorithmType, this.other.options)
            //   );
            //   break;

            default:
              this.form.analysisJson = JSON.stringify(
                getJson(this.form.algorithmType, this.other.options)
              );
              break;
          }
          this.form.dimension = JSON.stringify(this.form.dimension);

          console.log(this.form);
          this.form.time1 = this.form.time1.join("-");
          if (this.form.id != null) {
            let r = await delTask(this.form.id);
          }
          addTask(this.form).then((response) => {
            this.$modal.msgSuccess(this.$t("commonTips.add_s"));
            this.open = false;
            this.getList();
            this.reset();
          });
        }
      });
    },
    /** Delete handler */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("task.confirmRemove", { ids: ids }))
        .then(function () {
          return delTask(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => { });
    },
    setMode(mode) {
      this.mode = mode;
    },
    // Get all features
    getFeatures() {
      this.allFeatures = this.gFirstFeatureLayer.getAllFeatures();
      console.log("--allFeatures--", this.allFeatures);
      console.log(this.allFeatures[0].getPoints);
    },
    // initial style
    setDrawingStyle(mode) {
      let drawingStyle = {};
      switch (mode) {
        //line segment
        case "LINE": {
          this.drawingStyle = {
            strokeStyle: "#cb1c1c",
            lineJoin: "round",
            lineCap: "round",
            lineWidth: 2,
            arrow: false,
          };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }

        //rectangle
        case "RECT": {
          this.drawingStyle = { strokeStyle: "#cb1c1c", lineWidth: 2 };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }
        //Polygon
        case "POLYGON": {
          this.drawingStyle = {
            strokeStyle: "#cb1c1c", // Border color
            fill: true, // Enable fill
            fillStyle: "#FF6666", // Fill color
            globalAlpha: 0.3,
            lineWidth: 2,
            fill: true,
            stroke: true,
          };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }
        //point
        case "POINT": {
          this.drawingStyle = {
            strokeStyle: "#cb1c1c",
            fillStyle: "#FF6666",
            radius: 5,
            lineWidth: 2,
          };
          this.gMap.setDrawingStyle(drawingStyle);
          break;
        }

        default:
          break;
      }
    },

    // Add graphics
    addFeature(data, type, id, sequenceNumber = null) {
      let that = this;
      let drawingStyle = this.drawingStyle;
      let centerPoint = null;
      let x = 0;
      let y = 0;
      //point
      if (type === "POINT") {
        const pointFeature = new AILabel.Feature.Point(
          id, // id
          { ...data }, // shape {x, y}
          { name: id }, // props
          drawingStyle // style
        );
        console.log("Draw point");
        console.log(data);
        that.gFirstFeatureLayer.addFeature(pointFeature);
        x = data.x;
        y = data.y;
      }
      //Wire
      else if (type === "LINE") {
        //

        const scale = that.gMap.getScale();
        const width = drawingStyle.lineWidth / scale;
        const lineFeature = new AILabel.Feature.Line(
          id, // id
          { ...data, width }, // shape
          { name: id }, // props
          drawingStyle // style
        );
        console.log("Draw line");
        console.log(data);
        console.log(that.gMap.getScale());
        console.log(width);
        console.log(width);
        that.gFirstFeatureLayer.addFeature(lineFeature);

        // Calculate the midpoint of the line segment for display No.
        centerPoint = {
          x: (data.start.x + data.end.x) / 2,
          y: (data.start.y + data.end.y) / 2,
        };
        x = data.start.x;
        y = data.start.y;
      }

      //rectangle
      else if (type === "RECT") {
        const rectFeature = new AILabel.Feature.Rect(
          id, // id
          data, // shape
          { name: id }, // props
          drawingStyle // style
        );
        console.log(rectFeature.getPoints());
        that.gFirstFeatureLayer.addFeature(rectFeature);

        // Calculate the center point of the rectangle for display No.
        centerPoint = {
          x: data.x + data.width / 2,
          y: data.y + data.height / 2,
        };
        x = data.x;
        y = data.y;
      }
      //Polygon
      else if (type === "POLYGON") {
        const polygonFeature = new AILabel.Feature.Polygon(
          id, // id
          { points: data }, // shape
          { name: id }, // props
          drawingStyle // style
        );

        that.gFirstFeatureLayer.addFeature(polygonFeature);

        // Calculate polygon center point for display No.
        let sumX = 0,
          sumY = 0;
        data.forEach((point) => {
          sumX += point.x;
          sumY += point.y;
        });
        centerPoint = {
          x: sumX / data.length,
          y: sumY / data.length,
        };
        x = data[0].x;
        y = data[0].y;
      }
      // Insert a No. text, displayed at the center point of the polygon
      if (sequenceNumber !== null) {
        // Shown at first point

        const textId = `text_${id}`;
        // Fixed the problem that the text position does not take effect, ensure that the coordinates passed in are of numerical type and refresh the layer
        const textFeature = new AILabel.Text(
          textId,
          {
            position: {
              x: x,
              y: y,
            },
            text: parseInt(sequenceNumber),
          },
          { name: textId },
          {
            fontSize: 14,
            textBaseline: "middle",
            fontWeight: "bold",
            lineWidth: 2,
            // Make sure the text is centered by setting the anchor point to the center and offsetting it based on the polygon center point
            anchor: "center",
            display: "block",
          }
        );
        that.gFirstFeatureLayer.addFeature(textFeature);
      }

      this.getFeatures();
    },

    // Delete Delete button
    deIcon() {
      this.gMap.markerLayer.removeAllMarkers();
      // Delete all No. related features and text
      const allFeatures = this.gFirstFeatureLayer.getAllFeatures();
      allFeatures.forEach((feature) => {
        if (
          feature.id &&
          (feature.id.startsWith("seq_") ||
            feature.id.startsWith("text_") ||
            feature.id.startsWith("point_text_"))
        ) {
          this.gFirstFeatureLayer.removeFeature(feature);
        }
      });

      // Delete all text objects
      const allTexts = this.gFirstFeatureLayer.getAllTexts
        ? this.gFirstFeatureLayer.getAllTexts()
        : [];
      allTexts.forEach((text) => {
        if (text.id && text.id.startsWith("text_")) {
          this.gFirstFeatureLayer.removeText(text);
        }
      });
    },
    // add event
    addEvent() {
      let that = this;
      let gMap = this.gMap;
      gMap.events.on("drawDone", (type, data) => {
        console.log("--type, data--", type, data);
        gMap.removeLayerById("pons");

        console.log(type);
        console.log(data);
        if (type == "POLYGON" && data.length < 3) {
          that.$message.error(this.$t("task.paintTips3"));
          return;
        }
        if (type == "POLYGON" && data.length > 8) {
          that.$message.error(this.$t("task.paintTips4"));
          return;
        }
        this.itemName = "pons";
        //point
        if (type == "POINT") {
          that.form.dimension.push({
            type: type,
            data: { x: data.x, y: data.y },
          });
        }
        //single line segment
        if (type == "LINE") {
          that.form.dimension.push({
            type: type,
            data: [data.start, data.end],
          });
        }
        //rectangle
        if (type == "RECT") {
          that.form.dimension.push({
            type: type,
            data: data,
          });
        }
        //Polygon
        if (type == "POLYGON") {
          if (data.length < 8) {
            //If it is less than 8 points, calculate the points near the last point and add them until 8 points are reached.
            const xx = data[data.length - 1].x;
            const yy = data[data.length - 1].y;
            const n = 8 - data.length;
            for (let i = 0; i < n; i++) {
              data.push({ x: xx, y: yy + 0.1 * (i + 1) });
            }
          }
          console.log(data);

          that.form.dimension.push({
            type: type,
            data: data,
          });

          // If it is an in-store customer detection algorithm, an Input pops up to allow the user to enter the area name.
          if (that.form.algorithmType == '45BB561E-EA54-4F13-A7E6-A11DE5C75648') {
            that.$prompt(that.$t('task.enterAreaName'), that.$t('commonTips.tips'), {
              confirmButtonText: that.$t('commonBtn.confirm'),
              cancelButtonText: that.$t('commonBtn.cancel'),
              inputPlaceholder: that.$t('task.areaName') + (that.other.options.areaNameList.length + 1),
              inputValue: that.$t('task.areaName') + (that.other.options.areaNameList.length + 1)
            }).then(({ value }) => {
              that.other.options.areaNameList.push(value || that.$t('task.areaName') + (that.other.options.areaNameList.length + 1));
            }).catch(() => {
              // User cancels, using default name
              that.other.options.areaNameList.push(that.$t('task.areaName') + (that.other.options.areaNameList.length + 1));
            });
          }
        }

        that.addFeature(
          data,
          type,
          "pons_" + that.sequenceCounter,
          that.sequenceCounter
        );
        that.sequenceCounter++;
      });
      gMap.events.on("boundsChanged", (data) => {
        console.log("--map boundsChanged--", data);
        return "";
      });
      // double-click to edit Double-click the feature to trigger selection in drawing mode
      gMap.events.on("featureSelected", (feature) => {
        //this.editId = feature.id;
        console.log("--map featureSelected--", feature, "double-click to edit");
        //SetEditfeature
        //gMap.setActiveFeature(feature);
      });
      //Right click is currently only triggered by right click when double-clicking.
      gMap.events.on("featureDeleted", (feature) => {
        if (feature.type == "POINT") {
          // Corresponding feature according to idDelete
          that.gFirstFeatureLayer.removeFeatureById(feature.id);
        }
      });
      // StandaloneBlankCancelEdit
      gMap.events.on("featureUnselected", (e) => {
        console.log("--map featureUnselected--", e);
        // CancelfeatureSelected
        that.editId = "";
        that.deIcon();
        gMap.setActiveFeature(null);
      });
      // Updated
      gMap.events.on("featureUpdated", (feature, shape) => {
        console.log(feature);
        // Updates or moves require resetting the Delete icon.
      });

      // Delete
      gMap.events.on("FeatureDeleted", () => {
        // that.gFirstFeatureLayer.removeFeatureById(that.editId);
      });
    },
    // Obtaining coordinates needs to be added by yourself
    getPoints(feature) {
      switch (feature.type) {
        case "RECT":
          return feature.getPoints();
        case "LINE":
          return [feature.shape.start, feature.shape.end];
        case "POLYLINE":
          return feature.shape.points;
        case "POLYGON":
          return feature.shape.points;
        default:
          return [];
      }
    },
    //fill event
    Fill() {
      let fill = this.gFirstFeatureLayer.getFeatureById(this.editId);

      fill.style.fillStyle = "#FFDAB9";
      fill.style.fill = true;
      //refresh map
      this.gMap.refresh();
    },
    //Reset
    Revoke() {
      this.gMap.destroy();
      this.mode = "";
      this.form.dimension = [];
      this.sequenceCounter = 1; // Reset sequence counter
      // If it is an in-store customer detection algorithm, clear the area name list.
      if (this.form.algorithmType == '45BB561E-EA54-4F13-A7E6-A11DE5C75648') {
        this.other.options.areaNameList = [];
      }
      setTimeout(() => {
        this.initMap();
      }, 1000);

      // console.log("undo");
      // this.getFeatures();
      // this.allFeatures.pop();
      // this.gMap.removeAllLayers();
      // //Refresh map
      // this.gMap.refresh();
      // console.log(this.allFeatures, "--all operations--");
    },

    initMap() {
      //Get Image width and height
      let img = new Image();
      img.src = this.imgUrl; // Load camera image
      //this.form.dimension = [];
      img.onload = () => {
        console.log(img.width, img.height);
        if (img.width > 1900) {
          img.width = img.width / 4;
          img.height = img.height / 4;
        } else if (img.width > 760) {
          img.width = img.width / 2;
          img.height = img.height / 2;
        }

        // this.imgWidth = img.width;
        // this.imgHeight = img.height;

        console.log(img.width + "_" + img.height);
        this.map.width = img.width;
        this.map.height = img.height;
        let that = this;
        const gMap = new AILabel.Map("map", {
          center: { x: img.width / 2, y: img.height / 2 }, // Center image
          zoom: img.width,
          size: { width: img.width, height: img.height },
          mode: "BAN", // Draw line segment
          refreshDelayWhenZooming: true, // Refresh delay when zooming for better performance
          zoomWhenDrawing: false,
          panWhenDrawing: false,
          zoomWheelRatio: 5, // Zoom wheel ratio [0, 10), smaller = faster zoom
          withHotKeys: true, // Enable hotkeys
        });
        that.gMap = gMap;
        this.addEvent();
        // LoadImage
        const gFirstImageLayer = new AILabel.Layer.Image(
          "first-layer-image", // id
          {
            src: that.imgUrl,
            width: img.width,
            height: img.height,
            crossOrigin: false, // Set true for cross-origin images
            position: {
              // Offset of upper left corner relative to center point
              x: 0,
              y: 0,
            },
          },
          { name: "First image layer" }, // props
          { zIndex: 5 } //
        );
        // Add to gMap object
        gMap.addLayer(gFirstImageLayer);
        // Add vector layer
        const gFirstFeatureLayer = new AILabel.Layer.Feature(
          "first-layer-feature", // id
          { name: "First vector layer" }, // props
          { zIndex: 10 } // style
        );
        this.gFirstFeatureLayer = gFirstFeatureLayer;
        gMap.addLayer(gFirstFeatureLayer);

        if (this.title == this.$t("commonBtn.edit")) {
          that.initbiaozhu();
        }
        window.onresize = function () {
          this.gMap && this.gMap.resize();
        };
      };
    },
    //Echo annotations when viewing details
    initbiaozhu() {
      this.drawingStyle = {
        strokeStyle: "#cb1c1c", // Border color
        fill: true, // Enable fill
        fillStyle: "#FF6666", // Fill color
        globalAlpha: 0.3,
        lineWidth: 2,
        fill: true,
        stroke: true,
        textAlign: "center",
      };
      this.gMap.setDrawingStyle(this.drawingStyle);

      let that = this;
      console.log("this.form.dimension");
      console.log(this.form.dimension);

      for (let i = 0; i < this.form.dimension.length; i++) {
        let da = {};
        if (this.form.dimension[i].type == "LINE") {
          da = {
            start: this.form.dimension[i].data[0],
            end: this.form.dimension[i].data[1],
          };
        } else {
          da = this.form.dimension[i].data;
        }

        // Add No., starting from 1
        this.addFeature(da, this.form.dimension[i].type, "pons_" + i, i + 1);
      }

      // Set next No. counter
      this.sequenceCounter = this.form.dimension.length + 1;
    },
  },

  mounted() { },
  beforeDestroy() {
    this.gMap.destroy();
  },
};
</script>

<style>
.main {
  display: flex;
  flex-direction: column;
  margin: 0 auto 20px;
  justify-content: center;
}

/* Input with unit */
.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-unit .el-input {
  flex: 1;
}

.unit-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  background: #f0f2f5;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

.button-wrap {
  padding-bottom: 10px;
  position: relative;
  z-index: 99;
}

#map {
  /* margin: 0 auto; */
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  border: 1px dashed #ccc;
}

.zoom-icon-wrapper {
  position: absolute;
  /* left: 20px; */
  /* top: 20px; */
  z-index: 1000;
}

.zoom-icon-plus {
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-plus:hover {
  border-color: #4169e1;
}

.zoom-icon-minus {
  margin-top: 6px;
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 25px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-minus:hover {
  border-color: #4169e1;
}

/* Delete icon */
#delete01 {
  width: 20px;
  height: 20px;
}

/* Non-employee intrusion detection image upload */
.intrusion-uploader {
  display: inline-block;
}
.intrusion-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.intrusion-uploader .el-upload:hover {
  border-color: #409EFF;
}
.intrusion-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.intrusion-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
