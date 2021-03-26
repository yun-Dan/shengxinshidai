<template>
  <div v-loading="loading" v-cloak>
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button icon="el-icon-menu" @click.native="handleSearch(0)">全部</el-button>
          <el-button v-if="Current.meta.four_id === 1 && userInfo.role === 1" icon="el-icon-download" type="warning" plain @click="handleExcel">导出Excel</el-button>
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
              <el-input v-model.trim="getForm.keywords" placeholder="办班编号、专业名称" clearable class="input-with-select"
                style="width: 210px">
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="class_number" label="办班编号"></el-table-column>
          <el-table-column align="center" prop="major_name" label="办班专业"></el-table-column>
          <el-table-column v-if="userInfo.role === 1" align="center" prop="college_name" label="办班学院"></el-table-column>
          <el-table-column align="center" prop="province_name" label="办班地区" min-width="50">
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
          <el-table-column v-if="Current.path.indexOf('/home/project/index/') !== -1" align="center" prop="already_per_num" label="已招生数" min-width="60"></el-table-column>
          <el-table-column align="center" label="计划办班时间">
            <template slot-scope="scope">
              <div>{{ scope.row.plan_open_stime }}</div>
              <div>至</div>
              <div>{{ scope.row.plan_open_etime }}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="Current.meta.Approve_field" align="center" label="待审核数">
            <template slot-scope="scope">
              <span :class="`${scope.row[Current.meta.Approve_field] ? 'warning' : 'info'}`">
                {{ scope.row[Current.meta.Approve_field] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="140px">
            <template slot-scope="scope">
              <el-button v-if="Current.meta.four_id === 1 && userInfo.role !== 1"
              type="text" size="mini" @click="handleFour(Current.meta.four_id, scope.row)">新增项目</el-button>
              <el-button type="text" size="mini" @click="handleEnter(scope.row)">{{ Current.meta.four_title }}管理</el-button>
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import fourRoutes from '@/router/four.js'

const urls = {
  list: '/yxb/classmajor/list',
  excel: '/yxb/projects/yxb_tj'
}

export default {
  data () {
    return {
      loading: false,
      getForm: {
        keywords: '',
        college_id: null,
        status: 3,
        sort: null,
        ispub: null, 
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      Current: {
        path: '',
        meta: {}
      },
      collegeList: [],
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
      if (sessionStorage.getItem("PRO_IS_PXLX")) {
        this.$set(this.getForm, "ispub", 0);
      } else if (this.$route.query.ispub == -1) {
        sessionStorage.setItem("PRO_IS_PXLX", 1)
        this.$set(this.getForm, "ispub", 0);
      }
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
            sessionStorage.removeItem('class_majorWrap')
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
      if (type === 0) {
        sessionStorage.removeItem("PRO_IS_PXLX");
        Object.assign(this.getForm, this.$options.data().getForm, {
          sort: this.Current.meta.Approve_field || null
        })
        this.$router.push(this.$route.path)
      }
      this.initData()
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
      })
    },
    handleEnter (val) {
      this.localGetForm()
      const Path = this.$route.path
      this.$router.push({
        path: Path.substring(0, Path.lastIndexOf('/')),
        query: {
          class_major_id: val && val.id,
          class_major_name: val && val.major_name,
          class_major_number: val && val.class_number
        }
      })
    },
    handleFour (four_id, val) {
      this.localGetForm()
      if (four_id === 1) {
        this.$router.push({
          path: '/home/project/add',
          query: {
            class_major_id: val && val.id,
            major_name_fixed: val && val.major_name,
            prefix: `${new Date().getFullYear() + 1}年中国人民大学${val.college_name}${val.major_name}专业在职课程培训班`,
            area: `${val.province_id},${val.province_name},${val.city_id},${val.area_name}`
          }
        })
      }
    },
    changeRoute () {
      const routePath = this.$route.path
      this.Current = fourRoutes.filter(item => item.path === routePath)[0] || {}
      this.$set(this.getForm, 'sort', this.Current.meta.Approve_field || null)
      this.initData()
    },
    localGetForm () {
      sessionStorage.setItem('class_majorWrap', JSON.stringify(this.getForm))
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
    handleExcel () {
      window.open(`${this.URL}${urls.excel}?authkey=${JSON.parse(this.$cookie.get('headers')).authkey}&sessionid=${JSON.parse(this.$cookie.get('headers')).sessionid}`)
    }
  },
  mounted () {
    
    this.getCollege()
  },
  beforeRouteEnter (to, from ,next) {
    next(vm => {
      if (to.path === `${from.path}/wrap`) {
        const str = sessionStorage.getItem('class_majorWrap')
        if (str) {
          vm.getForm = JSON.parse(str)
          vm.changeRoute()
        }
      } else {
        vm.getForm = vm.$options.data().getForm
        vm.changeRoute()
      }
    })
  }
}
</script>

<style scoped>
.warning{
  font-weight: 600;
}
</style>
