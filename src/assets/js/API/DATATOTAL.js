import axios from 'axios'

/** @数据统计 **/
export const DATATOTAL = {
  dataTotalUrl: '/admin/stats/index'
}
export const actionsdatatotal = {
  /** 获取教室出借所在楼信息 **/
  getDataTotalList ({ state }, params) {
    const { dataTotalUrl } = DATATOTAL
    return axios.get(state.URL + dataTotalUrl, {
      params: params.data
    })
  }
}