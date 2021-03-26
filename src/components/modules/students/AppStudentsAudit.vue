<template>
  <div
    class="app-students-audit"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group>
            <el-button v-if="isYXB" @click="$router.push('/home/students/audit/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleSearch(true)" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch(false)">
          <el-form inline @submit.native.prevent>
            <template v-if="userInfo.role===1">
              <el-form-item>
                <el-select v-model="getForm.college" placeholder="请选择" @change="handleSelect">
                  <el-option label="-- 不限学院 --" :value="null"></el-option>
                  <el-option
                    v-for="(item,index) in collegeList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="getForm.structure" placeholder="请选择" @change="handleSelect">
                  <el-option label="-- 不限部门 --" :value="null"></el-option>
                  <el-option
                    v-for="(item,index) in structuresList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" @click.native="handleSearch(false)" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="students-message-main" v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%;margin-top: 0px"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号" width="100"></el-table-column>
          <el-table-column align="center" prop="college" label="所在学院"></el-table-column>
          <el-table-column align="center" prop="user" label="项目联系人" width="100"></el-table-column>
          <el-table-column align="center" label="举办时间">
            <template slot-scope="scope">
              <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click.native="handleCheck(scope.row)">学员审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="5"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-students-message",
  data() {
    return {
      loading: false,
      getForm: {
        college: null,
        structure: null, // 部门
        sea_field: "pro_code", //关键词字段(查询条件)：pro_name项目,contract_code协议编号,user联系人,tel联系方式,dwmc辅助单位名称
        keywords: "",
        source: "2", //学员数据来源(1批量导入，2自行添加(学员审核项目列表展示自行添加的学员数据))
        fields: [
          "pro_name",
          "id",
          "college",
          "pro_code",
          "px_start_time",
          "px_end_time",
          "user"
        ],
        pflag: "2",
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      collegeList: [],
      structuresList: [],
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getStructures", "getProjectPersons"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getProjectPersons({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            this.total = Data.dataCount;
            this.loading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleSearch(reset = false) {
      // reset是否重置：true是、false否
      if (reset) {
        Object.assign(this.getForm, this.$options.data().getForm);
      } else {
        if (!this.getForm.keywords) {
          this.$message({
            message: "请输入搜索关键字！",
            type: "warning"
          });
          return false;
        }
      }
      this.initData();
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleCheck(val) {
      this.$router.push({
        path: "/home/students/check/" + val.id,
        query: {
          pro_name: val.pro_name
        }
      });
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
    this.initData();
  },
  beforeMount () {
    if (this.userInfo.role === 1) {
      this.getStructures({
        data: {
          // level:1
        }
      }).then(data => {
        if (data.data.code === 200) {
          data.data.data.forEach(item => {
            if (item.level === 1) {
              this.collegeList.push(item);
            } else if (item.level === 2) {
              this.structuresList.push(item);
            }
          });
        }
      });
    }
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>
