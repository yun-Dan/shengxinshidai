<template>
  <div class="app-project-inform">
    <el-card style="padding: 20px">
      <div class v-cloak>
        <div id="subOutputRank-print">
          <div class="project-inform-print-content">
            <template v-for="num in 3">
              <div :key="num" style="margin-top: 110px;padding: 0 40px;">
                <div class>
                  <div>
                    <div
                      style="text-align: center;font-size: 20px;line-height: 50px;font-weight: bold"
                    >
                      中国人民大学非学历教育培训项目立项通知书{{ showData.gl_type === 5 ? '（预立项）' : '' }}
                      <span
                        v-if="show2020(showData.pro_code)"
                      >（电子版）</span>
                    </div>
                    <el-row :gutter="10">
                      <el-col :span="14" :offset="5">
                        <div class="grid-content bg-purple">
                          <div
                            v-if="num===1"
                            style="text-align: center; line-height: 3em"
                          >（第一联 继续教育处留存）</div>
                          <div
                            v-if="num===2"
                            style="text-align: center; line-height: 3em"
                          >（第二联 财务处留存）</div>
                          <div
                            v-if="num===3"
                            style="text-align: center; line-height: 3em"
                          >（第三联 学院留存）</div>
                          <p style="text-align: right">
                            培项字
                            <template v-if="isYXB">
                              课
                              <template>({{ showData.province && showData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                              <template> ({{ fzList.length ? '辅' : '自' }})</template>
                            </template>
                            <template v-else>
                              <template v-for="(item,key,index) in proConfig.pxlx">
                                <span v-if="showData.pxlx==key" :key="index">{{ item | chai }}</span>
                              </template>
                            </template>
                            {{ showData.pro_code }}&nbsp;号
                          </p>
                        </div>
                      </el-col>
                      <el-col :span="5">
                        <div class="grid-content bg-purple">
                          <div class="code-img">
                            <img :src="imgUrl" alt style="height: 100%">
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="project-inform-main">
                    <div>
                      <span class="show-val">{{ showData.college }}</span>：
                    </div>
                    <div class="text-index">
                      经研究决定，同意你单位{{ showData.gl_type === 5 ? '拟定的培训计划，' : '' }}
                      <template v-if="hzList.length">
                        与
                        <span
                          class="show-val"
                          v-for="(item,index) in hzList"
                          :key="item.id"
                        >{{ item.yf_dwmc }}{{ (hzList.length-1===index)?'':'、'}}</span>
                        联合
                      </template>
                      <template v-if="wtList.length">
                        接受
                        <span
                          class="show-val"
                          v-for="(item,index) in wtList"
                          :key="item.id"
                        >{{ item.jf_dwmc }}{{ (wtList.length-1===index)?'':'、'}}</span>
                        委托，
                      </template>于
                      <span
                        class="show-val"
                      >{{ showData.px_start_time | TimestampChangeFilter(true) }}</span> 至
                      <span
                        class="show-val"
                      >{{ showData.px_end_time | TimestampChangeFilter(true) }}</span>
                      在
                      <span
                        class="show-val"
                      >{{ showData.province }}{{ showData.city }}{{ showData.pxdd }}</span>
                      <template v-if="fzList.length">
                        由
                        <span
                          class="show-val"
                          v-for="(item,index) in fzList"
                          :key="item.id"
                        >{{ item.yf_dwmc }}{{ (fzList.length-1===index)?'':'、'}}</span>
                        辅助举办
                      </template>
                      <template v-else>{{ !wtList.length && !hzList.length ? '自行举办' : '举办' }}</template>
                      <span class="show-val">{{ showData.pro_name }}</span>项目
                      <template
                        v-if="wtList.length || fzList.length || hzList.length"
                      >，请按照《中国人民大学合同管理办法（修订）》规定分别申报与上述单位有关协议</template>。
                    </div>
                    <div
                      v-if="showData.gl_type === 5"
                      class="text-index"
                    >该项目如需履行委托单位招投标手续，可凭此立项通知书和介绍信在学校各相关单位办理有关手续。</div>
                    <div class="text-index">
                      该项目收费形式与收费标准为：
                      <template v-if="showData.ks_charge === 2">
                        <span v-if="showData.sfbz===2">学员自行按照标准支付，</span>
                        <span v-if="showData.sfbz===3">委托单位与学员共同支付，</span>
                        <span>{{ showData.specific_rate }}</span>
                      </template>
                      <template v-else>
                        <template v-if="showData.sfbz===1">
                          委托单位统一向我校支付
                          <span class="show-val">{{ showData.sfbz_dw }}</span>元。
                        </template>
                        <template v-if="showData.sfbz===2">
                          受训学员自行按照
                          <span class="show-val">{{ showData.sfbz_xy }}</span>元/人标准向我校支付。
                        </template>
                        <template v-if="showData.sfbz===3">
                          委托单位支付
                          <span class="show-val">{{ showData.sfbz_dw }}</span>元，
                          学员按照
                          <span class="show-val">{{ showData.sfbz_xy }}</span>元/人标准支付。
                        </template>
                      </template>
                    </div>
                    <div class="text-index">
                      培训项目计划招生规模：
                      <span class="show-val">{{ showData.zsrs }}</span>人
                      <template v-if="showData.zs_type===1">。</template>
                      <template v-if="showData.zs_type===2">
                        ，招生时间为：
                        <span
                          class="show-val"
                        >{{ showData.zs_start_time | TimestampChangeFilter(true) }}</span> 至
                        <span
                          class="show-val"
                        >{{ showData.zs_end_time | TimestampChangeFilter(true) }}</span>。
                      </template>
                    </div>
                    <div class="text-index">
                      培训收费优惠政策为：
                      <span v-if="!yhList.length" class="show-val">无</span>
                      <template v-else>
                        <div v-for="(item,index) in yhList" :key="index">
                          优惠价格{{ index+1}}：
                          <span class="show-val">{{ item.yhjg }} 元</span>，优惠条件：
                          <span class="show-val">{{ item.yhtj}}</span>。
                        </div>
                      </template>
                    </div>
                    <div
                      class="text-index"
                    >{{ showData.gl_type === 5 ? '此项目为培训预立项，不得在此项目中进行学员、证书、财务审批、签订辅助培训协议等相关操作，具体业务待培训细节确定后重新向学校申报立项。' : '' }}学校管理费暂按照基准政策比例（{{ showData.college | yhbl}}%）批复，实际学校管理费收取比例视培训项目举办合规情况在审批该项目“结算申请”时确定。</div>
                    <div v-if="kcList.length && showData.gl_type !== 5" class="text-index">
                      <p>指定进行评估的课程：</p>
                      <div class="course-list">
                        <div class="clearfix course-line">
                          <div class="course-item fl" style="width: 374px">课程名称</div>
                          <div class="course-item fl" style="width: 120px">教师</div>
                          <div class="course-item fl" style="width: 80px">学时</div>
                        </div>
                        <div
                          v-for="(item,index) in kcList"
                          class="clearfix course-line"
                          :key="index"
                        >
                          <div class="course-item fl" style="width: 374px">{{ item.cou_name }}</div>
                          <div class="course-item fl" style="width: 120px">{{ item.teacher }}</div>
                          <div class="course-item fl" style="width: 80px">{{ item.school_hours }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="text-index" v-if="showData.gly_note && showData.gl_type !== 5">
                      其他批复意见：
                      <span class="show-val">{{ showData.gly_note }}</span>
                    </div>
                  </div>
                  <div class="project-inform-foot">
                    <div style="line-height: 2em">继续教育处</div>
                    <div>
                      <span>{{ new Date()| TimestampChangeFilter(true) }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="num!==3" style="page-break-before:always;">
                  <br>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="!is_ewm && $route.path.indexOf('home/') !== -1" style="text-align: center">
          <el-button type="success" @click.native="doPrint">打 印</el-button>
          <el-button type @click.native="handleBack">返 回</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-project-inform",
  data() {
    return {
      showData: {},
      imgUrl: "",
      wtList: [],
      fzList: [],
      hzList: [],
      yhList: [],
      kcList: [],
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      is_ewm: false,
      
      isYXB: false
    };
  },
  computed: {
    ...mapState(["URL", "EWM"])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    },
    yhbl(college = "") {
      if (college.indexOf("律师学院") > -1 || college.indexOf("继续教育学院") > -1) {
        return 16;
      } else {
        return "15";
      }
    }
  },
  methods: {
    ...mapActions(["getWtForm2", "getProjectYh", "getProjectNotice"]),
    initData() {
      const path = this.$route;
      this.imgUrl = `${this.EWM}/3/id/${path.params.id}`
      if (path.fullPath.indexOf("home") > 0) {
        this.$notify.error({
          title: "错误",
          message: data.data.error
        });
      } else {
        this.getProjectNotice({
          data: {
            pro_id: path.params.id,
            is_evaluate: 1
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.showData = Data.project || {};
            this.wtList = Data.wtdw && Data.wtdw.list ? Data.wtdw.list : [];
            this.fzList = Data.fzdw && Data.fzdw.list ? Data.fzdw.list : [];
            this.hzList = Data.hzdw && Data.hzdw.list ? Data.hzdw.list : [];
            this.yhList = this.showData.yhzc_list || [];
            this.kcList = Data.courses.list;
            this.proConfig = Data.config;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
            this.handleBack();
          }
        });
      }
    },
    doPrint() {
      doPrint()
    },
    show2020(code) {
      return `${code}`.substring(0, 4) > 2019;
    },
    handleBack () {
      this.$router.go(-1);
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    const path = this.$route;
    if (path.fullPath.indexOf("home") > 0) {
      if (sessionStorage.getItem("proInform")) {
        this.showData = JSON.parse(sessionStorage.getItem("proInform"));
        this.initData();
      } else {
        this.handleBack();
      }
    } else {
      this.is_ewm = true;
      this.initData();
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("proInform");
  }
};
</script>

<style scoped>
.project-inform-print-content {
  font-family: "SimSun";
  width: 660px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 26px;
}
h3 {
  line-height: 50px;
  font-size: 16px;
}
.code-img {
  width: 112px;
  height: 112px;
  background-color: #dfe4ed;
}
span.show-val {
  padding: 0 10px;
  border-bottom: 1px solid #303133;
}
.text-index {
  text-indent: 2em;
}
.project-inform-foot {
  position: relative;
  margin-top: 20px;
  margin-bottom: 40px;
  text-align: right;
}
.sign-lix {
  position: absolute;
  top: -20px;
  right: 10px;
  width: 100px;
  height: 100px;
}
.sign-lix img {
  width: 100%;
  height: 100%;
}

.course-list {
  padding-bottom: 20px;
}
.course-item {
  border: 1px solid #000;
  text-align: center;
  font-size: 14px;
  line-height: 26px;
}
</style>
