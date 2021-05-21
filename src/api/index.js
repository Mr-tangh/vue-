import services from '../utils/request';
export default {
  SceneManagementModule: {
    getSceneManagementList (params) {
      return services.get('/public/ApiData/listData.json', {
        params,
        action: '场景管理-列表查询',
      });
    },

    getRoleList (params) {
      return services.get('/public/ApiData/roleList.json', {
        params,
        action: '场景管理-角色列表',
      });
    },

    getEmployeeList (params) {
      return services.get('/public/ApiData/employeList.json', {
        params,
        action: '场景管理-员工列表',
      });
    },
    
    getSelectSceneCategoryList (params) {
      return services.get('/public/ApiData/selectSceneCategoryList.json', {
        params,
        action: '场景管理-场景分类',
      });
    }
    
  },

  GoodsModules: {
    getGoodsCategory (params) {
      return services.get('/public/ApiData/queryGoodsCategory.json', {
        params,
        action: '商品分类',
      });
    },

    getGoodsList (params) {
      return services.get('/public/ApiData/queryGoodsList.json',{
        params, 
        action: '商品列表',
      });
    }
  }
}