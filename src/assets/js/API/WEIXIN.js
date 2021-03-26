import axios from 'axios'

/** @微信管理 **/
export const WEIXIN = {
  weiXinReplyUrl: '/admin/custom', // 自定义回复

  weiXinTextUrl: '/admin/text', // 文本管理
  weiXinTextSelectedUrl: '/admin/text/deletes', // 批量删除文本管理

  weiXinImageUrl: '/admin/img', // 图文管理
  weiXinImageSelectedUrl: '/admin/img/deletes', // 批量删除图文管理

  weiXinMenuUrl: '/admin/diymenu', // 自定义菜单
  weiXinMenuToUrL: '/admin/diymenu/createmenu', // 推送微信菜单
}
export const actionsweixin = {
  /** 获取自定义回复列表 **/
  getWeiXinReply ({ state }, params) {
    const {
      weiXinReplyUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinReplyUrl, {
      params: params.data,
    })
  },
  /** 获取自定义回复详情 **/
  getWeiXinReplyInfo ({ state }, params) {
    const {
      weiXinReplyUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinReplyUrl + '/' + params.id)
  },
  /** 编辑自定义回复 **/
  updateWeiXinReply ({ state }, params) {
    const {
      weiXinReplyUrl
    } = WEIXIN
    return axios.put(state.URL + weiXinReplyUrl + '/' + params.id, params.data)
  },

  /** 获取文本管理列表 **/
  getWeiXinText ({ state }, params) {
    const {
      weiXinTextUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinTextUrl, {
      params: params.data,
    })
  },
  /** 获取文本管理详情 **/
  getWeiXinTextInfo ({ state }, params) {
    const {
      weiXinTextUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinTextUrl + '/' + params.id)
  },
  /** 新增文本管理 **/
  addWeiXinText ({ state }, params) {
    const {
      weiXinTextUrl
    } = WEIXIN
    return axios.post(state.URL + weiXinTextUrl, params.data)
  },
  /** 编辑文本管理 **/
  updateWeiXinText ({ state }, params) {
    const {
      weiXinTextUrl
    } = WEIXIN
    return axios.put(state.URL + weiXinTextUrl + '/' + params.id, params.data)
  },
  /** 删除文本管理 **/
  deleteWeiXinText ({ state }, params) {
    const {
      weiXinTextUrl
    } = WEIXIN
    return axios.delete(state.URL + weiXinTextUrl + '/' + params.id)
  },
  /** 批量删除文本管理 **/
  deleteWeiXinTextSelected ({ state }, params) {
    const {
      weiXinTextSelectedUrl
    } = WEIXIN
    return axios.post(state.URL + weiXinTextSelectedUrl, params.data)
  },

  /** 获取图文管理列表 **/
  getWeiXinImage ({ state }, params) {
    const {
      weiXinImageUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinImageUrl, {
      params: params.data,
    })
  },
  /** 获取图文管理详情 **/
  getWeiXinImageInfo ({ state }, params) {
    const {
      weiXinImageUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinImageUrl + '/' + params.id)
  },
  /** 新增图文管理 **/
  addWeiXinImage ({ state }, params) {
    const {
      weiXinImageUrl
    } = WEIXIN
    return axios.post(state.URL + weiXinImageUrl, params.data)
  },
  /** 编辑图文管理 **/
  updateWeiXinImage ({ state }, params) {
    const {
      weiXinImageUrl
    } = WEIXIN
    return axios.put(state.URL + weiXinImageUrl + '/' + params.id, params.data)
  },
  /** 删除图文管理 **/
  deleteWeiXinImage ({ state }, params) {
    const {
      weiXinImageUrl
    } = WEIXIN
    return axios.delete(state.URL + weiXinImageUrl + '/' + params.id)
  },
  /** 批量删除图文管理 **/
  deleteWeiXinImageSelected ({ state }, params) {
    const {
      weiXinImageSelectedUrl
    } = WEIXIN
    return axios.post(state.URL + weiXinImageSelectedUrl, params.data)
  },

  /** 获取自定义菜单列表 **/
  getWeiXinMenuList ({ state }, params) {
    const {
      weiXinMenuUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinMenuUrl, {
      params: params.data,
    })
  },
  /** 获取自定义菜单详情 **/
  getWeiXinMenuInfo ({ state }, params) {
    const {
      weiXinMenuUrl
    } = WEIXIN
    return axios.get(state.URL + weiXinMenuUrl + '/' + params.id)
  },
  /** 新增自定义菜单 **/
  addWeiXinMenu ({ state }, params) {
    const {
      weiXinMenuUrl
    } = WEIXIN
    return axios.post(state.URL + weiXinMenuUrl, params.data)
  },
  /** 编辑自定义菜单 **/
  updateWeiXinMenu ({ state }, params) {
    const {
      weiXinMenuUrl
    } = WEIXIN
    return axios.put(state.URL + weiXinMenuUrl + '/' + params.id, params.data)
  },
  /** 删除自定义菜单 **/
  deleteWeiXinMenu ({ state }, params) {
    const {
      weiXinMenuUrl
    } = WEIXIN
    return axios.delete(state.URL + weiXinMenuUrl + '/' + params.id)
  },
  /** 推送生成微信三乘五菜单 **/
  toWeiXinMenu ({ state }, params) {
    const {
      weiXinMenuToUrL
    } = WEIXIN
    return axios.get(state.URL + weiXinMenuToUrL, {
      params: params ? params.data : {},
    })
  },
}