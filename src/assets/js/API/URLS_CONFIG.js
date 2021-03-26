import axios from 'axios'

/** @接口配置（基础接口） **/

export const URLS_CONFIG = {
  /** 登录接口 **/
  loginUrl: '/admin/base/login', // 用户登录
  logoutUrl: '/admin/base/logout', // 退出登录
  weChatUrl: '/qyweixin/url', // 获取企业号扫码地址
  weChatLoginUrl: '/qyweixin/login', // 微信登录
  /** 地区接口 **/
  provincesUrl: '/admin/provinces', // 获取地区列表
  /** 登录日志 **/
  configLogUrl: '/admin/userlog/index', // 用户登录日志列表
  deleteConfigLogUrl: '/admin/userlog/deletes', // 删除登录日志
  /**  平台中心   **/
  documentNewsNumUrl: '/admin/base/resm' // 管理员用户当前“待办公文”及“未读消息”统计
}
export const actionsOBJ = {
  /** 登录 **/
  userLogin ({ state }, params) {
    const { loginUrl } = URLS_CONFIG
    return axios.post(state.URL + loginUrl, params.data)
  },
  /** 退出 **/
  logout ({ state }, params) {
    const { logoutUrl } = URLS_CONFIG
    return axios.post(state.URL + logoutUrl, params.data)
  },
  /** 获取企业号扫码地址 **/
  weChatLogin ({ state }, params) {
    const { weChatUrl } = URLS_CONFIG
    return axios.get(state.URL + weChatUrl)
  },
  /** 微信登录 **/
  weChatLoginIn ({ state }, params) {
    const { weChatLoginUrl } = URLS_CONFIG
    return axios.get(state.URL + weChatLoginUrl, {
      params: params.data
    })
  },
  /** 获取省市列表 **/
  getProvinces(context, params) {
    const { provincesUrl } = URLS_CONFIG
    const A = axios.get(context.state.URL + provincesUrl, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editProvincesData', data.data.data)
    })
    return A
  },
  /** 获取用户登录日志列表 **/
  getConfigLogList ({ state }, params) {
    const { configLogUrl } = URLS_CONFIG
    return axios.get(state.URL + configLogUrl, {
      params: params.data,
    })
  },
  deleteConfigLog ({ state }, params) {
    const { deleteConfigLogUrl } = URLS_CONFIG
    return axios.post(state.URL + deleteConfigLogUrl, params.data)
  },
  /** “待办公文”及“未读消息”统计 **/
  getDocumentNewsNum (context, params) {
    const { documentNewsNumUrl } = URLS_CONFIG
    return axios.post(context.state.URL + documentNewsNumUrl, params.data).then(data => {
      if (data.data.code === 200) {
        context.commit('editDocumentNews', data.data.data)
      }
    })
  }
}
