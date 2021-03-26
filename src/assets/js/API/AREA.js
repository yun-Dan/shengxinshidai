import axios from 'axios'

/** @地区管理 **/
export const AREA = {
  areaListUrl: '/admin/provinces', // 地区
  areaDeleteSelectedUrl: '/admin/provinces/deletes' // 地区
}
export const actionsarea = {
  /** 获取地区列表 **/
  getAreaList ({ state }, params) {
    const {
      areaListUrl
    } = AREA
    return axios.get(state.URL + areaListUrl, {
      params: params.data,
    })
  },
  /** 获取地区详情 **/
  getAreaInfo ({ state }, params) {
    const {
      areaListUrl
    } = AREA
    return axios.get(state.URL + areaListUrl + '/' + params.id)
  },
  /** 新增地区 **/
  addArea ({ state }, params) {
    const {
      areaListUrl
    } = AREA
    return axios.post(state.URL + areaListUrl, params.data)
  },
  /** 编辑地区 **/
  updateArea ({ state }, params) {
    const {
      areaListUrl
    } = AREA
    return axios.put(state.URL + areaListUrl + '/' + params.id, params.data)
  },
  /** 删除地区 **/
  deleteArea ({ state }, params) {
    const {
      areaListUrl
    } = AREA
    return axios.delete(state.URL + areaListUrl + '/' + params.id)
  },
  /** 批量删除地区 **/
  deleteSelectedArea ({ state }, params) {
    const {
      areaDeleteSelectedUrl
    } = AREA
    return axios.post(state.URL + areaDeleteSelectedUrl, params.data)
  },
}