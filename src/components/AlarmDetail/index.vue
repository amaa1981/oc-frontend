<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="900px"
    custom-class="alarm-detail-dialog"
    append-to-body
    :destroy-on-close="true"
    @close="handleClose"
  >
    <div slot="title" class="alarm-detail-header">
      <div>
        <div class="alarm-detail-title">{{ $t('alarmMap.alarmDetail') }}</div>
        <div class="alarm-detail-subtitle" v-if="form.id">ID: #{{ form.id }}</div>
      </div>
    </div>

    <div class="alarm-detail-body">
      <!-- 左侧：图片/视频 + Automated Findings -->
      <div class="alarm-detail-left">
        <!-- 媒体区域 -->
        <div class="alarm-media">
          <video
            v-if="form.videoUrl"
            controls
            autoplay
            loop
            class="alarm-video"
            :src="form.videoUrl"
          />
          <image-preview
            v-else
            :src="form.imageUrl"
            class="alarm-image"
            width="100%"
            :height="320"
          />
        </div>

        <!-- 特殊识别结果区域 -->
        <div class="alarm-findings" v-if="hasFindings">
          <div class="findings-header">
            <i class="el-icon-data-analysis" />
            <span>{{ $t('record.ppeResult') }}</span>
          </div>

          <!-- 车牌 -->
          <div class="finding-item" v-if="form.eventTypeId == 'BED2D84A-BDAC-49E2-BDA0-AB909D26E11F'
            || form.eventTypeId == '33BB561E-EAE4-4F13-A7E6-A11DE5C7F167'">
            <span class="finding-label">{{ $t('record.plate') }}</span>
            <span class="finding-value">
              <template v-if="strRes.licensePlates && strRes.licensePlates.length">
                <el-tag v-for="(p, i) in strRes.licensePlates" :key="i" size="small" style="margin-right:6px;margin-bottom:4px">
                  {{ form.eventTypeId == '33BB561E-EAE4-4F13-A7E6-A11DE5C7F167' ? p.number : p.number }}
                </el-tag>
              </template>
              <template v-else>{{ form.strRes }}</template>
            </span>
          </div>

          <!-- 车辆统计 -->
          <div class="finding-item" v-if="form.eventTypeId == '0234CA9A-0200-4FE5-9793-859741E689C3'">
            <span class="finding-label">{{ $t('record.vehicleCount') }}</span>
            <span class="finding-value">
              <template v-if="vehicleCountList && vehicleCountList.length">
                <el-tag
                  v-for="(item, i) in vehicleCountList"
                  :key="i"
                  :type="item.type === 1 ? 'primary' : 'success'"
                  size="small"
                  style="margin-right:6px;margin-bottom:4px"
                >{{ item.typeText }}: {{ item.count }}</el-tag>
              </template>
              <span v-else>{{ $t('record.noData') }}</span>
            </span>
          </div>

          <!-- 密度检测 -->
          <div class="finding-item" v-if="form.eventTypeId == 'F7581B40-A9F9-498E-A510-14F40010C545'">
            <span class="finding-label">{{ $t('record.peoplenum') }}</span>
            <span class="finding-value">{{ form.strRes }}</span>
          </div>

          <!-- 违规停车 -->
          <div class="finding-item" v-if="form.eventTypeId == 'ED32D74B-BDAC-49E2-BDA0-CB906D28E14F'">
            <span class="finding-label">{{ $t('record.busnum') }}</span>
            <span class="finding-value">{{ form.strRes }}</span>
          </div>

          <!-- 摩托车安全帽 -->
          <div class="finding-item" v-if="form.eventTypeId == '7f954cb2-b29c-48b9-9a78-8fecf957a212'">
            <span class="finding-label">{{ $t('record.helmetnum') }}</span>
            <span class="finding-value">{{ form.strRes }}</span>
          </div>

          <!-- 人脸识别 -->
          <template v-if="form.eventTypeId == 'B7A27D32-5274-A1C3-2DA7-8F827B1C8644'">
            <div class="finding-item">
              <span class="finding-label">{{ $t('record.name') }}</span>
              <span class="finding-value">{{ strRes.peopleName }}</span>
            </div>
            <div class="finding-item">
              <span class="finding-label">{{ $t('record.originalDrawing') }}</span>
              <image-preview :src="IP + strRes.image" :width="120" :height="90" />
            </div>
          </template>

          <!-- 门状态 -->
          <div class="finding-item" v-if="form.eventTypeId == '65EB561E-EAE4-4F13-A7E6-A11DE5C7D163'">
            <span class="finding-label">{{ $t('record.doorStatus') }}</span>
            <span class="finding-value">{{ form.strRes }}</span>
          </div>

          <!-- 年龄性别 -->
          <div class="finding-item" v-if="form.eventTypeId == '76B27D32-5274-A1A5-2DA7-8F827B1C8616'">
            <span class="finding-label">{{ $t('record.ageGenderResult') }}</span>
            <span class="finding-value">
              <template v-if="ageGenderList && ageGenderList.length">
                <el-tag
                  v-for="(item, i) in ageGenderList"
                  :key="i"
                  :type="item.gender === 1 ? 'primary' : 'danger'"
                  size="small"
                  style="margin-right:6px;margin-bottom:4px"
                >{{ item.genderText }} / {{ item.ageText }}</el-tag>
              </template>
              <span v-else>{{ $t('record.noData') }}</span>
            </span>
          </div>

          <!-- 烟火检测 -->
          <div class="finding-item" v-if="form.eventTypeId == '7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5'">
            <span class="finding-label">{{ $t('record.smokeFireResult') }}</span>
            <span class="finding-value">
              <template v-if="smokeFireList && smokeFireList.length">
                <el-tag
                  v-for="(item, i) in smokeFireList"
                  :key="i"
                  :type="item.value === '1' ? 'danger' : 'warning'"
                  size="small"
                  style="margin-right:6px"
                >{{ item.text }}</el-tag>
              </template>
              <span v-else>{{ $t('record.noData') }}</span>
            </span>
          </div>

          <!-- 跌倒检测 -->
          <div class="finding-item" v-if="form.eventTypeId == 'ADEE06F4-9D5F-44A8-8681-507BBF3CADF8'">
            <span class="finding-label">{{ $t('record.fallDetectResult') }}</span>
            <span class="finding-value">
              <template v-if="fallDetectList && fallDetectList.length">
                <el-tag
                  v-for="(item, i) in fallDetectList"
                  :key="i"
                  :type="item.value === '1' ? 'primary' : 'success'"
                  size="small"
                  style="margin-right:6px"
                >{{ item.text }}</el-tag>
              </template>
              <span v-else>{{ $t('record.noData') }}</span>
            </span>
          </div>

          <!-- PPE 手套头套口罩 -->
          <div class="finding-item ppe-finding" v-if="form.eventTypeId == '27BB5613-D184-4F13-A7E6-671DE5C7F434'">
            <template v-if="ppeList && ppeList.length">
              <div class="ppe-scroll">
                <div class="ppe-row" v-for="(item, i) in ppeList" :key="i">
                  <span class="ppe-id">#{{ item.id }}</span>
                  <span class="ppe-badge" :class="item.gloves ? 'detected' : 'missing'">
                    <i :class="item.gloves ? 'el-icon-check' : 'el-icon-close'" />
                    {{ $t('record.gloves') }}
                  </span>
                  <span class="ppe-badge" :class="item.mask ? 'detected' : 'missing'">
                    <i :class="item.mask ? 'el-icon-check' : 'el-icon-close'" />
                    {{ $t('record.mask') }}
                  </span>
                  <span class="ppe-badge" :class="item.hood ? 'detected' : 'missing'">
                    <i :class="item.hood ? 'el-icon-check' : 'el-icon-close'" />
                    {{ $t('record.hood') }}
                  </span>
                </div>
              </div>
            </template>
            <span v-else>{{ $t('record.noData') }}</span>
          </div>

          <!-- 口罩耳机检测 -->
          <div class="finding-item" v-if="form.eventTypeId == '27DB5613-D184-4F13-A7E6-671DE5C7F4E6'">
            <span class="finding-label">{{ $t('record.maskEarphoneResult') }}</span>
            <span class="finding-value">
              <template v-if="maskEarphoneList && maskEarphoneList.length">
                <el-tag
                  v-for="(item, i) in maskEarphoneList"
                  :key="i"
                  type="danger"
                  size="small"
                  style="margin-right:6px;margin-bottom:4px"
                >{{ item.text }}</el-tag>
              </template>
              <span v-else>{{ $t('record.noData') }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧：信息卡片 -->
      <div class="alarm-detail-right">
        <!-- Incident Overview 卡片 -->
        <div class="info-card">
          <div class="info-card-title">
            <i class="el-icon-date" />
            {{ $t('alarmMap.alarmDetail') }}
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('alarmMap.sendTime') }}</span>
            <span class="info-value">{{ form.sendTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('alarmMap.eventTypeId') }}</span>
            <span class="info-value">
              <span class="algo-tag">
                <i class="el-icon-cpu" />
                {{ $t('dict.v1_alarm_type.' + form.eventTypeId) }}
              </span>
            </span>
          </div>
             <div class="info-row">
            <span class="info-label">{{ $t('alarmMap.taskName') }}</span>
            <span class="info-value">{{ form.taskName }}</span>
          </div>
        </div>

        <!-- Device Context 卡片 -->
        <div class="info-card">
          <div class="info-card-title">
            <i class="el-icon-video-camera" />
            {{ $t('alarmMap.equipmentName') }}
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('alarmMap.equipmentName') }}</span>
            <span class="info-value strong">{{ form.equipmentName }}</span>
          </div>
       
      
          <div class="info-row" v-if="form.installationArea">
            <span class="info-label">{{ $t('record.installationArea') }}</span>
            <span class="info-value">{{ form.installationArea }}</span>
          </div>
        </div>

        <!-- 备注卡片 -->
        <div class="info-card remarks-card" v-if="form.status == 0">
          <div class="info-card-title">
            <i class="el-icon-edit-outline" />
            {{ $t('record.remarks') }}
          </div>
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="3"
            :placeholder="$t('commonTips.pleaseEnter')"
            class="remarks-input"
          />
        </div>

        <!-- 已处理备注只读 -->
        <div class="info-card protocol-card" v-if="form.status != 0 && form.remarks">
          <div class="info-card-title">
            <i class="el-icon-warning-outline" />
            {{ $t('record.remarks') }}
          </div>
          <p class="protocol-text">{{ form.remarks }}</p>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="alarm-detail-footer">
      <el-button class="btn-cancel" @click="handleCancel">
        {{ $t('commonBtn.cancel') }}
      </el-button>
      <template v-if="form.status == 0">
        <el-button class="btn-false-alarm" @click="handleMisstatement">
          <i class="el-icon-warning" />
          {{ $t('alarmMap.misstatement') }}
        </el-button>
        <el-button class="btn-resolve" @click="handleSubmit">
          <i class="el-icon-circle-check" />
          {{ $t('record.handle') }}
        </el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { updateRecord } from "@/api/system/record";

