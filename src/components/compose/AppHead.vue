<template>
  <el-row>
    <el-col :xs="4" :sm="4" :md="0" :lg="0">
      <span
        class="hidden-btn hidden-md-and-up"
        style="line-height: 60px; font-size: 1.5em"
        @click="editShowCollapse"
      >
        <i class="fa fa-bars"></i>
      </span>
    </el-col>
    <el-col :xs="16" :sm="12" :md="17" :lg="18">
      <div class="grid-content bg-purple">
        <h1 class="app-head hidden-sm-and-down">
          <a
            href="#"
            style="display: inline-block; width: 200px"
            :style="{ color: ckTitle[ck] ? ckTitle[ck].header_color : '#dedede' }"
          >{{ ckTitle[ck] ? ckTitle[ck].label : title }}</a>
          <span class="hidden-md-and-down">
            <span class="hidden-btn" @click="editIsCollapse">
              <i class="fa fa-bars"></i>
            </span>
          </span>
        </h1>
        <h1 class="app-head hidden-sm" style="text-align: center">
          <a
            href="#"
            :style="{ color: userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].header_color : '#dedede' : '#dedede' }"
          >{{ userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].label : title : title }}</a>
          <span class="hidden-md-and-down">
            &nbsp; &nbsp; &nbsp; &nbsp;
            <span class="hidden-btn" @click="editIsCollapse">
              <i class="fa fa-bars"></i>
            </span>
          </span>
        </h1>
      </div>
    </el-col>
    <el-col :xs="4" :sm="8" :md="7" :lg="6">
      <div class="grid-content bg-purple">
        <LoginAvatar></LoginAvatar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import LoginAvatar from '@/components/common/LoginAvatar'
import ckTitle from '@/assets/js/ckTitle.js'

export default {
  name: 'app-head',
  data() {
    return {
      title: '继续教育微系统',
      ck: 1,
      ckTitle
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    LoginAvatar
  },
  methods: {
    ...mapMutations(['editIsCollapse', 'editShowCollapse'])
  },
  created() {
    if (sessionStorage.getItem('CK') && this.userInfo.role === 1) {
      this.ck = sessionStorage.getItem('CK')
    } else if (sessionStorage.getItem('CK-T') && this.userInfo.role === 2) {
      this.ck = sessionStorage.getItem('CK-T')
    }
  }
}
</script>

<style scoped>
.app-head {
  height: 60px;
  line-height: 60px;
}
.app-head a:hover {
  color: #fff;
}
.hidden-btn {
  color: #f4f4f4;
  cursor: pointer;
}
</style>
