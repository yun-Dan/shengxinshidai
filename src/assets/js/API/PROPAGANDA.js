import axios from 'axios'

/** @宣传推广 **/
export const PROPAGANDA = {
  propagandaPromoteUrl: '/admin/promote',
  checkPropagandaPromoteUrl: '/admin/promote/status', // 审核
  propagandaPromoteProjectListUrl: '/admin/promote/lists' // 获取宣传项目列表
}
export const actionspropaganda = {
  // 获取列表（或详情）
  getPropagandaPromoteList ({ state }, params) {
    const { propagandaPromoteUrl } = PROPAGANDA
    return axios.get(state.URL + propagandaPromoteUrl, {
      params: params.data,
      yxb: true
    })
  },
  // 新增
  addPropagandaPromote ({ state }, params) {
    const { propagandaPromoteUrl } = PROPAGANDA
    return axios.post(state.URL + propagandaPromoteUrl, params.data, {
      yxb: true
    })
  },
  //编辑
  editPropagandaPromote ({ state }, params) {
    const { propagandaPromoteUrl } = PROPAGANDA
    return axios.put(state.URL + propagandaPromoteUrl + `/${params.id}`, params.data, {
      yxb: true
    })
  },
  //审核
  checkPropagandaPromote ({ state }, params) {
    const { checkPropagandaPromoteUrl } = PROPAGANDA
    return axios.post(state.URL + checkPropagandaPromoteUrl, params.data, {
      yxb: true
    })
  },
  // 获取宣传项目列表
  getPropagandaPromoteProjectList ({ state }, params) {
    const { propagandaPromoteProjectListUrl } = PROPAGANDA
    return axios.get(state.URL + propagandaPromoteProjectListUrl, {
      params: params.data,
      yxb: true
    })
  },
}