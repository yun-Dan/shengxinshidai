<template>
  <div id="app-home" v-cloak>
    <el-container class="app-home-content" v-if="ck">
      <el-header class="app-home-content-head" :style="{ backgroundColor: ckTitle[ck] ? ckTitle[ck].header_bg : '#1f262d' }">
        <AppHead></AppHead>
      </el-header>
      <el-container class="app-home-content-body">
        <el-aside class="app-aside" :class="{'small-width':isCollapse}" style="width: 'auto'">
          <AsideMenu></AsideMenu>
        </el-aside>
        <el-main class="app-home-main" :class="{'small-left':isCollapse,'show-left':showCollapse}">
          <AppCrumbs class="app-home-main-crumbs"></AppCrumbs>
          <div class="app-home-main-row" ref="gundong">
            <el-row>
              <el-col :span="24">
                <router-view/>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ckTitle from '@/assets/js/ckTitle.js'
import AppHead from '@/components/compose/AppHead.vue'
import AsideMenu from '@/components/compose/AsideMenu.vue'
import AppCrumbs from '@/components/compose/AppCrumbs.vue'

export default {
  name: 'app-home',
  data() {
    return {
      ck: 0,
      ckTitle
    }
  },
  components: {
    AppHead,
    AsideMenu,
    AppCrumbs
  },
  computed: {
    ...mapState(['isCollapse', 'showCollapse', 'userInfo'])
  },
  methods: {
    ...mapActions(['getProjectConfig']),
    initConfig () {
      if (!localStorage.getItem('pro_config')) {
        this.getProjectConfig().then(data => {
          const Data = JSON.parse(JSON.stringify(data.data.data))
          delete Data.pxlx['10']
          localStorage.setItem('pro_config', JSON.stringify(Data))
        })
      }
    }
  },
  created () {
    if (this.userInfo.role === 1) {
      const CK = sessionStorage.getItem('CK')
      if (CK) {
        this.ck = CK
      } else {
        if (this.userInfo.is_yjsy) {
          ['userInfo', 'headers', 'crumbs'].forEach(item => {
            this.$cookie.delete(item)
          })
          sessionStorage.clear()
          localStorage.clear()
          this.$router.push('/login')
        } else {
          this.$router.push('/center')
        }
      }
    } else if (this.userInfo.role === 2) {
      const CK = sessionStorage.getItem('CK-T')
      if (CK) {
        this.ck = CK
      } else {
        this.$router.push('/center_teacher')
      }
    }
    this.initConfig()
  },
  beforeDestroy () {
    localStorage.removeItem('pro_config')
  },
  updated () {
    this.$nextTick(() => {
      if (this.$refs.gundong) {
        this.$refs.gundong.scrollTop = 0
      }
    })
  }
}
</script>

<style>
.app-home-content {
  position: relative;
}
.app-home-content-head {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
}
.app-home-content-body {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
}
.app-aside {
  overflow: hidden !important;
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  z-index: 1;
}
.app-home-main {
  background-color: #f4f4f4;
  padding: 0;
  position: absolute;
  top: 0;
  left: 220px;
  right: 0;
  bottom: 0;
  overflow: hidden !important;
}
.app-home-main-crumbs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid #ebeef5;
  z-index: 100;
}
.app-home-main-row {
  position: absolute;
  top: 50px;
  left: 0;
  right: -12px;
  bottom: 0;
  overflow-y: scroll;
}
@media screen and (max-width: 1200px) {
  .app-aside {
    width: 64px;
  }
  .app-home-main {
    left: 64px;
  }
}
@media screen and (min-width: 1200px) {
  .app-aside {
    width: 220px;
  }
  .app-home-main {
    left: 220px;
  }
  .small-width {
    width: 64px;
  }
  .small-left {
    left: 64px;
  }
}
@media screen and (max-width: 992px) {
  .small-width {
    width: 64px;
  }
  .small-left {
    left: 64px;
  }
  .app-aside {
    width: 0;
  }
  .app-home-main {
    left: 0;
  }
  .show-left {
    left: 64px;
  }
}
</style>
