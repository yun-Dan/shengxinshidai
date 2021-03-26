<template>
  <div class="app-protocol-assist-check-pdf">
    <el-form label-width="130px" @submit.native.prevent>
      <el-form-item :label="`PDF${pdfInfo.pdf == 1 ? '承诺书' : pdfInfo.pdf == 2 ? '合同' : ''}：`">
        <div v-if="pdfInfo.src">
          <iframe :src="pdfInfo.src" width="80%" height="700px" frameborder="0"></iframe>
        </div>
      </el-form-item>
      <el-form-item v-if="Query.type == 1" label="审核结果：" :rules="[{required: true}]">
        <el-radio-group v-model="form.status">
          <el-radio :label="6">通过</el-radio>
          <el-radio :label="7">不通过</el-radio>
        </el-radio-group>
        <span v-if="pdfInfo.pdf == 1 && form.status === 6" class="annotation">
          （ <span class="danger">*注：</span> 承诺书审核通过后将<span class="success"> “启动签署” </span>！ ）
        </span>
        <span v-if="pdfInfo.pdf == 2 && form.status === 7" class="annotation">
          （<span class="danger">*注：</span> PDF合同审核不通过后<span class="warning">乙方需重新签署</span>！）
        </span>
      </el-form-item>
      <el-form-item v-if="form.status == 7" label="不通过原因：" :rules="[{required: true}]">
        <el-input type="textarea" :rows="2" placeholder="请输入审核不通过的原因" style="width: 50%" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="" @click="handleBack">返 回</el-button>
        <el-button v-if="Query.type == 1 && pdfInfo.pdf" type="primary" @click="hanldeTrue" v-loading="loading">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const urls = {
  pdf_status: '/admin/contracts/review_fzstart', // 启动签署状态
  pdf_check: '/admin/contracts/reAudit' // 复核
}

export default {
  data () {
    return {
      loading: false,
      form: {
        id: null,
        uid: null,
        pro_id: null,
        status: 6,
        content: ''
      },
      Query: {}
    }
  },
  computed: {
    ...mapState([
      'URL',
      "lookUrl",
      'userInfo'
    ]),
    pdfInfo () {
      let str = ''
      let pdf = 0
      if (this.Query.pdf == 1) {
        if (this.Query.code) {
          str = `${this.lookUrl}/${this.Query.code}`
          pdf = 1
        }
      } else if (this.Query.pdf == 2) {
        if (this.Query.code_2) {
          str = `${this.URL}/${this.Query.code_2}`
          pdf = 2
        }
      }
      return {
        src: str,
        pdf
      }
    }
  },
  methods: {
    ...mapActions(['axiosHttp']),
    hanldeTrue () {
      if (this.form.status == 7 && !this.form.content) {
        this.$message.warning('“不通过原因”不能为空！')
        return false
      }
      this.loading = true
      if (this.loading) {
        this.axiosHttp({
          url: this.pdfInfo.pdf == 1 ? urls.pdf_status : urls.pdf_check,
          type: 'post',
          data: this.pdfInfo.pdf == 1 ? Object.assign({}, this.form, {
            content: this.form.status == 7 ? this.form.content : ''
          }) : {
            is_pass: this.form.status == 6 ? 1 : 0,
            id: this.form.id,
            content: this.form.status == 7 ? this.form.content : ''
          },
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('操作成功！')
            this.handleBack()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                this.loading =false
              }
            })
          }
        })
      }
    },
    handleBack () {
      this.$router.go(-1)
    }
  },
  created () {
    this.Query = this.$route.query
    this.$set(this.form, 'id', this.Query.id)
    this.$set(this.form, 'uid', this.Query.uid)
    this.$set(this.form, 'pro_id', this.Query.pro_id)
  }
}
</script>

<style scoped>
.app-protocol-assist-check-pdf{
  padding: 20px;
}
.annotation {
  margin: 0;
  font-size: 12px;
  color: #8492a6;
  padding-left: 20px;
}
</style>

