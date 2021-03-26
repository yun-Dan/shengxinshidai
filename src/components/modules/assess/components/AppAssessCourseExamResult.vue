<template>
  <div class="app-assess-result" v-loading="loading">
    <el-card class="box-card">
      <div id="subOutputRank-print">
        <div style="padding: 50px 0 20px;border-bottom:1px solid #ebeef5">
          <header class="assess-result-head">
            <div>“{{ query.cou_name }}”课程评估报告</div>
            <div class="assess-result-sub">
              <span>{{ query.pro_name }}</span>
              <span>（{{ query.pro_code }}）</span>
            </div>
          </header>
        </div>
        <div class="assess-result-main">
          <div v-if="calculate && calculate.length" style="margin-bottom: 60px">
            <p style="font-size: 18px; text-align: center; padding-bottom: 30px">评估结果</p>
            <el-table :data="calculate" style="width: 100%" :show-header="false">
              <el-table-column>
                <template slot-scope="scope">
                  <div class="clearfix" style="font-size: 16px">
                    <div class="fl">{{ scope.$index + 1 }}、</div>
                    <div class="fl">{{ scope.row.title }}</div>
                    <div class="fr">平均分：{{ scope.row.avg_value }} 分</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--单选、多选-->
          <div style="margin-bottom: 40px">
            <div class="dan-xuan" ref="dan">
              <!--单选-->
              <div v-if="showData['1'].length" class="clearfix">
                <p style="font-size: 18px; text-align: center; padding: 30px 0">单选题</p>
                <template v-for="(item, index) in showData['1']">
                  <div :key="index" class="assess-result-main-pie-item">
                    <div class="assess-result-pie-box no-print" ref="pieresult">
                      <ve-pie
                        :data="item.chartData"
                        :colors="colors"
                        :title="{text: LineBreak(item.title), x: 'center', textStyle: {color: '#555', fontWeight: 'normal', fontSize: 16}}"
                        :legend="{top: '12%'}"
                        :extend="{series: { center: ['50%', '65%']}}"
                      ></ve-pie>
                    </div>
                  </div>
                </template>
              </div>
              <!--打印图片-->
              <div class="yes-print" ref="box1"></div>
            </div>
            <div class="duo-xuan" ref="duo">
              <!--多选-->
              <div v-if="showData['2'].length" class="clearfix">
                <p style="font-size: 18px; text-align: center; padding: 30px 0">多选题</p>
                <template v-for="(item, index) in showData['2']">
                  <div :key="index" class="assess-result-main-pie-item">
                    <div class="assess-result-pie-box no-print" ref="pieresult">
                      <ve-pie
                        :data="item.chartData"
                        :colors="colors.slice(3, 100)"
                        :title="{text: LineBreak(item.title), x: 'center', textStyle: {color: '#555', fontWeight: 'normal', fontSize: 16}}"
                        :legend="{top: '12%'}"
                        :extend="{series: { center: ['50%', '65%']}}"
                      ></ve-pie>
                    </div>
                  </div>
                </template>
              </div>
              <!--打印图片-->
              <div class="yes-print" ref="box2"></div>
            </div>
          </div>
          <!--问答题-->
          <div v-if="showData['3'].length">
            <p style="font-size: 18px; text-align: center; padding: 30px 0">问答题</p>
            <el-table
              :data="showData['3']"
              :show-header="false"
              style="width: 100%; font-size: 16px"
            >
              <el-table-column>
                <template slot-scope="scope">
                  <div class="course-exam-list-title">{{ scope.$index+1}}、 {{ scope.row.title }}</div>
                  <div class="course-exam-list-answer">
                    <div
                      v-for="(item, index) in scope.row.answer"
                      :key="index"
                    >{{ index + 1 }}. {{ item }}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="assess-result-foot">
        <el-button @click.native="handleBack">返 回</el-button>
        <el-button type="success" @click.native="doPrint">打 印</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import VePie from "v-charts/lib/pie.common";
