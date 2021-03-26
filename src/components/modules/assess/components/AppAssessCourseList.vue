<template>
  <div class="app-assess-course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="text-align: center">
          <span class="assess-course-list-title">{{Pro_name }}</span>
        </div>
        <div class="fr" style="padding-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返回</el-button>&nbsp;
        </div>
      </div>
      <div class="app-assess-course-list-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="55"></el-table-column>
          <el-table-column align="center" prop="cou_name" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="teacher" label="教师姓名"></el-table-column>
          <el-table-column align="center" label="评分">
            <template slot-scope="scope">
              <span
                v-if="scope.row.answerts_list&&scope.row.answerts_list.pingfenjieguo"
              >{{ scope.row.answerts_list.zongpingjunfen }} 分</span>
              <span v-else>未提交问卷</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="考核结果">
            <template slot-scope="scope">
              <template v-if="scope.row.answerts_list&&scope.row.answerts_list.pingfenjieguo">
                <span v-if="scope.row.answerts_list.pingfenjieguo===1" style="color: #f56c6c">不合格</span>
                <span v-if="scope.row.answerts_list.pingfenjieguo===2" style="color: #e6a23c">一般</span>
                <span v-if="scope.row.answerts_list.pingfenjieguo===3" style="color:#000;">良好</span>
                <span v-if="scope.row.answerts_list.pingfenjieguo===4">优秀</span>
                <span v-if="scope.row.answerts_list.pingfenjieguo===5">:暂时没有该评分的评级</span>
              </template>
              <span v-else>未提交问卷</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评估率">
            <template slot-scope="scope">
              <span
                v-if="scope.row.answerts_list&&scope.row.answerts_list.pingfenjieguo"
              >{{ scope.row.answerts_list.pinggulv }} %</span>
              <span v-else>未评估</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <template v-if="userInfo.auth_question || userInfo.role === 1">
                <el-button type="text" @click="handleExam(scope.row)">试题管理</el-button>
              </template>
              <template v-else>
                <div>
                  <el-button type="text" @click.native="handleCode(scope.row)">生成问卷二维码</el-button>
                </div>
                <div>
                  <el-button type="text" @click.native="lookSend(scope.row)">查看已发送人员</el-button>
                </div>
                <div>
                  <el-button
                    type="text"
                    v-if="scope.row.answerts_list&&scope.row.answerts_list.pingfenjieguo"
                    @click.native="lookResult(scope.row)"
                  >问卷调查结果</el-button>
                </div>
              </template>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--声明提示-->
    <el-dialog title="重要声明" :visible.sync="dialogVisible" width="30%" center append-to-body>
      <div
        class="assess-table-dialogVisible"
      >请确认学员信息已准确导入。未提前进行微信注册和项目关联的学员，如果填写问卷时登记的信息与提前导入系统的名单不一致，将无法成功提交答卷。 同一个培训班中，同名同姓的学员，必须通过手机号区分。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCodeTrue">确认无误</el-button>
        <el-button @click="handleStudents">检查名单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-assess-course-list",
  data() {
    return {
      Pro_name: "",
      getForm: {
        pro_id: 0,
        anstypeid: 2,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      dialogVisible: false,
      proData: {}
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getAssessCourse"]),
    initData() {
      const ID = this.$route.params.id;
      this.$set(this.getForm, "pro_id", ID);
      this.getAssessCourse({
        data: this.getForm
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
    lookSend(val) {
      // 查看已发送人员列表
      const obj = {
        pro_id: val.pro_id,
        cou_id: val.cou_id,
        // anstypeid:2,
        antype: 2 // 1项目 2 课程
      };
      sessionStorage.setItem("lookSend", JSON.stringify(obj));
      this.$router.push({
        path: "/home/assess/course/send",
        query: {
          pro_name: this.Pro_name
        }
      });
      // this.$router.push('/home/assess/course/send');
    },
    lookResult(val) {
      // 查看调查问卷结果
      // 旧的课程评估结果
      // sessionStorage.setItem('lookResult',JSON.stringify(val));
      // this.$router.push({
      //     path: '/home/assess/course/result',
      //     query: {
      //         pro_name: this.Pro_name
      //     }
      // });
      // 新的课程评估结果
      this.$router.push({
        name: "AppAssessCourseExamResult",
        query: {
          pro_name: val.pro_name,
          pro_id: val.pro_id,
          pro_code: val.pro_code,
          cou_name: val.cou_name,
          course_id: val.cou_id,
          pre_page: this.$route.params.id,
          paper_id: val.paper_id
        }
      });
    },
    handleCode(val) {
      this.proData = val;
      this.dialogVisible = true;
    },
    handleCodeTrue() {
      this.$router.push({
        path: "/home/assess/course/code",
        query: {
          cou_id: this.proData.id,
          cou_name: this.proData.cou_name,
          pro_name: this.proData.pro_name,
          pro_code: this.proData.pro_code
        }
      });
    },
    handleStudents() {
      this.$router.push({
        path: "/home/students/message/list/" + this.proData.pro_id,
        query: {
          pro_name: this.Pro_name
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
    },
    handleExam(val) {
      this.$router.push({
        name: "AppAssessCourseExam",
        query: {
          pro_name: val.pro_name,
          pro_id: val.pro_id,
          pro_code: val.pro_code,
          cou_name: val.cou_name,
          course_id: val.cou_id,
          pre_page: this.$route.params.id
        }
      });
    }
  },
  created() {
    this.keepGetFormPublic(1);
    this.initData();
  },
  beforeMount() {
    this.Pro_name = this.$route.query.pro_name;
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>

<style scoped>
.assess-course-list-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
</style>
