<template>
  <div class="app-center">
    <div class="app-center-blur bg-blur"></div>
    <div class="app-center-main-wrap">
      <div class="app-center-main">
        <div class="app-center-main-logo">中国人民大学继续教育处综合办公平台</div>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" style="margin-bottom: 10px">
            <div class="center-main-user">
              <div class="center-main-user-top"></div>
              <div class="center-main-user-img">
                <img
                  v-if="userInfo.image"
                  :src="userInfo.image"
                  alt
                  style="width: 100%; height: 100%"
                >
                <img
                  v-else
                  src="../../assets/images/user.jpg"
                  alt
                  style="width: 100%; height: 100%"
                >
              </div>
              <div class="center-main-user-bottom">
                <div style="font-size: 16px; line-height: 28px">{{ userInfo.realname }}</div>
                <div
                  class="info"
                  style="width: 280px; margin: 0 auto; height: 50px; padding-top: 10px; text-align: center"
                >
                  <el-row :gutter="0">
                    <el-col v-if="userInfo.chuID_1 || userInfo.chuID_2" :span="8">
                      <el-badge
                        :hidden="documentNews.document-(-documentNews.meeting)-(-documentNews.reporting) == 0"
                        :value="documentNews.document-(-documentNews.meeting)-(-documentNews.reporting)"
                        @click.native="handleClickTip(1)"
                        class="app-center-tip-box"
                      >
                        <i class="el-icon-set-up" style="font-size: 32px; line-height: 40px"></i>
                        <div>待办公文</div>
                      </el-badge>
                    </el-col>
                    <el-col :span="userInfo.chuID_1 || userInfo.chuID_2 ? 8 : 12">
                      <el-badge
                        :hidden="documentNews.internal-(-documentNews.work) == 0"
                        :value="documentNews.internal-(-documentNews.work)"
                        @click.native="handleClickTip(2)"
                        class="app-center-tip-box"
                      >
                        <i
                          class="el-icon-chat-dot-round"
                          style="font-size: 32px; line-height: 40px"
                        ></i>
                        <div>未读消息</div>
                      </el-badge>
                    </el-col>
                    <el-col :span="userInfo.chuID_1 || userInfo.chuID_2 ? 8 : 12">
                      <el-badge @click.native="outLogin" class="app-center-tip-box">
                        <i class="fa fa-sign-out" style="font-size: 32px; line-height: 40px"></i>
                        <div>退出登录</div>
                      </el-badge>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10" style="margin-bottom: 10px">
            <div class="center-main-cards">
              <div class="center-main-cards-top">
                <el-row :gutter="10">
                  <template v-for="(item, index) in ckTitle">
                    <template v-if="item.line === 1">
                      <el-col
                        :span="8"
                        :key="index"
                        class="center-main-cards-item"
                        @click.native="handleClick(item)"
                      >
                        <div
                          :style="{ backgroundColor: item.center_bg, height: '120px', textAlign: 'center', color: '#fff', paddingTop: '20px'}"
                        >
                          <div
                            style="height: 60px; line-height: 60px; font-size: 54px; margin-bottom: 10px"
                          >
                            <i class="fa" :class="item.icon"></i>
                          </div>
                          <div
                            style="height: 20px; line-height: 20px; font-size: 16px; font-family: '微软雅黑'"
                          >{{ item.label }}</div>
                        </div>
                      </el-col>
                    </template>
                  </template>
                </el-row>
              </div>
              <div class="center-main-cards-top">
                <el-row :gutter="10">
                  <template v-for="(item, index) in ckTitle">
                    <template v-if="item.line === 2">
                      <el-col
                        :span="8"
                        :key="index"
                        class="center-main-cards-item"
                        @click.native="handleClick(item)"
                      >
                        <div
                          :style="{ backgroundColor: item.center_bg, height: '120px', textAlign: 'center', color: '#fff', paddingTop: '20px'}"
                        >
                          <div
                            style="height: 60px; line-height: 60px; font-size: 54px; margin-bottom: 10px"
                          >
                            <i class="fa" :class="item.icon"></i>
                          </div>
                          <div
                            style="height: 20px; line-height: 20px; font-size: 16px; font-family: '微软雅黑'"
                          >{{ item.label }}</div>
                        </div>
                      </el-col>
                    </template>
                  </template>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="center-main-cards">
              <div class="center-main-cards-bottom">
                <div class="center-main-cards-bottom-date">
                  <div style="font-size: 24px; padding: 26px 0 0">
                    <span style="padding-right: 10px">时间</span>
                    <span class="cards-bottom-date-red">{{ timeObj.h }}</span> :
                    <span class="cards-bottom-date-red">{{ timeObj.m }}</span> :
                    <span class="cards-bottom-date-red">{{ timeObj.s }}</span>
                  </div>
                  <div class="clearfix" style="width: 280px; margin: 0 auto; height: 78px">
                    <div style="width: 260px; margin: 0 auto">
                      <br>
                      <iframe scrolling="no"
                      src="https://tianqiapi.com/api.php?style=tz&skin=pitaya&color=ffffff&fontsize=12&align=center"
                      frameborder="0" width="260" height="25" allowtransparency="true"></iframe>
                    </div>
                  </div>
                </div>
                <el-row :gutter="10">
                  <template v-for="(item, index) in ckTitle">
                    <template v-if="item.line === 3">
                      <el-col
                        :xs="0"
                        :sm="12"
                        :md="12"
                        :lg="12"
                        :xl="12"
                        :key="index"
                        class="center-main-cards-item"
                        @click.native="handleClick(item)"
                      >
                        <div
                          :style="{ backgroundColor: item.center_bg, height: '120px', textAlign: 'center', color: '#fff', paddingTop: '20px'}"
                        >
                          <div
                            style="height: 60px; line-height: 60px; font-size: 54px; margin-bottom: 10px"
                          >
                            <i class="fa" :class="item.icon"></i>
                          </div>
                          <div
                            style="height: 20px; line-height: 20px; font-size: 16px; font-family: '微软雅黑'"
                          >{{ item.label }}</div>
                        </div>
                      </el-col>
                    </template>
                  </template>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="app-center-main-schedule" v-if="pro_config.user_nam">
          <el-tabs type="border-card">
            <el-tab-pane label="日程管理">
              <AppCenterSchedule/>
            </el-tab-pane>
            <el-tab-pane label="会议室管理">
              <AppCenterSchedule2/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import  ckTitle from '@/assets/js/ckTitle.js'
