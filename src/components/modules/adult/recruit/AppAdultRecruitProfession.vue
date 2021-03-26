<template>
  <div
    class="app-adult-recruit"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
    
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button
              v-if="userInfo.role !== 1"
              type="primary"
              icon="el-icon-plus"
              @click.native="handleUpdate(1)"
            >新增</el-button>
            <el-button
              @click.native="handleBack"
              :type="userInfo.role === 1 ? '' : ''"
              icon="el-icon-back"
            >返回</el-button>
            <el-button
              @click.native="handleReset"
              type="primary"
              :plain="userInfo.role === 1 ? false : true"
              icon="el-icon-menu"
            >全部</el-button>
          </el-button-group>
          <span style="font-size: 18px; line-height: 38px; padding-left: 10px">{{ year }}级专业管理</span>
        </div>
        <div class="fr" @keyup.enter="handleSearch">
          <el-select
            v-model="getForm.education"
            placeholder="请选择"
            style="width: 134px"
            @change="handleSearch"
          >
            <el-option key="层次" label=" -- 办学层次 -- " :value="null"></el-option>
            <el-option
              v-for="(item, key) in proConfig.education"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
          <el-input
            placeholder="专业名称"
            v-model.trim="getForm.keywords"
            class="input-with-select"
            clearable
            style="width: 190px"
          >
            <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="news inform-main" v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit + (scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="专业">
            <template slot-scope="scope">{{ scope.row.name }}（{{ scope.row.code }}）</template>
          </el-table-column>
          <el-table-column align="center" label="办学层次">
            <template slot-scope="scope">
              <span v-if="proConfig.education">{{ proConfig.education[scope.row.education] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="办学期限">
            <template slot-scope="scope">
              <div>{{ scope.row.date1 }}</div>
              <div>至</div>
              <div>{{ scope.row.date2 }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="url" label="办学地点"></el-table-column>
          <el-table-column align="center" prop="introduction" label="招生人数"></el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <!--审核状态：0待审核  1审核通过 2审核不通过-->
              <template v-if="scope.row.audit === 0">
                <span v-if="scope.row.is_status" class="warning">待审核</span>
                <span v-else class="info">未提交</span>
              </template>
              <span v-if="scope.row.audit === 1" class="success">审核通过</span>
              <span v-if="scope.row.audit === 2" class="danger">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220px">
            <template slot-scope="scope">
              <!--0没有 1审核成功  2审核失败-->
              <el-button type="text" @click.native="handleUpdate(0, scope.row, true)">查看</el-button>
              <el-button
                v-if="userInfo.role === 1"
                type="text"
                @click.native="handleUpdate(0, scope.row, true, true)"
              >{{ scope.row.audit === 0 ? '审核' : '重新审核' }}</el-button>
              <el-button
                v-if="scope.row.audit === 2 || userInfo.role === 1 || (userInfo.role === 2 && !scope.row.is_status)"
                type="text"
                @click.native="handleUpdate(0, scope.row)"
              >编辑</el-button>
              <el-button
                v-if="userInfo.role === 1 || (userInfo.role === 2 && !scope.row.is_status)"
                type="text"
                @click.native="handleDelete(scope.row.id)"
              >删除</el-button>
              <el-button
                v-if="scope.row.audit === 1 && scope.row.financial && scope.row.fee_url"
                type="text"
                @click.native="handleLink(scope.row.fee_url)"
              >查看收费地址</el-button>
              <el-button
                v-if="scope.row.audit === 1"
                type="text"
                @click.native="studentsList(scope.row)"
              >学生名单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, prev, pager, next ,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-adult-recruit",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        type: 1, // 1成人学历 2网络学历
        year: null,
        keywords: "",
        education: null, // 办学层次
        audit: null,
        page: 1,
        limit: 20
      },
      total: 0,
      tableData: [],
      typeConfig: {
        "1": "成人学历",
        "2": "网络学历"
      }
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getAdultRecruitList", "deleteAdultRecruit"]),
    initData() {
      this.$set(this.getForm, "year", this.year);
      this.loading = true;
      if (this.loading) {
        this.getAdultRecruitList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list || [];
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
    handleReset() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleUpdate(key, val, look = false, check = false) {
      // key：1新增、0编辑
      const Params = {
        "1": check, // is_check
        "2": [], // name
        "3": look, // look
        "4": key, // key
        "5": key === 1 ? 0 : val.id // id
      };
      if (look) {
        this.$router.push({
          name: "AppAdultRecruitInfo",
          query: Params
        });
      } else {
        this.$router.push({
          name: "AppAdultRecruitForm",
          query: Params
        });
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将彻底删除所选信息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteAdultRecruit({
            data: {},
            id: id
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleLink(url) {
      window.open(url);
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    },
    handleBack() {
      this.$router.go(-1);
    },
    studentsList(val) {
      this.$router.push({
        name: "AppAdultRecruitStudents",
        query: {
          id: val.id,
          name: val.name, // 专业
          education: val.education, // 办学层次key
          date1: val.date1,
          date2: val.date2,
          url: val.url,
          introduction: val.introduction // 招生人数
        }
      });
    }
  },
  created() {
    this.year = this.$route.query.y;
    if (this.year) {
      this.initData();
    }
  }
}
</script>
