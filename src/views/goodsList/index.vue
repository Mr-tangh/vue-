<template>
  <!--虚拟商品选择的弹窗 -->
  <el-dialog
    title="选择商品"
    :visible.sync="isShow"
    class="table-select-dialog"
  >
    <!--拟商品列表 -->
    <filterTableList v-bind="configObj"  ref="qrGoodsList">
    </filterTableList>

    <div slot="footer">
      <el-button @click="isShow = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import filterTableList from '_c/filter-list-table/index.vue'
import httpRequest from '@src/api/index.js'
export default {
  components: { filterTableList },
    model: {
    prop: 'showDialog',
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tableColumns () { // 虚拟商品列表的每列名称
      return [
        {
          prop: 'name',
          label: '商品名称',
          render: (h, { row }) => {
            return h('span', {}, [row.name || '--'])
          }
        },
        {
          prop: 'salePrice',
          label: '售价（￥）',
          render: (h, { row }) => {
            return h('span', {}, [row.salePrice || '--'])
          }
        },
        {
          prop: 'unit',
          label: '单位',
          render: (h, { row }) => {
            return h('span', {}, [row.unit || '--'])
          }
        },
        {
          label: '操作',
          render: (h, data) => {
            const selectBtn = h('el-button', {
              attrs: {
                type: 'primary',
                plain: true,
                round: true
              },
              nativeOn: {
                click: () => {
                  this.handleSelectGood(data);
                }
              }
            }, ['选择']); // 删除按钮

            return h('div', {}, [selectBtn])
          }
        }
      ]
    },
    searchList () { // 过滤查询条件的组件配置
      return [
        {
          label: '商品分类',
          type: 'w-scascader',
          prop: 'categoryId',
          cascaderOptions: this.categoryOptions,
          style: {
            width: '160px'
          }
        },
        {
          placeholder: '商品名称',
          type: 'input',
          prop: 'itemName',
          style: {
            width: '160px'
          }
        },
        {
          placeholder: '条形码',
          type: 'input',
          prop: 'barcode',
          style: {
            width: '160px'
          }
        },
      ]
    },
  },
  watch: {
    showDialog (newVal, oldVal) {
      this.isShow = newVal;
    },
    isShow (newVal, oldVal) {
      this.$emit('input', newVal);
    },
  },
  data () {
    return {
      configObj: {
        columns: [], // filterTableList组件的每列表格名称
        'search-list': [], // filterTableList组件的过滤组件集合
        fetchFunc: this.getSceneList, // filterTableList组件的列表请求接口
        showSelect: false, // 是否显示选框
      },
      isShow: false,
      seletItem: [],
      categoryOptions: [],
    }
  },
  methods: {
    // 请求场景列表数据
    getSceneList (searchQuery = {}) {
      const query = {
        type: 41,
        ...searchQuery
      };
      return httpRequest.GoodsModules.getGoodsList(query);
    },

    // 选择商品
    handleSelectGood (data) {
      this.seletItem = [data]
      this.$emit('singleChoosed', this.seletItem)
      this.isShow = false
    },
    
    // 配置filterTableList组件
    tableConfig () {
      this.configObj = {
        ...this.configObj,
        columns: this.tableColumns,
        'search-list': this.searchList
      }
    },

     /**
     * 查询分类列表
     */
    async listCategories (callback) {
      const params = {
        type: 1,
        queryReqType: 1,
      };
      await httpRequest.GoodsModules.getGoodsCategory(params).then(res => {
        this.categoryData = res.data;
        this.categoryOptions = this.parseCategoriesResponse(res.data || []);
        if (this.withAll) {
          this.categoryOptions.unshift({
            label: '全部分类',
            value: null,
          });
        }
        // 回调函数执行被选中的分类
        callback && typeof callback === 'function' && callback(res.data || []);
      })

      return this.categoryOptions

      
    },

    parseCategoriesResponse(categories) {
      /**
       * 递归解析分类中的各个子分类
       * @param categoryItem
       * @returns {*}
       */
      function parseChildCategory(categoryItem) {
        if (categoryItem.childrenCategory && categoryItem.childrenCategory.length) {
          return categoryItem.childrenCategory.map(childItem => {
            return {
              label: childItem.category,
              value: childItem.id,
              children: parseChildCategory(childItem),
              frontendCategory: childItem.appFrontendCategoryNames || childItem.epFrontendCategoryNames,
            };
          });
        } else {
          return null;
        }
      }

      return categories.map(item => {
        return {
          label: item.category,
          value: item.id,
          children: parseChildCategory(item),
          frontendCategory: item.appFrontendCategoryNames || item.epFrontendCategoryNames,
        };
      });
    },
    
    async initPageFn () {
      this.categoryOptions = await this.listCategories();
      this.tableConfig();
      
    }
  },
  mounted () {
    this.initPageFn()
  }
}
</script>

<style>

</style>