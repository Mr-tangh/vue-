<template>
  <!-- 条件筛选-下拉选择组件 -->
  <div class="select-content">
    <el-select
      clearable
      :value="innerValue"
      :placeholder="placeholder"
      @change='onChange'>
      <el-option
        v-for="item in listData"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'WSelect',
  props: {
    listData: {
      type: Array,
      default () {
        return [
          {
            value: 0,
            label: '未开始'
          },
          {
            value: 1,
            label: '进行中'
          },
          {
            value: 2,
            label: '已结束'
          },
          {
            value: 3,
            label: '已删除'
          }
        ];
      }
    },
    value: {
      type: [String, Number]
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
    onChange (val) {
      let _data = {
        value: val
      };
      this.innerValue = val;
      this.$emit('select', _data);
      this.$emit('change', _data);
    }
  },
  watch: {
    'value': {
      handler (val, oldValue) {
        this.innerValue = val;
      },
      immediate: true
    }
  }

};
</script>

<style>

</style>
