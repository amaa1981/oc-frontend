<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="IP Address" prop="ipaddr">
          <el-input v-model="queryParams.ipaddr" placeholder="Enter IP address" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="Username" prop="userName">
          <el-input v-model="queryParams.userName" placeholder="Enter username" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">Search</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="list.slice((pageNum-1)*pageSize, pageNum*pageSize)" style="width:100%;">
      <el-table-column label="#" type="index" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Session ID" align="center" prop="tokenId" show-overflow-tooltip />
      <el-table-column label="Username" align="center" prop="userName" show-overflow-tooltip />
      <el-table-column label="Department" align="center" prop="deptName" />
      <el-table-column label="IP Address" align="center" prop="ipaddr" show-overflow-tooltip />
      <el-table-column label="Location" align="center" prop="loginLocation" show-overflow-tooltip />
      <el-table-column label="Browser" align="center" prop="browser" />
      <el-table-column label="OS" align="center" prop="os" />
      <el-table-column label="Login Time" align="center" prop="loginTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleForceLogout(scope.row)" v-hasPermi="['monitor:online:forceLogout']">Force Logout</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
  </div>
</template>

<script>
import { list, forceLogout } from "@/api/monitor/online";

export default {
  name: "Online",
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      pageNum: 1,
      pageSize: 10,
      queryParams: {
        ipaddr: undefined,
        userName: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.list = response.rows || [];
        this.total = response.total || 0;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    handleQuery() { this.pageNum = 1; this.getList(); },
    resetQuery() { this.resetForm("queryForm"); this.handleQuery(); },
    handleForceLogout(row) {
      this.$modal.confirm(`Are you sure you want to force logout user "${row.userName}"?`)
        .then(() => forceLogout(row.tokenId))
        .then(() => { this.getList(); this.$modal.msgSuccess("User logged out successfully"); })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.search-bar {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
</style>