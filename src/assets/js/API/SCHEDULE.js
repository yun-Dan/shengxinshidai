import axios from 'axios'

/** @日程管理 **/
export const SCHEDULE = {
  scheduleUrl: '/admin/schedule'
}
export const actionsschedule = {
  // 获取列表
  getScheduleList ({ state }, params) {
    const {
      scheduleUrl
    } = SCHEDULE
    return axios.get(state.URL + scheduleUrl, {
      params: params.data,
    })
  },
  // 新增
  addSchedule ({ state }, params) {
    const {
      scheduleUrl
    } = SCHEDULE
    return axios.post(state.URL + scheduleUrl, params.data)
  },
  //编辑
  editSchedule ({ state }, params) {
    const {
      scheduleUrl
    } = SCHEDULE
    return axios.put(state.URL + scheduleUrl + `/${params.id}`, params.data)
  },
  //删除
  deleteSchedule ({ state }, params) {
    const {
      scheduleUrl
    } = SCHEDULE
    return axios.delete(state.URL + scheduleUrl + `/${params.id}`, params.data)
  },
}