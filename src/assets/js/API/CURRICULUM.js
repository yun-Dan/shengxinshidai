import axios from 'axios'

/** @课程与教师管理 **/
export const CURRICULUM = {
  curriculumCoursesListUrl: '/admin/pro_courses/getcoursenum', // 获取项目课程列表
  curriculumCourseUrl: '/admin/pro_courses/getcourses', // 获取某个项目的课程详情列表

  curriculumTeacherListUrl: '/admin/teacher/index', // 获取项目教师列表
  curriculumTeacherUrl: '/admin/teacher/getteachers', // 获取某个项目的教师详情列表
  teacherBlackUrl: '/admin/teacher/setblack', // 教师黑名单设置
  curriculumTeacherAddBlackUrl: '/admin/teacher', // 添加教师黑名单 /admin/teacher/setblack/:id/:is_black
  teacherGradeUrl: '/admin/teacher/decteachmark' // 教师打分
}
export const actionscurriculum = {
  /** 获取项目课程列表 **/
  getCurriculumCoursesList ({ state }, params) {
    const {
      curriculumCoursesListUrl
    } = CURRICULUM
    return axios.get(state.URL + curriculumCoursesListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取项目下的课程信息 **/
  getCurriculumCourse ({ state }, params) {
    const {
      curriculumCourseUrl
    } = CURRICULUM
    return axios.get(state.URL + curriculumCourseUrl + '/' + params.id, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取项目教师列表 **/
  getCurriculumTeacherList ({ state }, params) {
    const {
      curriculumTeacherListUrl
    } = CURRICULUM
    return axios.get(state.URL + curriculumTeacherListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取项目下的教师信息 **/
  getCurriculumTeacher ({ state }, params) {
    const {
      curriculumTeacherUrl
    } = CURRICULUM
    return axios.get(state.URL + curriculumTeacherUrl + '/' + params.id, {
      params: params.data,
      yxb: true
    })
  },
  /** 设置教师黑名单 **/
  setTeacherBlack ({ state }, params) {
    const {
      teacherBlackUrl
    } = CURRICULUM
    return axios.get(state.URL + teacherBlackUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 添加教师黑名单 **/
  curriculumTeacherAddBlack ({ state }, params) {
    const {
      curriculumTeacherAddBlackUrl
    } = CURRICULUM
    return axios.post(state.URL + curriculumTeacherAddBlackUrl, params.data, {
      yxb: true
    })
  },
  /** 教师打分 **/
  teacherGrade ({ state }, params) {
    const {
      teacherGradeUrl
    } = CURRICULUM
    return axios.post(state.URL + teacherGradeUrl, params.data, {
      yxb: true
    })
  }
}