<template>
  <div class="app-assess-code">
    <el-card class="box-card">
      <div class="assess-code-main">
        <div id="subOutputRank-print" class>
          <div class="assess-code-main-print">
            <template v-if="pro.cou_name">
              <div class="assess-code-title">{{ pro.cou_name }}</div>
              <div class="assess-code-title">{{ pro.pro_name }}（{{ pro.pro_code }}）</div>
            </template>
            <template v-else>
              <div class="assess-code-title">{{ pro.pro_name }}</div>
              <div class="assess-code-title">编号：{{ pro.pro_code }}</div>
            </template>
            <div class="assess-code-img">
              <img :src="src" alt>
              <img src="../../../../assets/images/favicon.png" alt class="assess-code-img-ico">
            </div>
            <div class="assess-code-text">{{ text }}</div>
          </div>
        </div>
        <div class="assess-code-foot">
          <el-button @click.native="$router.go(-1)">返 回</el-button>
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
  name: "app-assess-code",
  data() {
    return {
      pro: {},
      src: "",
      text: "",
      is_share: false // 是否是分享报告二维码
    };
  },
  computed: {
    ...mapState(["EWM"])
  },
  methods: {
    ...mapActions([
      "getAssessProjectCode",
      "getAssessCourseCode",
      "getProjectCode"
    ]),
    initData() {
      this.is_share = false;
      if (this.$route.path.indexOf("assess") > 0) {
        if (this.$route.path.indexOf("project") > 0) {
          this.text = "项目评估问卷二维码";
          this.getAssessProjectCode({
            data: {
              pro_code: this.pro.pro_code
            }
          }).then(data => {
            if (data.data.code === 200) {
              this.src = data.data.data;
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        } else {
          let params = {};
          let query = this.$route.query;
          if (query.tp == 9 && query.id) {
            // 课程评估分享报告（课程评估）
            this.text = "课程评估分享报告二维码";
            this.is_share = true;
            this.src = `${this.EWM}/9/id/${query.id}`;
          } else {
            // 课程评估（课程评估）
            this.text = "课程评估问卷二维码";
            Object.assign(params, {
              id: this.pro.cou_id
            });
            this.getAssessCourseCode({
              data: params
            }).then(data => {
              if (data.data.code === 200) {
                this.src = data.data.data;
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error
                });
              }
            });
          }
        }
      } else {
        this.text = "项目二维码";
        this.getProjectCode({
          data: {
            pro_code: this.pro.pro_code
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.src = data.data.data;
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
      doPrint()
    }
  },
  created() {
    this.pro = this.$route.query;
    this.initData();
  }
};
</script>

<style scoped>
.assess-code-main {
  padding-bottom: 100px;
  text-align: center;
}
.assess-code-main-print {
  padding-top: 100px;
  text-align: center;
}
.assess-code-title {
  font-size: 20px;
  line-height: 40px;
  color: #2e3e4e;
}
.assess-code-img {
  position: relative;
  width: 300px;
  height: 300px;
  padding: 20px;
  margin: 0 auto;
}
img {
  width: 100%;
}
.assess-code-img-ico {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -25px;
  width: 50px;
}
.assess-code-text {
  padding-bottom: 20px;
  font-size: 16px;
}
</style>
