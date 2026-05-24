<template>
  <!-- authorized user -->
  <el-dialog :title="$t('role.selectUser')" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item :label="$t('role.userName')" prop="userName">
        <el-input
          v-model="queryParams.userName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('role.phonenumber')" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('commonBtn.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('commonBtn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="userList" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('role.userName')" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('role.nickName')" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('role.email')" prop="email" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('role.phonenumber')" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('role.status')" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('role.createTime')" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">{{ $t('commonBtn.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('commonBtn.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedUserList, authUserSelectAll } from "@/api/system/role";
export default {
  dicts: ['sys_normal_disable'],
  props: {
    // role number
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // Loading state
      visible: false,
      // Selected ids value
      userIds: [],
      // Total count
      total: 0,
      // Unauthorized user data
      userList: [],
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userName: undefined,
        phonenumber: undefined
      }
    };
  },
  methods: {
    // Show popup
    show() {
      this.queryParams.roleId = this.roleId;
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // Selection change
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.userId);
    },
    // Query table data
    getList() {
      unallocatedUserList(this.queryParams).then(res => {
        this.userList = res.rows;
        this.total = res.total;
      });
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
    /** Select authorized user handler */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      if (userIds == "") {
        this.$modal.msgError(this.$t('role.seletUserTip'));
        return;
      }
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>
