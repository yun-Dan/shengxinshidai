<template>
  <div class="app-certificate-bill-info" v-cloak>
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
      </div>
      <div v-cloak style="width: 900px;margin: 0 auto">
        <div style="border: 1px solid #ebeef5;border-bottom: none;margin-top: 20px">
          <el-table
            :data="showData.cert_detail"
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
          </el-table>
        </div>
        <!--详情-->
        <el-form label-width="160px" :inline="true" style="text-align: left;margin-top: 30px">
          <el-form-item label="经办人：" style="width: 30%">{{ showData.user_name }}</el-form-item>
          <el-form-item label="申领学生总数：" style="width: 30%">{{ showData.student_total}} 人</el-form-item>
          <el-form-item label="结算金额：" style="width: 30%">{{ showData.account }} 元</el-form-item>
          <el-form-item label="联系电话：" style="width: 30%">{{ showData.user_tel}}</el-form-item>
          <el-form-item label="证书制作总数：" style="width: 30%">{{ showData.certificate_num}} 人次</el-form-item>
          <el-form-item label="审核状态：" style="width: 30%">
            <span v-if="showData.status===0">未提交</span>
            <span v-if="showData.status===1" style="color: #e6a23c">待审核</span>
            <span v-else-if="showData.status===2" style="color: #f56c6c">不通过</span>
            <span v-else-if="showData.status===3" style="color: #67c23a">通过</span>
            <span v-else>无</span>
          </el-form-item>
        </el-form>
        <!--审核-->
        <el-form v-if="is_check" label-width="160px" style="text-align: left;margin-top: 30px" @submit.native.prevent>
          <el-form-item label="审核结果：" :rules="[{required:true}]">
            <el-radio-group v-model="checkForm.status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见说明：" :rules="[{required:true}]">
            <el-input type="textarea" v-model.trim="checkForm.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click.native="handleTrue">确 定</el-button>
            <el-button type @click.native="$router.go(-1)">返 回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-certificate-bill-info",
  data() {
    return {
      showData: {
        user_name: "",
        user_tel: "",
        account: "",
        student_total: 0,
        certificate_num: 0,
        status: -1,
        review_time: 0,
        cert_detail: []
      },
      is_check: false,
      checkForm: {
        id: 0,
        uid: 0,
        status: 3,
        content: ""
      }
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getCertificatesBalance", "checkCertificatesBalance"]),
    initData(id) {
      this.getCertificatesBalance({
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data.list;
          this.showData = Data;
          Object.assign(this.checkForm, {
            id: Data.id,
            uid: this.userInfo.uid
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleTrue() {
      if (this.checkForm.status === 2) {
        if (!this.checkForm.content) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      }
      this.checkCertificatesBalance({
        data: this.checkForm
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data,
            duration: 1000,
            onClose: () => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    }
  },
  beforeMount() {
    const path = this.$route;
    if (path.fullPath.indexOf("check") > 0) {
      this.is_check = true;
    } else {
      this.is_check = false;
    }
    this.initData(path.params.id);
  }
};
</script>
