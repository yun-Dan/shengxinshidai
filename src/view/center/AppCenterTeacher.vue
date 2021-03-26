<template>
  <div class="app-center-teacher">
    <div class="app-center-teacher-blur bg-blur"></div>
    <div class="app-center-teacher-main-wrap">
      <div class="app-center-teacher-main">
        <div class="app-center-teacher-main-logo">中国人民大学继续教育处综合办公平台</div>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="9" style="margin-bottom: 10px">
            <div class="center-main-user">
              <div class="center-main-user-top"></div>
              <div class="center-main-user-edge"></div>
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
                <div style="font-size: 16px; line-height: 30px">
                  {{ userInfo.realname }}
                </div>
                <div class="info" style="font-size: 12px">{{ userInfo.college }}</div>
                <el-divider></el-divider>
                <el-row>
                  <el-col :span="12">
                    <div class="center-main-user-icon-btn" @click="visible = true">
                      <div class="center-main-user-icon">
                        <i class="fa fa-edit" style="font-size: 18px; line-height: 30px"></i>
                      </div>
                      个人信息
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="center-main-user-icon-btn" @click="outLogin">
                      <div class="center-main-user-icon">
                        <i class="fa fa-sign-out" style="font-size: 18px; line-height: 30px"></i>
                      </div>
                      退出登录
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="15" style="margin-bottom: 10px">
            <div class="center-main-cards">
              <div class="center-main-cards-bottom">
                <el-row :gutter="10">
                  <template v-for="(item, index) in ckTitle">
                    <template v-if="item.center_teacher">
                      <el-col
                        :span="8"
                        :key="index"
                        class="center-main-cards-item"
                        style="margin-bottom: 10px"
                        @click.native="handleClick(item)">
                        <div :style="{
                          backgroundColor:
                          item.center_bg,
                          height: '140px',
                          textAlign: 'center',
                          color: '#fff',
                          paddingTop: '20px'
                        }" :class="{'center-main-cards-item-no': !vifAOrBPublic(`${item.center_teacher}`, userInfo.permissions)}">
                          <div
                            style="height: 70px; line-height: 70px; font-size: 54px; margin-bottom: 10px"
                          >
                            <i class="fa" :class="item.icon"></i>
                          </div>
                          <div
                            style="height: 20px; line-height: 20px; font-size: 17px; font-family: '微软雅黑'"
                          >{{ item.label }}</div>
                        </div>
                      </el-col>
                    </template>
                  </template>
                </el-row>
                <div class="center-main-cards-bottom-date">
                  <div style="font-size: 24px; padding: 26px 0 0; height: 40px">
                    <template v-if="timeObj.yyyy">
                      <span style="padding-right: 30px">
                        {{ timeObj.yyyy }} 年
                        {{ timeObj.mm }} 月
                        {{ timeObj.dd }} 日
                      </span>
                      <i class="el-icon-time" style="font-size: 28px; padding-right: 14px"></i>
                      <span class="cards-bottom-date-red">{{ timeObj.h }}</span> :
                      <span class="cards-bottom-date-red">{{ timeObj.m }}</span> :
                      <span class="cards-bottom-date-red">{{ timeObj.s }}</span>
                    </template>
                  </div>
                  <div style="margin: 0 auto; height: 78px">
                    <div style="width: 400px; margin: 0 auto">
                      <br>
                      <iframe scrolling="no"
                      src="https://tianqiapi.com/api.php?style=tz&skin=pitaya&color=ffffff&fontsize=12&align=center"
                      frameborder="0" height="25" allowtransparency="true"></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <AppUserEdit :visible="visible" @change="handleChange"/>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import  ckTitle from '@/assets/js/ckTitle.js'
import { clearLoginOut } from '@/assets/js/logout.callback.js'
import { clearHome } from '@/assets/js/clear.home.js'
import  { menuList } from '@/assets/js/menuList.js'
import AppUserEdit from '@/components/compose/AppUserEdit.vue'

const urls = {
  yxb: '/yxb/base/setinfos' // 研修班用户登录信息
}

