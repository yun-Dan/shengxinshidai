import axios from 'axios'

/** @项目 **/
export const PROJECT = {
  projectConfigUrl: '/admin/base/getconfig', // 项目数据参数配置
  projectFields: '/admin/projects/lists', //  指定字段的项目列表（其他协议模块）
  projectPersons: '/admin/persons/proindex', //  审核通过的项目列表（学员管理模块）
  projectsForm0: '/admin/projects', // 项目
  projectYh: '/admin/projects/policy', // 项目的学员的优惠政策
  coursesForm1: '/admin/pro_courses', // 课程
  coursesImportUrl: '/admin/pro_courses/import', // 课程导入
  wtForm2: '/admin/pro_wt', // 委托单位
  fzForm3: '/admin/pro_fz', // 辅助单位
  hzForm5: '/admin/pro_hz', // 校内合作单位
  ysForm4: '/admin/pro_ys', // 预算
  proSubmitUrl: '/admin/projects/pro_submit', // 项目提交
  changeProStatus: '/admin/projects/enables', // 批量报废项目、恢复项目
  reviewUrl: '/admin/projects/review', // 项目审核
  projectCodeUrl: '/admin/projects/projectqrcode', // 二维码
  projectNoticeUrl: '/attachment/notice', // 扫码查看立项通知书信息
  projectSbsUrl: '/admin/projects/sbs', // 深圳苏州研究院提交申报书
  projectSubSignUrl: '/admin/projects/pro_sub_sign', // 项目提交并签章
  projectPublishUrl: '/admin/projects/publish' // 项目官方发布
}
export const actionsproject = {
  /** 项目配置参数 **/
  getProjectConfig ({ state }, params) {
    const { projectConfigUrl } = PROJECT
    return axios.get(state.URL + projectConfigUrl)
  },
  /** 获取项目列表 **/
  getProjectsData ({ state }, params) {
    const { projectsForm0 } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/index' : projectsForm0), {
      params: params.data,
      yxb: true
    })
  },
  /** 获取指定字段的项目列表 （其他模块等使用）**/
  getProjectFields ({ state }, params) {
    const { projectFields } = PROJECT
    return axios.get(state.URL + projectFields, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取审核通过的项目列表（学员管理模块） **/
  getProjectPersons ({ state }, params) {
    const { projectPersons } = PROJECT
    return axios.get(state.URL + projectPersons, {
      params: params.data,
      yxb: true
    })
  },
  /** 提交项目 **/
  submitProject ({ state }, params) {
    const { proSubmitUrl } = PROJECT
    return axios.post(state.URL + proSubmitUrl, params.data, {
      yxb: true
    })
  },
  /** 批量报废项目、恢复项目 **/
  changeProjectStatus ({ state }, params) {
    const { changeProStatus } = PROJECT
    return axios.post(state.URL + changeProStatus, params.data, {
      yxb: true
    })
  },
  /** 项目审核 **/
  projectReview ({ state }, params) {
    const { reviewUrl } = PROJECT
    return axios.post(state.URL + reviewUrl, params.data, {
      yxb: true
    })
  },
  /** 生成项目二维码 **/
  getProjectCode ({ state }, params) {
    const { projectCodeUrl } = PROJECT
    return axios.get(state.URL + projectCodeUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 扫码查看立项通知书信息 **/
  getProjectNotice ({ state }, params) {
    const { projectNoticeUrl } = PROJECT
    return axios.get(state.URL + projectNoticeUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 深圳苏州研究院提交申报书 **/
  AddProjectSbs ({ state }, params) {
    const { projectSbsUrl } = PROJECT
    return axios.post(state.URL + projectSbsUrl, params.data, {
      yxb: true
    })
  },
  /** 项目提交并签章 **/
  projectSubSign ({ state }, params) {
    const { projectSubSignUrl } = PROJECT
    return axios.post(state.URL + (params.front ? '/pxapi/basewisdom/pro_sub_sign' : projectSubSignUrl), params.data, {
      yxb: true
    })
  },
  /** 项目官方发布 **/
  projectPublish({ state }, params) {
    const { projectPublishUrl } = PROJECT
    return axios.post(state.URL + projectPublishUrl, params.data, {
      yxb: true
    })
  },
  /** 新增项目基本信息（0） **/
  addProjectForm0({ state }, params) {
    const { projectsForm0 } = PROJECT
    return axios.post(state.URL + projectsForm0, params.data, {
      yxb: true
    })
  },
  /** 修改项目基本信息 **/
  updateProjectForm0({ state }, params) {
    const { projectsForm0 } = PROJECT
    return axios.put(state.URL + projectsForm0 + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 获取项目基本信息中的优惠政策 **/
  getProjectYh({ state }, params) {
    const { projectYh } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/policy' : projectYh), {
      params: params.data,
      yxb: true
    })
  },
  /** 新增课程 （1）**/
  addCoursesForm1({ state }, params) {
    const { coursesForm1 } = PROJECT
    return axios.post(state.URL + coursesForm1, params.data, {
      yxb: true
    })
  },
  /** 修改课程 **/
  updateCoursesForm1({ state }, params) {
    const { coursesForm1 } = PROJECT
    return axios.put(state.URL + coursesForm1 + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 获取课程 **/
  getCoursesForm1({ state }, params) { //
    const { coursesForm1 } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/courses' : coursesForm1), {
      params: params.data,
      yxb: true
    })
  },
  /** 导入课程 **/
  coursesImport ({ state }, params) { // personsImportUrl
    const { coursesImportUrl } = PROJECT
    return axios.get(state.URL + coursesImportUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增委托单位 （2）**/
  addWtForm2({ state }, params) {
    const { wtForm2 } = PROJECT
    return axios.post(state.URL + wtForm2, params.data, {
      yxb: true
    })
  },
  /** 修改委托单位 **/
  updateWtForm2({ state }, params) {
    const { wtForm2 } = PROJECT
    return axios.put(state.URL + wtForm2 + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 获取委托单位 **/
  getWtForm2({ state }, params) {
    const { wtForm2 } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/prowt' : wtForm2), {
      params: params.data,
      yxb: true
    })
  },

  /** 新增辅助单位（3） **/
  addFzForm3 ({ state }, params) {
    const { fzForm3 } = PROJECT
    return axios.post(state.URL + fzForm3, params.data, {
      yxb: true
    })
  },
  /** 修改辅助单位 **/
  updateFzForm3 ({ state }, params) {
    const { fzForm3 } = PROJECT
    return axios.put(state.URL + fzForm3 + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 获取辅助单位 **/
  getFzForm3 ({ state }, params) {
    const { fzForm3 } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/profz' : fzForm3), {
      params: params.data,
      yxb: true
    })
  },

  /** 新增校内合作单位（5） **/
  addHzForm5 ({ state }, params) {
    const { hzForm5 } = PROJECT
    return axios.post(state.URL + hzForm5, params.data, {
      yxb: true
    })
  },
  /** 修改校内合作单位 **/
  updateHzForm5 ({ state }, params) {
    const { hzForm5 } = PROJECT
    return axios.put(state.URL + hzForm5 + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 获取校内合作单位 **/
  getHzForm5 ({ state }, params) {
    const { hzForm5 } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/prohz' : hzForm5), {
      params: params.data,
      yxb: true
    })
  },

  /** 新增财务预算（4） **/
  addYsForm4 ({ state }, params) {
    const { ysForm4 } = PROJECT
    return axios.post(state.URL + ysForm4, params.data, {
      yxb: true
    })
  },
  /** 修改财务预算 **/
  updateYsForm4 ({ state }, params) {
    const { ysForm4 } = PROJECT
    return axios.put(state.URL + ysForm4 + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 获取财务预算 **/
  getYsForm4 ({ state }, params) {
    const { ysForm4 } = PROJECT
    return axios.get(state.URL + (params.front ? '/pxapi/basewisdom/proys' : ysForm4), {
      params: params.data,
      yxb: true
    })
  }
}