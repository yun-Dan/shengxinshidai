<template>
  <div class="app-assess-result">
    <el-card class="box-card">
      <div id="subOutputRank-print">
        <div style="padding: 50px 0 20px;border-bottom:1px solid #ebeef5">
          <header class="assess-result-head">
            <div>{{ proName }}</div>
            <div class="assess-result-sub">编号：{{ proCode }}</div>
          </header>
        </div>
        <div class="assess-result-main">
          <div class="assess-result-main-item">
            <header class="assess-result-main-title" style="margin-bottom: 40px">评估结果</header>
            <el-table :data="radio1" :show-header="false" style="width: 100%;font-size: 16px">
              <el-table-column width="60">
                <template slot-scope="scope">{{ scope.$index+1}}、</template>
              </el-table-column>
              <el-table-column prop="title"></el-table-column>
              <el-table-column align="right" width="100">
                <template slot-scope="scope">{{ scope.row.pinjunfen}} 分</template>
              </el-table-column>
            </el-table>
          </div>
          <div class="assess-result-main-item clearfix">
            <div>
              <template v-for="(item,index) in chartDataList">
                <div :key="index" class="assess-result-main-pie-item">
                  <div class="assess-result-main-pie-title">{{ item.title }}</div>
                  <div class="assess-result-pie-box no-print" ref="pieresult">
                    <ve-pie :data="item.chartData" :colors="colors"></ve-pie>
                  </div>
                </div>
              </template>
            </div>
            <div class="yes-print" ref="box"></div>
          </div>
          <div class="assess-result-main-item">
            <div class="assess-result-main-title">
              总平均分为：
              <span style="padding-right: 40px">{{ mean}} 分</span>
              考核结果为：
              <span v-if="result===1" class="tip-red">不合格</span>
              <span v-if="result===2" class="tip-red">一般</span>
              <span v-if="result===3" class="tip-red">良好</span>
              <span v-if="result===4" class="tip-red">优秀</span>
              <span v-if="result===5" class="tip-red">暂时没有该评分的评级</span>
            </div>
          </div>
          <div class="assess-result-main-item">
            <el-table :data="messageTable" :show-header="false" style="width: 100%;font-size: 16px">
              <el-table-column prop="title"></el-table-column>
            </el-table>
          </div>
          <div class="assess-result-main-item">
            <div v-for="(item,index) in rfields_con" :key="index">
              <div class="assess-result-main-title">{{ item.title }}</div>
              <ul class="assess-result-list">
                <li
                  v-for="(val,ind) in item.con"
                  :key="ind"
                  style="font-size: 16px"
                >{{ ind+1}}、{{ val}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="assess-result-foot">
        <el-button @click.native="handleBack">返 回</el-button>
        <el-button type="success" @click.native="doPrint">打 印</el-button>
        <!--<el-button @click="createImage">导出</el-button>-->
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import VePie from "v-charts/lib/pie.common";
import { doPrint } from '@/assets/js/doPrint.js'

export default {
  name: "app-assess-pc-result",
  data() {
    return {
      id: 0, // 33课程调查结果，34项目调查结果
      proName: "",
      proCode: null,
      result: 3, // 1:不合格,2:一般,3:良好,4:优秀,5:暂时没有该评分的评级
      mean: 4, // 平均分
      radio1: [], // 评分项
      chartDataList: [
        {
          title: "",
          chartData: {
            columns: ["name", "num"],
            rows: [{ name: "是", num: 1 }, { name: "否", num: 0 }]
          }
        }
      ],
      colors: ["#19d4ae", "#fa6e86"],
      messageTable: [
        {
          title:
            "计分说明：计星题每星1分；判断题“是”1分、“否”0分；主观题只考察填写内容，不计分。成绩说明：最小评分进制为0.1分。"
        },
        {
          title:
            "各项评估平均分合计后结果评定值：24.1-27.0（优秀），20.1-24.0（良好），16.1-20.0（一般），16分以下（不合格）。"
        }
      ],
      rfields_con: {}
    };
  },
  components: {
    VePie
  },
  methods: {
    ...mapActions(["getAssessCouindex"]),
    initData() {
      const Data = JSON.parse(sessionStorage.getItem("lookResult"));
      if (this.$route.path.indexOf("course") > 0) {
        this.id = 2;
      } else {
        this.id = 1;
      }
      if (true) {
        this.getAssessCouindex({
          data: {
            pro_id: Data.pro_id,
            cou_id: Data.cou_id ? Data.cou_id : null,
            anstypeid: this.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.proName = Data.pro_name;
            this.proCode = Data.pro_code;
            this.mean = Data.zongpingjunfen;
            this.result = Data.pingfenjieguo;
            for (let key in Data.rfields_pingjunfen) {
              this.radio1.push(Data.rfields_pingjunfen[key]);
            }
            this.rfields_con = Data.rfields_con;

            let list = [];
            for (let key in Data.rfields_yesno) {
              list.push(Data.rfields_yesno[key]);
            }
            this.chartDataList = list.map(item => {
              let rows = [];
              for (let key in item.chartData.rows) {
                rows.push({
                  name: key + "：" + item.chartData.rows[key],
                  num: item.chartData.rows[key]
                });
              }
              return {
                title: item.title,
                chartData: {
                  columns: ["name", "num"],
                  rows: rows
                }
              };
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
    doPrint() {
      this.createImage();
      this.$nextTick(() => {
        if (this.$refs.box.innerHTML) {
          doPrint()
        }
      });
    },
    createImage() {
      const canvas = document.getElementsByTagName("canvas");
      const box = this.$refs.box;
      let HTML = "";
      for (let i = 0; i < canvas.length; i++) {
        let image = canvas[i].toDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#fff"
        });
        HTML += '<img src="' + image + '" alt="">';
      }
      box.innerHTML = HTML;
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
    if (sessionStorage.getItem("lookResult")) {
      this.initData();
    } else {
      this.$router.go(-1);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("lookResult");
  }
};
</script>

<style scoped>
.assess-result-head {
  font-size: 26px;
  line-height: 40px;
  color: #414245;
  text-align: center;
}
.assess-result-sub {
  font-size: 20px;
}
.assess-result-main {
  width: 820px;
  margin: 0 auto;
  padding: 50px 0;
  color: #666;
}
.assess-result-main-title {
  font-size: 20px;
  line-height: 36px;
  text-align: center;
}
.assess-result-main-item {
  margin-bottom: 40px;
}
.assess-result-main-pie-title {
  font-size: 18px;
  text-align: center;
  margin: 30px 0;
}
.assess-result-main-pie-item {
  float: left;
  width: 50%;
}
.assess-result-list {
  padding: 10px 20px;
  line-height: 2em;
}
.assess-result-foot {
  text-align: center;
  padding: 30px 0;
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
