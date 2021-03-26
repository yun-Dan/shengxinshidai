import axios from 'axios'

/** @教室租借管理 **/
export const CLASSROOM = {
  // 可租借教室所在楼配置信息
  classroomFloorListUrl: '/admin/renting/floor',

  /** 教室出借备案 **/
  classroomRecordListUrl: '/admin/renting/index', // 列表
  classroomRecordInfoUrl: '/admin/renting/look', // 详情
  classroomRecordEditUrl: '/admin/renting/save', // 新增、编辑
  classroomRecordDeleteUrl: '/admin/renting/del', // 删除
  classroomRecordCheckUrl: '/admin/renting/examine', // 审核
  classroomRecordLockUrl: '/admin/renting/locking', // 锁定

  /** 教室租借财务手续 **/
  classroomFinanceListUrl: '/admin/finance/index', // 列表
  classroomFinanceInfoUrl: '/admin/finance/look', // 详情
  classroomFinanceEditUrl: '/admin/finance/save', // 新增、编辑
  classroomFinanceDeleteUrl: '/admin/finance/del', // 删除
  classroomFinanceCheckUrl: '/admin/finance/examine', // 审核
  classroomFinanceLockUrl: '/admin/finance/locking', // 锁定
  classroomFinanceJsXyUrl: '/admin/renting/lookes', // 获取可用教室名称

  /** 教室示意图 **/
  classroomImageUrl: '/admin/renting/demo'
}
export const actionsclassroom = {
  /** 获取教室出借所在楼信息 **/
  getClassroomFloorList ({ state }, params) {
    const {
      classroomFloorListUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomFloorListUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取教室出借列表 **/
  getClassroomRecordList ({ state }, params) {
    const {
      classroomRecordListUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomRecordListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取详情**/
  getClassroomRecordInfo ({ state }, params) {
    const {
      classroomRecordInfoUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomRecordInfoUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增、编辑 **/
  editClassroomRecord ({ state }, params) {
    const {
      classroomRecordEditUrl
    } = CLASSROOM
    return axios.post(state.URL + classroomRecordEditUrl, params.data, {
      yxb: true
    })
  },
  /** 删除 **/
  deleteClassroomRecord ({ state }, params) {
    const {
      classroomRecordDeleteUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomRecordDeleteUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 审核 **/
  checkClassroomRecord ({ state }, params) {
    const {
      classroomRecordCheckUrl
    } = CLASSROOM
    return axios.post(state.URL + classroomRecordCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 锁定 **/
  LockClassroomRecord ({ state }, params) {
    const {
      classroomRecordLockUrl
    } = CLASSROOM
    return axios.post(state.URL + classroomRecordLockUrl, params.data, {
      yxb: true
    })
  },

  /**  获取教室租借财务手续列表 **/
  getClassroomFinanceList ({ state }, params) {
    const {
      classroomFinanceListUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomFinanceListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取详情**/
  getClassroomFinanceInfo ({ state }, params) {
    const {
      classroomFinanceInfoUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomFinanceInfoUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增、编辑 **/
  editClassroomFinance ({ state }, params) {
    const {
      classroomFinanceEditUrl
    } = CLASSROOM
    return axios.post(state.URL + classroomFinanceEditUrl, params.data, {
      yxb: true
    })
  },
  /** 删除 **/
  deleteClassroomFinance ({ state }, params) {
    const {
      classroomFinanceDeleteUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomFinanceDeleteUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 审核 **/
  checkClassroomFinance ({ state }, params) {
    const {
      classroomFinanceCheckUrl
    } = CLASSROOM
    return axios.post(state.URL + classroomFinanceCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 锁定 **/
  LockClassroomFinance ({ state }, params) {
    const {
      classroomFinanceLockUrl
    } = CLASSROOM
    return axios.post(state.URL + classroomFinanceLockUrl, params.data, {
      yxb: true
    })
  },
  /** 获取可用教室名称 **/
  classroomFinanceJsXy ({ state }, params) {
    const {
      classroomFinanceJsXyUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomFinanceJsXyUrl, {
      params: params.data,
      yxb: true
    })
  },

  /** 获取教室示意图信息 **/
  getClassroomImage ({ state }, params) {
    const {
      classroomImageUrl
    } = CLASSROOM
    return axios.get(state.URL + classroomImageUrl, {
      params: params.data,
      yxb: true
    })
  },
}