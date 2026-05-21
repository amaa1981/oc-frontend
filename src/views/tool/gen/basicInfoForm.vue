<template>
  <el-form ref="basicInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="Table Name" prop="tableName">
          <el-input placeholder="Enter table name" v-model="info.tableName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Description" prop="tableComment">
          <el-input placeholder="Enter" v-model="info.tableComment" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Entity Class" prop="className">
          <el-input placeholder="Enter" v-model="info.className" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Author" prop="functionAuthor">
          <el-input placeholder="Enter" v-model="info.functionAuthor" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Remarks" prop="remark">
          <el-input type="textarea" :rows="3" v-model="info.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        tableName: [
          { required: true, message: "Table name is required", trigger: "blur" }
        ],
        tableComment: [
          { required: true, message: "Table description is required", trigger: "blur" }
        ],
        className: [
          { required: true, message: "Entity class name is required", trigger: "blur" }
        ],
        functionAuthor: [
          { required: true, message: "Author is required", trigger: "blur" }
        ]
      }
    };
  }
};
</script>
