<template>
  <div
    class="app-project-declare"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <el-card>
      <div v-if="is_declare && !isce.id" slot="header" class="clearfix" v-cloak>
        <el-button @click.native="$router.go(-1)" type="primary">返 回</el-button>
      </div>
      <div id="subOutputRank-print" class v-cloak>
        <div class="project-declare-main">
          <div class="project-declare-main-head">
            <div
              class="project-declare-title"
            >中国人民大学非学历教育培训{{ form0.gl_type == 5 ? '预立项' : '项目' }}申报书</div>
            <div class="project-declare-sub">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <span class="project-declare-label">申报单位：</span>
                    <span class="project-declare-value">{{ form0.college }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <span class="project-declare-label">申报时间：</span>
                    <span
                      class="project-declare-value"
                    >{{ form0.create_time | TimestampChangeFilter(true) }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="project-declare-main-body">
            <div class="project-declare-main-item">
              <header class="project-declare-item-title">一、项目基本信息</header>
              <table border="1" class="project-declare-item-table">
                <tr>
                  <td class="td-center td-title-1">项目名称</td>
                  <td colspan="5">{{ form0.pro_name }}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">管理类型</td>
                  <td colspan="5">
                    <template v-for="(item,key,index) in proConfig.gl_type">
                      <img
                        v-if="key==form0.gl_type"
                        src="../../../../assets/images/yes.gif"
                        :key="`${index}-gl_type-img1`"
                        class="yes-no-img"
                      >
                      <img v-else :key="`${index}-gl_type-img2`" src="../../../../assets/images/no.gif" class="yes-no-img">
                      <span :key="`${index}-gl_type-span`" class="check-box-span">{{ item }}</span>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">生源类型</td>
                  <td colspan="5">
                    <template v-for="(item,key,index) in proConfig.zs_type">
                      <img
                        v-if="key==form0.zs_type"
                        src="../../../../assets/images/yes.gif"
                        :key="`${index}-zs_type-img1`"
                        class="yes-no-img"
                      >
                      <img v-else :key="`${index}-zs_type-img2`" src="../../../../assets/images/no.gif" class="yes-no-img">
                      <span :key="`${index}-zs_type-span`" class="check-box-span">{{ item}}</span>
                    </template>
                  </td>
                </tr>
                <tr v-if="form0.zs_type==2">
                  <td class="td-center td-title-1">招生时间</td>
                  <td
                    colspan="5"
                  >{{ form0.zs_start_time | TimestampChangeFilter(true) }} 至 {{ form0.zs_end_time | TimestampChangeFilter(true) }}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">培训时间</td>
                  <td
                    colspan="5"
                  >{{ form0.px_start_time | TimestampChangeFilter(true) }} 至 {{ form0.px_end_time | TimestampChangeFilter(true) }}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">培训天数</td>
                  <td colspan="2">{{ form0.pxts }} 天</td>
                  <td class="td-center">培训总课时</td>
                  <td colspan="2">{{ form0.pxzks }} 课时（1课时=60分钟）</td>
                </tr>
                <tr v-if="form0.gl_type != 4">
                  <td class="td-center td-title-1">培训地点</td>
                  <td colspan="5">{{ form0.province }}{{ form0.city }}{{ form0.pxdd }}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">招生人数</td>
                  <td colspan="2">
                    <div style="width: 150px">{{ form0.zsrs }} 人</div>
                  </td>
                  <td class="td-center">招生对象</td>
                  <td colspan="2">{{ form0.zsdx }}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">授课方式</td>
                  <td colspan="2" style="padding-right: 4px">
                    <template v-for="(item,key,index) in proConfig.skfs">
                      <img
                        v-if="key==form0.skfs"
                        src="../../../../assets/images/yes.gif"
                        :key="`${index}-skfs-img1`" class="yes-no-img"
                      >
                      <img
                        v-else
                        :key="`${index}-skfs-img2`"
                        src="../../../../assets/images/no.gif"
                        class="yes-no-img"
                      >
                      <span :key="`${index}-skfs-span`" class="check-box-span">{{ item}}</span>
                    </template>
                  </td>
                  <td class="td-center">是否有辅助单位</td>
                  <td colspan="2">
                    <template>
                      <img v-if="form3.id" src="../../../../assets/images/yes.gif" class="yes-no-img">
                      <img v-if="!form3.id" src="../../../../assets/images/no.gif" class="yes-no-img">
                      <span class="check-box-span">是</span>
                    </template>
                    <template>
                      <img v-if="form3.id" src="../../../../assets/images/no.gif" class="yes-no-img">
                      <img v-if="!form3.id" src="../../../../assets/images/yes.gif" class="yes-no-img">
                      <span class="check-box-span">否</span>
                    </template>
                  </td>
                </tr>
                <template v-if="form0.skfs == 2 || form0.skfs == 3">
                  <tr>
                    <td class="td-center td-title-1">网络平台名称</td>
                    <td colspan="5">{{ form0.platform_network}}</td>
                  </tr>
                  <tr>
                    <td class="td-center td-title-1">网络平台网址</td>
                    <td colspan="5">{{ form0.platform_site }}</td>
                  </tr>
                  <tr>
                    <td class="td-center td-title-1">网络平台介绍</td>
                    <td colspan="5">{{ form0.platform_introduced }}</td>
                  </tr>
                </template>
                <tr>
                  <td class="td-center td-title-1">
                    是否零收费
                    <br>公益项目
                  </td>
                  <td colspan="5">
                    <template>
                      <img v-if="form0.welfare == 1" src="../../../../assets/images/yes.gif" class="yes-no-img">
                      <img src="../../../../assets/images/no.gif" v-else class="yes-no-img">
                      <span class="check-box-span">是</span>
                    </template>
                    <template>
                      <img v-if="form0.welfare == 2" src="../../../../assets/images/yes.gif" class="yes-no-img">
                      <img src="../../../../assets/images/no.gif" v-else class="yes-no-img">
                      <span class="check-box-span">否</span>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">收费标准</td>
                  <td colspan="5">
                    <template v-if="form0.ks_charge === 2">
                      <span v-if="form0.sfbz===2">学员自行按照标准支付，</span>
                      <span v-if="form0.sfbz===3">委托单位与学员共同支付，</span>
                      <span>{{ form0.specific_rate }}</span>
                    </template>
                    <template v-else>
                      <div v-if="1==form0.sfbz">
                        委托单位统一支付
                        <span>{{1==form0.sfbz?form0.sfbz_dw:''}}</span> 元。
                      </div>
                      <div v-if="2==form0.sfbz">
                        受训学员自行按照
                        <span>{{2==form0.sfbz?form0.sfbz_xy:''}}</span> 元/人标准支付。
                      </div>
                      <div v-if="3==form0.sfbz">
                        委托单位支付
                        <span>{{3==form0.sfbz?form0.sfbz_dw:''}}</span> 元，
                        学员按照
                        <span>{{3==form0.sfbz?form0.sfbz_xy:''}}</span> 元/人标准支付。
                      </div>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">
                    培训费用包含
                    <br>的用途和项目
                  </td>
                  <td colspan="5">{{ form0.pxfy_desc }}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">收费优惠政策</td>
                  <td colspan="2">
                    <template>
                      <img v-if="form0.is_yhzc" src="../../../../assets/images/yes.gif" class="yes-no-img">
                      <img src="../../../../assets/images/no.gif" v-else class="yes-no-img">
                      <span class="check-box-span">是</span>
                    </template>
                    <template>
                      <img v-if="!form0.is_yhzc" src="../../../../assets/images/yes.gif" class="yes-no-img">
                      <img src="../../../../assets/images/no.gif" v-else class="yes-no-img">
                      <span class="check-box-span">否</span>
                    </template>
                  </td>
                  <td class="td-center">
                    优惠政策凭
                    <br>据文件名称
                  </td>
                  <td colspan="2">{{ form0.yhzc_wjmc?form0.yhzc_wjmc:'无'}}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">
                    项目收费优
                    <br>惠具体方案
                  </td>
                  <td colspan="5">
                    <template v-if="yhForm.length">
                      <div v-for="(item,index) in yhForm" :key="`${item.id}-yhForm`">
                        优惠价格{{ index+1}}：
                        <span>{{ item.yhjg }}</span> 元，优惠条件：
                        <span>{{ item.yhtj}}</span>
                      </div>
                    </template>
                    <span v-else>无</span>
                  </td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">项目联系人</td>
                  <td colspan="2">{{ form0.user }}</td>
                  <td class="td-center">联系电话</td>
                  <td colspan="2">{{ form0.tel}}</td>
                </tr>
                <tr>
                  <td class="td-center td-title-1">其他需要说明情况</td>
                  <td colspan="5">{{ form0.note?form0.note:'无'}}</td>
                </tr>
              </table>
            </div>
            <div class="project-declare-main-item">
              <header class="project-declare-item-title">二、课程设置</header>
              <table border="1" class="project-declare-item-table">
                <tr>
                  <td rowspan="2" class="td-center" style="width: 30px">序号</td>
                  <td rowspan="2" class="td-center" style="width: 112px">课程名称</td>
                  <td colspan="4" class="td-center" style>主讲教师</td>
                  <td rowspan="2" class="td-center" style="width: 40px">学时</td>
                </tr>
                <tr>
                  <td colspan class="td-center" style="width: 60px">姓&nbsp;&nbsp;名</td>
                  <td colspan class="td-center" style="width: 80px">职称/职务</td>
                  <td colspan class="td-center" style="width: 120px">职工号/身份证号</td>
                  <td colspan class="td-center">工作单位</td>
                </tr>
                <tr v-for="(item,index) in form1" :key="`${index}-form1`">
                  <td class="td-center">{{ index+1}}</td>
                  <td class="td-center">{{ item.cou_name }}</td>
                  <td class="td-center">{{ item.teacher }}</td>
                  <td class="td-center">{{ item.job }}</td>
                  <td class="td-center">{{ item.idnumber }}</td>
                  <td class="td-center">{{ item.unit }}</td>
                  <td class="td-center">{{ item.school_hours }}</td>
                </tr>
              </table>
            </div>
            <template v-if="form2[0].id||form2[0].pro_id">
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item">
                <header class="project-declare-item-title">三、委托培训信息</header>
                <template>
                  <template v-for="(item,index) in form2">
                    <table :key="`${index}-form2-table`" border="1" class="project-declare-item-table">
                      <tr>
                        <td class="td-center" style="width: 100px">委托单位名称</td>
                        <td colspan="2" style="width: 180px">{{ item.jf_dwmc }}</td>
                        <td class="td-center" style="width: 120px">委托单位联系人</td>
                        <td colspan="2">{{ item.jf_lxr }}</td>
                      </tr>
                      <tr>
                        <td class="td-center">邮编</td>
                        <td colspan="2">{{ item.jf_yb }}</td>
                        <td class="td-center">委托单位联系人电话</td>
                        <td colspan="2">{{ item.jf_lxdh}}</td>
                      </tr>
                      <tr>
                        <td class="td-center">委托单位地址</td>
                        <td colspan="5">{{ item.jf_dz }}</td>
                      </tr>
                      <tr>
                        <td class="td-center">计划举办期数</td>
                        <td colspan="5">1 期</td>
                      </tr>
                      <tr>
                        <td class="td-center">
                          委托培训
                          <br>对象类型
                        </td>
                        <td colspan="5">
                          <div v-for="(value,key,index) in proConfig.pxdx" :key="index">
                            <img
                              v-if="key==item.pxdx"
                              src="../../../../assets/images/yes.gif"
                              :key="index+'img1'" class="yes-no-img"
                            >
                            <img
                              v-else
                              :key="index+'img2'"
                              src="../../../../assets/images/no.gif"
                              class="yes-no-img"
                            >
                            <span :key="index" class="check-box-span">{{ value }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="td-center">
                          培训内容和
                          <br>课程安排
                        </td>
                        <td colspan="5">{{ item.pxap }}</td>
                      </tr>
                      <tr>
                        <td class="td-center">
                          收费方式
                          <br>与标准
                        </td>
                        <td colspan="5">
                          <template v-if="form0.ks_charge === 2">
                            <span>{{ item.specific_rate }}</span>
                          </template>
                          <template v-else>
                            <template v-if="form0.sfbz==1">
                              委托单位支付合计：
                              <span>{{ item.sfbz_dw }}</span> 元
                              <template v-if="item.sfbz_dw_dx">
                                （大写：
                                <span>{{ item.sfbz_dw_dx }}</span>）
                              </template>；
                              <template v-if="form0.welfare != 1">
                                分
                                <span>{{ item.sfbz_dw_fq }}</span>付款，
                                <template v-if="item.sfbz_dw_zfsj">
                                  付款时间为
                                  <span>{{ item.sfbz_dw_zfsj}}</span>
                                </template>
                              </template>
                            </template>
                            <template v-if="form0.sfbz==2">
                              由学员或所在单位在按照
                              <span>{{ item.sfbz_xy }}</span> 元/人标准一次性支付。
                            </template>
                            <template v-if="form0.sfbz==3">
                              委托单位支付合计：
                              <span>{{ item.sfbz_dw }}</span> 元
                              <template v-if="item.sfbz_dw_dx">
                                （大写：
                                <span>{{ item.sfbz_dw_dx }}</span>）
                              </template>；
                              <template v-if="form0.welfare != 1">
                                分
                                <span>{{ item.sfbz_dw_fq }}</span>付款，
                                <template v-if="item.sfbz_dw_zfsj">
                                  付款时间为
                                  <span>{{ item.sfbz_dw_zfsj}}</span>
                                </template>;
                              </template>
                              学员支付标准：
                              <span>{{ item.sfbz_xy }}</span> 元/人
                              <template v-if="item.sfbz_xy_dx">
                                （大写：
                                <span>{{ item.sfbz_xy_dx }}</span>）
                              </template>
                              <template v-if="form0.welfare != 1">，在培训开始前一次性缴纳。</template>
                            </template>
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td rowspan="2" class="td-center">双方约定的违约金比例</td>
                        <td rowspan="2" class="td-center">{{ item.wyjbl}}%</td>
                        <td rowspan="2" class="td-center">协议总份数</td>
                        <td rowspan="2" class="td-center">{{ item.xy_num1}}份</td>
                        <td class="td-center">甲方执有</td>
                        <td colspan="2" class="td-center">{{ item.xy_num2}}份</td>
                      </tr>
                      <tr>
                        <td class="td-center">乙方执有</td>
                        <td colspan="2" class="td-center">{{ form2[0].xy_num3}}份</td>
                      </tr>
                    </table>
                    <div :key="`${index}-form2-div`" style="padding: 10px"></div>
                  </template>
                </template>
              </div>
            </template>
            <template v-if="form3.id||form3.pro_id">
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item">
                <header class="project-declare-item-title">
                  <span v-if="form2[0].id">四、辅助培训信息</span>
                  <span v-else>三、辅助培训信息</span>
                </header>
                <table border="1" class="project-declare-item-table">
                  <tr>
                    <td class="td-center" style="width: 100px">辅助单位名称</td>
                    <td colspan="5">{{ form3.yf_dwmc }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">资质文件编码</td>
                    <td colspan="2">
                      <div>
                        <img
                          v-if="form3.zzwj==='营业执照注册号'"
                          src="../../../../assets/images/yes.gif"
                          class="yes-no-img"
                        >
                        <img src="../../../../assets/images/no.gif" v-else class="yes-no-img">
                        营业执照注册号
                        <template
                          v-if="form3.zzwj=='营业执照注册号'"
                        >{{'：'+form3.zzwj_bm}}</template>
                      </div>
                      <br>
                      <div>
                        <img
                          v-if="form3.zzwj=='社会统一信用代码号'"
                          src="../../../../assets/images/yes.gif"
                          class="yes-no-img"
                        >
                        <img src="../../../../assets/images/no.gif" v-else class="yes-no-img">
                        社会统一信用代码号
                        <template
                          v-if="form3.zzwj=='社会统一信用代码号'"
                        >{{'：'+form3.zzwj_bm}}</template>
                      </div>
                    </td>
                    <td class="td-center" style="width: 100px">法人代表</td>
                    <td colspan="2" style="width: 80px">{{ form3.frdb }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">单位性质</td>
                    <td colspan="2">{{ form3.dwxz }}</td>
                    <td class="td-center">联系电话</td>
                    <td colspan="2">{{ form3.yf_lxdh}}</td>
                  </tr>
                  <tr>
                    <td class="td-center">单位地址</td>
                    <td colspan="2">{{ form3.yf_dz }}</td>
                    <td class="td-center">项目负责人</td>
                    <td colspan="2">{{ form3.yf_lxr }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">培训内容和课程安排</td>
                    <td colspan="5">{{ form3.pxap }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">
                      申报项目单位
                      <br>负责的工作
                    </td>
                    <td colspan="5">
                      课程设置、教师选用，以及
                      <span>{{ form3.jf_fzgz }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="td-center">
                      辅助单位
                      <br>负责的工作
                    </td>
                    <td colspan="5">{{ form3.yf_fzgz }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">
                      辅助单位负责
                      <br>的费用支出
                    </td>
                    <td colspan="5">{{ form3.yf_fyzc }}</td>
                  </tr>
                  <tr>
                    <template v-if="isYXB || (form0.create_time * 1000 > fz202101)">
                      <td class="td-center" style="width: 100px">
                        辅助单位获得
                        <br>{{ isYXB ? '最高分成比例' : '的总分成比例' }}
                      </td>
                      <td>{{ form3.yf_fcbl }}{{ (isYXB || (form0.create_time * 1000 > fz202101)) && (form3.yf_fcbl || 0) > -1 ? '%' : '' }}</td>
                      <td class="td-center">辅助单位<br>具体分成情况</td>
                      <td colspan="3">{{ form3.yf_fzjtfc }}</td>
                    </template>
                    <template v-else>
                      <td class="td-center">
                        辅助单位获得
                        <br>的总分成比例
                      </td>
                      <td colspan="5">{{ form3.yf_fcbl}}</td>
                    </template>
                  </tr>
                  <tr>
                    <template v-if="isYXB || (form0.create_time * 1000 > fz202101)">
                      <td class="td-center" style="width: 100px">
                        辅助单位 <br>分成款分期数
                      </td>
                      <td>{{ form3.yf_fqs }} 期</td>
                      <td class="td-center" style="width: 100px">
                        <template v-if="isYXB">扣留乙方分成款<br>的比例</template>
                        <template v-else>辅助单位分成款<br>暂押比例</template>
                      </td>
                      <td>{{ form3.wg_bili || 0 }}%</td>
                      <td class="td-center">分成款付款时间</td>
                      <td style="width: 80px">{{ form3.yf_fqs_time }}</td>
                    </template>
                    <template v-else>
                      <td class="td-center" style="width: 100px">
                        辅助单位<br>分成款分期数
                      </td>
                      <td colspan="2">{{ form3.yf_fqs }} 期</td>
                      <td class="td-center">分成款付款时间</td>
                      <td colspan="2" style="width: 80px">{{ form3.yf_fqs_time }}</td>
                    </template>
                  </tr>
                  <tr>
                    <td class="td-center">
                      辅助单位收款
                      <br>账户信息
                    </td>
                    <td colspan="5">
                      账户名称：{{ form3.yf_dwmc }}
                      <br>
                      账号：{{ form3.yf_yhzh}}
                      <br>
                      开户行：{{ form3.yf_khh}}
                      <br>
                    </td>
                  </tr>
                  <tr>
                    <td class="td-center">
                      双方约定的
                      <br>违约金比例
                    </td>
                    <td colspan="5">{{ form3.wyjbl}}%</td>
                  </tr>
                  <tr v-if="form3.obligation">
                    <td class="td-center">
                      与辅助单位的
                      <br>权责义务通过
                      <br>何种方式议定
                    </td>
                    <td colspan="5">
                      <div
                        v-for="(o, k) in proConfig.obligation"
                        :key="`${k}-obligation`"
                        :style="{ marginTop:  '12px'}"
                      >
                        <img
                          v-if="k == form3.obligation"
                          src="../../../../assets/images/yes.gif"
                          class="yes-no-img"
                        >
                        <img v-else src="../../../../assets/images/no.gif" class="yes-no-img">
                        <span>{{ o }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="form3.obligation == 2">
                    <td class="td-center">
                      谈判是否有
                      <br>第三方监督
                    </td>
                    <td colspan="2">{{ form3.obligation_type == 1 ? '无' : '有' }}</td>
                    <td
                      class="td-center"
                      style="width: 100px"
                    >{{ form3.obligation_type == 1 ? '无监督方的理由' : '谈判监督人' }}</td>
                    <td
                      colspan="2"
                      style="width: 80px"
                    >{{ form3.obligation_type == 1 ? form3.obligation_reason : form3.obligation_user }}</td>
                  </tr>
                </table>
              </div>
            </template>
            <template v-if="form5[0].id||form5[0].pro_id">
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item">
                <header class="project-declare-item-title">
                  <div v-if="form2[0].id">
                    <div v-if="form3.id||form3.pro_id">五、校内合作单位信息</div>
                    <div v-else>四、校内合作单位信息</div>
                  </div>
                  <div v-else>
                    <div v-if="form3.id||form3.pro_id">四、校内合作单位信息</div>
                    <div v-else>三、校内合作单位信息</div>
                  </div>
                </header>
                <template v-for="(item,index) in form5">
                  <table :key="`${index}-form5-table`" border="1" class="project-declare-item-table">
                    <tr>
                      <td class="td-center" style="width: 100px">合作单位名称</td>
                      <td colspan="5">{{ item.yf_dwmc }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">单位地址</td>
                      <td colspan="5">{{ item.yf_dz }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">联系电话</td>
                      <td colspan="2">{{ item.yf_lxdh}}</td>
                      <td class="td-center">项目负责人</td>
                      <td colspan="2">{{ item.yf_lxr }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">培训内容和课程安排</td>
                      <td colspan="5">{{ item.pxap }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">
                        申报项目单位
                        <br>负责的工作
                      </td>
                      <td colspan="5">
                        课程设置、教师选用，以及
                        <span>{{ item.jf_fzgz }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="td-center">
                        合作单位
                        <br>负责的工作
                      </td>
                      <td colspan="5">{{ item.yf_fzgz }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">
                        合作单位负责
                        <br>的费用支出
                      </td>
                      <td colspan="5">{{ item.yf_fyzc }}</td>
                    </tr>
                    <tr>
                      <template v-if="isYXB">
                        <td class="td-center" style="width: 100px">
                          合作单位获得
                          <br>最高分成比例
                        </td>
                        <td>{{ item.yf_fcbl }}{{ isYXB && (item.yf_fcbl || 0) > -1 ? '%' : '' }}</td>
                        <td class="td-center">合作单位<br>具体分成情况</td>
                        <td colspan="3">{{ item.yf_fzjtfc }}</td>
                      </template>
                      <template v-else>
                        <td class="td-center">
                          合作单位获得
                          <br>的总分成比例
                        </td>
                        <td colspan="5">{{ item.yf_fcbl}}</td>
                      </template>
                    </tr>
                    <tr>
                      <td class="td-center" style="width: 100px">
                        合作单位
                        <br>分成款分期数
                      </td>
                      <td colspan="2">{{ item.yf_fqs }} 期</td>
                      <td class="td-center">分成款付款时间</td>
                      <td colspan="2" style="width: 80px">{{ item.yf_fqs_time }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">
                        双方约定的
                        <br>违约金比例
                      </td>
                      <td colspan="5">{{ item.wyjbl}}%</td>
                    </tr>
                  </table>
                  <div :key="`${index}-form5-div`" style="padding: 10px"></div>
                </template>
              </div>
            </template>
            <template>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item">
                <header class="project-declare-item-title">
                  <div v-if="form2[0].id">
                    <div v-if="form3.id||form3.pro_id">
                      <template v-if="form5[0].id||form5[0].pro_id">六、项目财务预算</template>
                      <template v-else>五、项目财务预算</template>
                    </div>
                    <div v-else>
                      <template v-if="form5[0].id||form5[0].pro_id">五、项目财务预算</template>
                      <template v-else>四、项目财务预算</template>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="form3.id||form3.pro_id">
                      <template v-if="form5[0].id||form5[0].pro_id">五、项目财务预算</template>
                      <template v-else>四、项目财务预算</template>
                    </div>
                    <div v-else>
                      <template v-if="form5[0].id||form5[0].pro_id">四、项目财务预算</template>
                      <template v-else>三、项目财务预算</template>
                    </div>
                  </div>
                </header>
                <table border="1" class="project-declare-item-table">
                  <tr>
                    <td class="td-center td-title-1">
                      办班单位名称
                      <br>（盖章）
                    </td>
                    <td colspan="3">
                      <div>中国人民大学{{ form0.college }}</div>
                    </td>
                    <td class="td-center td-title-1">
                      财务负责人
                      <br>（必签）
                    </td>
                    <td colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="td-center">项目名称</td>
                    <td colspan="6">{{ form0.pro_name }}</td>
                  </tr>
                  <tr v-if="form0.zs_type==2">
                    <td class="td-center">招生时间</td>
                    <td
                      colspan="6"
                    >{{ form0.zs_start_time | TimestampChangeFilter(true) }} 至 {{ form0.zs_end_time | TimestampChangeFilter(true) }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">培训时间</td>
                    <td
                      colspan="6"
                    >{{ form0.px_start_time | TimestampChangeFilter(true) }} 至 {{ form0.px_end_time | TimestampChangeFilter(true) }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">计划培训天数</td>
                    <td class="td-center" style="width: 40px">{{ form0.pxts }} 天</td>
                    <td class="td-center" style="width: 40px">
                      计划培
                      <br>训人数
                    </td>
                    <td class="td-center" style="width: 90px">{{ form0.zsrs }} 人</td>
                    <td class="td-center" style>培训总课时</td>
                    <td colspan="2" class="td-center">{{ form0.pxzks }} 课时（1课时=60分钟）</td>
                  </tr>
                  <tr>
                    <td class="td-center" style="width: 100px">费用名称</td>
                    <td colspan="2" class="td-center">序号</td>
                    <td class="td-center" style="width: 90px">项目</td>
                    <td class="td-center">
                      费用总计
                      <br>（元）
                    </td>
                    <td class="td-center" style="width: 80px">
                      占总收入比
                      <br>（%）
                    </td>
                    <td class="td-center" style="width: 100px">备&nbsp;&nbsp;注</td>
                  </tr>
                  <tr>
                    <td :rowspan="form4.hz_note.length + 6" class="td-center">培训费分配计划</td>
                    <td colspan="2" class="td-center">1</td>
                    <td class="td-center">计划培训收入</td>
                    <td class="td-center">{{ form4.sr_jhsr }}</td>
                    <td class="td-center">100 %</td>
                    <td class="td-center">{{ form4.sr_jhsr_note }}</td>
                  </tr>
                  <tr>
                    <td :rowspan="form4.hz_note.length + 4" class="td-center">
                      计
                      <br>划
                      <br>培
                      <br>训
                      <br>支
                      <br>出
                    </td>
                    <td rowspan="2" class="td-center">2</td>
                    <td class="td-center">学校管理费</td>
                    <td class="td-center">{{ form4.zc_xxglf }}</td>
                    <td class="td-center">{{ form4.zc_xxglf|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                    <td class="td-center">{{ form4.zc_xxglf_note }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">学院管理费</td>
                    <td class="td-center">{{ form4.zc_xyglfy }}</td>
                    <td class="td-center">{{ form4.zc_xyglfy|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                    <td class="td-center">{{ form4.zc_xyglfy_note }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">3</td>
                    <td class="td-center">辅助单位分成</td>
                    <td class="td-center">{{ form4.zc_fzdwfc }}</td>
                    <td class="td-center">{{ form4.zc_fzdwfc|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                    <td class="td-center">{{ form4.zc_fzdwfc_note }}</td>
                  </tr>
                  <template v-for="(item, index) in form4.hz_note">
                    <tr :key="`${index}-hz_note`">
                      <td class="td-center">{{ index + 4}}</td>
                      <td class="td-center">
                        校内合作单位
                        <template v-if="form4.hz_note.length>1">（{{ index+1}}）</template>分成
                      </td>
                      <td class="td-center">{{ item.zc_hzdwfc }}</td>
                      <td class="td-center">{{ item.zc_hzdwfc|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                      <td class="td-center">{{ item.zc_hzdwfc_note }}</td>
                    </tr>
                  </template>
                  <tr>
                    <td class="td-center">{{ form4.hz_note.length + 4}}</td>
                    <td class="td-center">项目支出费用</td>
                    <td class="td-center">{{ form4.zc_xmzcfy }}</td>
                    <td class="td-center">{{ form4.zc_xmzcfy|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                    <td class="td-center">{{ form4.zc_xmzcfy_note }}</td>
                  </tr>
                  <tr>
                    <td colspan="2" class="td-center">{{ form4.hz_note.length + 5}}</td>
                    <td class="td-center">项目结余</td>
                    <td
                      class="td-center"
                    >{{ form4.sr_jhsr| subtraction(form4.zc_xxglf, form4.zc_xyglfy, form4.zc_fzdwfc, form4.zc_xmzcfy, (form4.hz_note && form4.hz_note.length ? hzNote(form4.hz_note) : 0)) }}</td>
                    <td
                      class="td-center"
                    >{{ form4.sr_jhsr| subtraction(form4.zc_xxglf, form4.zc_xyglfy, form4.zc_fzdwfc, form4.zc_xmzcfy, (form4.hz_note && form4.hz_note.length ? hzNote(form4.hz_note) : 0)) | statisticsRatio([],form4.sr_jhsr,1) }}</td>
                    <td class="td-center"></td>
                  </tr>
                  <tr>
                    <td colspan="7" class="td-center">项目支出预算明细（总额：{{ form4.ys_zc | showAll }} 元）</td>
                  </tr>
                  <tr>
                    <td class="td-center" style="width: 100px">
                      项目负责人
                      <br>（必签）
                    </td>
                    <td colspan="3"></td>
                    <td class="td-center">
                      部门负责人
                      <br>（签字）
                    </td>
                    <td colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="td-center">费用名称</td>
                    <td class="td-center">序号</td>
                    <td colspan="2" class="td-center">项目</td>
                    <td class="td-center">费用总计（元）</td>
                    <td class="td-center">占总收入比（%）</td>
                    <td class="td-center">备&nbsp;&nbsp;注</td>
                  </tr>
                  <tr>
                    <td
                      :rowspan="form4.ys_zc&&(form4.ys_zc.length+2)"
                      class="td-center"
                      style="width: 100px"
                    >成本费用</td>
                    <td class="td-center" style="width: 40px">1</td>
                    <template v-if="form4.ys_zc && form4.ys_zc[0]">
                      <td colspan="2" class="td-center">{{ form4.ys_zc[0].xm}}</td>
                      <td class="td-center">{{ form4.ys_zc[0].fyzj}}</td>
                      <td
                        class="td-center"
                      >{{ form4.ys_zc[0].fyzj|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                      <td class="td-center">{{ form4.ys_zc[0].note }}</td>
                    </template>
                  </tr>
                  <template v-if="form4.ys_zc">
                    <tr v-for="(item,index) in form4.ys_zc" :key="`${index}-ys_zc`">
                      <template v-if="index>0">
                        <td class="td-center" style="width: 40px">{{ index+1}}</td>
                        <td colspan="2" class="td-center" style="width: 140px">{{ item.xm}}</td>
                        <td class="td-center">{{ item.fyzj}}</td>
                        <td class="td-center">{{ item.fyzj|statisticsRatio([],form4.sr_jhsr,1) }}</td>
                        <td class="td-center">{{ item.note }}</td>
                      </template>
                    </tr>
                  </template>
                  <tr>
                    <td class="td-center"></td>
                    <td colspan="2" class="td-center">合计</td>
                    <td class="td-center">{{ form4.ys_zc | showAll }}</td>
                    <td class="td-center"></td>
                    <td class="td-center"></td>
                  </tr>
                  <tr>
                    <td class="td-center">备&nbsp;&nbsp;注</td>
                    <td colspan="6" class="td-center">{{ form4.note }}</td>
                  </tr>
                </table>
              </div>
            </template>
            <template v-if="form4.ys_fz.length">
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item">
                <header class="project-declare-item-title">
                  <div v-if="form2[0].id">
                    <template v-if="form5[0].id||form5[0].pro_id">七、辅助单位财务支出预算</template>
                    <template v-else>六、辅助单位财务支出预算</template>
                  </div>
                  <div v-else>
                    <template v-if="form5[0].id||form5[0].pro_id">六、辅助单位财务支出预算</template>
                    <template v-else>五、辅助单位财务支出预算</template>
                  </div>
                </header>
                <table border="1" class="project-declare-item-table">
                  <tr>
                    <td class="td-center td-title-1">项目名称</td>
                    <td colspan="6">{{ form0.pro_name }}</td>
                  </tr>
                  <tr v-if="form0.zs_type==2">
                    <td class="td-center">招生时间</td>
                    <td
                      colspan="6"
                    >{{ form0.zs_start_time | TimestampChangeFilter(true) }} 至 {{ form0.zs_end_time | TimestampChangeFilter(true) }}</td>
                  </tr>
                  <tr>
                    <td class="td-center">培训时间</td>
                    <td
                      colspan="6"
                    >{{ form0.px_start_time | TimestampChangeFilter(true) }} 至 {{ form0.px_end_time | TimestampChangeFilter(true) }}</td>
                  </tr>
                  <tr>
                    <td colspan="7" class="td-center">辅助单位支出预算明细（总额：{{ form4.ys_fz | showAll }} 元）</td>
                  </tr>
                  <tr>
                    <td class="td-center">
                      合作单位名称
                      <br>（盖章）
                    </td>
                    <td colspan="3">{{ form3.yf_dwmc }}</td>
                    <td class="td-center">
                      法定代表人
                      <br>（必签）
                    </td>
                    <td colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="td-center">费用名称</td>
                    <td class="td-center" style="width: 40px">序号</td>
                    <td colspan="2" class="td-center">项目</td>
                    <td class="td-center" style="width: 80px">费用总计（元）</td>
                    <td class="td-center" style="width: 70px">占分成比（%）</td>
                    <td class="td-center">备&nbsp;&nbsp;注</td>
                  </tr>
                  <tr>
                    <td
                      :rowspan="form4.ys_zc&&(form4.ys_fz.length+2)"
                      class="td-center"
                      style="width: 100px"
                    >成本费用</td>
                    <td class="td-center" style="width: 40px">1</td>
                    <template v-if="form4.ys_fz && form4.ys_fz[0]">
                      <td colspan="2" class="td-center">{{ form4.ys_fz[0].xm}}</td>
                      <td class="td-center" style="width: 80px">{{ form4.ys_fz[0].fyzj}}</td>
                      <td class="td-center" style="width: 70px">
                        <template v-if="isYXB">
                          <template v-if="form0.sfbz != 1">
                            <template v-if="form0.zsrs*form0.sfbz_xy*((form3.yf_fcbl||0)/100)">
                              {{ form4.ys_fz[0].fyzj|statisticsRatio([],(form0.zsrs*form0.sfbz_xy*((form3.yf_fcbl||0)/100)),1) }}
                            </template>
                            <template v-else>0%</template>
                          </template>
                          <template v-else>
                            {{ form4.ys_fz[0].fyzj | statisticsRatio([],form4.zc_fzdwfc,1) }}
                          </template>
                        </template>
                        <template v-else>
                          {{ form4.ys_fz[0].fyzj | statisticsRatio([],form4.zc_fzdwfc,1) }}
                        </template>
                      </td>
                      <td class="td-center" style="width: 100px">{{ form4.ys_fz[0].note }}</td>
                    </template>
                  </tr>
                  <template v-if="form4.ys_fz">
                    <tr v-for="(item,index) in form4.ys_fz" :key="`${index}-ys_fz`">
                      <template v-if="index>0">
                        <td class="td-center" style="width: 40px">{{ index+1}}</td>
                        <td colspan="2" class="td-center">{{ item.xm}}</td>
                        <td class="td-center" style="width: 80px">{{ item.fyzj}}</td>
                        <td class="td-center" style="width: 70px">
                          <template v-if="isYXB">
                            <template v-if="form0.sfbz != 1">
                              <template v-if="form0.zsrs*form0.sfbz_xy*((form3.yf_fcbl||0)/100)">
                                {{ item.fyzj|statisticsRatio([],(form0.zsrs*form0.sfbz_xy*((form3.yf_fcbl||0)/100)),1) }}
                              </template>
                              <template v-else>0%</template>
                            </template>
                            <template v-else>
                              {{ item.fyzj | statisticsRatio([],form4.zc_fzdwfc,1) }}
                            </template>
                          </template>
                          <template v-else>
                            {{ item.fyzj | statisticsRatio([],form4.zc_fzdwfc,1) }}
                          </template>
                        </td>
                        <td class="td-center" style="width: 100px">{{ item.note }}</td>
                      </template>
                    </tr>
                  </template>
                  <tr>
                    <td class="td-center"></td>
                    <td colspan="2" class="td-center">合计</td>
                    <td class="td-center">{{ form4.ys_fz | showAll }}</td>
                    <td class="td-center"></td>
                    <td class="td-center"></td>
                  </tr>
                  <tr>
                    <td colspan="2" class="td-center"></td>
                    <td colspan="2" class="td-center">结余</td>
                    <td class="td-center">{{ form4.zc_fzdwfc| subtraction(addTotal) }}</td>
                    <td class="td-center"></td>
                    <td class="td-center"></td>
                  </tr>
                  <tr>
                    <td class="td-center">备&nbsp;&nbsp;注</td>
                    <td colspan="6" class="td-center">{{ form4.fz_note }}</td>
                  </tr>
                </table>
              </div>
            </template>
            <template v-if="form4.ys_hz.length">
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item">
                <header class="project-declare-item-title">
                  <div v-if="form2[0].id">
                    <template v-if="form3.id||form3.pro_id">八、校内合作单位财务支出预算</template>
                    <template v-else>六、校内合作单位财务支出预算</template>
                  </div>
                  <div v-else>
                    <template v-if="form3.id||form3.pro_id">七、校内合作单位财务支出预算</template>
                    <template v-else>五、校内合作单位财务支出预算</template>
                  </div>
                </header>
                <template v-for="(item, index) in form4.ys_hz">
                  <table :key="`${index}-ys_hz-table`" border="1" class="project-declare-item-table">
                    <tr>
                      <td class="td-center td-title-1">项目名称</td>
                      <td colspan="6">{{ form0.pro_name }}</td>
                    </tr>
                    <tr v-if="form0.zs_type==2">
                      <td class="td-center">招生时间</td>
                      <td
                        colspan="6"
                      >{{ form0.zs_start_time | TimestampChangeFilter(true) }} 至 {{ form0.zs_end_time | TimestampChangeFilter(true) }}</td>
                    </tr>
                    <tr>
                      <td class="td-center">培训时间</td>
                      <td
                        colspan="6"
                      >{{ form0.px_start_time | TimestampChangeFilter(true) }} 至 {{ form0.px_end_time | TimestampChangeFilter(true) }}</td>
                    </tr>
                    <tr>
                      <td colspan="7" class="td-center">校内合作单位支出预算明细（总额：{{ item.note | showAll }} 元）</td>
                    </tr>
                    <tr>
                      <td class="td-center">
                        合作单位名称
                        <br>（盖章）
                      </td>
                      <td colspan="6">
                        <template v-if="form5[index]">{{ form5[index].yf_dwmc }}</template>
                      </td>
                    </tr>
                    <tr>
                      <td class="td-center">费用名称</td>
                      <td class="td-center" style="width: 40px">序号</td>
                      <td colspan="2" class="td-center">项目</td>
                      <td class="td-center" style="width: 80px">费用总计（元）</td>
                      <td class="td-center" style="width: 70px">占分成比（%）</td>
                      <td class="td-center">备&nbsp;&nbsp;注</td>
                    </tr>
                    <tr>
                      <td
                        :rowspan="item.note&&(item.note.length+2)"
                        class="td-center"
                        style="width: 100px"
                      >成本费用</td>
                      <td class="td-center" style="width: 40px">1</td>
                      <template v-if="item.note && item.note[0]">
                        <td colspan="2" class="td-center">{{ item.note[0].xm}}</td>
                        <td class="td-center" style="width: 80px">{{ item.note[0].fyzj}}</td>
                        <td
                          class="td-center"
                          style="width: 70px"
                        >{{ item.note[0].fyzj | statisticsRatio([],form4.hz_note[0].zc_hzdwfc,1) }}</td>
                        <td class="td-center" style="width: 100px">{{ item.note[0].note }}</td>
                      </template>
                    </tr>
                    <template v-if="item.note">
                      <tr v-for="(val,ind) in item.note" :key="ind">
                        <template v-if="ind>0">
                          <td class="td-center" style="width: 40px">{{ ind+1}}</td>
                          <td colspan="2" class="td-center">{{ val.xm}}</td>
                          <td class="td-center" style="width: 80px">{{ val.fyzj}}</td>
                          <td
                            class="td-center"
                            style="width: 70px"
                          >{{ val.fyzj|statisticsRatio([],form4.hz_note[index].zc_hzdwfc,1) }}</td>
                          <td class="td-center" style="width: 100px">{{ val.note }}</td>
                        </template>
                      </tr>
                    </template>
                    <tr>
                      <td class="td-center"></td>
                      <td colspan="2" class="td-center">合计</td>
                      <td class="td-center">{{ item.note | showAll }}</td>
                      <td class="td-center"></td>
                      <td class="td-center"></td>
                    </tr>
                    <tr>
                      <td colspan="2" class="td-center"></td>
                      <td colspan="2" class="td-center">结余</td>
                      <td
                        class="td-center"
                      >{{ form4.hz_note[index].zc_hzdwfc| subtraction(addTotal2[index]) }}</td>
                      <td class="td-center"></td>
                      <td class="td-center"></td>
                    </tr>
                  </table>
                  <div :key="`${index}-ys_hz-div`" style="padding: 10px"></div>
                </template>
              </div>
            </template>
            <template>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class="project-declare-main-item" id="sigDIV">
                <header class="project-declare-item-title">
                  <div v-if="form2[0].id||form2[0].pro_id">
                    <template v-if="form3.id||form3.pro_id">
                      <template v-if="form5[0].id||form5[0].pro_id">九、审批意见</template>
                      <template v-else>七、审批意见</template>
                    </template>
                    <template v-else>
                      <template v-if="form5[0].id||form5[0].pro_id">七、审批意见</template>
                      <template v-else>五、审批意见</template>
                    </template>
                  </div>
                  <div v-else>
                    <template v-if="form3.id||form3.pro_id">
                      <template v-if="form5[0].id||form5[0].pro_id">八、审批意见</template>
                      <template v-else>六、审批意见</template>
                    </template>
                    <template v-else>
                      <template v-if="form5[0].id||form5[0].pro_id">六、审批意见</template>
                      <template v-else>四、审批意见</template>
                    </template>
                  </div>
                </header>
                <table border="1" class="project-declare-item-table">
                  <tr>
                    <td colspan="7">
                      <div style="padding-bottom: 100px">申办单位意见：（如需申请调整管理费比例，请另附正式签报）</div>
                      <el-row :gutter="20">
                        <el-col :span="12" :offset="12">
                          <div class="grid-content bg-purple" style="position: relative">
                            <span>负责人（签字）：</span>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="6" :offset="12">
                          <div class="grid-content bg-purple">
                            <span>主办单位（盖章）：</span>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="grid-content bg-purple">日期：</div>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr v-if="!isYXB">
                    <td colspan="7">
                      <div style="padding-bottom: 100px">党委组织部审批意见：（干部专题研修签批）</div>
                      <el-row :gutter="20">
                        <el-col :span="6" :offset="12">
                          <div class="grid-content bg-purple">负责人（签字）：</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="6" :offset="12">
                          <div class="grid-content bg-purple">审批单位（盖章）：</div>
                        </el-col>
                        <el-col :span="6">
                          <div class="grid-content bg-purple">日期：</div>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr v-if="!isYXB">
                    <td colspan="7">
                      <div style="padding-bottom: 100px">国际交流处审批意见：（涉外培训项目签批）</div>
                      <el-row :gutter="20">
                        <el-col :span="6" :offset="12">
                          <div class="grid-content bg-purple">负责人（签字）：</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="6" :offset="12">
                          <div class="grid-content bg-purple">审批单位（盖章）：</div>
                        </el-col>
                        <el-col :span="6">
                          <div class="grid-content bg-purple">日期：</div>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="7">
                      <div style="padding-bottom: 100px">继续教育处审批意见：</div>
                      <div class="xx-bottom" style="text-align: right">
                        <span class="check-box-span" style="padding-right: 8px">是否迟报漏报：</span>
                        <img src="../../../../assets/images/no.gif" class="yes-no-img" style="vertical-align: top">
                        <span class="check-box-span" style="padding-right: 8px">是</span>
                        <img src="../../../../assets/images/no.gif" class="yes-no-img" style="vertical-align: top">
                        <span class="check-box-span" style="padding-right: 8px">否</span>
                      </div>
                      <div v-if="form0.zs_type == 2" class="xx-bottom" style="text-align: right">
                        <span class="check-box-span" style="padding-right: 8px">是否推送到官网：</span>
                        <img src="../../../../assets/images/no.gif" class="yes-no-img" style="vertical-align: top">
                        <span class="check-box-span" style="padding-right: 8px">是</span>
                        <img src="../../../../assets/images/no.gif" class="yes-no-img" style="vertical-align: top">
                        <span class="check-box-span" style="padding-right: 8px">否</span>
                      </div>
                      <div
                        v-if="!this.is_jypxzx && !this.is_ss"
                        class="xx-bottom"
                        style="text-align: right;padding-bottom: 10px"
                      >
                        <span class="check-box-span" style="padding-right: 8px">是否推送至财务收费系统：</span>
                        <img src="../../../../assets/images/no.gif" class="yes-no-img" style="vertical-align: top">
                        <span class="check-box-span" style="padding-right: 8px">是</span>
                        <img src="../../../../assets/images/no.gif" class="yes-no-img" style="vertical-align: top">
                        <span class="check-box-span" style="padding-right: 8px">否</span>
                      </div>
                      <div v-if="pxlx && !isYXB" style="width: 660px">
                        <div class="xx-bottom" style="text-align: right">
                          <span class="check-box-span" style="padding-right: 8px">培训类型：</span>
                          <template v-for="(item,index) in pxlx">
                            <template v-if="index < 4">
                              <img
                                :key="`${index}-pxlx-img1`"
                                src="../../../../assets/images/no.gif"
                                class="yes-no-img"
                                style="vertical-align: top"
                              >
                              <span
                                v-if="index !== 1"
                                :key="`${index}-pxlx-span1-1`"
                                class="check-box-span"
                                style="display: inline-block; width: 80px; text-align: left"
                              >{{ item.title }}</span>
                              <span
                                v-else
                                :key="`${index}-pxlx-span1-2`"
                                class="check-box-span"
                                style="display: inline-block; width: 190px; text-align: left"
                              >{{ item.title }}</span>
                            </template>
                          </template>
                        </div>
                        <div class="xx-bottom" style="text-align: right">
                          <template v-for="(item,index) in pxlx">
                            <template v-if="index>3">
                              <img
                                :key="`${index}-pxlx-img2`"
                                src="../../../../assets/images/no.gif"
                                class="yes-no-img"
                                style="vertical-align: top"
                              >
                              <span
                                :key="`${index}-pxlx-span2`"
                                class="check-box-span"
                                style="display: inline-block; width: 524px; text-align: left"
                              >{{ item.title }}</span>
                            </template>
                          </template>
                        </div>
                      </div>
                      <template v-if="proConfig.xklb">
                        <div class="xx-bottom" style="text-align: right">
                          <span class="check-box-span" style="padding-right: 2px">学科类别：</span>
                          <template v-for="(item,key) in proConfig.xklb">
                            <template v-if="key<5">
                              <img
                                :key="`${key}-xklb-img1`"
                                src="../../../../assets/images/no.gif"
                                class="yes-no-img"
                                style="vertical-align: top"
                              >
                              <span
                                :key="`${key}-xklb-span1`"
                                class="check-box-span"
                                style="display: inline-block; width: 80px; text-align: left"
                              >{{ item}}</span>
                            </template>
                          </template>
                        </div>
                        <div class="xx-bottom" style="text-align: right">
                          <template v-for="(item,key) in proConfig.xklb">
                            <template v-if="key>4">
                              <img
                                :key="`${key}-xklb-img2`"
                                src="../../../../assets/images/no.gif"
                                class="yes-no-img"
                                style="vertical-align: top"
                              >
                              <span
                                :key="`${key}-xklb-span2`"
                                class="check-box-span"
                                style="display: inline-block; width: 80px; text-align: left"
                                :style="{paddingRight:key==9?'123px':''}"
                              >{{ item}}</span>
                            </template>
                          </template>
                        </div>
                      </template>
                    </td>
                  </tr>
                </table>
                <div style="font-size: 12px;margin: 10px;line-height: 16px">
                  <div>注：1.面向社会零散招生项目，请申报单位随本“申报书”报送项目招生简章、广告计划等材料至继续教育处。</div>
                  <div style="text-indent: 2em">2.有辅助单位的项目申报单位，请报送辅助单位营业执照复印件、法人代表身份证复印件等材料。</div>
                  <div
                    style="text-indent: 2em"
                  >3.项目委托单位为培训下属单位或会员单位学员而委托我校开展的，申报单位除报送本《申报书》、招生简章外，还需报送委托单位发布的招生通知和经费来源说明，并承诺不向学员个人收取任何费用。</div>
                  <div style="text-indent: 2em">
                    <span style="border-bottom: 1px solid #000;color: #000">4.请申报单位为整套“申报书”加盖骑缝章。</span>
                  </div>
                  <div
                    style="text-indent: 2em"
                  >5.继续教育处办公地点：中国人民大学继续教育处 ，联系电话：62512931，办公邮箱：training@ruc.edu.cn。</div>
                </div>
              </div>
            </template>
            <template v-if="form3.id||form3.pro_id">
              <template v-if="form3.frdb_file">
                <div style="page-break-before:always;">
                  <br>
                </div>
                <div class="project-declare-main-item">
                  <div style="padding: 180px 100px 0">
                    <img :src="`${lookUrl}/${form3.frdb_file}`" style="width: 100%">
                  </div>
                </div>
              </template>
              <template v-if="form3.zzwj_file">
                <div style="page-break-before:always;">
                  <br>
                </div>
                <div class="project-declare-main-item">
                  <div style="padding: 180px 100px 50px">
                    <img :src="`${lookUrl}/${form3.zzwj_file}`" style="width: 100%">
                  </div>
                </div>
              </template>
            </template>
            <template v-if="form0.zs_type == 2 && form0.adm_major">
              <div style="page-break-before:always;">
                <br>
              </div>
              <div>
                <div class="zsjz-look-head">
                  <div v-if="!isYXB">
                    <template v-if="form0.create_time * 1000 > zsjz_divide_4">
                      {{ (form0.px_start_time || form0.create_time) | TimestampChangeFilter(false, false, true) }}年中国人民大学{{ form0.college }}
                    </template>
                    <template v-else>
                      中国人民大学{{ form0.college }} {{ (form0.px_start_time || form0.create_time) | TimestampChangeFilter(false, false, true) }} 年
                    </template>
                  </div>
                  <div>{{ form0.pro_name }}</div>
                  <div>招生简章</div>
                </div>
                <div class="zsjz-look-content">
                  <div v-for="(item, key) in contentZsjz" :key="`${key}-contentZsjz`">
                    <template v-if="item.divide && form0.create_time * 1000 > zsjz_divide">
                      <div
                        style="font-weight: bold; line-height: 2em"
                      >{{ item.order }}、{{ item.else_label }}</div>
                    </template>
                    <template v-else>
                      <div
                        style="font-weight: bold; line-height: 2em"
                      >{{ item.order }}、{{ item.label }}</div>
                    </template>
                    <template v-if="form0[key]">
                      <div v-html="form0[key]" :class="`zsjz-look-content-${key}`"></div>
                    </template>
                    <template v-else>
                      <div
                        v-if="item.content"
                        v-html="item.content"
                        :class="`zsjz-look-content-${key}`"
                      ></div>
                      <div v-else>
                        <template v-if="form0.create_time * 1000 > zsjz_divide">
                          <template v-if="form0.college.indexOf('苏州研究院')!==-1">
                            <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                            <p>户 名：中国人民大学{{ form0.college }}</p>
                            <p>开户行：交通银行股份有限公司苏州科技支行</p>
                            <p>收款帐号：3256 0500 0018 0101 2098 2</p>
                            <p>
                              特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学
                              <span v-if="form0.college">{{ form0.college }}</span>”十五字，在“用途/摘要”栏里填上“
                              <span v-if="form0.college">{{ form0.college }}</span>
                              <span v-else>XXX学院</span>
                              <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                              <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                              <span v-if="form0.college">{{ form0.college }}</span>
                              <span v-else>XXX学院</span>。
                            </p>
                          </template>
                          <template v-else-if="form0.college.indexOf('深圳研究院')!==-1">
                            <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                            <p>户 名：中国人民大学{{ form0.college }}</p>
                            <p>开户行：中国平安银行深圳高新技术区支行</p>
                            <p>收款帐号：0412 1001 9211 2</p>
                            <p>
                              特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学
                              <span v-if="form0.college">{{ form0.college }}</span>”十一字，在“用途/摘要”栏里填上“
                              <span v-if="form0.college">{{ form0.college }}</span>
                              <span v-else>XXX学院</span>
                              <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                              <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                              <span v-if="form0.college">{{ form0.college }}</span>
                              <span v-else>XXX学院</span>。
                            </p>
                          </template>
                          <template v-else-if="form0.college.indexOf('教育培训中心')!==-1">
                            <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                            <p>户 名：中国人民大学{{ form0.college }}</p>
                            <p>开户行：中国工商银行股份有限公司北京紫竹院支行</p>
                            <p>收款帐号：0200 0076 0920 1130 889</p>
                            <p>
                              特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学
                              <span v-if="form0.college">{{ form0.college }}</span>”十二字，在“用途/摘要”栏里填上“
                              <span v-if="form0.college">{{ form0.college }}</span>
                              <span v-else>XXX学院</span>
                              <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                              <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                              <span v-if="form0.college">{{ form0.college }}</span>
                              <span v-else>XXX学院</span>。
                            </p>
                          </template>
                          <template v-else-if="form0.college.indexOf('网络教育部')!==-1">
                            <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                            <p>户 名：中国人民大学网络教育学院</p>
                            <p>开户行：工行北京北沙滩支行</p>
                            <p>收款帐号：0200 3455 2910 0037 477</p>
                            <p>
                              特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学网络教育学院”十二字，在“用途/摘要”栏里填上“
                              <span v-if="form0.college">网络教育学院</span>
                              <span v-else>XXX学院</span>
                              <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                              <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                              <span v-if="form0.college">网络教育学院</span>
                              <span v-else>XXX学院</span>。
                            </p>
                          </template>
                          <template v-else>
                            <div v-if="(form0.create_time * 1000 > zsjz_divide_4) || isYXB" style="text-indent: 2em;">
                              <p>
                                （一）个人账户缴费：点击“人大培训网”发布简章的缴费链接，通过学校电子收费系统缴费。
                                <template v-if="form0.fee_url && (form0.create_time * 1000 > versionTime_4)">
                                  （收费地址：<span class="primary">{{ form0.fee_url }}</span>）
                                </template>
                              </p>
                              <p>
                                学员通过点击简章页面发布的“报名缴费”按钮，可直接打开“中国人民大学通用收费系统”中该课程班的对应收费页面，注册并填报个人身份信息和票据信息后，通过系统缴费。
                              </p>
                              <p>
                                郑重提醒：学员如果遇到招生人员以参加本{{isYXB ? '课程培训班' : '课程班培训'}}为由，要求学员缴纳任何公示培训费之外的费用，可向学校有关部门举报违规行为。举报电话：010-82507931。
                              </p>
                              <p>（二）单位账户缴费：通过单位银行账户办理银行汇款缴费。</p>
                              <p>户&nbsp;&nbsp;名：中国人民大学</p>
                              <p>开户行：中国工商银行北京紫竹院支行</p>
                              <p>帐&nbsp;&nbsp;号：0200 0076 0902 6400 244</p>
                              <p>
                                特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学”六字，在“用途/摘要”栏里填上“
                                <span v-if="form0.college">{{ form0.college }}</span>
                                <span v-else>XXX学院</span>
                                <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                                <span v-else>XXX课程</span>XXX(学员姓名)培训费”，汇款后请将银行汇款凭单提交至
                                <span v-if="form0.college">{{ form0.college }}</span>
                                <span v-else>XXX学院</span>有关负责老师处确认。
                              </p>
                            </div>
                            <template v-else>
                              <p>
                                1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。
                                <template v-if="form0.fee_url && (form0.create_time * 1000 > versionTime_4)">
                                  （收费地址：<span class="primary">{{ form0.fee_url }}</span>）
                                </template>
                              </p>
                              <p>2、单位账户缴费：通过单位或个人银行账户办理银行汇款缴费。</p>
                              <p>户 名：中国人民大学</p>
                              <p>开户行：中国工商银行北京紫竹院支行</p>
                              <p>收款帐号：0200 0076 0902 6400 244</p>
                              <p>
                                特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学”六字，在“用途/摘要”栏里填上“
                                <span v-if="form0.college">{{ form0.college }}</span>
                                <span v-else>XXX学院</span>
                                <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                                <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                                <span v-if="form0.college">{{ form0.college }}</span>
                                <span v-else>XXX学院</span>。
                              </p>
                            </template>
                          </template>
                        </template>
                        <template v-else>
                          <p>
                            1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。
                            <template v-if="form0.fee_url && (form0.create_time * 1000 > versionTime_4)">
                              （收费地址：<span class="primary">{{ form0.fee_url }}</span>）
                            </template>
                          </p>
                          <p>2、单位账户缴费：通过单位或个人银行账户办理银行汇款缴费。</p>
                          <p>收款单位：中国人民大学</p>
                          <p>收款帐号：0200 0076 0902 6400 244</p>
                          <p>
                            特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学”六字，在“用途/摘要”栏里填上“
                            <span v-if="form0.college">{{ form0.college }}</span>
                            <span v-else>XXX学院</span>
                            <span v-if="form0.pro_name">{{ form0.pro_name }}课程</span>
                            <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                            <span v-if="form0.college">{{ form0.college }}</span>
                            <span v-else>XXX学院</span>。
                          </p>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <footer class="project-declare-foot" v-cloak>
        <template v-if="isce.id">
          <template v-if="form0.pro_status == 0">
            <el-button type="" @click.native="handleSignBtn" >
              {{ (this.form0.pro_status===2 || this.form0.pro_status===4) ? '重 签' : '签 章 ' }}
            </el-button>
            <el-button type="success"
              @click.native="handleSignSubmit2"
              style="background-color: #eaf5f4; border-color: #acd9d4; color: #2f9f93">提 交</el-button>
          </template>
          <el-button type="success"
            @click.native="doPrint"
            style="background-color: #2f9f93; border-color: #2f9f93">打 印</el-button>
          <div class="sign-view-text">
            <span class="set-font-weight">请自行下载并安装签章插件：</span>
            <el-button type="text" size="mini" @click="handleDowload(1)">
              <span class="set-font-weight">PDF签章</span>
            </el-button>
            <el-button type="text" size="mini" @click="handleDowload(2)">
              <span class="set-font-weight">网页签章</span>
            </el-button>
          </div>
        </template>
        <template v-else>
          <template v-if="is_declare">
            <el-button @click.native="$router.go(-1)">返 回</el-button>
            <el-button type="success" @click.native="doPrint">打 印</el-button>
          </template>
          <template v-else>
            <template v-if="!is_mod_check">
              <el-button @click.native="handleToAdd">返 回</el-button>
              <template v-if="is_ss&&is_ss_auth">
                <el-button
                  v-if="form0.is_sign_shenb===2&&!is_from_sign_check&&!(this.form0.pro_status===2||this.form0.pro_status===4)"
                  type="success"
                  @click.native="doPrint"
                >打 印</el-button>
                <template v-else>
                  <el-button
                    type="success"
                    @click.native="handleSignBtn"
                  >{{ (this.form0.pro_status===2||this.form0.pro_status===4)?'重 签':'签 章 '}}</el-button>
                  <el-button type="success" @click.native="handleSignSubmit2">提 交</el-button>
                </template>
              </template>
              <template v-if="is_ss&&this.form0.pro_status===0">
                <el-button type="success" @click.native="doPrint">打 印</el-button>
              </template>
            </template>
          </template>
        </template>
      </footer>
      <input type="hidden" id="qianfa" v-model="shenb_user">
      <input type="hidden" id="proqianfa1zxy" v-model="sign_value1">
      <input type="hidden" id="proqianfa2zxy" v-model="sign_value2">
    </el-card>
    <el-backtop v-if="!isce.id" target=".app-home-main-row" :visibility-height="400"></el-backtop>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="项目提交"
      center
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div>
        <el-form v-if="is_update_note" @submit.native.prevent>
          <el-form-item label="本次修改说明：" :rules="[{required:true}]">
            <el-input
              v-model="update_note"
              type="textarea"
              :rows="4"
              placeholder="请输入本次修改说明（限80字内）"
            ></el-input>
          </el-form-item>
        </el-form>
        <div v-else style="text-align: center">是否立即提交至管理员审核 ？</div>
      </div>
      <div slot="footer" class="dialog-footer" v-loading="loading">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click.native="handleSignSubmitTrue">确认提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="申办单位负责人签章信息核对"
      center
      :visible.sync="dialogVisible_fzr"
      width="400px"
    >
      <div>
        <el-form>
          <el-form-item label="负责人姓名：" :rules="[{required:true}]">
            <el-input v-model="fzr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-loading="loading">
        <el-button @click.native="dialogVisible_fzr = false">取 消</el-button>
        <el-button type="success" @click.native="handleSignSubmit1">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { MATE } from '@/assets/js/config.special.js'
import BJCA from "@/assets/js/BJCAWebSign.js";
import SuZhou from "@/assets/images/suzhou.png";
import ShenZhen from "@/assets/images/suzhou.png";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-project-declare",
  data() {
    return {
      loading2: false,
      loadingNum: 0,
      pro_id: 0,
      form0: {},
      yhForm: {},
      form1: [],
      form2: [{}],
      form3: {},
      form5: [{}],
      form4: {
        ys_fz: [{}],
        ys_hz: [{}],
        hz_note: [{}]
      },
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      pxlx: [],
      is_declare: true,
      is_mod: false,
      mod_params: {
        pro_id: 0,
        cont: 1,
        mod_id: null
      },
      is_mod_check: false, 
      is_ss: false,  
      is_ss_auth: false, 
      is_from_sign_check: false, 

      dialogVisible: false,
      loading: false,
      update_note: "",  
      is_update_note: false, 
      shenb_user: "",
      shenb_img: "",
      dialogVisible_fzr: false,
      fzr_name: "",
      SignImgSrc: "",
      contentZsjz: {
        adm_major: {
          content: "",
          label: "学院及专业优势简介",
          order: "一",
          show: true
        },
        adm_course: { content: "", label: "课程安排", order: "二", show: true },
        adm_teaching: {
          content: "",
          label: "教学办法",
          order: "三",
          show: true
        },
        adm_study_time: {
          content: "",
          label: "学习期限",
          order: "四",
          show: true
        },
        adm_requirement: {
          content: "",
          label: "报名条件",
          order: "五",
          show: true
        },
        adm_attention: {
          content: "",
          label: "注意事项",
          else_label: "报名流程和联系方式",
          divide: true,
          order: "六",
          show: true
        },
        adm_charging: {
          content: "",
          label: "收费标准",
          order: "七",
          show: true
        },
        ssfs: {
          show: false,
          label: "收费方式",
          order: "八"
        },
        adm_certificate: { content: "", label: "证书", order: "九", show: true }
      },
      is_jypxzx: false,
      isYXB: false,
      sign_value1: '',
      sign_value2: ''
    };
  },
  props: {
    isce: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  filters: {
    showAll(list) {
      let lens = list && list.length,
        d = 0,
        sum = 0;
      for (let key in list) {
        let str = "" + list[key].fyzj;
        if (str.indexOf(".") != -1) {
          let temp = str.split(".")[1].length;
          d = d < temp ? temp : d;
        }
      }
      let m = Math.pow(10, d);
      for (let key in list) {
        sum += list[key].fyzj * m;
      }
      if (!isNaN(sum / m)) {
        return sum / m + ".00";
      } else {
        return sum / m;
      }
    },
    subtraction() {
      let val = arguments[0];
      for (let k in arguments) {
        if (Number(k)) {
          val = parseFloat(val - arguments[k]).toFixed(2);
        }
      }
      return val;
    },
    statisticsRatio(num, list, total, is_total) {
      if (total > 0) {
        if (is_total) {
          if (total) {
            return Math.round((num / total) * 10000) / 100.0 + "%";
          } else {
            return "0%";
          }
        } else {
          let lens = list.length,
            d = 0,
            sum = 0;
          for (let key in list) {
            let str = "" + list[key].fyzj;
            if (str.indexOf(".") != -1) {
              let temp = str.split(".")[1].length;
              d = d < temp ? temp : d;
            }
          }
          let m = Math.pow(10, d);
          for (let key in list) {
            sum += list[key].fyzj * m;
          }
          if (sum) {
            let ratio = (100 * num) / (sum / m) + "";
            if (ratio.indexOf(".") != -1) {
              ratio = ratio.substring(0, 5);
            }
            return ratio + "%";
          } else {
            return "0%";
          }
        }
      } else {
        return null;
      }
    }
  },
  computed: {
    ...mapState(["lookUrl", "zsjz_divide", 'userInfo', 'versionTime_4', 'zsjz_divide_4', 'URL', 'fz202101']),
    addTotal() {
      let list = this.form4.ys_fz;
      let lens = list && list.length,
        d = 0,
        sum = 0;
      for (let key in list) {
        let str = "" + list[key].fyzj;
        if (str.indexOf(".") != -1) {
          let temp = str.split(".")[1].length;
          d = d < temp ? temp : d;
        }
      }
      let m = Math.pow(10, d);
      for (let key in list) {
        sum += list[key].fyzj * m;
      }
      return sum / m;
    },
    addTotal2() {
      return this.form4.ys_hz.map(item => {
        let list = item.note;
        let lens = list && list.length,
          d = 0,
          sum = 0;
        for (let key in list) {
          let str = "" + list[key].fyzj;
          if (str.indexOf(".") != -1) {
            let temp = str.split(".")[1].length;
            d = d < temp ? temp : d;
          }
        }
        let m = Math.pow(10, d);
        for (let key in list) {
          sum += list[key].fyzj * m;
        }
        return sum / m;
      });
    }
  },
  methods: {
    ...mapActions([
      "getProjectsData",
      "getProjectYh",
      "getCoursesForm1",
      "getWtForm2",
      "getFzForm3",
      "getHzForm5",
      "getYsForm4",

      "getProModifyInfoYh",
      "getProModifyInfo0",
      "getProModifyInfo1",
      "getProModifyInfo2",
      "getProModifyInfo3",
      "getProModifyInfo5",
      "getProModifyInfo4",

      "projectSubSign"
    ]),
    initData() {
      this.loading2 = true;
      if (this.is_mod) {
        this.getProModifyInfo0({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data) {
              this.form0 = Data;
              if (this.form0.college.indexOf("苏州研究院") > -1) {
                this.shenb_user = "黎玖高";
                this.SignImgSrc = this.form0.is_sign_shenb === 2 ? SuZhou : "";
              } else if (this.form0.college.indexOf("深圳研究院") > -1) {
                this.shenb_user = "袁少暐";
                this.SignImgSrc = this.form0.is_sign_shenb === 2 ? ShenZhen : "";
              } else if (this.form0.college.indexOf("继续教育学院") > -1) {
                this.shenb_user = "马丹宁"
              }
              
              const signValue = `${this.form0.wisdom_id}-${this.form0.create_time}`
              this.sign_value1 = `${signValue}-1`
              this.sign_value2 = `${signValue}-2`
              if ((this.form0.is_sign_shenb === 2 && this.shenb_user && this.form0.shenb_img) || (this.form0.sign_name_token && this.form0.sign_seal_token)) {
                this.f_BT11Click();
              }
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProModifyInfoYh({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            this.yhForm = data.data.data.list;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProModifyInfo1({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            this.form1 = this.form1.concat(
              data.data.data.list.xiaonei,
              data.data.data.list.xiaowai
            );
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProModifyInfo2({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form2 = data.data.data.list;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProModifyInfo3({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form3 = data.data.data.list[0];
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProModifyInfo5({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form5 = data.data.data.list;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProModifyInfo4({
          data: this.mod_params
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            this.form4 = data.data.data.list[0];
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        this.getProjectsData({
          data: !!this.isce.id ? {
            proid: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            proid: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form0 = Data.list[0];
              if (this.form0.college && this.form0.college.indexOf("苏州研究院") > -1) {
                this.shenb_user = "黎玖高";
                this.SignImgSrc = this.form0.is_sign_shenb === 2 ? SuZhou : "";
              } else if (this.form0.college && this.form0.college.indexOf("深圳研究院") > -1) {
                this.shenb_user = "袁少暐";
                this.SignImgSrc = this.form0.is_sign_shenb === 2 ? ShenZhen : "";
              } else if (this.form0.college && this.form0.college.indexOf("继续教育学院") > -1) {
                this.shenb_user = "马丹宁";
                this.SignImgSrc = '';
              }
              if (this.isce.id) {
                this.shenb_user = "马丹宁"
              }
              const signValue = `${this.form0.wisdom_id}-${this.form0.create_time}`
              this.sign_value1 = `${signValue}-1`
              this.sign_value2 = `${signValue}-2`
              if (((this.form0.is_sign_shenb === 2 && this.shenb_user && this.form0.shenb_img) || (this.form0.sign_name_token && this.form0.sign_seal_token)) && this.form0.pro_status !== 2) {
                this.f_BT11Click();
              }
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getProjectYh({
          data: !!this.isce.id ? {
            pro_id: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            pro_id: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            this.yhForm = data.data.data.list;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getCoursesForm1({
          data: !!this.isce.id ? {
            pro_id: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            pro_id: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            this.form1 = this.form1.concat(
              data.data.data.list.xiaonei,
              data.data.data.list.xiaowai
            );
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getWtForm2({
          data: !!this.isce.id ? {
            pro_id: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            pro_id: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            let Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form2 = Data.list;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getFzForm3({
          data: !!this.isce.id ? {
            pro_id: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            pro_id: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            let Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form3 = Data.list[0];
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getHzForm5({
          data: !!this.isce.id ? {
            pro_id: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            pro_id: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            let Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form5 = Data.list;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getYsForm4({
          data: !!this.isce.id ? {
            pro_id: this.pro_id,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            pro_id: this.pro_id
          },
          front: !!this.isce.id
        }).then(data => {
          this.loadingNum++;
          if (data.data.code === 200) {
            let Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.form4 = Data.list[0];
            }
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
    },
    handleToAdd() {
      const ID = this.$route.params.id;
      let obj = {
        pro_id: ID
      };
      sessionStorage.setItem("PRO_STEP", 6);
      sessionStorage.setItem("PRO", JSON.stringify(obj));
      this.$router.go(-1);
    },

    handleSignBtn() {
      this.dialogVisible_fzr = true;
    },
    handleSignSubmit1() {
      if (!this.fzr_name) {
        this.$message.error({
          title: "错误",
          message: "请输入负责人姓名！"
        });
        return;
      } else {
        if (this.fzr_name.trim() !== this.shenb_user) {
          this.$message.error({
            title: "错误",
            message: "负责人姓名错误，请重新输入！"
          });
          return;
        }
      }
      if (this.form0.pro_status === 2 || this.form0.pro_status === 4) {
        this.is_update_note = true;
      }
      this.loading = false;
      this.loading2 = false;
      this.dialogVisible_fzr = false;
      this.signClick();
    },
    handleSignSubmit2() {
      if (!this.fzr_name) {
        this.$message.error({
          title: "错误",
          message: "请输入负责人姓名后盖章并提交！"
        });
        return;
      }
      let signData = BJCA.ESeaL_GetSignatureData("1");
      this.shenb_img = signData;
      if (this.shenb_user && this.shenb_img) {
        this.dialogVisible = true;
      }
    },
    handleSignSubmitTrue() {
      if (this.is_update_note && !this.update_note) {
        this.$message({
          type: "warning",
          message: "请输入本次修改说明！"
        });
        return false;
      }
      this.loading = true;
      if (this.loading) {
        this.projectSubSign({
          data: !!this.isce.id ? {
            id: this.form0.id, 
            update_note: this.update_note,
            shenb_user:
              this.shenb_img.substring(100, 200) +
              this.shenb_img.substring(50, 1000) +
              this.shenb_img.substring(150, 400),
            shenb_img: this.shenb_img,
            timeStamp: this.isce.timeStamp,
            randomStr: this.isce.randomStr,
            wisdom: this.isce.wisdom
          } : {
            id: this.pro_id,
            update_note: this.update_note,
            shenb_user:
              this.shenb_img.substring(100, 200) +
              this.shenb_img.substring(50, 1000) +
              this.shenb_img.substring(150, 400),
            shenb_img: this.shenb_img
          },
          front: !!this.isce.id
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: !!this.isce.id ? '签章并提交成功，请返回智慧系统刷新列表！' : data.data.data
            });
            this.initData();
            this.dialogVisible = false;
            this.loading = false;
            this.loading2 = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading = false;
              }
            });
          }
        });
      }
    },
    signClick() {
      BJCA.ESeaL_InsertStamp("1", "sigDIV", "qianfa", false);
      BJCA.ESeaL_SetSealPosAndSign("1", "qianfa", 420, -110);
    },
    f_BT11Click() {
      this.$nextTick(() => {
        if (this.form0.shenb_img && this.shenb_user) {
          var data = this.form0.shenb_img;
          BJCA.ESeaL_InsertStamp("1", "sigDIV", "qianfa", false);
          BJCA.ESeaL_SetData(
            "1",
            "qianfa",
            data,
            "SHA256WithRSA",
            "qianfa",
            420,
            -110
          );
        }
        if (this.form0.sign_name_token) {
          const data = this.form0.sign_name_token
          BJCA.ESeaL_InsertStamp('1zxy', 'sigDIV', 'proqianfa1zxy', false)
          BJCA.ESeaL_SetData('1zxy', 'proqianfa1zxy', data, 'SHA256WithRSA', 'proqianfa1zxy', 420, -110)
        }
        if (this.form0.sign_seal_token) {
          const data = this.form0.sign_seal_token
          BJCA.ESeaL_InsertStamp('2zxy', 'sigDIV', 'proqianfa2zxy', false)
          BJCA.ESeaL_SetData('2zxy', 'proqianfa2zxy', data, 'SHA256WithRSA', 'proqianfa1zxy', 420, -110)
        }
      });
    },
    handleDowload (type) {
      if (type === 1) {
        window.open(`${this.URL}/static/file/PDFV1.exe`)
      } else if (type === 2) {
        window.open(`${this.URL}/static/file/qzcj.zip`)
      }
    },
    hzNote (list) {
      let num = 0
      list.forEach(item => {
        num += (item.zc_hzdwfc-0 || 0)
      })
      return num
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    if (this.userInfo.role === 2) {
      if (MATE('project_sign', this.userInfo.college)) {
        this.is_ss = true;
        if (this.userInfo.auth_college) {
          this.is_ss_auth = true;
        }
      }
      if (MATE('project_noFinance', this.userInfo.college)) {
        this.is_jypxzx = true;
      }
    }
    const mod = sessionStorage.getItem("mod_params");
    if (sessionStorage.getItem("from_sign_check")) {
      this.is_from_sign_check = true;
    } else {
      this.is_from_sign_check = false;
    }
    if (mod) {
      this.is_mod = true;
      this.is_declare = false;
      this.mod_params = JSON.parse(mod);
      this.initData();
    } else {
      if (this.$route.fullPath.indexOf("declare") > 0) {
        this.is_declare = true;
        if (sessionStorage.getItem("pro_declare") || this.isce.id) {
          this.pro_id = sessionStorage.getItem("pro_declare") || this.isce.id;
          this.initData();
        } else {
          this.$router.go(-1);
        }
      } else {
        this.is_declare = false;
        this.pro_id = this.$route.params.id;
        this.initData();
      }
    }
    if (this.$route.path.indexOf("modifyList") > 0) {
      this.is_mod_check = true;
    }
    if (1) {
      let list0 = [];
      for (let key in this.proConfig.pxlx) {
        if (key == 5) {
          list0[1] = {
            id: key,
            title: this.proConfig.pxlx[key]
          };
        } else if (key == 6) {
          list0[0] = {
            id: key,
            title: this.proConfig.pxlx[key]
          };
        } else if (key == 7) {
          list0[4] = {
            id: key,
            title: this.proConfig.pxlx[key]
          };
        } else if (key == 8) {
          list0[2] = {
            id: key,
            title: this.proConfig.pxlx[key]
          };
        } else if (key == 9) {
          list0[3] = {
            id: key,
            title: this.proConfig.pxlx[key]
          };
        }
      }
      this.pxlx = list0;
    }
  },
  mounted() {
    sessionStorage.setItem("proModInfo2", JSON.stringify(this.mod_params));
    if (sessionStorage.getItem("by_checkPro")) {
      const old = sessionStorage.getItem("by_checkPro");
      sessionStorage.setItem("checkPro", old);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("pro_declare");
    sessionStorage.removeItem("mod_params");
    sessionStorage.removeItem("by_checkPro");
    sessionStorage.removeItem("from_sign_check");
  },
  watch: {
    loadingNum() {
      if (this.loadingNum === 7) {
        this.loading2 = false;
      }
    }
  }
};
</script>

<style scoped>
.project-declare-main {
  width: 680px;
  padding: 20px 0;
  margin: 0 auto;
  font-size: 14px;
  font-family: "SimSun";
}
.project-declare-main-body {
  font-size: 12px;
}
.project-declare-main-head {
  margin-bottom: 30px;
}
.project-declare-title {
  font-size: 20px;
  font-weight: bold;
  line-height: 3em;
  text-align: center;
}
.project-declare-main-item {
  margin-bottom: 20px;
}
.project-declare-sub {
  text-align: center;
}
.project-declare-value {
  padding: 0 4px;
  border-bottom: 1px solid #303133;
}
.project-declare-item-title {
  font-weight: bold;
  margin-bottom: 20px;
}
.project-declare-item-table {
  border-collapse: collapse;
  width: 100%;
}
.project-declare-item-table td {
  padding: 6px 10px;
}
.td-center {
  text-align: center;
}
.project-declare-foot {
  padding: 40px;
  text-align: center;
}
img {
  vertical-align: middle;
}
.check-box-span {
  padding-right: 12px;
}
.td-title-1 {
  width: 100px;
}
#qianfa {
  position: absolute;
  left: 100px;
  top: -6px;
  right: 90px;
  height: 24px;
  font-size: 14px;
  padding: 0 4px;
}
#sigDIV {
  position: relative;
}
.qianfa-wrap {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
}
.sign-img {
  position: absolute;
  width: 180px;
  bottom: 0;
  left: 100px;
}
.xx-bottom {
  padding-bottom: 6px;
}

.yes-no-img{
  margin: 0 2px 2px;
}
</style>
