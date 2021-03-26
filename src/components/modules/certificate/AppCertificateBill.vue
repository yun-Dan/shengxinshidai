<template>
  <div
    class="app-certificate-bill"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card>
      <!--操作-->
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/certificate/bill/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <template v-if="userInfo.role===1">
              <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
            </template>
            <template v-if="userInfo.role===2">
              <el-button @click.native="handleAdd" type="primary" icon="el-icon-plus">新增</el-button>
              <el-button @click.native="handleAll" type icon="el-icon-menu">全部</el-button>
            </template>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.status" placeholder="结算状态">
                <el-option label="-- 结算状态 --" :value="'0,1,2,3'"></el-option>
                <el-option label="未提交" :value="0"></el-option>
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="审核未通过" :value="2"></el-option>
                <el-option label="审核通过" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索经办人姓名"
                v-model="getForm.user_name"
                class="input-with-select"
                clearable
                style="width: 210px"
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" v-cloak :default-expand-all="true" style="width: 100%">
        <el-table-column align="center" label="序号" width="48">
          <template slot-scope="scope">
            <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="user_name" label="经办人"></el-table-column>
        <el-table-column align="center" prop="user_tel" label="联系电话"></el-table-column>
        <el-table-column align="center" label="结算金额（元）" prop="account"></el-table-column>
        <el-table-column align="center" prop="certificate_num" label="证书制作数"></el-table-column>
        <el-table-column align="center" prop="student_total" label="学生人数"></el-table-column>
        <el-table-column align="center" label="审核时间">
          <template slot-scope="scope">
            <span v-if="scope.row.review_time">{{ scope.row.review_time | TimestampChangeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===0">未提交</span>
            <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
            <span v-else-if="scope.row.status===2" style="color: #f56c6c">不通过</span>
            <span v-else-if="scope.row.status===3" style="color: #67c23a">通过</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <template v-if="userInfo.role===1">
              <template v-if="scope.row.status===1">
                <el-button type="text" @click.native="handleCheck(scope.row)">审核</el-button>
              </template>
              <template v-if="scope.row.status===2">
                <div>
                  <el-button type="text" @click.native="handleInfo(scope.row)">查看详情</el-button>
                </div>
                <div>
                  <el-button type="text" @click.native="handleCheck(scope.row)">重新审核</el-button>
                </div>
              </template>
              <template v-if="scope.row.status===3">
                <!--<div><el-button type="text" @click.native="handlePrint(scope.row)">打印结算凭证</el-button></div>-->
                <div>
                  <el-button type="text" @click.native="handleCheck(scope.row)">重新审核</el-button>
                </div>
              </template>
            </template>
            <template v-if="userInfo.role===2">
              <template v-if="scope.row.status===0">
                <el-button type="text" @click.native="handleEdit(scope.row)">编辑</el-button>
              </template>
              <template v-if="scope.row.status===1">
                <!--<el-button type="text" @click.native="handleInfo(scope.row)">查看详情</el-button>-->
                <div>
                  <el-button type="text" @click.native="handlePrint(scope.row)">打印结算凭证</el-button>
                </div>
              </template>
              <template v-if="scope.row.status===2">
                <el-button type="text" @click.native="handleEdit(scope.row)">编辑</el-button>
              </template>
              <template v-if="scope.row.status===3">
                <!--<div><el-button type="text" @click.native="handlePrint(scope.row)">打印结算凭证</el-button></div>-->
                <div>
                  <el-button type="text" @click.native="handleInfo(scope.row)">查看详情</el-button>
                </div>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="page-box">
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
    <!--证书列表-->
    <el-dialog
      title="领取证书项目列表"
      center
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <div>
        <el-table
          v-cloak
          :data="applyTable"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <!--<el-table-column-->
          <!--align="center"-->
          <!--label="证书名称">-->
          <!--<template slot-scope="scope">-->
          <!--<div>{{ scope.row.cert_name }}</div>-->
          <!--<div v-if="scope.row.cert_name_en" style="color: #5daf34">{{ scope.row.cert_name_en}}</div>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="center" prop="user_name" label="申领人"></el-table-column>
          <el-table-column align="center" prop="certificate_num" label="证书数"></el-table-column>
          <el-table-column align="center" prop="student_num" label="学生人数"></el-table-column>
          <el-table-column align="center" prop="fee" label="证书费">
            <template slot-scope="scope">{{ scope.row.fee }} 元</template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-certificate-bill",
  data() {
    return {
      loading2: false,
      tableData: [],
      total: 0,
      getForm: {
        page: 1,
        limit: 20,
        status: "0,1,2,3",
        user_name: "",
        is_deleted: 1
      },
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      dialogVisible: false,
      applyTable: [],
      selectList: [],
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getCertificatesBalanceApplyList",
      "getCertificatesBalanceList",
      "updateCertificatesBalance"
    ]),
    initData() {
      this.loading2 = true;
      this.getCertificatesBalanceList({
        data: this.getForm
      }).then(data => {
        this.loading2 = false;
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.tableData = Data.list;
          this.total = Data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleAdd() {
      this.loading2 = true;
      this.dialogVisible = true; //
      this.getCertificatesBalanceApplyList({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          this.applyTable = data.data.data.list;
          this.loading2 = false;
          this.dialogVisible = true;
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
    },
    handleTrue() {
      if (this.selectList.length) {
        sessionStorage.setItem("select_bill", JSON.stringify(this.selectList)); // 设置要结算的证书列表
        this.$router.push({
          path: "/home/certificate/bill/set",
          query: this.$route.query
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择要结算证书的项目！"
        });
      }
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      this.$set(this.getForm, "page", 1);
      this.initData();
    },
    handleEdit(val) {
      sessionStorage.setItem("select_bill_edit", val.id); // 编辑证书结算信息
      this.$router.push({
        path: "/home/certificate/bill/set",
        query: this.$route.query
      });
    },
    handleInfo(val) {
      this.$router.push("/home/certificate/bill/info/" + val.id);
    },
    handleCheck(val) {
      this.$router.push("/home/certificate/bill/check/" + val.id);
    },
    handlePrint(val) {
      this.$router.push({
        path: `/home/certificate/bill/print/${val.id}`,
        query: {
          v_time: val.create_time * 1000
        }
      });
    },
    handleSizeChange(pageSize) {
      // pageSize 改变时会触发
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      //  currentPage 改变时会触发
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      // console.log(this.$el.offsetParent.offsetParent,'滚动元素');
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleSelectionChange(val) {
      //checkbox变化时触发
      this.selectList = val;
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount () {
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  },
  watch: {
    "getForm.status"() {
      this.initData();
    }
  }
};
</script>

<style scoped>
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
</style>
