<template>
  <div class="four-major-form" v-loading="loading">
    <div class="four-major-form-body">
      <el-form size="" label-width="170px">
        <el-form-item v-if="userInfo.role === 1" label="办班学院：" :rules="[{required: true}]">
          <el-select v-model="form.college_id" placeholder="请选择" filterable
            @change="changeCollege" style="width: 100%">
            <el-option
              v-for="(item, index) in collegeList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办班专业：" :rules="[{required: true}]">
          <el-select v-model="form.major_id" placeholder="请选择" filterable
            style="width: 100%">
            <el-option
              v-for="(item, index) in majorList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办班地区：" :rules="[{ required: true}]">
          <el-cascader
            v-model="site"
            :options="optionsSite"
            @active-item-change="siteItemChange"
            placeholder="请选择" filterable
            :props="{
              value: 'id',
              children: 'cities'
            }"
            style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item label="计划招生数：" :rules="[{ required: true}]">
          <el-input-number v-model="form.plan_enroll_num" :min="0" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="计划办班时间：" :rules="[{ required: true}]">
          <el-row :gutter="0">
            <el-col :span="11">
              <el-date-picker
                v-model="form.plan_open_stime"
                type="date" value-format="yyyy-MM-dd"
                placeholder="开始日期"
                :picker-options="pickerOptionsS"
                style="width: 100%">
              </el-date-picker>
            </el-col>
            <el-col :span="2" class="four-align-center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="form.plan_open_etime"
                type="date" value-format="yyyy-MM-dd"
                placeholder="截止日期"
                :picker-options="pickerOptionsE"
                style="width: 100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="硕士点批准时间：" :rules="[{ required: true}]">
          <el-row :gutter="0">
            <el-col :span="11">
              <el-date-picker
                v-model="form.master_approval_time"
                type="date" value-format="yyyy-MM-dd"
                placeholder="开始日期"
                style="width: 100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否已有五届硕士毕业生：" :rules="[{ required: true}]">
          <el-radio-group v-model="form.has_five_master_graduate">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在的一级学科是否有一个及以上博士点：">
          <div slot="label" style="line-height: 20px; padding-top: 8px">
            <span class="danger">*</span>
            所在的一级学科是否有一个及以上博士点：
          </div>
          <el-radio-group v-model="form.has_doctor">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在的一级学科是否有三个及以上硕士点：">
          <div slot="label" style="line-height: 20px; padding-top: 8px">
            <span class="danger">*</span>
            所在的一级学科是否有三个及以上硕士点：
          </div>
          <el-radio-group v-model="form.has_three_master">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="招生简章相关附件：">
          <div class="upload-box">
            <el-upload
              class="avatar-uploader"
              :action="uploadExcelUrl1"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :on-preview="handlePreview"
              :headers="headers"
              :with-credentials="true"
              name="attachment"
              accept=".pdf, .PDF"
              :file-list="fileList"
              :limit="1"
              :auto-upload="true">
              <el-button type="primary" plain size="mini"
                icon="el-icon-upload el-icon--right"
              >附件上传（限 PDF 文件）</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label-width="0" :rules="[{ required: true}]">
          <div class="clearfix" style="line-height: 20px; font-size: 12px; color: #606266">
            <div>
              <span class="danger">*</span>
              授课方案：（该方案为各专业授课的基本要求，具体开课类别和相应门数应不低于此要求）
            </div>
            <div>
              <span class="danger" style="padding-left: 40px">其中“拟开设课程名称” 为必填信息！</span>
              <el-upload class="upload aaa"
                :action="uploadExcelUrl"
                accept=".xls, .xlsx, .XLS, .XLSX"
                :show-file-list="false" :limit="1"
                :on-success="handleSuccessE"
                :headers="headers" :with-credentials="true"
                name="attachment" :auto-upload="true">
                <el-button type="primary" plain size="mini" icon="el-icon-upload">
                  导入Excel
                </el-button>
                <span slot="tip" class="el-upload__tip">
                  （ <el-button @click.native="handleImport(1)" type="text">
                    下载 <i class="fa fa-download"></i>
                  </el-button>标准格式后上传 ）
                </span>
              </el-upload>
            </div>
          </div>
          <el-table
            :data="form.course"
            size="mini" class="four-major-form-course"
            style="width: 100%">
            <el-table-column
              label="拟开设课程名称"
              align="center"
              min-width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.course_name" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="授课教师信息"
              align="center">
                <el-table-column
                  label="姓名"
                  align="center"
                  width="90">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.docent_name" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="职称"
                  align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.docent_title" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="职工号/身份证号"
                  align="center"
                  min-width="100">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.docent_idcard" placeholder="请输入" :minlength="8" :maxlength="18"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="工作单位"
                  align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.docent_unit" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
              label="学时"
              align="center"
              width="70">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.course_hour" :min="0" :controls="false" :precision="0" style="width: 100%"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="70">
              <template slot-scope="scope">
                <el-button type="text" @click="courseDO(scope.$index, 1)">新增</el-button>
                <el-button v-if="form.course.length > 1" type="text" @click="courseDO(scope.$index, 0)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="`${infoData.status}` === '2'" label="修改原因：" :rules="[{ required: true}]">
          <el-input v-model="form.cause" type="textarea" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item class="four-align-center">
          <el-button v-if="`${this.Query.type}` !== '0' || infoData.status === 0" type="primary" @click="handleTrue(0)">保 存</el-button>
          <el-button type="primary" @click="handleTrue(1)">保存并提交</el-button>
          <el-button type="" @click="goBack">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="导入数据错误"
      :visible.sync="dialogVisibleError"
      center append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px">
      <el-table :data="errorData" border style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column header-align="center" label="导入数据具体说明">
          <template slot-scope="scope">
            <strong>第 {{ scope.row.row }} 行</strong>
            ，{{ scope.row.error_msg }} 。
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const urls = {
  add: '/yxb/classmajor/save',
  update: '/yxb/classmajor/update',
  info: '/yxb/classmajor/info',
  major: '/yxb/classmajor/majorlist',
  yxb_area: '/yxb/classmajor/area',
  area: '/admin/provinces',
  import: '/yxb/classmajor/impbatch'
}

