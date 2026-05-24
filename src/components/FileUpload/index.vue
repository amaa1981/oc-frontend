<template>
  <div class="upload-file">
    <el-upload
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
    >
      <!-- upload button -->
      <el-button size="mini" type="primary">{{ $t('fileUpload.selectFile') }}</el-button>
      <!-- Upload tips -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        {{ $t('fileUpload.pleaseUpload') }}
        <template v-if="fileSize"> {{ $t('fileUpload.maxSize') }} <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> {{ $t('fileUpload.fileType') }} <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        {{ $t('fileUpload.file') }}
      </div>
    </el-upload>

    <!-- File List -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.url" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">{{ $t('fileUpload.delete') }}</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "FileUpload",
  props: {
    // value
    value: [String, Object, Array],
    // Quantity limit
    limit: {
      type: Number,
      default: 5,
    },
    // Size limit(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // File Type, such as ['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf"],
    },
    // Whether to Show Tip
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // Upload file server URL
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1;
          // First convert the value into an array
          const list = Array.isArray(val) ? val : this.value.split(',');
          // Then convert the array into an object array
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              item = { name: item, url: item };
            }
            item.uid = item.uid || new Date().getTime() + temp++;
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // Whether to Show Tip
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // Check format and size before uploading
    handleBeforeUpload(file) {
      // Check File Type
      if (this.fileType) {
        const fileName = file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(this.$t('fileUpload.uploadError',{fileType: this.fileType.join("/")}));
          return false;
        }
      }
      // Check File Size
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(this.$t('fileUpload.sizeTip',{fileSize: this.fileSize}));
          return false;
        }
      }
      this.$modal.loading(this.$t('fileUpload.loadingText'));
      this.number++;
      return true;
    },
    // The number of files exceeds
    handleExceed() {
      this.$modal.msgError(this.$t('fileUpload.sumLimit',{limit: this.limit}));
    },
    // Upload failed
    handleUploadError(err) {
      this.$modal.msgError(this.$t('fileUpload.errorTip'));
      this.$modal.closeLoading()
    },
    // Upload success callback
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, url: res.fileName });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // Delete file
    handleDelete(index) {
      this.fileList.splice(index, 1);
      this.$emit("input", this.listToString(this.fileList));
    },
    // Upload end processing
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    // Get File Name
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return "";
      }
    },
    // Convert the object to the specified string delimited
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    }
  }
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