export default {
  name: "AlarmDetail",
  dicts: ["v1_alarm_type"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    alarmData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      IP: "http://" + window.location.hostname,
      dialogVisible: false,
      form: {},
      strRes: {},
      ageGenderList: [],
      ppeList: [],
      stickyBoardList: [],
      smokeFireList: [],
      fallDetectList: [],
      vehicleCountList: [],
      maskEarphoneList: [],
      thaiCharMap: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ก", "ข", "ค", "ฃ", "ฆ", "ง", "จ", "ฉ", "ช", "ฌ", "ญ", "ฎ", "ฐ", "ฒ", "ณ", "ด", "ต", "ถ", "ท", "ธ", "น", "บ", "ผ", "พ", "ฟ", "ภ", "ม", "ย", "ร", "ล", "ว", "ศ", "ษ", "ส", "ห", "ฬ", "อ", "ฮ", "อำนาจเจริญ", "อ่างทอง", "พระนครศรีอยุธยา", "กรุงเทพมหานคร", "บึงกาฬ", "บุรีรัมย์", "บางที", "ชลบุรี", "ฉะเชิงเทรา", "เชียงใหม่", "เชียงราย", "ชัยภูมิ", "ชุมพร", "เชียงราย", "จันทบุรี", "กระบี่", "ขอนแก่น", "กำแพงเพชร", "กาญจนบุรี", "กาฬสินธุ์", "เลย", "ลำปาง", "ลำพูน", "ลพบุรี", "มหาสารคาม", "แม่ฮ่องสอน", "แม่สอด", "น่าน", "นนทบุรี", "นครปฐม", "นครศรีธรรมราช", "นครสวรรค์", "นครพนม", "นครปฐม", "หนองคาย", "นครศรีธรรมราช", "หนองคาย", "เพชรบุรี", "เพชรบูรณ์", "ประจวบคีรีขันธ์", "ภูเก็ต", "พัทลุง", "พิษณุโลก", "พังงา", "ปัตตานี", "แพร่", "ปราจีนบุรี", "ปทุมธานี", "ปัตตานี", "พะเยา", "ราชบุรี", "ร้อยเอ็ด", "ระนอง", "ระยอง", "สิงห์บุรี", "สงขลา", "สมุทรสงคราม", "สมุทรสาคร", "สมุทรปราการ", "สระแก้ว", "สระบุรี", "สุพรรณบุรี", "สมุทรปราการ", "ศรีสะเกษ", "สุรินทร์", "ศรีสะเกษ", "สตูล", "ตาก", "ตรัง", "ตราด", "อุบลราชธานี", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "ยะลา", "ยโสธร"],
    }
  },
  computed: {
    hasFindings() {
      const ids = [
        '7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5',
        'ADEE06F4-9D5F-44A8-8681-507BBF3CADF8',
        'BED2D84A-BDAC-49E2-BDA0-AB909D26E11F',
        '33BB561E-EAE4-4F13-A7E6-A11DE5C7F167',
        '0234CA9A-0200-4FE5-9793-859741E689C3',
        'F7581B40-A9F9-498E-A510-14F40010C545',
        'ED32D74B-BDAC-49E2-BDA0-CB906D28E14F',
        '7f954cb2-b29c-48b9-9a78-8fecf957a212',
        'B7A27D32-5274-A1C3-2DA7-8F827B1C8644',
        '65EB561E-EAE4-4F13-A7E6-A11DE5C7D163',
        '76B27D32-5274-A1A5-2DA7-8F827B1C8616',
        '27BB5613-D184-4F13-A7E6-671DE5C7F434',
        '27DB5613-D184-4F13-A7E6-671DE5C7F4E6',
      ]
      return ids.includes(this.form.eventTypeId)
    },
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    alarmData: {
      handler(val) {
        if (val && Object.keys(val).length > 0) {
          this.form = { ...val }
          if (val.imageData && !val.imageUrl) {
            this.form.imageUrl = "data:image/jpeg;base64," + val.imageData;
          }
          if (this.form.eventTypeId == "B7A27D32-5274-A1C3-2DA7-8F827B1C8644") {
            try { this.strRes = JSON.parse(this.form.strRes) } catch (e) { this.strRes = {} }
          }
          if (this.form.eventTypeId == "33BB561E-EAE4-4F13-A7E6-A11DE5C7F167") {
            try { this.strRes = JSON.parse(this.form.strRes) } catch (e) { this.strRes = {} }
          }
          if (this.form.eventTypeId == "76B27D32-5274-A1A5-2DA7-8F827B1C8616") {
            this.parseAgeGenderData()
          }
          if (this.form.eventTypeId == "27BB5613-D184-4F13-A7E6-671DE5C7F434") {
            this.parsePpeData()
          }
          if (this.form.eventTypeId == "8ACD8C8C-FCDC-47E3-80A9-B648CE558661") {
            this.parseStickyBoardData()
          }
          if (this.form.eventTypeId == "7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5") {
            this.parseSmokeFireData()
          }
          if (this.form.eventTypeId == "ADEE06F4-9D5F-44A8-8681-507BBF3CADF8") {
            this.parseFallDetectData()
          }
          if (this.form.eventTypeId == "0234CA9A-0200-4FE5-9793-859741E689C3") {
            this.parseVehicleCountData()
          }
          if (this.form.eventTypeId == "27DB5613-D184-4F13-A7E6-671DE5C7F4E6") {
            this.parseMaskEarphoneData()
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      if (!this.form.remarks) {
        this.$modal.msgError(this.$t('commonTips.pleaseSelect') + this.$t('record.remarks'))
        return
      }
      this.form.status = 1
      this.form.operateTime = new Date().getTime()
      updateRecord(this.form).then(() => {
        this.$modal.msgSuccess(this.$t('commonTips.edit_s'))
        this.handleClose()
        this.$emit('refresh')
      })
    },
    handleMisstatement() {
      this.form.status = 2
      this.form.operateTime = new Date().getTime()
      updateRecord(this.form).then(() => {
        this.$modal.msgSuccess(this.$t("commonTips.operate_s"))
        this.handleClose()
        this.$emit("refresh")
      })
    },
    handleCancel() {
      this.handleClose()
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit("update:visible", false)
      this.$emit("close")
    },
    parseAgeGenderData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.ageGenderList = data.rectList.map((item) => {
            const parts = (item.value || "").split("-")
            const gender = parseInt(parts[0]) || 0
            const age = parseInt(parts[1]) || 0
            const genderText = gender == 1 ? this.$t('record.male') : this.$t('record.female')
            const ageMap = { 0: '0-20', 1: '21-45', 2: '45-60' }
            return { gender, genderText, ageText: ageMap[age] || this.$t('record.unknown') }
          })
        } else {
          this.ageGenderList = []
        }
      } catch (e) { this.ageGenderList = [] }
    },
    parsePpeData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.ppeList = data.rectList.map((item) => {
            const parts = (item.value || "").split("-")
            return {
              id: item.id,
              gloves: parseInt(parts[0]) === 1,
              mask: parseInt(parts[1]) === 1,
              hood: parseInt(parts[2]) === 1,
            }
          })
        } else {
          this.ppeList = []
        }
      } catch (e) { this.ppeList = [] }
    },
    parseStickyBoardData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.stickyBoardList = data.rectList.map((item) => {
            const gender = parseInt(item.value) || 0
            const genderText = gender === 1 ? this.$t('record.male') : this.$t('record.female')
            const ageMap = { 0: this.$t('record.child'), 1: this.$t('record.adult'), 2: this.$t('record.elderly') }
            return { gender, genderText, ageText: ageMap[gender] || this.$t('record.unknown') }
          })
        } else {
          this.stickyBoardList = []
        }
      } catch (e) { this.stickyBoardList = [] }
    },
    parseSmokeFireData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.smokeFireList = data.rectList.map((item) => {
            const value = item.value || ''
            let text = this.$t('record.unknown')
            if (value === '1') text = this.$t('record.fire')
            else if (value === '2') text = this.$t('record.smoke')
            return { value, text }
          })
        } else {
          this.smokeFireList = []
        }
      } catch (e) { this.smokeFireList = [] }
    },
    parseFallDetectData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.fallDetectList = data.rectList.map((item) => {
            const value = item.value || ''
            let text = this.$t('record.unknown')
            if (value === '0') text = this.$t('record.customer')
            else if (value === '1') text = this.$t('record.staff')
            return { value, text }
          })
        } else {
          this.fallDetectList = []
        }
      } catch (e) { this.fallDetectList = [] }
    },
    parseThaiPlate(numberStr) {
      if (!numberStr || typeof numberStr !== 'string') return ''
      try {
        const indices = numberStr.split('-').map(idx => parseInt(idx))
        return indices.map(idx => {
          if (idx >= 0 && idx < this.thaiCharMap.length) {
            return this.thaiCharMap[idx]
          }
          return ''
        }).join('')
      } catch (e) {
        return numberStr
      }
    },
    parseVehicleCountData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.vehicleCountList = data.rectList.map((item) => {
            const type = parseInt(item.type) || 0
            const count = parseInt(item.count) || 0
            let typeText = this.$t('record.unknown')
            if (type === 1) typeText = this.$t('record.car')
            else if (type === 2) typeText = this.$t('record.motorcycle')
            return { type, count, typeText }
          })
        } else {
          this.vehicleCountList = []
        }
      } catch (e) { this.vehicleCountList = [] }
    },
    parseMaskEarphoneData() {
      try {
        const data = JSON.parse(this.form.strRes)
        if (data.rectList && Array.isArray(data.rectList)) {
          this.maskEarphoneList = data.rectList.map((item) => {
            const value = String(item.value || '')
            let text = this.$t('record.unknown')
            if (value === '1') text = this.$t('record.noMask')
            else if (value === '2') text = this.$t('record.noEarphone')
            return { value, text }
          })
        } else {
          this.maskEarphoneList = []
        }
      } catch (e) { this.maskEarphoneList = [] }
    },
  },
}
</script>

