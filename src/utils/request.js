import axios from 'axios';

const httpRequest = axios.create({
  baseURL: '',
  timeout: 2000
})

// 添加请求拦截器
httpRequest.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
httpRequest.interceptors.response.use(function (response) {
  // console.log(response, 'response');
  const { data } = response;
  // 对响应数据做点什么
  return data || {};
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default httpRequest