export default {
  name: 'app-center-teacher',
  data () {
    return {
      timeObj: {
        yyyy: '',
        mm: '',
        dd: '',
        h: '',
        m: '',
        s: ''
      },
      ckTitle,
      menuList,
      visible: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    AppUserEdit
  },
  methods: {
    ...mapMutations(['editGetForms']),
    ...mapActions(['getProjectConfig', 'logout', 'axiosHttp']),
    initConfig () {
      if (!localStorage.getItem('pro_config')) {
        this.getProjectConfig().then(data => {
          const Data = JSON.parse(JSON.stringify(data.data.data))
          delete Data.pxlx['10'] // 培训类型：移除“课程班”选项
          localStorage.setItem('pro_config', JSON.stringify(Data))
        })
      }
    },
    handleClick (val) {
      if (val.activeName && this.vifAOrBPublic(`${val.center_teacher}`, this.userInfo.permissions)) {
        let routeData = this.$router.resolve({
          name: val.activeName
        })
        if (val.center_teacher === '1') {
          sessionStorage.setItem('CK-T', val.center_teacher)
          sessionStorage.setItem('CK-T-activeMenu', val.activeMenu)
          window.open(routeData.href, '_blank')
        } else if (val.center_teacher === '2') {
          this.getYxb(val, routeData)
        } else if (val.center_teacher === '3') {
          console.log('去往“成教管理”')
        }
      }
    },
    outLogin () {
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
    initTime () {
      setInterval(() => {
        let time = this.DateTime = new Date()
        let hour = this.checkTime(time.getHours()) //获取时
        let minite = this.checkTime(time.getMinutes()) //获取分
        let second = this.checkTime(time.getSeconds()) //获取秒

        this.$set(this.timeObj, 'h', hour)
        this.$set(this.timeObj, 'm', minite)
        this.$set(this.timeObj, 's', second)
        this.$set(this.timeObj, 'yyyy', time.getFullYear())
        this.$set(this.timeObj, 'mm', time.getMonth() + 1)
        this.$set(this.timeObj, 'dd', time.getDate())
      }, 1000)
    },
    checkTime (i) {
      /****当时、分、秒、小于10时，则添加0****/
      if (i < 10) return '0' + i
      return i
    },
    getYxb (val, routeData) {
      this.axiosHttp({
        url: urls.yxb
      }).then(data => {
        if (data.data.code === 200) {
          sessionStorage.setItem('yxb_auth_side', JSON.stringify(data.data.data.auth_side || []))
          sessionStorage.setItem('CK-T', val.center_teacher)
          sessionStorage.setItem('CK-T-activeMenu', val.activeMenu)
          window.open(routeData.href, '_blank')
        }
      })
    },
    handleChange () {
      this.visible = !this.visible
    }
  },
  created () {
    this.initConfig()
  },
  mounted () {
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
.app-center-teacher {
  position: relative;
  height: 100%;
  text-align: center;
}
.app-center-teacher-blur {
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
.app-center-teacher-main-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.app-center-teacher-main {
  max-width: 900px;
  margin: 100px auto 0;
  padding: 40px 20px;
}
.app-center-teacher-main-logo {
  font-size: 30px;
  color: #fff;
  font-weight: 500;
  line-height: 2em;
  margin-bottom: 70px;
  letter-spacing: 4px;
}
.center-main-user {
  position: relative;
  height: 330px;
  background-color: #fff;
}
.center-main-user-top {
  position: relative;
  height: 130px;
  background: url("../../assets/images/center1.jpg") no-repeat center;
  background-size: cover;
  overflow: hidden;
}
.center-main-user-top::after{
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(187, 12, 15, 0.5)
}
.center-main-user-edge{
  width: 100%;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 110px;
  left: 0;
}
.center-main-user-img {
  position: absolute;
  top: 120px;
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
  padding-top: 25px;
  text-align: center;
}
.center-main-user-icon-btn{
  cursor: pointer;
}
.center-main-user-icon{
  width: 30px;
  margin: 0 auto;
  border: 4px solid #fcf3f4;
  color: #656565;
  border-radius: 50%;
  background-color: #fbe7e9;
  margin-bottom: 4px;
}
.center-main-cards-item {
  cursor: pointer;
}
.center-main-cards-bottom-date {
  height: 160px;
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
.center-main-cards-item-no{
  position: relative;
  cursor: no-drop;
}
.center-main-cards-item-no::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
