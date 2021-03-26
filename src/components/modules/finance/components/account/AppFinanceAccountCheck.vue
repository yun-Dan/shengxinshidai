<template>
  <div
    class="app-finance-account-check"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <el-collapse v-model="activeNames">
        <!--结算信息-->
        <el-collapse-item name="1">
          <template slot="title">
            <strong>
              <i class="el-icon-star-on"></i> 结算申请填报信息：
            </strong>
          </template>
          <div class="finance-account-check-box clearfix" v-cloak>
            <div class="fl finance-account-check-list">
              <!--项目相关-->
              <ul class>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">项目名称：</strong>
                  <span class="fl finance-account-check-text">{{ showData.pro_name }}</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">项目编号：</strong>
                  <span class="fl finance-account-check-text">{{ proData.pro_code }}</span>
                  【
                  <span
                    v-for="(item,key,index) in proConfig.pxlx"
                    :key="index"
                  >{{ proData.pxlx==key?item:''}}</span>】
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">授课方式：</strong>
                  <span class="fl finance-account-check-text">
                    <template v-for="(item,key) in proConfig.skfs">
                      <template v-if="showData.skfs == key">
                        {{ item }}
                        <span v-if="showData.skfs == 2 && !isYXB && showData.review_time" :key="key" class="danger">
                          （2020年03月01日{{ showData.review_time > 1582992000 ? '后' : '前' }}的）
                        </span>
                      </template>
                    </template>
                  </span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">证书制作人数：</strong>
                  <span class="fl finance-account-check-text">{{ showData.certf_num}} 人次</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">计划培训天数：</strong>
                  <span class="fl finance-account-check-text">{{ proData.pxts }} 天</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">立项收费标准：</strong>
                  <span class="fl finance-account-check-text">
                    <template v-if="proData.sfbz===1">单位支付{{ proData.sfbz_dw }}元</template>
                    <template v-if="proData.sfbz===2">学员自行支付{{ proData.sfbz_xy }}元/人标准</template>
                    <template v-if="proData.sfbz===3">单位支付{{ proData.sfbz_dw }}元，学员支付{{ proData.sfbz_xy }}元/人标准</template>
                    <template v-if="proData.sfbz===4">
                      按照课时或模块支付，具体收费方式为：{{ proData.specific_rate }}
                    </template>
                  </span>
                </li>
                <!--                            <template v-if="showData.balan_subcost">-->
                <!--                                <li class="clearfix finance-account-check-item">-->
                <!--                                    <strong class="fl finance-account-check-title">分成款分期数：</strong>-->
                <!--                                    <span class="fl finance-account-check-text">{{ showData.profz_yf_fqs }} 期</span>-->
                <!--                                </li>-->
                <!--                                <li class="clearfix finance-account-check-item">-->
                <!--                                    <strong class="fl finance-account-check-title">辅助单位总分成比例：</strong>-->
                <!--                                    <span class="fl finance-account-check-text">{{ showData.profz_yf_fcbl}} </span>-->
                <!--                                </li>-->
                <!--                            </template>-->
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">项目评估结果：</strong>
                  <span
                    v-if="showData.pingfenjieguo===0"
                    class="fl finance-account-check-text"
                  >未提交问卷</span>
                  <span v-if="showData.pingfenjieguo===1" class="fl finance-account-check-text">
                    {{ showData.is_evaluate_pinggulv?'不合格':'不合格'}}
                    （
                    <span style="color: #f56c6c">{{ showData.zongpingjunfen}}</span> 分，评估率：
                    <strong>{{ showData.pinggulv }}</strong>%）
                  </span>
                  <span v-if="showData.pingfenjieguo===2" class="fl finance-account-check-text">
                    {{ showData.is_evaluate_pinggulv?'一般':'不合格'}}
                    （
                    <span style="color: #e6a23c">{{ showData.zongpingjunfen}}</span> 分，评估率：
                    <strong>{{ showData.pinggulv }}</strong>%）
                  </span>
                  <span v-if="showData.pingfenjieguo===3" class="fl finance-account-check-text">
                    {{ showData.is_evaluate_pinggulv?'良好':'不合格'}}
                    （
                    <span style="color: #67c23a">{{ showData.zongpingjunfen}}</span> 分，评估率：
                    <strong>{{ showData.pinggulv }}</strong>%）
                  </span>
                  <span v-if="showData.pingfenjieguo===4" class="fl finance-account-check-text">
                    {{ showData.is_evaluate_pinggulv?'优秀':'不合格'}}
                    （
                    <span style="color: #67c23a">{{ showData.zongpingjunfen}}</span> 分，评估率：
                    <strong>{{ showData.pinggulv }}</strong>%）
                  </span>
                  <span
                    v-if="showData.pingfenjieguo===5"
                    class="fl finance-account-check-text"
                  >暂时没有该评分的评级</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">项目考核结果：</strong>
                  <span class="fl finance-account-check-text">
                    <span
                      v-if="showData.appraisals_sy_score<60"
                      style="color: #f56c6c"
                    >{{ showData.appraisals_sy_score }}</span>
                    <span
                      v-if="showData.appraisals_sy_score>=60"
                      style="color: #67c23a"
                    >{{ showData.appraisals_sy_score }}</span>
                    分
                  </span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">是否迟报漏报：</strong>
                  <span class="fl finance-account-check-text">
                    <span v-if="showData.is_dgdwjs" style="color: #f56c6c">是</span>
                    <span v-else style="color: #67c23a">否</span>
                  </span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">当前审核状态：</strong>
                  <span
                    v-if="showData.status===1"
                    class="fl finance-account-check-text"
                    style="color: #e6a23c"
                  >待审核</span>
                  <span
                    v-if="showData.status===5"
                    class="fl finance-account-check-text"
                    style="color: #67c23a"
                  >通过</span>
                  <span
                    v-if="showData.status===4"
                    class="fl finance-account-check-text"
                    style="color: #f56c6c"
                  >不通过</span>
                </li>
              </ul>
              <!-- @@辅助单位分成信息 -->
              <template
                v-if="showData.balan_subcost && showData.profz_yf_fqs && showData.profz_yf_fqs_time"
              >
                <div style="height: 1px; background-color: rgba(79,109,136,0.58); margin: 10px 0"></div>
                <div style="font-weight: bolder">辅助单位分款信息：</div>
                <ul class>
                  <li class="clearfix finance-account-check-item">
                    <div class="clearfix">
                      <strong class="fl finance-account-check-title">分成款分期数：</strong>
                      <span class="fl finance-account-check-text">{{ showData.profz_yf_fqs }} 期</span>
                    </div>
                    <div
                      style="width:80%;font-size: 12px;line-height: 24px;padding: 0 40px 10px"
                    >{{ showData.profz_yf_fqs_time }}</div>
                  </li>
                  <li class="clearfix finance-account-check-item">
                    <strong class="fl finance-account-check-title">辅助单位{{ isYXB ? '最高' : '总' }}分成比例：</strong>
                    <span class="fl finance-account-check-text">{{ showData.profz_yf_fcbl}}{{ isYXB && (showData.profz_yf_fcbl || 0) > -1 ? '%' : '' }}</span>
                  </li>
                  <!--辅助单位分成及比例-->
                  <li class="clearfix finance-account-check-item">
                    <strong class="fl finance-account-check-title">本次分款金额：</strong>
                    <span class="fl finance-account-check-text">{{ showData.balan_subcost }} 元</span>
                  </li>
                  <li class="clearfix finance-account-check-item">
                    <strong class="fl finance-account-check-title">本次分成比例：</strong>
                    <span
                      class="fl finance-account-check-text"
                    >{{ (showData.balan_subscale*100).toFixed(2) }} %</span>
                  </li>
                  <!---->
                  <li class="clearfix finance-account-check-item">
                    <div style="margin: 0 40px">{{ fz }}</div>
                  </li>
                </ul>
              </template>
              <!-- @@合作学院分成信息 -->
              <template v-if="showData.college && showData.college.length">
                <div style="font-weight: bolder">合作学院分款信息：</div>
                <ul class>
                  <li
                    class="clearfix finance-account-check-item"
                    v-for="(item, index) in showData.college"
                    :key="index"
                  >
                    <strong class="fl finance-account-check-title">{{ item.yf_dwmc }}：</strong>
                    <span class="fl finance-account-check-text">
                      本次分款金额：{{ item.hz_subcost }} 元 ,
                      本次分成比例：{{ (item.hz_subscale * 100).toFixed(2) }} %
                    </span>
                  </li>
                </ul>
              </template>
            </div>
            <!--结算相关-->
            <div class="fl finance-account-check-list">
              <ul>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">经手人：</strong>
                  <span class="fl finance-account-check-text">{{ showData.js_username }}</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">手机号码：</strong>
                  <span class="fl finance-account-check-text">{{ showData.js_lxfs }}</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">本次结算人数：</strong>
                  <span class="fl finance-account-check-text">{{ showData.balan_pers }} 人</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">总培训天数：</strong>
                  <span class="fl finance-account-check-text">{{ showData.balan_days }} 天</span>
                </li>
                <li class="clearfix finance-account-check-item">
                  <strong class="fl finance-account-check-title">本次结算金额：</strong>
                  <span class="fl finance-account-check-text">{{ showData.balan_cost }} 元</span>
                </li>
                <li
                  v-if="showData.prowt_list&&showData.prowt_list.length"
                  class="clearfix finance-account-check-item"
                >
                  <strong class="fl finance-account-check-title">委托协议：</strong>
                  <div class="fl finance-account-check-text">
                    <div v-for="(item,index) in showData.prowt_list" :key="index">
                      <a
                        v-if="item.contract_code_file"
                        target="_blank"
                        :href=" lookUrl+ '/'+item.contract_code_file"
                      >
                        <el-button type="text" style="padding: 0px">{{ item.contract_code }}【查看】</el-button>
                      </a>
                      <span v-else style="color: #3a8ee6">{{ item.contract_code }}【未上传】</span>
                    </div>
                  </div>
                </li>
                <li
                  v-if="showData.profz_list&&showData.profz_list.length"
                  class="clearfix finance-account-check-item"
                >
                  <strong class="fl finance-account-check-title">辅助协议：</strong>
                  <div class="fl finance-account-check-text">
                    <div v-for="(item,index) in showData.profz_list" :key="index">
                      <a
                        v-if="item.contract_code_file"
                        target="_blank"
                        :href=" lookUrl+ '/'+item.contract_code_file"
                      >
                        <el-button type="text" style="padding: 0px">{{ item.contract_code }}【查看】</el-button>
                      </a>
                      <span v-else style="color: #3a8ee6">{{ item.contract_code }}【未上传】</span>
                    </div>
                  </div>
                </li>
                <li
                  v-if="showData.prohz_list&&showData.prohz_list.length"
                  class="clearfix finance-account-check-item"
                >
                  <strong class="fl finance-account-check-title">合作协议：</strong>
                  <div class="fl finance-account-check-text">
                    <div v-for="(item,index) in showData.prohz_list" :key="index">
                      <a
                        v-if="item.contract_code_file"
                        target="_blank"
                        :href=" lookUrl+ '/'+item.contract_code_file"
                      >
                        <el-button type="text" style="padding: 0px">{{ item.contract_code }}【查看】</el-button>
                      </a>
                      <span v-else style="color: #3a8ee6">{{ item.contract_code }}【未上传】</span>
                    </div>
                  </div>
                </li>
                <li
                  v-if="showData.proqt_list&&showData.proqt_list.length"
                  class="clearfix finance-account-check-item"
                >
                  <strong class="fl finance-account-check-title">其他协议：</strong>
                  <div class="fl finance-account-check-text">
                    <div v-for="(item,index) in showData.proqt_list" :key="index">
                      <a
                        v-if="item.contract_code_file"
                        target="_blank"
                        :href=" lookUrl+ '/'+item.contract_code_file"
                      >
                        <el-button type="text" style="padding: 0px">{{ item.contract_code }}【查看】</el-button>
                      </a>
                      <span v-else style="color: #3a8ee6">{{ item.contract_code }}【未上传】</span>
                    </div>
                  </div>
                </li>
                <!--政府类培训start-->
                <template v-if="PXLX===6 && !isYXB">
                  <li class="clearfix finance-account-check-item">
                    <div class="clearfix">
                      <strong
                        class="fl finance-account-check-title"
                        style="width: 186px"
                      >管理费比例申请调减为：</strong>
                      <span
                        class="fl finance-account-check-text"
                      >{{ showData.manage_scale?showData.manage_scale:'0'}} %</span>
                    </div>
                    <div
                      style="width:80%;font-size: 12px;color: #606266;line-height: 24px;margin: 8px 40px"
                    >
                      依据政府类培训班管理费食宿优惠政策，申请调减本次培训班管理费为：
                      <strong
                        style="color: #5daf34;text-decoration: underline"
                      >{{ showData.manage_scale?showData.manage_scale:'0'}} %</strong>。
                      <br>（按照
                      <strong>8%</strong>比例收取管理费的政府培训班，如安排食宿按照
                      <strong>5%</strong>比例收取管理费；
                      若只安排餐或者宿，按照
                      <strong>7%</strong>比例收取管理费。
                      因办班单位违规而取消政府类培训班管理费优惠政策的，食宿费用不予调减管理费比例。）
                    </div>
                  </li>
                  <li class="clearfix finance-account-check-item">
                    <strong class="fl finance-account-check-title">就餐发票凭据：</strong>
                    <div class="fl finance-account-check-text">
                      <a
                        v-if="showData.dining_file"
                        target="_blank"
                        :href=" lookUrl+ '/'+showData.dining_file"
                      >
                        <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                      </a>
                      <span v-else>无</span>
                    </div>
                  </li>
                  <li class="clearfix finance-account-check-item">
                    <strong class="fl finance-account-check-title">住宿发票凭据：</strong>
                    <div class="fl finance-account-check-text">
                      <a
                        v-if="showData.house_file"
                        target="_blank"
                        :href=" lookUrl+ '/'+showData.house_file"
                      >
                        <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                      </a>
                      <span v-else>无</span>
                    </div>
                  </li>
                </template>
                <!--政府类培训end-->
              </ul>
              <div
                v-if="showData.teachers && showData.teachers.length || showData.outside && showData.outside.length"
                class="finance-account-check-list-teachers"
              >
                <div style="height: 1px; background-color: rgba(79,109,136,0.58); margin-top: 10px"></div>
                <div style="font-weight: bolder">教师信息：</div>
                <el-table
                  v-if="showData.teachers && showData.teachers.length"
                  :data="showData.teachers"
                  size="mini"
                  border
                  :header-cell-style="{backgroundColor:'#fafafa'}"
                  style="width: 100%; margin-bottom: 14px"
                >
                  <el-table-column align="center" label="校内教师">
                    <el-table-column align="center" prop="cou_name" label="课程名称"></el-table-column>
                    <el-table-column align="center" prop="teacher" label="姓名"></el-table-column>
                    <el-table-column align="center" prop="idnumber" label="职工号"></el-table-column>
                  </el-table-column>
                </el-table>
                <el-table
                  v-if="showData.outside && showData.outside.length"
                  :data="showData.outside"
                  size="mini"
                  border
                  :header-cell-style="{backgroundColor:'#fafafa'}"
                  style="width: 100%"
                >
                  <el-table-column align="center" label="校外教师">
                    <el-table-column align="center" prop="cou_name" label="课程名称"></el-table-column>
                    <el-table-column align="center" prop="teacher" label="姓名"></el-table-column>
                    <el-table-column align="center" prop="idnumber" label="身份证号"></el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <!--审核-->
        <el-collapse-item name="2">
          <template slot="title">
            <strong>管理员审核：</strong>
          </template>
          <div style="margin-left: 140px; margin-bottom: 20px;">
            <span style="font-weight: 600;" class="danger">【重要提示】：</span>
            <template v-if="showTip">（一）</template>总培训天数、相关协议文件将以<span style="font-weight: 600;" class="danger">第一次审核通过的为准</span>，请认真检查提交审核的结算信息！
            <div v-if="showTip" style="text-indent: 7em;">
              （二）该项目 “<span style="font-weight: 600;" class="danger">{{ showTip }}</span>” 请注意核对人员名单！
            </div>
          </div>
          <div v-cloak>
            <el-form :model="checkForm" label-width="240px" style="text-align: left;width: 80%">
              <el-form-item label="批准管理费比例：" :rules="[{required:true}]">
                <el-input-number
                  v-model.trim="checkForm.pzmanage_scale"
                  :precision="2"
                  :step="1"
                  :min="0"
                  :max="100"
                  :disabled="!is_must_false"
                  controls-position="right"
                ></el-input-number>%
              </el-form-item>
              <el-form-item label="审核结果：" :rules="[{required:true}]">
                <el-radio-group v-model="checkForm.status">
                  <el-radio :label="5">通过</el-radio>
                  <el-radio :label="4">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="checkForm.status===4" label="不通过原因：" :rules="[{required:true}]">
                <el-row :gutter="20">
                  <el-col :xs="22" :sm="13">
                    <div class="grid-content bg-purple">
                      <el-input type="textarea" v-model.trim="checkForm.status_btyy"></el-input>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button @click.native="handleSubmit(true)" type="success">确 认</el-button>
                <!-- <el-button @click.native="handleSubmit(isYXB ? true : false)" type="success">确 认</el-button> -->
                <el-button @click.native="$router.go(-1)" type>返 回</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
        <!-- 学员名单 -->
        <el-collapse-item name="3">
          <template slot="title">
            <strong>学员名单（共 {{ studentsList.length || 0 }} 人）：</strong>
            <template v-if="isYXB">
              （<span class="info">本次结算人员姓名已</span><span class="teachersid-active">标红</span>）
            </template>
          </template>
          <div>
            <el-table :data="studentsList" border style="width: 100%">
              <el-table-column type="index" align="center" label="序号" width="40"></el-table-column>
              <el-table-column align="center" prop="name" label="姓名" min-width="40px">
                <template slot-scope="scope">
                  <span :class="{ 'teachersid-active': showData.teachersid && showData.teachersid.indexOf(scope.row.id) != -1 || showData.teachersid && showData.teachersid.indexOf(`${scope.row.id}`) != -1 }">
                    {{ scope.row.name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="sex" label="性别" width="54px"></el-table-column>
              <el-table-column align="center" prop="national" label="民族" min-width="40px"></el-table-column>
              <el-table-column align="center" prop="idcard" label="身份证号"></el-table-column>
              <el-table-column align="center" prop="mobile" label="手机号码"></el-table-column>
              <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
              <el-table-column align="center" prop="company" label="工作单位"></el-table-column>
              <el-table-column align="center" prop="resign" label="职务" min-width="40px"></el-table-column>
              <el-table-column align="center" prop="resign" label="入校申请状态" min-width="60px">
                <template slot-scope="scope">
                  <span v-if="applyStateus[scope.row.apply]" :class="applyStateus[scope.row.apply].type">
                    {{ applyStateus[scope.row.apply].label }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
const prompts = {
  dz_dz: '申请了电子版证书',
  pro_dz: '举办地在新疆',
  rov_dz: '提交了入校申请',
  wt_dz: '委托单位在新疆'
}
const applyStateus = {
  0: {
    label: '未申请',
    type: 'info',
    value: 0
  },
  1: {
    label: '待审批',
    type: 'warning',
    value: 1
  },
  2: {
    label: '拒绝',
    type: 'danger',
    value: 2
  },
  3: {
    label: '通过',
    type: 'success',
    value: 3
  }
}
export default {
  name: "app-finance-account-check",
  data() {
    return {
      loading2: false,
      activeNames: ["1", "2", '3'],
      showData: {
        teachersid: []
      },
      PXLX: 0, // 培训类型为政府类6
      checkForm: {
        id: 0,
        status: 5, // 2通过,3不通过
        pzmanage_scale: 0, // 批准管理费比例
        uid: 0,
        status_btyy: "" // 审核不通过说明
      },
      proData: {
        balance_list: []
      },
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      is_must_false: false,
      ins_time: null,
      Query: {},
      
      isYXB: false,
      // 配置
      prompts,
      applyStateus,
      // 人员名单
      studentsList: [],
      showTip: ''
    };
  },
  computed: {
    ...mapState(["lookUrl", 'userInfo', 'versionTime_4']),
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

      return `本次分成为第 ${balan_subcost_before.length + 1} 次分成，
                此前已分成 ${balan_subcost_before.length} 次，
                此前总分成款 ${total10.toFixed(2)} 元，
                累计分成金额 ${total11.toFixed(2)} 元，
                累计分成比为 ${((total11 / total21) * 100).toFixed(2)} %。`;
    }
  },
  methods: {
    ...mapActions(["getFinanceAccountInfo", "checkFinanceAccount", 'getStudentsData']),
    initData(id) {
      this.getFinanceAccountInfo({
        id: id
      }).then(data => {
        if (data.data.code === 200) {
          this.loading2 = false;
          this.showData = data.data.data;
          this.is_must_false = this.showData.pzmanflag;
          // start
          const pxlx = sessionStorage.getItem("PXLX6")
          if (pxlx) {
            this.PXLX = Number(pxlx);
            if (this.isYXB) {
              if (this.showData.province && this.showData.province.indexOf('北京') !== -1) {
                if (this.showData.profz_list && this.showData.profz_list.length) {
                  this.$set(this.checkForm, 'pzmanage_scale', 28)
                } else {
                  this.$set(this.checkForm, 'pzmanage_scale', 25)
                }
              } else {
                if (this.showData.profz_list && this.showData.profz_list.length) {
                  this.$set(this.checkForm, 'pzmanage_scale', 23)
                } else {
                  this.$set(this.checkForm, 'pzmanage_scale', 20)
                }
              }
            } else {
              if (this.PXLX === 6) {
                this.$set(this.checkForm, "pzmanage_scale", 8);
              } else {
                if (this.proData.college === "继续教育学院" || this.proData.college === "律师学院") {
                  this.$set(this.checkForm, "pzmanage_scale", 16);
                } else if (this.proData.college === "教育培训中心") {
                  this.$set(this.checkForm, "pzmanage_scale", 12);
                } else {
                  this.$set(this.checkForm, "pzmanage_scale", 15);
                }
              }
            }
          }
          // end
          if (this.showData.pzmanage_scale) {
            this.$set(this.checkForm, "pzmanage_scale", this.showData.pzmanage_scale);
          }
          if (!this.isYXB) {
            this.setTip()
          }
          this.getStudents(this.showData.pro_id)
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
          this.$router.go(-1);
        }
      });
    },
    handleSubmit(Submit = false) { // Submit：true提交、false提示确认信息后提交
      if (Submit) { // 直接提交
        const Obj = {};
        Object.assign(Obj, this.checkForm, {
          id: this.$route.params.id,
          uid: this.userInfo.uid
        });
        if (Obj.status === 3) {
          if (!Obj.status_btyy) {
            this.$message({
              type: "warning",
              message: "请输入审核不通过的原因！"
            });
            return false;
          }
        }
        this.loading2 = true;
        if (this.loading2) {
          this.checkFinanceAccount({
            data: Obj
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              this.$router.go(-1);
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading2 = false;
                }
              });
            }
          });
        }
      } else { // 提示
        let showTip = ''
        if (this.showData.prompts) {
          for (let key in prompts) {
            if (this.showData.prompts[key] > 0) {
              showTip = prompts[key]
            }
          }
        }
        if (showTip) {
          this.$confirm(`该项目 “${showTip}” 请注意核对人员名单！`, '提示', {
            confirmButtonText: '确认提交',
            cancelButtonText: '核对名单',
            type: 'warning',
            center: true
          }).then(() => {
            this.handleSubmit(true)
          })
        } else {
          this.handleSubmit(true)
        }
      }
    },
    getStudents (ID) {
      this.getStudentsData({
        data: {
          pro_id: ID,
          status: 2
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.studentsList = data.data.data.list || []
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      })
    },
    setTip () {
      this.showTip = ''
      if (this.showData.prompts) {
        for (let key in prompts) {
          if (this.showData.prompts[key] > 0) {
            this.showTip = prompts[key]
          }
        }
      }
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.loading2 = true;

    if (sessionStorage.getItem("ACPI")) {
      this.proData = JSON.parse(sessionStorage.getItem("ACPI"));
    } else {
      this.$router.go(-1);
    }
    // const pxlx = sessionStorage.getItem("PXLX6");
    // if (pxlx) {
    //   this.PXLX = Number(pxlx);
      // if (this.PXLX === 6) {
      //   this.$set(this.checkForm, "pzmanage_scale", 8);
      // } else {
      //   if (this.proData.college === "继续教育学院" || this.proData.college === "律师学院") {
      //     this.$set(this.checkForm, "pzmanage_scale", 16);
      //   } else if (this.proData.college === "教育培训中心") {
      //     this.$set(this.checkForm, "pzmanage_scale", 12);
      //   } else {
      //     this.$set(this.checkForm, "pzmanage_scale", 15);
      //   }
      // }
    // }
    const Route = this.$route;
    this.Query = Route.query
    if (Route.params.id && Route.query.ins_time) {
      this.ins_time = Route.query.ins_time;
      this.initData(Route.params.id);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("PXLX6");
    sessionStorage.removeItem("ACPI");
  }
};
</script>

<style scoped>
.app-finance-account-check{
  padding-bottom: 40px;
}
.finance-account-check-box {
  line-height: 40px;
}
.finance-account-check-list {
  width: 45%;
  margin-left: 40px;
  padding-bottom: 20px;
}
.finance-account-check-list li:nth-of-type(2n) {
  background-color: #fafafa;
}
.finance-account-check-list li:nth-of-type(2n + 1) {
  background-color: #ebeef5;
}
.finance-account-check-title {
  width: 150px;
  padding-left: 40px;
  line-height: 20px;
  padding: 10px 0 10px 40px;
}
.finance-account-check-list-teachers {
  margin-top: 20px;
}
.teachersid-active{
  font-weight: 600;
  color: #F56C6C;
}
</style>
