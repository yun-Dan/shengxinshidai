import axios from 'axios'

/** @文章接口 **/
export const ARTICLE = {
  articleUrl: '/admin/article', // 文章
  deleteSeArticle: '/admin/article/deletes', // 批量删除
  readUsers: '/admin/article/readusers', // 阅读文章人员列表
  UnreadUrl: '/admin/article/unread' // 工作人员未阅读文章列表
}
export const actionsarticle = {
  /** 获取文章列表 **/
  getArticleData (context, params) {
    const { articleUrl } = ARTICLE
    const A = axios.get(context.state.URL + articleUrl, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editArticleData', data.data.data)
    })
    return A
  },
  /** 获取文章详情 **/
  getArticleId (context, params) {
    const { articleUrl } = ARTICLE
    const A = axios.get(context.state.URL + articleUrl + '/' + params.id, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editArticleId', data.data.data)
    })
    return A
  },
  /**  获取阅读人员列表 **/
  getReadUsers (context, params) {
    const { readUsers } = ARTICLE
    const A = axios.get(context.state.URL + readUsers, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editReadUsers', data.data.data)
    })
    return A
  },
  /** 新增文章 **/
  addArticle ({ state }, params) {
    const { articleUrl } = ARTICLE
    return axios.post(state.URL + articleUrl, params.data)
  },
  /** 编辑文章 **/
  updateArticle ({ state }, params) {
    const { articleUrl } = ARTICLE
    return axios.put(state.URL + articleUrl + '/' + params.id, params.data)
  },
  /** 删除文章 **/
  deleteArticle ({ state }, params) {
    const { articleUrl } = ARTICLE
    return axios.delete(state.URL + articleUrl + '/' + params.id)
  },
  /** 批量删除文章 **/
  deleteSelectedArticle ({ state }, params) {
    const { deleteSeArticle } = ARTICLE
    return axios.post(state.URL + deleteSeArticle, params.data)
  },
  /** 工作人员未阅读文章列表 **/
  getUnread (context, params) {
    const { UnreadUrl } = ARTICLE
    const A = axios.get(context.state.URL + UnreadUrl, {
      params: params.data,
    })
    A.then(data => {
      context.commit('editUnreadData', data.data.data)
    })
    return A
  }
}