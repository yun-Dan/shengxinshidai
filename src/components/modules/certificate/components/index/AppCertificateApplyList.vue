<template>
  <div class="app-certificate-apply-list" ref="abc">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fr" style="margin-right: 30px">
          <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
        </div>
        <div style="text-align: center;line-height: 38px">
          <span class="app-certificate-apply-list-title">{{ title }}</span>
        </div>
      </div>
      <div v-cloak>
        <el-table :data="tableData" :default-expand-all="true" style="width: 100%">
          <el-table-column align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" label="证书项目名称">
            <template slot-scope="scope">
              <span v-if="scope.row.cert_name">{{ scope.row.cert_name }}</span>
              <span v-else style="color: #f56c6c">无修改名称</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请修改日期">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
              <span v-if="scope.row.status===2" style="color: #f56c6c">不通过</span>
              <span v-if="scope.row.status===3" style="color: #67c23a">通过</span>
              <div v-if="scope.row.status===2">
                <span>【原因】：</span>
                <span>{{ scope.row.content }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="详情">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.mod_content" :key="index">
                <span>{{ index+1}}、</span>
                <template v-if="item.field_name==='edit_students'">
                  <span style="color: #909399">{{ item.field_desc }}</span>
                  <template v-for="(f, k) in Fields">
                      <template v-if="item[`new_${k}`] !== item[`old_${k}`]">
                        <span class="mod-border" :key="`${k}-old`">{{ item[`old_${k}`] }}</span>
                        <span style="color: #909399" :key="k">修改为</span>
                        <span class="mod-border" :key="`${k}-new`">{{ item[`new_${k}`] }}</span>
                      </template>
                    </template>
                </template>
                <template v-else>
                  <!-- 修改 -->
                  <template v-if="item.before_cont && item.after_cont">
                    <span style="color: #909399">{{ item.field_desc }}</span>
                    <template v-if="item.field_name==='cert_start_time' || item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.before_cont | TimestampChangeFilter }}</span>
                    </template>
                    <template v-else-if="item.field_name==='edit_students'">
                      <template v-for="(f, k) in Fields">
                        <template v-if="item[`new_${k}`] !== item[`old_${k}`]">
                          <span class="mod-border" :key="`${k}-old`">{{ item[`old_${k}`] }}</span>
                          <span style="color: #909399" :key="k">修改为</span>
                          <span class="mod-border" :key="`${k}-new`">{{ item[`new_${k}`] }}</span>
                        </template>
                      </template>
                    </template>
                    <span v-else class="mod-border">{{ item.before_cont }}</span>
                    <span style="color: #909399">{{ item.field_name==='edit_students' ? '' : '修改为' }}</span>
                    <template v-if="item.field_name==='cert_start_time'||item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.after_cont | TimestampChangeFilter }}</span>
                    </template>
                    <template v-else-if="item.field_name==='edit_students'"></template>
                    <span v-else class="mod-border">{{ item.after_cont }}</span>
                  </template>
                  <!-- 新增 -->
                  <template v-if="!item.before_cont && item.after_cont">
                    <span style="color: #909399">
                      <template v-if="item.field_name === 'add_students'">新增学生</template>
                      <template v-else>新增{{ item.field_desc }}</template>
                    </span>
                    <template v-if="item.field_name==='cert_start_time'||item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.after_cont | TimestampChangeFilter }}</span>
                    </template>
                    <span v-else class="mod-border">{{ item.after_cont }}</span>
                  </template>
                  <!-- 删除 -->
                  <template v-if="item.before_cont && !item.after_cont">
                    <span style="color: #909399">删除{{ item.field_desc }}</span>
                    <template v-if="item.field_name==='cert_start_time'||item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.before_cont | TimestampChangeFilter }}</span>
                    </template>
                    <span v-else class="mod-border">{{ item.before_cont }}</span>
                  </template>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="修改说明">
            <template slot-scope="scope">
              <span v-if="scope.row.cert_name">{{ scope.row.note }}</span>
              <span v-else style="color: #f56c6c">无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="100px">
            <template slot-scope="scope">
              <template v-if="userInfo.role===1">
                <el-button
                  v-if="scope.row.status===1"
                  type="text"
                  @click.native="handleCheck(scope.row)"
                >审核</el-button>
                <template v-if="scope.row.status===3">
                  <!-- <el-button
                    v-if="scope.row.down_type===1||scope.row.down_type===2"
                    type="text"
                    @click.native="handleDownload(scope.row, query.types)"
                  >导出{{query.types == 2 ? 'PDF' : 'Word'}}证书</el-button> -->
                  <template v-if="scope.row.down_type===1||scope.row.down_type===2">
                    <el-button
                      type="text"
                      @click.native="handleDownload(scope.row, 1)"
                    >导出Word证书</el-button>
                    <el-button
                      v-if="scope.row.zip"
                      type="text"
                      @click.native="handleDownload(scope.row, 2)"
                    >导出PDF证书</el-button>
                  </template>
                </template>
              </template>
              <template v-if="userInfo.role===2">
                <el-button
                  v-if="scope.row.status===1"
                  type="text"
                  @click.native="handleApplyPrint(scope.row)"
                >打印申请修改</el-button>
                <template v-if="scope.row.status===3&&is_ss&&auth_cert">
                  <!-- <el-button
                    v-if="scope.row.down_type===1||scope.row.down_type===2"
                    type="text"
                    @click.native="handleDownload(scope.row, query.types)"
                  >导出{{query.types == 2 ? 'PDF' : 'Word'}}证书</el-button> -->
                  <template v-if="scope.row.down_type===1||scope.row.down_type===2">
                    <el-button
                      type="text"
                      @click.native="handleDownload(scope.row, 1)"
                    >导出Word证书</el-button>
                    <el-button
                      v-if="scope.row.zip"
                      type="text"
                      @click.native="handleDownload(scope.row, 2)"
                    >导出PDF证书</el-button>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="checkStatus" class="certificate-apply-list-check">
          <el-form :model="form" label-width="120px" @submit.native.prevent>
            <el-form-item label="证书项目名称：">
              <span v-if="checkData.cert_name" class="apply-check-item">{{ checkData.cert_name }}</span>
              <span v-else style="color: #f56c6c">无修改名称</span>
            </el-form-item>
            <el-form-item label="申请修改日期：">
              <span class="apply-check-item">{{ checkData.create_time | TimestampChangeFilter }}</span>
            </el-form-item>
            <el-form-item label="详情：">
              <div v-for="(item,index) in checkData.mod_content" :key="index">
                <span>{{ index+1}}、</span>
                <template v-if="item.field_name==='edit_students'">
                  <span style="color: #909399">{{ item.field_desc }}</span>
                  <template v-for="(f, k) in Fields">
                    <template v-if="item[`new_${k}`] !== item[`old_${k}`]">
                      <span class="mod-border" :key="`${k}-old`">{{ item[`old_${k}`] }}</span>
                      <span style="color: #909399" :key="k">修改为</span>
                      <span class="mod-border" :key="`${k}-new`">{{ item[`new_${k}`] }}</span>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <!-- 修改 -->
                  <template v-if="item.before_cont && item.after_cont">
                    <span style="color: #909399">{{ item.field_desc }}</span>
                    <template v-if="item.field_name==='cert_start_time' || item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.before_cont | TimestampChangeFilter }}</span>
                    </template>
                    <template v-else-if="item.field_name==='edit_students'">
                      <template v-for="(f, k) in Fields">
                        <template v-if="item[`new_${k}`] !== item[`old_${k}`]">
                          <span class="mod-border" :key="`${k}-old`">{{ item[`old_${k}`] }}</span>
                          <span style="color: #909399" :key="k">修改为</span>
                          <span class="mod-border" :key="`${k}-new`">{{ item[`new_${k}`] }}</span>
                        </template>
                      </template>
                    </template>
                    <span v-else class="mod-border">{{ item.before_cont }}</span>
                    <span style="color: #909399">{{ item.field_name==='edit_students' ? '' : '修改为' }}</span>
                    <template v-if="item.field_name==='cert_start_time'||item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.after_cont | TimestampChangeFilter }}</span>
                    </template>
                    <template v-else-if="item.field_name==='edit_students'"></template>
                    <span v-else class="mod-border">{{ item.after_cont }}</span>
                  </template>
                  <!-- 新增 -->
                  <template v-if="!item.before_cont && item.after_cont">
                    <span style="color: #909399">
                      <template v-if="item.field_name === 'add_students'">新增学生</template>
                      <template v-else>新增{{ item.field_desc }}</template>
                    </span>
                    <template v-if="item.field_name==='cert_start_time'||item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.after_cont | TimestampChangeFilter }}</span>
                    </template>
                    <span v-else class="mod-border">{{ item.after_cont }}</span>
                  </template>
                  <!-- 删除 -->
                  <template v-if="item.before_cont && !item.after_cont">
                    <span style="color: #909399">删除{{ item.field_desc }}</span>
                    <template v-if="item.field_name==='cert_start_time'||item.field_name==='cert_end_time'">
                      <span class="mod-border">{{ item.before_cont | TimestampChangeFilter }}</span>
                    </template>
                    <span v-else class="mod-border">{{ item.before_cont }}</span>
                  </template>
                </template>
              </div>
            </el-form-item>
            <el-form-item label="申请修改说明：">{{ checkData.note }}</el-form-item>
            <el-form-item label="最近审核状态：">
              <span v-if="checkData.status===1" style="color: #e6a23c">待审核</span>
              <span v-if="checkData.status===2" style="color: #f56c6c">不通过</span>
              <span v-if="checkData.status===3" style="color: #67c23a">通过</span>
            </el-form-item>
            <el-form-item label="审核结果：" :rules="[{required:true}]">
              <el-radio-group v-model="form.status">
                <el-radio :label="3">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.status===2" label="不通过原因：" :rules="[{required:true}]">
              <el-input type="textarea" v-model.trim="form.content" :rows="5"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.native="checkStatus = false">取 消</el-button>
              <el-button type="primary" @click="handleTrue">确 认</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="page-box">
          <el-pagination layout="total" :total="tableData.length"></el-pagination>
        </div>
      </div>
    </el-card>
    <!--弹窗（打印格式）-->
    <el-dialog
      center
      title="选择Word版本确认后导出全部学员证书"
      :visible.sync="dialogVisible3"
      width="500px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-cloak>
        <div v-if="!is_ss&&!auth_cert" style="margin-bottom: 30px;text-align: center">
          <el-radio v-model="is_new" :label="1">新版</el-radio>
          <el-radio v-model="is_new" :label="0">旧版</el-radio>
        </div>
        <template v-if="is_new">
          <div v-if="!(is_picture===2&&language===2&&is_language ===3)" style="margin-bottom: 20px">
            <el-radio-group :key="1" v-model="is_picture" size="small">
              <el-radio :key="111" :label="1" border :disabled="is_picture===1?false:true">无照片</el-radio>
              <el-radio :key="112" :label="2" border :disabled="is_picture===2?false:true">有照片</el-radio>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 20px">
            <el-radio-group :key="2" v-model="language" size="small">
              <template v-if="is_language===1">
                <el-radio :key="211" :label="1" border>中文证书</el-radio>
                <el-radio :key="212" :label="2" border :disabled="true">EN 证书</el-radio>
              </template>
              <template v-if="is_language===2">
                <el-radio :key="221" :label="1" border :disabled="true">中文证书</el-radio>
                <el-radio :key="222" :label="2" border>EN 证书</el-radio>
              </template>
              <template v-if="is_language===3">
                <el-radio :key="231" :label="1" border>中文证书</el-radio>
                <el-radio :key="232" :label="2" border>EN 证书</el-radio>
              </template>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group :key="3" v-model="wordType" size="small">
              <template v-if="is_ss">
                <template v-if="is_picture===2&&language===2&&is_language === 3">
                  <el-radio :key="322" :label="2" border>B5 版（无照片）</el-radio>
                </template>
                <template v-else>
                  <el-radio :key="322" :label="2" border>B5 版</el-radio>
                </template>
              </template>
              <template v-else>
                <template v-if="is_picture===2&&language===2&&is_language === 3">
                  <el-radio :key="321" :label="1" border disabled>A4 版</el-radio>
                  <el-radio :key="322" :label="2" border>B5 版（无照片）</el-radio>
                  <el-radio :key="323" :label="3" border disabled>B5 暑期版</el-radio>
                </template>
                <template v-else>
                  <el-radio :key="321" :label="1" border :disabled="language===2?true:false">A4 版</el-radio>
                  <el-radio
                    :key="322"
                    :label="2"
                    border
                    :disabled="is_picture===2&&language===2?true:false"
                  >B5 版</el-radio>
                  <el-radio :key="323" :label="3" border :disabled="language===2?true:false">B5 暑期版</el-radio>
                </template>
              </template>
            </el-radio-group>
          </div>
        </template>
        <template v-else>
          <div style="margin-bottom: 20px">
            <el-radio-group :key="1" v-model="is_picture" size="small">
              <el-radio :key="111" :label="1" border :disabled="is_picture===1?false:true">无照片</el-radio>
              <el-radio :key="112" :label="2" border :disabled="is_picture===2?false:true">有照片</el-radio>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 20px">
            <el-radio-group :key="2" v-model="language" size="small">
              <template v-if="is_language===1">
                <el-radio :key="211" :label="1" border>中文证书</el-radio>
                <el-radio :key="212" :label="2" border :disabled="true">EN 证书</el-radio>
              </template>
              <template v-if="is_language===2">
                <el-radio :key="221" :label="1" border :disabled="true">中文证书</el-radio>
                <el-radio :key="222" :label="2" border>EN 证书</el-radio>
              </template>
              <template v-if="is_language===3">
                <el-radio :key="231" :label="1" border>中文证书</el-radio>
                <el-radio :key="232" :label="2" border>EN 证书</el-radio>
              </template>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group :key="3" v-model="wordType" size="small">
              <template v-if="is_ss">
                <el-radio :key="311" v-if="language===2&&is_picture===1" :label="2" border>B5 版</el-radio>
              </template>
              <template v-else>
                <el-radio
                  :key="322"
                  v-if="(language===2&&is_picture===1)||language===1"
                  :label="2"
                  border
                >B5 版</el-radio>
              </template>
            </el-radio-group>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible3 = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="handlePrint"
          :disabled="!(is_picture&&language&&wordType)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { MATE } from '@/assets/js/config.special.js'
const Fields = {
  name: "姓名", // 姓名
  // sex: '性别', // 性别
  // national: '民族', // 民族
  // idcard: "身份证号", // 身份证
  // mobile: "手机号码", // 手机号
  // email: "邮箱", // 邮箱
  // company: "工作单位", // 单位
  // resign: "职务", // 职务
}
export default {
  name: "app-certificate-apply-list",
  data() {
    return {
      headers: {},
      title: "",
      tableData: [],
      checkStatus: false,
      checkData: {},
      form: {
        id: 0,
        status: 3,
        content: ""
      },
      //    导出
      dialogVisible3: false,
      is_picture: 0,
      is_language: 0,
      language: 1,
      wordType: 2,
      wordId: 0,
      down_ids: "",
      //深圳研究院和国际学院（苏州研究院）工作人员自己可以在系统上查看立项通知书并打印（管理员审核通过）
      is_ss: false,
      is_ss_auth: false,
      auth_cert: false,
      //    打印新版/旧版（默认新版）
      is_new: 1,
      // 学员信息修改字段
      Fields,
      query: {}
    };
  },
  computed: {
    ...mapState(["URL", "certificateExorpUrl", "certificateExorpOldUrl", 'userInfo'])
  },
  methods: {
    ...mapActions(["getCertificatesModifyList", "checkCertificatesModify"]),
    initData() {
      let ID = this.$route.params.id;
      if (ID) {
        this.getCertificatesModifyList({
          data: {
            cert_id: ID
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            if (sessionStorage.getItem("CheckStatus")) {
              let list = this.tableData.filter(item => {
                return item.status === 1;
              });
              this.handleCheck(list[0]);
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
    handleCheck(val) {
      Object.assign(this.checkData, val);
      this.checkStatus = true;
    },
    handleTrue() {
      if (this.form.status === 2) {
        if (!this.form.content) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      }
      this.$set(this.form, "id", this.checkData.id);
      this.checkCertificatesModify({
        data: this.form
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          sessionStorage.removeItem("CheckStatus");
          this.initData();
          this.checkStatus = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleDownload(val, types) {
      if (types == 2) {
        window.open(`${this.URL}${val.zip}`)
      } else {
        this.is_new = 1;
        this.is_picture = val.is_photo; // 1有照片、2无照片
        this.is_language = val.is_bilingual; //1中文证书 、2英文证书、 3中英文证书
        this.language = val.is_bilingual === 2 ? 2 : 1;
        this.wordType = 2;
        if (this.is_ss) {
          this.wordType = this.language == 1 ? 2 : 2;
        }
        this.dialogVisible3 = true;
        this.wordId = val.cert_id;
        this.down_ids = val.down_ids;
      }
    },
    handlePrint() {
      let type = "";
      const img = this.is_picture; // 1、无照片  2、有照片
      const en = this.language; // 1、中文  2、英文
      const ab = this.wordType; // 1、A4  2、B5  3、B5暑期

      if (img === 1 && en === 1 && ab === 1) {
        type = "n_a4";
      } else if (img === 1 && en === 1 && ab === 2) {
        type = "n_b5";
      } else if (img === 2 && en === 1 && ab === 1) {
        type = "img_a4";
      } else if (img === 1 && en === 1 && ab === 3) {
        type = "holi_b5";
      } else if (img === 1 && en === 2 && ab === 2) {
        type = "n_b5en";
      } else if (img === 2 && en === 1 && ab === 2) {
        type = "img_b5";
      } else if (img === 2 && en === 1 && ab === 3) {
        type = "img_holi_b5";
      } else if (img === 2 && en === 2 && ab === 2) {
        type = "n_b5en";
      }
      const hre =
        this.URL +
        (this.is_new ? this.certificateExorpUrl : this.certificateExorpOldUrl) +
        "?cert_id=" +
        this.wordId +
        "&type=" +
        type +
        (this.down_ids ? "&certinfo_ids=" + this.down_ids : "") +
        "&authkey=" +
        this.headers.authkey +
        "&sessionid=" +
        this.headers.sessionid +
        "&tp=2";
      window.open(hre);
      this.dialogVisible3 = false;
    },
    //打印申请
    handleApplyPrint(val) {
      sessionStorage.setItem("apply_content_INFO", JSON.stringify(val));
      this.$router.push("/home/certificate/index/apply/print");
    }
  },
  beforeMount() {
    this.query = this.$route.query
    if (this.userInfo.role === 2 && this.userInfo.college) {
      if (MATE('certificate_download', this.userInfo.college)) {
        this.is_ss = true;
        if (this.userInfo.auth_college) {
          this.is_ss_auth = true;
        }
        if (this.userInfo.auth_cert) {
          this.auth_cert = true;
        }
      }
    }
    if (this.$cookie.get("headers")) {
      this.headers = JSON.parse(this.$cookie.get("headers"));
    }
    if (sessionStorage.getItem("apply_pro")) {
      this.title = sessionStorage.getItem("apply_pro");
      this.initData();
    } else {
      // this.$router.push("/home/certificate/index");
      this.$router.go(-1);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("apply_pro");
    sessionStorage.removeItem("CheckStatus");
  },
  watch: {
    "form.is_bilingual"() {
      if (this.dialogVisible1) {
        this.$set(this.form, "is_photo", 1);
      }
    },
    language() {
      //is_picture;    // 1、无照片  2、有照片
      // language    1、2
      //wordType;    // 1、A4  2、B5  3、B5暑期
      if (this.is_ss) {
        if (this.language === 1) {
          if (this.is_new) {
            this.wordType = 2;
          } else {
            this.wordType = 0;
          }
        } else if (this.language === 2) {
          if (this.is_picture === 1) {
            this.wordType = 2;
          } else if (this.is_picture === 2) {
            this.wordType = 0;
          }
        }
      } else {
        if (this.language === 1) {
          this.wordType = 2;
        } else if (this.language === 2) {
          if (this.is_picture === 1) {
            this.wordType = 2;
          } else if (this.is_picture === 2) {
            this.wordType = 0;
          }
        }
      }
    },
    is_new() {
      this.wordType = null;
    }
  }
};
</script>

<style scoped>
.box-card {
  padding-bottom: 50px;
}
.app-certificate-apply-list-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
.mod-border {
  padding: 0 4px;
  border-bottom: 1px solid #606266;
}
.certificate-apply-list-check {
  padding: 50px;
}
</style>
