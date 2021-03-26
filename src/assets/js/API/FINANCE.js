import axios from 'axios'

/** @财务管理 **/
export const FINANCE = {
  //结算
  financeAccountProUrl: '/admin/balance/proindex', //结算项目列表
  financeAccountUrl: '/admin/balance', // 结算
  financeAccountCreateUrl: '/admin/balance/createpage', // 获取新增结算的项目相关信息
  checkFinanceAccountUrl: '/admin/balance/audit', // 审核结算
  lockFinanceAccountUrl: '/admin/balance/ynlock', // 锁定审核
  printFinanceAccountUrl1: '/admin/balance/printnews', // 打印结算(登录验证)
  printFinanceAccountUrl2: '/attachment/balanceindex', // 打印结算(不需要登录验证)
  financeAccountDeleteBoxUrl: '/admin/balance/proindexhis', // 获取结算回收站
  restoreFinanceAccountUrl: '/admin/balance/restore', // 还原结算
  financeAccountSettlementUserUrl: '/admin/balance/settlement_user', // 获取结算结果部门与人员信息
  //报销

  financeExpenseProUrl: '/admin/reimburse/proindex', // 报销项目列表

  financeChargeListUrl: '/admin/fee/projects', // 获取已缴费项目列表
  financeChargeInfoUrl: '/admin/fee', // 项目收费详情
  financeChargeLinkUrl: '/admin/fee/sso' // 获取单点登录信息
}
export const actionsfinance = {
  /** 获取结算项目列表 **/
  financeAccountPro ({ state }, params) {
    const { financeAccountProUrl } = FINANCE
    return axios.get(state.URL + financeAccountProUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取结算详情 **/
  getFinanceAccountInfo ({ state }, params) {
    const { financeAccountUrl } = FINANCE
    return axios.get(state.URL + financeAccountUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 获取新增结算项目的相关信息 **/
  getFinanceAccountCreateInfo ({ state }, params) {
    const { financeAccountCreateUrl } = FINANCE
    return axios.get(state.URL + financeAccountCreateUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增结算 **/
  addFinanceAccount ({ state }, params) {
    const { financeAccountUrl } = FINANCE
    return axios.post(state.URL + financeAccountUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑结算 **/
  updateFinanceAccount ({ state }, params) {
    const { financeAccountUrl } = FINANCE
    return axios.put(state.URL + financeAccountUrl + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 删除结算 **/
  deleteFinanceAccount ({ state }, params) {
    const { financeAccountUrl } = FINANCE
    return axios.delete(state.URL + financeAccountUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 提交结算/提交审核 **/
  checkFinanceAccount ({ state }, params) {
    const { checkFinanceAccountUrl } = FINANCE
    return axios.post(state.URL + checkFinanceAccountUrl, params.data, {
      yxb: true
    })
  },
  /** 锁定审核 **/
  lockFinanceAccount ({ state }, params) {
    const { lockFinanceAccountUrl } = FINANCE
    return axios.post(state.URL + lockFinanceAccountUrl, params.data, {
      yxb: true
    })
  },
  /** 打印结算信息 **/
  printFinanceAccount ({ state }, params) {
    const { printFinanceAccountUrl1, printFinanceAccountUrl2 } = FINANCE
    return axios.get(state.URL + (params.front ? printFinanceAccountUrl2 : printFinanceAccountUrl1), {
      params: params.data,
      yxb: true
    })
  },
  /** 结算回收站 **/
  getFinanceAccountDeleteBox ({ state }, params) {
    const { financeAccountDeleteBoxUrl } = FINANCE
    return axios.get(state.URL + financeAccountDeleteBoxUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 还原结算 **/
  restoreFinanceAccount ({ state }, params) {
    const { restoreFinanceAccountUrl } = FINANCE
    return axios.post(state.URL + restoreFinanceAccountUrl, params.data, {
      yxb: true
    })
  },
  /** 获取结算详情 **/
  getFinanceAccountSettlementUser ({ state }, params) {
    const { financeAccountSettlementUserUrl } = FINANCE
    return axios.get(state.URL + financeAccountSettlementUserUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取报销项目列表 **/
  financeExpensePro ({ state }, params) {
    const {
      financeExpenseProUrl
    } = FINANCE
    return axios.get(state.URL + financeExpenseProUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取已缴费项目列表**/
  getFinanceChargeList ({ state }, params) {
    const {
      financeChargeListUrl
    } = FINANCE
    return axios.get(state.URL + financeChargeListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取项目收费详情 **/
  getFinanceChargeInfo ({ state }, params) {
    const {
      financeChargeInfoUrl
    } = FINANCE
    return axios.get(state.URL + financeChargeInfoUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取单点登录信息 **/
  getFinanceChargeLink ({ state }, params) {
    const {
      financeChargeLinkUrl
    } = FINANCE
    return axios.post(state.URL + financeChargeLinkUrl, params.data, {
      yxb: true
    })
  },
}