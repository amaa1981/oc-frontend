<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item :label="$t('menuConfig.menuName')" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('menuConfig.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:menu:add']"
          >{{ $t("commonBtn.add") }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >{{ $t("menuConfig.toggleExpandAll") }}</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="menuName"
        :label="$t('menuConfig.menuName')"
        :show-overflow-tooltip="true"
        width="160"
      >
        <template slot-scope="scope">
          {{ $t(scope.row.menuName) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="icon"
        :label="$t('menuConfig.icon')"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        :label="$t('menuConfig.orderNum')"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="perms"
        :label="$t('menuConfig.perms')"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="component"
        :label="$t('menuConfig.component')"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="status"
        :label="$t('menuConfig.status')"
        width="80"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menuConfig.createTime')"
        align="center"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
            v-hasPermi="['system:menu:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
            >{{ $t("commonBtn.add") }}</el-button
          >
          <span class="action-divider" />
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="btn-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
            >{{ $t("commonBtn.remove") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Add or Edit menu dialog -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('menuConfig.parentId')" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                :placeholder="$t('commonTips.pleaseSelect')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('menuConfig.menuType')" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">{{
                  $t("menuConfig.menuTypeLabel1")
                }}</el-radio>
                <el-radio label="C">{{
                  $t("menuConfig.menuTypeLabel2")
                }}</el-radio>
                <el-radio label="F">{{
                  $t("menuConfig.menuTypeLabel3")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item :label="$t('menuConfig.icon')" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect
                  ref="iconSelect"
                  @selected="selected"
                  :active-icon="form.icon"
                />
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  :placeholder="$t('menuConfig.selectIcon')"
                  readonly
                >
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    style="width: 25px"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menuConfig.menuName')" prop="menuName">
              <el-input
                v-model="form.menuName"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menuConfig.orderNum')" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.isFrameTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.isFrame") }}
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">{{
                  $t("menuConfig.isFrameLabel1")
                }}</el-radio>
                <el-radio label="1">{{
                  $t("menuConfig.isFrameLabel2")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip :content="$t('menuConfig.pathTip')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.path") }}
              </span>
              <el-input
                v-model="form.path"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.componentTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.component") }}
              </span>
              <el-input
                v-model="form.component"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input
                v-model="form.perms"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="100"
              />
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.permsTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.perms") }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input
                v-model="form.query"
                :placeholder="$t('commonTips.pleaseEnter')"
                maxlength="255"
              />
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.queryTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.query") }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.isCacheTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.isCache") }}
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">
                  {{ $t("menuConfig.isCacheLabel1") }}</el-radio
                >
                <el-radio label="1">
                  {{ $t("menuConfig.isCacheLabel2") }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="visible">
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.visibleTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.visible") }}
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dict.type.sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip
                  :content="$t('menuConfig.menuStatusTip')"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t("menuConfig.menuStatus") }}
              </span>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
} from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  dicts: ["sys_show_hide", "sys_normal_disable"],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // Loading state
      loading: true,
      // Show search conditions
      showSearch: true,
      // Menu table tree data
      menuList: [],
      // Menu treeOptions
      menuOptions: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Whether to expand or not, collapse all by default
      isExpandAll: false,
      // Re-render table state
      refreshTable: true,
      // Query parameters
      queryParams: {
        menuName: undefined,
        visible: undefined,
      },
      // Form parameters
      form: {},
      // Form verification
      rules: {
        menuName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        orderNum: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        path: [
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
  },
  methods: {
    // Select icon
    selected(name) {
      this.form.icon = name;
    },
    /** Query menu list */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then((response) => {
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** Convert menu data structure */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children,
      };
    },
    /** Query menu dropdown tree */
    getTreeselect() {
      listMenu().then((response) => {
        this.menuOptions = [];
        const menu = {
          menuId: 0,
          menuName: this.$t("menuConfig.main"),
          children: [],
        };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
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
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0",
      };
      this.resetForm("form");
    },
    /** Search handler */
    handleQuery() {
      this.getList();
    },
    /** Reset handler */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** Add handler */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = this.$t("menuConfig.dialogTitle_a");
    },
    /** Expand/collapse handler */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** Edit handler */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.menuId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("menuConfig.dialogTitle_e");
      });
    },
    /** Submit handler */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.menuId != undefined) {
            updateMenu(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then((response) => {
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
      this.$modal
        .confirm(
          this.$t("menuConfig.comfirmRemove", { menuName: row.menuName })
        )
        .then(function () {
          return delMenu(row.menuId);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
  },
};
</script>
