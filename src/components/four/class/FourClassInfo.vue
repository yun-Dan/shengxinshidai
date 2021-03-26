<template>
  <div class="four-major-form" v-loading="loading">
    <div class="four-major-form-body">
      <el-form size="small" label-width="170px">
        <el-form-item label="办班学院：">
          {{ infoData.college_name || infoData.cname }}
        </el-form-item>
        <el-form-item label="办班专业：">
          {{ infoData.major_name }}
        </el-form-item>
        <el-form-item label="办班地区：">
          {{ `${infoData.province_name} / ${infoData.city_name || infoData.area_name}` }}
        </el-form-item>
        <el-form-item label="计划招生数：">
          {{ infoData.plan_enroll_num }} 人
        </el-form-item>
        <el-form-item label="计划办班时间：">
          {{ infoData.plan_open_stime }} 至 {{ infoData.plan_open_etime }}
        </el-form-item>
        <el-form-item label="硕士点批准时间：">
          {{ infoData.master_approval_time }}
        </el-form-item>
        <el-form-item label="是否已有五届硕士毕业生：">
          <span v-if="infoData.has_five_master_graduate > 0" class="success">是</span>
          <span v-else>否</span>
        </el-form-item>
        <el-form-item label="所在的一级学科是否有一个及以上博士点：">
          <div slot="label" style="line-height: 20px;">
            所在的一级学科是否有一个及以上博士点：
          </div>
          <span v-if="infoData.has_doctor > 0" class="success">是</span>
          <span v-else>否</span>
        </el-form-item>
        <el-form-item label="所在的一级学科是否有三个及以上硕士点：">
          <div slot="label" style="line-height: 20px;">
            所在的一级学科是否有三个及以上硕士点：
          </div>
          <span v-if="infoData.has_three_master > 0" class="success">是</span>
          <span v-else>否</span>
        </el-form-item>
        <el-form-item label="附件：">
          <el-button v-if="infoData.attachment" type="text" icon="el-icon-paperclip" @click="handlePreview(infoData.attachment)">点击查看</el-button>
          <span v-else class="info">（无）</span>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="clearfix" style="line-height: 20px; font-size: 12px; color: #606266">
            <div class="fl">
              授课方案：（该方案为各专业授课的基本要求，具体开课类别和相应门数应不低于此要求）
            </div>
          </div>
          <el-table
            :data="infoData.course"
            size="small" class="four-major-form-course"
            style="width: 100%" border
            :header-cell-style="{backgroundColor:'#F5F7FA'}">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              label="拟开设课程名称"
              prop="course_name"
              align="center"
              min-width="100">
            </el-table-column>
            <template v-if="!(userInfo.role === 1 && `${ Query.type}` === '1')">
              <el-table-column
                label="授课教师信息"
                align="center">
                  <el-table-column
                    label="姓名"
                    prop="docent_name"
                    align="center"
                    width="90">
                  </el-table-column>
                  <el-table-column
                    label="职称"
                    prop="docent_title"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="职工号/身份证号"
                    prop="docent_idcard"
                    align="center"
                    min-width="100">
                  </el-table-column>
                  <el-table-column
                    label="工作单位"
                    prop="docent_unit"
                    align="center">
                  </el-table-column>
              </el-table-column>
              <el-table-column
                label="学时"
                prop="course_hour"
                align="center"
                width="70">
              </el-table-column>
            </template>
          </el-table>
        </el-form-item>
        <template v-if="userInfo.role === 1 && `${ Query.type}` === '1'">
          <el-form-item label="初审结果：" :rules="[{required: true}]">
            <el-radio-group v-model="checkForm.status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="checkForm.status === 2" label="初审不通过原因：" :rules="[{required: true}]">
            <el-input type="textarea" :rows="2" placeholder="请输入初审不通过原因" v-model="checkForm.cause"></el-input>
          </el-form-item>
        </template>
        <el-form-item v-else label="状态：">
          <span v-if="statusObj[infoData.status]" :class="statusObj[infoData.status].type">
            {{ statusObj[infoData.status].label }}
          </span>
          <span v-if="infoData.status === 2 && infoData.cause" class="info">
            （{{ infoData.cause }}）
          </span>
        </el-form-item>
        <el-form-item class="four-align-center">
          <el-button v-if="userInfo.role === 1 && `${ Query.type}` === '1'" type="primary" @click="handleTrue">提 交</el-button>
          <el-button type="" @click="goBack">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const urls = {
  info: '/yxb/classmajor/info',
  check: '/yxb/classmajor/upstatus'
}

const status = {
  0: {
    label: '未提交',
    value: 0,
    type: 'info'
  },
  1: {
    label: '待初审',
    value: 1,
    type: 'warning'
  },
  2: {
    label: '不通过',
    value: 2,
    type: 'danger'
  },
  3: {
    label: '通过',
    value: 3,
    type: 'success'
  }
}

export default {
  data () {
    return {
      loading: false,
      infoData: {
        course: []
      },
      checkForm: {
        status: 3,
        cause: ''
      },
      Query: {},
      statusObj: status
    }
  },
  computed: {
    ...mapState([
      'lookUrl',
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'axiosHttp',
      'getProvinces',
      'getStructures'
    ]),
    getInfo (ID) {
      if (ID) {
        this.loading = true
        if (this.loading) {
          this.axiosHttp({
            url: urls.info,
            data: {
              id: ID
            }
          }).then(data => {
            if (data.data.code === 200) {
              this.infoData = data.data.data
              if (this.infoData.status !== 1) {
                this.$set(this.checkForm, 'status', this.infoData.status - 0 || 3)
                this.$set(this.checkForm, 'cause', this.infoData.cause || '')
              }
              this.loading = false
            } else {
              this.$notify.error({
                message: data.data.error,
                onClose: () => {
                  this.goBack()
                }
              })
            }
          })
        }
      }
    },
    handleTrue () {
      if (this.checkForm.status == 2 && !this.checkForm.cause) {
        this.$message.warning('初审不通过原因不能为空！')
        return false
      }
      this.loading = true
      if (this.loading) {
        this.axiosHttp({
          url: urls.check,
          type: 'post',
          data: {
            class_major_id: this.infoData.id,
            status: this.checkForm.status,
            cause: this.checkForm.status == 2 ? this.checkForm.cause : ''
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('操作成功！')
            this.goBack()
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
    handlePreview (url) {
      window.open(`${this.lookUrl}/${url}`)
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  created () {
    this.Query = this.$route.query
    this.getInfo(this.Query.id)
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'FourClassMajorIndex') {
      if (this.Query.StrList) {
        sessionStorage.setItem('class_majorIndex', this.Query.StrList)
      }
    }
    next()
  }
}
</script>

<style scoped>
.four-major-form{
  padding: 10px;
}
.four-major-form-body{
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}
</style>