import { clearLoginOut } from '@/assets/js/logout.callback.js'
import { clearHome } from '@/assets/js/clear.home.js'
import AppCenterSchedule from './AppCenterSchedule.vue'
import AppCenterSchedule2 from './AppCenterSchedule2.vue'

export default {
  name: 'app-center',
  data() {
    return {
      time: '',
      timeObj: {
        h: '',
        m: '',
        s: ''
      },
      pro_config: {},
      ckTitle,
    }
  },
  computed: {
    ...mapState(['gwUrl', 'documentNews', 'userInfo'])
  },
  components: {
    AppCenterSchedule,
    AppCenterSchedule2
  },
  methods: {
    ...mapMutations(['editGetForms']),
    ...mapActions(['getProjectConfig', 'logout', 'getDocumentNewsNum', 'axiosHttp']),
    initConfig() {
      if (localStorage.getItem('pro_config')) {
        this.pro_config = JSON.parse(localStorage.getItem('pro_config'))
      } else {
        this.getProjectConfig().then(data => {
          const Data = JSON.parse(JSON.stringify(data.data.data))
          delete Data.pxlx['10']
          localStorage.setItem('pro_config', JSON.stringify(Data))
          this.pro_config = Data
        })
      }
    },
    handleClick(val) {
      if (val.activeName) {
        let routeData = this.$router.resolve({
          name: val.activeName
        })
        sessionStorage.setItem('CK', val.key)
        sessionStorage.setItem('CK-activeMenu', val.activeMenu)
        window.open(routeData.href, '_blank')
      } else {
        const headers = this.$cookie.get('headers')
        if (headers) {
          let obj = JSON.parse(this.$cookie.get('headers'))
          window.open(
            `${this.gwUrl}?sessionId=${obj.sessionid}&authCode=${obj.authkey}`,
            '_blank'
          )
        }
      }
    },
    handleClickTip(type) {
      let tip = [this.ckTitle['4'], this.ckTitle['5']]
      let val = tip[type - 1]
      if (val) {
        let routeData = this.$router.resolve({
          name: val.activeName
        })
        sessionStorage.setItem('CK', val.key)
        sessionStorage.setItem('CK-activeMenu', val.activeMenu)
        window.open(routeData.href, '_blank')
      }
    },
    outLogin() {
      this.logout({
        data: {
          authkey: JSON.parse(this.$cookie.get('headers')).authkey
        }
      }).then(data => {
        if (data.data.code === 200) {
          const ROLE = this.userInfo.role
          clearLoginOut({
            $cookie: this.$cookie
          })
          if (ROLE === 1) {
            this.$router.push('/login/admin')
          } else {
            this.$router.push('/login/teacher')
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.data.error
          })
        }
      })
    },
    initTime() {
      setInterval(() => {
        let time = new Date()
        let hour = this.checkTime(time.getHours())
        let minite = this.checkTime(time.getMinutes())
        let second = this.checkTime(time.getSeconds())

        this.time = `${hour}:${minite}:${second}`
        this.$set(this.timeObj, 'h', hour)
        this.$set(this.timeObj, 'm', minite)
        this.$set(this.timeObj, 's', second)
      }, 1000)
    },
    checkTime(i) {
      /****当时、分、秒、小于10时，则添加0****/
      if (i < 10) return '0' + i
      return i
    }
  },
  created() {
    this.initConfig()
    this.getDocumentNewsNum({
      data: {
        uid: this.userInfo.uid
      }
    })
  },
  mounted() {
    clearHome({
      $cookie: this.$cookie
    })
    this.initTime()
    this.editGetForms({
      name: '',
      form: null
    })
  }
}
</script>

