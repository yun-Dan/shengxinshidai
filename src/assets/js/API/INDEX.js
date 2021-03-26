import axios from 'axios'

/** @首页接口 **/
export const INDEX = {
  totalNumUrl: '/admin/homepage/coutindex', // 统计数量
  indexMapUrl: '/admin/homepage/mapindex', // 地图
  indexLineUrl: '/admin/homepage/lineindex', // 折线
  indexWaitUrl: '/admin/homepage/wcoutindex' // 待审核
}
export const actionsindex = {
  getTotalNum ({ state }, params) {
    const { totalNumUrl } = INDEX
    return axios.get(state.URL + totalNumUrl, {
      yxb: true
    })
  },
  getIndexMap ({ state }, params) {
    const { indexMapUrl } = INDEX
    return axios.get(state.URL + indexMapUrl, {
      params: params.data,
      yxb: true
    })
  },
  getIndexLine ({ state }, params) {
    const { indexLineUrl } = INDEX
    return axios.get(state.URL + indexLineUrl, {
      params: params.data,
      yxb: true
    })
  },
  getIndexWait ({ state }, params) {
    const { indexWaitUrl } = INDEX
    return axios.get(state.URL + indexWaitUrl, {
      yxb: true
    })
  }
}