<template>
  <div class="filter_table_wrap" v-loading='loading'>
    <SearchForm
      v-model="searchForm"
      :form-list='searchList'
      @submit="handleSearchSubmit"
      @reset="handleSearchSubmit">
    </SearchForm>
    <slot></slot>
    <div class="table_content">
      <!-- 表格列表 -->
      <wTable :columns-list='columns' :table-data='listData' v-on="$listeners" v-bind="$attrs"></wTable>
      <!-- 分页组件 -->
      <wPagination
        :total="pageTotal"
        :page-size="pagination.pageSize"
        storage-name="system-project-staff-pagesize"
        :current-page="pagination.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></wPagination>
    </div>
  </div>
</template>

<script>
import SearchForm from './search-form';
import wTable from '@src/components/w-table';
import wPagination from '@src/components/w-pagination';
export default {
  components: {
    SearchForm,
    wTable,
    wPagination
  },
  props: {
    searchList: Array, // 添加筛选条件模块需要的组件
    columns: Array, // 表格的每列名称
    fetchFunc: Function // 表格的列表数据的请求接口函数
  },
  data () {
    return {
      searchForm: {}, // 条件筛选的字段
      listData: [], // 表格的列表数据
      pageTotal: 0, // 分页组件的的总数量
      pagination: {
        pageSize: 10,
        pageNo: 1
      },
      loading: false
    };
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    // 表格的数据处理
    formatTableDate (_data) {
      for (let index = 0; index < _data.length; index++) {
        const element = _data[index];
        for (const key in element) {
          if (element[key] === null || element[key] === '') {
            element[key] = '--';
          }
        }
      }
      return _data;
    },

    // 查询
    handleSearchSubmit ({ valid, value }) {
      console.log(value, valid, '获取到的筛选条件handleSearchSubmit');
      this.loading = true
      this.pagination.pageNo = 1; // 查询或者重置页码数从1开始
      if (Object.keys(value).length) {
        for (const key in value) {
          if (value[key]) {
            this.searchForm[key] = value[key];
          }
        }
      } else {
        // 点击重置
        this.searchForm = value;
      }

      if (valid) {
        this.fetchData().then((result) => { // 列表的其他数据
          this.listData = result;
          this.loading = false
        });
      }
    },

    // 请求表格的列表数据
    async fetchData () {
      this.loading = true;
      this.filterForm = {
        ...this.searchForm
      };
      // console.log(this.filterForm, 'this.filterForm');
      for (const key in this.filterForm) {
        if (key.indexOf('Date-') > -1) { // 含有“Date-”字符串的这个字段是用来回显日期组件的value值的，不需要传入请求接口，所以需要去掉
          delete this.filterForm[key]; // 比如startDate-endDate，如果检测到筛选传回的字段有startDate-endDate字段，先删除该字段
        };
      }
      const query = {
        ...this.filterForm,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      };
      console.log(query, this.filterForm, '列表请求接口的所有入参');
      await this.fetchFunc(query).then(res => {
        const { data, pageNo, pageSize, totalCount } = res;
        console.log(data, 'data');
        if (data!== null) {
          this.listData = [
            ...data
          ];
        } else {
          this.listData = [];
        }

        this.pagination.pageNo = pageNo;
        this.pagination.pageSize = pageSize;
        this.pageTotal = totalCount;

        this.loading = false;
      }).catch(error => {
        this.$message.error(error.message);
        // this.$router.go(-1);
      });
      console.log(this.listData, 'this.listData');
      return this.listData;
    },

    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize;
      this.fetchData();
    },

    handleCurrentChange (pageNo) {
      this.pagination.pageNo = pageNo;
      this.fetchData();
    }
  }
};
</script>

<style lang='less'>
  .table_content {
    padding: 0 20px;
    background-color: #fff;
    .w-pagination-page-warp {
      background-color: #fff;
    }
  }

</style>