<style scoped>
.app-center {
  position: relative;
  height: 100%;
  text-align: center;
}
.app-center-blur {
  height: 100%;
  background: url("../../assets/images/center2.jpg") no-repeat center;
  background-size: cover;
  overflow-x: hidden;
  overflow-y: auto;
}
.bg-blur {
  float: left;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  -webkit-filter: blur(6px);
  -moz-filter: blur(6px);
  -o-filter: blur(6px);
  -ms-filter: blur(6px);
  filter: blur(6px);
}
.app-center-main-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.app-center-main {
  max-width: 1200px;
  margin: 100px auto 0;
  padding: 0 30px;
}
.app-center-main-logo {
  font-size: 30px;
  color: #fff;
  font-weight: 500;
  line-height: 2em;
  margin-bottom: 40px;
  letter-spacing: 4px;
}
.center-main-user {
  position: relative;
  height: 290px;
  background-color: #fff;
}
.center-main-user-top {
  height: 140px;
  background: url("../../assets/images/center1.jpg") no-repeat center;
  background-size: cover;
  overflow: hidden;
}
.center-main-user-img {
  position: absolute;
  top: 140px;
  left: 50%;
  margin-top: -60px;
  margin-left: -44px;
  width: 80px;
  height: 80px;
  border: 4px solid #fff;
  border-radius: 44px;
  overflow: hidden;
}
.center-main-user-bottom {
  padding: 30px;
  text-align: center;
}
.center-main-cards-item {
  cursor: pointer;
}
.center-main-cards-top {
  margin-bottom: 10px;
}
.center-main-cards-bottom-date {
  height: 140px;
  margin-bottom: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-weight: 500;
  text-align: center;
}
.cards-bottom-date-red {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: rgba(187, 12, 45, 0.6);
}
.app-center-main-schedule {
  padding-bottom: 40px;
}
.app-center-tip-box {
  cursor: pointer;
}
</style>
