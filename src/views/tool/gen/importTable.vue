<template>
  <!-- Import Table -->
  <el-dialog title="Import Table" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="Table Name" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="Enter table name"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Description" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="Enter table description"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">Search</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">Reset</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="dbTableList" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="Table Name" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="tableComment" label="Description" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="Created At"></el-table-column>
        <el-table-column prop="updateTime" label="Updated At"></el-table-column>
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
      <el-button type="primary" @click="handleImportTable">Confirm</el-button>
      <el-button @click="visible = false">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDbTable, importTable } from "@/api/tool/gen";
export default {
  data() {
    return {
      // Loading state
      visible: false,
      // Selected idsvalue
      tables: [],
      // Total count
      total: 0,
      // table data
      dbTableList: [],
      // Queryparameter
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined
      }
    };
  },
  methods: {
    // Show popup
    show() {
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // Selection change
    handleSelectionChange(selection) {
      this.tables = selection.map(item => item.tableName);
    },
    // Querytable data
    getList() {
      listDbTable(this.queryParams).then(res => {
        if (res.code === 200) {
          this.dbTableList = res.rows;
          this.total = res.total;
        }
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
    /** Import button actions */
    handleImportTable() {
      const tableNames = this.tables.join(",");
      if (tableNames == "") {
        this.$modal.msgError("Please select tables to import");
        return;
      }
      importTable({ tables: tableNames }).then(res => {
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
