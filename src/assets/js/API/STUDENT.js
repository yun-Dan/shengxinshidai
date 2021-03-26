import axios from 'axios'

/** @学员 **/
export const STUDENT = {
  studentsUrl: '/admin/persons', // 学员列表
  fontStudentUrl: '/attachment/stuindex', // 不登录获取学员列表
  delSelectedStudents: '/admin/persons/batdel', // 批量删除学员
  personsImportUrl: '/admin/persons/impexcel', // 学员导入
  exportStudentUrl: '/admin/persons/expexcel', // 学员导出
  studentsCheckUrl: '/admin/persons/audit' // 学员审核
}
export const actionsstudent = {
  /** 获取学员列表 **/
  getStudentsData ({ state }, params) {
    const { studentsUrl, fontStudentUrl } = STUDENT
    return axios.get(state.URL + (params.font ? studentsUrl : fontStudentUrl), {
      params: params.data,
      yxb: true
    })
  },
  /** 获取学员详情 **/
  getStudentsId ({ state }, params) {
    const { studentsUrl } = STUDENT
    return axios.get(state.URL + studentsUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 新增学员 **/
  addStudents ({ state }, params) {
    const { studentsUrl } = STUDENT
    return axios.post(state.URL + studentsUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑学员 **/
  updateStudents ({ state }, params) {
    const { studentsUrl } = STUDENT
    return axios.put(state.URL + studentsUrl + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 删除学员 **/
  deleteStudents ({ state }, params) {
    const { studentsUrl } = STUDENT
    return axios.delete(state.URL + studentsUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 批量删除学员 **/
  deleteSelectedStudents ({ state }, params) {
    const { delSelectedStudents } = STUDENT
    return axios.post(state.URL + delSelectedStudents, params.data, {
      yxb: true
    })
  },
  /** 学员审核 **/
  studentsCheck ({ state }, params) {
    const { studentsCheckUrl } = STUDENT
    return axios.post(state.URL + studentsCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 导入学员 **/
  personsImport ({ state }, params) {
    const { personsImportUrl } = STUDENT
    return axios.post(state.URL + personsImportUrl, params.data, {
      yxb: true
    })
  },
  /** 导出学员 **/
  exportStudent ({ state }, params) {
    const { exportStudentUrl } = STUDENT
    return axios.get(state.URL + exportStudentUrl, {
      params: params.data,
      yxb: true
    })
  }
}