<template>
  <div class="w-pagination-page-warp">
    <el-pagination
      :layout="layout"
      :total="total"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- <div class="pagination-page-size-input-warp">
        每页
        <el-input-number
          class="pagination-page-size-input"
          v-model.number="pageSize"
          size="mini"
          :precision="0"
          :step="10"
          :min="0"
          :max="10000"
          controls-position="right"
          @change="handleSizeChange"
        ></el-input-number>条
      </div>-->
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    layout: {
      type: String,
      default: "prev, pager, next, jumper, sizes, total"
    },
    total: {
      type: [Number, String],
      default: 0
    },

    currentPage: {
      type: [Number, String],
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    pageSize:{
      type: [Number, String],
      default: 1
    },
    storageName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // pageSize: localStorage.getItem(this.storageName) - 0 || 10
    };
  },
  methods: {
    handleSizeChange(data, type) {
      // console.log('handleSizeChange', data)
      // localStorage.setItem(this.storageName, data);
      this.$emit("size-change", data);
      // if (type !== "init") {
      //   this.handleCurrentChange(1);
      // }
    },
    handleCurrentChange(data) {
      // console.log('handleCurrentChange', data)
      this.$emit("current-change", data);
    }
  },
  mounted() {
    // this.handleSizeChange(this.pageSize, "init");
    // console.log('w-pagination props', this.$props)
  }
};
</script>

<style lang="less" >
.w-pagination-page-warp {
  height: 74px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-pagination {
    display: inline-block;
  }
  .pagination-page-size-input-warp {
    display: inline-block;
    color: #999999;
    margin-right: 5px;
    .el-input-number--mini {
      width: 50px;
      .el-input__inner {
        padding: 0 10px;
        width: 50px;
      }
      span {
        height: 13.5px;
        display: none;
      }
    }
  }
}
</style>
