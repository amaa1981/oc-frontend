<template>
  <div class="app-container profile-page">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('profile.title1') }}</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />{{ $t('profile.userName') }}
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />{{ $t('profile.phonenumber') }}
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />{{ $t('profile.email') }}
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />{{ $t('profile.deptName') }}
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />{{ $t('profile.roleGroup') }}
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />{{ $t('profile.createTime') }}
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('profile.title2') }}</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('profile.title2')" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane :label="$t('profile.title3')" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>

<style lang="scss" >
.profile-page {
  padding-top: 20px !important;
}
</style>

<style lang="scss">
// 个人中心单选框绿色风格
.profile-page {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #26a69a;
    background: #26a69a;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #26a69a;
  }
  .el-radio__inner:hover {
    border-color: #26a69a;
  }
  // tab 激活绿色
  .el-tabs__item.is-active {
    color: #26a69a;
  }
  .el-tabs__item:hover {
    color: #26a69a;
  }
  .el-tabs__active-bar {
    background-color: #26a69a;
  }
  // primary 按钮绿色
  .el-button--primary {
    background-color: #26a69a;
    border-color: #26a69a;
    &:hover, &:focus {
      background-color: #2bbbad;
      border-color: #2bbbad;
    }
    &:active {
      background-color: #1e8a80;
      border-color: #1e8a80;
    }
  }
}
</style>
