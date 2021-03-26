<template>
  <div class="app-curriculum-course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class style="text-align: center">
          <span class="curriculum-course-list-title">{{ title }}</span>
        </div>
        <div class="fr" style="padding-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
        </div>
      </div>
      <div class="curriculum-course-list-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (currentPage-1)*pageSize+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="cou_name" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="teacher" label="教师"></el-table-column>
          <el-table-column align="center" label="教师属性">
            <template slot-scope="scope">
              <span>{{ scope.row.is_inschool===1?'校内教师':'校外教师'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="job" label="职称"></el-table-column>
          <el-table-column align="center" prop="idnumber" label="职工号/身份证号"></el-table-column>
          <el-table-column align="center" prop="unit" label="单位名称"></el-table-column>
          <el-table-column align="center" prop="school_hours" label="学时"></el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-curriculum-course-list",
  data() {
    return {
      title: "",
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 20
    };
  },
  methods: {
    ...mapActions(["getCurriculumCourse"]),
    initData(id) {
      this.getCurriculumCourse({
        id: id,
        data: {
          pro_id: id,
          page: this.currentPage,
          limit: this.pageSize
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initData(this.$route.params.id);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.initData(this.$route.params.id);
    }
  },
  beforeMount() {
    if (sessionStorage.getItem("pro_name")) {
      this.title = sessionStorage.getItem("pro_name");
      let ID = this.$route.params.id;
      this.initData(ID);
    } else {
      // this.$router.push("/home/curriculum/course");
      this.$router.go(-1);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("pro_name");
  }
};
</script>

<style scoped>
.curriculum-course-list-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
</style>
