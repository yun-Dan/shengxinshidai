<template>
  <div class="pdf-sign">
    <el-dialog
      title="请输入Key密码"
      :visible.sync="pwdVisible"
      append-to-body center
      width="300px">
      <el-input v-model="pwd" type="password" clearable />
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="clientLogin">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer
      :visible.sync="visible"
      direction="ltr"
      :size="sort === 1 ? '60%' : '100%'"
      append-to-body center
      :show-close="false"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :destroy-on-close="true">
      <div style="height: 100%; padding: 0 20px;">
        <iframe
        ref="BJCAPdfJsViewer"
        :src="`/static/sign/web/viewer.html?file=${isDevelopment ? '/static/sign/web/test.pdf' : pdfSrc}`"
        id="BJCAPdfJsViewer" width=100% height=80%></iframe>
        <div style="padding-top: 16px; text-align: center" v-loading="loading">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="sign">签 章</el-button>
          <el-button type="primary" @click="signTrue">提 交</el-button>
        </div>
      </div>
    </el-drawer>
    <form v-show="false" method="post" ID="LoginForm" name="LoginForm">
      <select id="UserList" name="UserList" ref="UserList"></select>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'pdf-sign',
  data () {
    return {
      pwdVisible: false,
      pwd: '',
      visible: false,
      cur_cert_id: null,
      sign_cert: '',
      seal_img: '',
      digestData: '',
      bPicFromUkey: 1,
      params: {
        pageNum: null,
        left: null,
        top: null,
        right: null,
        bottom: null
      },
      loading: false
    }
  },
  computed: {
    ...mapState([
      'isDevelopment'
    ])
  },
  props: {
    pdfSrc: {
      type: String,
      default: ''
    },
    onetrue: {
      type: Function,
      default: () => {}
    },
    twotrue: {
      type: Function,
      default: () => {}
    },
    sort: {
      type: Number,
      default: 1
    }
  },
  methods: {
    init () {
      this.$nextTick(() => {
        window.SetUserCertList && window.SetUserCertList('LoginForm.UserList', window.CERT_TYPE_HARD)
      })
    },
    sign () {
      this.clearStorage()
      localStorage.bPicFromUkey = this.bPicFromUkey
      this.dragForPos()
    },
    signTrue () {
      const ret = this.getPdfSealParam()
      if (ret) {
        this.loading = true
        if (this.loading) {
          this.$emit('onetrue', this.params, {
            cur_cert_id: this.cur_cert_id,
            sign_cert: this.sign_cert,
            seal_img: this.seal_img
          }, (digestData) => {
            this.digestData = digestData
            this.pwdVisible = true
          }, err => {
            this.loading = false
          })
        }
      } else {
        this.$notify.warning({
          position: 'top-left',
          title: '提示',
          message: '请“签章”后提交！'
        })
      }
    },
    handleClose () {
      this.clearStorage()
      this.pwd = ''
      this.sign_cert = ''
      this.seal_img = ''
      this.visible = false
      for (let key in this.params) {
        this.$set(this.params, key, null)
      }
    },
    getSignCertInfo () {
      this.pwd = ''
      this.sign_cert = ''
      this.seal_img = ''
      this.loading = false
      for (let key in this.params) {
        this.$set(this.params, key, null)
      }
      const select = this.$refs.UserList
      const Cert = select.options[select.selectedIndex]
      if (!Cert) {
        this.$message.error('未读取到证书信息，请插入签章Key！')
        return false
      }
      this.cur_cert_id = Cert.value
      if (!this.cur_cert_id) {
        this.$message.error('未读取到证书信息，请插入签章Key！')
        return false
      }
      window.ESeaL_GetUserCert(this.cur_cert_id, ret => {
        this.sign_cert = ret.retVal
      })
      window.ESeaL_GetStampPic(this.cur_cert_id, ret => {
        this.seal_img = ret.retVal
      })
      this.visible = true
    },
    clientLogin () {
      if (!this.pwd) {
        this.$message.error('请输入密码！')
        return false
      }
      window.VerifyUserPIN(this.cur_cert_id, this.pwd, strRes => {
        if (!strRes.retVal) {
          this.$message.error('校验密码错误！')
          return
        }
        this.clientSign()
      })
    },
    clientSign () {
      window.ESeaL_ClientSignByHash(this.digestData, this.cur_cert_id, this.pwd, ret => {
        this.$emit('twotrue', ret.retVal, () => {
          this.handleClose()
          this.pwdVisible = false
        })
			})
    },
    dragForPos () {
      const iframeWin = document.getElementById('BJCAPdfJsViewer').contentWindow
      const seal = iframeWin.document.getElementById('seal')
      this.$nextTick(() => {
        seal.click()
      })
    },
    getPdfSealParam () {
      this.$set(this.params, 'pageNum', localStorage.pageNum)
      this.$set(this.params, 'left', localStorage.sealLeft)
      this.$set(this.params, 'top', localStorage.sealTop)
      this.$set(this.params, 'right', localStorage.sealRight)
      this.$set(this.params, 'bottom', localStorage.sealBottom)
      return this.params.pageNum !== undefined && this.params.left !== undefined && this.params.bottom !== undefined
    },
    clearStorage () {
      localStorage.removeItem('database')
      localStorage.removeItem('bPicFromUkey')
      localStorage.removeItem('pageNum')
      localStorage.removeItem('sealLeft')
      localStorage.removeItem('sealTop')
      localStorage.removeItem('sealRight')
      localStorage.removeItem('sealBottom')
    }
  },
  mounted () {
    this.init()
    this.clearStorage()
  },
  watch: {
    pwdVisible: {
      handler () {
        if (!this.pwdVisible) {
          this.loading = false
        }
      }
    }
  }
}
</script>
