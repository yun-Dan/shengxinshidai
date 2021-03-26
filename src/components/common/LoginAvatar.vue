<template>
  <div class="login-avatar">
    <el-dropdown trigger="click">
      <div class="el-dropdown-link">
        <img v-if="userInfo.image" :src="userInfo.image" alt class="user-img">
        <img src="../../assets/images/user.jpg" alt class="user-img" v-else>
        <span class="hidden-sm-and-down" :style="{ color: ckTitle[ck] ? ckTitle[ck].header_color : '#dedede' }">
          {{ userInfo.realname ? userInfo.realname : userInfo.name }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="!userInfo.is_yjsy" @click.native="handleClick(1)">
          <div class="text-align-center">
            <i class="el-icon-s-grid"></i>
            综合办公平台
          </div>
        </el-dropdown-item>
        <el-dropdown-item @click.native="handleClick(2)">
          <div class="text-align-center">
            <i class="el-icon-edit"></i>
            编辑个人信息
          </div>
        </el-dropdown-item>
        <el-dropdown-item @click.native="handleClick(3)" :divided="userInfo.role === 1">
          <div class="text-align-center">退出登录</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <AppUserEdit :visible="visible" @change="handleChange"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import  ckTitle from '@/assets/js/ckTitle.js'
import { clearLoginOut } from '@/assets/js/logout.callback.js'
import AppUserEdit from '@/components/compose/AppUserEdit.vue'

export default {
  name: 'login-avatar',
  data() {
    return {
      ck: 1, // 
      ckTitle,
      visible: false
    };
  },
  computed: {
    ...mapState(['gwUrl', 'userInfo'])
  },
  components: {
    AppUserEdit
  },
  methods: {
    ...mapActions(['logout']),
    handleClick(type) {
      if (type === 1) {
        if (this.userInfo.role === 1) {
          this.$router.push({
            name: 'AppCenter'
          })
          sessionStorage.removeItem('CK');
          sessionStorage.removeItem('CK-activeMenu');
        } else {
          this.$router.push({
            name: 'AppCenterTeacher'
          })
          sessionStorage.removeItem('CK-T');
          sessionStorage.removeItem('CK-activeMenu-T');
        }
      } else if (type === 2) {
        this.visible = true
      } else if (type === 3) {
        this.outLogin();
      }
    },
    outLogin() {
      this.logout({
        data: {
          authkey: JSON.parse(this.$cookie.get('headers')).authkey
        }
      }).then(data => {
        if (data.data.code === 200) {
          clearLoginOut({
            $cookie: this.$cookie
          })
          if (this.userInfo.role === 1) {
            this.$router.push('/login/admin');
          } else {
            this.$router.push('/login/teacher');
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.data.error
          });
        }
      });
    },
    handleLink() {
      const headers = this.$cookie.get('headers');
      if (headers) {
        let obj = JSON.parse(this.$cookie.get('headers'));
        window.open(
          `${this.gwUrl}?sessionId=${obj.sessionid}&authCode=${obj.authkey}`,
          '_blank'
        );
      }
    },
    handleChange () {
      this.visible = !this.visible
    }
  },
  created() {
    if (sessionStorage.getItem("CK") && this.userInfo.role === 1) {
      this.ck = sessionStorage.getItem("CK")
    } else if (sessionStorage.getItem("CK-T") && this.userInfo.role === 2) {
      this.ck = sessionStorage.getItem("CK-T")
    }
  }
}
</script>

<style scoped>
.login-avatar {
  height: 60%;
  line-height: 60px;
  text-align: right;
}
.el-dropdown-link {
  color: #dedede;
}
.el-dropdown-link:hover {
  cursor: pointer;
}
.user-img {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  border-radius: 15px;
}
</style>
