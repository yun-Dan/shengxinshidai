import axios from 'axios'

/** @信访登记 **/
export const DOCUMENTXFDJ = {
  documentXfdjUrl: '/admin/reporting',
  checkDocumentXfdjUrl: '/admin/reporting/status', // 审核
  checkChuDocumentXfdjUrl: '/admin/reporting/statuzhi' // 处长审核
}
export const actionsdocumentXfdj = {
  // 获取列表
  getDocumentXfdjList ({ state }, params) {
    const {
      documentXfdjUrl
    } = DOCUMENTXFDJ
    return axios.get(state.URL + documentXfdjUrl, {
      params: params.data,
    })
  },
  // 新增
  addDocumentXfdj({ state }, params) {
    const {
      documentXfdjUrl
    } = DOCUMENTXFDJ
    return axios.post(state.URL + documentXfdjUrl, params.data)
  },
  //编辑
  editDocumentXfdj({ state }, params) {
    const {
      documentXfdjUrl
    } = DOCUMENTXFDJ
    return axios.put(state.URL + documentXfdjUrl + `/${params.id}`, params.data)
  },
  //删除
  deleteDocumentXfdj({ state }, params) {
    const {
      documentXfdjUrl
    } = DOCUMENTXFDJ
    return axios.delete(state.URL + documentXfdjUrl + `/${params.id}`, params.data)
  },
  //审核
  checkDocumentXfdj({ state }, params) {
    const {
      checkDocumentXfdjUrl
    } = DOCUMENTXFDJ
    return axios.post(state.URL + checkDocumentXfdjUrl, params.data)
  },
  //处长审核
  checkChuDocumentXfdj({ state }, params) {
    const {
      checkChuDocumentXfdjUrl
    } = DOCUMENTXFDJ
    return axios.post(state.URL + checkChuDocumentXfdjUrl, params.data)
  },
}