<style lang="scss">
.alarm-detail-dialog {
  border-radius: 16px !important;
  overflow: hidden;

  .el-dialog__header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f0f2f5;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f2f5;
  }
}
</style>

<style lang="scss" scoped>
// 标题区
.alarm-detail-header {
  .alarm-detail-title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    line-height: 1.4;
  }
  .alarm-detail-subtitle {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 2px;
  }
}

// 主体两栏布局
.alarm-detail-body {
  display: flex;
  gap: 0;
  min-height: 400px;
}

// 左侧
.alarm-detail-left {
  flex: 1;
  padding: 20px;
  border-right: 1px solid #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alarm-media {
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  .alarm-video,
  ::v-deep .el-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    display: block;
  }
}

// Findings 区域
.alarm-findings {
  background: #fff;
  border: 1px solid #f0f2f5;
  border-radius: 12px;
  padding: 14px 16px;

  .findings-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;

    i { color: #29908d; font-size: 16px; }
  }

  .finding-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child { border-bottom: none; }

    .finding-label {
      font-size: 12px;
      color: #9ca3af;
      min-width: 80px;
      padding-top: 2px;
    }

    .finding-value {
      font-size: 13px;
      color: #111827;
      font-weight: 500;
      flex: 1;
    }
  }

  // PPE 行
  .ppe-scroll {
    max-height: 160px;
    overflow-y: auto;
    border: 1px solid #f0f2f5;
    border-radius: 8px;
    padding: 4px 0;
    width: 100%;
  }

  .ppe-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-bottom: 1px solid #f3f4f6;

    &:last-child { border-bottom: none; }

    .ppe-id {
      font-size: 12px;
      color: #9ca3af;
      min-width: 28px;
    }
  }

  .ppe-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;

    &.detected {
      background: #e6faf4;
      color: #0abf8a;
      border: 1px solid #b3edd9;
    }

    &.missing {
      background: #fef2f2;
      color: #f05252;
      border: 1px solid #fecaca;
    }
  }
}

