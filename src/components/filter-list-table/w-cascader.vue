<template>
  <div>
    <el-cascader
      @change="cascaderChange"
      :props="innerCascaderProps"
      v-model="innerValue"
      :value="innerValue"
      ref="cascaderAddr"
		></el-cascader>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    placeholder: {
      type: [String]
    },
    cascaderProps: {
      type: Object
    },

  },
  data () {
    return {
      innerValue: this.value,
      innerCascaderProps: this.cascaderProps
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
    cascaderChange (val, extra) {
      console.log(val, '级联选择');
      const _data = {
        value: Array.isArray(val) ? val.length === 2 ? val[1] :val[0] : val
      };
      this.innerValue = val;
      this.$emit('select', _data);
      this.$emit('change', _data);
    }
  }
};
</script>
