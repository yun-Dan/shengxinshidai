<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0)"  >
    <el-card class="box-card">
      <div slot="header" v-cloak>
        <div class="clearfix query-box" @keyup.enter="initData">
          <el-form class="fr" inline @submit.native.prevent>
            <el-form-item>
              <el-button type="primary" style="margin-right:8px"  @click="handleUpdateMore()">批量审核</el-button>
              <el-select v-model="getForm.status" placeholder="-- 审核状态 --" clearable @change="initData">
                <el-option
                  v-for="item in Status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form class="fl" inline @submit.native.prevent>
            <el-form-item v-if="userInfo.role == 2">
              <el-button-group>
                <el-button type="primary" @click="handleUpdate(1)">新增申请</el-button>
                <el-button type="warning" :disabled="!tableData.length" @click="handlePrint">打印申请表</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{ backgroundColor: '#fafafa' }"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column align="center" label="序号" width="80" type="index">
			<template slot-scope="scope">{{ scope.$index+(pageNum-1)*10+1 }}</template>
		  </el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号" min-width="60px"></el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称" min-width="70px"></el-table-column>
          <el-table-column align="center" label="举办时间" width="90px">
            <template slot-scope="scope">
              <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="320px">
            <template slot="header">
              <el-table :data="[{}]" border
                size="mini" :show-header="false" style="width: 100%">
                <el-table-column align="center" width="90">入校时间</el-table-column>
                <el-table-column align="center" width="90">离校时间</el-table-column>
                <el-table-column align="center" min-width="40">入校人数</el-table-column>
                <el-table-column align="center" min-width="40">接种疫苗人数</el-table-column>
                <el-table-column align="center" min-width="60">上课地点</el-table-column>
                <el-table-column align="center" min-width="60">备注</el-table-column>
              </el-table>
            </template>
            <template slot-scope="scope0">
              <el-table :data="scope0.row.enrolled" :show-header="false" border
                size="mini" :header-cell-style="{ backgroundColor: 'oldlace' }" style="width: 100%">
                <el-table-column align="center" prop="tj_time" width="90">
                  <template slot-scope="scope">{{ scope.row.tj_time | TimestampChangeFilter }}</template>
                </el-table-column>
                <el-table-column align="center" prop="js_time" width="90">
                  <template slot-scope="scope">{{ scope.row.js_time | TimestampChangeFilter }}</template>
                </el-table-column>
                <el-table-column align="center" prop="jtrs" min-width="40"></el-table-column>
                <el-table-column align="center" prop="jzym" min-width="40"></el-table-column>
                <el-table-column align="center" prop="skdd" min-width="60"></el-table-column>
                <el-table-column align="center" prop="bz" min-width="60">
                  <template slot-scope="scope">{{scope.row.bz || '-'}}</template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="80">
            <template slot-scope="scope">
              <span v-if="Status[scope.row.status]" :class="Status[scope.row.status].class">
                {{ Status[scope.row.status].label }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80px">
            <template slot-scope="scope">
              <el-button v-if="userInfo.role == 2" type="text" size="mini" :disabled="scope.row.status != 2" @click="handleUpdate(0, scope.row)">编辑</el-button>
              <el-button v-if="userInfo.role == 1" type="text" size="mini" @click="handleUpdate(0, scope.row, true)">{{ scope.row.status == 1 ? '审核' : '重新审核' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
		<div style="text-align:right">
			<el-pagination style="margin-top:12px"  background layout="prev, pager, next" :total="total"
				@current-change="currentChangeHandler"
			></el-pagination>
		</div>
      </div>
    </el-card>
    <el-dialog title="入校申请" :visible.sync="dialogVisible" width="970px" append-to-body center>
      <div v-loading="dialogVisible_loading">
        <el-form label-position="top">
          <el-form-item label="项目名称" :required="!ischeck">
            <template slot="label">
              项目名称
              <template v-if="!ischeck">
                <span class="en-tip">（请输入</span>
                “<span class="danger">项目编号</span>”
                <span class="en-tip">检索相关项目！）</span>
              </template>
            </template>
            <span v-if="ischeck">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ Val.pro_name }}
              &nbsp;&nbsp;&nbsp;&nbsp;{{ Val.pro_code }}
            </span>
            <el-select v-else
              v-model="proid"
              filterable
              remote clearable
              reserve-keyword
              placeholder="请输入“项目编号”检索"
              :remote-method="remoteMethod"
              :loading="remoteloading"
              style="width: 90%">
              <el-option
                v-for="item in proList"
                :key="item.id"
                :value="item.id"
                :label="`${item.pro_name} ${item.pro_code}`">
                <span style="float: left">{{ item.pro_name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.pro_code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ischeck" label="举办时间">
            &nbsp;&nbsp;&nbsp;&nbsp;{{ Val.px_start_time | TimestampChangeFilter }} 至 {{ Val.px_end_time | TimestampChangeFilter }}
          </el-form-item>
          <el-form-item label="入校信息" :required="!ischeck">
            <template slot="label">
              入校信息
              <template v-if="!ischeck">
                <span class="en-tip"> （其中
                “<span class="danger">入校时间</span>”、“<span class="danger">入校人数</span>”、“<span class="danger">上课地点</span>”
                为必填项！）</span>
              </template>
            </template>
            <el-table
              :data="form.list" size="small"  :border="ischeck"
              style="width: 100%">
              <el-table-column
                label="入校时间"
                align="center"
                width="160px">
                <template slot-scope="scope">
                  <span v-if="ischeck">{{ scope.row.tj_time | TimestampChangeFilter }}</span>
                  <el-date-picker v-else
                    v-model="scope.row.tj_time"
                    type="date" :disabled="ischeck"
                    value-format="timestamp"
                    placeholder="选择日期"
                    style="width: 100%">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                label="离校时间"
                align="center"
                width="160px">
                <template slot-scope="scope">
                  <span v-if="ischeck">{{ scope.row.js_time | TimestampChangeFilter }}</span>
                  <el-date-picker v-else
                    v-model="scope.row.js_time"
                    type="date" :disabled="ischeck"
                    value-format="timestamp"
                    placeholder="选择日期"
                    style="width: 100%">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                label="入校人数"
                align="center"
                width="90px">
                <template slot-scope="scope">
                  <span v-if="ischeck">{{ scope.row.jtrs }}</span>
                  <el-input-number v-else v-model="scope.row.jtrs" :min="0" :controls="false" :precision="0" :disabled="ischeck" style="width: 100%"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="接种疫苗人数"
                align="center"
                width="100px">
                <template slot-scope="scope">
                  <span v-if="ischeck">{{ scope.row.jzym }}</span>
                  <el-input-number v-else v-model="scope.row.jzym" :min="0" :controls="false" :precision="0" :disabled="ischeck" style="width: 100%"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="上课地点"
                align="center"
                width="160px">
                <template slot-scope="scope">
                  <span v-if="ischeck">{{ scope.row.skdd }}</span>
                  <el-input v-else v-model="scope.row.skdd" placeholder="输入上课地点" :disabled="ischeck"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                align="center"
                min-width="160px">
                <template slot-scope="scope">
                  <span v-if="ischeck">{{ scope.row.bz }}</span>
                  <el-input v-else v-model="scope.row.bz" placeholder="备注" :disabled="ischeck"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!ischeck"
                label="操作"
                align="center"
                width="90px">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="modList(scope.$index)" :disabled="form.list.length == 1">删除</el-button>
                  <el-button type="text" size="mini" @click="modList(-1)">新增</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="ischeck" label="审核结果" required>
            <div style="padding-left: 2em">
              <el-radio-group v-model="checkForm.status">
                <el-radio :label="2">不通过</el-radio>
                <el-radio :label="3">通过</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item v-if="ischeck && checkForm.status === 2" label="不通过原因" required>
            <el-input type="textarea" :rows="2" v-model="checkForm.opinio"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleTrue">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { truncate } from 'fs';
const urls = {
  list: '/admin/enrolled_training',
  review: '/admin/enrolled_training/review',
  reviewall: '/admin/enrolled_training/reviewall',
  pro: '/admin/projects'
}
const Status = {
  1: {
    label: '待审核',
    class: 'warning',
    value: 1
  },
  2: {
    label: '不通过',
    class: 'danger',
    value: 2
  },
  3: {
    label: '通过',
    class: 'success',
    value: 3
  }
}
export default {
  data() {
    return {
      loading: false,
      getForm: {
        status: null
	  },
	  total:10,
	  pageNum:1,
      tableData: [],
      Status,
      dialogVisible: false,
      dialogVisible_loading: false,
      proid: '',
      form: {
        pro_id: null,
        list: [
          {
            tj_time: null,
            jtrs: 0,
            skdd: '',
            jzym: 0,
            bz: '',
            js_time:''
          }
        ]
      },
      remoteloading: false,
      proList: [],
      key: 1,
      ischeck: false,
      Val: {},
      checkForm: {
        status: 3,
        opinio: ''
      },
      checkSelection:[]
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['axiosHttp']),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.axiosHttp({
          url: urls.list,
          data: this.getForm,
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
			const Data = data.data.data;
			console.log('😡😡😡😡',Data,this.pageNum)
            if (Data.list instanceof Array) {
				this.tableData = Data.list.slice((this.pageNum-1)*10,this.pageNum*10);
            }
			this.total=Data.list&&Data.dataCount||0
            this.loading = false
          }
        })
      }
    },
    handleUpdate (type, val, ischeck = false) {
      this.ischeck = ischeck
      this.Val = val || {}
      this.key = val ? 0 : 1
      this.proList = []
      if (!ischeck && val) this.remoteMethod(val.pro_code)
      this.$set(this.checkForm, 'status', 3)
      this.$set(this.checkForm, 'opinio', '')
      this.proid = val ? val.pro_id : null
      this.$set(this.form, 'pro_id', val ? val.pro_id : null)
      this.$set(this.form, 'list', val && val.enrolled ? val.enrolled.map(item => {
        return {
          tj_time: item.tj_time * 1000 || null,
          jtrs: item.jtrs,
          skdd: item.skdd,
          jzym: item.jzym,
          bz: item.bz
        }
      }) : [this.$options.data().form.list[0]])
      this.dialogVisible_loading = false
      this.dialogVisible = true
    },
    handleTrue () {
      if (this.ischeck) {
        if (!this.checkForm.opinio && this.checkForm.status === 2) {
          this.$message.warning('“不通过原因”不能为空！')
          return false
        }
      } else {
        if (this.proid) {
          this.$set(this.form, 'pro_id', this.proid)
        }
        const ok = this.form.list.every(item => {
          return item.tj_time && item.jtrs && item.skdd
        })
        if (!this.proid) {
          this.$message.warning('选择“项目名称”！')
          return false
        }
        if (!ok) {
          this.$message.warning('请完善“入校信息”！')
          return false
        }
      }
      this.dialogVisible_loading = true
      if (this.dialogVisible_loading) {
        this.axiosHttp({
          url: this.ischeck ? urls.review : urls.list + (this.key ? '' : `/${this.proid}`),
          type: (this.key || this.ischeck) ? 'post' : 'put',
          data: this.ischeck ? {
            pro_id: this.Val.pro_id,
            status: this.checkForm.status,
            opinio: this.checkForm.opinio
          } : Object.assign({
            uid: this.userInfo.uid
          }, this.form, {
            list: this.form.list.map(item => {
              return Object.assign({}, item, {
                tj_time: parseInt(item.tj_time / 1000)
              })
            })
          }),
          yxb: true
        }).then(data => {
          if (data.data.code == 200) {
            this.$message.success('操作成功！')
            this.dialogVisible = false
            this.initData()
          } else {
            this.$notify({
              type: 'error',
              message: data.data.error,
              onClose: () => {
                this.dialogVisible_loading = false
              }
            })
          }
        })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.remoteloading = true
        this.axiosHttp({
          url: urls.pro,
          data: {
            sea_field: 'pro_code',
            keywords: query,
            page: 1,
            limit: 9999999
          },
          yxb: true
        }).then(data => {
          if (data.data.code == 200) {
            this.proList = data.data.data.list||[]
            this.remoteloading = false
          } else {
            this.proList = []
          }
        })
      } else {
        this.proList = []
      }
    },
    modList (ind) {
      if (ind === -1) {
        this.form.list.push(this.$options.data().form.list[0])
      } else {
        this.form.list.splice(ind, 1)
      }
    },
    handlePrint () {
      console.log(this.getForm)
      this.$router.push({
        name: 'AppEnrolledPrint',
        query: {
          status: this.getForm.status,
          ran: this.$md5(`${this.getForm.status || null}`)
        }
      })
    },
    handleSelectionChange(val){
      this.checkSelection=val.map(item=>item.id)
      console.log(this.checkSelection)
    },
    handleUpdateMore(){
        this.axiosHttp({
          url: urls.reviewall ,
          type:'post' ,
          data: this.ischeck ? {
            pro_id: this.Val.pro_id,
            status: this.checkForm.status,
            opinio: this.checkForm.opinio
          } : Object.assign({
            uid: this.userInfo.uid
          }, this.form, {
            id: this.checkSelection
          }),
          yxb: true
        }).then(data => {
          if (data.data.code == 200) {
            this.$message.success('操作成功！')
            this.dialogVisible = false
            this.initData()
          } else {
            this.$notify({
              type: 'error',
              message: data.data.error,
              onClose: () => {
                this.dialogVisible_loading = false
              }
            })
          }
        })
	},
	currentChangeHandler($event){
		this.pageNum=$event;
		this.initData()
	}
  },
  created() {
    this.initData()
  }
}
</script>
<style scoped>
.en-tip{
  font-size: 12px;
  color: #8492a6;
}
</style>
