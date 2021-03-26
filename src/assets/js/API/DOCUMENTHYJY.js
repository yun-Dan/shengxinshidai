import axios from 'axios'

/** @会议纪要 **/
export const DOCUMENTHYJY = {
  documentHyjyUrl: '/admin/meeting',
  scrapDocumentHyjyUrl: '/admin/meeting/scrap', // 报废
  archiveDocumentHyjyUrl: '/admin/meeting/archive', // 归档
  checkDocumentHyjyUrl: '/admin/meeting/status', // 审核
  checkChuDocumentHyjyUrl: '/admin/meeting/statuzhi', // 处长审核
  lssuedDocumentHyjyUrl: '/admin/meeting/lssued', // 下发
  situationDocumentHyjyUrl: '/admin/meeting/situation', // 下发详情
  signDocumentHyjyUrl: '/admin/meeting/pro_sub_sign' // 签章
}
export const actionsdocumentHyjy = {
  // 获取列表（或详情）
  getDocumentHyjyList ({ state }, params) {
    const {
      documentHyjyUrl
    } = DOCUMENTHYJY
    return axios.get(state.URL + documentHyjyUrl, {
      params: params.data,
    })
  },
  // 新增
  addDocumentHyjy ({ state }, params) {
    const {
      documentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + documentHyjyUrl, params.data)
  },
  //编辑
  editDocumentHyjy ({ state }, params) {
    const {
      documentHyjyUrl
    } = DOCUMENTHYJY
    return axios.put(state.URL + documentHyjyUrl + `/${params.id}`, params.data)
  },
  //删除
  deleteDocumentHyjy ({ state }, params) {
    const {
      documentHyjyUrl
    } = DOCUMENTHYJY
    return axios.delete(state.URL + documentHyjyUrl + `/${params.id}`, params.data)
  },
  //报废
  scrapDocumentHyjy ({ state }, params) {
    const {
      scrapDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + scrapDocumentHyjyUrl, params.data)
  },
  //归档
  archiveDocumentHyjy ({ state }, params) {
    const {
      archiveDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + archiveDocumentHyjyUrl, params.data)
  },
  //审核
  checkDocumentHyjy ({ state }, params) {
    const {
      checkDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + checkDocumentHyjyUrl, params.data)
  },
  //处长审核
  checkChuDocumentHyjy ({ state }, params) {
    const {
      checkChuDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + checkChuDocumentHyjyUrl, params.data)
  },
  //下发
  lssuedDocumentHyjy ({ state }, params) {
    const {
      lssuedDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + lssuedDocumentHyjyUrl, params.data)
  },
  // 获取下发详情
  situationDocumentHyjy ({ state }, params) {
    const {
      situationDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.get(state.URL + situationDocumentHyjyUrl, {
      params: params.data,
    })
  },
  //签章
  signDocumentHyjy ({ state }, params) {
    const {
      signDocumentHyjyUrl
    } = DOCUMENTHYJY
    return axios.post(state.URL + signDocumentHyjyUrl, params.data)
  },
}