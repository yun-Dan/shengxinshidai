<template>
  <div id="app">
    <!-- <router-view
      v-wechat-title="center.role === 1 ?
      ($route.name === 'AppCenter' ?
      '继续教育处综合办公平台' : 
      ($route.name === 'AppLogin' ?
      '继续教育处综合办公平台' :
      (ckTitle[ck] ?
      ckTitle[ck].label :
      '继续教育微系统'))) :
      '继续教育微系统'"
    ></router-view> -->
    <router-view
      v-wechat-title="$route.name === 'AppCenter' || $route.name === 'AppLogin' ? '继续教育处综合办公平台' : 
      $route.name === 'AppCenterTeacher' || $route.name === 'AppLoginTeacher' ? '继续教育处综合办公平台' :
      ckTitle[ck] ? ckTitle[ck].label :
      '继续教育微系统'"
    ></router-view>
    <!--提示浏览器版本低的弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="100%"
      center
      :fullscreen="true"
      :append-to-body="true"
      :show-close="false"
    >
      <div style="font-size: 16px; text-align: center">
        您当前使用的 浏览器 版本过低，请升至最新版本或更换其他浏览器（
        建议使用
        <strong>Chrome浏览器</strong>
        ）后再访问本网页吧！
        <!-- <el-button type="text" @click.native="handleLoading">点击安装</el-button>）后再访问本网页吧！ -->
      </div>
      <div style="text-align: center">
        <img class="pan-img" :src="ewizardClap">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ckTitle from '@/assets/js/ckTitle.js'

export default {
  name: 'App',
  data() {
    return {
      centerDialogVisible: false, // 显示提示版本过低
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646', // 动图url
      center: {}, // 管理员继教平台
      ck: 0, // 管理员继教平台各小系统模块
      ckTitle
    }
  },
  methods: {
    ...mapMutations([
      'editUserInfo'
    ]),
    initCenter() {
      if (this.$cookie.get('userInfo')) {
        const INFO = JSON.parse(this.$cookie.get('userInfo'))
        this.editUserInfo(INFO)
        this.center = {
          role: INFO.role
        }
        if (sessionStorage.getItem('CK') && INFO.role === 1) {
          this.ck = sessionStorage.getItem('CK')
        } else if (sessionStorage.getItem('CK-T') && INFO.role === 2) {
          this.ck = sessionStorage.getItem('CK-T')
        }
      }
    },
    handleLoading() {}, // 安装Chrome浏览器
    globalGetV() {
      // 获取用户浏览器版本
      let explorer = window.navigator.userAgent.toLowerCase()
      //ie9-ie10
      if (explorer.indexOf('msie') >= 0) {
        let ver = explorer.match(/msie ([\d.]+)/)[1]
        return { type: 'IE', version: ver }
      }
      //firefox
      else if (explorer.indexOf('firefox') >= 0) {
        let ver = explorer.match(/firefox\/([\d.]+)/)[1]
        return { type: 'Firefox', version: ver }
      }
      //Chrome
      else if (explorer.indexOf('chrome') >= 0) {
        let ver = explorer.match(/chrome\/([\d.]+)/)[1]
        return { type: 'Chrome', version: ver }
      }
      //Opera
      else if (explorer.indexOf('opera') >= 0) {
        let ver = explorer.match(/opera.([\d.]+)/)[1]
        return { type: 'Opera', version: ver }
      }
      //Safari
      else if (explorer.indexOf('Safari') >= 0) {
        let ver = explorer.match(/version\/([\d.]+)/)[1]
        return { type: 'Safari', version: ver }
      }
    }
  },
  created () {
    this.initCenter()
  },
  mounted() {
    const INFO = this.globalGetV() // 判断用户的版本过低时提示用户升级
    if (INFO) {
      if (INFO.type === 'IE') {
        this.centerDialogVisible = true
      }
    }
  },
  beforeDestroy() {
    sessionStorage.clear()
    localStorage.clear()
  },
  watch: {
    $route() {
      if (this.$route.name === 'AppCenter') {
        this.initCenter()
      }
    }
  }
}
</script>
