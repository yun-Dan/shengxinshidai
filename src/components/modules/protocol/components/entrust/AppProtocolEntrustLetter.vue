<template>
  <div class="app-protocol-entrust-letter">
    <div id="subOutputRank-print">
      <div class="commitment-content" v-if="xy_time">
        <div class style="width: 580px;margin: 0 auto">
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="grid-content bg-purple">
                <h2 style="text-align: center;line-height: 100px" class>{{ isYXB ? '课程班' : '培训' }}承办单位承诺书</h2>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="header-right">
                  <div class="right-code-img">
                    <img :src="imgUrl" alt style="height: 100%">
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div style="text-align: right">
            <div class="right-num">
              编码：
              <span class="tip-red">{{ showData.contract_code?showData.contract_code:'审核通过后生成'}}</span>
            </div>
          </div>
          <div class>
            <div>
              <span class="title-mark">继续教育处：</span>
            </div>
            <div class="shrink-section">
              <div>
                “{{ showData.pro_name?showData.pro_name:proName }}”（培项字：
                <template v-if="isYXB">
                  课
                  <template>({{ showData.province && showData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                  <template> ({{ showData.is_fzdw > 0 ? '辅' : '自' }})</template>
                </template>
                <template v-else>
                  <template v-for="(item,key,index) in proConfig.pxlx">
                    <span v-if="showData.pxlx==key" :key="index">{{ item | chai }}</span>
                  </template>
                </template>
                {{ showData.pro_code }}）由我单位实施全过程管理，对于{{ isYXB ? '课程班' : '培训班' }}所涉及的管理责任和经济责任已经我单位认真研究并经我单位党政联席会议讨论通过。我单位承诺按照学校有关规定认真做好此次{{ isYXB ? '课程班' : '培训班' }}的宣传、组织、教学等有关工作，服从学校管理，为受训单位和受训学员提供高水平的{{ isYXB ? '授课' : '培训' }}服务。
              </div>
              <div>协议签订后，我单位将作为责任主体主动承担由此{{ isYXB ? '课程班' : '培训班' }}产生的经济和社会责任。</div>
            </div>
          </div>
          <div style="margin-top: 50px">
            <div style="text-align: right">
              乙方下属{{ isYXB ? '课程班' : '培训' }}承办单位（盖章）：
              <span class="foot-inscribe-line"></span>
            </div>
            <div style="text-align: right">
              单位负责人：
              <span class="foot-inscribe-line"></span>
            </div>
            <div style="text-align: right">
              <span class="foot-inscribe-line foot-inscribe-line-time"></span> 年
              <span class="foot-inscribe-line foot-inscribe-line-time"></span> 月
              <span class="foot-inscribe-line foot-inscribe-line-time"></span> 日
            </div>
          </div>
        </div>
        <div style="page-break-before:always;">
          <br>
        </div>
        <div class>
          <h3 style="margin-bottom: 20px">附件1：</h3>
          <div>
            <img
              :src="showData.create_time ? `${ URL }/static/images/wt_${ new Date(showData.create_time * 1000).getFullYear() }.jpg` : ''"
              alt
              style="width: 100%"
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="$route.path.indexOf('home/') !== -1" style="padding: 0 40px;text-align: center;margin-top: 40px" v-cloak>
      <el-button type @click.native="$router.go(-1)">返 回</el-button>
      <el-button type="success" @click.native="doPrint">打 印</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-protocol-entrust-letter",
  data() {
    return {
      xy_time: null, // 创建协议时间
      showData: {},
      front: 0,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      Margin: "98px",
      imgUrl: "",
      proName: "",
      
      isYXB: false
    };
  },
  computed: {
    ...mapState(["URL", "EWM"])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions(["getWtProtocol", "checkWt"]),
    initData(id) {
      if (!this.front) {
        this.proName = sessionStorage.getItem("pro_name_Letter");
        if (!this.proName) {
          this.$notify.error({
            title: "错误",
            message: "获取数据失败"
          });
        }
      }
      if (true) {
        this.getWtProtocol({
          data: {
            id: id
          },
          front: this.front
        }).then(data => {
          if (data.data.code === 200) {
            this.showData = data.data.data;
            this.xy_time = this.showData.create_time * 1000;
            if (this.showData.status === 3) {
              this.imgUrl = `${this.EWM}/7/id/${id}`
            }
            if (sessionStorage.getItem("PXLX")) {
              Object.assign(this.showData, {
                pxlx: sessionStorage.getItem("PXLX")
              });
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
            this.$router.go(-1);
          }
        });
      }
    },
    doPrint() {
      doPrint()
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    const Route = this.$route;
    if (Route.path.indexOf("home") === -1) {
      this.front = 2;
    }
    this.initData(Route.params.id);
  },
  beforeDestroy() {
    sessionStorage.removeItem("PXLX");
    sessionStorage.removeItem("pro_name_Letter");
  }
};
</script>

<style scoped>
.app-protocol-entrust-letter {
  padding: 100px 0;
}
.commitment-content {
  width: 620px;
  padding: 0 40px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 30px;
  font-family: "SimSun";
}
/*强调*/
.title-mark {
  font-weight: bold;
  font-size: 20px;
  line-height: 40px;
}
.foot-inscribe-line {
  display: inline-block;
  width: 120px;
  height: 24px;
  border-bottom: 1px solid #000;
}
.foot-inscribe-line-time {
  width: 40px;
}
.right-code-img {
  text-align: right;
}
.right-num {
  font-size: 12px;
  line-height: 24px;
}
</style>
