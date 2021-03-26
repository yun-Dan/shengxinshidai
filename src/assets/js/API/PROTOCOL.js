import axios from 'axios'

/** @协议 **/
export const PROTOCOL = {
  modifyUrl: '/admin/contracts/modify_lists', // 协议修改申请列表
  createModify: '/admin/contracts/create_modify', // 新增申请修改
  reviewModify: '/admin/contracts/review_modify', // 审核协议申请修改

  projectWtUrl: '/admin/contracts/wt_lists', //项目委托单位
  wtProtocolUrl: '/admin/contracts/read_contract_wt', // 委托协议信息
  wtProtocolUrl2: '/attachment/contract_wt', // 前台获取委托协议信息
  wtProtocolUrl3: '/admin/contracts/read_contract_wt_proid', // 根据项目id获取委托协议信息（结算打印）
  wtAddUrl: '/admin/contracts/create_wt', // 新增委托协议
  wtEditUrl: '/admin/contracts/update_wt', // 编辑委托协议
  wtEditNonstandardUrl: '/admin/contracts/update_wtnot', //（非标准）委托协议编辑
  wtSubmitUrl: '/admin/contracts/submit_wt', // 委托协议提交
  wtCheckUrl: '/admin/contracts/review_wt', // 委托协议审核
  wtCheckNonstandardUrl: '/admin/contracts/date_wtnot_other', //（非标准）委托协议审核
  changeProtocolStatusUrlWt1: '/admin/contracts/enable_wt', // 委托协议还原
  changeProtocolStatusUrlWt2: '/admin/contracts/disable_wt', // 委托协议禁用
  signWtProtocolUrl: '/admin/contracts/sign_wt', //委托协议签署状态

  projectFzUrl: '/admin/contracts/fz_lists', // 项目辅助单位
  fzProtocolUrl: '/admin/contracts/read_contract_fz', // 辅助协议信息
  fzProtocolUrl2: '/attachment/contract_fz', // 前台获取辅助协议信息
  fzAddUrl: '/admin/contracts/create_fz', // 新增辅助协议
  fzEditUrl: '/admin/contracts/update_fz', // 编辑辅助协议
  fzSubmitUrl: '/admin/contracts/submit_fz', // 辅助协议提交
  fzCheckUrl: '/admin/contracts/review_fz', // 辅助协议审核
  changeProtocolStatusUrl1: '/admin/contracts/enable_fz', // 辅助协议还原
  changeProtocolStatusUrl2: '/admin/contracts/disable_fz', // 辅助协议禁用
  signFzProtocolUrl: '/admin/contracts/sign_fz', // 辅助协议签署状态

  projectOtherListUrl: '/admin/contracts/other_pro_lists', // 项目列表
  projectOtherListUrl2: '/admin/contracts/audit_pro_lists', // 项目待审核列表
  projectOtherUrl: '/admin/contracts/other_lists', // 项目其他协议
  otherProtocolUrl1: '/admin/contracts/read_contract_other', // 其他协议信息
  otherProtocolUrl2: '/attachment/readContractOther', // 其他协议信息（前台）
  otherAddUrl: '/admin/contracts/create_other', // 新增其他协议
  otherEditUrl: '/admin/contracts/update_other', // 编辑其他协议
  otherSubmitUrl: '/admin/contracts/submit_other', // 提交其他协议
  otherCheckUrl: '/admin/contracts/review_other', // 审核其他协议
  changeOtherUrl: '/admin/contracts/enable_other', // 开启/禁用其他协议

  projectHzUrl: '/admin/contracts/hz_lists', //项目校内合作单位
  hzProtocolUrl: '/admin/contracts/read_contract_hz', // 校内合作信息
  hzProtocolUrl2: '/attachment/contract_hz', // 前台获取校内合作信息
  hzProtocolUrl3: '/admin/contracts/read_contract_hz_proid', // 根据项目id获取校内合作信息（结算打印）
  hzAddUrl: '/admin/contracts/create_hz', // 新增校内合作协议
  hzEditUrl: '/admin/contracts/update_hz', // 编辑校内合作协议
  hzEditNonstandardUrl: '/admin/contracts/update_hznot', //（非标准）校内合作协议编辑
  hzSubmitUrl: '/admin/contracts/submit_hz', // 校内合作协议提交
  hzCheckUrl: '/admin/contracts/review_hz', // 校内合作协议审核
  hzCheckNonstandardUrl: '/admin/contracts/date_hznot_other', //（非标准）校内合作协议审核
  changeProtocolStatusUrlHz1: '/admin/contracts/enable_hz', // 校内合作协议还原
  changeProtocolStatusUrlHz2: '/admin/contracts/disable_hz', // 校内合作协议禁用
  signHzProtocolUrl: '/admin/contracts/sign_hz', //校内合作协议签署状态
}
export const actionsprotocol = {
  /** 获取申请修改的协议列表 **/
  getModify ({ state }, params) {
    const { modifyUrl } = PROTOCOL
    return axios.get(state.URL + modifyUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增申请修改 **/
  addModify ({ state }, params) {
    const { createModify } = PROTOCOL
    return axios.post(state.URL + createModify, params.data, {
      yxb: true
    })
  },
  /**审核协议申请修改**/
  submitReviewModify ({ state }, params) {
    const { reviewModify } = PROTOCOL
    return axios.post(state.URL + reviewModify, params.data, {
      yxb: true
    })
  },

  /** 获取项目委托单位列表 **/
  getWtList ({ state }, params) {
    const { projectWtUrl } = PROTOCOL
    return axios.get(state.URL + projectWtUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取委托协议 **/
  getWtProtocol ({ state }, params) {
    const { wtProtocolUrl, wtProtocolUrl2, wtProtocolUrl3 } = PROTOCOL
    return axios.get(state.URL + (params.front ? wtProtocolUrl2 : params.all ? wtProtocolUrl3 : wtProtocolUrl), {
      params: params.data,
      yxb: true
    })
  },
  /** 新增委托协议 **/
  addWtProtocol ({ state }, params) {
    const { wtAddUrl } = PROTOCOL
    return axios.post(state.URL + wtAddUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑委托协议 **/
  updateWtProtocol ({ state }, params) {
    const { wtEditUrl } = PROTOCOL
    return axios.put(state.URL + wtEditUrl, params.data, {
      yxb: true
    })
  },
  /** 非标准委托协议编辑 **/
  wtEditNonstandard ({ state }, params) {
    const { wtEditNonstandardUrl } = PROTOCOL
    return axios.post(state.URL + wtEditNonstandardUrl, params.data, {
      yxb: true
    })
  },
  /** 提交委托协议 **/
  submitWt ({ state }, params) {
    const { wtSubmitUrl } = PROTOCOL
    return axios.post(state.URL + wtSubmitUrl, params.data, {
      yxb: true
    })
  },
  /** 审核委托协议 **/
  checkWt ({ state }, params) {
    const { wtCheckUrl } = PROTOCOL
    return axios.post(state.URL + wtCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 非标准委托协议审核 **/
  wtCheckNonstandard ({ state }, params) {
    const { wtCheckNonstandardUrl } = PROTOCOL
    return axios.post(state.URL + wtCheckNonstandardUrl, params.data, {
      yxb: true
    })
  },
  /** 委托协议报废、还原 **/
  changeProtocolStatusWt ({ state }, params) {
    const { changeProtocolStatusUrlWt1, changeProtocolStatusUrlWt2 } = PROTOCOL
    return axios.post(state.URL + (params.status === 1 ? changeProtocolStatusUrlWt1 : changeProtocolStatusUrlWt2), params.data, {
      yxb: true
    })
  },
  /** 委托协议签署状态修改 **/
  signWtProtocol ({ state }, params) {
    const { signWtProtocolUrl } = PROTOCOL
    return axios.post(state.URL + signWtProtocolUrl, params.data, {
      yxb: true
    })
  },

  /** 获取项目辅助单位列表 **/
  getFzList ({ state }, params) {
    const { projectFzUrl } = PROTOCOL
    return axios.get(state.URL + projectFzUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取辅助协议 **/
  getFzProtocol ({ state }, params) {
    const { fzProtocolUrl, fzProtocolUrl2 } = PROTOCOL
    return axios.get(state.URL + (params.front ? fzProtocolUrl2 : fzProtocolUrl), {
      params: params.data,
      yxb: true
    })
  },
  /** 新增辅助协议 **/
  addFzProtocol ({ state }, params) {
    const { fzAddUrl } = PROTOCOL
    return axios.post(state.URL + fzAddUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑辅助协议 **/
  updateFzProtocol ({ state }, params) {
    const { fzEditUrl } = PROTOCOL
    return axios.put(state.URL + fzEditUrl, params.data, {
      yxb: true
    })
  },
  /** 提交辅助协议 **/
  submitFz ({ state }, params) {
    const { fzSubmitUrl } = PROTOCOL
    return axios.post(state.URL + fzSubmitUrl, params.data, {
      yxb: true
    })
  },
  /** 审核辅助协议 **/
  checkFz ({ state }, params) {
    const { fzCheckUrl } = PROTOCOL
    return axios.post(state.URL + fzCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 辅助协议报废、还原 **/
  changeProtocolStatus ({ state }, params) {
    const { changeProtocolStatusUrl1, changeProtocolStatusUrl2 } = PROTOCOL
    return axios.post(state.URL + (params.status === 1 ? changeProtocolStatusUrl1 : changeProtocolStatusUrl2), params.data, {
      yxb: true
    })
  },
  /** 辅助协议签署状态修改 **/
  signFzProtocol ({ state }, params) {
    const { signFzProtocolUrl } = PROTOCOL
    return axios.post(state.URL + signFzProtocolUrl, params.data, {
      yxb: true
    })
  },

  /** 获取其他协议的项目列表 **/
  getOtherProjectList ({ state }, params) {
    const { projectOtherListUrl, projectOtherListUrl2 } = PROTOCOL
    return axios.get(state.URL + (params.is_check ? projectOtherListUrl2 : projectOtherListUrl), {
      params: params.data,
      yxb: true
    })
  },
  /** 获取项目的其他协议列表 **/
  getOtherList ({ state }, params) {
    const { projectOtherUrl } = PROTOCOL
    return axios.get(state.URL + projectOtherUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取其他协议 **/
  getOtherProtocol ({ state }, params) {
    const { otherProtocolUrl2, otherProtocolUrl1 } = PROTOCOL
    return axios.get(state.URL + (params.front ? otherProtocolUrl2 : otherProtocolUrl1), {
      params: params.data,
      yxb: true
    })
  },
  /** 新增其他协议 **/
  addOtherProtocol ({ state }, params) {
    const { otherAddUrl } = PROTOCOL
    return axios.post(state.URL + otherAddUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑其他协议 **/
  updateOtherProtocol ({ state }, params) {
    const { otherEditUrl } = PROTOCOL
    return axios.put(state.URL + otherEditUrl, params.data, {
      yxb: true
    })
  },
  /** 提交其他协议 **/
  submitOther ({ state }, params) {
    const { otherSubmitUrl } = PROTOCOL
    return axios.post(state.URL + otherSubmitUrl, params.data, {
      yxb: true
    })
  },
  /** 审核其他协议 **/
  checkOther ({ state }, params) {
    const { otherCheckUrl } = PROTOCOL
    return axios.post(state.URL + otherCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 开启/禁用其他协议 **/
  changeOther ({ state }, params) {
    const { changeOtherUrl } = PROTOCOL
    return axios.post(state.URL + changeOtherUrl, params.data, {
      yxb: true
    })
  },

  /** 获取校内合作协议的项目列表 **/
  getHzList ({ state }, params) {
    const { projectHzUrl } = PROTOCOL
    return axios.get(state.URL + projectHzUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取校内合作协议 **/
  getHzProtocol ({ state }, params) {
    const { hzProtocolUrl, hzProtocolUrl2, hzProtocolUrl3 } = PROTOCOL
    return axios.get(state.URL + (params.front ? hzProtocolUrl2 : params.all ? hzProtocolUrl3 : hzProtocolUrl), {
      params: params.data,
      yxb: true
    })
  },
  /** 新增校内合作协议 **/
  addHzProtocol ({ state }, params) {
    const { hzAddUrl } = PROTOCOL
    return axios.post(state.URL + hzAddUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑校内合作协议 **/
  updateHzProtocol ({ state }, params) {
    const { hzEditUrl } = PROTOCOL
    return axios.put(state.URL + hzEditUrl, params.data, {
      yxb: true
    })
  },
  /** 非标准校内合作协议编辑 **/
  hzEditNonstandard ({ state }, params) {
    const { hzEditNonstandardUrl } = PROTOCOL
    return axios.post(state.URL + hzEditNonstandardUrl, params.data, {
      yxb: true
    })
  },
  /** 提交校内合作协议 **/
  submitHz ({ state }, params) {
    const { hzSubmitUrl } = PROTOCOL
    return axios.post(state.URL + hzSubmitUrl, params.data, {
      yxb: true
    })
  },
  /** 审核校内合作协议 **/
  checkHz ({ state }, params) {
    const { hzCheckUrl } = PROTOCOL
    return axios.post(state.URL + hzCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 非标准校内合作协议审核 **/
  hzCheckNonstandard ({ state }, params) {
    const { hzCheckNonstandardUrl } = PROTOCOL
    return axios.post(state.URL + hzCheckNonstandardUrl, params.data, {
      yxb: true
    })
  },
  /** 校内合作协议报废、还原 **/
  changeProtocolStatusHz ({ state }, params) {
    const { changeProtocolStatusUrlHz1, changeProtocolStatusUrlHz2 } = PROTOCOL
    return axios.post(state.URL + (params.status === 1 ? changeProtocolStatusUrlHz1 : changeProtocolStatusUrlHz2), params.data, {
      yxb: true
    })
  },
  /** 校内合作协议签署状态修改 **/
  signHzProtocol ({ state }, params) {
    const { signHzProtocolUrl } = PROTOCOL
    return axios.post(state.URL + signHzProtocolUrl, params.data, {
      yxb: true
    })
  },
}