<template>
  <div
    class="app-majorunit-info"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div style="text-align: center">
          <span class="app-majorunit-info-title">{{ getForm.jf_dwmc }}</span>
        </div>
        <div class="fr" style="padding-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" label="课程开始日期">
            <template slot-scope="scope">{{ scope.row.px_start_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="课程结束日期">
            <template slot-scope="scope">{{ scope.row.px_end_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" prop="address" label="项目进度状态">
            <template slot-scope="scope">
              <span v-if="scope.row.pro_status===0">未提交</span>
              <span v-if="scope.row.pro_status===1" style="color: #e6a23c">待继续教育处审核</span>
              <span v-if="scope.row.pro_status===2" style="color: #e6a23c">待合同管理办公室审核</span>
              <span v-if="scope.row.pro_status===3" style="color: #67c23a">审核通过</span>
              <span v-if="scope.row.pro_status===4" style="color: #f56c6c">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="address" label="项目状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===0" style="color: #008000">正常</span>
              <span v-if="scope.row.status===1" style="color: #ff0000">报废</span>
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-majorunit-info",
  data() {
    return {
      loading2: false,
      getForm: {
        jf_dwmc: "",
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0
    };
  },
  methods: {
    ...mapActions(["getMajorunitInfo"]),
    initData() {
      this.loading2 = true;
      this.getMajorunitInfo({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.erro
          });
        }
        this.loading2 = false;
      });
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  beforeMount() {
    if (sessionStorage.getItem("jf_dwmc")) {
      this.$set(this.getForm, "jf_dwmc", sessionStorage.getItem("jf_dwmc"));
      this.initData();
    } else {
      this.$router.go(-1);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("jf_dwmc");
  }
};
</script>

<style scoped>
.app-majorunit-info-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
</style>
