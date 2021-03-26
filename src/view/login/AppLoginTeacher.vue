<template>
  <div class="app-login-teacher">
    <div class="app-login-teacher-inner">
      <header class="app-login-teacher-head app-login-teacher-fixed clearfix">
        <a href="javascript:;" class="fl">
          <img src="../../assets/images/rmdx.png" alt="人大培训管理" style="max-height: 50px">
        </a>
        <div class="fr hidden-sm-and-down">
          <ul class="top-list-link clearfix">
            <li v-for="(item, index) in list" :key="index"
              :class="`fl ${item.class} ${item.mark ? 'top-li-mark' : ''}`"
              @click="handleLi(item.value, item)">
              {{ item.title }}
              <span></span>
            </li>
          </ul>
        </div>
      </header>
      <section class="app-login-teacher-body">
        <div class="app-login-teacher-body-inner app-login-teacher-fixed">
          <div class="login-body-right">
            <div class="login-box">
              <div class="login-box-head weixin-title">{{ data.title}}</div>
              <div class="weixin-box">
                <a :href="data.weixin" class="weixin-link">
                  <img src="../../assets/images/weixinlogo.png" alt>
                  <p class="weixin-text">
                    点击图标 <span style="color: #ff0000">打开手机微信</span> 扫一扫登录
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="app-login-teacher-foot app-login-teacher-fixed set-align-center">
        <div class="foot-copyright-box">
          <p>{{ data.copyright }}</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'app-login-teacher',
  data () {
    return {
      data: {
        title: '手机扫码，安全登录',
        weixin: '',
        copyright: 'copyright©2014 中国人民大学版权所有.All RIGHTS RESERVED'
      },
      list: [
        {
          title: '网站首页',
          value: 1,
          mark: false
        },
        {
          title: '联系我们',
          value: 2,
          mark: false
        },
        {
          title: '加为收藏',
          value: 3,
          mark: false,
          class: 'collect-link'
        },
        {
          title: '旧版管理系统',
          value: 4,
          mark: true,
          class: 'old-link',
          link: 'http://10.21.6.251'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['weChatLogin']),
    handleLi (num, val) {
      if (val.link) {
        window.open(val.link)
      } else {
        this.list.forEach(item => {
          this.$set(item, 'mark', item.value === num)
        })
        if (num === 3) {
          let url = window.location
          let title = document.title
          let ua = navigator.userAgent.toLowerCase()
          if (ua.indexOf('msie 8') > -1) {
            external.AddToFavoritesBar(url, title, '') //
          } else {
            try {
              window.external.addFavorite(url, title)
            } catch (e) {
              try {
                window.sidebar.addPanel(title, url, '') //
              } catch (e) {
                alert('加入收藏失败，请使用Ctrl+D进行添加')
              }
            }
          }
        }
      }
    },
    getWeChatUrl () {
      this.weChatLogin().then(data => {
        if (data.data.code === 200) {
          this.$set(this.data, 'weixin', data.data.data)
        }
      })
    }
  },
  created () {
    this.getWeChatUrl()
  }
}
</script>

<style scoped>
.app-login-teacher {
  overflow: auto;
  height: 100%;
  background-color: #fff;
}
.app-login-teacher-fixed {
  width: 90%;
  margin: 0 auto;
}
.app-login-teacher-inner {
  width: 100%;
}
.app-login-teacher-head {
  height: 120px;
  background-color: #fff;
}
.app-login-teacher-head a {
  display: inline-block;
  margin-top: 34px;
}
.app-login-teacher-body {
  background: url("../../assets/images/teacherlogin2.jpg") no-repeat center;
  background-size: cover;
}
.app-login-teacher-body-inner {
  position: relative;
  min-height: 800px;
}
.login-body-right {
  position: absolute;
  right: 0;
  top: 41%;
  width: 410px;
  height: 410px;
  margin-top: -205px;
  border: 2px solid #fff;
  border-radius: 10px;
  background-color: rgba(183, 186, 185, 0.9);
}
.login-box {
  height: 390px;
  padding: 10px 14px;
}
.login-box-head {
  font-size: 22px;
  color: #234a73;
  text-align: center;
  padding: 30px 0;
}
.weixin-title {
  padding-bottom: 10px;
}
.weixin-link {
  display: block;
  width: 230px;
  height: 230px;
  margin: 0 auto;
}
.weixin-link img {
  width: 100%;
  height: 100%;
}
.weixin-text {
  text-align: center;
  font-size: 12px;
  color: #2e3e4e;
}
.app-login-teacher-foot {
  line-height: 14px;
  font-size: 14px;
}
.foot-copyright-box p {
  padding: 5px 0;
  margin: 0;
  font-size: 12px;
  color: #234a73;
}
.top-list-link {
  line-height: 120px;
  font-size: 16px;
}
.top-list-link li {
  position: relative;
  margin-left: 40px;
  color: #6c6d70;
}
.top-list-link .top-li-mark {
  color: #af1831;
}
.top-list-link li:hover {
  cursor: pointer;
}
.top-list-link li::before {
  position: absolute;
  top: 0;
  left: -14px;
  content: "";
  width: 1px;
  height: 68px;
  background-color: #8b8e91;
}
.top-list-link .collect-link::before {
  left: -15px;
}
.top-list-link .old-link::before {
  left: -14px;
}
.top-list-link .top-li-mark::before {
  background-color: #af1831;
}
.top-list-link li span {
  position: absolute;
  top: 52px;
  left: -14px;
  content: "";
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: #8b8e91;
}
.top-list-link .top-li-mark span {
  border-left-color: #af1831;
}
</style>
