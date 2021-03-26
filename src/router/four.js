
import PublicRouterView from '@/components/PublicRouterView.vue'
import FourPublicWrap from '../components/four/FourPublicWrap.vue'

export default [
  {
    path: '/home/project/index/list/wrap',
    meta: {
      four_wrap: true,
      four_id: 1,
      four_title: '项目',
      Approve_field: 'pro_num'
    },
    component: FourPublicWrap,
    alias: '/home/project/index/list'
  },
  {
    path: '/home/protocol/entrust/list/wrap',
    meta: {
      four_wrap: true,
      four_title: '委托协议',
      Approve_field: 'wt_num'
    },
    component: FourPublicWrap,
    alias: '/home/protocol/entrust/list'
  },
  {
    path: '/home/protocol/assist/list/wrap',
    meta: {
      four_wrap: true,
      four_title: '辅助协议',
      Approve_field: 'fz_num'
    },
    component: FourPublicWrap,
    alias: '/home/protocol/assist/list'
  },
  {
    path: '/home/protocol/college/list/wrap',
    meta: {
      four_wrap: true,
      four_title: '合作单位协议',
      Approve_field: 'hz_num'
    },
    component: FourPublicWrap,
    alias: '/home/protocol/college/list'
  },
  {
    path: '/home/protocol/other/wrap',
    meta: {
      four_wrap: true,
      four_title: '其他协议',
      Approve_field: 'qt_num'
    },
    component: FourPublicWrap,
    alias: '/home/protocol/other'
  },
  {
    path: '/home/students/message/wrap',
    meta: {
      four_wrap: true,
      four_title: '学员'
    },
    component: FourPublicWrap,
    alias: '/home/students/message'
  },
  {
    path: '/home/students/audit/wrap',
    meta: {
      four_wrap: true,
      four_title: '学员审核'
    },
    component: FourPublicWrap,
    alias: '/home/students/audit'
  },
  {
    path: '/home/certificate/index/wrap',
    meta: {
      four_wrap: true,
      four_title: '证书申领',
      Approve_field: 'zs_num'
    },
    component: FourPublicWrap,
    alias: '/home/certificate/index'
  },
  {
    path: '/home/certificate/bill/wrap',
    meta: {
      four_wrap: true,
      four_title: '证书结算',
      Approve_field: 'zs_js_num'
    },
    component: FourPublicWrap,
    alias: '/home/certificate/bill'
  },
  {
    path: '/home/finance/charge/wrap',
    meta: {
      four_wrap: true,
      four_title: '收费'
    },
    component: FourPublicWrap,
    alias: '/home/finance/charge'
  },
  {
    path: '/home/finance/account/list/wrap',
    meta: {
      four_wrap: true,
      four_title: '结算',
      Approve_field: 'js_num'
    },
    component: FourPublicWrap,
    alias: '/home/finance/account/list'
  },
  {
    path: '/home/finance/expense/wrap',
    meta: {
      four_wrap: true,
      four_title: '报销'
    },
    component: FourPublicWrap,
    alias: '/home/finance/expense'
  },
  {
    path: '/home/propaganda/promote/wrap',
    meta: {
      four_wrap: true,
      four_title: '宣传推广',
      Approve_field: 'tg_num'
    },
    component: FourPublicWrap,
    alias: '/home/propaganda/promote'
  },
  {
    path: '/home/assess/questionnaire/wrap',
    meta: {
      four_wrap: true,
      four_title: '调查问卷'
    },
    component: FourPublicWrap,
    alias: '/home/assess/questionnaire'
  },
  {
    path: '/home/assess/project/wrap',
    meta: {
      four_wrap: true,
      four_title: '项目评估'
    },
    component: FourPublicWrap,
    alias: '/home/assess/project'
  },
  {
    path: '/home/assess/course/wrap',
    meta: {
      four_wrap: true,
      four_title: '课程评估'
    },
    component: FourPublicWrap,
    alias: '/home/assess/course'
  },
  {
    path: '/home/assess/report/wrap',
    meta: {
      four_wrap: true,
      four_title: '课程评估报告'
    },
    component: FourPublicWrap,
    alias: '/home/assess/report'
  },
  {
    path: '/home/assess/result/wrap',
    meta: {
      four_wrap: true,
      four_title: '项目考核'
    },
    component: FourPublicWrap,
    alias: '/home/assess/result'
  },
  {
    path: '/home/assess/preset/wrap',
    meta: {
      four_wrap: true,
      four_title: '预设问卷'
    },
    component: FourPublicWrap,
    alias: '/home/assess/preset'
  },
  {
    path: '/home/assess/exam/wrap',
    meta: {
      four_wrap: true,
      four_title: '试题'
    },
    component: FourPublicWrap,
    alias: '/home/assess/exam'
  },
  {
    path: '/home/curriculum/course/wrap',
    meta: {
      four_wrap: true,
      four_title: '课程'
    },
    component: FourPublicWrap,
    alias: '/home/curriculum/course'
  },
  {
    path: '/home/curriculum/teacher/wrap',
    meta: {
      four_wrap: true,
      four_title: '教师'
    },
    component: FourPublicWrap,
    alias: '/home/curriculum/teacher'
  },
  {
    path: '/home/majorunit/index/wrap',
    meta: {
      four_wrap: true,
      four_title: '委托单位'
    },
    component: FourPublicWrap,
    alias: '/home/majorunit/index'
  },
  {
    path: '/home/helperunit/index/wrap',
    meta: {
      four_wrap: true,
      four_title: '辅助单位'
    },
    component: FourPublicWrap,
    alias: '/home/helperunit/index'
  },
  {
    path: 'class_major',
    name: 'FourClassMajor',
    component: PublicRouterView,
    meta: {
      auth: true,
      role: 3,
      menu_auth: true,
      menu_path: '/home/class_major',
      is_yjsy: 1
    },
    children: [
      {
        path: 'index',
        name: 'FourClassMajorIndex',
        component: resolve => require(['@/components/four/class/FourClassIndex.vue'], resolve),
        meta: {
          auth: true,
          role: 3,
          menu_auth: true,
          menu_path: '/home/class_major/index',
          is_yjsy: 1
        }
      },
      {
        path: 'form',
        name: 'FourClassMajorForm',
        component: resolve => require(['@/components/four/class/FourClassForm.vue'], resolve),
        meta: {
          auth: true,
          role: 3,
          menu_auth: true,
          menu_path: true,
          is_yjsy: 1
        }
      },
      {
        path: 'info',
        name: 'FourClassMajorInfo',
        component: resolve => require(['@/components/four/class/FourClassInfo.vue'], resolve),
        meta: {
          auth: true,
          role: 3,
          menu_auth: true,
          menu_path: true,
          is_yjsy: 1
        }
      }
    ]
  },
  {
    path: 'major',
    name: 'FourMajorIndex',
    component: resolve => require(['@/components/four/major/FourMajorIndex.vue'], resolve),
    meta: {
      auth: true,
      role: 1,
      menu_auth: true
    }
  }
]