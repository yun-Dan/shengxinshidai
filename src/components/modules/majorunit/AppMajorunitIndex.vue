<template>
  <div
    class="app-majorunit-index"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"  >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl" style="padding-bottom: 10px">
          <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-input
                placeholder="搜索委托单位名称"
                v-model.trim="getForm.jf_dwmc"
                class="input-with-select"
                clearable
                style="width: 200px"
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="app-majorunit-index-main" v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="jf_dwmc" label="委托单位名称"></el-table-column>
          <el-table-column align="center" prop="pro_num" label="办班数量统计"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click.native="handleInfo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
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
  name: "app-majorunit-index",
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
    ...mapActions(["getMajorunit"]),
    initData() {
      this.loading2 = true;
      this.getMajorunit({
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
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      // 搜索事件
      if (!this.getForm.jf_dwmc) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
      }
    },
    handleInfo(val) {
      sessionStorage.setItem("jf_dwmc", val.jf_dwmc);
      this.$router.push("/home/majorunit/index/info");
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
  created() {
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>
