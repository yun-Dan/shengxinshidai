<template>
  <div
    class="app-finance-charge-info"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div style="text-align: center">
          <span class="app-charge-info-title">{{ info.pro_name }} {{ info.pro_code }}</span>
        </div>
        <div class="fr" style="padding-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div style="padding-top: 20px">
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
          <el-table-column align="center" label="缴费人员编号" property="rybh" width="180"></el-table-column>
          <el-table-column align="center" label="缴费人姓名" property="ryxm"></el-table-column>
          <el-table-column align="center" property="sfxmdm" label="收费项目代码"></el-table-column>
          <el-table-column align="center" property="yjje" label="应缴金额（元）"></el-table-column>
          <el-table-column align="center" property="sjje" label="实缴金额（元）"></el-table-column>
        </el-table>
      </div>
      <div class="page-box" v-cloak>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="5"
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
  name: "app-finance-charge-info",
  data() {
    return {
      loading2: false,
      info: {},
      getForm: {
        code: null,
        page: 1,
        limit: 100
      },
      tableData: [],
      total: 0
    };
  },
  filters: {
    showJysj(time) {
      //  2018 12 12 15 18 35
      const Y = time.substring(0, 4);
      const M = time.substring(4, 6);
      const D = time.substring(6, 8);
      const H = time.substring(8, 10);
      const Min = time.substring(10, 12);
      const S = time.substring(12, 14);
      return Y + "-" + M + "-" + D + " " + H + ":" + Min + ":" + S;
    }
  },
  methods: {
    ...mapActions(["getFinanceChargeInfo"]),
    initData() {
      this.loading2 = true;
      if (this.loading2) {
        this.getFinanceChargeInfo({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            this.total = Data.dataCount;
            this.loading2 = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
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
    }
  },
  beforeMount() {
    if (sessionStorage.getItem("finance_charge_info")) {
      this.info = JSON.parse(sessionStorage.getItem("finance_charge_info"));
      this.$set(this.getForm, "code", this.info.pro_code);
    }
    if (this.getForm.code) {
      this.initData();
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("finance_charge_info");
  }
};
</script>

<style scoped>
.app-charge-info-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
</style>
