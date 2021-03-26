import axios from 'axios'

/** @成人学历教育管理 **/
export const ADULT = {
  //招生计划
  adultRecruitUrl: '/admin/admissions',
  checkAdultRecruitUrl: '/admin/admissions/review', // 审核
  adultRecruitStudentsUrl: '/admin/formalstudent', // 学生名单
  adultRecruitYearUrl: '/admin/admissions/list',
  //班级管理
  adultClassUrl: '/admin/formal_classes', // 班级
  adultClassScheduleUrl: '/admin/formal_classes/classcourse', // 班级课表
  adultClassStudentsUrl: '/admin/formal_classes/student', // 学生
  adultClassStudentsInfoUrl: '/admin/formal_classes/studentlist', // 学生详情
  adultClassStudentsResultUrl: '/admin/formal_classes/studentresult', // 学生成绩
  adultClassStudentsChangeUrl: '/admin/formal_classes/change', // 休学、退学申请信息
  adultClassStudentsGraduationtUrl: '/admin/formal_classes/graduation', // 毕业申请信息
  adultClassStudentsDegreeUrl: '/admin/formal_classes/degree', // 学位申请信息
  // 试卷库
  adultPaperUrl: '/admin/formal_classes/paper' // 试卷库
}
export const actionsadult = {
  /** 招生计划 **/
  // 获取列表（以年为单位）
  getAdultRecruitYearList ({ state }, params) {
    const {
      adultRecruitYearUrl
    } = ADULT
    return axios.get(state.URL + adultRecruitYearUrl, {
      params: params.data,
    })
  },
  // 获取专业列表
  getAdultRecruitList ({ state }, params) {
    const {
      adultRecruitUrl
    } = ADULT
    return axios.get(state.URL + adultRecruitUrl, {
      params: params.data,
    })
  },
  // 获取详情
  getAdultRecruitInfo ({ state }, params) {
    const {
      adultRecruitUrl
    } = ADULT
    return axios.get(state.URL + adultRecruitUrl + `/${params.id}`, {
      params: params.data,
    })
  },
  // 新增
  addAdultRecruit ({ state }, params) {
    const {
      adultRecruitUrl
    } = ADULT
    return axios.post(state.URL + adultRecruitUrl, params.data)
  },
  //编辑
  editAdultRecruit ({ state }, params) {
    const {
      adultRecruitUrl
    } = ADULT
    return axios.put(state.URL + adultRecruitUrl + `/${params.id}`, params.data)
  },
  //删除
  deleteAdultRecruit ({ state }, params) {
    const {
      adultRecruitUrl
    } = ADULT
    return axios.delete(state.URL + adultRecruitUrl + `/${params.id}`, params.data)
  },
  //审核
  checkAdultRecruit ({ state }, params) {
    const {
      checkAdultRecruitUrl
    } = ADULT
    return axios.post(state.URL + checkAdultRecruitUrl, params.data)
  },
  // 学生名单列表
  getAdultRecruitStudentsList ({ state }, params) {
    const {
      adultRecruitStudentsUrl
    } = ADULT
    return axios.get(state.URL + adultRecruitStudentsUrl, {
      params: params.data,
    })
  },
  /** 班级管理 **/
  // 获取班级列表
  getAdultClassList ({ state }, params) {
    const {
      adultClassUrl
    } = ADULT
    return axios.get(state.URL + adultClassUrl, {
      params: params.data,
    })
  },
  // 获取班级课表列表
  getAdultClassScheduleList ({ state }, params) {
    const {
      adultClassScheduleUrl
    } = ADULT
    return axios.get(state.URL + adultClassScheduleUrl, {
      params: params.data,
    })
  },
  // 获取班级学生列表
  getAdultClassStudentsList ({ state }, params) {
    const {
      adultClassStudentsUrl
    } = ADULT
    return axios.get(state.URL + adultClassStudentsUrl, {
      params: params.data,
    })
  },
  // 获取班级学生基本信息
  getAdultClassStudentsInfo ({ state }, params) {
    const {
      adultClassStudentsInfoUrl
    } = ADULT
    return axios.get(state.URL + adultClassStudentsInfoUrl, {
      params: params.data,
    })
  },
  // 获取班级学生-成绩
  getAdultClassStudentsResult ({ state }, params) {
    const {
      adultClassStudentsResultUrl
    } = ADULT
    return axios.get(state.URL + adultClassStudentsResultUrl, {
      params: params.data,
    })
  },
  // 获取班级学生-休学、退学申请信息
  getAdultClassStudentsChange ({ state }, params) {
    const {
      adultClassStudentsChangeUrl
    } = ADULT
    return axios.get(state.URL + adultClassStudentsChangeUrl, {
      params: params.data,
    })
  },
  // 获取班级学生-毕业申请信息
  getAdultClassStudentsGraduationt ({ state }, params) {
    const {
      adultClassStudentsGraduationtUrl
    } = ADULT
    return axios.get(state.URL + adultClassStudentsGraduationtUrl, {
      params: params.data,
    })
  },
  // 获取班级学生-学位申请信息
  getAdultClassStudentsDegree ({ state }, params) {
    const {
      adultClassStudentsDegreeUrl
    } = ADULT
    return axios.get(state.URL + adultClassStudentsDegreeUrl, {
      params: params.data,
    })
  },
  /** 试卷库 **/
  // 获取问卷库
  getAdultPaperList ({ state }, params) {
    const {
      adultPaperUrl
    } = ADULT
    return axios.get(state.URL + adultPaperUrl, {
      params: params.data,
    })
  },
}