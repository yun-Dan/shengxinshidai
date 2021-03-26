import axios from 'axios'

/** @院内公文 **/
export const DOCUMENTYNGW = {
  documentYngwUrl: '/admin/document',
  scrapDocumentYngwUrl: '/admin/document/scrap', // 报废
  archiveDocumentYngwUrl: '/admin/document/archive', // 归档
  checkDocumentYngwUrl: '/admin/document/status', // 审核
  checkChuDocumentYngwUrl: '/admin/document/statuzhi', // 处长审核
  lssuedDocumentYngwUrl: '/admin/document/lssued', // 下发
  situationDocumentYngwUrl: '/admin/document/situation', // 下发详情
  signDocumentYngwUrl: '/admin/document/pro_sub_sign' // 签章
}
export const actionsdocumentYngw = {
  // 获取列表（或详情）
  getDocumentYngwList ({ state }, params) {
    const {
      documentYngwUrl
    } = DOCUMENTYNGW
    return axios.get(state.URL + documentYngwUrl, {
      params: params.data,
    })
  },
  // 新增
  addDocumentYngw ({ state }, params) {
    const {
      documentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + documentYngwUrl, params.data)
  },
  //编辑
  editDocumentYngw ({ state }, params) {
    const {
      documentYngwUrl
    } = DOCUMENTYNGW
    return axios.put(state.URL + documentYngwUrl + `/${params.id}`, params.data)
  },
  //删除
  deleteDocumentYngw ({ state }, params) {
    const {
      documentYngwUrl
    } = DOCUMENTYNGW
    return axios.delete(state.URL + documentYngwUrl + `/${params.id}`, params.data)
  },
  //报废
  scrapDocumentYngw ({ state }, params) {
    const {
      scrapDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + scrapDocumentYngwUrl, params.data)
  },
  //归档
  archiveDocumentYngw ({ state }, params) {
    const {
      archiveDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + archiveDocumentYngwUrl, params.data)
  },
  //审核
  checkDocumentYngw ({ state }, params) {
    const {
      checkDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + checkDocumentYngwUrl, params.data)
  },
  //处长审核
  checkChuDocumentYngw ({ state }, params) {
    const {
      checkChuDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + checkChuDocumentYngwUrl, params.data)
  },
  //下发
  lssuedDocumentYngw ({ state }, params) {
    const {
      lssuedDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + lssuedDocumentYngwUrl, params.data)
  },
  // 获取下发详情
  situationDocumentYngw ({ state }, params) {
    const {
      situationDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.get(state.URL + situationDocumentYngwUrl, {
      params: params.data,
    })
  },
  //签章
  signDocumentYngw ({ state }, params) {
    const {
      signDocumentYngwUrl
    } = DOCUMENTYNGW
    return axios.post(state.URL + signDocumentYngwUrl, params.data)
  },
}