import { authMenu } from '@/store/state.js'
import ckTitle from '@/assets/js/ckTitle.js'


 export function loginCallback (params = {}) {
  let { Data, $router, that, usertype, fn } = params
  const headers = {
    authkey: Data.authKey,
    sessionid: Data.sessionId
  }
  let permissions = Data.userInfo.permissions ? Data.userInfo.permissions.filter(item => item) : []
  const userInfo = {
    uid: Data.userInfo.id,
    role: Data.userInfo.tp, //  1管理员 2教师
    isSuperman: Data.userInfo.id === 1,
    chuID_1: usertype === 1 ? Data.userInfo.realname === that.chuNamePublic() : false,
    chuID_2: usertype === 1 ? Data.userInfo.realname === that.chuNamePublic({type: 2}) : false,
    name: Data.userInfo.username,
    username: Data.userInfo.username,
    realname: Data.userInfo.realname,
    mobile: Data.userInfo.mobile,
    tel: Data.userInfo.tel,
    email: Data.userInfo.email,
    image: Data.userInfo.image,
    collegeId: Data.userInfo.college_id || null,
    college: Data.userInfo.college,
    lastTime: Data.userInfo.last_time,
    auth_college: Data.userInfo.auth_college,
    auth_cert: Data.userInfo.auth_cert,
    auth_question: Data.userInfo.auth_question,
    auth_report: Data.userInfo.auth_report,
    auth_share: Data.userInfo.auth_share,
    is_app: Data.userInfo.is_app - 0 || 0, // app中签字(1开启0禁止)
    id_card: Data.userInfo.id_card, // 身份证号
    permissions: permissions && permissions.length ? permissions : ['1'],
    unreadTip: { // 
      inform: Data.userInfo.userse ? Data.userInfo.userse.internal : 0,
      reference: Data.userInfo.userse ? Data.userInfo.userse.work : 0,
      yngw: Data.userInfo.resm ? Data.userInfo.resm.document : 0,
      hyjy: Data.userInfo.resm ? Data.userInfo.resm.meeting : 0,
      xfdj: Data.userInfo.resm ? Data.userInfo.resm.reporting : 0
    },
    is_yjsy: Data.userInfo.is_yjsy, // 
    auth_side: Data.userInfo.auth_side && Data.userInfo.auth_side.length ? Data.userInfo.auth_side : usertype === 1 ? [] : authMenu // （非管理员，默认有首页权限）
  }
  fn && fn(userInfo)
  that.$cookie.set('headers', JSON.stringify(headers))
  that.$cookie.set('userInfo', JSON.stringify(userInfo)) // 
  if (userInfo.role === 2) {
    $router.push('/center_teacher')
  } else if (userInfo.role === 1) {
    if (userInfo.is_yjsy) { // 
      sessionStorage.setItem('CK', 2)
      sessionStorage.setItem('CK-activeMenu', ckTitle['2'].is_yjsy.activeMenu)
      $router.push({
        name: ckTitle['2'].is_yjsy.activeName
      })
    } else {
      $router.push('/center')
    }
  }
 }