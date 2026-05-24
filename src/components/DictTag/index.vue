<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.value)">
        <span
          v-if="item.raw.listClass == 'default' || item.raw.listClass == ''"
          :key="item.value"
          :index="index"
          :class="item.raw.cssClass"
          >{{ item.label + ' ' }}</span
        >
        <el-tag
          v-else
          :disable-transitions="true"
          :key="item.value"
          :index="index"
          :type="item.raw.listClass == 'primary' ? '' : item.raw.listClass"
          :class="item.raw.cssClass"
        >
          {{ item.label + ' ' }}
        </el-tag>
      </template>
    </template>
    <template v-if="unmatch && showValue">
      {{ unmatchArray | handleArray }}
    </template>
  </div>
</template>

<script>
export default {
  name: "DictTag",
  props: {
    options: {
      type: Array,
      default: null,
    },
    value: [Number, String, Array],
    // When no matching data is found, value is displayed
    showValue: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      unmatchArray: [], // Record unmatched items
    }
  },
  computed: {
    values() {
      if (this.value !== null && typeof this.value !== 'undefined') {
        return Array.isArray(this.value) ? this.value : [String(this.value)];
      } else {
        return [];
      }
    },
    unmatch(){
      this.unmatchArray = [];
      if (this.value !== null && typeof this.value !== 'undefined') {
        // The value passed in is not an array
        if(!Array.isArray(this.value)){
          if(this.options.some(v=> v.value == this.value )) return false;
          this.unmatchArray.push(this.value);
          return true;
        }
        // The incoming value is Array
        this.value.forEach(item => {
          if (!this.options.some(v=> v.value == item )) this.unmatchArray.push(item)
        });
        return true;
      }
      // No value is displayed
      return false;
    },

  },
  filters: {
    handleArray(array) {
      if(array.length===0) return '';
      return array.reduce((pre, cur) => {
        return pre + ' ' + cur;
      })
    },
  }
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
