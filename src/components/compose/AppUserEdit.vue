<template>
  <el-dialog
    center
    title="编辑个人信息"
    width="450px"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="() => $emit('change')">
    <el-form label-width="100px" style="text-align: left" v-loading="loading">
      <el-form-item label="账号：">{{ form.username }}</el-form-item>
      <el-form-item label="姓名：">{{ form.realname }}</el-form-item>
      <el-form-item label="重置密码：">
        <el-radio v-model="radioRepeat" :label="1">是</el-radio>
        <el-radio v-model="radioRepeat" :label="0">否</el-radio>
      </el-form-item>
      <template v-if="radioRepeat">
        <el-form-item label="新密码：" :rules="[{required: true}]">
          <el-input v-model.trim="form.password" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :rules="[{required: true}]">
          <el-input v-model.trim="repeatWord" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="手机号码：">
        <el-input v-model.trim="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="办公电话：">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input v-model.trim="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="handleTrue">提交</el-button>
        <el-button @click="$emit('change')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'app-user-edit',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        realname: '',
        tp: 2,
        college_id: null,
        structure_id: null,
        job: '',
        mobile: '',
        tel: '',
        email: '',
        auth_college: 0,
        auth_structrue: 0,
        auth_cert: 0,
        auth_xysp: 0, // 
        remark: '',
        pwd_status: 1,
        status: 1,
        auth_question: 0,
        auth_report: 0,
        auth_share: 0,
        is_app: 0,
        id_card: '',
        auth_side: ['/home/index/index'],
        permissions: ['1'],
        workshop: ['/home/index/index'],
        is_yjsy: 0
      },
      radioRepeat: 0,
      repeatWord: ''
    }
  },
  props: {
    visible: { // 
      type: Boolean,
      default: false
    },
    change: {
      type: Function,
      default: () => () => {}
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations([
      'editUserInfo'
    ]),
    ...mapActions(['getUserId', 'updateUser']),
    getInfo() {
      this.loading = true
      if (this.loading) {
        this.getUserId({
          id: this.userInfo.uid
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data
            for (let key in this.form) {
              if (Data.hasOwnProperty(key)) {
                this.$set(this.form, key, Data[key] || (Data[key] === 0 ? Data[key] : this.$options.data().form[key]))
              }
            }
            this.$set(this.form, 'password', '')
            this.repeatWord = ''
            this.radioRepeat = this.$options.data().radioRepeat
            this.loading = false
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      }
    },
    handleTrue() {
      if (this.form.username.length < 6 || this.form.username.length > 12) {
        this.$message({
          message: '请输入登录账号，长度需在6到12位！',
          type: 'warning'
        })
        return false
      }
      if (!this.form.realname) {
        this.$message({
          message: '姓名不能为空！',
          type: 'warning'
        })
        return false
      }
      const params = JSON.parse(JSON.stringify(this.form))
      if (this.radioRepeat) {
        if (!this.form.password) {
          this.$message({
            message: '密码不能为空！',
            type: 'warning'
          })
          return false
        }
        if (!this.repeatWord) {
          this.$message({
            message: '确认密码不能为空！',
            type: 'warning'
          })
          return false
        }
        if (this.form.password !== this.repeatWord) {
          this.$message({
            message: '两次输入的密码不同，请重新输入！',
            type: 'warning',
            onClose: () => {
              this.repeatWord = ''
              this.$set(this.form, 'password', '')
            }
          })
          return false
        }
      } else {
        delete params.password
      }
      this.loading = true
      if (this.loading) {
        this.updateUser({
          data: params,
          id: this.userInfo.uid
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success(`恭喜你，${data.data.data}`)
            this.$emit('change')
            const INFO = Object.assign(JSON.parse(JSON.stringify(this.userInfo)), {
              name: this.form.username,
              username: this.form.username,
              realname: this.form.realname,
              mobile: this.form.mobile,
              tel: this.form.tel,
              email: this.form.email
            })
            this.$cookie.set('userInfo', JSON.stringify(INFO))
            this.editUserInfo(INFO)
          } else {
            this.$message({
              message: '错误：' + data.data.error,
              type: 'warning',
              onClose: () => {
                this.loading = false
              }
            })
          }
        })
      }
    },
    perfectInfo () {
      this.loading = false
      this.$alert('', '请完善个人登录账号信息', {
        confirmButtonText: '确定',
        showClose: false,
        center: true,
        type: 'warning',
        dangerouslyUseHTMLString: true,
        callback: action => {
          this.$emit('change')
        }
      })
    }
  },
  created () {
    if (!this.userInfo.username) {
      this.perfectInfo()
    }
  },
  watch: {
    visible: {
      handler () {
        if (this.visible) {
          this.getInfo()
        }
      }
    }
  }
}
</script>
