<template>
  <div>
    <el-date-picker
      v-model="innerValue"
      :value="innerValue"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change='onChange'>
    </el-date-picker>
  </div>
</template>
<script>
export default {
  props: ['value', 'placeholder'],
  data () {
    return {
      innerValue: this.value
    };
  },
  watch: {
    value: {
      handler (val, oldValue) {
        // console.log(val, '日期选择的值');
        this.innerValue = val;
      },
      immediate: true
    }
  },
  methods: {
    onChange (value, extra) {
      console.log(value, '日期选择');
      this.innerValue = value;
      this.$emit('select', value);
      this.$emit('change', value);
    }
  }
};
</script>
