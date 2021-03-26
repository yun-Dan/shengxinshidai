import axios from 'axios'

/** @证书 **/
export const CERTIFICATE = {
  certificatesUrl: '/admin/certificates',
  certificatesCheckUrl: '/admin/certificates/review', // 证书审核
  certificatesLockUrl: '/admin/certificates/lock', // 证书锁定
  certificatesSubmitUrl: '/admin/certificates/submit', // 提交审核
  certificatesStudentsUrl: '/admin/certificates/getcertinfo', // 获取证书申领学生信息

  certificatesModifyUrl: '/admin/certificates/create_modify', // 新增修改申请
  certificatesModifyListUrl: '/admin/certificates/modify_lists', // 修改申领列表
  certificatesModifyCheckUrl: '/admin/certificates/review_modify', // 审核修改申请

  /*旧版证书结算*/
  // certificatesBalanceListUrl0:'/admin/certificates/balance_lists', // 证书结算列表
  // certificatesBalanceUrl0:'/admin/certificates/read_balance', // 获取证书结算数据
  // addCertificatesBalanceUrl0:'/admin/certificates/create_balance', // 新增证书结算
  // updateCertificatesBalanceUrl0:'/admin/certificates/update_balance', // 修改证书结算
  // checkCertificatesBalanceUrl0:'/admin/certificates/review_balance', // 审核证书结算

  /*新版证书结算*/
  certificatesBalanceApplyListUrl: '/admin/cert_settlement/certlist', // 证书申领列表
  certificatesBalanceListUrl: '/admin/cert_settlement/index', // 证书结算列表
  certificatesBalanceUrl1: '/admin/cert_settlement/showsett', // 获取证书结算数据
  certificatesBalanceUrl2: '/attachment/settlement', // 扫描获取证书结算详情
  addCertificatesBalanceUrl: '/admin/cert_settlement/createsett', // 新增证书结算
  updateCertificatesBalanceUrl: '/admin/cert_settlement/updatesett', // 修改证书结算
  checkCertificatesBalanceUrl: '/admin/cert_settlement/reviewsett' // 审核证书结算
}
export const actionscertificate = {
  /** 获取证书申领列表 **/
  getCertificatesData ({ state }, params) {
    const { certificatesUrl } = CERTIFICATE
    return axios.get(state.URL + certificatesUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取证书申领信息 **/
  getCertificatesId ({ state }, params) {
    const { certificatesUrl } = CERTIFICATE
    return axios.get(state.URL + certificatesUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 新增证书申领 **/
  addCertificates ({ state }, params) {
    const { certificatesUrl } = CERTIFICATE
    return axios.post(state.URL + certificatesUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑证书申领 **/
  updateCertificates ({ state }, params) {
    const { certificatesUrl } = CERTIFICATE
    return axios.put(state.URL + certificatesUrl + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 证书审核 **/
  certificatesCheck ({ state }, params) {
    const { certificatesCheckUrl } = CERTIFICATE
    return axios.post(state.URL + certificatesCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 证书锁定 **/
  certificatesLock ({ state }, params) {
    const { certificatesLockUrl } = CERTIFICATE
    return axios.post(state.URL + certificatesLockUrl, params.data, {
      yxb: true
    })
  },
  /** 提交审核 **/
  certificatesSubmit ({ state }, params) {
    const { certificatesSubmitUrl } = CERTIFICATE
    return axios.post(state.URL + certificatesSubmitUrl, params.data, {
      yxb: true
    })
  }, //
  /** 获取证书申领学生信息及证书信息 **/
  getCertificatesStudentsData ({ state }, params) {
    const { certificatesStudentsUrl } = CERTIFICATE
    return axios.get(state.URL + certificatesStudentsUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 新增修改申请 **/
  addCertificatesModify ({ state }, params) {
    const { certificatesModifyUrl } = CERTIFICATE
    return axios.post(state.URL + certificatesModifyUrl, params.data, {
      yxb: true
    })
  },
  /** 获取修改申请列表 **/
  getCertificatesModifyList ({ state }, params) {
    const { certificatesModifyListUrl } = CERTIFICATE
    return axios.get(state.URL + certificatesModifyListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 审核修改申请 **/
  checkCertificatesModify ({ state }, params) {
    const { certificatesModifyCheckUrl } = CERTIFICATE
    return axios.post(state.URL + certificatesModifyCheckUrl, params.data, {
      yxb: true
    })
  },

  /** 证书申领列表 **/
  getCertificatesBalanceApplyList ({ state }, params) {
    const { certificatesBalanceApplyListUrl } = CERTIFICATE
    return axios.get(state.URL + certificatesBalanceApplyListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 证书结算列表 **/
  getCertificatesBalanceList ({ state }, params) {
    const { certificatesBalanceListUrl } = CERTIFICATE
    return axios.get(state.URL + certificatesBalanceListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 证书结算数据 **/
  getCertificatesBalance ({ state }, params) {
    const { certificatesBalanceUrl2, certificatesBalanceUrl1 } = CERTIFICATE
    return axios.get(state.URL + (params.front ? certificatesBalanceUrl2 : certificatesBalanceUrl1), {
      params: params.data,
      yxb: true
    })
  },
  /** 新增证书结算 **/
  addCertificatesBalance ({ state }, params) {
    const { addCertificatesBalanceUrl } = CERTIFICATE
    return axios.post(state.URL + addCertificatesBalanceUrl, params.data, {
      yxb: true
    })
  },
  /** 修改证书结算 **/
  updateCertificatesBalance ({ state }, params) {
    const { updateCertificatesBalanceUrl } = CERTIFICATE
    return axios.post(state.URL + updateCertificatesBalanceUrl, params.data, {
      yxb: true
    })
  },
  /** 审核证书结算 **/
  checkCertificatesBalance ({ state }, params) {
    const { checkCertificatesBalanceUrl } = CERTIFICATE
    return axios.post(state.URL + checkCertificatesBalanceUrl, params.data, {
      yxb: true
    })
  },
}