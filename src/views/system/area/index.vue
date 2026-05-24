<template>
  <div class="app-container">
    <div class="area-toolbar mb8">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        v-hasPermi="['system:area:add']"
      >{{ $t('commonBtn.add') }}</el-button>
      <el-button
        type="danger"
        plain
        icon="el-icon-delete"
        size="mini"
        :disabled="multiple"
        @click="handleDelete"
        v-hasPermi="['system:area:remove']"
      >{{ $t('commonBtn.remove') }}</el-button>
    </div>

    <div v-loading="loading" class="area-grid">
      <div
        v-for="item in dataList"
        :key="item.dictCode"
        class="area-card"
        :class="{ selected: ids.includes(item.dictCode) }"
        @click="toggleSelect(item)"
      >
        <!-- Card header -->
        <div class="area-card__top">
          <div class="area-card__icon">
            <i class="el-icon-location-outline" />
          </div>
          <div class="area-card__select">
            <el-checkbox
              :value="ids.includes(item.dictCode)"
              @change="toggleSelect(item)"
              @click.native.stop
            />
          </div>
          <div class="area-card__name-block">
            <div class="area-card__name">{{ item.dictLabel }}</div>
            <div class="area-card__type">{{ $t('deviceArea.dictLabel') }}</div>
          </div>
        </div>

        <div class="area-card__divider" />

        <!-- Info rows -->
        <div class="area-card__info">
          <div class="area-card__row">
            <span class="area-card__row-label"><i class="el-icon-hash" /> {{ $t('deviceArea.dictCode') }}</span>
            <span class="area-card__row-value">{{ item.dictCode }}</span>
          </div>
          <div class="area-card__row">
            <span class="area-card__row-label"><i class="el-icon-sort" /> {{ $t('deviceArea.dictSort') }}</span>
            <span class="area-card__row-value">{{ item.dictSort }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="area-card__actions">
          <el-button
            size="mini"
            class="btn-edit"
            icon="el-icon-edit"
            @click.stop="handleUpdate(item)"
            v-hasPermi="['system:area:edit']"
          >{{ $t('commonBtn.edit') }}</el-button>
          <el-button
            size="mini"
            class="btn-remove"
            icon="el-icon-delete"
            @click.stop="handleDelete(item)"
            v-hasPermi="['system:area:remove']"
          >{{ $t('commonBtn.remove') }}</el-button>
        </div>
      </div>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('deviceArea.dictLabel')" prop="dictLabel">
          <el-input v-model="form.dictLabel" :placeholder="$t('commonTips.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('dictInfo.dictSort')" prop="dictSort">
          <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
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
import {
  listArea,
  getArea,
  delArea,
  addArea,
  updateArea
} from '@/api/system/area'

export default {
  name: 'DeviceArea',
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      dataList: [],
      title: '',
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 12
      },
      form: {},
      rules: {
        dictLabel: [{ required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: 'blur' }],
        dictSort: [{ required: true, message: this.$t('commonTips.cannotBeEmpty'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listArea(this.queryParams).then(response => {
        this.dataList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    toggleSelect(item) {
      const idx = this.ids.indexOf(item.dictCode)
      if (idx === -1) {
        this.ids.push(item.dictCode)
      } else {
        this.ids.splice(idx, 1)
      }
      this.single = this.ids.length !== 1
      this.multiple = !this.ids.length
    },
    cancel() {
      this.open = false
      this.reset()
    },
    generateUUID() {
      let d = new Date().getTime()
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    },
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: this.generateUUID(),
        cssClass: undefined,
        listClass: 'default',
        dictSort: 0,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = this.$t('deviceArea.dialogTitle_a')
      this.form.dictType = 'v1_device_area'
    },
    handleUpdate(row) {
      this.reset()
      const dictCode = row.dictCode || this.ids[0]
      getArea(dictCode).then(response => {
        this.form = response.data
        this.open = true
        this.title = this.$t('deviceArea.dialogTitle_e')
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.dictCode !== undefined) {
            updateArea(this.form).then(() => {
              this.$store.dispatch('dict/removeDict', 'v1_device_area')
              this.$modal.msgSuccess(this.$t('commonTips.edit_s'))
              this.open = false
              this.getList()
            })
          } else {
            addArea(this.form).then(() => {
              this.$store.dispatch('dict/removeDict', 'v1_device_area')
              this.$modal.msgSuccess(this.$t('commonTips.add_s'))
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids.join(',')
      this.$modal
        .confirm(this.$t('deviceArea.comfirmRemove', { dictCodes }))
        .then(() => delArea(dictCodes))
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('commonTips.remove_s'))
          this.$store.dispatch('dict/removeDict', 'v1_device_area')
          this.ids = []
          this.multiple = true
          this.single = true
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.area-toolbar {
  display: flex;
  gap: 8px;
}

.area-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  padding: 4px 0;
}

.area-card {
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid #e8f5f0;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(38, 166, 154, 0.12);
    border-color: #b2dfdb;
  }

  &.selected {
    border-color: #26a69a;
    box-shadow: 0 0 0 2px rgba(38, 166, 154, 0.15);
  }

  &__top {
    background: linear-gradient(135deg, #e8f8f5 0%, #f0faf8 100%);
    padding: 14px 14px 12px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;
  }

  &__icon {
    width: 38px;
    height: 38px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(38, 166, 154, 0.15);

    i {
      font-size: 18px;
      color: #26a69a;
    }
  }

  &__select {
    position: absolute;
    top: 12px;
    right: 50%;
    transform: translateX(50%);
  }

  &__name-block {
    margin-left: auto;
    text-align: right;
  }

  &__name {
    font-size: 22px;
    font-weight: 700;
    color: #26a69a;
    line-height: 1.2;
  }

  &__type {
    font-size: 11px;
    color: #26a69a;
    opacity: 0.8;
    margin-top: 2px;
  }

  &__divider {
    height: 1px;
    background: #edf7f5;
  }

  &__info {
    padding: 12px 16px 8px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    font-size: 13px;
  }

  &__row-label {
    color: #8a9aaa;
    display: flex;
    align-items: center;
    gap: 4px;

    i {
      font-size: 13px;
    }
  }

  &__row-value {
    color: #303133;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    gap: 8px;
    padding: 10px 16px 14px;

    .btn-edit {
      flex: 1;
      border-radius: 8px;
      border: 1.5px solid #26a69a;
      color: #26a69a;
      background: #fff;

      &:hover {
        background: #e8f8f5;
      }
    }

    .btn-remove {
      flex: 1;
      border-radius: 8px;
      border: 1.5px solid #ffcdd2;
      color: #e53935;
      background: #fff;

      &:hover {
        background: #fff5f5;
      }
    }
  }
}
</style>
