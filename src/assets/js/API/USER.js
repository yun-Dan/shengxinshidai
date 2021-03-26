import axios from 'axios'

/** @用户接口 **/
export const USER = {
  usersUrl: '/admin/users', // 用户管理
  deleteSelectedUsers: '/admin/users/deletes', // 批量删除用户
  changeStatus: '/admin/users/enables' // 批量修改用户状态
}
export const actionsuser = {
  /** 获取用户列表 **/
  getUsers (context, params) {
    const { usersUrl } = USER
    const A = axios.get(context.state.URL + usersUrl, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editUsersList', data.data.data)
    })
    return A
  },
  /** 获取用户详情 **/
  getUserId (context, params) { // 获取用户详情
    const { usersUrl } = USER
    const A = axios.get(context.state.URL + usersUrl + '/' + params.id)
    A.then(data => {
      context.commit('editUserId', data.data.data)
    })
    return A
  },
  /** 新增用户 **/
  addUser ({ state }, params) {
    const { usersUrl } = USER
    return axios.post(state.URL + usersUrl, params.data)
  },
  /** 修改用户 **/
  updateUser ({ state }, params) { // 编辑用户
    const { usersUrl } = USER
    return axios.put(state.URL + usersUrl + '/' + params.id, params.data)
  },
  /** 删除用户 **/
  deleteUser ({ state }, params) { // 删除用户
    const { usersUrl } = USER
    return axios.delete(state.URL + usersUrl + '/' + params.id)
  },
  /** 批量删除用户 **/
  deleteSelectedUser ({ state }, params) {
    const { deleteSelectedUsers } = USER
    return axios.post(state.URL + deleteSelectedUsers, params.data)
  },
  /** 批量修改用户状态启用、禁用 **/
  changeStatusUsers ({ state }, params) {
    const { changeStatus } = USER
    return axios.post(state.URL + changeStatus, params.data)
  }
}