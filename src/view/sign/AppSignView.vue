<template>
  <div class="app-sign-view">
    <div v-if="fzData.new_pdf" style="height: 100%;">
      <iframe :src="`${URL}/${fzData.new_pdf}?t=${iframeKey}}`" :key="iframeKey" width="100%" height=80% frameborder="0"></iframe>
      <div style="padding: 30px">
        <div>
          <el-button type="info" @click="handleOut">退出登录</el-button>
          <el-button v-if="fzData.status === 6 && fzData.is_fz != 2" type="primary" @click="handlePdfSign(fzData.new_pdf)">
            {{ fzData.is_fz == 1 ? '继续签章' : '签章' }}
          </el-button>
        </div>
        <div class="sign-view-text" style="text-align: center; line-height: 26px;">
          <span class="danger">*</span>
          <span class="set-font-weight danger">提示</span>：
          请使用<span class="color000">360极速</span>、<span class="color000">谷歌</span>浏览器进行操作，签章前请升级到最新版本。确保签章位置无误后提交！
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="visible"
      append-to-body center
      :fullscreen="true"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <div class="sign-view-body">
        <div class="sign-view-main">
          <div class="sign-view-img">
            <img src="../../assets/images/title_login2.png" style="width: 134px;">
          </div>
          <div class="sign-view-title" :style="{color: isYXB ? '' : '#bb0c2d'}">
            <span>{{ isYXB ? '课程班系统' : '继续教育微系统' }}</span>辅助单位登录平台
          </div>
          <div class="sign-view-form">
            <el-form>
              <el-form-item label="辅助单位名称" :rules="[{required: true}]" style="margin-bottom: 0">
                <el-input v-model.trim="fzForm.fz" clearable />
              </el-form-item>
              <el-form-item label="协议编号" :rules="[{required: true}]" style="margin-bottom: 0">
                <el-input v-model.trim="fzForm.fzcode" clearable />
              </el-form-item>
              <el-form-item label="验证码" :rules="[{required: true}]" style="margin-bottom: 0">
                <el-input v-model.trim="fzForm.rand" clearable />
              </el-form-item>
              <el-form-item>
                <div style="margin-top: 18px">
                  <el-button type="danger" v-loading="loading" @click="getFzData(0)" style="width: 100%; background-color: #aa3130">
                    登 录
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                  <div class="sign-view-text">
                    辅助单位若尚未进行数字认证，可点击下方链接办理：<br/>
                    <el-button type="text" @click="handleLink" class="sign-view-link" style="padding: 0; margin-left: 8px;">
                      <span class="set-font-weight">数字认证</span>
                    </el-button>
                  </div>
                  <div class="sign-view-text">
                    <span class="danger">*</span>
                    <span class="set-font-weight">声明</span>：
                    有关数字认证工作与我校无关，相关认证内容由辅助单位自行与数字认证公司联系办理，有关认证费用由辅助单位自行向数字认证公司缴纳。
                  </div>
              </el-form-item>
              <el-form-item style="margin-bottom: 0;">
                  <div class="sign-view-text">
                    【 <span class="set-font-weight">请自行下载并安装签章插件：</span>
                    <!-- <el-button type="text" size="mini" @click="handleDowload(1)">
                      <span class="set-font-weight">PDF签章</span>
                    </el-button> -->
                    <el-button type="text" size="mini" @click="handleDowload(2)">
                      <i class="fa fa-download"></i>
                      <span class="set-font-weight">下载</span>
                    </el-button> 】
                  </div>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                <div class="sign-view-text">
                  <span class="danger">*</span>
                  <span class="set-font-weight">提示</span>：
                  请使用<span class="color000">360极速</span>、<span class="color000">谷歌</span>浏览器进行操作，签章前请升级到最新版本。确保签章位置无误后提交！
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
    <PdfSign ref="pdfsign" :pdf-src="`${pdfSrc}?t=${iframeKey}`" :sort="2" @onetrue="clickOnetrue" @twotrue="clickTwotrue" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PdfSign from '@/components/three/PdfSign.vue'

const urls = {
  fz1: '/admin/base/contFz',
  fz2: '/yxb/baseyxb/contFz', 
  fz_sign1: '/admin/base/review_fzsize',
  fz_sign2: '/yxb/baseyxb/review_fzsize',
  fz_sign_data1: '/admin/base/chapter',
  fz_sign_data2: '/yxb/baseyxb/chapter',
}

