<template>
  <div class="app-students-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button type="text" icon="el-icon-d-arrow-left" @click.native="handleBack">返回</el-button>&nbsp;
        <span class="app-students-list-title">{{ query.pro_name }}</span>
        <div class="handle-box">
          <el-button-group style="float: left">
            <el-button @click.native="handleAll"
              type="" icon="el-icon-menu" :key="4"
            >全部</el-button>
            <template v-if="!cert_isstatus">
              <el-button
                v-if="userInfo.role===2"
                @click.native="handleUpdate(0)"
                type="primary"
                icon="el-icon-plus"
                :key="1"
              >新增</el-button>
              <el-button
                v-if="userInfo.role===2 && !isYXB"
                @click.native="handleImport"
                type="warning"
                icon="el-icon-upload"
                plain
                :key="2"
              >导入</el-button>
            </template>
            <el-button
              v-if="userInfo.role === 2 && !cert_isstatus"
              :disabled="!showDelete"
              type="danger"
              icon="el-icon-delete"
              @click.native="handleDeleteChecked"
              :key="5"
            >删除</el-button>
            <!--  -->
            <el-button v-if="userInfo.role === 1 && show_applyCheck && form_applyCheck.pro_id"
              type="primary" icon="el-icon-circle-check" :key="62" @click="handleApplyCheck">
              入校审批
            </el-button>
            <!--  -->
            <el-button
              v-if="showDelete && userInfo.role === 2"
              type="primary"
              plain
              icon="el-icon-circle-check"
              @click.native="handleApply"
              :key="6"
            >{{ userInfo.role === 2 ? '入校申请' : '入校申请审批' }}</el-button>
          </el-button-group>
          <div class="search-box">
            <el-input placeholder="搜索学员姓名" v-model.trim="getForm.keywords" clearable>
              <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
            </el-input>
          </div>
        </div>
      </div>
      <div v-cloak>
        <el-table :data="tableData" :default-expand-all="true" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column v-if="isYXB" align="center" type="expand" width="1">
            <template slot-scope="scope">
              <el-form inline size="mini" label-width="100px">
                <el-form-item label="实缴金额：">
                  <span :class="{ 'info': !scope.row.sjje }">{{ scope.row.sjje || '0.00' }} 元</span>
                </el-form-item>
                <el-form-item label="开票单位：">
                  <span :class="{ 'info': !scope.row.invoice_unit }">{{ scope.row.invoice_unit || '（无）' }}</span>
                </el-form-item>
                <el-form-item label="开票税号：">
                  <span :class="{ 'info': !scope.row.invoice_number }">{{ scope.row.invoice_number || '（无）' }}</span>
                </el-form-item>
                <el-form-item label="开票邮箱：">
                  <span :class="{ 'info': !scope.row.invoice_email }">{{ scope.row.invoice_email || '（无）' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column v-if="userInfo.role === 2" align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="姓名" min-width="40px"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别" width="54px"></el-table-column>
          <el-table-column align="center" prop="national" label="民族" min-width="40px"></el-table-column>
          <el-table-column align="center" prop="idcard" label="身份证号"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号码"></el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
          <el-table-column align="center" prop="company" label="工作单位"></el-table-column>
          <el-table-column align="center" prop="resign" label="职务" min-width="40px"></el-table-column>
          <el-table-column align="center" prop="resign" label="入校申请状态" min-width="60px">
            <template slot-scope="scope">
              <span v-if="applyStateus[scope.row.apply]" :class="applyStateus[scope.row.apply].type">
                {{ applyStateus[scope.row.apply].label }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="!cert_isstatus || userInfo.role === 1" align="center" label="操作" width="210">
            <template slot-scope="scope">
              <template v-if="!cert_isstatus">
                <el-button type size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
              <template v-if="userInfo.role === 1 && scope.row.apply != 0">
                <el-button type="primary" size="mini" @click="handleApply(scope.row.id)">审批</el-button>
              </template>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      center
      append-to-body
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" label-width="120px" v-cloak style="margin-right: 50px">
        <el-form-item label="姓名" :rules="[{required: true}]">
          <el-input v-model.trim="form.name" placeholder="请输入学员姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" clearable>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="民族">
          <el-input v-model.trim="form.national" placeholder="请输入民族"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :rules="[{required: isYXB}]">
          <el-input v-model.trim="form.idcard" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :rules="[{required: true}]">
          <el-input v-model.trim="form.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="工作单位" :rules="[{required: true}]">
          <el-input v-model.trim="form.company" placeholder="请输入工作单位"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model.trim="form.resign" placeholder="请输入职务名称"></el-input>
        </el-form-item>
        <template v-if="isYXB">
          <el-form-item label="实缴金额(元)" :rules="[{required: true}]">
            <el-input-number v-model.trim="form.sjje" :precision="2" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="开票单位" :rules="[{required: true}]">
            <el-input v-model.trim="form.invoice_unit" placeholder="请输入开票单位"></el-input>
          </el-form-item>
          <el-form-item label="开票税号" :rules="[{required: true}]">
            <el-input v-model.trim="form.invoice_number" placeholder="请输入开票税号"></el-input>
          </el-form-item>
          <el-form-item label="开票邮箱" :rules="[{required: true}]">
            <el-input v-model.trim="form.invoice_email" placeholder="请输入开票邮箱"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" v-cloak style="position: relative">
        <el-button type="primary" @click.native=" handleTrue">提 交</el-button>
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
        <div class="dialog-footer-show" :class="{'dialog-footer-none':dialogShow}"></div>
      </div>
    </el-dialog>
    <!--导入学员提示-->
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
          <span>姓名务必不要输入空格</span>。
        </div>
        <div>
          2.学员
          <span>“姓名”、“工作单位”、“手机号”</span>为<span>必填信息</span>。零散招生的培训学员如确实没有工作单位，也请填写“无工作单位”或“本人未提供”字样；单位委托举办的培训项目，请如实填报，不得留空。否则不予办理结算手续。
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
      <div style="padding: 20px; text-align: center" v-cloak class="clearfix">
        <el-button @click="dialogVisible = false" class="fl">取 消</el-button>
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
          :with-credentials="true"
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
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
    >
      <el-table v-cloak :data="errorData" border style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column header-align="center" label="导入名单具体说明">
          <template slot-scope="scope">
            <strong>第 {{ scope.row.row }} 行</strong>
            ，{{ scope.row.error_msg }} 。
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleError = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 入校申请 -->
    <el-dialog
      :title="`入校申请人员${userInfo.role === 2 ? '' : '审批'}`"
      :visible.sync="dialogVisibleApply"
      :width="selectionArr.length ? '40%' : '400px'" center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div>
        <div v-if="selectionArr.length" class="info" style="margin-bottom: 12px;">
          <span class="danger">* </span>
          <span v-if="userInfo.role === 2">已填写“身份证号”且入校申请状态为“待申请”的学员可提交申请！已选入校申请人员共</span>
          <span v-if="userInfo.role === 1">已选入校申请人员审批共</span>
          <span class="primary set-font-weight"> {{ checkApply.length }} </span>
          <span>名。</span>
        </div>
        <div>
          <el-checkbox-group v-if="selectionArr.length" v-model="checkApply">
            <el-checkbox v-for="(item, index) in selectionArr" :key="index"
              :label="item.id"
              :disabled="userInfo.role === 2 && (!item.idcard || item.apply != 0) || userInfo.role === 1 && (!item.idcard || item.apply == 0)">
              <div :style="`min-width: ${userInfo.role === 2 ? '68px' : '130px'}; margin-bottom: 4px;`">
                {{ item.name }}
                <template v-if="userInfo.role === 1">
                  <span v-if="item.apply != 0 && applyStateus[item.apply]"
                    :class="applyStateus[item.apply].type">（{{ applyStateus[item.apply].label }}）</span>
                </template>
              </div>
            </el-checkbox>
          </el-checkbox-group>
          <!-- s审批 -->
          <el-form v-if="userInfo.role === 1" label-width="100px" style="margin-top: 20px;">
            <el-form-item label="审批结果：">
              <el-radio-group v-model="applyVal">
                <el-radio :label="3">通过</el-radio>
                <el-radio :label="2">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-loading="loadingApply">
        <el-button type="primary" @click="handleApplyTrue" :disabled="!checkApply.length">{{ userInfo.role === 1 ? '确 定' : '提 交' }}</el-button>
        <el-button @click="dialogVisibleApply = false">取 消</el-button>
      </div>
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
  apply: '/admin/persons/apply', // 申请入校申请
  check2: '/admin/persons/auditapply' // 入校申请（一键）审批
}
const applyStateus = {
  0: {
    label: '未申请',
    type: 'info',
    value: 0
  },
  1: {
    label: '待审批',
    type: 'warning',
    value: 1
  },
  2: {
    label: '拒绝',
    type: 'danger',
    value: 2
  },
  3: {
    label: '通过',
    type: 'success',
    value: 3
  }
}
export default {
  name: "app-students-list",
  data() {
    return {
      loading: false,
      cert_isstatus: true, // 证书审核状态：2（不能新增学员）
      getForm: {
        pro_id: 0,
        sea_field: "name",
        keywords: "",
        page: 1,
        limit: 20,
        status: "2"
      },
      tableData: [],
      total: 0,
      showDelete: false,
      showAll: false,
      dialogFormVisible: false,
      dialogShow: true,
      dialogTitle: "",
      form: {
        pro_id: 0,
        name: "", // 姓名
        sex: '',
        national: '',
        company: "", // 单位
        resign: "", // 职务
        mobile: "", // 手机号
        idcard: "", // 身份证
        email: "", // 邮箱
        source: "1",
        invoice_unit: '',
        invoice_number: '',
        invoice_email: '',
        sjje: 0
      },
      key: 1, // 1新增  0编辑
      idarr: [], // 选择的学员id数组
      // 上传、下载
      dialogVisible: false,
      showUpload: true,
      fileList: [],
      dialogVisibleError: false,
      errorData: [],
      headers: null,
      importId: 0,
      
      isYXB: false,
      // 入校申请
      selectionArr: [],
      dialogVisibleApply: false,
      loadingApply: false,
      checkApply: [],
      applyVal: 3, // 2拒绝、3通过
      applyStateus,
      // 入校审批
      show_applyCheck: false,
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
      "getStudentsData",
      "getStudentsId",
      "addStudents",
      "updateStudents",
      "deleteStudents",
      "deleteSelectedStudents",
      "personsImport",
      'axiosHttp'
    ]),
    initData() {
      this.$set(this.getForm, "pro_id", this.$route.params.id);
      this.loading = true;
      if (this.loading) {
        this.getStudentsData({
          data: this.getForm,
          font: true
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            //cert_isstatus2（不能新增学员）
            if (data.data.data.cert_isstatus === 2) {
              this.cert_isstatus = true;
            } else {
              this.cert_isstatus = false;
            }
            this.tableData = Data.list;
            this.total = Data.dataCount;
            this.loading = false;
            if (this.tableData[0]) {
              this.$set(this.form_applyCheck, 'pro_id', this.tableData[0].pro_id)
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleAll() {
      this.$set(this.getForm, "keywords", "");
      this.initData();
      this.showAll = false;
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索关键字！",
          type: "warning"
        });
        return false;
      }
      this.initData();
      this.showAll = true;
    },
    handleUpdate(id) {
      if (!id) {
        this.key = 1;
        this.dialogShow = true;
        this.dialogTitle = "新增学员信息";
        Object.assign(this.form, this.$options.data().form);
        this.dialogFormVisible = true;
      } else {
        this.key = 0;
        this.dialogShow = true;
        this.dialogTitle = "编辑学员信息";
        this.getStudentsId({
          id: id
        }).then(data => {
          if (data.data.code === 200) {
            Object.assign(this.form, data.data.data);
            this.dialogFormVisible = true;
          }
        });
      }
    },
    handleTrue() {
      // 确认新增或编辑
      if (!this.form.name) {
        this.$message({
          message: "请输入学员姓名！",
          type: "warning"
        });
        return false;
      }
      if (this.isYXB && !this.form.idcard) {
        this.$message({
          message: "请输入身份证号！",
          type: "warning"
        });
        return false;
      }
      if (!this.form.mobile) {
        this.$message({
          message: "请输入学员手机号！",
          type: "warning"
        });
        return false;
      }
      if (!this.form.company) {
        this.$message({
          message: "请输入学员工作单位！",
          type: "warning"
        });
        return false;
      }
      if (this.isYXB) {
        if (!this.form.sjje) {
          this.$message({
            message: "请输入实缴金额！",
            type: "warning"
          });
          return false;
        }
        if (!this.form.invoice_unit) {
          this.$message({
            message: "请输入开票单位！",
            type: "warning"
          });
          return false;
        }
        if (!this.form.invoice_number) {
          this.$message({
            message: "请输入开票税号！",
            type: "warning"
          });
          return false;
        }
        if (!this.form.invoice_email) {
          this.$message({
            message: "请输入开票邮箱！",
            type: "warning"
          });
          return false;
        }
      }
      this.$set(this.form, "pro_id", Number(this.$route.params.id));
      this.dialogShow = false;
      if (this.key) {
        this.addStudents({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              message: data.data.data,
              type: "success"
            });
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogShow = true;
              }
            });
          }
        });
      } else {
        let ID = this.form.id;
        for (let key in this.form) {
          if (!this.$options.data().form.hasOwnProperty(key)) {
            delete this.form[key];
          }
        }
        this.updateStudents({
          data: this.form,
          id: ID
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              message: data.data.data,
              type: "success"
            });
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogShow = true;
              }
            });
          }
        });
      }
    },
    handleSelectionChange(val) {
      this.selectionArr = val
      this.idarr = val.map(item => {
        return item.id + "";
      });

      if (val.length) {
        this.showDelete = this.userInfo.role === 2?false:true;
      } else {
        this.showDelete = false;
      }
    },
    handleDeleteChecked() {
      this.$confirm("此操作将彻底删除选中的学员，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteSelectedStudents({
            data: {
              pro_id: this.$route.params.id,
              idarr: this.idarr
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
    handleDelete(id) {
      this.$confirm("此操作将彻底删除该学员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteStudents({
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
    handleApply (ID = null) { // ID=null批量
      this.applyVal = 3
      this.loadingApply = false
      this.dialogVisibleApply = true
      if (ID) {
        this.checkApply = [ID]
      } else {
        this.checkApply = this.selectionArr.filter(item => {
          if (this.userInfo.role === 2) {
            return !!item.idcard && item.apply === 0
          } else {
            return item.apply === 1
          }
        }).map(item => item.id)
      }
    },
    handleApplyTrue () {
      this.loadingApply = true
      if (this.loadingApply) {
        this.axiosHttp({
          type: 'post',
          url: urls.apply,
          data: {
            ids: this.checkApply,
            type: this.userInfo.role === 2 ? 1 : this.applyVal// 1入校申请 2入校申请审核不通过  3入校申请审核通过
          },
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success(this.userInfo.role === 2 ? '入校申请提交成功！' : '入校申请审批成功')
            this.dialogVisibleApply = false
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                this.loadingApply = false
              }
            })
          }
        })
      }
    },
    handleApplyCheck () {
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
            this.show_applyCheck = false
            this.$router.push({
              name: this.$route.name,
              query: {
                pro_name: this.query.pro_name
              }
            })
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
    },
    //文件上传、下载相关事件
    handleImport() {
      // 导入学员按钮
      this.importId = this.$route.params.id;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      // 上传成功的回调  personsImport
      if (response.code === 200) {
        this.personsImport({
          data: {
            pro_id: this.getForm.pro_id,
            scfile: response.data.code
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible = false;
            this.initData();
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
    },
    //    返回
    handleBack() {
      this.$router.go(-1);
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
    this.initData();
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"));
    this.query = this.$route.query;
    if (this.query.random && this.query.random == this.$md5(`${this.query.apply_num}`)) {
      this.show_applyCheck = true
    }
  }
};
</script>

<style scoped>
.app-students-list-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
.handle-box {
  margin-top: 20px;
}
.upload {
  float: left;
  margin-left: 10px;
}
.search-box {
  width: 200px;
  float: right;
}
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

.dialog-footer-show {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.dialog-footer-none {
  display: none;
}
</style>
