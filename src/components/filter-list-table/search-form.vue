<template>
  <div class="screen-condition" v-show="formList.length > 0">
    <div class="warp">
      <el-form
        ref="filterForm"
      >
        <el-form-item v-for="item in formList"
          :key="item.id || item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <component
            :style="item.style || `width: 180px`"
            :is="componentMap[item.type || 'input']"
            :list-data='item.listData'
            v-bind="item.props"
            :value="selfForm[item.prop]"
            @input="handleInput($event, item.prop)"
            @select="handleSelect($event, item.prop)"
            :cascader-options='item.cascaderOptions'
            :cascader-props='item.cascaderProps'
            :placeholder="item.placeholder || `请输入${item.label}`"
          ></component>
        </el-form-item>
      </el-form>
      <div class="button-wrap">
        <el-button
          type="primary"
          class="btn-box"
          @click="handleSubmit"
          >查询</el-button
        >
        <el-button class="btn-box" @click="handleReset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import WSelect from './w-select';
import WInput from './w-input';
import WDatePicker from './w-date-picker';
import WScascader from './w-cascader.vue'
export default {
  name: 'SearchFrom',
  components: {
    WInput,
    WSelect,
    WDatePicker, // 日期选择组件
    WScascader,
  },
  props: {
    formList: Array, // 搜索的组件集合-各个子组件的信息（组件名称，type等
    value: Object
  },
  data () {
    return {
      selfForm: {}, // 存放条件组件的筛选-组件的回显作用
      getFilterFormParams: {}, // 存放条件组件的入参筛选-发送给父组件，请求接口入参作用
      forListBackup: [], // 存放每个条件组件的属性字段
      componentMap: {
        input: 'WInput',
        'w-select': 'WSelect',
        'w-date-picker': 'WDatePicker',
        'w-scascader': 'WScascader'
      }
    };
  },
  watch: {
    formList: {
      immediate: true,
      deep: true,
      handler (val) {
        this.forListBackup = val;
      }
    }
  },
  methods: {
    // 点击搜索
    handleSubmit () {
      console.log(this.selfForm, '搜索的值-selfForm');
      this.$emit('submit', {
        value: this.getFilterFormParams, // 把在子组件的选择条件以事件形式传出去
        valid: true
      });
      // this.$refs.filterForm.validate(err => {
      //   console.log(err, 'err');

      // });
    },
    // 重置
    handleReset () {
      console.log(this.selfForm, '重置筛选字段-前');
      if (!Object.keys(this.selfForm).length) return;
      this.selfForm = (this.forListBackup || []).reduce((all, i) => {
        const key = i.prop;
        const defaultVal = i.value || '';
        all[key] = defaultVal;
        return all;
      }, {});
      console.log(this.selfForm, '重置筛选字段-后');
      this.$emit('reset', {
        value: {},
        valid: true
      });

      this.$emit('input', {});
    },

    // 条件筛选组件-下拉选择的子组件一些选择操作后返回的选择结果
    handleSelect (data, prop) {
      // console.log(data, prop, '获取子组件的选择');
      // 针对日期组件的字段做特需处理，因为日期组件的字段是一个，接口入参却是开始时间及结束时间的两个字段
      if (prop.indexOf('Date') > -1 || prop.indexOf('Time') > -1) {
        const dateData = prop.split('-'); // 拆解日期组件的开始时间，结束时间的入参字段
        this.selfForm[prop] = data; // 把日期组件选择的值保存下，存入到表单的selfForm，点击重置时，才能清除日期组件选择值的回显
        this.selfForm[dateData[0]] = data.length ? data[0].getTime() / 1000 : '';
        this.selfForm[dateData[1]] = data.length ? data[1].getTime() / 1000 : '';
        this.getFilterFormParams = {
          ...this.selfForm
        };
        delete this.getFilterFormParams[prop]; // 去除日期组件的回显字段，只保留接口的入参字段
        this.$emit('input', this.getFilterFormParams);
      } else {
        // 输入框点击取消已选择的操作，或者选择其他选项的操作
        console.log(data.value, 'data.value');
        this.selfForm[prop] = data.value;
        this.getFilterFormParams[prop] = data.value;
        this.$emit('input', this.getFilterFormParams);
      }
    },
    // 条件筛选组件-输入框的子组件一些输入操作后返回的选择结果
    handleInput (evt, prop) {
      console.log(evt, prop, 'handleInput');
      this.selfForm[prop] = evt.value;
      this.getFilterFormParams[prop] = evt.value;
      this.$emit('input', this.getFilterFormParams);
    }
  }
};
</script>

<style lang="less">
.screen-condition {
  padding: 20px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  .title {
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #000000;
  }
  .warp {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        display: flex;
        margin-right: 15px;
      }
    }
  }
  .button-wrap {

  }
}
/deep/.el-button {
  border-radius: 0;
}
.conter-warp {
  display: flex;
  margin-top: 16px;
  .input-box {
    width: 224px;
    margin-left: 10px;
  }
  .time-box {
    display: flex;
    .time-text {
      align-self: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #606266;
      letter-spacing: 0;
      margin-left: 10px;
    }
    .date-picker {
      align-self: center;
      margin-left: 10px;
    }
  }
  .select-box-self {
    align-self: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #606266;
  }
}
</style>