import "echarts/lib/component/title";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-assess-pc-result",
  data() {
    return {
      loading: false,
      examType: {
        "1": {
          label: "单选",
          value: 1,
          disabled: false
        },
        "2": {
          label: "多选",
          value: 2,
          disabled: false
        },
        "3": {
          label: "问答题",
          value: 3,
          disabled: false
        },
        "4": {
          label: "填空题",
          value: 4,
          disabled: true
        },
        "5": {
          label: "填空题",
          value: 5,
          disabled: true
        }
      },
      colors: [
        "#19d4ae",
        "#fa6e86",
        "#ffb980",
        "#5ab1ef",
        "#c4b4e4",
        "#ec8f6a",
        "#407088",
        "#0067a6",
        "#00da3c",
        "#ec0000",
        "#91c7ae",
        "#f6efa6",
        "#c23531",
        "#63869e",
        "#83b582",
        "#fce2ae",
        "#ffcbcb",
        "#ff6464",
        "#badfdb",
        "#943855",
        "#64c4ed"
      ],
      query: {},
      showData: {
        "1": [], // 单选
        "2": [], // 多选
        "3": [] // 问答
      },
      calculate: []
    };
  },
  components: {
    VePie
  },
  methods: {
    ...mapActions(["readreportAssessCourseExam"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.readreportAssessCourseExam({
          type: 1,
          data: {
            paper_id: this.query.paper_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            let Data = data.data.data;
            if (Data.list) {
              for (let key in Data.list) {
                let item = Data.list[key];
                if (item.types === 3) {
                  // 问答
                  this.showData[item.types].push(item);
                } else if (item.types < 3) {
                  // 单选、多选
                  let total = 0; // 总分
                  let rs = 0; // 人数
                  if (item.types === 1 && item.calculate) {
                    for (let key in item.answer) {
                      total += Number(key) * Number(item.answer[key]);
                      rs += Number(item.answer[key]);
                    }
                  }
                  let rows = item.default.map(v => {
                    return {
                      label: `${v}：${item.answer[v] || 0}`,
                      value: item.answer[v] || 0
                    };
                  });
                  let Obj = Object.assign({}, item, {
                    chartData: {
                      columns: ["label", "value"],
                      rows: rows
                    },
                    ave: Math.round(total / rs)
                  });
                  this.showData[item.types].push(Obj);
                }
              }
            }
            if (Data.calculate) {
              this.calculate = [];
              for (let key in Data.calculate) {
                this.calculate.push(Data.calculate[key]);
              }
            }
            this.loading = false;
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
        if (true) {
          doPrint()
        }
      });
    },
    createImage() {
      const dan = this.$refs.dan;
      const duo = this.$refs.duo;
      const canvas1 = dan.getElementsByTagName("canvas");
      const canvas2 = duo.getElementsByTagName("canvas");
      const box1 = this.$refs.box1;
      const box2 = this.$refs.box2;
      let HTML1 = "";
      let HTML2 = "";
      for (let i = 0; i < canvas1.length; i++) {
        let image = canvas1[i].toDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#fff"
        });
        HTML1 +=
          '<img src="' +
          image +
          '" alt="" class="fl"  style="margin-bottom: 40px">';
      }
      box1.innerHTML = `<div class="clearfix">${HTML1}</div>`;
      for (let i = 0; i < canvas2.length; i++) {
        let image = canvas2[i].toDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#fff"
        });
        HTML2 +=
          '<img src="' +
          image +
          '" alt="" class="fl"  style="margin-bottom: 40px">';
      }
      box2.innerHTML = `<div class="clearfix">${HTML2}</div>`;
    },
    handleBack() {
      let query = this.$route.query;
      if (query.pro_name) {
        sessionStorage.setItem("Pro_name", query.pro_name);
      }
      this.$router.go(-1);
    },
    LineBreak(str, limit = 20) {
      // 字符串插入换行符（每limit个字符插入换行符）
      let NewStr = "";
      for (let i = 0; i < str.length; i++) {
        if (i % limit) {
          NewStr = NewStr + str[i];
        } else if (i) {
          NewStr = NewStr + `\n${str[i]}`;
        }
      }
      return NewStr;
    }
  },
  created() {
    this.query = this.$route.query;
  },
  beforeMount() {
    this.initData();
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
.assess-result-foot {
  text-align: center;
  padding: 30px 0;
}
@media print {
  .no-print {
    display: none;
  }
}
.course-exam-list-answer {
  padding: 10px;
  text-indent: 1em;
}
.assess-result-main-pie-title {
  height: 72px;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  margin: 30px 0;
  overflow: hidden;
}
.assess-result-main-pie-item {
  float: left;
  width: 50%;
}
.assess-result-pie-box {
  padding-bottom: 80px;
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
