<template>
  <div class="app-finance-account-print">
    <el-card>
      <div class="finance-account-print-wrap" v-cloak>
        <div id="subOutputRank-print">
          <div v-for="item in (ins_time * 1000 > V ? 1 : 3)" :key="item" class="finance-account-print-item">
            <header style="padding: 0 20px">
              <el-row :gutter="20">
                <el-col :span="20">
                  <div class="grid-content bg-purple">
                    <h2 style="text-align: center">中国人民大学非学历教育培训项目培训费结算报告</h2>
                    <div v-if="ins_time * 1000 > V" style="height: 44px">
                    </div>
                    <template v-else>
                      <p v-if="item===1" style="text-align: center">（第一联 财务处留存）</p>
                      <p v-if="item===2" style="text-align: center">（第二联 继续教育处留存）</p>
                      <p v-if="item===3" style="text-align: center">（第三联 办班单位留存）</p>
                    </template>
                    <p style="text-align: right;padding-top: 16px; padding-right: 12px;margin: 0">
                      培算字
                      <template v-if="isYXB">
                        课
                        <template>({{ showData.province && showData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                        <template> ({{ showData.profz_list_dw && showData.profz_list_dw.length ? '辅' : '自' }})</template>
                      </template>
                      <template v-else>
                        <template v-for="(item,key,index) in proConfig.pxlx">
                          <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                        </template>
                      </template>
                      {{ showData.pro_code }} - {{ 10 > showData.balance_index?'0'+showData.balance_index:showData.balance_index }}
                      号
                    </p>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <div class="code-img">
                      <img :src="imgUrl" alt style="height: 100%">
                    </div>
                  </div>
                </el-col>
              </el-row>
            </header>
            <div class="finance-account-print-content">
              <div>财务处：</div>
              <div class="text-index">
                经研究决定，同意
                <span class="account-print-val">{{ showData.college }}</span>
                <template v-if="showData.prowt_list_dw&&showData.prowt_list_dw.length">
                  接受
                  <template v-for="(item,index) in showData.prowt_list_dw">
                    <span class="account-print-val" :key="index">
                      <template v-if="index">、</template>
                      {{ item.jf_dwmc }}
                    </span>
                  </template>
                  委托，
                </template>
                于
                <span class="account-print-val">{{ showData.px_start_time }}</span>至
                <span class="account-print-val">{{ showData.px_end_time }}</span>（培训时间）
                在
                <span class="account-print-val">{{ showData.pxdd }}</span>
                <template v-if="showData.profz_list_dw&&showData.profz_list_dw.length">
                  由
                  <span class="account-print-val">{{ showData.profz_list_dw[0].yf_dwmc }}</span> 辅助
                </template>举办
                <span class="account-print-val">{{ showData.pro_name }}</span> 项目。
              </div>
              <div class="text-index">
                收费标准：
                <span class="account-print-val">
                  <template v-if="showData.sfbz===1">委托单位统一支付 {{ showData.sfbz_dw }} 元</template>
                  <template v-if="showData.sfbz===2">学员自行支付 {{ showData.sfbz_xy }} 元/人标准</template>
                  <template v-if="showData.sfbz===3">
                    委托单位支付 {{ showData.sfbz_dw }} 元；
                    学员按照 {{ showData.sfbz_xy }} 元/人标准
                  </template>
                  <template v-if="proData.sfbz===4">
                      按照课时或模块支付，具体收费方式为：{{ proData.specific_rate }}
                  </template>
                </span>，
                招生规模
                <span
                  class="account-print-val"
                >{{ showData.zsrs?showData.zsrs:0}}</span> 人，
                批准管理费比例
                <span
                  class="account-print-val"
                >{{ showData.pzmanage_scale?showData.pzmanage_scale:'0'}}</span> %。
                <template v-if="showData.manage_scale">
                  办班单位为此培训班申请了政府培训班管理费的食宿优惠比例，
                  请财务处审核有关材料的合规性后酌情调减，若认定不合规，可不予调减。
                  （
                  <span
                    v-if="showData.manage_scale"
                    style="color: #4f5255"
                  >
                    按照8%比例授权管理费的政府培训班，如安排食宿按照5%比例收取管理费；若只安排餐或宿，按照7%比例收取管理费。
                    因办班单位违规而取消政府类培训班管理费优惠政策的，食宿费用不予调减管理费比例。
                  </span>）
                </template>
              </div>

              <div v-if="showData.prowt_list&&showData.prowt_list.length">
                <div class="text-index">此项目《委托培训协议书》有关情况：</div>
                <div v-for="(item,index) in showData.prowt_list" class="text-index" :key="index">
                  {{ index+1}}.
                  编号：
                  <span
                    class="account-print-val"
                  >{{ item.contract_code }}</span>，
                  备案号：
                  <span
                    class="account-print-val"
                    style="display:inline-block;min-width: 180px;height:24px;text-align: left; text-indent: 0"
                  >{{ item.office_code }}</span>
                </div>
              </div>
              <div v-if="showData.profz_list&&showData.profz_list.length" class="text-index">
                <template v-for="(item,index) in showData.profz_list">
                  《培训辅助工作协议书》编号：
                  <span
                    class="account-print-val"
                    :key="index"
                  >{{ item.contract_code }}</span>，
                  备案号：
                  <span
                    class="account-print-val"
                    :key="item.contract_code"
                    style="display:inline-block;min-width: 180px;height:24px;text-align: left; text-indent: 0"
                  >{{ item.office_code }}</span>
                </template>
              </div>
              <!-- <div v-if="showData.prohz_list&&showData.prohz_list.length"  class="text-index">
                                <template v-for="(item,index) in showData.prohz_list">
                                    《校内单位培训合作协议书》编号：<span class="account-print-val" :key="index">{{ item.contract_code }}</span>，
                                    备案号：<span class="account-print-val" :key="item.contract_code" style="display:inline-block;min-width: 180px;height:24px;text-align: left; text-indent: 0">{{ item.office_code }}</span>
                                </template>
              </div>-->
              <div class="text-index">
                此次结算为该项目第
                <span class="account-print-val">{{ showData.balance_index }}</span> 次结算
                <template v-if="showData.balance_index>1">
                  ，
                  此前已累计结算：
                  <span
                    class="account-print-val"
                  >{{ showData.total_cost - showData.balan_cost }}</span> 元，
                  <span class="account-print-val">{{ showData.total_pers - showData.balan_pers }}</span> 人
                </template>。
              </div>
              <div class="text-index">
                本次结算金额：
                <span class="account-print-val">{{ showData.balan_cost }}</span>元，
                本次结算人数：
                <span class="account-print-val">{{ showData.balan_pers }}</span>人
                <template v-if="showData.profz_list_dw&&showData.profz_list_dw.length">
                  ，
                  与
                  <span
                    class="account-print-val"
                  >{{ showData.profz_list_dw[0].yf_dwmc }}</span>分成方式和比例为
                  <span class="account-print-val">{{ showData.profz_list_dw[0].yf_fcbl}}{{ isYXB && (showData.profz_list_dw[0].yf_fcbl || 0) > -1 ? '%' : '' }}</span>，
                  本次具体分款金额为：
                  <span
                    class="account-print-val"
                  >{{ showData.balan_subcost }}</span>元，
                  大写：
                  <span
                    class="account-print-val"
                  >{{ showData.balan_subcost_dx?showData.balan_subcost_dx:'零'}}</span>元，
                  本次实际分成比例
                  <span
                    class="account-print-val"
                  >{{ (showData.balan_subscale*100).toFixed(2) }} %</span>
                </template>
                <template v-if="proData.is_fzdw">
                  ，
                  本次分成为第
                  <span class="account-print-val">{{ fz.a }}</span>次分成，
                  此前已分成
                  <span class="account-print-val">{{ fz.b }}</span>次，
                  此前总分成款
                  <span class="account-print-val">{{ fz.c }}</span>元，
                  累计分成金额
                  <span class="account-print-val">{{ fz.d }}</span>元，
                  累计分成比为
                  <span class="account-print-val">{{ fz.e }}</span> %
                </template>。
              </div>
              <div v-if="showData.hz_colleng && showData.hz_colleng.length" class="text-index">
                与
                <template v-for="(item, index) in showData.hz_colleng">
                  <span class="account-print-val" :key="`${index}-0`">
                    <template v-if="index">、</template>
                    {{ item.yf_dwmc }}
                  </span>
                </template>
                合作举办，
                <template v-for="(item, index) in showData.hz_colleng">
                  <template v-if="index">，</template>
                  <span class="account-print-val" :key="`${index}-1`">{{ item.yf_dwmc }}</span>
                  此次分款金额为
                  <span
                    class="account-print-val"
                    :key="`${index}-2`"
                  >{{ item.hz_subcost }}</span> 元
                </template> 。
              </div>
              <div class="text-index">具体学员名单后附。</div>
              <div class="text-index">学院凭此结算报告书赴财务处办理结算手续。</div>
              <div style="padding:10px 0 0 32px">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div class="grid-content bg-purple">学院公章：</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">学院负责人：</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">经手人：</div>
                  </el-col>
                </el-row>
              </div>
              <div v-if="!(ins_time * 1000 > V)" class="footer-dotted-line"></div>
              <div v-if="!(ins_time * 1000 > V)">
                <h2 style="text-align: center">结算情况</h2>
                <p style="text-align: center;margin: 10px 0">（以下内容由财务处填写）</p>
                <div style="line-height: 2.2em">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        结算凭单号：
                        <span class="print-span-blank" style="width: 130px"></span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        管理费比例：
                        <span class="print-span-blank"></span> %
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        本次实际结算金额：
                        <span class="print-span-blank"></span> 元
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        本次实际结算人数：
                        <span class="print-span-blank"></span> 人
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="grid-content bg-purple">
                        本次结算辅助工作承担方分成金额：
                        <span class="print-span-blank"></span> 元
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">财务处结算盖章：</div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        经办人：
                        <span class="print-span-blank" style="width: 120px"></span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :offset="12" :span="12">
                      <div class="grid-content bg-purple">
                        <span class="print-span-blank" style="width: 40px"></span> 年
                        <span class="print-span-blank" style="width: 40px"></span> 月
                        <span class="print-span-blank" style="width: 40px"></span> 日
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div v-if="item!==(ins_time * 1000 > V ? 1 : 3)" style="page-break-before:always;">
              <br>
            </div>
          </div>
        </div>
        <div v-if="$route.path.indexOf('home/') !== -1" style="text-align: center;margin: 40px 0 20px">
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
  name: "app-finance-account-print",
  data() {
    return {
      imgUrl: "",
      showData: {},
      proData: {},
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {}, // 配置信息
      PXLX: 0,
      
      isYXB: false,
      ins_time: null,
      V: 1614873601000000 // 三联变一联
    };
  },
  computed: {
    ...mapState(["URL", "EWM"]),
    fz() {
      // 此前分成款金额数组
      let balan_subcost_before = this.proData.balance_list.filter(
        (item, index) => {
          return item.ins_time < this.ins_time;
        }
      );
      let total10 = 0; // 此前分成款金额
      let total11 = 0; // 累计分成款金额
      let total20 = 0; // 此前结算金额
      let total21 = 0; // 累计结算金额
      balan_subcost_before.forEach(item => {
        total10 += Number(item.balan_subcost);
        total20 += Number(item.balan_cost);
      });
      total11 = total10 + Number(this.showData.balan_subcost);
      total21 = total20 + Number(this.showData.balan_cost);

      // return `本次分成为第 ${ balan_subcost_before.length + 1 } 次分成，
      // 此前已分成 ${ balan_subcost_before.length } 次，
      // 此前总分成款 ${ total10.toFixed(2) } 元，
      // 累计分成金额 ${ total11.toFixed(2) } 元，
      // 累计分成比为 ${ ((total11 / total21) * 100).toFixed(2) } %。`
      return {
        a: balan_subcost_before.length + 1,
        b: balan_subcost_before.length,
        c: total10.toFixed(2),
        d: total11.toFixed(2),
        e: ((total11 / total21) * 100).toFixed(2)
      };
    }
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions(["printFinanceAccount"]),
    initData(obj) {
      this.printFinanceAccount({
        data: {
          id: obj.id
        },
        id: obj.id,
        front: obj.front
      }).then(data => {
        if (data.data.code === 200) {
          this.showData = data.data.data;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.data,
            onClose: () => {
              this.$router.go(-1);
            }
          });
        }
      });
    },
    doPrint() {
      doPrint()
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    const path = this.$route;
    this.imgUrl = `${this.EWM}/5/id/${path.params.id}`
    let Obj = {};
    if (path.fullPath.indexOf("home") > 0) {
      // 验证
      Obj = {
        id: path.params.id,
        front: false // true为前台无需验证，false验证登录
      };
    } else {
      Obj = {
        id: path.params.id,
        front: true // true为前台无需验证，false验证登录
      };
    }
    if (sessionStorage.getItem("ACPI2")) {
      this.proData = JSON.parse(sessionStorage.getItem("ACPI2"));
      this.PXLX = this.proData.pxlx;
    } else {
      this.$router.go(-1);
    }
    const Route = this.$route;
    if (Route.query.ins_time) {
      this.ins_time = Route.query.ins_time;
      this.initData(Obj);
    }
    // this.initData(Obj);
  },
  beforeDestroy() {
    sessionStorage.removeItem("ACPI2");
  }
};
</script>

<style scoped>
.finance-account-print-wrap {
  padding: 30px;
}
.finance-account-print-item {
  font-family: "SimSun";
  width: 640px;
  margin: 0 auto;
  padding: 50px 30px 0;
  color: #303133;
}
.code-img {
  position: absolute;
  top: 0;
  right: 10px;
  width: 100px;
  height: 100px;
  background-color: #dfe4ed;
}
.finance-account-print-content {
  padding: 0 40px;
  line-height: 1.8em;
  font-size: 14px;
}

.account-print-val {
  padding: 0 4px;
  border-bottom: 1px solid #303133;
}
.footer-dotted-line {
  padding-top: 30px;
  margin-bottom: 20px;
  border-bottom: 1px dotted #000;
}
.print-span-blank {
  display: inline-block;
  width: 80px;
  border-bottom: 1px solid #303133;
}
/*缩进*/
.text-index {
  text-indent: 2em;
}
</style>
