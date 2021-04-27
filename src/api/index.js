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
    }
  }
}