export default {
  data () {
    return {
      loading: false,
      form: {
        college_id: null,
        major_id: null,
        province_id: null,
        city_id: null,
        plan_enroll_num: 0,
        plan_open_stime: null,
        plan_open_etime: null,
        master_approval_time: null,
        has_five_master_graduate: null,
        has_doctor: null,
        has_three_master: null,
        attachment: '',
        course: [
          {
            course_name: '',
            course_hour: 0,
            docent_name: '',
            docent_title: '',
            docent_idcard: '',
            docent_unit: ''
          }
        ],
        cause: ''
      },
      site: [],
      uidIndex: 0,
      optionsSite: [],
      headers: {},
      fileList: [],
      Query: {},
      collegeList: [],
      majorList: [],
      pickerOptionsS: {
        disabledDate: time => {
          return time.getTime() <= (Date.now()-(24 * 60 * 60 * 1000));
        }
      },
      pickerOptionsE: {
        disabledDate: time => {
          return time > (new Date(this.form.plan_open_stime).getTime() + (18 * 31 * 24 * 60 * 60 * 1000))
        }
      },
      infoData: {},
      dialogVisibleError: false,
      errorData: [],
    }
  },
  computed: {
    ...mapState([
      'URL',
      'uploadExcelUrl1',
      'uploadExcelUrl',
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
              const Data = data.data.data
              this.infoData = Data
              for (let key in this.form) {
                if (Data.hasOwnProperty(key)) {
                  if (key !== 'province_id' && key !== 'city_id' && key !== 'cause') {
                    this.$set(this.form, key, Data[key])
                  }
                }
              }
              if (Data.province_id && Data.city_id) {
                this.site = [Data.province_id, Data.city_id]
                this.siteItemChange([Data.province_id])
              }
              if (Data.college_id) {
                this.getMejor(Data.college_id)
              }
              if (Data.attachment) {
                this.fileList = [
                  {
                    name: '附件',
                    url: Data.attachment
                  }
                ]
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
    handleTrue (val) {
      if (this.site && this.site.length) {
        this.$set(this.form, 'province_id', this.site[0])
        this.$set(this.form, 'city_id', this.site[1])
      }
      if (!this.form.college_id) {
        this.$message.warning('请选择办班学院！')
        return false
      }
      if (!this.form.major_id) {
        this.$message.warning('请选择办班专业！')
        return false
      }
      if (!this.form.province_id || !this.form.city_id) {
        this.$message.warning('请选择办班地区！')
        return false
      }
      if (!this.form.plan_enroll_num) {
        this.$message.warning('请输入计划招生数！')
        return false
      }
      if (!this.form.plan_open_stime) {
        this.$message.warning('请选择计划办班开始日期！')
        return false
      }
      if (!this.form.plan_open_etime) {
        this.$message.warning('请选择计划办班截止日期！')
        return false
      }
      if (new Date(this.form.plan_open_etime).getTime() > (new Date(this.form.plan_open_stime).getTime() + (18 * 31 * 24 * 60 * 60 * 1000))) {
        this.$message.warning('计划办班截止日期距离开始日期只能在18个月内！')
        return false
      }
      if (!this.form.master_approval_time) {
        this.$message.warning('请选择硕士点批准时间！')
        return false
      }
      if (!(this.form.has_five_master_graduate === 0 || this.form.has_five_master_graduate === 1)) {
        this.$message.warning('请选择是否已有五届硕士毕业生！')
        return false
      }
      if (!(this.form.has_doctor === 0 || this.form.has_doctor === 1)) {
        this.$message.warning('请选择所在的一级学科是否有一个及以上博士点！')
        return false
      }
      if (!(this.form.has_three_master === 0 || this.form.has_three_master === 1)) {
        this.$message.warning('请选择所在的一级学科是否有三个及以上硕士点！')
        return false
      }
      const Course = this.form.course.filter(item => {
        return item.course_name || item.docent_name || item.docent_title || item.docent_idcard || item.docent_unit || item.course_hour
      })
      if (Course.length) {
        const haveE = Course.some(item => !item.course_name)
        if (haveE) {
          this.$message.warning('请完善授课方案的课程名称！')
          return false
        }
      } else {
        this.$message.warning('请添加授课方案！')
        return false
      }
      if (this.infoData.status === 2 && !this.form.cause) {
        this.$message.warning('修改原因不能为空！')
        return false
      }
      const Obj = Object.assign({}, JSON.parse(JSON.stringify(this.form)), {
        course: Course
      })
      if (`${this.Query.type}` === '0') {
        Object.assign(Obj, {
          id: this.Query.id || null,
        })
        if (this.infoData.status === 0) {
          Object.assign(Obj, {
            status: val
          })
        }
      } else {
        Object.assign(Obj, {
          status: val
        })
      }
      this.loading = true
      if (this.loading) {
        this.axiosHttp({
          url: `${this.Query.type}` === '0' ? urls.update : urls.add,
          type: 'post',
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success({
              message: '提交成功！'
            })
            this.goBack()
          } else {
            this.$notify.error({
              message: data.data.error,
              onClose: () => {
                this.loading = false
              }
            })
          }
        })
      }
    },
    siteItemChange (val) {
      this.optionsSite.forEach((item, index) => {
        if (item['id'] === val[0]) {
          this.uidIndex = index
        }
      })
      this.getYxbArea(val[0])
    },
    changeCollege (val) {
      this.$set(this.form, 'major_id', null)
      if (val) {
        this.majorList = []
        this.getMejor(val)
      }
    },
    courseDO (index, type) {
      if (type) {
        this.form.course.push(this.$options.data().form.course[0])
      } else {
        this.form.course.splice(index, 1)
      }
    },
    beforeUpload (file) {
      const isTYPE = file.type === 'application/pdf' !== -1
      const isLtM = file.size / 1024 / 1024 < 8
      if (!isTYPE) {
        this.$message.error('上传文件只能是 PDF 格式!')
      }
      if (!isLtM) {
        this.$message.error('上传文件大小不能超过 8MB!')
      }
      return isTYPE && isLtM
    },
    handleSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form, 'attachment', response.data.code)
      } else {
        this.$notify.error({
          title: '错误',
          message: response.error
        })
        this.$set(this.form, 'attachment', '')
        this.fileList = []
      }
    },
    handleRemove (file, fileList) {
      this.$set(this.form, 'attachment', '')
      this.fileList = []
    },
    handlePreview (val) {
      window.open(`${this.lookUrl}/${val.url}`)
    },
    getYxbArea (upid = 0, type = 1) {
      this.axiosHttp({
        url: urls.area,
        data: {
          pid: upid
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Arr = data.data.data.list
          if (upid) {
            let list = Arr.map(item => {
              item.label = item['name']
              return item
            })
            this.$set(this.optionsSite, this.uidIndex, Object.assign(this.optionsSite[this.uidIndex], { cities: list }))
          } else {
            if (!type) {
              this.getInfo(this.Query.id - 0)
            }
            this.optionsSite = Arr.map(item => {
              item.label = item['name']
              item.cities = []
              return item
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.data.error
          })
        }
      })
    },
    getCollege () {
       this.getStructures({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data
          Data.forEach(item => {
            if (item.level === 1) {
              this.collegeList.push(item)
            }
          })
        }
      })
    },
    getMejor (ID = null) {
       this.axiosHttp({
         url: urls.major,
         data: {
           college_id: ID
         }
      }).then(data => {
        if (data.data.code === 200) {
          this.majorList = data.data.data
        }
      })
    },
    handleSuccessE (response, file) {
      if (response.code === 200) {
        this.axiosHttp({
          url: urls.import,
          type: 'post',
          data: {
            code: response.data.code
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: '上传成功'
            })
            this.$set(this.form, 'course', data.data.data.map(item => {
              return {
                course_name: item.course_name || '',
                course_hour: item.course_hour || 0,
                docent_name: item.docent_name || '',
                docent_title: item.docent_title || '',
                docent_idcard: item.docent_idcard || '',
                docent_unit: item.docent_unit || ''
              }
            }))
          } else {
            if (typeof data.data.error === "string") {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            } else {
              const Data = data.data.error
              for (let key in Data) {
                this.errorData.push(Data[key])
              }
              this.dialogVisibleError = true
            }
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleImport (type) {
      window.open(`${this.URL}/static/file/teachers.xls?randomtime=${new Date().getTime()}`)
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  created () {
    this.Query = this.$route.query
    if (this.userInfo.role === 1) {
      this.getCollege()
    } else {
      if (this.userInfo.collegeId) {
        this.getMejor(this.userInfo.collegeId)
        if (`${this.Query.type}` === '1') {
          this.$set(this.form, 'college_id', this.userInfo.collegeId)
        }
      }
    }
    if (this.$cookie.get('headers')) {
      this.headers = JSON.parse(this.$cookie.get('headers'))
    }
    if (`${this.Query.type}` === '1') {
      this.getYxbArea()
    } else {
      this.getYxbArea(0, 0)
    }
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

.aaa {
  display: inline-block;
}
</style>
