<template>
  <div class="app-books-query-info">
    <el-card>
      <div slot="header" class="clearfix">
        <div class="fr" style="margin-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
        </div>
      </div>
      <div class="books-query-info-main" v-cloak>
        <div class="query-info-top">
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <ul>
                  <li>
                    <strong>主办学院</strong>：
                    <span>{{ showData.xy }}</span>
                  </li>
                  <li>
                    <strong>项目名称</strong>：
                    <span>{{ showData.item_name }}</span>
                  </li>
                  <li>
                    <strong>开始时间</strong>：
                    <span>{{ showData.start_time | TimestampChangeFilter }}</span>
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col :span="10" :offset="2">
              <div class="grid-content bg-purple">
                <ul>
                  <li>
                    <strong>项目编号</strong>：
                    <span>{{ showData.item_num }}</span>
                  </li>
                  <li>
                    <strong>上传时间</strong>：
                    <span>{{ showData.saer_time | TimestampChangeFilter }}</span>
                  </li>
                  <li>
                    <strong>结束时间</strong>：
                    <span>{{ showData.stop_time | TimestampChangeFilter }}</span>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="query-info-box">
          <el-table :data="showList" border :header-cell-style="{backgroundColor:'#fafafa'}">
            <el-table-column property="num" label="证书编号" align="center" width="150px"></el-table-column>
            <el-table-column property="username" label="姓名" align="center" width="100px"></el-table-column>
            <el-table-column property="work_unit" label="工作单位" align="center"></el-table-column>
            <el-table-column property="zhiwei" label="职位" align="center" width="120px"></el-table-column>
            <el-table-column property="tel" label="联系方式" align="center" width="130px"></el-table-column>
            <el-table-column property="email" label="邮箱" align="center"></el-table-column>
            <el-table-column property="bz" label="备注" align="center"></el-table-column>
          </el-table>
        </div>
        <!--<div class="query-btn">-->
        <!--<el-button @click.native="$router.go(-1)" >返回</el-button>-->
        <!--<el-button @click.native="handlePrint" type="success">打印</el-button>-->
        <!--</div>-->
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-books-query-info",
  data() {
    return {
      showData: {
        xy: "",
        item_name: "",
        item_num: "",
        saer_time: null,
        start_time: null,
        stop_time: null
      },
      showList: []
    };
  },
  methods: {
    ...mapActions(["getBookQueryInfo"]),
    initData(id) {
      this.getBookQueryInfo({
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.length) {
            this.showData = Data[0];
            this.showList = Data;
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handlePrint() {
      // 打印
      const obj = {
        showData: this.showData,
        showList: this.showList
      };
      sessionStorage.setItem("BookQueryInfo", JSON.stringify(obj));
      this.$router.push("/home/books/query/print/" + this.$route.params.id);
    }
  },
  beforeMount() {
    const ID = this.$route.params.id;
    this.initData(ID);
  }
};
</script>

<style scoped>
.books-query-info-main {
  width: 1000px;
  margin: 0 auto;
}
.query-info-top {
  padding: 20px;
  margin-top: 40px;
  border: 1px solid #ebeef5;
  border-bottom: none;
  line-height: 20px;
}
.query-btn {
  margin-top: 20px;
}
</style>
