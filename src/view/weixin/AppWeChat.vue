<template>
  <div
    class="app-we-chat"
    v-loading="loading"
    element-loading-text="微信登录中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  ></div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { loginCallback } from '@/assets/js/login.callback.js'

export default {
  name: 'app-we-chat',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapMutations(['editUserInfo']),
    ...mapActions(['weChatLoginIn']),
    initData (code) {
      this.loading = true
      if (this.loading) {
        this.weChatLoginIn({
          data: {
            code: code
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data
            loginCallback({
              that: this,
              Data: Data,
              $router: this.$router,
              usertype: Data.userInfo.tp,
              fn: (params) => {
                this.editUserInfo(params)
              }
            })
          } else {
            this.$router.push('/login/teacher')
          }
        })
      }
    }
  },
  created () {
    const route = this.$route.fullPath
    this.initData(route.substring(route.indexOf('=') + 1, route.indexOf('&')))
  }
}
</script>

<style scoped>
.app-we-chat {
  height: 100%;
  background-color: #fff;
}
</style>
