import axios from 'axios'

/** @专业管理 **/
export const PROFESSIONAL = {
  professionalUrl: '/admin/professional'
}
export const actionsprofessional = {
  /** 获取专业列表 **/
  getProfessionalList ({ state }, params) {
    const {
      professionalUrl
    } = PROFESSIONAL
    return axios.get(state.URL + professionalUrl, {
      params: params.data,
    })
  },
  /** 获取详情 **/
  getProfessionalInfo ({ state }, params) {
    const {
      professionalUrl
    } = PROFESSIONAL
    return axios.get(state.URL + professionalUrl + '/' + params.id)
  },
  /** 新增 **/
  addProfessional ({ state }, params) {
    const {
      professionalUrl
    } = PROFESSIONAL
    return axios.post(state.URL + professionalUrl, params.data)
  },
  /** 编辑 **/
  updateProfessional ({ state }, params) {
    const {
      professionalUrl
    } = PROFESSIONAL
    return axios.put(state.URL + professionalUrl + '/' + params.id, params.data)
  },
  /** 删除 **/
  deleteProfessional ({ state }, params) {
    const {
      professionalUrl
    } = PROFESSIONAL
    return axios.delete(state.URL + professionalUrl + '/' + params.id)
  }
}