import axios from 'axios'

/** @学院部门 **/
export const STRUCTURE = {
  structuresUrl: '/admin/structures', // 学院/部门
  deleteSelectedStructures: '/admin/structures/deletes', // 批量删除学院部门
  changeStatusStructures: '/admin/structures/enables' // 批量修改学院部门状态
}
export const actionsstructure = {
  /** 获取学院和部门列表 **/
  getStructures (context, params) {
    const { structuresUrl } = STRUCTURE
    const A = axios.get(context.state.URL + structuresUrl, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editStructuresList', data.data.data)
    })
    return A
  },
  /** 获取学院/部门详情 **/
  getStructureId (context, params) {
    const { structuresUrl } = STRUCTURE
    const A = axios.get(context.state.URL + structuresUrl + '/' + params.id)
    A.then(data => {
      context.commit('editStructuresId', data.data.data)
    })
    return A
  },
  /** 新增学院/部门 **/
  addStructure ({ state }, params) {
    const { structuresUrl } = STRUCTURE
    return axios.post(state.URL + structuresUrl, params.data)
  },
  /** 编辑学院部门 **/
  updateStructure ({ state }, params) {
    const { structuresUrl } = STRUCTURE
    return axios.put(state.URL + structuresUrl + '/' + params.id, params.data)
  },
  /** 删除学院部门 **/
  deleteStructure ({ state }, params) {
    const { structuresUrl } = STRUCTURE
    return axios.delete(state.URL + structuresUrl + '/' + params.id, {
      params: params.data,
    })
  },
  /** 批量删除学院部门 **/
  deleteSelectedStructure ({ state }, params) {
    const { deleteSelectedStructures } = STRUCTURE
    return axios.post(state.URL + deleteSelectedStructures, params.data)
  }
}