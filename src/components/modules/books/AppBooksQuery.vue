<template>
  <div class="app-books-query">
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button @click.native="handleAll" type="primary " icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.start" placeholder="请选择" style="width: 120px">
                <el-option label="项目编号" :value="2">项目编号</el-option>
                <el-option label="项目名称" :value="1">项目名称</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                :placeholder="getForm.start===1?'搜索项目名称':'搜索项目编号'"
                v-model.trim="getForm.keywords"
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
      <div class="books-query-main">
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="xy" label="学院"></el-table-column>
          <el-table-column align="center" prop="item_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="item_num" label="项目编号"></el-table-column>
          <el-table-column align="center" label="课程举办日期">
            <template slot-scope="scope">
              <div>{{ scope.row.start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.stop_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上传时间">
            <template slot-scope="scope">{{ scope.row.saer_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" prop="number" label="人数"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click.native="handleInfo(scope.row)" type="text" size="mini">查看详情</el-button>
              <el-button type="text" @click.native="handlePrint(scope.row)" size="mini">打印</el-button>
              <el-button @click.native="handleDelete(scope.row)" type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
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
  name: "app-books-query",
  data() {
    return {
      total: 0,
      tableData: [],
      getForm: {
        keywords: "",
        start: 2, //（查询字段keyword：1 项目名称  2 编号）
        xy: null,
        page: 1,
        limit: 20
      }
    };
  },
  methods: {
    ...mapActions(["getBookQueryList", "deleteBookQuery"]),
    initData() {
      this.getBookQueryList({
        data: this.getForm
      }).then(data => {
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
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      // 搜索事件
      if (!this.getForm.keywords) {
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
      this.$router.push("/home/books/query/info/" + val.aid);
    },
    handlePrint(val) {
      // 打印
      this.$router.push("/home/books/query/print/" + val.aid);
    },
    handleDelete(val) {
      this.$confirm("此操作将彻底删除当前信息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteBookQuery({
            data: {
              id: val.aid
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
    handleSizeChange(pageSize) {
      // pageSize 改变时会触发
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      //  currentPage 改变时会触发
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

<style scoped>
.query-btn {
  margin-top: 20px;
  padding-bottom: 20px;
}
li span {
  color: #717171;
}
</style>
