<template>
  <div>
    <div class="user-info-head" @click="editCropper()">
      <img
        v-bind:src="options.img"
        :title="$t('profile.uploadTip')"
        class="img-circle img-lg"
        onerror="javascript:this.src='data:image/image/png;base64,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'"
      />
    </div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            :outputType="options.outputType"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :sm="3" :xs="3">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button size="small">
              {{ $t("profile.select") }}
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :sm="2" :xs="2">
          <el-button
            icon="el-icon-plus"
            size="small"
            @click="changeScale(1)"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button
            icon="el-icon-minus"
            size="small"
            @click="changeScale(-1)"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button
            icon="el-icon-refresh-left"
            size="small"
            @click="rotateLeft()"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button
            icon="el-icon-refresh-right"
            size="small"
            @click="rotateRight()"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :sm="2" :xs="2">
          <el-button type="primary" size="small" @click="uploadImg()">{{
            $t("commonBtn.confirm")
          }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/system/user";
import { debounce } from "@/utils";

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: "Change Avatar",
      options: {
        img: store.getters.avatar, // Crop image URL
        autoCrop: true, // Auto generate crop box
        autoCropWidth: 200, // Default crop box width
        autoCropHeight: 200, // Default crop box height
        fixedBox: true, // Fixed crop box size
        outputType: "png", // Default output PNG format
      },
      previews: {},
      resizeHandler: null,
    };
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true;
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true;
      if (!this.resizeHandler) {
        this.resizeHandler = debounce(() => {
          this.refresh();
        }, 100);
      }
      window.addEventListener("resize", this.resizeHandler);
    },
    // 刷新组件
    refresh() {
      this.$refs.cropper.refresh();
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.$modal.msgError(this.$t("profile.uploadFileTip"));
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob((data) => {
        let formData = new FormData();
        formData.append("avatarfile", data);
        uploadAvatar(formData).then((response) => {
          this.open = false;
          this.options.img = process.env.VUE_APP_BASE_API + response.imgUrl;
          store.commit("SET_AVATAR", this.options.img);
          this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
          this.visible = false;
        });
      });
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    },
    // 关闭窗口
    closeDialog() {
      this.options.img = store.getters.avatar;
      this.visible = false;
      window.removeEventListener("resize", this.resizeHandler);
    },
  },
};
</script>
<style scoped lang="scss">
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: "+";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>
