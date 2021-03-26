<template>
  <div class="app-assess-table">
    <el-card class="card-box">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl" style="margin-bottom: 10px">
          <el-button-group>
            <el-button v-if="isYXB" @click="$router.go(-1)" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item v-if="userInfo.role===1">
              <el-select v-model="getForm.college" slot="prepend" placeholder="请选择">
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
              <el-select v-model="getForm.sea_field" slot="prepend" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="assess-project-main" v-cloak>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="55">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
          <el-table-column align="center" prop="pers_num" label="学员人数" width="120"></el-table-column>
          <template v-if="id===1">
            <el-table-column align="center" label="考核值">
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
                <!--<span v-if="scope.row.answerts_list&&scope.row.answerts_list.pingfenjieguo">{{ 100*Number(scope.row.answerts_list.pinggulv) }} %</span>-->
                <span
                  v-if="scope.row.answerts_list&&scope.row.answerts_list.pingfenjieguo"
                >{{ scope.row.answerts_list.pinggulv }} %</span>
                <span v-else>未评估</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="id===1" align="center" label="评估管理">
            <template slot-scope="scope">
              <el-switch
                v-if="userInfo.role===1"
                @change="evaluatedChange(scope.row)"
                v-model="scope.row.is_evaluated"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
              <span v-if="scope.row.is_evaluated" style="color: #409EFF">已评估</span>
              <span v-else style="color: #909399">未评估</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <template v-if="id===2">
                <el-button type="text" @click.native="handleCourse(scope.row)">课程列表</el-button>
              </template>
              <template v-if="id===1">
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
      <div class="page-box">
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
  name: "app-assess-table",
  data() {
    return {
      id: 0, // 2评估课程  1评估项目
      tableData: [],
      total: 0,
      getForm: {
        page: 1,
        limit: 20,
        sea_field: "pro_code",
        keywords: "",
        college: null,
        anstypeid: 0
      },
      collegeList: [],
      dialogVisible: false,
      proData: {},
      isYXB: false
    };
  },
  props: ["id-data"],
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getAssessProject",
      "assessProjectEvaluate"
    ]),
    initData() {
      this.$set(this.getForm, "anstypeid", this.idData);
      this.id = this.idData;
      this.getAssessProject({
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
    handleAll() {
      // 显示全部数据事件
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleCode(val) {
      this.proData = val;
      this.dialogVisible = true;
    },
    handleCodeTrue() {
      this.$router.push({
        path: "/home/assess/project/code",
        query: {
          pro_name: this.proData.pro_name,
          pro_code: this.proData.pro_code
        }
      });
    },
    handleStudents() {
      this.$router.push({
        path: "/home/students/message/list/" + this.proData.pro_id,
        query: {
          pro_name: this.proData.pro_name
        }
      });
    },
    lookSend(val) {
      // 查看已发送人员列表
      const obj = {
        pro_id: val.pro_id,
        // anstypeid:1,
        antype: 1 // 1项目 2 课程
      };
      sessionStorage.setItem("lookSend", JSON.stringify(obj));
      this.$router.push("/home/assess/project/send");
    },
    lookResult(val) {
      // 查看调查问卷结果
      sessionStorage.setItem("lookResult", JSON.stringify(val));
      this.$router.push("/home/assess/project/result");
    },
    handleCourse(val) {
      this.$router.push({
        path: "/home/assess/course/list/" + val.id,
        query: {
          pro_name: val.pro_name
        }
      });
    },
    handleSelect() {
      this.$set(this.getForm, "keywords", "");
      this.initData();
    },
    handleSearch() {
      // 搜索事件
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
      }
    },
    evaluatedChange(val) {
      this.assessProjectEvaluate({
        data: {
          id: val.pro_id,
          evaluate: val.is_evaluated
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
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
    const path = this.$route.path;
    if (path.indexOf("project") > 0) {
      this.keepGetFormPublic(1, 1);
    } else {
      this.keepGetFormPublic(1, 2);
    }
  },
  beforeMount() {
    this.initData();
    this.getStructures({
      data: {
        level: 1
      }
    }).then(data => {
      if (data.data.code === 200) {
        this.collegeList = data.data.data;
      }
    });
  },
  beforeDestroy() {
    const path = this.$route.path;
    if (path.indexOf("project") > 0) {
      this.keepGetFormPublic(2, 1);
    } else {
      this.keepGetFormPublic(2, 2);
    }
  },
  watch: {
    "getForm.college"() {
      this.handleSelect();
    }
  }
};
</script>

<style scoped>
.assess-table-dialogVisible {
  text-indent: 2em;
  line-height: 1.6em;
}
</style>
