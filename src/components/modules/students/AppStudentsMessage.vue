<template>
  <div
    class="app-students-message"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group>
            <el-button v-if="isYXB" @click="$router.push('/home/students/message/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleSearch(true)" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch(false)">
          <el-form inline v-if="userInfo.role===1" @submit.native.prevent>
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
            <el-form-item>
              <el-select v-model="getForm.province" placeholder="请选择" @change="handleChangeProvince">
                <el-option label="-- 不限省份 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in provincesList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.city" placeholder="请选择" @change="handleSelect">
                <el-option label="-- 不限城市 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in cityList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
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
          <el-table-column align="center" label="主办学院">
            <template slot-scope="scope">
              <div>{{ scope.row.college }}</div>
              <div
                v-if="scope.row.structure"
                style="color: #5E7E9F;line-height: 20px"
              >{{ scope.row.structure }}</div>
              <div v-if="userInfo.role===1" style="color: #199f93;line-height: 20px">{{ scope.row.realname }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="user" label="联系人姓名" width="100"></el-table-column>
          <el-table-column align="center" label="举办时间">
            <template slot-scope="scope">
              <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pers_num" label="人数" width="100">
            <template slot-scope="scope">{{ scope.row.pers_num || 0}}</template>
          </el-table-column>
          <el-table-column align="center" prop="apply_num" label="入校申请待确认" width="110">
            <template slot-scope="scope">
              <span :class="{warning: !!scope.row.apply_num}">{{ scope.row.apply_num || 0}}</span> 人
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="handlerStudents(scope.row)">学员管理</el-button>
              <template v-if="scope.row.pers_num">
                <el-button type="text" size="mini" @click.native="handleExport(scope.row)">导出名单</el-button>
                <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">详情及打印</el-button>
                <el-button v-if="scope.row.apply_num > 0" type="text" size="mini" @click.native="handleApplyCheck(scope.row)">入校审批</el-button>
              </template>
              <template v-else>
                <el-button v-if="!isYXB" type="text" size="mini" @click.native="handleImport(scope.row)">学员导入</el-button>
              </template>
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
    <!--导入学员-->
    <el-dialog
      title="重要提示"
      :visible.sync="dialogVisible"
      center
      append-to-body
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="import-tip-box">
        <div>
          1.上传名单请下载本网站提供的Excel标准格式，不要自行添加名单内表格字段。学员
          <span>姓名</span>务必
          <span>不要输入空格</span>。
        </div>
        <div>
          2.学员
          <span>“姓名”、“工作单位”、“手机号”</span>为
          <span>必填信息</span>。零散招生的培训学员如确实没有工作单位，也请填写“无工作单位”或“本人未提供”字样；单位委托举办的培训项目，请如实填报，不得留空。否则不予办理结算手续。
        </div>
        <div>
          3.学员 <span>“身份证号码”</span> 为选填信息。如要申请<span>电子版证书</span>，请完善学员身份证号码，否则不予办理。
        </div>
        <div>
          4.同一个培训班出现同名同姓的学员时，为区分学员，
          <span>同名同姓者的手机号为必填项</span>！学员若无手机号可填写座机号，座机号填写全数字，不要填写符号，示例：01062510345。
        </div>
        <div>5.学员名单导入后如需添加或修改人员，请点击“学员管理”进行单人信息管理。</div>
        <div>6.项目学员结业证书制作完成以后系统将锁定学员信息数据库，如需修改学员信息可在证书申领模块申请修改。</div>
        <div>7.“人大培训”微信服务号将依据本数据库向社会开放“证书查询”功能，请大家认真核对信息，对学员负责。</div>
      </div>
      <div style="padding: 20px 0 0;text-align: center" v-cloak>
        <el-button @click="dialogVisible = false">取 消</el-button>&nbsp;
        <el-upload
          ref="upload"
          class="upload aaa"
          :action="uploadExcelUrl"
          accept=".xls, .xlsx, .XLS, .XLSX"
          :show-file-list="false"
          :limit="1"
          :file-list="fileList"
          :on-success="handleSuccess"
          :headers="headers"
          name="attachment"
          :auto-upload="true"
        >
          <el-button :key="1" type="primary">
            导 入
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <span slot="tip" class="el-upload__tip">
            （
            <el-button @click.native="handleDownload" type="text">
              下载
              <i class="fa fa-download"></i>
            </el-button>标准格式后上传 ）
          </span>
        </el-upload>
      </div>
    </el-dialog>
    <!--上传错误数据提示-->
    <el-dialog
      title="错误提示"
      :visible.sync="dialogVisibleError"
      append-to-body
      center
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-cloak>
        <el-table :data="errorData" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column header-align="center" label="导入名单具体说明">
            <template slot-scope="scope">
              <strong>第 {{ scope.row.row }} 行</strong>
              ，{{ scope.row.error_msg }} 。
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleError = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 入校申请审批 -->
    <el-dialog
      title="入校申请一键审批"
      :visible.sync="dialogVisible_applyCheck"
      append-to-body center width="400px"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form inline label-width="100px">
          <el-form-item label="审批结果：">
            <el-radio-group v-model="form_applyCheck.type">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible_applyCheck = false">取 消</el-button>
        <el-button type="primary" @click="handleApplyCheckTrue" :loading="loading_applyCheck">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
const urls = {
  check2: '/admin/persons/auditapply' // 入校申请审批
}
export default {
  name: "app-students-message",
  data() {
    return {
      loading: false,
      headers: {},
      getForm: {
        college: null,
        structure: null, // 部门
        province: null,
        city: null,
        sea_field: "pro_code", //关键词字段(查询条件)：pro_name项目,pro_code协议编号,user联系人,tel联系方式,dwmc辅助单位名称
        keywords: "",
        source: ["1", "2"], //学员数据来源(1批量导入，2自行添加(学员审核项目列表展示自行添加的学员数据))
        fields: [
          "pro_name",
          "id",
          "college",
          "pro_code",
          "px_start_time",
          "px_end_time",
          "user"
        ],
        pflag: "1",
        page: 1,
        limit: 20,
        apply: null
      },
      tableData: [],
      total: 0,
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      // 上传、下载
      dialogVisible: false,
      showUpload: true,
      fileList: [],
      dialogVisibleError: false,
      errorData: [],
      importId: 0,
      
      isYXB: false,
      // 入校审批
      dialogVisible_applyCheck: false,
      loading_applyCheck: false,
      form_applyCheck: {
        pro_id: null,
        type: null, // 0 没有入校申请 1入校申请成功 2入校申请审核不通过成功  3入校申请审核通过成功
      }
    };
  },
  computed: {
    ...mapState(["URL", "uploadExcelUrl", 'userInfo'])
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getAreaList",
      "getProjectPersons",
      "personsImport",
      "exportStudent",
      'axiosHttp'
    ]),
    initData() {
      if (sessionStorage.getItem("STU_IS_APPLY")) {
        this.$set(this.getForm, "apply", 1);
      }
      this.loading = true;
      if (this.loading) {
        this.getProjectPersons({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            console.log(Data,'🍏🍏🍏🍏')
            this.total = Data.list.dataCount;
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
        sessionStorage.removeItem("STU_IS_APPLY");
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
    handleChangeProvince() {
      this.handleSelect();
      this.$set(this.getForm, "city", null);
      if (1) {
        this.getAreaList({
          data: {
            pid: this.getForm.province
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.cityList = Data.list;
          }
        });
      }
    },
    handlerStudents(val) {
      // 去往项目的学员管理列表
      this.$router.push({
        path: "/home/students/message/list/" + val.id,
        query: val.apply_num > 0 ? {
          pro_name: val.pro_name,
          apply_num: val.apply_num || 0,
          random: this.$md5(`${val.apply_num}`)
        } : {
          pro_name: val.pro_name
        }
      });
    },
    handleExport(val) {
      // 学员导出
      this.exportStudent({
        data: {
          pro_id: val.id
        }
      }).then(data => {
        if (data.data.code === 200) {
          window.open(this.URL + data.data.data);
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleInfo(val) {
      // 详情及打印
      this.$router.push("/home/students/message/print/" + val.id);
    },
    handleApplyCheck (val) {
      this.$set(this.form_applyCheck, 'pro_id', val.id)
      this.$set(this.form_applyCheck, 'type', 3)
      this.loading_applyCheck = false
      this.dialogVisible_applyCheck = true
    },
    handleApplyCheckTrue () {
      this.loading_applyCheck = true
      if (this.loading_applyCheck) {
        this.axiosHttp({
          url: urls.check2,
          type: 'post',
          data: this.form_applyCheck,
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('操作成功')
            this.dialogVisible_applyCheck = false
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                this.loading_applyCheck = false
              }
            })
          }
        })
      }
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
    },
    //文件上传
    handleImport(val) {
      // 导入学员按钮
      this.importId = val.id;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      // 上传成功的回调  personsImport
      if (response.code === 200) {
        this.personsImport({
          data: {
            pro_id: this.importId,
            scfile: response.data.code
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.initData();
            this.dialogVisible = false;
          } else {
            if (typeof data.data.error === "string") {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            } else {
              const Data = data.data.error;
              for (let key in Data) {
                this.errorData.push(Data[key]);
              }
              this.dialogVisibleError = true;
            }
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleDownload() {
      // 下载标准模板
      window.open(`${this.URL}/static/file/import.xls?randomtime=${new Date().getTime()}`);
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
    this.initData();
  },
  beforeMount () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    if (this.userInfo.role === 1) {
      this.getStructures({
        data: {}
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
      this.getAreaList({
        data: {
          pid: 0
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.provincesList = Data.list;
        }
      });
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("STU_IS_APPLY");
    this.keepGetFormPublic(2);
  }
};
</script>

<style scoped>
.import-tip-box {
  text-indent: 2em;
  line-height: 2em;
  font-size: 14px;
}
.import-tip-box span {
  color: #f56c6c;
}
.aaa {
  display: inline-block;
}
</style>
