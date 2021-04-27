<template>
  <!-- 条件筛选-输入框组件 -->
  <div class="select-content">
    <el-input
      @input="onInput"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      v-model="innerValue">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'WInput',
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请选择活动状态'
    }
  },
  data () {
    return {
      innerValue: this.value
    };
  },
  methods: {
    onInput (val) {
      let _data = {
        'value': val
      };
      this.innerValue = val;
      this.$emit('input', _data);
    }
  },
  watch: {
    value: {
      handler (val, oldValue) {
        // console.log(val, '监听该输入框的值的变化');
        this.innerValue = val;
      },
      immediate: true
    }
  }

};
</script>

<style>

</style>
