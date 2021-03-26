export const menuList = [
  {
    auth: 3,
    title: '系统首页',
    path: '/home/index/index',
    icon: 'fa-home',
    disabled: true,
    center_key: 1,
    yxb: {
      wrap: false
    }
  },
  {
    auth: 1,
    title: '用户管理',
    path: '/home/users',
    icon: 'fa-user-circle',
    center_key: 8,
    subMenu: [
      {
        title: '工作人员登记',
        path: '/home/users/worker',
        auth: 1,
        center_key: 8,
      },
      {
        title: '学院 / 部门管理',
        path: '/home/users/college',
        auth: 1,
        center_key: 8,
      },
      {
        title: '用户登录日志',
        path: '/home/users/log',
        auth: 1,
        center_key: 8,
      }
    ]
  },
  {
    auth: 1,
    title: '系统管理员',
    path: '/home/users/super',
    icon: 'fa-user-secret ',
    center_key: 8,
  },
  {
    auth: 3,
    title: '消息管理',
    path: '/home/news',
    icon: 'fa-comment',
    center_key: 5,
    yxb: {
      wrap: false,
      role_no: 1
    },
    subMenu: [
      {
        title: '内部通知',
        path: '/home/news/inform',
        auth: 3,
        center_key: 5,
        tip: 'inform',
        tip2: 'internal',
        yxb: {
          wrap: false,
          role_no: 1
        }
      },
      {
        title: '工作刊物',
        path: '/home/news/reference',
        auth: 3,
        center_key: 5,
        tip: 'reference',
        tip2: 'work',
        yxb: {
          wrap: false,
          role_no: 1
        }
      },
    ]
  },
  {
    auth: 1,
    title: '日程管理',
    path: '/home/schedule',
    icon: 'fa-calendar',
    center_key: 4,
    subMenu: [
      {
        title: '日程管理',
        path: '/home/schedule/leader',
        auth: 1,
        center_key: 4,
      },
      {
        title: '会议室日程',
        path: '/home/schedule/meetingroom',
        auth: 1,
        center_key: 4,
      }
    ]
  },
  {
    auth: 1,
    title: '公文管理',
    path: '/home/document',
    icon: 'fa-briefcase',
    center_key: 4,
    subMenu: [
      {
        title: '处内公文',
        path: '/home/document/yngw',
        auth: 1,
        center_key: 4,
        tip: 'yngw',
        tip2: 'document'
      },
      {
        title: '会议纪要',
        path: '/home/document/hyjy',
        auth: 1,
        center_key: 4,
        tip: 'hyjy',
        tip2: 'meeting'
      },
      {
        title: '信访登记',
        path: '/home/document/xfdj',
        auth: 1,
        center_key: 4,
        tip: 'xfdj',
        tip2: 'reporting'
      }
    ]
  },
  {
    auth: 3,
    title: '办班专业管理',
    path: '/home/class_major/index',
    icon: 'fa-flag',
    is_yjsy: 1, // 
    yxb: {
      wrap: false
    }
  },
  {
    auth: 3,
    title: '项目管理',
    path: '/home/project/index/list',
    icon: 'fa-shopping-bag',
    center_key: 1,
    yxb: {
      wrap: true
    }
  },
  {
    auth: 3,
    title: '成人学历教育管理',
    path: '/home/adult/recruit',
    icon: 'fa-graduation-cap',
    center_key: 1,
    subMenu: [
      {
        title: '招生计划',
        path: '/home/adult/recruit/list',
        auth: 3,
        center_key: 1,
      },
      // {
      //     title: '班级管理',
      //     path: '/home/adult/class',
      //     auth: 3,
      //     center_key: 1,
      // },
      // {
      //     title: '试卷库',
      //     path: '/home/adult/paper',
      //     auth: 3,
      //     center_key: 1,
      // }
    ]
  },
  // {
  //     auth: 3,
  //     title: '网络学历教育管理',
  //     path: '/home/internet',
  //     icon: 'fa-globe',
  //     center_key: 1,
  //     subMenu: [
  //         {
  //             title: '招生计划',
  //             path: '/home/internet/recruit',
  //             auth: 3,
  //             center_key: 1,
  //         },
  //     ]
  // },
  {
    auth: 3,
    title: '协议管理',
    path: '/home/protocol',
    icon: 'fa-newspaper-o',
    center_key: 1,
    yxb: {
      wrap: true
    },
    subMenu: [
      {
        title: '校外委托学院办班',
        path: '/home/protocol/entrust/list',
        center_key: 1,
        auth: 3,
        yxb: {
          wrap: true
        }
      },
      {
        title: '辅助工作对外委托',
        path: '/home/protocol/assist/list',
        center_key: 1,
        auth: 3,
        yxb: {
          wrap: true
        }
      },
      {
        title: '校内合作单位协议',
        path: '/home/protocol/college/list',
        center_key: 1,
        auth: 3,
        yxb: {
          wrap: true
        }
      },
      {
        title: '其他协议',
        path: '/home/protocol/other',
        center_key: 1,
        auth: 3,
        yxb: {
          wrap: true
        }
      }
    ]
  },
  {
    auth: 3,
    title: '学员管理',
    path: '/home/students',
    icon: 'fa-user-plus',
    center_key: 1,
    yxb: {
      wrap: true
    },
    subMenu: [
      {
        title: '学员管理',
        path: '/home/students/message',
        center_key: 1,
        auth: 3,
        yxb: {
          wrap: true
        }
      },
      {
        title: '学员审核',
        path: '/home/students/audit',
        center_key: 1,
        auth: 2,
        yxb: {
          wrap: true
        }
      }
    ]
  },
  {
    auth: 3,
    title: '证书管理',
    path: '/home/certificate',
    icon: 'fa-leanpub',
    center_key: 1,
    yxb: {
      wrap: true,
    },
    subMenu: [
      {
        title: '证书申领',
        path: '/home/certificate/index',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '证书结算',
        path: '/home/certificate/bill',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
    ]
  },
  {
    auth: 3,
    title: '财务管理',
    path: '/home/finance',
    icon: 'fa-database',
    center_key: 1,
    yxb: {
      wrap: true
    },
    subMenu: [
      {
        title: '收费管理',
        path: '/home/finance/charge',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      // {
      //   title:'票据管理',
      //   path:'/home/finance/note',
      //   auth:3,
      //   center_key: 1,
      //   yxb: {
      //     wrap: true
      //   }
      // },
      {
        title: '结算管理',
        path: '/home/finance/account/list',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      // {
      //   title:'课酬管理',
      //   path:'/home/finance/dollars',
      //   auth:3,
      //   center_key: 1,
      //   yxb: {
      //     wrap: true
      //   }
      // },
      {
        title: '报销管理',
        path: '/home/finance/expense',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      // {
      //   title:'预决算管理',
      //   path:'/home/finance/budget',
      //   auth: 3,
      //   center_key: 1,
      //   yxb: {
      //     wrap: true
      //   }
      // }
    ]
  },
  {
    auth: 3,
    title: '宣传推广',
    path: '/home/propaganda',
    icon: 'fa-bullhorn',
    center_key: 1,
    yxb: {
      wrap: true
    },
    subMenu: [
      {
        title: '宣传推广申报',
        path: '/home/propaganda/promote',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      // {
      //     title:'宣传推广报销',
      //     path:'/home/propaganda/account',
      //     auth:3,
      // center_key: 1,
      // }
    ]
  },
  {
    auth: 3,
    title: '评估与考核管理',
    path: '/home/assess',
    icon: 'fa-check-square-o',
    center_key: 1,
    yxb: {
      wrap: true
    },
    subMenu: [
      {
        title: '调查问卷管理',
        path: '/home/assess/questionnaire',
        auth: 1,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '项目评估管理',
        path: '/home/assess/project',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '课程评估管理',
        path: '/home/assess/course',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '课程评估报告统计',
        path: '/home/assess/report',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '项目考核管理',
        path: '/home/assess/result',
        auth: 1,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '预设问卷管理',
        path: '/home/assess/preset',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
      {
        title: '试题管理',
        path: '/home/assess/exam',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: true
        }
      },
    ]
  },
  {
    auth: 3,
    title: '课程与教师管理',
    path: '/home/curriculum',
    icon: 'fa-wpforms',
    center_key: 6,
    yxb: {
      wrap: false
    },
    subMenu: [
      {
        title: '课程管理',
        path: '/home/curriculum/course',
        auth: 3,
        center_key: 6,
        yxb: {
          wrap: false
        }
      },
      {
        title: '教师管理',
        path: '/home/curriculum/teacher',
        auth: 3,
        center_key: 6,
        yxb: {
          wrap: false
        }
      }
    ]
  },
  {
    auth: 3,
    title: '委托单位管理',
    path: '/home/majorunit/index',
    icon: 'fa-modx',
    center_key: 6,
    yxb: {
      wrap: false
    }
  },
  {
    auth: 3,
    title: '辅助单位管理',
    path: '/home/helperunit/index',
    icon: 'fa-medium',
    center_key: 6,
    yxb: {
      wrap: false
    }
  },
  {
    auth: 3, // 
    title: '数据统计管理',
    path: '/home/data',
    icon: 'fa-bar-chart-o',
    center_key: 6
  },
  {
    auth: 3,
    title: '图书服务管理',
    path: '/home/books',
    icon: 'fa-book',
    center_key: 1,
    yxb: {
      wrap: false
    },
    subMenu: [
      {
        title: '图书馆参观申请',
        path: '/home/books/visit',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: false
        },
      },
      {
        title: '阅览证申报管理',
        path: '/home/books/card',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: false
        },
      },
      {
        title: '编外项目学员录入',
        path: '/home/books/entering',
        auth: 1,
        center_key: 1,
        yxb: {
          wrap: false
        },
      },
      {
        title: '编外项目学员查询',
        path: '/home/books/query',
        auth: 1,
        center_key: 1,
        yxb: {
          wrap: false
        },
      },
    ]
  },
  {
    auth: 3,
    title: '教室租借管理',
    path: '/home/classroom',
    icon: 'fa-gg',
    center_key: 1,
    yxb: {
      wrap: false
    },
    subMenu: [
      {
        title: '学院教室租借备案',
        path: '/home/classroom/record',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: false
        },
      },
      {
        title: '学院教室使用登记',
        path: '/home/classroom/finance',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: false
        },
      },
      {
        title: '学院教室示意图',
        path: '/home/classroom/image',
        auth: 3,
        center_key: 1,
        yxb: {
          wrap: false
        },
      }
    ]
  },
  {
    auth: 3,
    title: '入校申请',
    path: '/home/enrolled/index',
    icon: 'fa-exchange',
    center_key: 1,
    yxb: {
      wrap: false
    }
  },
  {
    title: '微信管理',
    path: '/home/weixin',
    icon: 'fa-weixin',
    auth: 1,
    center_key: 7,
    subMenu: [
      {
        title: '自定义回复管理',
        path: '/home/weixin/reply',
        auth: 1,
        center_key: 7,
      },
      {
        title: '文本管理',
        path: '/home/weixin/text',
        auth: 1,
        center_key: 7,
      },
      {
        title: '图文管理',
        path: '/home/weixin/image',
        auth: 1,
        center_key: 7,
      },
      {
        title: '自定义菜单管理',
        path: '/home/weixin/menu',
        auth: 1,
        center_key: 7,
      },
    ]
  },
  {
    auth: 1,
    title: '基础配置管理',
    path: '/home/config',
    icon: 'fa-cogs',
    center_key: 1,
    subMenu: [
      {
        title: '地区管理',
        path: '/home/config/area',
        auth: 1,
        center_key: 1,
      },
      {
        title: '专业管理',
        path: '/home/config/professional',
        auth: 1,
        center_key: 1,
      }
    ]
  },
  {
    auth: 1,
    title: '专业管理',
    path: '/home/major',
    icon: 'fa-server',
    yxb: {
      wrap: false
    }
  }
]