export default {
  name: 'AppSignView',
  data () {
    return {
      visible: true,
      loading: false,
      fzForm: {
        fz: '',
        fzcode: '',
        rand: ''
      },
      fzData: {},
      
      pdfSrc: '',
      isYXB: false,
      
      link: 'https://online.bjca.org.cn/#/index?channelId=PT13TTJNek0=',
      iframeKey: 0
    }
  },
  computed: {
    ...mapState([
      'URL'
    ])
  },
  components: {
    PdfSign
  },
  methods: {
    ...mapActions([
      'axiosHttp'
    ]),
    getFzData (fn) {
      if (!this.fzForm.fz) {
        this.$message.warning('请输入“单位名称”！')
        return false
      }
      if (!this.fzForm.fzcode) {
        this.$message.warning('请输入“协议编号”！')
        return false
      }
      if (!this.fzForm.rand) {
        this.$message.warning('请输入“验证码”！')
        return false
      }
      this.loading = true
      if (this.loading) {
        this.axiosHttp({
          url: this.isYXB ? urls.fz2 : urls.fz1,
          data: this.fzForm,
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data
            if (fn) {
              document.querySelector('iframe').contentWindow.location.reload()
            } else {
              this.$message.success('登录成功！')
            }
            this.visible = false
            this.fzData = Data
            sessionStorage.setItem('fz_sign_con', JSON.stringify(Data))
            fn && fn()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                this.loading = false
              }
            })
          }
        })
      }
    },
    handlePdfSign (src) {
      this.pdfSrc = src
      this.$refs.pdfsign.getSignCertInfo()
    },
    clickOnetrue (params, data, fn, error) {
      const Obj = {
        id: this.fzData.id,
        pageno: params.pageNum,
        left: params.left,
        top: params.top,
        right: params.right,
        bottom: params.bottom,
        sealimg: data.seal_img,
        signcert: data.sign_cert
      }
      if (Obj.id) {
        this.axiosHttp({
          url: this.isYXB ? urls.fz_sign2 : urls.fz_sign1,
          type: 'post',
          data: Obj,
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            this.iframeKey = new Date().getTime()
            fn && fn(JSON.stringify(data.data.data))
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                error && error()
              }
            })
          }
        })
      }
    },
    clickTwotrue (params, fn) {
      this.axiosHttp({
        url: this.isYXB ? urls.fz_sign_data2 : urls.fz_sign_data1,
        type: 'post',
        data: {
          id: this.fzData.id,
          txt: params
        },
        yxb: true
      }).then(data => {
        if (data.data.code === 200) {
          this.$message.success('签章成功！')
          this.$nextTick(() => {
            this.iframeKey = new Date().getTime()
            if (this.fzData.is_fz == 0) {
              this.$set(this.fzData, 'is_fz', 1)
            } else if (this.fzData.is_fz == 1) {
              this.$set(this.fzData, 'is_fz', 2)
              this.$set(this.fzData, 'status', 8)
            }
            sessionStorage.setItem('fz_sign_con', JSON.stringify(this.fzData))
            fn && fn()
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: data.data.error
          })
        }
      })
    },
    handleOut () {
      this.loading = false
      this.visible = true
      sessionStorage.removeItem('fz_sign_con')
      this.fzData = {}
      for (let key in this.fzForm) {
        this.$set(this.fzForm, key, this.$options.data().fzForm[key])
      }
    },
    clearSystem () {
      sessionStorage.removeItem('CK-T')
      sessionStorage.removeItem('CK-T-activeMenu')
      sessionStorage.removeItem('yxb_auth_side')
    },
    handleLink () {
      window.open(this.link)
    },
    handleDowload (type) {
      if (type === 1) {
        window.open(`${this.URL}/static/file/PDFV1.exe`)
      } else if (type === 2) {
        window.open(`${this.URL}/static/file/qzcj.zip`)
      }
    }
  },
  created () {
    const Path = this.$route.path
    if (Path === '/kcb/xy') {
      this.isYXB = true
    }
    if (sessionStorage.getItem('fz_sign_con')) {
      this.visible = false
      this.fzData = JSON.parse(sessionStorage.getItem('fz_sign_con'))
    }
    this.clearSystem()
  },
  beforeDestroy () {
    sessionStorage.removeItem('fz_sign_con')
  }
}
</script>

<style scoped>
.app-sign-view{
  height: 100%;
  background-color: #fff;
  text-align: center;
}
.sign-view-body{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("../../assets/images/teacherlogin2.jpg") no-repeat center;
  background-size: cover;
  text-align: center;
}
.sign-view-main{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 600px;
  border-radius: 6px;
  margin-left: -250px;
  margin-top: -300px;
  background-color: rgba(255, 255, 255, 0.9);
}
.sign-view-img{
  padding: 20px 0;
}
.sign-view-title{
  font-size: 22px;
  color: #222;
}
.sign-view-form{
  padding: 10px 40px;
}
.sign-view-text{
  font-size: 12px;
  line-height: 20px;
  text-align: left;
}
.sign-view-link{
  font-size: 12px;
  text-decoration: underline;
}
.color000{
  color: #303133;
}
</style>
