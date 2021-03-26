<template>
  <div class="app-certificate-bill-print">
    <el-card style="box-shadow: none; border: none;">
      <template v-if="!front">
        <div slot="header" class="clearfix" v-cloak>
          <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
        </div>
      </template>
      <div class="certificate-bill-print-body">
        <div id="subOutputRank-print" v-cloak>
          <div class="certificate-bill-print-content">
            <header>
              <el-row>
                <el-col :span="14" :offset="5">
                  <div class="grid-content bg-purple">
                    <h2 style="line-height: 4.6em;text-align: center;font-size: 2em">中国人民大学校内转账凭证</h2>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <div class="bill-code-img">
                      <img :src="imgUrl" alt style="height: 100%">
                    </div>
                    <p style="text-align: center">{{1 | nowTime() }}</p>
                  </div>
                </el-col>
              </el-row>
            </header>
            <div>
              <!--结算信息-->
              <div class="certificate-bill-print-one">
                <table border="1">
                  <tbody>
                    <tr>
                      <td rowspan="3">
                        <div style="width: 20px;text-align: center;padding: 0 2px">支出单位</div>
                      </td>
                      <td>
                        <div
                          style="width: 302px"
                          class="padding-left-right"
                        >部门号或名称：{{ showData.college_num}} {{ showData.college }}</div>
                      </td>
                      <td rowspan="3">
                        <div style="width: 20px;text-align: center;padding: 0 2px">收入单位</div>
                      </td>
                      <td>
                        <div style="width: 302px" class="padding-left-right">部门号或名称：513600 继续教育处</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="padding-left-right">{{ versionTime_4 > Query.v_time ? '项目号或名称：' : '支出项目号：' }}</div>
                      </td>
                      <td>
                        <div class="padding-left-right">{{ versionTime_4 > Query.v_time ? '项目号或名称：' : '收入项目号：' }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="padding-left-right">联系电话：</div>
                      </td>
                      <td>
                        <div class="padding-left-right">联系电话：</div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div class="padding-left-right">
                          结账事由：
                          <span style="padding: 0 20px">结业证书费</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div class="padding-left-right">
                          转账金额（大写）：
                          <span style="padding: 0 20px">{{ showData.chinese_account }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div class="padding-left-right">
                          转账金额（小写）：
                          <span style="padding: 0 20px">￥{{ showData.account }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--盖章区-->
              <div class="certificate-bill-print-two">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <div style="margin-bottom: 20px;font-size: 16px">支出单位</div>
                      <el-row :gutter="20">
                        <el-col :span="4">
                          <div class="grid-content bg-purple">公章</div>
                        </el-col>
                        <el-col :span="9">
                          <div class="grid-content bg-purple">负责人</div>
                        </el-col>
                        <el-col :span="10">
                          <div class="grid-content bg-purple">经手人</div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <div style="margin-bottom: 20px;font-size: 16px">收入单位</div>
                      <el-row :gutter="20">
                        <el-col :span="4">
                          <div class="grid-content bg-purple">公章</div>
                        </el-col>
                        <el-col :span="9">
                          <div class="grid-content bg-purple">负责人</div>
                        </el-col>
                        <el-col :span="10">
                          <div class="grid-content bg-purple">经手人</div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <!--分界线-->
              <div class="certificate-bill-print-line"></div>
              <!--结算证书的项目列表-->
              <div class="certificate-bill-print-three">
                <table style="width: 100%;text-align: center" border="1">
                  <thead>
                    <tr>
                      <td>项目号</td>
                      <td>项目名称</td>
                      <td>申领人</td>
                      <td>申领日期</td>
                      <td>证书数</td>
                      <td>证书费用</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in showData.cert_detail" :key="index">
                      <td>{{ item.pro_code }}</td>
                      <td>{{ item.pro_name }}</td>
                      <td>{{ item.user_name }}</td>
                      <td>{{ item.create_time | TimestampChangeFilter }}</td>
                      <td>{{ item.certificate_num}}</td>
                      <td>{{ item.fee }}</td>
                    </tr>
                    <!--合计-->
                    <tr>
                      <td>总计</td>
                      <td colspan="3"></td>
                      <td>{{ showData.cert_detail | showTotal}}个</td>
                      <td>￥{{ showData.cert_detail | showAll}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!front" class="certificate-bill-print-foot">
          <el-button type @click.native="$router.go(-1)">返 回</el-button>
          <el-button type="success" @click.native="doPrint">打 印</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-certificate-bill-print",
  data() {
    return {
      imgUrl: "",
      front: false, // true：前台登录（无需验证）、false：需要验证登录信息
      showData: {
        user_name: "",
        user_tel: "",
        account: "",
        chinese_account: "",
        student_total: 0,
        certificate_num: 0,
        status: -1,
        review_time: 0,
        cert_detail: [{}]
      },
      Query: {}
    };
  },
  computed: {
    ...mapState(["EWM", 'versionTime_4'])
  },
  filters: {
    showAll(list) {
      let lens = list && list.length,
        d = 0,
        sum = 0;
      for (let key in list) {
        let str = "" + list[key].fee;
        if (str.indexOf(".") != -1) {
          let temp = str.split(".")[1].length;
          d = d < temp ? temp : d;
        }
      }
      let m = Math.pow(10, d);
      for (let key in list) {
        sum += list[key].fee * m;
      }
      if (!isNaN(sum / m)) {
        return sum / m + ".00";
      } else {
        return sum / m;
      }
    },
    showTotal(list) {
      let total = 0;
      list.forEach(item => {
        total += item.certificate_num;
      });
      return total;
    },
    nowTime() {
      const date = new Date();
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      const D = date.getDate();
      return Y + " 年 " + M + " 月 " + D + " 日 ";
    }
  },
  methods: {
    ...mapActions(["getCertificatesBalance"]),
    initData(id) {
      this.imgUrl = `${this.EWM}/6/id/${id}`
      this.getCertificatesBalance({
        front: this.front,
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data.list;
          this.showData = Data;
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
    const route = this.$route;
    this.Query = route.query
    if (route.fullPath.indexOf("home") > 0) {
      this.front = false;
    } else {
      this.front = true;
    }
    if (route.params.id) {
      this.initData(route.params.id);
    }
  }
};
</script>

<style scoped>
.certificate-bill-print-body {
  width: 680px;
  margin: 0 auto;
}
.bill-code-img {
  width: 111px;
  height: 111px;
  background-color: rgba(148, 200, 252, 0.08);
  margin: 0 auto;
}
/*打印内容*/
.certificate-bill-print-content {
  font-family: "SimSun";
  font-size: 12px;
  line-height: 22px;
  width: 680px;
  margin: 0 auto;
  padding-top: 30px;
}
/*结算信息*/
.certificate-bill-print-one {
  margin-bottom: 20px;
}
.certificate-bill-print-two {
  font-size: 14px;
}
table {
  border-collapse: collapse;
}
.padding-left-right {
  padding: 0 4px;
}
.certificate-bill-print-line {
  height: 30px;
  border-bottom: 1px dotted #3b3b3b;
  margin-bottom: 30px;
}
.certificate-bill-print-foot {
  margin-top: 40px;
  text-align: center;
}
</style>
