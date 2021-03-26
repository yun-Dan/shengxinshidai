<template>
  <div class="app-books-query-print">
    <div id="subOutputRank-print" v-cloak>
      <div class="books-query-print-content">
        <div class="books-query-print-head">
          <el-row :gutter="20">
            <el-col :offset="4" :span="16">
              <div class="grid-content bg-purple">
                <div class="books-query-head-title">中国人民大学非学历非学位教育培训学院名单</div>
                <div class="books-query-head-subtitle">（学员信息备案与项目财务结算用 继续教育处监制）</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <div class="right-code-img">
                  <img :src="imgUrl" alt style="height: 100%">
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="books-query-print-body">
          <div style="padding: 20px 0;line-height: 20px">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <div style="margin-bottom: 10px">
                    主办学院：
                    <span class="data-border">{{ showData.xy }}</span>
                  </div>
                  <div>
                    项目名称：
                    <span class="data-border">{{ showData.item_name }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <div>
                    项目编号：
                    <span class="data-border">{{ showData.item_num}}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <table width="820" border="1" align="center" class="books-query-print-table" style>
              <tr>
                <td align="center" width="116px">序号</td>
                <td align="center" width="46px">姓名</td>
                <td align="center">工作单位</td>
                <td align="center" width="90px">职位</td>
                <td align="center" width="90px">联系方式</td>
                <td align="center">邮箱</td>
                <td align="center" width="100px">备注</td>
              </tr>
              <tr v-for="item in showList" :key="item.id">
                <td align="center" width="116px">{{ item.num}}</td>
                <td align="center" width="46px">{{ item.username }}</td>
                <td align="center">{{ item.work_unit }}</td>
                <td align="center" width="90px">{{ item.zhiwei}}</td>
                <td align="center" width="90px">{{ item.tel}}</td>
                <td align="center">{{ item.email}}</td>
                <td align="center" width="100px">{{ item.bz }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="books-query-print-btns">
      <el-button @click.native="$router.go(-1)">返回</el-button>
      <el-button @click.native="doPrint" type="success">打印</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-books-query-print",
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
      showList: [],
      imgUrl: ""
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
    doPrint() {
      doPrint()
    }
  },
  beforeMount() {
    const obj = sessionStorage.getItem("BookQueryInfo");
    if (obj) {
      const new_obj = JSON.parse(obj);
      this.showData = new_obj.showData;
      this.showList = new_obj.showList;
    } else {
      const ID = this.$route.params.id;
      this.initData(ID);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("BookQueryInfo");
  }
};
</script>

<style scoped>
.app-books-query-print {
  margin: 20px 0;
}
.books-query-print-content {
  width: 820px;
  margin: 0 auto;
  padding: 20px 40px;
  font-family: SimSun;
  font-size: 14px;
  color: #000;
}
.books-query-head-title {
  font-size: 18px;
  text-align: center;
  letter-spacing: 3px;
  line-height: 60px;
  font-weight: bold;
}
.books-query-head-subtitle {
  text-align: center;
}
.right-code-img {
  width: 111px;
  height: 111px;
}
.books-query-print-btns {
  margin-top: 20px;
  text-align: center;
}
.data-border {
  display: inline-block;
  min-width: 80px;
  padding: 0 2px;
  border-bottom: 1px solid #1d2832;
}
.books-query-print-table {
  font-size: 12px;
  font-family: "SimSun";
  border-collapse: collapse;
  line-height: 26px;
}
</style>
