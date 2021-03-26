<template>
  <div class="app-assess-send">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fr" style="padding-right: 40px">
          <el-button @click.native="handleBack" type="primary">返回</el-button>
        </div>
      </div>
      <div class="assess-send-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">{{ scope.$index+1}}</template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="姓名"></el-table-column>
          <el-table-column align="center" prop="resign" label="职务"></el-table-column>
          <el-table-column align="center" prop="cpmpany" label="单位名称"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号" min-width="120"></el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination layout="total" :total="tableData.length"></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-assess-pc-send",
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    ...mapActions(["getAssessAnsusers"]),
    initData() {
      const obj = sessionStorage.getItem("lookSend");
      if (obj) {
        const Data = JSON.parse(obj);
        this.getAssessAnsusers({
          data: Data
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleBack() {
      let query = this.$route.query;
      if (query.pro_name) {
        sessionStorage.setItem("Pro_name", query.pro_name);
      }
      this.$router.go(-1);
    }
  },
  beforeMount() {
    this.initData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("lookSend");
  }
};
</script>

<style scoped>
.assess-send-main {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
