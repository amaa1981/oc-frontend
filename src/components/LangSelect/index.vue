<!--
 * @Descripttion:
 * @version:
 * @Author: FGJ
 * @Date: 2023-05-31 16:55:13
 * @LastEditors: FGJ
 * @LastEditTime: 2025-05-12 17:40:07
-->
<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh'" command="zh">
        Chinese
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">
        English
      </el-dropdown-item>
      <!-- <el-dropdown-item :disabled="language === 'fr'" command="fr">
        Français
      </el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'
import { getLocale, setLocale } from "@/api/system/lan";
export default {
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
  mounted() {
    const fallback = Cookies.get('language') || 'en'
    getLocale()
      .then((res) => {
        this.init(res.data || fallback)
      })
      .catch(() => {
        this.init(fallback)
      })
  },
  methods: {
    init(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
    },
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
      this.$message({
        message: "ok",
        type: "success",
      });

      setLocale(lang).then((res) => {
        console.log("getLocale");
        console.log(res);
        this.$router.go(0); // Refresh page
      });
    },
  },
};
</script>
