<template>
  <div class="four-class-index" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button @click.native="handleUpdate(1)" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button icon="el-icon-menu" @click.native="handleSearch('all')">全部</el-button>
          <el-button v-if="userInfo.role === 1" icon="el-icon-download" type="warning" plain @click="handleExcel">导出Excel</el-button>
          <el-button v-if="selectionArr.length" type="primary" plain icon="el-icon-circle-check" @click="handleCheck">批量初审</el-button>
        </el-button-group>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item v-if="userInfo.role === 1">
              <el-select v-model="getForm.college_id" placeholder="请选择" @change="handleSearch">
                <el-option label="-- 不限学院 --" :value="null"></el-option>
                <el-option v-for="(item,index) in collegeList"
                  :label="item.name" :value="item.id" :key="index" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.status" placeholder="请选择" @change="handleSearch">
                <el-option label="-- 不限状态 --" :value="null"></el-option>
                <el-option v-for="(item, key) in statusObj"
                  :label="item.label" :value="item.value" :key="key" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="getForm.keywords" placeholder="办班编号、办班专业" clearable class="input-with-select"
                style="width: 210px">
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="users-college-main" v-cloak>
        <el-table :data="tableData" :default-expand-all="true"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="expand" width="1">
            <template slot-scope="scope">
              <div v-if="scope.row.history && scope.row.history.length" class="users-college-main-expand">
                <div v-for="(item, index) in scope.row.history" :key="index" class="users-college-main-expand-item">
                  <span v-if="item.his_type == 1" class="danger">未通过原因【{{ item.create_time | TimestampChangeFilter }}】：</span>
                  <span v-else class="success">修改回复【{{ item.create_time | TimestampChangeFilter }}】：</span>
                  <span>{{ item.content }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="userInfo.role === 1 && userInfo.is_yjsy || userInfo.role === 1"
           type="selection" width="48" align="center" :selectable="selectable"></el-table-column>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="class_number" label="办班编号"></el-table-column>
          <el-table-column align="center" prop="major_name" label="办班专业"></el-table-column>
          <el-table-column v-if="userInfo.role === 1" align="center" prop="college_name" label="办班学院"></el-table-column>
          <el-table-column align="center" prop="province_name" label="办班地区" min-width="60">
            <template slot-scope="scope">
              <template v-if="userInfo.is_yjsy && scope.row.province_name">
                <template v-if="scope.row.province_name.indexOf('省') !== -1">
                  {{ scope.row.province_name }} <span v-if="scope.row.area_name">/ {{ scope.row.area_name }}</span>
                </template>
                <template v-else>
                  {{ scope.row.province_name }}
                </template>
              </template>
              <template v-else>
                {{ scope.row.province_name }} <span v-if="scope.row.area_name">/ {{ scope.row.area_name }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="plan_enroll_num" label="计划招生数" min-width="60"></el-table-column>
          <el-table-column align="center" prop="plan_open_stime" label="计划办班时间">
            <template slot-scope="scope">
              <div>{{ scope.row.plan_open_stime }}</div>
              <div>至</div>
              <div>{{ scope.row.plan_open_etime }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="master_approval_time" label="硕士点批准时间"></el-table-column>
          <el-table-column align="center" prop="has_five_master_graduate" label="是否已有五届硕士毕业生" min-width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.has_five_master_graduate > 0" class="success">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="has_doctor" label="所在的一级学科是否有一个及以上博士点" min-width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.has_doctor > 0" class="success">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="has_three_master" label="所在的一级学科是否有三个及以上硕士点" min-width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.has_three_master > 0" class="success">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态" min-width="40">
            <template slot-scope="scope">
              <span v-if="statusObj[scope.row.status]" :class="statusObj[scope.row.status].type">
                {{ statusObj[scope.row.status].label }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <div class="four-class-index-btns">
                <el-button v-if="userInfo.role === 1 && userInfo.is_yjsy || userInfo.role === 1"
                  type="text" size="mini" @click.native="handleInfo(scope.row, 1)">{{scope.row.status === 1 ? '初审' : '重新初审'}}</el-button>
                <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">查看</el-button>
                <el-button
                  v-if="userInfo.role === 1 && !userInfo.is_yjsy
                  || userInfo.role === 2 && (scope.row.status === 0 || scope.row.status === 2)"
                  type="text" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
                <el-button
                  v-if="userInfo.role === 1 && !userInfo.is_yjsy
                  || userInfo.role === 2 && (scope.row.status === 0 || scope.row.status === 2)"
                  type="text" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
                <el-button v-if="userInfo.role === 2 && scope.row.status === 3" type="text" size="mini" @click.native="handleCopy(scope.row)">复制</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getForm.page"
        :page-size="getForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="批量初审办班专业"
      :visible.sync="checkVisible"
      width="500px" center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div>
        <el-form label-width="110px">
          <el-form-item label="初审结果：" :rules="[{required: true}]">
            <el-radio-group v-model="checkForm.status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="checkForm.status === 2" label="不通过原因：" :rules="[{required: true}]">
            <el-input type="textarea" :rows="2" placeholder="请输入初审不通过原因" v-model="checkForm.cause"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckTrue" :loading="checkLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

const urls = {
  list: '/yxb/classmajor/list',
  delete: '/yxb/classmajor/del',
  yxb_area: '/yxb/classmajor/area',
  checkS: '/yxb/classmajor/batchUpStatus',
  copy: '/yxb/classmajor/copysave',
  excel: '/yxb/classmajor/excel'
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

import { mapState, mapActions } from 'vuex'
export default {
  name: 'four-class-index',
  data() {
    return {
      loading: false,
      getForm: {
        keywords: '',
        college_id: null,
        province: null,
        status: null,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      collegeList: [],
      provincesList: [],
      statusObj: status,
      selectionArr: [],
      checkVisible: false,
      checkLoading: false,
      checkForm: {
        status: 3,
        cause: '',
        class_major_id: []
      },
    }
  },
  computed: {
    ...mapState(['userInfo', 'URL'])
  },
  methods: {
    ...mapActions([
      'axiosHttp',
      'getStructures'
    ]),
    initData() {
      this.loading = true
      if (this.loading) {
        this.axiosHttp({
          url: urls.list,
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data
            this.tableData = Data.list
            this.total = Data.dataCount
            this.loading = false
            sessionStorage.removeItem('class_majorIndex')
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      }
    },
    handleSearch(type) {
      if (type === 'all') {
        Object.assign(this.getForm, this.$options.data().getForm)
      }
      this.$set(this.getForm, "page", 1)
      this.initData()
    },
    handleInfo (val, type = 0) {
      this.$router.push({
        path: '/home/class_major/info',
        query: {
          type: type,
          id: val && val.id,
          StrList: JSON.stringify(this.getForm)
        }
      })
    },
    handleUpdate(val) {
      const query = {
        type: val === 1 ? 1 : 0,
        StrList: JSON.stringify(this.getForm)
      }
      if (val && val.id) {
        Object.assign(query, {
          id: val.id
        })
      }
      this.$router.push({
        path: '/home/class_major/form',
        query: query
      })
    },
    handleDelete(val) {
      this.$confirm('是否删除该条办班数据，删除后将无法恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.axiosHttp({
          url: urls.delete,
          type: 'post',
          data: {
            id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: 'success',
              message: data.data.data
            })
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCopy (val) {
      this.$confirm('是否“复制”该条办班数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.axiosHttp({
          url: urls.copy,
          type: 'post',
          data: {
            id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      })
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, 'limit', pageSize)
      this.initData()
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, 'page', currentPage)
      this.initData()
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0
      });
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
      });
    },
    getProvince () {
      this.axiosHttp({
        url: urls.yxb_area
      }).then(data => {
        if (data.data.code === 200) {
          this.provincesList = data.data.data
        }
      })
    },
    initGetForm () {
      const str = sessionStorage.getItem('class_majorIndex')
      if (str) {
        this.getForm = JSON.parse(str)
      }
    },
    selectable (row) {
      return row.status > 0
    },
    handleSelectionChange (val) {
      this.selectionArr = val
    },
    handleCheck () {
      Object.assign(this.checkForm, this.$options.data().checkForm)
      this.checkLoading = false
      this.checkVisible = true
    },
    handleCheckTrue () {
      if (this.checkForm.status == 2 && !this.checkForm.cause) {
        this.$message.warning('初审不通过原因不能为空！')
        return false
      }
      this.checkLoading = true
      if (this.checkLoading) {
        this.axiosHttp({
          url: urls.checkS,
          type: 'post',
          data: {
            class_major_id: this.selectionArr.map(item => item.id),
            status: this.checkForm.status,
            cause: this.checkForm.status == 2 ? this.checkForm.cause : ''
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('操作成功！')
            this.initData()
            this.checkVisible = false
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                this.checkLoading = false
              }
            })
          }
        })
      }
    },
    handleExcel () {
      window.open(`${this.URL}${urls.excel}?authkey=${JSON.parse(this.$cookie.get('headers')).authkey}&sessionid=${JSON.parse(this.$cookie.get('headers')).sessionid}`)
    }
  },
  created() {
    this.initGetForm()
    this.initData()
    this.getCollege()
  },
  beforeDestroy () {
    sessionStorage.removeItem('class_majorIndex')
  }
}
</script>

<style scoped>
.users-college-main-expand-item{
  font-size: 12px;
  line-height: 18px;
}
</style>
