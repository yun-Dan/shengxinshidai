<template>
  <div class="app-assess-course-exam" v-loading="loading">
    <el-card class="box-card">
      <div slot="header">
        <div>
          <el-form :inline="true" size="mini" @submit.native.prevent>
            <el-form-item>
              <div style="font-size: 20px">{{ query.cou_name }}（{{ query.pro_name }}）</div>
            </el-form-item>
            <template v-if="courseExamInfo.id">
              <el-form-item label="课程问卷状态：">
                <span v-if="courseExamInfo.status === 1" class="danger">禁用</span>
                <span v-if="courseExamInfo.status === 2" class="success">启用</span>
                <el-switch
                  v-model="courseExamInfo.status"
                  @change="handleChangeSwitchStatus(courseExamInfo)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="2"
                  :inactive-value="1"
                  style="margin-left:10px"
                ></el-switch>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div>
          <el-form :inline="true" size="mini">
            <!--问卷分享报告-->
            <template v-if="courseExamInfo.id && (userInfo.auth_share || userInfo.role === 1)">
              <el-form-item label="问卷分享报告：">
                <span v-if="courseExamInfo.is_shared === 2" class="success">已开启</span>
                <span v-if="courseExamInfo.is_shared === 1" class="danger">未开启</span>
              </el-form-item>
              <template v-if="courseExamInfo.is_shared === 2">
                <el-form-item label="访问地址：">
                  <el-button
                    type="text"
                    @click.native="handleLink(`${URL}/report/index/${courseExamInfo.id}`)"
                  >{{ URL }}/report/index/{{ courseExamInfo.id }}</el-button>&nbsp;&nbsp;或
                  <el-button type="text" @click.native="handleCodeTrue(2)">二维码访问</el-button>
                </el-form-item>
                <el-form-item v-if="courseExamInfo.access_time" label="有效期：">
                  <span>{{ courseExamInfo.access_time | TimestampChangeFilter(false, true) }}</span>
                </el-form-item>
                <el-form-item v-if="courseExamInfo.access_pwd" label="访问密码：">
                  <span>{{ courseExamInfo.access_pwd }}</span>
                </el-form-item>
              </template>
            </template>
          </el-form>
        </div>
        <div class="clearfix">
          <div class="fl" style="padding-bottom: 10px">
            <el-button-group>
              <el-button type="primary" icon="el-icon-tickets" @click.native="handleAdd">分配试题</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                :disabled="selection.length === 0"
                @click.native="handleDelete(true)"
              >批量删除</el-button>
              <el-button
                type
                icon
                @click.native="handleCode"
                :disabled="total === 0 && !courseExamInfo.id"
              >
                <i class="fa fa-qrcode"></i>&nbsp; 生成问卷二维码
              </el-button>
              <el-dropdown trigger="click" :hide-on-click="false">
                <el-button type icon="el-icon-more">更多操作</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleCopy">
                    <i class="fa fa-copy"></i>&nbsp;&nbsp; 复制现有课程问卷
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleCope2">
                    <i class="fa fa-clipboard"></i>&nbsp;&nbsp; 使用预设问卷
                  </el-dropdown-item>
                  <el-dropdown-item
                    :disabled="total === 0 && !courseExamInfo.id"
                    @click.native="handleResult"
                  >
                    <i class="fa fa-pie-chart"></i>&nbsp;&nbsp; 查看问卷报告
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="userInfo.auth_share || userInfo.role === 1"
                    :disabled="total === 0 && !courseExamInfo.id"
                    @click.native="handleCreatereport(courseExamInfo.is_shared)"
                  >
                    <i class="fa fa-file-text-o"></i>&nbsp;&nbsp;
                    <span v-if="courseExamInfo.is_shared === 1">开启</span>
                    <span v-if="courseExamInfo.is_shared === 2">关闭</span>问卷分享报告
                  </el-dropdown-item>
                  <!--<el-dropdown-item v-if="courseExamInfo.is_shared === 2" @click.native="handleCodeTrue(2)">-->
                  <!--<i class="fa fa-qrcode"></i>&nbsp;&nbsp; 获取问卷分享报告二维码-->
                  <!--</el-dropdown-item>-->
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </div>
          <div class="fr" style="padding-bottom: 10px">
            <el-button type="primary" plain @click.native="handleBack">返 回</el-button>&nbsp;
          </div>
        </div>
      </div>
      <!--展示-->
      <div class="app-assess-course-list-main" v-cloak>
        <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" type="index" width="55"></el-table-column>
          <el-table-column align="center" prop="title" label="试题名称"></el-table-column>
          <el-table-column align="center" label="试题类型">
            <template slot-scope="scope">
              <span v-if="examType[scope.row.types]">{{ examType[scope.row.types].label}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="is_required" label="是否必填">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_required"
                @change="handleChangeSwitchRequired(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sort" label="排序">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.sort"
                controls-position="right"
                :min="0"
                size="mini"
                style="width: 90px"
                @change="handleChangeSort(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDelete(false, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--弹窗（分配试题）-->
    <el-dialog
      title="问卷试题分配"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      width="700px"
    >
      <div class="app-el-transfer" v-loading="dialogLoading">
        <el-form style="text-align: left">
          <el-form-item :rules="[{required: true}]">
            <el-transfer
              v-model="form.question_ids"
              :data="transferData"
              style="height: 500px"
              filterable
              :titles="[ '待选试题', '已选试题' ]"
              filter-placeholder="试题名称、试题类型搜索"
            ></el-transfer>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click.native="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="handleTrue">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--弹窗（生成问卷二维码-声明提示）-->
    <el-dialog title="重要声明" :visible.sync="dialogVisible_code" width="30%" center append-to-body>
      <div
        class="assess-table-dialogVisible"
      >请确认学员信息已准确导入。未提前进行微信注册和项目关联的学员，如果填写问卷时登记的信息与提前导入系统的名单不一致，将无法成功提交答卷。 同一个培训班中，同名同姓的学员，必须通过手机号区分。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCodeTrue(1)">确认无误</el-button>
        <el-button @click="handleStudents">检查名单</el-button>
      </span>
    </el-dialog>
    <!--弹窗（问卷分享报告）-->
    <el-dialog
      title="问卷分享报告"
      :visible.sync="dialogVisible_createreport"
      width="500px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <div class v-loading="dialogLoading_createreport">
        <el-form style="text-align: left" label-position="top">
          <el-form-item>
            <div
              style="font-size: 18px; text-align: center"
              class="warning"
            >是否{{ title_createreport }}？</div>
          </el-form-item>
          <el-form-item v-if="createreportForm.is_shared===2" label="报告有效期截止日期">
            <el-date-picker
              v-model="createreportForm.access_time"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="createreportForm.is_shared===2" label="报告访问密码">
            <el-input
              v-model.trim="createreportForm.access_pwd"
              clearable
              placeholder="访问密码（格式为字母、数字、下划线，密码长度为6至20位）"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click.native="dialogVisible_createreport=false">取 消</el-button>
            <el-button type="primary" @click="handleCreatereportTrue">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--弹窗（复制课程问卷）-->
    <el-dialog
      title="复制课程问卷"
      :visible.sync="dialogVisible_copy"
      width="500px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <div class v-loading="dialogLoading_copy">
        <el-form style="text-align: left">
          <el-form-item label="选择项目课程：" :rules="[{required: true}]">
            <!--<el-cascader :options="projectList" :props="props" :change-on-select="false" v-model="copeValue"-->
            <!--style="width: 100%;" @active-item-change="handleItemChange"-->
            <!--placeholder="请选择项目课程">-->
            <!--</el-cascader>-->
            <el-cascader
              :props="props2"
              v-model="copeValue"
              style="width: 100%;"
              placeholder="请选择项目课程"
            ></el-cascader>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click.native="dialogVisible_copy=false">取 消</el-button>
            <el-button type="primary" @click="handleCopyTrue">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--弹窗（使用预设问卷）-->
    <el-dialog
      title="使用预设问卷"
      :visible.sync="dialogVisible_copy2"
      width="500px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <div class v-loading="dialogLoading_copy2">
        <el-form style="text-align: left">
          <el-form-item label="选择预设问卷：" :rules="[{required: true}]">
            <el-select v-model="copyForm2.from.paper_id" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in presetList"
                :key="index"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click.native="dialogVisible_copy2=false">取 消</el-button>
            <el-button type="primary" @click="handleCopyTrue2">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-assess-course-exam",
  data() {
    return {
      loading: false,
      getForm: {
        pro_id: null,
        course_id: null
      },
      tableData: [],
      total: 0,
      examType: {
        "1": {
          label: "单选",
          value: 1,
          disabled: false
        },
        "2": {
          label: "多选",
          value: 2,
          disabled: false
        },
        "3": {
          label: "问答题",
          value: 3,
          disabled: false
        },
        "4": {
          label: "填空题",
          value: 4,
          disabled: true
        },
        "5": {
          label: "填空题",
          value: 5,
          disabled: true
        }
      },
      query: {},
      examList: [],
      courseExamInfo: {}, // 课程问卷信息
      dialogVisible: false,
      dialogLoading: false,
      form: {
        pro_id: null,
        course_id: null,
        question_ids: [] // 试题标识id
      },
      selection: [], // 列表选中项
      dialogVisible_code: false,
      dialogVisible_createreport: false,
      dialogLoading_createreport: false,
      title_createreport: "问卷分享报告",
      createreportForm: {
        id: null,
        is_shared: 1, // 生成分享报告：1不生成，2生成
        access_time: null, // 报告有效期(时间戳)
        access_pwd: "" // 报告访问密码（密码格式为字母、数字、下划线，密码长度为6至20位）
      },
      dialogVisible_copy: false,
      dialogLoading_copy: false,
      projectList: [],
      projectCourseList: [],
      copyForm: {
        from: {
          pro_id: null,
          course_id: null
        },
        to: {
          pro_id: null,
          course_id: null
        }
      },
      copeValue: [],
      props: {
        value: "index",
        label: "label",
        children: "children"
      },
      props2: {},
      //    使用预设问卷
      dialogVisible_copy2: false,
      dialogLoading_copy2: false,
      presetList: [], // 预设问卷列表
      copyForm2: {
        from: {
          paper_id: null // 预设问卷标识id
        },
        to: {
          pro_id: null,
          course_id: null
        }
      }
    };
  },
  computed: {
    ...mapState(["URL", 'userInfo']),
    transferData() {
      let Obj = {};
      this.tableData.map(item => {
        Object.assign(Obj, {
          [item.question_id]: true
        });
      });
      return this.examList.map(item => {
        return {
          key: item.id,
          label: `${item.title}（${
            this.examType[item.types] ? this.examType[item.types].label : ""
          }）`,
          disabled: Obj[item.id] || false
        };
      });
    }
  },
  methods: {
    ...mapActions([
      "getAssessExamList",
      "getAssessCourseExamList",
      "sortRequiredAssessCourseExam",
      "statusAssessCourseExam",
      "addAssessCourseExam",
      "deletesAssessCourseExam",
      "createreportAssessCourseExam",
      "assessCourseExamBaseInfo",
      "statusAssessCourseExam",
      "getAssessProject",
      "getAssessCourse",
      "copyAssessCourseExam",
      "getAssessPresetList",
      "copyAssessPreset"
    ]),
    initData() {
      this.$set(this.getForm, "pro_id", this.query.pro_id);
      this.$set(this.getForm, "course_id", this.query.course_id);
      this.loading = true;
      if (this.loading) {
        this.getAssessCourseExamList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
            this.loading = false;
            this.getInfo();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    getInfo() {
      this.assessCourseExamBaseInfo({
        data: {
          course_id: this.query.course_id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.courseExamInfo = data.data.data;
        }
      });
    },
    handleChangeSwitchRequired(val) {
      // 是否必填
      this.sortRequiredAssessCourseExam({
        data: {
          is_required: val.is_required
        },
        id: val.id
      }).then(data => {
        if (data.data.code === 200) {
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    getExam() {
      this.loading = true;
      if (this.loading) {
        this.getAssessExamList({
          data: {
            page: 1,
            limit: 999999,
            status: 2, // 启用状态
            review_status: 3 // 审核通过
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.examList = data.data.data.list;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleAdd() {
      let list = this.tableData.map(item => {
        return item.question_id;
      });
      this.$set(this.form, "question_ids", list);
      this.dialogVisible = true;
      this.dialogLoading = false;
    },
    handleTrue() {
      if (this.form.question_ids && !this.form.question_ids.length) {
        this.$message.warning({
          message: "请分配课程问卷试题！"
        });
        return false;
      }
      this.dialogLoading = true;
      if (this.dialogLoading) {
        this.addAssessCourseExam({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success(data.data.data);
            this.initData();
            this.dialogVisible = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogLoading = false;
              }
            });
          }
        });
      }
    },
    handleDelete(some = false, val) {
      //  some：true批量、false单个
      let ids = [];
      if (some && this.selection.length) {
        ids = this.selection.map(item => {
          return item.id;
        });
      }
      this.$confirm("此操作将彻底删除所选试题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletesAssessCourseExam({
            data: {
              ids: some ? ids : [val.id]
            }
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
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    handleChangeSort(val) {
      this.loading = true;
      if (this.loading) {
        this.sortRequiredAssessCourseExam({
          data: {
            sort: val.sort
          },
          id: val.id
        }).then(data => {
          if (data.data.code === 200) {
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
          this.initData();
        });
      }
    },
    //生成课程二维码
    handleCode() {
      this.dialogVisible_code = true;
    },
    handleCodeTrue(type = 1) {
      //1生成问卷二维码、2获取分享报告二维码
      this.$router.push({
        path: "/home/assess/course/code",
        query:
          type === 2
            ? {
                tp: 9,
                id: this.courseExamInfo.id
              }
            : {
                pro_name: this.query.pro_name,
                pro_code: this.query.pro_code,
                cou_id: this.query.course_id,
                cou_name: this.query.cou_name
              }
      });
    },
    handleStudents() {
      this.$router.push({
        path: "/home/students/message/list/" + this.query.pro_id,
        query: {
          pro_name: this.query.pro_name
        }
      });
    },
    //问卷分享报告管理
    handleLink(url) {
      // 地址访问
      window.open(url);
    },
    handleCreatereport(value) {
      if (value === 1) {
        this.title_createreport = `开启${
          this.$options.data().title_createreport
        }`;
      } else {
        this.title_createreport = `关闭${
          this.$options.data().title_createreport
        }`;
      }
      Object.assign(
        this.createreportForm,
        this.$options.data().createreportForm,
        {
          id: this.courseExamInfo.id,
          is_shared: value === 1 ? 2 : 1
        }
      );
      this.dialogLoading_createreport = false;
      this.dialogVisible_createreport = true;
    },
    handleCreatereportTrue() {
      let Obj = Object.assign({}, this.createreportForm);
      let params = {};
      if (Obj.is_shared === 1) {
        Object.assign(params, {
          id: Obj.id,
          is_shared: Obj.is_shared
        });
      } else {
        if (Obj.access_pwd) {
          let isOk = this.isPasswd(Obj.access_pwd);
          if (
            !isOk ||
            Obj.access_pwd.length < 6 ||
            Obj.access_pwd.length > 20
          ) {
            this.$message({
              type: "warning",
              message: "报告访问密码格式错误！"
            });
            return false;
          }
        }
        Object.assign(params, {
          id: Obj.id,
          is_shared: Obj.is_shared,
          access_time: parseInt(Obj.access_time / 1000),
          access_pwd: Obj.access_pwd
        });
      }
      this.dialogLoading_createreport = true;
      if (this.dialogLoading_createreport) {
        this.createreportAssessCourseExam({
          data: params
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible_createreport = false;
            this.getInfo();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogLoading_createreport = false;
              }
            });
          }
        });
      }
    },
    isPasswd(s) {
      // 只能输入6-20个字母、数字、下划线
      let patrn = /^(\w){6,20}$/;
      if (!patrn.exec(s)) {
        return false;
      } else {
        return true;
      }
    },
    //问卷状态修改
    handleChangeSwitchStatus(val) {
      // 启用、禁用
      this.statusAssessCourseExam({
        data: {
          ids: [val.id],
          status: val.status
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
    //问卷调查结果
    handleResult() {
      let query = Object.assign({}, this.query, {
        paper_id: this.courseExamInfo.id
      });
      this.$router.push({
        name: "AppAssessCourseExamResult",
        query: query
      });
    },
    //返回上一页
    handleBack() {
      sessionStorage.setItem("Pro_name", this.query.pro_name);
      this.$router.go(-1);
    },
    //复制项目课程问卷
    handleCopy() {
      this.copeValue = [];
      this.projectCourseList = [];
      this.$set(this.copyForm, "from", {
        pro_id: null,
        course_id: null
      });
      this.$set(this.copyForm, "to", {
        pro_id: this.query.pro_id,
        course_id: this.query.course_id
      });
      this.dialogLoading_copy = true;
      this.dialogVisible_copy = true;
      // if (this.dialogLoading_copy) {
      //     this.getProjectList()
      // }
      this.props2 = {
        value: "index",
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node;
          setTimeout(() => {
            if (level === 0) {
              this.getAssessProject({
                data: {
                  page: 1,
                  limit: 999999999,
                  sea_field: "pro_code",
                  keywords: "",
                  college: this.userInfo.collegeId || null,
                  anstypeid: 2
                }
              }).then(data => {
                if (data.data.code === 200) {
                  let Data = data.data.data;
                  let list = Data.list.map((item, index) => {
                    return Object.assign({}, item, {
                      label: item.pro_name,
                      index: index,
                      children: []
                    });
                  });
                  this.projectList = list;
                  // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                  resolve(list);
                  this.dialogLoading_copy = false;
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: data.data.error
                  });
                  resolve([]);
                }
              });
            } else if (level === 1) {
              let parentId = node.data.id;
              if (parentId) {
                this.dialogLoading_copy = true;
                if (this.dialogLoading_copy) {
                  this.getAssessCourse({
                    data: {
                      anstypeid: 2,
                      pro_id: parentId,
                      page: 1,
                      limit: 999999
                    }
                  }).then(data => {
                    if (data.data.code === 200) {
                      let Data = data.data.data.list;
                      let list = Data.map((v, i) => {
                        return Object.assign({}, v, {
                          label: v.cou_name,
                          index: i,
                          leaf: true
                        });
                      });
                      this.projectCourseList = list;
                      // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                      resolve(list);
                      this.dialogLoading_copy = false;
                    } else {
                      this.$notify.error({
                        title: "错误",
                        message: data.data.error
                      });
                      resolve(list);
                    }
                  });
                }
              }
            } else {
              resolve([]);
            }
          }, 800);
        }
      };
    },
    handleCopyTrue() {
      if (!this.copeValue.length) {
        this.$message({
          type: "warning",
          message: "请选择要复制问卷的项目课程！"
        });
        return false;
      }
      let course = this.projectCourseList[this.copeValue[1]];
      let Obj = Object.assign({}, this.copyForm, {
        from: {
          pro_id: course.pro_id,
          course_id: course.id
        }
      });
      this.dialogLoading_copy = true;
      if (this.dialogLoading_copy) {
        this.copyAssessCourseExam({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success(data.data.data);
            this.dialogVisible_copy = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogLoading_copy = false;
              }
            });
          }
        });
      }
    },
    getProjectList() {
      // 获取课程评估的项目列表
      this.getAssessProject({
        data: {
          page: 1,
          limit: 9999999,
          sea_field: "pro_code",
          keywords: "",
          college: this.userInfo.collegeId || null,
          anstypeid: 2
        }
      }).then(data => {
        if (data.data.code === 200) {
          let Data = data.data.data;
          this.projectList = Data.list.map((item, index) => {
            return Object.assign({}, item, {
              label: item.pro_name,
              index: index,
              children: []
            });
          });
          this.dialogLoading_copy = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleItemChange(val) {
      let index = -1;
      let parent = {};
      index = val[0];
      if (index > -1) {
        parent = this.projectList[index];
      }
      if (parent.id) {
        this.dialogLoading_copy = true;
        if (this.dialogLoading_copy) {
          this.getAssessCourse({
            data: {
              anstypeid: 2,
              pro_id: parent.id,
              page: 1,
              limit: 999999
            }
          }).then(data => {
            if (data.data.code === 200) {
              let list = data.data.data.list;
              this.projectCourseList = list.map((v, i) => {
                return Object.assign({}, v, {
                  label: v.cou_name,
                  index: i
                });
              });
              this.dialogLoading_copy = false;
              this.projectList[index].children = this.projectCourseList;
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        }
      }
    },
    //使用预设问卷
    handleCope2() {
      this.$set(this.copyForm2, "from", {
        paper_id: null
      });
      this.$set(this.copyForm2, "to", {
        pro_id: this.query.pro_id,
        course_id: this.query.course_id
      });
      this.dialogLoading_copy2 = true;
      this.dialogVisible_copy2 = true;
      if (this.dialogLoading_copy2) {
        this.getPresetList();
      }
    },
    handleCopyTrue2() {
      if (this.copyForm2.from && !this.copyForm2.from.paper_id) {
        this.$message({
          type: "warning",
          message: "请选择要使用的预设问卷！"
        });
        return false;
      }
      this.dialogLoading_copy2 = true;
      if (this.dialogLoading_copy2) {
        this.copyAssessPreset({
          data: this.copyForm2
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success("操作成功！");
            this.dialogVisible_copy2 = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogLoading_copy2 = false;
              }
            });
          }
        });
      }
    },
    getPresetList() {
      if (this.dialogLoading_copy2) {
        this.getAssessPresetList({
          data: {
            status: 2,
            page: 1,
            limit: 999999
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.presetList = data.data.data.list;
            this.dialogLoading_copy2 = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    }
  },
  created() {
    this.query = this.$route.query;
    if (this.query.pro_id) {
      this.$set(this.form, "pro_id", this.query.pro_id);
    }
    if (this.query.course_id) {
      this.$set(this.form, "course_id", this.query.course_id);
    }
    this.initData();
  },
  mounted() {
    this.getExam();
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
