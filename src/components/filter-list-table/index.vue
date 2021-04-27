<template>
  <div class="table_module">
    <filterTable
      v-on="$listeners"
      v-bind="$attrs"
    >
      <slot></slot>
    </filterTable>
  </div>
</template>

<script>
import filterTable from './table';
export default {
  // columns: 表格的每列，search-list: 表格的搜索组件，fetchFunc：表格的列表请求接口函数, 通过v-bind='$attrs'绑定传入
  components: {
    filterTable
  },
};
</script>

<style>

</style>
