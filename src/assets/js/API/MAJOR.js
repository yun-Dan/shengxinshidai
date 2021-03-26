import axios from 'axios'

/** @委托单位管理 **/
export const MAJOR = {
  majorunitUrl: '/admin/majorunit/index', // 获取委托单位列表
  majorunitInfoUrl: '/admin/majorunit/showprolist' // 获取委托单位的项目 /班级详情列表
}
export const actionsmajor = {
  getMajorunit ({ state }, params) {
    const { majorunitUrl } = MAJOR
    return axios.get(state.URL + majorunitUrl, {
      params: params.data,
      yxb: true
    })
  },
  getMajorunitInfo ({ state }, params) {
    const { majorunitInfoUrl } = MAJOR
    return axios.get(state.URL + majorunitInfoUrl, {
      params: params.data,
      yxb: true
    })
  },
}