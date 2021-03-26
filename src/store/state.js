import fileAPI from '@/assets/js/API/file.js'

const ROOT_URL = process.env.VUE_APP_BASE_URL;
export const authMenu = ['/home/index/index']

export default {
  isDevelopment: process.env.NODE_ENV === 'development',
  URL: ROOT_URL,
  EWM: ROOT_URL,
  gwUrl: 'http://peixun.ruc.edu.cn/admin/login/pxlogin.html',
  windowUrl: '/attachment/contract',
  windowUrl_yxb: '/attachment/yxb_contract',
  mapJsonURL: '/static/json/',
  ...fileAPI,
  userInfo: {},
  auth_menu: authMenu,
  isCollapse: false,
  showCollapse: false,
  activeMenu: '1',
  crumbs: [''],
  usersData: {},
  userId: [],
  structuresList: [],
  structuresId: [],
  articleData: {},
  articleId: [],
  readUsers: [],
  unreadData: {},
  getForms: {
    name: '',
    form: null
  },
  zsjz_divide: 1571018400000,
  zsjz_divide_4: 1608566400000,
  documentNews: {
    'internal': 0,
    'work': 0,
    'document': 0,
    'meeting': 0,
    'reporting': 0
  },
  versionTime: 1574899200000,
  versionTime_4: 1602806400000,
  versionTime_4_sign: 1609862400000,
  sce_college: '继续教育学院',
  fz202101: 1610294400000
}
