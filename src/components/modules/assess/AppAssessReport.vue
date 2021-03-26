<template>
  <div class="app-assess-report" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="clearfix">
          <div class="fl" style="padding-bottom: 10px">
            <el-button-group>
              <el-button v-if="isYXB" @click="$router.go(-1)" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <!--<el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>-->
            </el-button-group>
          </div>
          <div class="fr query-box query-box2">
            <el-form inline @submit.native.prevent>
              <el-form-item>
                <el-select
                  v-model="getForm.pro_code"
                  placeholder="项目名称"
                  clearable
                  filterable
                  @change="handleChangeCode"
                >
                  <template v-for="(item, index) in project_list">
                    <el-option :key="index" :label="item.pro_name" :value="item.pro_code"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="getForm.course_id"
                  placeholder="课程名称"
                  clearable
                  filterable
                  :disabled="!getForm.pro_code"
                >
                  <template v-for="(item, index) in course_list">
                    <el-option :key="index" :label="item.cou_name" :value="item.cou_id"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始时间"
                  range-separator="至"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd"
                  style="width: 244px;margin-bottom: 10px"
                  :clearable="true"
                  @change="handleChangeTime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input
                  placeholder="搜索教师姓名"
                  v-model.trim="getForm.teacher"
                  class="input-with-select"
                  clearable
                >
                  <el-button slot="append" icon="el-icon-search" @click="handleChange"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="fl">
          <el-button
            type="text"
            icon="el-icon-sold-out"
            @click.native="handleExcel"
            style="font-size: 16px;line-height: 28px"
          >导出Excel</el-button>
        </div>
        <div class="fr">
          <div style="display: inline-block;padding-right: 20px">
            共搜索到
            <strong style="color: #5daf34">{{ total }}</strong> 条数据
          </div>
        </div>
      </div>
      <div class="assess-exam-main" style="padding-top: 10px">
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
          border
        >
          <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
          <el-table-column align="center" label="项目名称" prop="project_name" min-width="40"></el-table-column>
          <el-table-column align="center" prop="course_name" label="课程名称" min-width="40"></el-table-column>
          <el-table-column align="center" label="教师" width="60">
            <template slot-scope="scope">
              <template v-if="showData.teacher_name[scope.row.key]">
                <div>{{ showData.teacher_name[scope.row.key].name }}</div>
                <el-tag
                  :type="showData.teacher_name[scope.row.key].is_inschool == '校内' ? 'primary' : 'success'"
                  effect="plain"
                  size="mini"
                >{{ showData.teacher_name[scope.row.key].is_inschool }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <template v-for="(item, key) in showData.question_data">
            <el-table-column align="center" :key="key" :label="item" min-width="40">
              <template slot-scope="scope">
                <template v-if="scope.row.answers[key]">{{ scope.row.answers[key] }}</template>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-assess-report",
  data() {
    return {
      loading: false,
      headers: {},
      role: 2,
      getForm: {
        pro_code: "", // 项目编号
        course_id: null, // 课程标识id
        teacher: "", // 教师名称
        time_start: null, // '2019-09-10'
        time_end: null
      },
      time: "",
      tableData: [],
      showData: {},
      total: 0,
      project_list: [], // 课程评估的项目列表
      course_list: [], // 某项目的课程评估
      isYXB: false
    };
  },
  computed: {
    ...mapState(["URL", "assessReportExportUrl"])
  },
  methods: {
    ...mapActions([
      "getAssessReportList",
      "getAssessProject",
      "getAssessCourse"
    ]),
    initData() {
      this.loading = true;
      Object.assign(this.getForm, {
        time_start: this.time[0],
        time_end: this.time[1]
      });
      if (this.loading) {
        this.getAssessReportList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.showData = Data;
            const course_name = [];
            for (let key in Data.course_name) {
              course_name.push({
                key: key,
                course_name: Data.course_name[key],
                project_name: Data.project_name[key]
              });
            }
            this.tableData = [];
            if (course_name.length) {
              course_name.forEach(item => {
                let course_answer_data = Data.answer_data[item.key];
                if (course_answer_data) {
                  for (let k in course_answer_data) {
                    this.tableData.push(
                      Object.assign({}, item, {
                        answer_stud: k,
                        answers: course_answer_data[k].answers
                      })
                    );
                  }
                }
              });
            }
            this.total = this.tableData.length;
            this.loading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading = false;
              }
            });
          }
        });
      }
    },
    handleAll() {
      this.initTime();
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleChange() {
      this.$set(this.getForm, "page", 1);
      this.$set(this.getForm, "limit", 20);
      this.initData();
    },
    handleChangeCode(val) {
      this.$set(this.getForm, "page", 1);
      this.$set(this.getForm, "limit", 20);
      this.$set(this.getForm, "course_id", null);
      // this.initData();
      let v = this.project_list.filter(item => {
        return item.pro_code === val;
      });
      if (v.length) {
        let pro_id = v[0].pro_id;
        this.initAssessCourse(pro_id);
      }
    },
    handleChangeTime(val) {
      if (val && val.length) {
        this.$set(this.getForm, "time_start", val[0]);
        this.$set(this.getForm, "time_end", val[1]);
      } else {
        this.$set(this.getForm, "time_start", null);
        this.$set(this.getForm, "time_end", null);
      }
      // this.initData();
    },
    handleExcel() {
      const Obj = {
        authkey: this.headers.authkey,
        sessionid: this.headers.sessionid
      };
      Object.assign(Obj, this.getForm);
      for (let key in Obj) {
        if (!Obj[key]) {
          delete Obj[key];
        }
      }
      if (Obj) {
        const params_list = [];
        for (let key in Obj) {
          params_list.push(`${key}=${Obj[key]}`);
        }
        const params_str = params_list.join("&");
        let hrf = `${this.URL}${this.assessReportExportUrl}?${params_str}`;
        window.open(hrf);
      }
    },
    initAssessProject() {
      this.getAssessProject({
        data: {
          anstypeid: 2,
          sea_field: "pro_code",
          page: 1,
          limit: 999999
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.project_list = data.data.data.list;
        }
      });
    },
    initAssessCourse(id) {
      this.getAssessCourse({
        data: {
          anstypeid: 2,
          pro_id: id,
          page: 1,
          limit: 999999
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.course_list = data.data.data.list;
        }
      });
    },
    initTime() {
      let date = new Date();
      let Y = date.getFullYear();
      let M = date.getMonth() + 1;
      let d = date.getDate();
      this.time = [
        `${Y}-01-01`,
        `${Y}-${M > 9 ? M : "0" + M}-${d > 9 ? d : "0" + d}`
      ];
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    // this.initTime();
    this.initAssessProject();
    // this.initData();
  },
  mounted() {
    if (this.$cookie.get("headers")) {
      this.headers = JSON.parse(this.$cookie.get("headers"));
    }
  }
};
</script>
