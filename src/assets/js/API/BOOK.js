import axios from 'axios'

/** @图书服务管理 **/
export const BOOK = {
  /**图书馆参观管理**/
  bookVisitListUrl: '/admin/libra/index', // 图书管参观列表
  bookVisitIdUrl: '/admin/libra/look', // 获取详情
  bookVisitAddUrl: '/admin/libra/save', // 新增
  bookVisitUpdateUrl: '/admin/libra/update', // 编辑
  bookVisitDeleteUrl: '/admin/libra/del', // 删除
  bookVisitCheckUrl: '/admin/libra/examine', // 审核
  bookVisitLockUrl: '/admin/libra/locking', // 锁定

  /**阅览证管理**/
  bookCardListUrl: '/admin/read/index', // 图书管参观列表
  bookCardIdUrl: '/admin/read/look', // 获取详情
  bookCardEditUrl: '/admin/read/save', // 新增
  bookCardDeleteUrl: '/admin/read/del', // 删除
  bookCardCheckUrl: '/admin/read/examine', // 审核
  bookCardLockUrl: '/admin/read/locking', // 锁定

  /**编外项目录入**/
  bookEnteringUrl: '/admin/staff/save', // 录入

  /**编外项目录入**/
  bookQueryUrl: '/admin/staff/index', // 编外项目列表
  bookQueryDeleteUrl: '/admin/staff/del', // 删除
  bookQueryInfoUrl: '/admin/staff/look', // 详情
}
export const actionslibrary = {
  /** 获取图书管参观列表 **/
  getBookVisitList ({ state }, params) {
    const {
      bookVisitListUrl
    } = BOOK
    return axios.get(state.URL + bookVisitListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取图书管参观申请详情 **/
  getBookVisitId ({ state }, params) {
    const {
      bookVisitIdUrl
    } = BOOK
    return axios.get(state.URL + bookVisitIdUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增图书管参观 **/
  AddBookVisit ({ state }, params) {
    const {
      bookVisitAddUrl
    } = BOOK
    return axios.post(state.URL + bookVisitAddUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑 **/
  updateBookVisit ({ state }, params) {
    const {
      bookVisitUpdateUrl
    } = BOOK
    return axios.post(state.URL + bookVisitUpdateUrl, params.data, {
      yxb: true
    })
  },
  /** 删除 **/
  deleteBookVisit ({ state }, params) {
    const {
      bookVisitDeleteUrl
    } = BOOK
    return axios.get(state.URL + bookVisitDeleteUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 审核 **/
  checkBookVisit ({ state }, params) {
    const {
      bookVisitCheckUrl
    } = BOOK
    return axios.post(state.URL + bookVisitCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 锁定 **/
  LockBookVisit ({ state }, params) {
    const {
      bookVisitLockUrl
    } = BOOK
    return axios.post(state.URL + bookVisitLockUrl, params.data, {
      yxb: true
    })
  },

  /** 获取阅览证列表 **/
  getBookCardList ({ state }, params) {
    const {
      bookCardListUrl
    } = BOOK
    return axios.get(state.URL + bookCardListUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 获取图书管参观申请详情 **/
  getBookCardId ({ state }, params) {
    const {
      bookCardIdUrl
    } = BOOK
    return axios.get(state.URL + bookCardIdUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 新增图书管参观 **/
  AddBookCard ({ state }, params) {
    const {
      bookCardEditUrl
    } = BOOK
    return axios.post(state.URL + bookCardEditUrl, params.data, {
      yxb: true
    })
  },
  /** 编辑 **/
  updateBookCard ({ state }, params) {
    const {
      bookCardEditUrl
    } = BOOK
    return axios.post(state.URL + bookCardEditUrl, params.data, {
      yxb: true
    })
  },
  /** 删除 **/
  deleteBookCard ({ state }, params) {
    const {
      bookCardDeleteUrl
    } = BOOK
    return axios.get(state.URL + bookCardDeleteUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 审核 **/
  checkBookCard ({ state }, params) {
    const {
      bookCardCheckUrl
    } = BOOK
    return axios.post(state.URL + bookCardCheckUrl, params.data, {
      yxb: true
    })
  },
  /** 锁定 **/
  LockBookCard ({ state }, params) {
    const {
      bookCardLockUrl
    } = BOOK
    return axios.post(state.URL + bookCardLockUrl, params.data, {
      yxb: true
    })
  },

  /** 编外项目录入 **/
  AddBookEntering ({ state }, params) {
    const {
      bookEnteringUrl
    } = BOOK
    return axios.post(state.URL + bookEnteringUrl, params.data, {
      yxb: true
    })
  },

  /** 编外项目查询 **/
  getBookQueryList ({ state }, params) {
    const {
      bookQueryUrl
    } = BOOK
    return axios.get(state.URL + bookQueryUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 详情 **/
  getBookQueryInfo ({ state }, params) {
    const {
      bookQueryInfoUrl
    } = BOOK
    return axios.get(state.URL + bookQueryInfoUrl, {
      params: params.data,
      yxb: true
    })
  },
  /** 删除 **/
  deleteBookQuery ({ state }, params) {
    const {
      bookQueryDeleteUrl
    } = BOOK
    return axios.get(state.URL + bookQueryDeleteUrl, {
      params: params.data,
      yxb: true
    })
  },
}