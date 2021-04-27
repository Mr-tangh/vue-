<template>
  <div class="wrap">
    <el-table class="table-box"
      :data="tableData"
      v-loading="loading"
      :height='tableHeight'
      @selection-change="handleSelectionChange"
     >
      <el-table-column
        type="selection"
        width="55" v-if="showSelect">
      </el-table-column>
      <template v-for="(column, index) in columnsList">
        <el-table-column
          :key="column.prop"
          :label="column.label"
          :align="index === 0 ? 'left' : index === columnsList.length - 1 ? 'right' : 'center' "
          :min-width='column.minWidth || "120"'
          :type='column.type'
          :show-overflow-tooltip="column.showTooltip !== undefined ? column.showTooltip : showTooltip"
          :fixed='column.fixed'>
          <template slot-scope="scope">
            <template v-if="column.render">
                <RenderCol :render='column.render' :data-column='scope.row' :index-num='scope.$index' />
              <!-- <div class="operate-cell">
                <span v-html="column.render(scope.row)"></span>
              </div> -->
            </template>
            <template v-else>
              <span>{{scope.row[column.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import RenderCol from './render-col.js';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columnsList: {
      type: Array,
      default: () => [] // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: String,
      default: () => {
        const _screenH = window.innerHeight;
        return _screenH - 368 + 'px';
      }
    },
    render: Function,
    showTooltip: {
      type: Boolean,
      default: true
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RenderCol
  },
  computed: {
    // tableHeight () {
    //   let _screenH = window.innerHeight;
    //   // console.log('_screenH', _screenH)
    //   return _screenH - 368 + 'px';
    // }
  },
  methods: {
    handleSelectionChange (val) {
      this.$emit('allSelect', val)
    }
  }
};
</script>

<style lang="less">
  .table-box {
    .el-table__body-wrapper {
      width: 99%;
    }
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
      -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
      border-radius: 10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background:rgba(0,0,0,0.3);
      -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
      background:rgba(0,0,0,0.6);
    }
  }
  .operate-cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    line-height: 23px;
  }
  .wrap {
    .el-table.table-box {
      .cell {
        padding: 15px 15px 19px!important;
      }
    }
  }
</style>