// 右侧
.alarm-detail-right {
  width: 260px;
  flex-shrink: 0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafbfc;
}

// 信息卡片
.info-card {
  background: #fff;
  border: 1px solid #f0f2f5;
  border-radius: 12px;
  padding: 14px 16px;

  .info-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 12px;

    i { color: #29908d; font-size: 15px; }
  }

  .info-row {
    margin-bottom: 10px;

    &:last-child { margin-bottom: 0; }

    .info-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }

    .info-value {
      font-size: 13px;
      color: #111827;

      &.strong { font-weight: 600; }
    }
  }

  // 算法类型标签
  .algo-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #eff6ff;
    color: #3b82f6;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 500;

    i { font-size: 12px; }
  }
}

// 备注卡片
.remarks-card {
  ::v-deep .remarks-input .el-textarea__inner {
    border-radius: 8px;
    border-color: #e5e7eb;
    font-size: 13px;
    resize: none;

    &:focus {
      border-color: #29908d;
      box-shadow: 0 0 0 2px rgba(41, 144, 141, 0.1);
    }
  }
}

// Protocol 深色卡片
.protocol-card {
  background: #1e2d3d !important;
  border-color: #1e2d3d !important;

  .info-card-title {
    color: #fff !important;
    i { color: #f59e0b !important; }
  }

  .protocol-text {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }
}

// 底部按钮
.alarm-detail-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;

  .btn-cancel {
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    color: #374151;
    background: #fff;
    padding: 9px 20px;
    font-size: 14px;
    font-weight: 500;

    &:hover { border-color: #9ca3af; }
  }

  .btn-false-alarm {
    border-radius: 10px;
    border: 1px solid #fecaca;
    color: #f05252;
    background: #fef2f2;
    padding: 9px 20px;
    font-size: 14px;
    font-weight: 500;

    i { margin-right: 4px; }

    &:hover { background: #fee2e2; border-color: #f05252; }
  }

  .btn-resolve {
    border-radius: 10px;
    border: none;
    background: linear-gradient(270deg, #0f6a71 0%, #29908d 100%);
    box-shadow: 0 0 0 1px #41ad95;
    color: #fff;
    padding: 9px 20px;
    font-size: 14px;
    font-weight: 500;

    i { margin-right: 4px; }

    &:hover { background: linear-gradient(270deg, #0a5a60 0%, #1f7a77 100%); }
  }
}
</style>
