<template>
  <div class="backlog-card-box" v-cloak ref="backlogBox">
    <el-card shadow="hover" :body-style="{padding: '20px 10px 20px 20px'}">
      <div slot="header">
        <template v-if="userInfo.role===1">
          <i class="el-icon-bell warning"></i>&nbsp;
          <span>待办事项</span>
        </template>
        <template v-if="userInfo.role===2">
          <i class="fa fa-bell-o" aria-hidden="true"></i>&nbsp;
          <el-badge :value="unreadNum" :max="99">
            <span>未读消息</span>
          </el-badge>
        </template>
      </div>
      <!-- heightrole1比role2大240 -->
      <el-table :key="1" :data="todoList" size="mini"
        :height="userInfo.role===1 ? (`${625 + dis}px`) : (`${391 + dis}px`)"
        :show-header="userInfo.role == 1 ? false : false">
        <el-table-column :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-badge
              v-if="userInfo.role===1"
              :value="scope.row.num?scope.row.num:null"
              :min="1"
              :max="99"
              class="item"
            >
              <el-button type="text" size="small" @click.native="handleNo(scope.row)">
                {{ scope.row.title }}
                <span style="padding-right: 12px"></span>
              </el-button>
            </el-badge>
            <template v-if="userInfo.role===2">
              <el-tag v-if="scope.row.articletype===0" type="success" size="mini" effect="plain">文章</el-tag>
              <el-tag v-if="scope.row.articletype===1" type="primary" size="mini" effect="plain">外链</el-tag>
              <el-tag
                v-if="scope.row.articletype && scope.row.articletype!==1"
                type="danger"
                size="mini"
                effect="plain"
              >公文</el-tag>
              <el-button
                type="text"
                size="small"
                @click.native="handleUnread(scope.row)"
              >&nbsp;{{ scope.row.title }}</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column v-if="userInfo.role===2" align="right" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pid===1" type="danger" size="mini">内部通知</el-tag>
            <el-tag v-if="scope.row.pid===2" type="success" size="mini">工作刊物</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'backlog-card',
  data() {
    return {
      headers: {},
      todoList: [],
      unreadNum: 0,
      selfH: 0,
      dis: 0,
      isYXB: false
    }
  },
  props: {
    propRh: {
      type: Number,
      default: 400
    }
  },
  computed: {
    ...mapState(['unreadData', 'URL', 'userInfo'])
  },
  methods: {
    ...mapMutations(['editCrumbs']),
    ...mapActions(['getUnread', 'getIndexWait', 'getArticleId']),
    initData() {
      if (this.userInfo.role === 1) {
        this.getIndexWait().then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data.list
            this.$nextTick(() => {
              this.todoList = [
                {
                  title: '项目待审核',
                  num: Data.pro_status_count,
                  url: '/home/project/index/list',
                  crumbs: ['项目管理']
                },
                {
                  title: '深圳苏州项目待审核',
                  num: Data.pro_count_status_ss,
                  url: '/home/project/index/list',
                  crumbs: ['项目管理', '深圳苏州项目'],
                  is_ss: true  
                },
                {
                  title: '委托协议待审核',
                  num: Data.prowt_count_status + Data.prowt_count_status_modapp,
                  url: '/home/protocol/entrust/list',
                  crumbs: ['协议管理', '校外委托学院办班']
                },
                {
                  title: '辅助协议待审核',
                  num: Data.profz_count_status + Data.profz_count_status_modapp,
                  url: '/home/protocol/assist/list',
                  crumbs: ['协议管理', '辅助工作对外委托']
                },
                {
                  title: '校内合作协议待审核',
                  num: Data.prohz_count_status + Data.prohz_count_status_modapp,
                  url: '/home/protocol/college/list',
                  crumbs: ['协议管理', '校内合作单位协议']
                },
                {
                  title: '其他协议待审核',
                  num: Data.proqt_count_status,
                  url: '/home/protocol/other',
                  crumbs: ['协议管理', '其他协议'],
                  is_index_other: true
                },
                {
                  title: '入校申请待确认',
                  num: Data.pers_count,
                  url: '/home/enrolled/index',
                  crumbs: ['学员管理', '学员管理'],
                  is_apply: true
                },
                {
                  title: '证书申请待审核',
                  num: Data.procert_count_status + Data.procert_count_status_modapp,
                  url: '/home/certificate/index',
                  crumbs: ['证书管理', '证书申领']
                },
                {
                  title: '证书结算待审核',
                  num: Data.procert_count_status_balance,
                  url: '/home/certificate/bill',
                  crumbs: ['证书管理', '证书结算']
                },
                {
                  title: '财务结算待审核',
                  num: Data.balance_count_status,
                  url: '/home/finance/account/list',
                  crumbs: ['财务管理', '结算管理']
                },
                {
                  title: '宣传推广待审核',
                  num: Data.promote_count,
                  url: '/home/propaganda/promote',
                  crumbs: ['财务管理', '结算管理']
                },
                {
                  title: '教室使用登记待审核',
                  num: Data.projszj_count,
                  url: '/home/classroom/finance',
                  crumbs: ['项目管理', '学院教室使用登记'],
                  is_pxlx: true,  
                  yxb_hidden: true 
                },
                {
                  title: '社会培训类项目官方未发布',
                  num: Data.unpublish_count,
                  url: '/home/project/index/list',
                  crumbs: ['项目管理', '社会培训类项目官方未发布'],
                  is_pxlx: true  
                }
              ].filter(item => {
                return !this.isYXB || this.isYXB && !item.yxb_hidden
              })
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      } else if (this.userInfo.role === 2) {
        this.getUnread({
          data: {
            uid: this.userInfo.uid
          }
        }).then(() => {
          if (this.unreadData) {
            this.$nextTick(() => {
              this.todoList = this.unreadData.list.filter(item => {
                return this.isYXB ? item.sys_type == 2 : (item.sys_type == 1 || !item.sys_type)
              })
              this.unreadNum = this.todoList.length
            })
          }
        })
      }
    },
    handleNo(val) {
      if (val.is_ss) {
        sessionStorage.setItem('PRO_IS_SS', '1')
      }
      if (val.is_pxlx) {
        sessionStorage.setItem('PRO_IS_PXLX', '1')
      }
      if (val.is_index_other) {
        sessionStorage.setItem('PRO_IS_OTHER', '1')
      }
      if (val.is_apply) {
        sessionStorage.setItem('STU_IS_APPLY', '1')
      }
      this.$cookie.set('crumbs', val.crumbs)
      this.editCrumbs(val.crumbs)
      this.$router.push({
        path: `${val.url}${this.isYXB ? '/wrap' : ''}`,
        query: {
          wcoutindex: true
        }
      })
    },
    handleUnread(val) {
      if (val.articletype === 0) {
        this.$router.push('/home/news/article/' + val.id)
      } else {
        this.getArticleId({
          id: val.id,
          data: {
            uid: this.userInfo.uid
          }
        }).then(data => {
          if (data.data.code === 200) {
            if (val.articletype === 1) {
              window.open(val.link)
            } else {
              let link = `${this.URL}${val.link}&authkey=${
                this.headers.authkey
              }&sessionid=${this.headers.sessionid}`
              window.open(link)
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      }
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
    this.headers = JSON.parse(this.$cookie.get('headers'))
    this.initData()
  },
  watch: {
    propRh: {
      handler () {
        this.$nextTick(() => {
          if (this.$refs.backlogBox) {
            this.selfH = this.selfH || this.$refs.backlogBox.clientHeight
            if (this.userInfo.role === 2) {
              this.dis =  Math.ceil(Math.ceil(this.propRh) - Math.ceil(this.selfH + 140))
            } else if (this.userInfo.role === 1) {
              this.dis =  Math.ceil(Math.ceil(this.propRh) - Math.ceil(this.selfH - 92))
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.backlog-card-box{
  padding-bottom: 2px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
