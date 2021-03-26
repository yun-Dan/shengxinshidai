import axios from 'axios'

/** @辅助单位管理 **/
export const HELPER = {
  helperunitUrl: '/admin/helperunit/index', // 获取委托单位列表
  helperunitInfoUrl: '/admin/helperunit/showprolist', // 获取委托单位的项目 /班级详情列表
  helperunitBlackUrl: '/admin/helperunit/setblack', // 黑名单设置
  helperunitAddBlackUrl: '/admin/helperunit', // 添加黑名单设置 /admin/helperunit/gethnrecords/:helper_unit_id
  helperunitMarkUrl: '/admin/helperunit/decfzmark' // 辅助单位打分
}
export const actionshelper = {
  getHelperunit ({ state }, params) {
    const { helperunitUrl } = HELPER
    return axios.get(state.URL + helperunitUrl, {
      params: params.data,
      yxb: true
    })
  },
  getHelperunitInfo ({ state }, params) {
    const { helperunitInfoUrl } = HELPER
    return axios.get(state.URL + helperunitInfoUrl, {
      params: params.data,
      yxb: true
    })
  },
  helperunitBlack ({ state }, params) {
    const { helperunitBlackUrl } = HELPER
    return axios.get(state.URL + helperunitBlackUrl, {
      params: params.data,
      yxb: true
    })
  },
  helperunitAddBlack ({ state }, params) {
    const { helperunitAddBlackUrl } = HELPER
    return axios.post(state.URL + helperunitAddBlackUrl, params.data, {
      yxb: true
    })
  },
  helperunitMark ({ state }, params) {
    const { helperunitMarkUrl } = HELPER
    return axios.post(state.URL + helperunitMarkUrl, params.data, {
      yxb: true
    })
  }
}