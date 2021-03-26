import axios from 'axios'

/** @评估与考核 **/
export const ASSESS = {
  zdFieldsUrl: '/admin/zdfields', //
  standardResultUrl: '/admin/proappraisals/proappindex', // 考核标准表信息

  assessQuestionnaireUrl: '/admin/questype', // 调查问卷
  assessQuestionnaireDeleteAllUrl: '/admin/questype/batdel', //批量删除调查问卷

  assessProjectUrl: '/admin/questions/proindex', // 项目评估管理列表
  assessProjectEvaluateUrl: '/admin/projects/evaluate', // 修改项目评估状态
  assessCourseUrl: '/admin/questions/couindex', // 课程评估管理列表
  assessCouindexUrl: '/admin/questions/anscount', // 获取调查问卷统计结果
  assessProjectCodeUrl: '/admin/questions/projectqrcode', // 项目评估二维码
  assessCourseCodeUrl: '/admin/questions/courseqrcode', // 课程评估二维码
  assessAnsusersUrl: '/admin/questions/ansusers', // 获取调查问卷已提交问卷的学生信息

  assessResultListUrl: '/admin/proappraisals/proindex', // 项目考核列表
  assessResultHistoryUrl: '/admin/proappraisals/proapplook', // 项目总体考核记录
  assessResultUrl: '/admin/proappraisals', // 项目考核

  // 试题管理
  assessExamTypeUrl: '/admin/question/types', // 试题类型
  assessExamBaseUrl: '/admin/question', // 列表、详情、增、删、改
  statusAssessExamUrl: '/admin/question/enables', // 批量启用、禁用
  checkAssessExamUrl: '/admin/question/review', // 审核

  // 课程试题分配
  assessCourseExamBaseUrl: '/admin/questionnaire', // 获取课程已分配试题列表、分配试题、删除试题分配、排序、必填设置
  assessCourseExamBaseInfoUrl: '/admin/questionnaire/readinfo', //问卷创建基础信息
  copyAssessCourseExamUrl: '/admin/questionnaire/copyquestionnaire', //复制课程问卷
  deletesAssessCourseExamUrl: '/admin/questionnaire/deletes', // 批量删除试题分配
  statusAssessCourseExamUrl: '/admin/questionnaire/enables', // 状态启用、禁用
  createreportAssessCourseExamUrl: '/admin/questionnaire/createreport', // 生成问卷报告
  readreportAssessCourseExamUrl: '/admin/questionnaire/readreport', // 查看评估问卷报告
  readreportAssessCourseExamUrl2: '/questionnaire/report', // 查看评估问卷报告（前台）

  // 课程评估报告统计
  assessReportUrl: '/admin/questionnaire/statistics',

  // 预设问卷管理
  assessPresetUrl: '/admin/pre_questionnaire',
  statusAssessPresetUrl: '/admin/pre_questionnaire/enables', // 状态修改（启用、禁用）
  deleteAssessPresetQueUrl: '/admin/pre_questionnaire/delete_ques', // 删除预设问卷的试题
  changeAssessPresetQueUrl: '/admin/pre_questionnaire/update_ques', // 修改预设问卷试题的排序或必填数据
  copyAssessPresetUrl: '/admin/questionnaire/copyprequestionnaire', // 使用预设问卷
}
export const actionsassess = {
  /** 获取字段列表 **/
  getZdFields ({ state }, params) {
    const {
      zdFieldsUrl
    } = ASSESS
    return axios.get(state.URL + zdFieldsUrl, {
      yxb: true
    })
  },
  /** 获取考核标准信息 **/
  standardResult ({ state }, params) {
    const {
      standardResultUrl
    } = ASSESS
    return axios.get(state.URL + standardResultUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取调查问卷列表 **/
  getAssessQuestionnaire ({ state }, params) {
    const {
      assessQuestionnaireUrl
    } = ASSESS
    return axios.get(state.URL + assessQuestionnaireUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取调查问卷详情 **/
  getAssessQuestionnaireInfo ({ state }, params) {
    const {
      assessQuestionnaireUrl
    } = ASSESS
    return axios.get(state.URL + assessQuestionnaireUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 新增调查问卷 **/
  addAssessQuestionnaire ({ state }, params) {
    const {
      assessQuestionnaireUrl
    } = ASSESS
    return axios.post(state.URL + assessQuestionnaireUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑调查问卷 **/
  updateAssessQuestionnaire ({ state }, params) {
    const {
      assessQuestionnaireUrl
    } = ASSESS
    return axios.put(state.URL + assessQuestionnaireUrl + '/' + params.id, params.data, {
      yxb: true
    })
  },
  /** 删除调查问卷 **/
  deleteAssessQuestionnaire ({ state }, params) {
    const {
      assessQuestionnaireUrl
    } = ASSESS
    return axios.delete(state.URL + assessQuestionnaireUrl + '/' + params.id, {
      yxb: true
    })
  },
  /** 批量删除调查问卷 **/
  deleteSelectedAssessQuestionnaire ({ state }, params) {
    const {
      assessQuestionnaireDeleteAllUrl
    } = ASSESS
    return axios.post(state.URL + assessQuestionnaireDeleteAllUrl, params.data, {
      yxb: true
    })
  },

  /** 获取项目评估列表 **/
  getAssessProject ({ state }, params) {
    const {
      assessProjectUrl
    } = ASSESS
    return axios.get(state.URL + assessProjectUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 修改项目评估状态 **/
  assessProjectEvaluate ({ state }, params) {
    const {
      assessProjectEvaluateUrl
    } = ASSESS
    return axios.post(state.URL + assessProjectEvaluateUrl, params.data, {
      yxb: true
    })
  },
  /** 获取课程评估列表 **/
  getAssessCourse ({ state }, params) {
    const {
      assessCourseUrl
    } = ASSESS
    return axios.get(state.URL + assessCourseUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取调查问卷统计结果 **/
  getAssessCouindex ({ state }, params) {
    const {
      assessCouindexUrl
    } = ASSESS
    return axios.get(state.URL + assessCouindexUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取项目评估二维码 **/
  getAssessProjectCode ({ state }, params) {
    const {
      assessProjectCodeUrl
    } = ASSESS
    return axios.get(state.URL + assessProjectCodeUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取课程评估二维码 **/
  getAssessCourseCode ({ state }, params) {
    const {
      assessCourseCodeUrl
    } = ASSESS
    return axios.get(state.URL + assessCourseCodeUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取调查问卷已提交问卷的学生信息 **/
  getAssessAnsusers ({ state }, params) {
    const {
      assessAnsusersUrl
    } = ASSESS
    return axios.get(state.URL + assessAnsusersUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取项目考核列表 **/
  getAssessResult ({ state }, params) {
    const {
      assessResultListUrl
    } = ASSESS
    return axios.get(state.URL + assessResultListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取项目总体考核记录 **/
  getAssessResultHistory ({ state }, params) {
    const {
      assessResultHistoryUrl
    } = ASSESS
    return axios.get(state.URL + assessResultHistoryUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 项目考核 **/
  addAssessResult ({ state }, params) {
    const {
      assessResultUrl
    } = ASSESS
    return axios.post(state.URL + assessResultUrl, params.data, {
      yxb: true
    })
  },

  /** @试题管理 **/
  assessExamType ({ state }, params) {
    const {
      assessExamTypeUrl
    } = ASSESS
    return axios.get(state.URL + assessExamTypeUrl, {
      params: params.data,
      yxb: true
    })
  },
  getAssessExamList ({ state }, params) {
    const {
      assessExamBaseUrl
    } = ASSESS
    return axios.get(state.URL + assessExamBaseUrl, {
      params: params.data,
      yxb: true
    })
  },
  getAssessExamInfo ({ state }, params) {
    const {
      assessExamBaseUrl
    } = ASSESS
    return axios.get(state.URL + assessExamBaseUrl + '/' + params.id, {
      yxb: true
    })
  },
  addAssessExam ({ state }, params) {
    const {
      assessExamBaseUrl
    } = ASSESS
    return axios.post(state.URL + assessExamBaseUrl, params.data, {
      yxb: true
    })
  },
  updateAssessExam ({ state }, params) {
    const {
      assessExamBaseUrl
    } = ASSESS
    return axios.put(state.URL + assessExamBaseUrl + '/' + params.id, params.data, {
      yxb: true
    })
  },
  deleteAssessExam ({ state }, params) {
    const {
      assessExamBaseUrl
    } = ASSESS
    return axios.delete(state.URL + assessExamBaseUrl + '/' + params.id, {
      yxb: true
    })
  },
  statusAssessExam ({ state }, params) {
    const {
      statusAssessExamUrl
    } = ASSESS
    return axios.post(state.URL + statusAssessExamUrl, params.data, {
      yxb: true
    })
  },
  checkAssessExam ({ state }, params) {
    const {
      checkAssessExamUrl
    } = ASSESS
    return axios.post(state.URL + checkAssessExamUrl, params.data, {
      yxb: true
    })
  },

  /** @课程试题分配 **/
  getAssessCourseExamList ({ state }, params) {
    const {
      assessCourseExamBaseUrl
    } = ASSESS
    return axios.get(state.URL + assessCourseExamBaseUrl, {
      params: params.data,
      yxb: true
    })
  }, // 获取课程已分配试题列表
  assessCourseExamBaseInfo ({ state }, params) {
    const {
      assessCourseExamBaseInfoUrl
    } = ASSESS
    return axios.get(state.URL + assessCourseExamBaseInfoUrl, {
      params: params.data,
      yxb: true
    })
  }, // 问卷创建基础信息
  addAssessCourseExam ({ state }, params) {
    const {
      assessCourseExamBaseUrl
    } = ASSESS
    return axios.post(state.URL + assessCourseExamBaseUrl, params.data, {
      yxb: true
    })
  }, // 分配试题
  deletesAssessCourseExam ({ state }, params) {
    const {
      deletesAssessCourseExamUrl
    } = ASSESS
    return axios.post(state.URL + deletesAssessCourseExamUrl, params.data, {
      yxb: true
    })
  }, // 批量删除试题分配
  statusAssessCourseExam ({ state }, params) {
    const {
      statusAssessCourseExamUrl
    } = ASSESS
    return axios.post(state.URL + statusAssessCourseExamUrl, params.data, {
      yxb: true
    })
  }, // 状态启用、禁用
  copyAssessCourseExam ({ state }, params) {
    const {
      copyAssessCourseExamUrl
    } = ASSESS
    return axios.post(state.URL + copyAssessCourseExamUrl, params.data, {
      yxb: true
    })
  }, // 复制课程问卷
  sortRequiredAssessCourseExam ({ state }, params) {
    const {
      assessCourseExamBaseUrl
    } = ASSESS
    return axios.put(state.URL + assessCourseExamBaseUrl + '/' + params.id, params.data, {
      yxb: true
    })
  }, //改问卷试题的排序或必填设置
  createreportAssessCourseExam ({ state }, params) {
    const {
      createreportAssessCourseExamUrl
    } = ASSESS
    return axios.post(state.URL + createreportAssessCourseExamUrl, params.data, {
      yxb: true
    })
  }, // 生成问卷报告
  readreportAssessCourseExam ({ state }, params) {
    const {
      readreportAssessCourseExamUrl,
      readreportAssessCourseExamUrl2
    } = ASSESS
    // type：1登录访问、2前台访问（无需登录）
    return axios.get(state.URL + (params.type === 1 ? readreportAssessCourseExamUrl : readreportAssessCourseExamUrl2), {
      params: params.data,
      yxb: true
    })
  }, // 查看评估问卷报告

  /** @程评估报告统计 **/
  getAssessReportList ({ state }, params) {
    const {
      assessReportUrl
    } = ASSESS
    return axios.get(state.URL + assessReportUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** @预设问卷管理 **/
  getAssessPresetList ({ state }, params) {
    const {
      assessPresetUrl
    } = ASSESS
    return axios.get(state.URL + assessPresetUrl, {
      params: params.data,
      yxb: true
    })
  }, // 获取预设问卷列表
  getAssessPresetInfo ({ state }, params) {
    const {
      assessPresetUrl
    } = ASSESS
    return axios.get(state.URL + assessPresetUrl + '/' + params.id, {
      params: params.data,
      yxb: true
    })
  }, // 问卷创建基础信息
  addAssessPreset ({ state }, params) {
    const {
      assessPresetUrl
    } = ASSESS
    return axios.post(state.URL + assessPresetUrl, params.data, {
      yxb: true
    })
  }, // 新增预设问卷
  updateAssessPreset ({ state }, params) {
    const {
      assessPresetUrl
    } = ASSESS
    return axios.put(state.URL + assessPresetUrl + '/' + params.id, params.data, {
      yxb: true
    })
  }, // 编辑预设问卷
  deleteAssessPreset ({ state }, params) {
    const {
      assessPresetUrl
    } = ASSESS
    return axios.delete(state.URL + assessPresetUrl + '/' + params.id, {
      yxb: true
    })
  }, // 删除预设问卷
  statusAssessPreset ({ state }, params) {
    const {
      statusAssessPresetUrl
    } = ASSESS
    return axios.post(state.URL + statusAssessPresetUrl, params.data, {
      yxb: true
    })
  }, // 状态启用、禁用
  deleteAssessPresetQue ({ state }, params) {
    const {
      deleteAssessPresetQueUrl
    } = ASSESS
    return axios.post(state.URL + deleteAssessPresetQueUrl, params.data, {
      yxb: true
    })
  }, // 删除预设问卷的试题
  changeAssessPresetQue ({ state }, params) {
    const {
      changeAssessPresetQueUrl
    } = ASSESS
    return axios.post(state.URL + changeAssessPresetQueUrl, params.data, {
      yxb: true
    })
  }, // 修改预设问卷试题的排序或必填数据
  copyAssessPreset ({ state }, params) {
    const {
      copyAssessPresetUrl
    } = ASSESS
    return axios.post(state.URL + copyAssessPresetUrl, params.data, {
      yxb: true
    })
  }, // 使用预设问卷
}