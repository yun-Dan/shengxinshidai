<template>
  <div class="app-adult-class-student-list">
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group>
            <el-button type icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
            <el-button @click.native="handleReset" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-input
                placeholder="搜索学生姓名"
                v-model="getForm.name"
                class="input-with-select"
                clearable
                style="width: 210px"
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" prop="avatar" label="头像"></el-table-column>
          <el-table-column align="center" prop="code" label="学号"></el-table-column>
          <el-table-column align="center" prop="name" label="姓名"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 1">男</span>
              <span v-else-if="scope.row.sex === 2">女</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
          <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
          <el-table-column align="center" label="学籍状态">
            <template slot-scope="scope">
              <span v-if="scope.row.student_status === 1">在读</span>
              <span v-else-if="scope.row.student_status === 2">休学</span>
              <span v-else-if="scope.row.student_status === 3">退学</span>
              <span v-else-if="scope.row.student_status === 4">结业</span>
              <span v-else-if="scope.row.student_status === 5">缓毕业</span>
              <span v-else-if="scope.row.student_status === 6">毕业</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="学位状态">
            <template slot-scope="scope">
              <span v-if="scope.row.degree_status === 0">无</span>
              <span v-else-if="scope.row.degree_status === 1">有</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- student_status 学籍状态。1:在读 2:休学 3:退学 4:结业 5:缓毕业 6:毕业 -->
              <!-- degree_status 学位状态 0: 无 1:有 -->
              <el-button type="text" @click="handleInfo(scope.row, 0)">查看</el-button>
              <!-- <el-button v-if="scope.row.student_status === 2" type="text" @click="handleInfo(scope.row, 1)">休学申请信息</el-button>
                            <el-button v-if="scope.row.student_status === 3" type="text" @click="handleInfo(scope.row, 1)">退学申请信息</el-button>
                            <el-button v-if="scope.row.student_status === 4 || scope.row.student_status === 5 || scope.row.student_status === 6" type="text" @click="handleInfo(scope.row, 1)">毕业申请信息</el-button>
              <el-button v-if="scope.row.degree_status === 1" type="text" @click="handleInfo(scope.row, 2)">学位申请信息</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total, prev, pager, next ,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-adult-class-student-list",
  data() {
    return {
      loading: false,
      getForm: {
        class: null, // 班级id
        code: "",
        name: "",
        page: 1,
        limit: 20
      },
      tableData: [{ id: 16, student_status: 4, degree_status: 1 }],
      total: 0,
      query: {
        class: null
      }
    };
  },
  methods: {
    ...mapActions(["getAdultClassStudentsList"]),
    initData() {
      // this.loading = true;
      if (this.loading) {
        this.getAdultClassStudentsList({
          data: this.getForm
        }).then(data => {
          if (data.data.code == 200) {
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
    handleReset() {
      Object.assign(this.getForm, this.$options.data().getForm, {
        class: this.query.class
      });
      this.initData();
    },
    handleSearch() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20,
        class: this.query.class
      });
      this.initData();
    },
    handleInfo(val, type) {
      // type 0个人信息、1学籍申请、2学位申请
      const query = {
        type,
        s_id: val.id
      };
      if (type === 1) {
        Object.assign(query, {
          s_s: val.student_status //学籍状态。1:在读 2:休学 3:退学 4:结业 5:缓毕业 6:毕业
        });
      } else if (type === 2) {
        Object.assign(query, {
          d_s: val.degree_status //学位状态 0: 无 1:有
        });
      }
      this.$router.push({
        name: "AppAdultClassStudentInfo",
        query: query
      });
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  created() {
    this.query = this.$route.query;
    if (this.query.class) {
      this.$set(this.getForm, "class", this.query.class);
      this.initData();
    }
  }
};
</script>
