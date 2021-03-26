<template>
  <div class="login-admin-box" @keyup.enter="handleLogin">
    <div class="login-admin-body">
      <div class="px-login">
        <el-card
          :body-style="{padding: '20px 50px'}"
          style="background-color: rgba(255, 255, 255, 0.8)">
          <div class="four-align-center">
            <img src="../../assets/images/title_login2.png" style="height: 90px">
            <div class="login-admin-title">继续教育处综合办公平台</div>
          </div>
          <el-form>
            <el-form-item style="margin-bottom: 10px">
              <div class="set-align-center">
                <span class="login-u-type"
                  :class="{'login-u-type-active': form.usertype === 1}"
                  @click="handleClik(1)">管理员登录</span>
                 <el-divider direction="vertical"></el-divider>
                <span class="login-u-type"
                  :class="{'login-u-type-active': form.usertype === 2}"
                  @click="handleClik(2)">学院用户登录</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="form.username" placeholder="请输入用户名">
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="form.password" type="password" placeholder="请输入密码">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-input v-model.trim="form.verifyCode" placeholder="验证码">
                    <i slot="prefix" class="el-input__icon el-icon-view"></i>
                  </el-input>
                </el-col>
                <el-col :offset="1" :span="11">
                  <div style="height: 40px" @click="refreshCode">
                    <VIdentify :identifyCode="identifyCode"></VIdentify>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-loading="loading">
              <el-button type="danger"
                style="background-color: #aa3130; width: 100%"
                @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <video autoplay muted loop style="min-width: 100%; min-height: 100%">
      <source :src="mp4" type="video/mp4">您的浏览器不支持 video 标签。
    </video>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { loginCallback } from '@/assets/js/login.callback.js'
import VIdentify from '@/components/common/VIdentify'

export default {
  name: 'app-login',
  data () {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        verifyCode: '',
        usertype: 1 // 1管理员  2学院用户
      },
      identifyCodes: '1234567890', // 
      identifyCode: '', // 
      imgUrl: ''
    }
  },
  computed: {
    ...mapState(['mp4'])
  },
  components: {
    VIdentify
  },
  methods: {
    ...mapMutations(['editUserInfo']),
    ...mapActions(['userLogin']),
    handleClik (type) {
      this.$set(this.form, 'usertype', type)
    },
    handleLogin () {
      if (this.checkField('username', '用户名')) {
        return false
      }
      if (this.checkField('password', '密码')) {
        return false
      }
      if (this.checkField('verifyCode', '验证码')) {
        return false
      }
      if (this.identifyCode !== this.form.verifyCode) {
        this.$message({
          showClose: true,
          message: '验证码输入错误！',
          type: 'warning',
          duration: 2000,
          onClose: () => {
            this.refreshCode()
            // this.form.verifyCode = ''
            this.$set(this.form, 'verifyCode', '')
          }
        })
        return false
      }
      this.loading = true
      if (this.loading) {
        this.userLogin({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('登录成功！')
            loginCallback({
              that: this,
              Data: data.data.data,
              $router: this.$router,
              usertype: this.form.usertype,
              fn: (params) => {
                this.editUserInfo(params)
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: data.data.error,
              duration: 2000,
              onClose: () => {
                // Object.assign(this.form, this.$options.data().form)
                this.refreshCode()
                this.$set(this.form, 'verifyCode', '')
                this.loading = false
              }
            })
          }
        })
      }
    },
    checkField (field, label) {
      if (!this.form[field]) {
        this.$message({
          message: `${label}不能为空！`,
          type: 'warning',
          duration: 2000,
          onClose: () => {
            this.refreshCode()
          }
        })
        return true
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    getRandomNum (Min, Max) {
      let Range = Max - Min
      let Rand = Math.random()
      return Min + Math.round(Rand * Range)
    }
  },
  created () {
    this.refreshCode()
  }
}
</script>

<style scoped>
.login-admin-box {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../../assets/images/login_bg.jpg") no-repeat center;
  background-size: cover;
  overflow: hidden;
}
.login-admin-body {
  position: absolute;
  top: 45%;
  left: 50%;
  margin-left: -250px;
  margin-top: -250px;
  width: 500px;
  height: 500px;
  z-index: 10;
}
.login-admin-title{
  font-size: 24px;
  line-height: 64px;
}
.login-u-type {
  cursor: pointer;
  color: #303133;
}
.login-u-type-active {
  color: #aa3130;
}
.el-divider--vertical{
  background-color: #666;
}
</style>
