import axios from 'axios'

/** @项目申请修改 **/
export const PROMODIFY = {
  proModListUrl: '/admin/promod/havemod', // 获取项目未保存修改
  proModDeleteUrl: '/admin/promod/deleteapply', // 删除项目未保存的修改（不继续修改时调用）
  proModInfoUrlYh: '/admin/promod/getyhzc', // 获取项目优惠政策
  proModSubmitUrl: '/admin/promod/doapply', // 申请修改提交审核
  proModHistoryUrl: '/admin/promod/modlist', // 项目申请修改历史
  proModCheckUrl1: '/admin/promod/reject', // 项目申请审核（不通过）
  proModCheckUrl2: '/admin/promod/confirm', // 项目申请审核（通过）

  proModDeclareUrl: '/admin/promod/getprojectmod', //项目申请详情（分步）

  proModInfoUrl0: '/admin/promod/getproject', // 获取项目基础信息
  proModAddUrl0: '/admin/promod/diffproject', // 保存项目基础信息

  proModInfoUrl1: '/admin/promod/getcource', // 获取项目课程信息
  proModAddUrl1: '/admin/promod/diffcourse', // 保存

  proModInfoUrl2: '/admin/promod/getwt', // 获取项目委托单位
  proModAddUrl2: '/admin/promod/diffwt', // 保存

  proModInfoUrl3: '/admin/promod/getfz', // 获取项目辅助单位
  proModAddUrl3: '/admin/promod/difffz', // 保存

  proModInfoUrl5: '/admin/promod/gethz', // 获取项目校内合作单位
  proModAddUrl5: '/admin/promod/diffhz', // 保存

  proModInfoUrl4: '/admin/promod/getys', // 获取项目预算
  proModAddUrl4: '/admin/promod/diffys', // 保存
}
export const actionspromodify = {
  /** 申请修改未保存记录 **/
  getProModifyList ({ state }, params) { // 获取未保存修改的列表
    const { proModListUrl } = PROMODIFY
    return axios.get(state.URL + proModListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 删除申请修改未保存记录 **/
  deleteProModify ({ state }, params) {
    const { proModDeleteUrl } = PROMODIFY
    return axios.get(state.URL + proModDeleteUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 优惠政策 **/
  getProModifyInfoYh ({ state }, params) {
    const { proModInfoUrlYh } = PROMODIFY
    return axios.get(state.URL + proModInfoUrlYh, {
      params: params.data,
      yxb: true
    })
  },
  /** 项目申请修改提交 **/
  submitProModify ({ state }, params) {
    const { proModSubmitUrl } = PROMODIFY
    return axios.post(state.URL + proModSubmitUrl, params.data, {
      yxb: true
    })
  },
  /** 获取项目申请修改历史 **/
  getProModifyHistory ({ state }, params) { // 获取未保存修改的列表
    const { proModHistoryUrl } = PROMODIFY
    return axios.get(state.URL + proModHistoryUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 项目申请审核 **/
  checkProModify ({ state }, params) {
    const { proModCheckUrl1, proModCheckUrl2 } = PROMODIFY
    return axios.post(state.URL + (params.status === 1 ? proModCheckUrl1 : proModCheckUrl2), params.data, {
      yxb: true
    })
  },

  /** 获取申请修改的详情，用户打印 **/
  proModDeclare ({ state }, params) {
    const { proModDeclareUrl } = PROMODIFY
    return axios.get(state.URL + proModDeclareUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 项目基本信息 **/
  getProModifyInfo0 ({ state }, params) {
    const { proModInfoUrl0 } = PROMODIFY
    return axios.get(state.URL + proModInfoUrl0, {
      params: params.data,
      yxb: true
    })
  },
  addProModify0 ({ state }, params) {
    const { proModAddUrl0 } = PROMODIFY
    return axios.put(state.URL + proModAddUrl0, params.data, {
      yxb: true
    })
  },

  /** 课程 **/
  getProModifyInfo1 ({ state }, params) {
    const { proModInfoUrl1 } = PROMODIFY
    return axios.get(state.URL + proModInfoUrl1, {
      params: params.data,
      yxb: true
    })
  },
  addProModify1 ({ state }, params) {
    const { proModAddUrl1 } = PROMODIFY
    return axios.put(state.URL + proModAddUrl1, params.data, {
      yxb: true
    })
  },

  /** 委托 **/
  getProModifyInfo2 ({ state }, params) {
    const { proModInfoUrl2 } = PROMODIFY
    return axios.get(state.URL + proModInfoUrl2, {
      params: params.data,
      yxb: true
    })
  },
  addProModify2 ({ state }, params) {
    const { proModAddUrl2 } = PROMODIFY
    return axios.put(state.URL + proModAddUrl2, params.data, {
      yxb: true
    })
  },

  /** 辅助 **/
  getProModifyInfo3 ({ state }, params) {
    const { proModInfoUrl3 } = PROMODIFY
    return axios.get(state.URL + proModInfoUrl3, {
      params: params.data,
      yxb: true
    })
  },
  addProModify3 ({ state }, params) {
    const { proModAddUrl3 } = PROMODIFY
    return axios.put(state.URL + proModAddUrl3, params.data, {
      yxb: true
    })
  },

  /** 合作 **/
  getProModifyInfo5 ({ state }, params) {
    const { proModInfoUrl5 } = PROMODIFY
    return axios.get(state.URL + proModInfoUrl5, {
      params: params.data,
      yxb: true
    })
  },
  addProModify5 ({ state }, params) {
    const { proModAddUrl5 } = PROMODIFY
    return axios.put(state.URL + proModAddUrl5, params.data, {
      yxb: true
    })
  },

  /** 预算 **/
  getProModifyInfo4 ({ state }, params) {
    const { proModInfoUrl4 } = PROMODIFY
    return axios.get(state.URL + proModInfoUrl4, {
      params: params.data,
      yxb: true
    })
  },
  addProModify4 ({ state }, params) {
    const { proModAddUrl4 } = PROMODIFY
    return axios.put(state.URL + proModAddUrl4, params.data, {
      yxb: true
    })
  }
}