import axios from 'axios'
import router from '../router/index'
import VueCookie from 'vue-cookie'

const ROOT_URL = process.env.VUE_APP_BASE_URL
import { actionsOBJ } from '@/assets/js/API/URLS_CONFIG'
import { actionsindex } from '@/assets/js/API/INDEX'
import { actionsuser } from '@/assets/js/API/USER'
import { actionsarticle } from '@/assets/js/API/ARTICLE'
import { actionsstructure } from '@/assets/js/API/STRUCTURE'
import { actionsproject } from '@/assets/js/API/PROJECT'
import { actionspromodify } from '@/assets/js/API/PROMODIFY'
import { actionsprotocol } from '@/assets/js/API/PROTOCOL'
import { actionsstudent } from '@/assets/js/API/STUDENT'
import { actionscertificate } from '@/assets/js/API/CERTIFICATE'
import { actionsfinance } from '@/assets/js/API/FINANCE'
import { actionscurriculum } from '@/assets/js/API/CURRICULUM'
import { actionsassess } from '@/assets/js/API/ASSESS'
import { actionsmajor } from '@/assets/js/API/MAJOR'
import { actionshelper } from '@/assets/js/API/HELPER'
import { actionsweixin } from '@/assets/js/API/WEIXIN'
import { actionsarea } from '@/assets/js/API/AREA'
import { actionslibrary } from '@/assets/js/API/BOOK'
import { actionsclassroom } from '@/assets/js/API/CLASSROOM'
import { actionsdatatotal } from '@/assets/js/API/DATATOTAL'
import { actionsschedule } from '@/assets/js/API/SCHEDULE'
import { actionsdocumentYngw } from '@/assets/js/API/DOCUMENTYNGW'
import { actionsdocumentHyjy } from '@/assets/js/API/DOCUMENTHYJY'
import { actionsdocumentXfdj } from '@/assets/js/API/DOCUMENTXFDJ'
import { actionspropaganda } from '@/assets/js/API/PROPAGANDA'
import { actionsadult } from '@/assets/js/API/ADULT'
import { actionsprofessional } from '@/assets/js/API/PROFESSIONAL'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
axios.interceptors.request.use(
  config => {
    const isYXB = ((sessionStorage.getItem('CK-T') || sessionStorage.getItem('CK')) === '2') && router.currentRoute.path.indexOf('/login/') === -1 || router.currentRoute.path.indexOf('/yxb/') !== -1
    if (isYXB) {
      if (config.yxb) {
        const url = config.url
        if (!url.indexOf(`${ROOT_URL}/admin/`)) {
          config.url = url.replace(/\/admin\//, '/yxb/')
        } else if (!url.indexOf(`${ROOT_URL}/attachment/`) && url.indexOf(`${ROOT_URL}/attachment/yxb_`) === -1) {
          config.url = url.replace(/\/attachment\//, '/attachment/yxb_')
        }
        const ID = router.currentRoute.query.class_major_id
        if (ID) {
          if (config.params) {
            config.params.class_major_id = ID
          } else if (config.data) {
            config.data.class_major_id = ID
          }
        }
      }
    }
    const headers = VueCookie.get('headers')
    if (headers) {
      config.headers.authkey = JSON.parse(headers).authkey
      config.headers.sessionid = JSON.parse(headers).sessionid
    }
    config.cancelToken = source.token
    config.withCredentials = true
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
axios.interceptors.response.use(
  response => {
    if (response.data.code === 101 || response.data.code === 103) {
      source.cancel()
      router.replace({
        path: '/'
      })
      VueCookie.delete('headers')
      VueCookie.delete('userInfo')
    }
    if (response.data.code === 102) {
      router.replace({
        path: '/error401'
      })
    }
    return response
  },
  error => {
    if (axios.isCancel(error)) {
      return new Promise(() => {})
    } else {
      return Promise.reject(error)
    }
  }
)

export default {
  axiosHttp({ state }, { baseURL, url, type = 'get', data = {}, yxb = false }) {
    return axios[type](`${baseURL || state.URL}${url}`, type === 'get' || type === 'delete' ? {
      params: data,
      yxb: yxb
    } : data, { yxb: yxb})
  },
  ...actionsOBJ,
  ...actionsuser,
  ...actionsarticle,
  ...actionsstructure,
  ...actionsproject,
  ...actionspromodify,
  ...actionsprotocol,
  ...actionsstudent,
  ...actionscertificate,
  ...actionsfinance,
  ...actionscurriculum,
  ...actionsmajor,
  ...actionshelper,
  ...actionsassess,
  ...actionsweixin,
  ...actionsindex,
  ...actionsarea,
  ...actionslibrary,
  ...actionsclassroom,
  ...actionsdatatotal,
  ...actionsschedule,
  ...actionsdocumentYngw,
  ...actionsdocumentHyjy,
  ...actionsdocumentXfdj,
  ...actionspropaganda,
  ...actionsadult,
  ...actionsprofessional
}