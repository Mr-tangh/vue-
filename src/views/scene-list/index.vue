<template>
  <!--场景管理-列表 显示-->
  <div class="scene-management-list-contain">
    <h3 class="page_head_title">场景管理</h3>
    <filterTableList v-bind="configObj" @allSelect='handleAllSelect' ref="sceneManagementList">
      <el-button-group class="sceneManagement-btn-group">
        <el-button type="primary" round @click="goAddCcene">添加场景</el-button>
        <el-button type="primary" round  @click="handleBatch" >批量关联员工</el-button>
      </el-button-group>
    </filterTableList>
    <!--批量关联员工弹窗-->
    <el-dialog
      title="批量关联员工"
      :visible="relevancyDialogVisible"
      width="480px"
      :before-close="handleCancel">
      <el-form :rules="relevanRules" :model='relevanForm' ref="relevanForm">
        <el-form-item label="关联员工" prop="roleId">
          <el-select v-model="relevanForm.roleId" placeholder="请选择角色" style="width: 160px">
            <el-option
              v-for="item in getRolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model="relevanForm.employeeId"
            collapse-tags
            style="margin-left: 10px; width: 160px"
            placeholder="请选择人员">
            <el-option
              v-for="item in personnelList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleBatchRelevan('relevanForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filterTableList from '_c/filter-list-table/index.vue'
import httpRequest from '@src/api/index.js'
import { tableColumns, searchList } from './page-configuration';
export default {
  components: { filterTableList },
  data () {
    return {
      searchList: searchList.call(this),
      configObj: {
        columns: tableColumns.call(this), // filterTableList组件的每列表格名称
        'search-list': [], // filterTableList组件的过滤组件集合
        fetchFunc: this.getSceneList, // filterTableList组件的列表请求接口
        showSelect: true, // 是否显示选框
      },
      relevancyDialogVisible: false,
      relevanRules: {
        roleId: [
          { required: true, message: '请输入关联员工', trigger: 'blur' },
        ]
      },
      relevanForm: {
        roleId: '', // 角色
        employeeId: '', // 人员
      },

      getRolesList: [], // 角色
      personnelList: [], // 人员列表
      selectIds: [], // 选择的id
    }
  },
  watch: {
    // 批量关联员工-选择不同角色
    'relevanForm.roleId' (val) {
      if (val) {
        this.getEemployeeListFn(val)
      }
    }
  },
 
  methods: {
    handleBatchRelevan (refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.relevancyDialogVisible = false
          const params = {
            ids: this.selectIds.join(','),
            employeeId: this.relevanForm.employeeId
          }
          httpRequest.SceneManagementModule.employeeBatchModification(params).then(res => {
            this.$message.success('批量更新成功')
            this.selectIds = [];
            const $table = this.$refs.sceneManagementList;
            $table.$children[0].fetchData(); // 重新请求列表的接口，刷新列表
          })
          
        }
      })
    },

    // 跳转-添加场景
    goAddCcene () {
      this.$router.push({ path: '/service/scene/management/addEdit' })
    },

    // 场景列表-删除
    handleSceneDel (data) {
      const params = {
        id: data.id
      }
      httpRequest.SceneManagementModule.sceneManagementDel(params).then(res => {
        this.$message.success('删除成功')
        const $table = this.$refs.sceneManagementList;
        $table.$children[0].fetchData(); // 重新请求列表的接口，刷新列表
      })
    } ,

    // 场景列表-编辑
    handleSceneEdit (data) {},

    // 请求场景列表数据
    getSceneList (searchQuery = {}) {
      const query = {
        ...searchQuery
      };
      return httpRequest.SceneManagementModule.getSceneManagementList(query);
    },

    // 获取角色列表
    getRoleList () {
      httpRequest.SceneManagementModule.getRoleList().then(res => {
        const { data } = res
        this.getRolesList = data
      })
    },

    // 获取该角色下的员工列表
    getEemployeeListFn (roleId) {
      const params = {
        status: 1,
        roleId: roleId,
        pageNo: 1,
        pageSize: 999
      }
      httpRequest.getEemployeeListApi(params).then(res => {
        const { data } = res
        this.personnelList = data
      })
    },

    // 获取该酒店下的所有员工
    getBrandEmployeeFn () {
      const params = {
        pageNo: 1,
        pageSize: 999
      }
      httpRequest.SceneManagementModule.getEmployeeList(params).then(res => {
        const { data } = res
        const _data = Array.isArray(data) ? data : [data];
        const arry = _data.map(item => ({
          value: item.id,
          label: item.name
        }))
        this.searchList[4].listData.push(...arry)
      })
    },
    // 表格的全选
    handleAllSelect (val) {
      const arry = Array.isArray(val) ? val : [val]
      arry.forEach(item => {
        this.selectIds.push(item.id)
      })
    },
    

    // 取消
    handleCancel () {
      this.relevancyDialogVisible = false
    },
    // 点击批量修改员工的按钮
    handleBatch () {
      if (!this.selectIds.length) return this.$message.warning('请先选择需要修改的数据')
      this.relevancyDialogVisible = true
    },

    // 上下架的状态更新
    handleStatusChanage (data) {
      const params = {
        id: data.id,
        status: Number(!data.status)
      }
      httpRequest.SceneManagementModule.sceneManagementUpdateStatus(params).then(res => {
        this.$message.success('状态更新成功')
        const $table = this.$refs.sceneManagementList;
        $table.$children[0].fetchData(); // 重新请求列表的接口，刷新列表
      })
    },

    pageInitFn () {
      this.getRoleList();
      this.getBrandEmployeeFn();
    }
  },
  created () {
    this.pageInitFn()
  },
  mounted () {
    this.configObj['search-list'] = this.searchList
  }
}
</script>

<style lang="less" scoped>
.scene-management-list-contain {
  /deep/ .screen-condition {
    background-color: #fafafa;
  }
  .page_head_title {
    padding: 20px;
    font-size: 20px;
  }
  .sceneManagement-btn-group {
    margin-top: 20px;
    padding: 0 20px;
    /deep/ .el-button {
      margin-right: 10px;
      font-size: 12px;
    }
  }
}


</style>
<style lang="less">
.operation_btn {
  .el-button.el-button--text {
    padding: 0 4px;
  }
}
</style>