import Vue from 'vue'
import Router from 'vue-router'

import PublicRouterView from '@/components/PublicRouterView.vue'
import fourRoutes from './four.js'

import VueCookie from 'vue-cookie'
import methods from '@/assets/js/methods'

Vue.use(Router)

const routes = [{
    path: '/',
    redirect: '/login/teacher'
  },
  {
    path: '/login/admin',
    name: 'AppLogin',
    meta: {
      is_Login: true
    },
    component: resolve => require(['../view/login/AppLogin'], resolve)
  },
  {
    path: '/qywechat/:id',
    name: 'AppWeChat',
    meta: {
      is_Login: true
    },
    component: resolve => require(['../view/weixin/AppWeChat'], resolve)
  },
  {
    path: '/login/teacher',
    name: 'AppLoginTeacher',
    meta: {
      is_Login: true
    },
    component: resolve => require(['../view/login/AppLoginTeacher'], resolve)
  },
  {
    path: '/center',
    name: 'AppCenter',
    meta: {
      auth: true,
      role: 1,
      menu_auth: true,
      center_auth: 1
    },
    component: resolve => require(['../view/center/AppCenter'], resolve)
  },
  {
    path: '/center_teacher',
    name: 'AppCenterTeacher',
    meta: {
      auth: true,
      role: 2, // 
      menu_auth: true,
      center_auth: 2
    },
    component: resolve => require(['../view/center/AppCenterTeacher.vue'], resolve)
  },
  {
    path: '/home',
    name: 'AppHome',
    component: resolve => require(['../view/home/AppHome'], resolve),
    meta: {
      auth: true,
      role: 3 // 
    },
    children: [{
        path: '/home',
        redirect: '/home/index'
      },
      {
        path: 'index',
        name: 'AppIndex',
        component: PublicRouterView,
        meta: { // 
          auth: true,
          role: 3, // 
          menu_auth: true, // 
          menu_path: '/home/index/index'
        },
        children: [{
            path: '/home/index',
            redirect: '/home/index/index'
          },
          {
            path: 'index',
            name: 'AppIndexIndex',
            component: resolve => require(['../components/modules/index/AppIndexIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/index/index' // 
            }
          }
        ]
      },
      {
        path: 'users',
        name: 'AppUsers',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 1, // 
          menu_auth: true,
          menu_path: '/home/users'
        },
        children: [{
            path: '/home/users',
            redirect: 'super'
          },
          {
            path: 'super',
            name: 'AppUsersSuper',
            component: resolve => require(['../components/modules/users/AppUsersSuper'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/users/super'
            }
          },
          {
            path: 'worker',
            name: 'AppUsersWorker',
            component: resolve => require(['../components/modules/users/AppUsersWorker'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/users/worker'
            }
          },
          {
            path: 'worker_form',
            name: 'AppUsersWorkerForm',
            component: resolve => require(['../components/modules/users/worker/AppUsersWorkerForm'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/users/worker'
            }
          },
          {
            path: 'college',
            name: 'AppUsersCollege',
            component: resolve => require(['../components/modules/users/AppUsersCollege'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/users/college',
            }
          },
          {
            path: 'log',
            name: 'AppConfigLog',
            component: resolve => require(['../components/modules/config/AppConfigLog'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/users/log',
            }
          }
        ]
      },
      {
        path: 'news',
        name: 'AppNews',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/news'
        },
        children: [{
            path: '/home/news',
            redirect: '/home/news/inform'
          },
          {
            path: 'inform',
            name: 'AppNewsInform',
            component: resolve => require(['../components/modules/news/AppNewsInform'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath1: 'home_news_inform_1',
              menu_auth: true,
              menu_path: '/home/news/inform',
            }
          },
          {
            path: 'reference',
            name: 'AppNewsReference',
            component: resolve => require(['../components/modules/news/AppNewsReference'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'home_news_inform_2',
              menu_auth: true,
              menu_path: '/home/news/reference',
            }
          },
          {
            path: 'article/:id',
            name: 'AppNewsArticle',
            component: resolve => require(['../components/modules/news/components/AppNewsArticle'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath1: 'home_news_inform_1',
              keepPath2: 'home_news_inform_2',
              menu_auth: true,
              menu_path: true 
            }
          }
        ]
      },
      {
        path: 'schedule',
        name: 'AppSchedule',
        component: PublicRouterView,
        meta: { // 
          auth: true,
          role: 3, // 
          menu_auth: true, // 
          menu_path: '/home/schedule'
        },
        children: [{
            path: '/home/schedule',
            redirect: '/home/schedule/leader'
          },
          {
            path: 'leader',
            name: 'AppScheduleLeader',
            component: resolve => require(['../components/modules/schedule/AppScheduleLeader'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/schedule/leader'
            }
          },
          {
            path: 'meetingroom',
            name: 'AppScheduleMeetingroom',
            component: resolve => require(['../components/modules/schedule/AppScheduleMeetingroom'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/schedule/meetingroom'
            }
          }
        ]
      },
      {
        path: 'document',
        name: 'AppDocument',
        component: resolve => require(['../components/modules/AppDocument'], resolve),
        meta: { // 
          auth: true,
          role: 3, // 
          menu_auth: true, // 
          menu_path: '/home/document' 
        },
        children: [{
            path: '/home/document',
            redirect: '/home/document/yngw'
          },
          {
            path: 'yngw',
            name: 'AppDocumentYngw',
            component: resolve => require(['../components/modules/document/AppDocumentYngw'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_yngw',
              menu_auth: true,
              menu_path: '/home/document/yngw'
            }
          },
          {
            path: 'yngwForm',
            name: 'AppDocumentYngwForm',
            component: resolve => require(['../components/modules/document/yngw/AppDocumentYngwForm'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_yngw',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'yngwInfo',
            name: 'AppDocumentYngwInfo',
            component: resolve => require(['../components/modules/document/yngw/AppDocumentYngwInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_yngw',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'yngwPrint',
            name: 'AppDocumentYngwPrint',
            component: resolve => require(['../components/modules/document/components/DocumentContentPrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_yngw',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'yngw_IssueSituation',
            name: 'AppDocumentYngwIssueSituation',
            component: resolve => require(['../components/modules/document/components/DocumentIssuedSituation'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_yngw',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'yngw_Issue',
            name: 'AppDocumentYngwIssue',
            component: resolve => require(['../components/modules/document/components/DocumentIssued'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_yngw',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'hyjy',
            name: 'AppDocumentHyjy',
            component: resolve => require(['../components/modules/document/AppDocumentHyjy'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_hyjy',
              menu_auth: true,
              menu_path: '/home/document/hyjy'
            }
          },
          {
            path: 'hyjyForm',
            name: 'AppDocumentHyjyForm',
            component: resolve => require(['../components/modules/document/hyjy/AppDocumentHyjyForm'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_hyjy',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'hyjyInfo',
            name: 'AppDocumentHyjyInfo',
            component: resolve => require(['../components/modules/document/hyjy/AppDocumentHyjyInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_hyjy',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'hyjyPrint',
            name: 'AppDocumentHyjyPrint',
            component: resolve => require(['../components/modules/document/components/DocumentContentPrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_hyjy',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'hyjy_IssueSituation',
            name: 'AppDocumentHyjyIssueSituation',
            component: resolve => require(['../components/modules/document/components/DocumentIssuedSituation'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_hyjy',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'hyjy_Issue',
            name: 'AppDocumentHyjyIssue',
            component: resolve => require(['../components/modules/document/components/DocumentIssued'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_hyjy',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'xfdj',
            name: 'AppDocumentXfdj',
            component: resolve => require(['../components/modules/document/AppDocumentXfdj'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_xfdj',
              menu_auth: true,
              menu_path: '/home/document/xfdj'
            }
          },
          {
            path: 'xfdjForm',
            name: 'AppDocumentXfdjForm',
            component: resolve => require(['../components/modules/document/xfdj/AppDocumentXfdjForm'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_xfdj',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'xfdjInfo',
            name: 'AppDocumentXfdjInfo',
            component: resolve => require(['../components/modules/document/xfdj/AppDocumentXfdjInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_document_xfdj',
              menu_auth: true,
              menu_path: true
            }
          }
        ]
      },
      {
        path: 'propaganda',
        name: 'AppPropaganda',
        component: PublicRouterView,
        meta: { // 
          auth: true,
          role: 3, // 
          menu_auth: true, // 
          menu_path: '/home/propaganda'
        },
        children: [{
            path: '/home/propaganda',
            redirect: '/home/propaganda/yngw'
          },
          {
            path: 'promote',
            name: 'AppPropagandaPromote',
            component: resolve => require(['../components/modules/propaganda/AppPropagandaPromote'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_propaganda_promote',
              menu_auth: true,
              menu_path: '/home/propaganda/promote'
            }
          },
          {
            path: 'promote/form',
            name: 'AppPropagandaPromoteForm',
            component: resolve => require(['../components/modules/propaganda/promote/AppPropagandaPromoteForm'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_propaganda_promote',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'promote/print',
            name: 'AppPropagandaPromotePrint',
            component: resolve => require(['../components/modules/propaganda/promote/AppPropagandaPromotePrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_propaganda_promote',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'account',
            name: 'AppPropagandaAccount',
            component: resolve => require(['../components/modules/propaganda/AppPropagandaAccount'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_propaganda_account',
              menu_auth: true,
              menu_path: '/home/propaganda/account'
            }
          }
        ]
      },
      {
        path: 'project',
        name: 'AppProject',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/project'
        },
        children: [{
            path: '/home/project',
            redirect: '/home/project/index/list'
          }, //
          {
            path: 'index/list',
            name: 'projectList',
            component: resolve => require(['../components/modules/project/AppProjectIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: '/home/project/index/list',
            },
          },
          {
            path: 'index/recycle',
            name: 'projectRecycle',
            component: resolve => require(['../components/modules/project/AppProjectIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'add',
            name: 'AppProjectAdd',
            component: resolve => require(['../components/modules/project/components/AppProjectAdd'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'edit',
            name: 'AppProjectEdit',
            component: resolve => require(['../components/modules/project/components/AppProjectAdd'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'check',
            name: 'AppProjectCheck',
            component: resolve => require(['../components/modules/project/components/AppProjectCheck'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'inform/:id',
            name: 'AppProjectInform',
            component: resolve => require(['../components/modules/project/components/AppProjectInform'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'declare/:id',
            name: 'AppProjectDeclare',
            component: resolve => require(['../components/modules/project/components/AppProjectDeclare'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'preview/:id',
            name: 'AppProjectDeclarePreview',
            component: resolve => require(['../components/modules/project/components/AppProjectDeclare'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'declare_modify/:id',
            name: 'AppProjectDeclareModify',
            component: resolve => require(['../components/modules/project/components/AppProjectDeclareModify'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'code',
            name: 'AppProjectCode',
            component: resolve => require(['../components/modules/assess/components/AppAssessCode'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'ylx',
            name: 'AppProjectYlx',
            component: resolve => require(['../components/modules/project/components/AppProjectYlx'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'modify/:id',
            name: 'AppProjectModify',
            component: resolve => require(['../components/modules/project/components/AppProjectAdd'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          },
          {
            path: 'modifyList/:id',
            name: 'AppProjectModifyList',
            component: resolve => require(['../components/modules/project/components/AppProjectModifyList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_project',
              menu_auth: true,
              menu_path: true
            }
          }
        ]
      },
      {
        path: 'adult',
        name: 'AppAdult',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/adult'
        },
        children: [{
            path: '/home/adult',
            redirect: '/home/adult/recruit'
          },
          {
            path: 'recruit',
            name: 'AppAdultRecruit',
            component: PublicRouterView,
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/adult/recruit',
            },
            children: [{
                path: '/home/adult/recruit',
                redirect: '/home/adult/recruit/list'
              },
              {
                path: 'list',
                name: 'AppAdultRecruitList',
                component: resolve => require(['../components/modules/adult/recruit/AppAdultRecruitList'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_recruit_list',
                  menu_auth: true,
                  menu_path: '/home/adult/recruit/list',
                },
              },
              {
                path: 'profession',
                name: 'AppAdultRecruitProfession',
                component: resolve => require(['../components/modules/adult/recruit/AppAdultRecruitProfession'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              },
              {
                path: 'form',
                name: 'AppAdultRecruitForm',
                component: resolve => require(['../components/modules/adult/recruit/AppAdultRecruitForm'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              },
              {
                path: 'info',
                name: 'AppAdultRecruitInfo',
                component: resolve => require(['../components/modules/adult/recruit/AppAdultRecruitInfo'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              },
              {
                path: 'students',
                name: 'AppAdultRecruitStudents',
                component: resolve => require(['../components/modules/adult/recruit/AppAdultRecruitStudents'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              }
            ]
          },
          {
            path: 'class',
            name: 'AppAdultClass',
            component: PublicRouterView,
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/adult/class',
            },
            children: [{
                path: '/home/adult/class',
                redirect: '/home/adult/class/list'
              },
              {
                path: 'list',
                name: 'AppAdultClassList',
                component: resolve => require(['../components/modules/adult/class/AppAdultClassList'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_class_list',
                  menu_auth: true,
                  menu_path: '/home/adult/class/list',
                },
              },
              {
                path: 'student',
                name: 'AppAdultClassStudent',
                component: PublicRouterView,
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_class_list',
                  menu_auth: true,
                  menu_path: true,
                },
                children: [{
                    path: '/home/adult/class/student',
                    redirect: '/home/adult/class/student/list'
                  },
                  {
                    path: 'list',
                    name: 'AppAdultClassStudentList',
                    component: resolve => require(['../components/modules/adult/class/student/AppAdultClassStudentList'], resolve),
                    meta: {
                      auth: true,
                      role: 3, // 
                      keepPath: 'adult_class_list',
                      menu_auth: true,
                      menu_path: true,
                    },
                  },
                  {
                    path: 'info',
                    name: 'AppAdultClassStudentInfo',
                    component: resolve => require(['../components/modules/adult/class/student/AppAdultClassStudentInfo'], resolve),
                    meta: {
                      auth: true,
                      role: 3, // 
                      keepPath: 'adult_class_list',
                      menu_auth: true,
                      menu_path: true,
                    },
                  }
                ]
              },
              {
                path: 'schedule',
                name: 'AppAdultClassSchedule',
                component: PublicRouterView,
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_class_list',
                  menu_auth: true,
                  menu_path: true,
                },
                children: [{
                    path: '/home/adult/class/schedule',
                    redirect: '/home/adult/class/schedule/list'
                  },
                  {
                    path: 'list',
                    name: 'AppAdultClassScheduleList',
                    component: resolve => require(['../components/modules/adult/class/schedule/AppAdultClassScheduleList'], resolve),
                    meta: {
                      auth: true,
                      role: 3, // 
                      keepPath: 'adult_class_list',
                      menu_auth: true,
                      menu_path: true,
                    },
                  }
                ]
              }
            ]
          },
          {
            path: 'paper',
            name: 'AppAdultPaper',
            component: PublicRouterView,
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/adult/paper',
            },
            children: [{
                path: '/home/adult/paper',
                redirect: '/home/adult/paper/list'
              },
              {
                path: 'list',
                name: 'AppAdultPaperList',
                component: resolve => require(['../components/modules/adult/paper/AppAdultPaperList'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'adult_paper_list',
                  menu_auth: true,
                  menu_path: '/home/adult/paper/list',
                },
              },
            ]
          }
        ]
      },
      {
        path: 'internet',
        name: 'AppInternet',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/internet',
        },
        children: [{
            path: '/home/internet',
            redirect: '/home/internet/recruit'
          },
          {
            path: 'recruit',
            name: 'AppInternetRecruit',
            component: PublicRouterView,
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/internet/recruit',
            },
            children: [{
                path: '/home/internet/recruit',
                redirect: '/home/internet/recruit/list'
              },
              {
                path: 'list',
                name: 'AppInternetRecruitList',
                component: resolve => require(['../components/modules/internet/recruit/AppInternetRecruitList'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'internet_recruit_list',
                  menu_auth: true,
                  menu_path: '/home/internet/recruit',
                },
              },
              {
                path: 'profession',
                name: 'AppInternetRecruitProfession',
                component: resolve => require(['../components/modules/internet/recruit/AppInternetRecruitProfession'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'internet_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              },
              {
                path: 'form',
                name: 'AppInternetRecruitForm',
                component: resolve => require(['../components/modules/internet/recruit/AppInternetRecruitForm'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'internet_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              },
              {
                path: 'info',
                name: 'AppInternetRecruitInfo',
                component: resolve => require(['../components/modules/internet/recruit/AppInternetRecruitInfo'], resolve),
                meta: {
                  auth: true,
                  role: 3, // 
                  keepPath: 'internet_recruit_list',
                  menu_auth: true,
                  menu_path: true,
                },
              }
            ]
          },
        ]
      },
      {
        path: 'protocol',
        name: 'AppProtocol',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/protocol',
        },
        children: [
          {
            path: '/home/protocol',
            redirect: 'entrust/list'
          },
          {
            path: 'entrust/list',
            name: 'AppProtocolEntrustList',
            component: resolve => require(['../components/modules/protocol/AppProtocolEntrust'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: '/home/protocol/entrust/list',
            },
          },
          {
            path: 'entrust/recycle',
            name: 'AppProtocolEntrustRecycle',
            component: resolve => require(['../components/modules/protocol/AppProtocolEntrust'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'entrust/add',
            name: 'AppProtocolEntrustAdd',
            component: resolve => require(['../components/modules/protocol/components/entrust/AppProtocolEntrustAddEdit'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'entrust/edit/:id',
            name: 'AppProtocolEntrustEdit',
            component: resolve => require(['../components/modules/protocol/components/entrust/AppProtocolEntrustAddEdit'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'entrust/:id',
            name: 'AppProtocolEntrustDetails',
            component: resolve => require(['../components/modules/protocol/components/entrust/AppProtocolEntrustDetails'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'entrust/letter/:id',
            name: 'AppProtocolEntrustLetter',
            component: resolve => require(['../components/modules/protocol/components/entrust/AppProtocolEntrustLetter'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'entrustCheck/:id',
            name: 'AppProtocolEntrustCheck',
            component: resolve => require(['../components/modules/protocol/components/entrust/AppProtocolEntrustCheck'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assist/list',
            name: 'AppProtocolAssistList',
            component: resolve => require(['../components/modules/protocol/AppProtocolAssist'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: '/home/protocol/assist/list',
            },
          },
          {
            path: 'assist/recycle',
            name: 'AppProtocolAssistRecycle',
            component: resolve => require(['../components/modules/protocol/AppProtocolAssist'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assist/add/:id',
            name: 'AppProtocolAssistAdd',
            component: resolve => require(['../components/modules/protocol/components/assist/AppProtocolAssistAddEdit'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assist/edit/:id',
            name: 'AppProtocolAssistEdit',
            component: resolve => require(['../components/modules/protocol/components/assist/AppProtocolAssistAddEdit'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assist/:id',
            name: 'AppProtocolAssistDetails',
            component: resolve => require(['../components/modules/protocol/components/assist/AppProtocolAssistDetails'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assistCheck/:id',
            name: 'AppProtocolAssistCheck',
            component: resolve => require(['../components/modules/protocol/components/assist/AppProtocolAssistCheck'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assistCheckPdf',
            name: 'AppProtocolAssistCheckPdf',
            component: resolve => require(['../components/modules/protocol/components/assist/AppProtocolAssistCheckPdf'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'other',
            name: 'AppProtocolOther',
            component: resolve => require(['../components/modules/protocol/AppProtocolOther'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_other',
              menu_auth: true,
              menu_path: '/home/protocol/other',
            },
          },
          {
            path: 'other/list/:id',
            name: 'AppProtocolOtherList',
            component: resolve => require(['../components/modules/protocol/components/other/AppProtocolOtherList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_other',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'other/recycle/:id',
            name: 'AppProtocolOtherRecycle',
            component: resolve => require(['../components/modules/protocol/components/other/AppProtocolOtherList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_other',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'other/info/:id',
            name: 'AppProtocolOtherInfo',
            component: resolve => require(['../components/modules/protocol/components/other/AppProtocolOtherInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_other',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'other/letter/:id',
            name: 'AppProtocolOtherLetter',
            component: resolve => require(['../components/modules/protocol/components/other/AppProtocolOtherLetter'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_other'
            },
          },
          {
            path: 'other/check/:id',
            name: 'AppProtocolOtherCheck',
            component: resolve => require(['../components/modules/protocol/components/other/AppProtocolOtherInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_other',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'entrust/modify/list/1',
            name: 'AppProtocolModifyList1',
            component: resolve => require(['../components/modules/protocol/components/AppProtocolModifyList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'assist/modify/list/2',
            name: 'AppProtocolModifyList2',
            component: resolve => require(['../components/modules/protocol/components/AppProtocolModifyList'], resolve),
            meta: {
              auth: true,
              role: 3, // ,
              keepPath: 'home_assist',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'college/modify/list/3',
            name: 'AppProtocolModifyList3',
            component: resolve => require(['../components/modules/protocol/components/AppProtocolModifyList'], resolve),
            meta: {
              auth: true,
              role: 3, // ,
              keepPath: 'home_college',
              menu_auth: true,
              menu_path: true,
            },
          },

          {
            path: 'college/list',
            name: 'AppProtocolCollegeList',
            component: resolve => require(['../components/modules/protocol/AppProtocolCollege'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_college',
              menu_auth: true,
              menu_path: '/home/protocol/college/list',
            },
          },
          {
            path: 'college/recycle',
            name: 'AppProtocolCollegeRecycle',
            component: resolve => require(['../components/modules/protocol/AppProtocolCollege'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'college/add',
            name: 'AppProtocolCollegeAdd',
            component: resolve => require(['../components/modules/protocol/components/college/AppProtocolCollegeAddEdit'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'home_entrust',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'college/edit/:id',
            name: 'AppProtocolCollegeEdit',
            component: resolve => require(['../components/modules/protocol/components/college/AppProtocolCollegeAddEdit'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_college',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'college/:id',
            name: 'AppProtocolCollegeDetails',
            component: resolve => require(['../components/modules/protocol/components/college/AppProtocolCollegeDetails'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_college',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'college/letter/:id',
            name: 'AppProtocolCollegeLetter',
            component: resolve => require(['../components/modules/protocol/components/college/AppProtocolCollegeLetter'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_college',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'collegeCheck/:id',
            name: 'AppProtocolCollegeCheck',
            component: resolve => require(['../components/modules/protocol/components/college/AppProtocolCollegeCheck'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'home_college',
              menu_auth: true,
              menu_path: true,
            },
          },
        ]
      },
      {
        path: 'students',
        name: 'AppStudents',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/students',
        },
        children: [{
            path: '/home/students',
            redirect: 'message'
          },
          {
            path: 'message',
            name: 'AppStudentsMessage',
            component: resolve => require(['../components/modules/students/AppStudentsMessage'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'students_message',
              menu_auth: true,
              menu_path: '/home/students/message',
            },
          },
          {
            path: 'message/list/:id',
            name: 'AppStudentsList',
            component: resolve => require(['../components/modules/students/components/AppStudentsList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'students_message',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'message/print/:id',
            name: 'AppStudentsPrint',
            component: resolve => require(['../components/modules/students/components/AppStudentsPrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'students_message',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'audit',
            name: 'AppStudentsAudit',
            component: resolve => require(['../components/modules/students/AppStudentsAudit'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'students_audit',
              menu_auth: true,
              menu_path: '/home/students/audit',
            },
          },
          {
            path: 'check/:id',
            name: 'AppStudentsCheckList',
            component: resolve => require(['../components/modules/students/components/AppStudentsCheckList'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'students_audit',
              menu_auth: true,
              menu_path: true,
            },
          },
        ]
      },
      {
        path: 'certificate',
        name: 'AppCertificate',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/certificate',
        },
        children: [{
            path: '/home/certificate',
            redirect: 'index'
          },
          {
            path: 'index',
            name: 'AppCertificateIndex',
            component: resolve => require(['../components/modules/certificate/AppCertificateIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'certificate_index',
              menu_auth: true,
              menu_path: '/home/certificate/index',
            },
          },
          {
            path: 'index/info/:id',
            name: 'AppCertificateInfo',
            component: resolve => require(['../components/modules/certificate/components/index/AppCertificateInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'certificate_index',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'index/apply',
            name: 'AppCertificateApply',
            component: resolve => require(['../components/modules/certificate/components/index/AppCertificateApply'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'certificate_index',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'index/apply_list/:id',
            name: 'AppCertificateApplyList',
            component: resolve => require(['../components/modules/certificate/components/index/AppCertificateApplyList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'certificate_index',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'index/apply/print',
            name: 'AppCertificateApplyPrint',
            component: resolve => require(['../components/modules/certificate/components/index/AppCertificateApplyPrint'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'certificate_index',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'bill',
            name: 'AppCertificateBill',
            component: resolve => require(['../components/modules/certificate/AppCertificateBill'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'certificate_bill',
              menu_auth: true,
              menu_path: '/home/certificate/bill',
            },
          },
          {
            path: 'bill/set',
            name: 'AppCertificateBillSet',
            component: resolve => require(['../components/modules/certificate/components/bill/AppCertificateBillSet'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'certificate_bill',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'bill/info/:id',
            name: 'AppCertificateBillInfo',
            component: resolve => require(['../components/modules/certificate/components/bill/AppCertificateBillInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'certificate_bill',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'bill/check/:id',
            name: 'AppCertificateBillCheck',
            component: resolve => require(['../components/modules/certificate/components/bill/AppCertificateBillInfo'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'certificate_bill',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'bill/print/:id',
            name: 'AppCertificateBillPrint',
            component: resolve => require(['../components/modules/certificate/components/bill/AppCertificateBillPrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'certificate_bill',
              menu_auth: true,
              menu_path: true,
            },
          }
        ]
      },
      {
        path: 'finance',
        name: 'AppFinance',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/finance',
        },
        children: [{
            path: '/home/finance',
            redirect: 'account/list'
          },
          //票据
          {
            path: 'note',
            name: 'AppFinanceNote',
            component: resolve => require(['../components/modules/finance/AppFinanceNote'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_note',
              menu_auth: true,
              menu_path: '/home/finance/note',
            },
          },
          //结算
          {
            path: 'account/list',
            name: 'AppFinanceAccountList',
            component: resolve => require(['../components/modules/finance/AppFinanceAccount'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_account',
              menu_auth: true,
              menu_path: '/home/finance/account/list',
            },
          },
          {
            path: 'account/recycle',
            name: 'AppFinanceAccountRecycle',
            component: resolve => require(['../components/modules/finance/AppFinanceAccount'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_account',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'account/print/:id',
            name: 'AppFinanceAccountPrint',
            component: resolve => require(['../components/modules/finance/components/account/AppFinanceAccountPrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_account',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'account/add/:id',
            name: 'AppFinanceAccountAdd',
            component: resolve => require(['../components/modules/finance/components/account/AppFinanceAccountAdd'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'finance_account',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'account/edit/:id',
            name: 'AppFinanceAccountEdit',
            component: resolve => require(['../components/modules/finance/components/account/AppFinanceAccountAdd'], resolve),
            meta: {
              auth: true,
              role: 2, // 
              keepPath: 'finance_account',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'account/check/:id',
            name: 'AppFinanceAccountCheck',
            component: resolve => require(['../components/modules/finance/components/account/AppFinanceAccountCheck'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'finance_account',
              menu_auth: true,
              menu_path: true,
            },
          },
          //课酬
          {
            path: 'dollars',
            name: 'AppFinanceDollars',
            component: resolve => require(['../components/modules/finance/AppFinanceDollars'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_dollars',
              menu_auth: true,
              menu_path: '/home/finance/dollars',
            },
          },
          //报销
          {
            path: 'expense',
            name: 'AppFinanceExpense',
            component: resolve => require(['../components/modules/finance/AppFinanceExpense'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_expense',
              menu_auth: true,
              menu_path: '/home/finance/expense',
            },
          },
          //预决算
          {
            path: 'budget',
            name: 'AppFinanceBudget',
            component: resolve => require(['../components/modules/finance/AppFinanceBudget'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_budget',
              menu_auth: true,
              menu_path: '/home/finance/budget',
            },
          },
          //收费管理
          {
            path: 'charge',
            name: 'AppFinanceCharge',
            component: resolve => require(['../components/modules/finance/AppFinanceCharge'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_charge',
              menu_auth: true,
              menu_path: '/home/finance/charge',
            },
          },
          {
            path: 'charge/info/:id',
            name: 'AppFinanceChargeInfo',
            component: resolve => require(['../components/modules/finance/components/charge/AppFinanceChargeInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'finance_charge',
              menu_auth: true,
              menu_path: true,
            },
          },
        ]
      },
      {
        path: 'assess',
        name: 'AppAssess',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/assess',
        },
        children: [{
            path: '/home/assess',
            redirect: 'questionnaire'
          },
          {
            path: 'questionnaire',
            name: 'AppAssessQuestionnaire',
            component: resolve => require(['../components/modules/assess/AppAssessQuestionnaire'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/assess/questionnaire',
            },
          },
          {
            path: 'project',
            name: 'AppAssessProject',
            component: resolve => require(['../components/modules/assess/AppAssessProject'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath1: 'assess_project',
              menu_auth: true,
              menu_path: '/home/assess/project',
            },
          },
          {
            path: 'course',
            name: 'AppAssessCourse',
            component: resolve => require(['../components/modules/assess/AppAssessCourse'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: '/home/assess/course',
            },
          },
          {
            path: 'result',
            name: 'AppAssessResult',
            component: resolve => require(['../components/modules/assess/AppAssessResult'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'home_assess_result',
              menu_auth: true,
              menu_path: '/home/assess/result',
            },
          },

          {
            path: 'course/list/:id',
            name: 'AppAssessCourseList',
            component: resolve => require(['../components/modules/assess/components/AppAssessCourseList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'project/send',
            name: 'AppAssessPSend',
            component: resolve => require(['../components/modules/assess/components/AppAssessPCSend'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath1: 'assess_project',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'course/send',
            name: 'AppAssessCSend',
            component: resolve => require(['../components/modules/assess/components/AppAssessPCSend'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'project/result',
            name: 'AppAssessPResult',
            component: resolve => require(['../components/modules/assess/components/AppAssessPCResult'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath1: 'assess_project',
              menu_auth: true,
              menu_path: true,
            }
          },
          {
            path: 'course/result',
            name: 'AppAssessCResult',
            component: resolve => require(['../components/modules/assess/components/AppAssessPCResult'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: true,
            }
          },
          {
            path: 'project/code',
            name: 'AppAssessCodePro',
            component: resolve => require(['../components/modules/assess/components/AppAssessCode'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath1: 'assess_project',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'course/code',
            name: 'AppAssessCodeCou',
            component: resolve => require(['../components/modules/assess/components/AppAssessCode'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'result/set/:id',
            name: 'AppAssessResultSet',
            component: resolve => require(['../components/modules/assess/components/AppAssessResultSet'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'home_assess_result',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'result/history/:id',
            name: 'AppAssessResultHistory',
            component: resolve => require(['../components/modules/assess/components/AppAssessResultHistory'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_assess_result',
              menu_auth: true,
              menu_path: true,
            },
          },
          //    预设问卷管理
          {
            path: 'preset',
            name: 'AppAssessPreset',
            component: resolve => require(['../components/modules/assess/AppAssessPreset'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/assess/preset',
            },
          },

          //    课程评估
          {
            path: 'exam',
            name: 'AppAssessExam',
            component: resolve => require(['../components/modules/assess/AppAssessExam'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/assess/exam',
            },
          },
          {
            path: 'course_exam',
            name: 'AppAssessCourseExam',
            component: resolve => require(['../components/modules/assess/components/AppAssessCourseExam'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'course_exam_result',
            name: 'AppAssessCourseExamResult',
            component: resolve => require(['../components/modules/assess/components/AppAssessCourseExamResult'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath2: 'assess_course',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'report',
            name: 'AppAssessReport',
            component: resolve => require(['../components/modules/assess/AppAssessReport'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/assess/report',
            },
          },
        ]
      },
      {
        path: 'curriculum',
        name: 'AppCurriculum',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/curriculum',
        },
        children: [{
            path: '/home/curriculum',
            redirect: 'course'
          },
          {
            path: 'course',
            name: 'AppCurriculumCourse',
            component: resolve => require(['../components/modules/curriculum/AppCurriculumCourse'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'curriculum_course',
              menu_auth: true,
              menu_path: '/home/curriculum/course',
            },
          },
          {
            path: 'course/list/:id',
            name: 'AppCurriculumCourseLIst',
            component: resolve => require(['../components/modules/curriculum/components/AppCurriculumCourseList'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'curriculum_course',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'teacher',
            name: 'AppCurriculumTeacher',
            component: resolve => require(['../components/modules/curriculum/AppCurriculumTeacher'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'curriculum_teacher',
              menu_auth: true,
              menu_path: '/home/curriculum/teacher',
            },
          },
          {
            path: 'teacher/info/:id',
            name: 'AppCurriculumTeacherInfo',
            component: resolve => require(['../components/modules/curriculum/components/AppCurriculumTeacherInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'curriculum_teacher',
              menu_auth: true,
              menu_path: true,
            },
          },
          // {
          //     path: 'teacher/list/:id',
          //     name: 'AppCurriculumTeacherLIst',
          //     component:resolve => require(['../components/modules/curriculum/components/AppCurriculumTeacherLIst'], resolve),
          //     meta:{ 
          //         auth:true,
          //         role:3, // 
          //     },
          // },
        ]
      },
      {
        path: 'majorunit',
        name: 'AppMajorunit',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/majorunit',
        },
        children: [{
            path: '/home/majorunit',
            redirect: 'index'
          },
          {
            path: 'index',
            name: 'AppMajorunitIndex',
            component: resolve => require(['../components/modules/majorunit/AppMajorunitIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_majorunit',
              menu_auth: true,
              menu_path: '/home/majorunit/index',
            },
          },
          {
            path: 'index/info',
            name: 'AppMajorunitInfo',
            component: resolve => require(['../components/modules/majorunit/components/AppMajorunitInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_majorunit',
              menu_auth: true,
              menu_path: true,
            },
          },
        ]
      },
      {
        path: 'helperunit',
        name: 'AppHelperunit',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/helperunit',
        },
        children: [{
            path: '/home/helperunit',
            redirect: 'index'
          },
          {
            path: 'index',
            name: 'AppHelperunitIndex',
            component: resolve => require(['../components/modules/helperunit/AppHelperunitIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_helperunit',
              menu_auth: true,
              menu_path: '/home/helperunit/index',
            },
          },
          {
            path: 'index/info',
            name: 'AppHelperunitInfo',
            component: resolve => require(['../components/modules/helperunit/components/AppHelperunitInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_helperunit',
              menu_auth: true,
              menu_path: true,
            },
          },
        ]
      },
      {
        path: 'data',
        name: 'AppData',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/data',
        },
        children: [{
            path: '/home/data',
            redirect: 'index'
          },
          {
            path: 'index',
            name: 'AppDataIndex',
            component: resolve => require(['../components/modules/data/AppDataIndex'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/data',
            },
          },
        ]
      },
      {
        path: 'books',
        name: 'AppBooks',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/books',
        },
        children: [{
            path: '/home/books',
            redirect: 'visit'
          },
          {
            path: 'visit',
            name: 'AppBooksVisit',
            component: resolve => require(['../components/modules/books/AppBooksVisit'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/books/visit',
            },
          },
          {
            path: 'card',
            name: 'AppBooksCard',
            component: resolve => require(['../components/modules/books/AppBooksCard'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/books/card',
            },
          },
          {
            path: 'entering',
            name: 'AppBooksEntering',
            component: resolve => require(['../components/modules/books/AppBooksEntering'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/books/entering',
            },
          },
          {
            path: 'query',
            name: 'AppBooksQuery',
            component: resolve => require(['../components/modules/books/AppBooksQuery'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'books_query',
              menu_auth: true,
              menu_path: '/home/books/query',
            },
          },
          {
            path: 'query/info/:id',
            name: 'AppBooksQueryInfo',
            component: resolve => require(['../components/modules/books/components/AppBooksQueryInfo'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'books_query',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'query/print/:id',
            name: 'AppBooksQueryPrint',
            component: resolve => require(['../components/modules/books/components/AppBooksQueryPrint'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              keepPath: 'books_query',
              menu_auth: true,
              menu_path: true,
            },
          },
        ]
      },
      {
        path: 'classroom',
        name: 'AppClassroom',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3, // 
          menu_auth: true,
          menu_path: '/home/classroom',
        },
        children: [{
            path: '/home/classroom',
            redirect: 'record'
          },
          {
            path: 'record',
            name: 'AppClassroomRecord',
            component: resolve => require(['../components/modules/classroom/AppClassroomRecord'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_record',
              menu_auth: true,
              menu_path: '/home/classroom/record',
            },
          },
          {
            path: 'record/:id',
            name: 'AppClassroomRecordPrint',
            component: resolve => require(['../components/modules/classroom/components/record/AppClassroomRecordPrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_record',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'finance',
            name: 'AppClassroomFinance',
            component: resolve => require(['../components/modules/classroom/AppClassroomFinance'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_finance',
              menu_auth: true,
              menu_path: '/home/classroom/finance',
            },
          },
          {
            path: 'finance/add/:id',
            name: 'AppClassroomFinanceAdd',
            component: resolve => require(['../components/modules/classroom/components/finance/AppClassroomFinanceAdd'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_finance',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'finance/edit/:id',
            name: 'AppClassroomFinanceEdit',
            component: resolve => require(['../components/modules/classroom/components/finance/AppClassroomFinanceAdd'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_finance',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'finance/info/:id',
            name: 'AppClassroomFinanceInfo',
            component: resolve => require(['../components/modules/classroom/components/finance/AppClassroomFinanceInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_finance',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'finance/check/:id',
            name: 'AppClassroomFinanceCheck',
            component: resolve => require(['../components/modules/classroom/components/finance/AppClassroomFinanceInfo'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_finance',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'finance/print/:id',
            name: 'AppClassroomFinancePrint',
            component: resolve => require(['../components/modules/classroom/components/finance/AppClassroomFinancePrint'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'classroom_finance',
              menu_auth: true,
              menu_path: true,
            },
          },
          {
            path: 'image',
            name: 'AppClassroomImage',
            component: resolve => require(['../components/modules/classroom/AppClassroomImage'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              menu_auth: true,
              menu_path: '/home/classroom/image',
            },
          },
        ]
      },
      {
        path: 'enrolled',
        name: 'AppEnrolled',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 3,
          menu_auth: true,
          menu_path: '/home/enrolled',
        },
        children: [
          {
            path: '/home/enrolled',
            redirect: 'index'
          },
          {
            path: 'index',
            name: 'AppEnrolledIndex',
            component: resolve => require(['../components/modules/enrolled/AppEnrolledIndex.vue'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_enrolled',
              menu_auth: true,
              menu_path: '/home/enrolled/index',
            },
          },
          {
            path: 'print',
            name: 'AppEnrolledPrint',
            component: resolve => require(['../components/modules/enrolled/AppEnrolledPrint.vue'], resolve),
            meta: {
              auth: true,
              role: 3, // 
              keepPath: 'home_enrolled',
              menu_auth: true,
              menu_path: '/home/enrolled/index',
            },
          }
        ]
      },
      {
        path: 'weixin',
        name: 'AppWeixin',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 1, // 
          menu_auth: true,
          menu_path: '/home/weixin',
        },
        children: [{
            path: '/home/weixin',
            redirect: 'reply'
          },
          {
            path: 'reply',
            name: 'AppWeixinReply',
            component: resolve => require(['../components/modules/weixin/AppWeixinReply'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/weixin/reply',
            },
          },
          {
            path: 'text',
            name: 'AppWeixinText',
            component: resolve => require(['../components/modules/weixin/AppWeixinText'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/weixin/text',
            },
          },
          {
            path: 'image',
            name: 'AppWeixinImage',
            component: resolve => require(['../components/modules/weixin/AppWeixinImage'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/weixin/image',
            },
          },
          {
            path: 'menu',
            name: 'AppWeixinMenu',
            component: resolve => require(['../components/modules/weixin/AppWeixinMenu'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/weixin/menu',
            },
          },
          {
            path: 'module',
            name: 'AppWeixinModule',
            component: resolve => require(['../components/modules/weixin/AppWeixinModule'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/weixin/module',
            },
          }
        ]
      },
      {
        path: 'config',
        name: 'AppConfig',
        component: PublicRouterView,
        meta: {
          auth: true,
          role: 1, // 
          menu_auth: true,
          menu_path: '/home/config',
        },
        children: [{
            path: '/home/config',
            redirect: 'area'
          },
          {
            path: 'area',
            name: 'AppConfigArea',
            component: resolve => require(['../components/modules/config/AppConfigArea'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/config/area',
            },
          },
          {
            path: 'area/:id',
            name: 'AppConfigAreaChild',
            component: resolve => require(['../components/modules/config/AppConfigAreaChild'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/config/area',
            },
          },
          {
            path: 'professional',
            name: 'AppConfigProfessional',
            component: resolve => require(['../components/modules/config/AppConfigProfessional'], resolve),
            meta: {
              auth: true,
              role: 1, // 
              menu_auth: true,
              menu_path: '/home/config/professional',
            },
          },
        ]
      },
      ...fourRoutes,
      {
        path: '*',
        redirect: '/home/index/index'
      }
    ]
  },
  {
    path: '/error401',
    name: 'Page401',
    component: resolve => require(['../view/error/401'], resolve),
    meta: {
      open: true // 不用登录可访问
    }
  },
  {
    path: '/error404',
    name: 'Page404',
    component: resolve => require(['../view/error/404'], resolve),
    meta: {
      open: true
    }
  },
  {
    path: '/errorsServer',
    name: 'errorsServer',
    component: resolve => require(['../view/error/server'], resolve),
    meta: {
      open: true
    }
  },
  {
    path: '/protocol/assist/:id',
    name: 'AppMobileA',
    component: resolve => require(['../view/mobile/AppMobileA'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/protocol/assist/:id'
  },
  {
    path: '/protocol/entrust/:id',
    name: 'AppMobileE',
    component: resolve => require(['../view/mobile/AppMobileE'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/protocol/entrust/:id'
  },
  {
    path: '/protocol/entrust/letter/:id',
    name: 'AppMobileEL',
    component: resolve => require(['../view/mobile/AppMobileEL'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/protocol/entrust/letter/:id'
  },
  {
    path: '/protocol/college/:id',
    name: 'AppMobileC',
    component: resolve => require(['../view/mobile/AppMobileC'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/protocol/college/:id'
  },
  {
    path: '/protocol/other/letter/:id',
    name: 'AppMobileO',
    component: resolve => require(['../view/mobile/AppMobileO'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/protocol/other/letter/:id'
  },
  {
    path: '/project/notice/:id',
    name: 'AppMobileProject',
    component: resolve => require(['../view/mobile/AppMobileProject'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/project/notice/:id'
  },
  {
    path: '/students/list/:id',
    name: 'AppMobileStudents',
    component: resolve => require(['../view/mobile/AppMobileStudents'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/students/list/:id'
  },
  {
    path: '/certificate/bill/:id',
    name: 'AppMobileCertificateBill',
    component: resolve => require(['../view/mobile/AppMobileCertificateBill'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/certificate/bill/:id'
  },
  {
    path: '/finance/account/:id',
    name: 'AppMobileFinanceAccount',
    component: resolve => require(['../view/mobile/AppMobileFinanceAccount'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/finance/account/:id'
  },
  {
    path: '/charge',
    name: 'AppCharge',
    component: resolve => require(['../view/Charge/AppCharge'], resolve),
    meta: {
      open: true
    }
  },
  {
    path: '/report/index/:id',
    name: 'AppMobileAssessCourseExamResult',
    component: resolve => require(['../view/mobile/AppMobileAssessCourseExamResult'], resolve),
    meta: {
      open: true
    },
    alias: '/yxb/report/index/:id'
  },
  // {
  //   path: '/propaganda/promote/:id',
  //   name: 'AppMobilePropagandaPromote',
  //   component: resolve => require(['../view/mobile/AppMobilePropagandaPromote'], resolve),
  //   meta: {
  //     open: true
  //   },
  //   alias: '/yxb/propaganda/promote/:id'
  // },
  {
    // path: '/login/sign',
    path: '/px/xy',
    name: 'AppSignView',
    component: resolve => require(['../view/sign/AppSignView.vue'], resolve),
    meta: {
      open: true
    }
  },
  {
    path: '/kcb/xy',
    name: 'AppSignView',
    component: resolve => require(['../view/sign/AppSignView.vue'], resolve),
    meta: {
      open: true
    }
  },
  {
    path: '/isce/project/declare/:id',
    name: 'AppSignView',
    component: resolve => require(['../view/isce/IsceProjectDeclare.vue'], resolve),
    meta: {
      open: true
    }
  },
  {
    path: '*',
    redirect: '/login/teacher'
  },
]

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  const userInfoStr = VueCookie.get('userInfo')
  const isLogin = VueCookie.get('headers') && userInfoStr
  let userInfo = {}
  if (userInfoStr) {
    userInfo = JSON.parse(userInfoStr)
  }
  if (isLogin) {
    let yxbAuthSide = []
    let IsYxb = false
    if (userInfo.role === 1) {
      IsYxb = sessionStorage.getItem('CK') === '2'
      if (userInfo.is_yjsy) {
        if (IsYxb && sessionStorage.getItem('CK-activeMenu')) {
          if (to.meta.auth || to.meta.four_wrap || to.meta.menu_auth) {
            if (!to.meta.is_yjsy) {
              next({
                path: '/error404'
              })
            }
          }
        } else {
          VueCookie.delete('userInfo')
          VueCookie.delete('headers')
          next({
            path: '/login/admin'
          })
        }
      }
      if (to.meta.four_wrap && !IsYxb) {
        next({
          path: '/error404'
        })
      }
    } else if (userInfo.role === 2) {
      IsYxb = sessionStorage.getItem('CK-T') === '2'
      if (IsYxb) {
        const yxbAuthSideStr = sessionStorage.getItem('yxb_auth_side')
        if (yxbAuthSideStr) {
          yxbAuthSide = JSON.parse(yxbAuthSideStr)
        }
      }
      if (to.meta.four_wrap) {
        if (IsYxb) {
          if (!methods.vifAOrBPublic(to.path.substring(0, to.path.lastIndexOf('/')), yxbAuthSide)) {
            next({
              path: '/error401'
            })
          }
        } else {
          next({
            path: '/error404'
          })
        }
      }
    }
    if (to.meta.auth) {
      if (to.meta.menu_auth) {
        if (to.meta.center_auth) {
          if (to.meta.center_auth === userInfo.role) {
            next()
          } else {
            next({
              path: '/error401'
            })
          }
        } else {
          if (to.meta.menu_path === true || userInfo.role === 1 || userInfo.role === 2 && methods.vifAOrBPublic(to.meta.menu_path, IsYxb ? yxbAuthSide : userInfo.auth_side)) {
            next()
          } else {
            next({
              path: '/error401'
            })
          }
        }
      } else {
        next()
      }
    } else {
      if (to.meta.is_Login) {
        if (userInfo.role === 1) {
          next({
            path: '/center'
          })
        } else if (userInfo.role === 2) {
          next({
            path: '/center_teacher'
          })
        }
      } else {
        next()
      }
    }
    if (true) {
      let toA = to.path.indexOf('/home/project')
      let formA = from.path.indexOf('/home/project')
      if (formA !== -1 && toA === -1) {
        sessionStorage.removeItem('PRO_IS_SS')
      }
      let toB = to.path.indexOf('/home/students/message')
      let formB = from.path.indexOf('/home/students/message')
      if (formB !== -1 && toB === -1) {
        sessionStorage.removeItem('STU_IS_APPLY')
      }
    }
  } else {
    if (to.meta.is_Login || to.meta.open) {
      next()
    } else {
      next({
        path: '/login/teacher'
      })
    }
  }
})

export default router
