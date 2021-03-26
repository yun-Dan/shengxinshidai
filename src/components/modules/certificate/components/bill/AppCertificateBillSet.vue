<template>
  <div
    class="app-certificate-bill-set"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
      </div>
      <div class="certificate-bill-set-main" v-cloak>
        <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <div class="grid-content bg-purple">
              <div style="border: 1px solid #ebeef5;border-bottom: none;margin-bottom: 20px">
                <el-table
                  :data="tableData"
                  :header-cell-style="{backgroundColor:'#fafafa'}"
                  style="width: 100%"
                >
                  <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
                  <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
                  <el-table-column align="center" prop="user_name" label="申领人"></el-table-column>
                  <el-table-column align="center" prop="certificate_num" label="证书数"></el-table-column>
                  <el-table-column align="center" prop="student_num" label="学生人数"></el-table-column>
                  <el-table-column align="center" label="证书费">
                    <template slot-scope="scope">{{ scope.row.fee }} 元</template>
                  </el-table-column>
                  <el-table-column align="center" width="90" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="mini"
                        @click.native="handleDelete(scope.$index)"
                        :disabled="tableData.length<2"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-form
                :inline="true"
                ref="addForm1"
                :model="addForm"
                label-width="140px"
                style="text-align: left"
              >
                <el-form-item label="经办人姓名：" :rules="[{required: true}]">
                  <el-input v-model.trim="addForm.user_name"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" :rules="[{required: true}]">
                  <el-input v-model.trim="addForm.user_tel"></el-input>
                </el-form-item>
              </el-form>
              <el-form
                :inline="true"
                ref="addForm2"
                :model="addForm"
                label-width="140px"
                style="text-align: left"
              >
                <el-form-item label="结算金额（元）：" :rules="[{required: true}]">
                  <el-input-number
                    v-model="addForm.account"
                    :precision="2"
                    :step="1"
                    :min="0"
                    controls-position="right"
                    disabled
                  ></el-input-number>
                  <!--元-->
                </el-form-item>
                <el-form-item label="学生总数：" :rules="[{required: true}]">
                  <el-input-number
                    :disabled="true"
                    v-model="addForm.student_total"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="证书总数：" :rules="[{required: true}]">
                  <el-input-number
                    :disabled="true"
                    v-model="addForm.certificate_num"
                    :step="1"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
              </el-form>
              <el-form
                ref="addForm3"
                :model="addForm"
                label-width="140px"
                style="text-align: left;padding-bottom: 200px"
              >
                <el-form-item v-if="is_update_note" label="本次修改说明：" :rules="[{required: true}]">
                  <el-row :gutter="20">
                    <el-col :span="16">
                      <div class="grid-content bg-purple">
                        <el-input type="textarea" v-model.trim="addForm.update_note"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="handleAddTrue(0)">保 存</el-button>
                  <el-button type="success" @click="handleAddTrue(1)">保存并提交</el-button>
                  <el-button @click="$router.go(-1)">取 消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-certificate-bill-set",
  data() {
    return {
      loading2: false,
      addForm: {
        cert_ids: "", // 多个证书申领标识字符串
        uid: 0,
        user_name: "", // 经手人
        user_tel: "", // 经手人电话
        account: 0, // 结算金额
        student_total: 0, // 学生人数
        certificate_num: 0, // 证书数量
        status: 0,
        update_note: ""
      },
      is_update_note: false,
      tableData: [],
      key: 1
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getCertificatesBalance",
      "addCertificatesBalance",
      "updateCertificatesBalance",
      "checkCertificatesBalance"
    ]),
    initData() {
      let billArr = sessionStorage.getItem("select_bill");
      if (billArr) {
        // 新增
        this.key = 1;
        const list = JSON.parse(billArr);
        this.tableData = list;
        let student_total = 0;
        let certificate_total = 0;
        let account = 0;
        let ids = this.tableData.map(item => {
          student_total += item.student_num;
          certificate_total += item.certificate_num;
          account += item.fee;
          return item.id;
        });
        let str_arr = ids.join(",");
        Object.assign(this.addForm, {
          cert_ids: str_arr,
          account: account,
          student_total: student_total,
          certificate_num: certificate_total,
          uid: this.userInfo.uid
        });
      } else {
        // 编辑
        this.loading2 = true;
        this.key = 0;
        const ID = sessionStorage.getItem("select_bill_edit");
        this.getCertificatesBalance({
          data: {
            id: ID
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.loading2 = false;
            const Data = data.data.data.list;
            this.tableData = Data.cert_detail;
            Object.assign(this.addForm, Data);
            if (Data.status === 2) {
              this.is_update_note = true;
            } else {
              this.is_update_note = false;
            }
            for (let key in this.addForm) {
              if (!this.$options.data().addForm.hasOwnProperty([key])) {
                delete this.addForm[key];
              }
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
                this.$router.go(-1);
              }
            });
          }
        });
      }
    },
    handleAddTrue(status) {
      if (!this.addForm.user_name) {
        this.$message({
          type: "warning",
          message: "请输入经办人姓名！"
        });
        return false;
      }
      if (!this.addForm.user_tel) {
        this.$message({
          type: "warning",
          message: "请输入联系方式！"
        });
        return false;
      }
      if (!this.addForm.account) {
        this.$message({
          type: "warning",
          message: "请输入结算金额！"
        });
        return false;
      }
      if (this.is_update_note) {
        if (!this.addForm.update_note) {
          this.$message({
            type: "warning",
            message: "请输入本次修改说明！"
          });
          return false;
        }
      } else {
        delete this.addForm.update_note;
      }
      this.loading2 = true;

      Object.assign(this.addForm, {
        status: status
      });
      if (this.key) {
        this.addCertificatesBalance({
          data: this.addForm
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            // this.$router.push("/home/certificate/bill");
            this.$router.go(-1);
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      } else {
        const ID = sessionStorage.getItem("select_bill_edit");
        const obj = {};
        Object.assign(obj, this.addForm, {
          id: ID,
          status: status
        });
        this.updateCertificatesBalance({
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            // this.$router.push("/home/certificate/bill");
            this.$router.go(-1);
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      }
    },
    handleDelete(index) {
      this.tableData.splice(index, 1);
      let student_total = 0;
      let certificate_total = 0;
      let account = 0;
      let ids = this.tableData.map(item => {
        student_total += item.student_num;
        certificate_total += item.certificate_num;
        account += item.fee;
        return item.id;
      });
      let str_arr = ids.join(",");
      Object.assign(this.addForm, {
        cert_ids: str_arr,
        account: account,
        student_total: student_total,
        certificate_num: certificate_total,
        uid: this.userInfo.uid
      });
      sessionStorage.setItem("select_bill", JSON.stringify(this.tableData));
    }
  },
  beforeMount() {
    this.initData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("select_bill");
    sessionStorage.removeItem("select_bill_edit");
  }
};
</script>

<style scoped>
.certificate-bill-set-main {
  padding-top: 20px;
}
</style>
