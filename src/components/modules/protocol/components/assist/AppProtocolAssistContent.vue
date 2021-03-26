<template>
  <div
    class="app-protocol-assist-content"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <template v-if="xy_time">
      <div :id="printType === 1 ? `subOutputRank-print` : ''" v-cloak>
        <!--版本一-->
        <template v-if="xy_time < versionTime">
          <div style="padding: 0 40px" class="print-content">
            <!--头部-->
            <div class="assist-content-head">
              <el-row>
                <el-col :span="12" :offset="6">
                  <header class>
                    <div class="assist-content-head-title">
                      <div style="font-weight: bold;font-size: 18px">培训辅助工作协议书</div>
                      <div v-if="showData.status!==3">（草稿）</div>
                    </div>
                    <div class="assist-content-head-sub-title">（中国人民大学非学历非学位教育培训版）</div>
                  </header>
                </el-col>
                <el-col :span="6">
                  <div v-if="!is_modListText" class="header-right">
                    <div class="right-code-img">
                      <img :src="imgUrl" alt style="height: 100%">
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div class="right-num">
                编号：
                <span class="tip-red">{{ showData.contract_code?showData.contract_code:'审核通过后生成'}}</span>
              </div>
            </div>
            <!--内容-->
            <div class="assist-content-body entrust-content-body-ver1">
              <div v-if="checkShow" class="content-annotation">
                以下
                <span class="tip-red">红色区域</span>为项目辅助协议填写信息
                <span class="check-compare">（绿色区域为协议不同于立项前的信息）</span>，请认真审核！
              </div>
              <!---->
              <div class="content-body-head">
                <div class="module-bottom ja-yi">
                  <div class>
                    <span class="title-mark">甲方：</span>
                    <span
                      class="info-val"
                      :class="{'check-val':checkShow}"
                    >中国人民大学{{ is_college3?showData.college:''}}</span>
                  </div>
                  <div class>
                    <span class="title-mark">乙方：</span>
                    <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_dwmc }}</span>
                  </div>
                </div>
                <div class="module-bottom shrink-section">
                  本着真诚合作、互利共赢、权利明确的原则，经友好商协，甲方与乙方就“
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.pro_name }}</span>
                  <span
                    v-if="checkShow&&(proData_jb.pro_name!==showData.pro_name)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_jb.pro_name }}</span>
                  ”（培项字：
                  <template v-for="(item,key,index) in proConfig.pxlx">
                    <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                  </template>
                  {{ showData.pro_code }}）培训辅助工作的委托协作达成如下协议，约定如下：
                </div>
              </div>
              <!---->
              <div class="shrink-section">
                <div class="module-bottom">
                  <div class="title-mark">一、委托协作具体内容</div>
                  <div class>
                    <div class>
                      <span>（一）</span>双方协作举办“
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.pro_name }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.pro_name!==showData.pro_name)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.pro_name }}</span>
                      ”，
                      计划举办
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jhjbqs }}</span>
                      <span
                        v-if="checkShow&&(1!==showData.jhjbqs)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{1}}</span>
                      期，
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jhmqrs }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.zsrs!==showData.jhmqrs)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.zsrs }}</span>
                      人/期。
                    </div>
                    <div class>
                      <div v-if="showData.zs_type===2">
                        <span>（二）</span>培训班招生时间为：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.zs_start_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.zs_start_time!==showData.zs_start_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.zs_start_time | TimestampChangeFilter(true) }}</span>
                        至
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.zs_end_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.zs_end_time!==showData.zs_end_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.zs_end_time | TimestampChangeFilter(true) }}</span>
                        。
                      </div>
                      <div>
                        <span v-if="showData.zs_type!==2">（二）</span>培训班举办时间（具体培训授课时间）为：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.px_start_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.px_start_time!==showData.px_start_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.px_start_time | TimestampChangeFilter(true) }}</span>
                        至
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.px_end_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.px_end_time!==showData.px_end_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.px_end_time | TimestampChangeFilter(true) }}</span>
                        。
                      </div>
                    </div>
                    <div class>
                      <span>（三）</span>该班在
                      <span class="info-val" :class="{'check-val':checkShow}">{{ showData.pxdd }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.pxdd!==showData.pxdd)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.pxdd }}</span>
                      (地点)授课。
                    </div>
                    <div class>
                      <span>（四）</span>培训内容和课程安排，以及举办多期培训的时间、地点、人数安排等详细计划如下：
                    </div>
                    <div class style="text-indent: 0;padding-left: 50px">
                      <div class="font-line" :class="{'font-line-check':checkShow}">
                        <span style ref="pxap" class></span>
                      </div>
                      <div
                        v-if="checkShow&&(proData_fz.pxap!==showData.pxap)"
                        class="font-line"
                        :class="{'font-line-check-compare':checkShow}"
                      >
                        <span style ref="pxap0" class></span>
                      </div>
                    </div>
                    <div class>
                      <span>（五）</span>协作双方的具体分工：
                    </div>
                    <div class>
                      1.甲方负责该培训项目的课程设置、教师选用，以及：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_fzgz }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.jf_fzgz!==showData.jf_fzgz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.jf_fzgz }}</span>
                    </div>
                    <div class>
                      2.乙方负责：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_fzgz }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_fzgz!==showData.yf_fzgz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_fzgz }}</span>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">二、双方权利与义务</div>
                  <div>
                    <div>
                      <div>（一）双方</div>
                      <div>
                        <div
                          class
                        >1.甲乙双方在协议执行中，应采取友好协作、相互配合的态度，本协议签订后对协议事项有变动或需更改有关条款的，需签订补充协议或另行签订协议。</div>
                        <div class>2.在本协议实施过程中和本协议履行完毕后，双方均不得使用、传播或公开在履行本项目过程中得到的对方商业秘密。具体要求如下：</div>
                        <div
                          class
                        >（1）甲乙双方对本协议的内容，以及在本协议履行过程中获得的对方的信息，均负有保密的义务。除甲乙双方另有约定外，保密信息包括但不限于本协议报价、协议文本以及双方标有保密字样的往来文件。</div>
                        <div
                          class
                        >（2）在未经对方书面同意前，任何一方不得将本协议及相关内容用于任何与其执行本协议无关的情况；或以任何形式向本协议以外的第三方泄漏，双方均有义务尽其一切努力防止本协议以外的他方窃取秘密信息。由于任何一方违反以上保密义务给对方造成损失，违约方对受损失方负有停止侵害、消除影响、赔偿损失的责任。</div>
                        <div class>（3）本条项下的保密义务在本协议中止或终止后依然有效。</div>
                      </div>
                    </div>
                    <div>
                      <div>（二）甲方</div>
                      <div>
                        <template v-if="!is_college3">
                          <div
                            class="content-specific"
                            style="font-weight: bold"
                          >1.按照《中国人民大学合同管理办法（修订）》要求，中国人民大学授权中国人民大学继续教育处代表学校作为甲方审核并签订此培训工作协议。合同由继续教育处负责人签署，加盖“中国人民大学合同专用章（9）”。（授权委托书见附件1）</div>
                          <div class="content-specific" style="font-weight: bold">
                            2.本协议所议培训班，具体由甲方下属中国人民大学
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            承办，
                            具体协议经济责任主要由
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            与乙方议定，
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            向中国人民大学继续教育处签定《培训承办单位承诺书》（具体格式见附件2）后代表学校具体承担甲方权利、义务与责任。
                          </div>
                        </template>
                        <div class>{{ is_college3?1:3}}.负责制定本培训项目的整体培养方案，对于培训的课程设置和教师安排，甲方具有最终决定权。</div>
                        <div
                          class
                        >{{ is_college3?2:4}}.负责为乙方提供招生宣传资料并对乙方发布的招生信息进行审核，对于乙方违反国家政策法规和学校规定的招生宣传活动，有权要求乙方更改或撤销，情节严重的可中止与乙方的合作，乙方负全责。</div>
                        <div
                          class
                        >{{ is_college3?3:5}}.有权对乙方推荐或代招的学员依照规定进行学习资格审查，对于不符合招收规定的学员有权拒收，拒收学员不计为财务分成依据。</div>
                        <div class>{{ is_college3?4:6}}.负责监督或组织现场教学活动并进行教学管理。</div>
                        <div
                          class
                        >{{ is_college3?5:7}}.学员交纳的培训费用，必须由受训单位或学员直接向甲方账户缴纳，甲方负责办理校内财务结算手续，并在中国人民大学财务管理部门办理与乙方的财务分成。</div>
                        <div class>{{ is_college3?6:8}}.培训结束时，为完成培训学习任务的学员向中国人民大学有关部门申领并颁发结业证书。</div>
                      </div>
                    </div>
                    <div>
                      <div>（三）乙方</div>
                      <div>
                        <div
                          class
                        >1.乙方承诺严格遵守中国人民大学各项规章制度，愿意接受甲方继续教育有关管理部门对培训班的全流程管理。如有违规，愿意按照甲方规定接受处罚。</div>
                        <div
                          class
                        >2.乙方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他与甲方无关的培训项目中继续利用甲方进行培训宣传和招生，但可进行正常的新闻报道。</div>
                        <div class>3.乙方关于本教育培训项目所作的任何宣传，需以甲方提供的宣传资料为基础，不得向学员夸大宣传、虚假承诺。</div>
                        <div
                          class
                        >4.乙方必须在本协议列明的授权范围内办理协作事宜，除非有合理理由，对于超越权限的事务，甲方拒绝接受或承认，由此产生的责任由乙方负责；乙方必须及时处理合作事宜，除非有合理理由，对于延迟办理某项事务造成的损失，乙方应向甲方承担赔偿责任。</div>
                        <div class>5.乙方可以对培训课程的设计、招生和教学等工作提出建议。</div>
                        <div class>6.乙方开展协议约定的工作，并按协议约定取得相应报酬。</div>
                        <div class>7.甲方将乙方依据本协议应分的合法收入交付乙方后, 乙方必须为分成款出具正规并符合甲方要求的发票。</div>
                        <div class>8.尊重和保护甲方的知识产权，即使在协议中止或终止后。</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">三、限制</div>
                  <div>
                    <div>
                      <div class="title-mark">（一）双方</div>
                      <div>
                        <div
                          class
                        >1.在招生过程中，甲、乙双方均不得向学员承诺或暗示本培训项目与学历、学位有关，要明确向学员说明非学历、非学位教育培训项目与正规全日制学历教育的区别。不得在招生宣传和材料中出现“注册”、“学籍管理”、“学费”、“本科生待遇（研究生待遇）”“获得学历（学位）”等容易让学员混淆和欺骗学员的词句。</div>
                        <div class>2.不得借由举办培训班的机会向学员集资、融资，不得向学员推荐投资项目。</div>
                      </div>
                    </div>
                    <div>
                      <div class="title-mark">（二）甲方</div>
                      <div>
                        <div class>1.不得指派校外人员办理中国人民大学校内立项、租借、结算等各种行政手续。</div>
                        <div class>2.不向乙方提供中国人民大学域名建立招生网站。</div>
                        <div class>3.不为乙方的办公和招生工作提供中国人民大学校内办公和教学场地。</div>
                      </div>
                    </div>
                    <div>
                      <div class="title-mark">（三）乙方</div>
                      <div>
                        <div
                          class
                        >1.学员交纳的培训费用，必须由受训单位或学员直接向甲方账户缴纳，乙方不得代收培训费。乙方不得借由与甲方合作，在招生和办学过程中向学员收取协议规定的培训费用之外的任何费用。</div>
                        <div
                          class
                        >2.乙方机构和人员不得在合作过程中冒充中国人民大学下属单位和职工。不得假冒甲方机构和人员对外宣传和招生，在招生过程中必须向学员明示自己辅助培训单位的真实身份。</div>
                        <div class>3.乙方不得借辅助培训之机，以甲方之名在协议议定的培训班之外另行搭车办班。</div>
                        <div class>4.不经中国人民大学有关管理部门同意，不得随意使用中国人民大学形象识别系统（校名、校徽等）。</div>
                        <div class>
                          5.乙方承诺遵守中国人民大学教育培训有关考核规定，对于办班过程中乙方出现的违规行为，甲方有权以扣罚分成款的形式进行管理和处罚。具体包含以下情况：
                          <div>乙方擅自更改经学校和学院审定的招生简章进行虚假宣传——扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方违规转移、下放招生的职责和权利（发展招生下线）——扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方搭车办班——扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方多收培训费——多收部分收归甲方，并扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方擅自为学员打折——从应分分成款中扣除打折部分，并扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方代收代缴或坐收坐支学员培训费——加罚代收部分利息，并扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方恶意诋毁和攻击校内其他培训项目——扣罚乙方50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方冒充甲方校内机构和人员招生宣传——扣罚50%分成款，情节严重的培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方冒充甲方机构和人员从事侵权和违法活动——培训费全额收归甲方学校账户，不予分成；</div>
                          <div>乙方借举办培训班之机向学员集资、融资，向学员推荐投资项目——培训费全额收归甲方学校账户，不予分成。</div>
                          <div>其他违规事项，双方另行商议处罚方式。</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">四、项目费用及付款</div>
                  <div>
                    <div class>
                      <span class="title-mark">（一）</span>该培训项目收费标准为：
                    </div>
                    <div class>
                      <div v-if="showData.ks_charge===2">
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.specific_rate }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.specific_rate!==showData.specific_rate)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.specific_rate }}</span>
                      </div>
                      <template v-else>
                        <div v-if="showData.sfbz===1">
                          委托单位统一支付
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw }}</span>
                          <span
                            v-if="checkShow&&(proData_jb.sfbz_dw!==showData.sfbz_dw)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_jb.sfbz_dw }}</span>
                          元，（大写：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw>0?showData.sfbz_dw_dx:'零圆'}}</span> 。）
                        </div>
                        <div v-if="showData.sfbz===2">
                          受训学员自行按照
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_xy }}</span>
                          <span
                            v-if="checkShow&&(proData_jb.sfbz_xy!==showData.sfbz_xy)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_jb.sfbz_xy }}</span>
                          元/人标准支付，大写：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_xy>0?showData.sfbz_xy_dx:'零圆'}}</span>。
                        </div>
                        <div v-if="showData.sfbz===3">
                          委托单位统一支付
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw }}</span>
                          <span
                            v-if="checkShow&&(proData_jb.sfbz_dw!==showData.sfbz_dw)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_jb.sfbz_dw }}</span>
                          元（大写：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw>0?showData.sfbz_dw_dx:'零圆'}}</span> ），
                          学员按照
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_xy }}</span>
                          <span
                            v-if="checkShow&&(proData_jb.sfbz_xy!==showData.sfbz_xy)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_jb.sfbz_xy }}</span>
                          元/人标准（大写：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_xy>0?showData.sfbz_xy_dx:'零圆'}}</span> ）支付剩余部分。
                        </div>
                      </template>
                    </div>
                    <div class>上述培训费具体包含以下用途和项目：</div>
                    <div class>
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.pxfy_desc }}</span>
                      <div v-if="checkShow&&(proData_jb.pxfy_desc!==showData.pxfy_desc)">
                        <span
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.pxfy_desc }}</span>
                      </div>
                    </div>
                    <div class>
                      <span class="title-mark">（二）</span>乙方不得代收学员或受训单位的培训费用，零散招收的学员应通过“中国人民大学收费管理服务系统”进行网上交费或直接汇款至甲方指定的银行账户，委托单位的培训费用直接汇款至甲方指定的银行账户,甲方负责按规定开具等额有效发票。
                    </div>
                    <div class>
                      <div>1.人民币汇款信息：</div>
                      <div>收款人全称：中国人民大学{{ is_college3?showData.college:''}}；</div>
                      <div>收款人账号： {{ zh}} ；</div>
                      <div>收款人开户银行： {{ khh}} ;</div>
                      <div>汇款备注栏中必须注明收款学院和培训项目名称。</div>
                      <template v-if="!is_college3">
                        <div>2.外币业务汇款信息：</div>
                        <div>BANK NAME（银行名称）： BANK OF CHINA BEIJING BRANCH RENDA SUB BRANCH / 中国银行北京人大支行</div>
                        <div>BENEFICIARY’S BANK ADDRESS（收款人银行地址）：NO.2 ChaoyangMenNei Da jie,Dongcheng District,Beijing 100010,China / 北京市东城区朝阳门内大街2号</div>
                        <div>A/C HOLDER’S NAME （收款人账户名称）：RENMIN UNIVERSITY OF CHINA / 中国人民大学</div>
                        <div>BENEFICIARY’S ADDRESS（收款人地址）：NO.59,Zhongguancun Street,Haidian Dist., Beijing100872,China / 北京市海淀区中关村大街59号</div>
                        <div>A/C NO.（账号）： 3194 5603 1681</div>
                        <div>SWIFT CODE（银行清算代码）：BKCHCNBJ110</div>
                      </template>
                    </div>
                    <div class>
                      <span class="title-mark">（三）费用分配</span>
                    </div>
                    <div class>
                      1.乙方承担本次培训的辅助工作，负责以下费用的支出：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_fyzc }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_fyzc!==showData.yf_fyzc)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_fyzc }}</span>。
                    </div>
                    <div class>
                      2.依据乙方承担的上述辅助工作和费用支出，乙方获得{{ isYXB ? '最高' : '的总' }}分成比例为
                      <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_fcbl}}{{ isYXB && (showData.yf_fcbl || 0) > -1 ? '%' : '' }}</span>
                      <span v-if="checkShow && (proData_fz.yf_fcbl != showData.yf_fcbl)"
                        class="info-val" :class="{'check-compare':checkShow}">
                        {{ proData_fz.yf_fcbl}}{{ isYXB && (proData_fz.yf_fcbl || 0) > -1 ? '%' : '' }}
                      </span>
                      <template v-if="isYXB">（分成计算方法需要说明的情况：
                        <span class="info-val" :class="{'check-val': checkShow}">{{ showData.yf_fzjtfc }}</span>
                        <span v-if="checkShow && (proData_fz.yf_fzjtfc !== showData.yf_fzjtfc)"
                          class="info-val" :class="{'check-compare': checkShow}">{{ proData_fz.yf_fzjtfc }}</span>）
                      </template>。
                    </div>
                    <div class>
                      3. 甲方分
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_fqs }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_fqs!==showData.yf_fqs)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_fqs }}</span>
                      期向乙方拨付分成款，具体付款时间为：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_fqs_time }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_fqs_time!==showData.yf_fqs_time)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_fqs_time }}</span>
                    </div>
                    <div class>
                      4.乙方收款账户信息（账户名称、账号、开户行，收款账户名称必须与乙方单位名称一致）：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >
                        账户名称：{{ showData.yf_dwmc }}；
                        账号：{{ showData.yf_yhzh}}；
                        开户行：{{ showData.yf_khh}}。
                      </span>
                      <template v-if="checkShow">
                        <span
                          v-if="(proData_fz.yf_dwmc!==showData.yf_dwmc)||(proData_fz.yf_yhzh!==showData.yf_yhzh)||(proData_fz.yf_khh!==showData.yf_khh)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >
                          账户名称：{{ proData_fz.yf_dwmc }}；
                          账号：{{ proData_fz.yf_yhzh}}；
                          开户行：{{ proData_fz.yf_khh}}。
                        </span>
                      </template>
                    </div>
                    <div class>
                      <span class="title-mark">（四）</span>培训班正式开始授课后，学员因故不能继续参加培训学习的，由学员个人向甲方申请，视情况办理培训费退费。退费金额不计入总收入进行合同分成。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">五、反商业贿赂条款</div>
                  <div>
                    <div class>
                      <span class="title-mark">（一）</span>
                      甲乙双方都清楚并愿意严格遵守中华人民共和国反商业贿赂的法律规定，双方都清楚任何形式的贿赂和贪渎行为都将触犯法律，并将受到法律的严惩。
                    </div>
                    <div class>
                      <span class="title-mark">（二）</span>
                      甲方或乙方均不得向对方或对方经办人或其他相关人员索要、收受、提供、给予合同约定外的任何利益，包括但不限于明扣、暗扣、现金、购物卡、实物、有价证券、旅游或其他非物质性利益等，但如该等利益属于合法收益，则须在合同中明示。
                    </div>
                    <div class>
                      <span class="title-mark">（三）</span>
                      甲方反对乙方或乙方经办人员为了本合同之目的与本合同以外的任何第三方发生本条款第二条所列示的任何一种行为，该等行为都是违反国家法律的行为，并将受到国家法律的惩处。
                    </div>
                    <div class>
                      <span class="title-mark">（四）</span>
                      本条所称“其他相关人员”是指甲乙方经办人以外的与合同有直接或间接利益关系的人员，包括但不仅限于合同经办人的亲友。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">六、违约责任</div>
                  <div>
                    <div class>
                      协议执行期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约，由违约方承担本次约定培训费用
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.wyjbl}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.wyjbl!==showData.wyjbl)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.wyjbl}}</span>
                      %的违约金。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">七、其他</div>
                  <div>
                    <div class>
                      <span class="title-mark">（一）</span>
                      双方通讯地址如下，履行本协议事关法定地址的事项按以下地址执行：
                    </div>
                    <div class>
                      <div>1.甲方：</div>
                      <div>
                        联系地址：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_dz }}</span>
                        <span
                          v-if="checkShow&&(proConfig.ruc_info.address!==showData.jf_dz)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proConfig.ruc_info.address }}</span>
                        （详细到街道、门牌号），
                      </div>
                      <div>
                        邮编：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_yb }}</span>
                        <span
                          v-if="checkShow&&(proConfig.ruc_info.zip_code!==showData.jf_yb)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proConfig.ruc_info.zip_code }}</span>，
                      </div>
                      <div>
                        具体联系人：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_lxr }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.user!==showData.jf_lxr)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.user }}</span>
                        （姓名），
                      </div>
                      <div>
                        联系电话：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_lxdh}}</span>
                        <span
                          v-if="checkShow&&(proData_jb.tel!==showData.jf_lxdh)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.tel}}</span>。
                      </div>
                      <div>2.乙方：</div>
                      <div>
                        联系地址：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_dz }}</span>
                        <span
                          v-if="checkShow&&(proData_fz.yf_dz!==showData.yf_dz)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_fz.yf_dz }}</span>
                        （详细到街道、门牌号），
                      </div>
                      <div>
                        邮编：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_yb }}</span>
                        <span
                          v-if="checkShow&&(proData_fz.yf_yb!==showData.yf_yb)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_fz.yf_yb }}</span>，
                      </div>
                      <div>
                        具体联系人：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_lxr }}</span>
                        <span
                          v-if="checkShow&&(proData_fz.yf_lxr!==showData.yf_lxr)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_fz.yf_lxr }}</span>
                        （姓名），
                      </div>
                      <div>
                        联系电话：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_lxdh}}</span>
                        <span
                          v-if="checkShow&&(proData_fz.yf_lxdh!==showData.yf_lxdh)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_fz.yf_lxdh}}</span>。
                      </div>
                    </div>
                    <div class>
                      <span class="title-mark">（二）</span>
                      本协议自签订之日起生效，协议期限执行至培训结束时自动终止，但双方都有为完成本协议相关事项在协议终止后继续履行本协议项下相关义务，或继续配合的义务。
                    </div>
                    <div class>
                      <span class="title-mark">（三）</span>
                      本协议一式
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num1}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.xy_num1!==showData.xy_num1)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.xy_num1}}</span>
                      份，甲方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num2}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.xy_num2!==showData.xy_num2)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.xy_num2}}</span>
                      份，乙方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num3}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.xy_num3!==showData.xy_num3)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.xy_num3}}</span>
                      份，经双方代表签字并加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
                    </div>
                    <div class>
                      <span class="title-mark">（四）</span>
                      如发生争议，应协商解决；协议不成的，提交北京仲裁委员会仲裁解决。
                    </div>
                    <div class>
                      <div class="content-specific">
                        <span class="title-mark">（五）</span>本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议培训班实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。
                      </div>
                      <div>变更条款如下：（若无变更条款，请填写“无”。）</div>
                      <div>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.bgtk?showData.bgtk:'无'}}</span>
                      </div>
                    </div>
                    <div class>
                      <div>
                        <span class="title-mark">（六）</span>协议未尽事宜，经双方友好协商达成一致，可订立补充条款作为本协议的附件或订立补充协议。
                      </div>
                      <div>补充条款如下：（若无补充条款，请填写“无”。）</div>
                      <div>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.bctk?showData.bctk:'无'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">八、附件</div>
                  <div>
                    <div class>
                      <ul class>
                        <template v-if="is_college3">
                          <li>
                            <span class="info-val">1、乙方资质文件复印件（含营业执照复印件与法人代表身份证复印件）</span>
                          </li>
                          <template v-if="showData.attachment&&showData.attachment.length">
                            <li v-for="(item,index) in showData.attachment" :key="index">
                              <a :href="lookUrl + '/'+item.code" target="_blank">
                                <span class="info-val" :class="{'check-val':checkShow}">
                                  {{ index+2}}、{{ item.origin_name }}
                                  <span
                                    class="no-print"
                                    style="font-weight: bold"
                                  >【点击查看】</span>
                                </span>
                              </a>
                            </li>
                          </template>
                          <li v-else>
                            <span class="info-val">2、（无其他附件）</span>
                          </li>
                        </template>
                        <template v-else>
                          <li>
                            <span class="info-val">1、中国人民大学授权委托书</span>
                          </li>
                          <li>
                            <span class="info-val">2、培训承办单位承诺书</span>
                          </li>
                          <li>
                            <span class="info-val">3、乙方资质文件复印件（含营业执照复印件与法人代表身份证复印件）</span>
                          </li>
                          <template v-if="showData.attachment&&showData.attachment.length">
                            <li v-for="(item,index) in showData.attachment" :key="index">
                              <a :href="lookUrl + '/'+item.code" target="_blank">
                                <span class="info-val" :class="{'check-val':checkShow}">
                                  {{ index+4}}、{{ item.origin_name }}
                                  <span
                                    class="no-print"
                                    style="font-weight: bold"
                                  >【点击查看】</span>
                                </span>
                              </a>
                            </li>
                          </template>
                          <li v-else>
                            <span class="info-val">4、（无其他附件）</span>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!checkShow" class="content-annotation">（以下无正文）</div>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div
                v-if="!checkShow"
                class="content-annotation"
                style="margin-bottom: 80px"
              >（本页无正文，为本协议签署页）</div>
            </div>
            <div v-if="!is_modListText" class="assist-content-foot">
              <!--审核-->
              <template v-if="checkShow">
                <el-form :model="form" label-width="200px">
                  <template v-if="!is_signed.status">
                    <el-form-item label="辅助协议审核结果：">
                      <el-radio-group v-model="form.status">
                        <el-radio :label="3">审核通过</el-radio>
                        <el-radio :label="2">审核不通过</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      v-if="form.status===2"
                      label="审核不通过原因："
                      :rules="[{required:true}]"
                    >
                      <el-input type="textarea" v-model.trim="form.content" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click.native="backList">返 回</el-button>
                      <el-button type="primary" @click.native="handleSubmit">确 定</el-button>
                    </el-form-item>
                  </template>
                  <el-form-item v-else>
                    <el-button @click.native="backList">返 回</el-button>
                    <el-button type="primary" @click.native="handleSigned">复核</el-button>
                  </el-form-item>
                </el-form>
              </template>
              <!--落款-->
              <div class="foot-inscribe" v-else>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div
                      class="grid-content bg-purple foot-inscribe-item clearfix"
                      style="position: relative"
                    >
                      <span class="fl">甲方（盖章）：</span>
                      <span
                        class
                        style="width: 158px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >
                        <template>
                          中国人民大学
                          <br>
                          {{ is_college3?showData.college:''}}
                        </template>
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      class="grid-content bg-purple foot-inscribe-item clearfix"
                      style="position: relative"
                    >
                      <span class="fl">乙方（盖章）：</span>
                      <span
                        class
                        style="width: 200px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >{{ showData.yf_dwmc }}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      <template v-if="is_college3">
                        <span style="display:inline-block;line-height: 20px">
                          法定代表人
                          <br>或授权代理人：
                        </span>
                        <span class="foot-inscribe-line" style="width: 152px"></span>
                      </template>
                      <template v-else>
                        <div style="padding-top: 10px">
                          <span>授权代理人：</span>
                          <span class="foot-inscribe-line" style="width: 170px"></span>
                        </div>
                      </template>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      <span style="display:inline-block;line-height: 20px">
                        法定代表人
                        <br>或授权代理人：
                      </span>
                      <span class="foot-inscribe-line" style="width: 192px"></span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      日期：
                      <span class="foot-inscribe-line" style="width: 218px"></span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      日期：
                      <span class="foot-inscribe-line" style="width: 240px"></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="(!checkShow)&&(!is_college3)&&(!is_modListText)" class>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class>
                <h3 style="margin-bottom: 20px">附件1：</h3>
                <div>
                  <img
                    :src="showData.create_time ? `${ URL }/static/images/wt_${ new Date(showData.create_time * 1000).getFullYear() }.jpg` : ''"
                    alt style="width: 100%">
                </div>
              </div>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class>
                <h3 style="margin-bottom: 40px">附件2：</h3>
                <div class="commitment-content">
                  <h2 style="text-align: center" class>培训承办单位承诺书</h2>
                  <div class>
                    <div>
                      <span class="title-mark">继续教育处：</span>
                    </div>
                    <div class="shrink-section">
                      <div class>
                        “{{ showData.pro_name }}”（培项字：
                        <template
                          v-for="(item,key,index) in proConfig.pxlx"
                        >
                          <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                        </template>
                        {{ showData.pro_code }}）由我单位对乙方辅助单位实施全过程管理，对于培训班所涉及的管理责任和经济责任已经我单位认真研究并经我单位党政联席会议讨论通过。我单位承诺按照学校有关规定与乙方辅助单位一起认真做好此次协议议定的培训宣传、招生、组织、教学等有关工作，服从学校管理，为受训单位和受训学员提供高水平的培训服务。
                      </div>
                      <div class>协议签订后，我单位将作为责任主体主动承担由此培训班产生的经济和社会责任。</div>
                    </div>
                  </div>
                  <div style="margin-top: 50px">
                    <div style="text-align: right">
                      甲方下属培训承办单位（盖章）：
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
              </div>
            </div>
          </div>
        </template>
        <!--版本二-->
        <template v-else>
          <div style="padding: 0 40px" class="print-content">
            <!--头部-->
            <div class="assist-content-head">
              <el-row>
                <el-col :span="12" :offset="6">
                  <header class>
                    <div class="assist-content-head-title">
                      <div style="font-weight: bold;font-size: 18px">培训辅助工作协议书</div>
                      <div v-if="showData.status!==3">（草稿）</div>
                    </div>
                    <div class="assist-content-head-sub-title">（{{ isYXB ? '在职课程培训班' : '非学历非学位教育培训' }}）</div>
                  </header>
                </el-col>
                <el-col :span="6">
                  <div v-if="!is_modListText" class="header-right">
                    <div class="right-code-img">
                      <img :src="imgUrl" alt style="height: 100%">
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div v-if="!is_modListText" class="right-num">
                协议管理编码：
                <span class="tip-red">{{ showData.contract_code?showData.contract_code:'审核通过后生成'}}</span>
              </div>
            </div>
            <!--内容-->
            <div class="assist-content-body">
              <div v-if="checkShow" class="content-annotation">
                （以下
                <span class="tip-red">红色区域</span>为项目辅助协议填写信息
                <span class="check-compare">（绿色区域为协议不同于立项前的信息）</span>，请认真审核！）
              </div>
              <!---->
              <div class="content-body-head">
                <div class="module-bottom ja-yi">
                  <div class>
                    <div>
                      <span class="title-mark">甲方：</span>
                      <span
                        class="info-val info-val-ver2"
                        :class="{'check-val':checkShow}"
                      >中国人民大学{{ is_college3?showData.college:''}}</span>
                    </div>
                    <div>
                      联系地址：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_dz }}</span>
                      <span
                        v-if="checkShow&&(proConfig.ruc_info.address!==showData.jf_dz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proConfig.ruc_info.address }}</span>
                      （详细到街道、门牌号），
                    </div>
                    <div>
                      邮编：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_yb }}</span>
                      <span
                        v-if="checkShow&&(proConfig.ruc_info.zip_code!==showData.jf_yb)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proConfig.ruc_info.zip_code }}</span>，
                    </div>
                    <div>
                      具体联系人：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_lxr }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.user!==showData.jf_lxr)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.user }}</span>
                      （姓名），
                    </div>
                    <div>
                      联系电话：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_lxdh}}</span>
                      <span
                        v-if="checkShow&&(proData_jb.tel!==showData.jf_lxdh)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.tel}}</span>。
                    </div>
                  </div>
                  <div class>
                    <div>
                      <span class="title-mark">乙方：</span>
                      <span
                        class="info-val info-val-ver2"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_dwmc }}</span>
                    </div>
                    <div>
                      联系地址：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_dz }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_dz!==showData.yf_dz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_dz }}</span>
                      （详细到街道、门牌号），
                    </div>
                    <div>
                      邮编：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_yb }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_yb!==showData.yf_yb)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_yb }}</span>，
                    </div>
                    <div>
                      具体联系人：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_lxr }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_lxr!==showData.yf_lxr)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_lxr }}</span>
                      （姓名），
                    </div>
                    <div>
                      联系电话：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_lxdh}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_lxdh!==showData.yf_lxdh)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_lxdh}}</span>。
                    </div>
                  </div>
                </div>
                <div class="module-bottom shrink-section">
                  本着真诚合作、互利共赢、权利明确的原则，经友好商协，甲方与乙方就“
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.pro_name }}</span>
                  <span
                    v-if="checkShow&&(proData_jb.pro_name!==showData.pro_name)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_jb.pro_name }}</span>
                  ”（培项字：
                  <template v-if="isYXB">
                    课
                    <template>({{ proData_jb.province && proData_jb.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                    <template>(辅)</template>
                  </template>
                  <template v-else>
                    <template v-for="(item,key,index) in proConfig.pxlx">
                      <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                    </template>
                  </template>
                  {{ showData.pro_code }}）培训辅助工作的委托协作达成如下协议，约定如下：
                </div>
              </div>
              <!---->
              <div class="shrink-section">
                <div class="module-bottom">
                  <div class="title-mark">一、委托协作具体内容</div>
                  <div class>
                    <div class>
                      <span class="title-mark">（一）</span>双方协作举办“
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.pro_name }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.pro_name!==showData.pro_name)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.pro_name }}</span>
                      ”，
                      计划举办
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jhjbqs }}</span>
                      <span
                        v-if="checkShow&&(1!==showData.jhjbqs)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{1}}</span>
                      期，
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jhmqrs }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.zsrs!==showData.jhmqrs)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.zsrs }}</span>
                      人/期。
                    </div>
                    <div class>
                      <div v-if="showData.zs_type===2">
                        <span class="title-mark">（二）</span>{{ isYXB ? '课程班' : '培训班' }}招生时间为：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.zs_start_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.zs_start_time!==showData.zs_start_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.zs_start_time | TimestampChangeFilter(true) }}</span>
                        至
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.zs_end_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.zs_end_time!==showData.zs_end_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.zs_end_time | TimestampChangeFilter(true) }}</span>
                        。
                      </div>
                      <div>
                        <span v-if="showData.zs_type!==2" class="title-mark">（二）</span>{{ isYXB ? '课程班' : '培训班' }}班举办时间（具体{{ isYXB ? '' : '培训' }}授课时间）为：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.px_start_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.px_start_time!==showData.px_start_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.px_start_time | TimestampChangeFilter(true) }}</span>
                        至
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.px_end_time | TimestampChangeFilter(true) }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.px_end_time!==showData.px_end_time)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.px_end_time | TimestampChangeFilter(true) }}</span>
                        。
                      </div>
                    </div>
                    <div class>
                      <span class="title-mark">（三）</span>该班在
                      <span class="info-val" :class="{'check-val':checkShow}">{{ showData.pxdd }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.pxdd!==showData.pxdd)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.pxdd }}</span>
                      (地点)授课。
                    </div>
                    <div class>
                      <span class="title-mark">（四）</span>{{ isYXB ? '授课' : '培训' }}内容和课程安排，以及举办多期{{ isYXB ? '课程班' : '培训' }}的时间、地点、人数安排等详细计划如下：
                    </div>
                    <div class style="text-indent: 0;padding-left: 50px">
                      <div class="font-line" :class="{'font-line-check':checkShow}">
                        <span style ref="pxap" class></span>
                      </div>
                      <div
                        v-if="checkShow&&(proData_fz.pxap!==showData.pxap)"
                        class="font-line"
                        :class="{'font-line-check-compare':checkShow}"
                      >
                        <span style ref="pxap0" class></span>
                      </div>
                    </div>
                    <div class>
                      <span class="title-mark">（五）</span>协作双方的具体分工：
                    </div>
                    <div class>
                      1.甲方负责该{{ isYXB ? '' : '培训' }}项目的课程设置、教师选用，以及：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_fzgz }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.jf_fzgz!==showData.jf_fzgz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.jf_fzgz }}</span>
                    </div>
                    <div class>
                      2.乙方负责：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_fzgz }}</span>
                      <span
                        v-if="checkShow&&(proData_fz.yf_fzgz!==showData.yf_fzgz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.yf_fzgz }}</span>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">二、双方权利与义务</div>
                  <div>
                    <div>
                      <div>
                        <span class="title-mark">（一）</span>甲乙双方经友好协商，共同遵守以下约定
                      </div>
                      <div>
                        <div
                          class
                        >1.甲乙双方在协议执行中，应采取友好协作、相互配合的态度，本协议签订后对协议事项有变动或需更改有关条款的，需签订补充协议或另行签订协议。</div>
                        <div class>
                          <div>2.在本协议实施过程中和本协议履行完毕后，双方均不得使用、传播或公开在履行本项目过程中得到的对方商业秘密。具体要求如下：</div>
                          <div>
                            <div
                              class
                            >（1）甲乙双方对本协议的内容，以及在本协议履行过程中获得的对方的信息，均负有保密的义务。除甲乙双方另有约定外，保密信息包括但不限于本协议报价、协议文本以及双方标有保密字样的往来文件。</div>
                            <div
                              class
                            >（2）在未经对方书面同意前，任何一方不得将本协议及相关内容用于任何与其执行本协议无关的情况；或以任何形式向本协议以外的第三方泄漏，双方均有义务尽其一切努力防止本协议以外的他方窃取秘密信息。由于任何一方违反以上保密义务给对方造成损失，违约方对受损失方负有停止侵害、消除影响、赔偿损失的责任。</div>
                            <div class>（3）本条项下的保密义务在本协议中止或终止后依然有效。</div>
                          </div>
                        </div>
                        <div
                          class
                        >3.在招生过程中，甲、乙双方均不得向学员承诺或暗示本{{ isYXB ? '' : '培训' }}项目与学历、学位有关，要明确向学员说明非学历、非学位教育培训项目与正规全日制学历教育的区别。不得在招生宣传和材料中出现“注册”、“学籍管理”、“学费”、“本科生待遇（研究生待遇）”“获得学历（学位）”等容易让学员混淆和误解的用语。</div>
                        <div
                          class
                        >4.甲乙双方不得借由举办{{ isYXB ? '课程班' : '培训班' }}的机会向学员集资、融资，不得向学员推荐投资项目。不得以此{{ isYXB ? '课程班' : '培训班' }}之名义，与任何机构和个人签订任何涉金融业务的合同。</div>
                        <div class>5.甲乙双方不得招收领导干部就读收费标准较高的{{ isYXB ? '课程班' : '培训班' }}。</div>
                        <div class>6.甲乙双方不得在{{ isYXB ? '课程班' : '培训班' }}举办过程中，为学员安排旅游活动。</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <span class="title-mark">（二）</span>甲方的权利与义务
                      </div>
                      <div>
                        <template v-if="!is_college3">
                          <div
                            class="content-specific"
                            style="font-weight: bold"
                          >1.按照《中国人民大学合同管理办法（修订）》要求，中国人民大学授权中国人民大学继续教育处代表学校作为甲方审核并签订此{{ isYXB ? '' : '培训' }}工作协议。合同由继续教育处负责人签署，加盖“中国人民大学合同专用章（9）”。（授权委托书见附件1）</div>
                          <div class="content-specific" style="font-weight: bold">
                            2.本协议所议{{ isYXB ? '课程班' : '培训班' }}，具体由甲方下属中国人民大学
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            承办，
                            具体协议经济责任主要由
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            与甲方议定，
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            向中国人民大学继续教育处签定《{{ isYXB ? '课程班' : '培训' }}承办单位承诺书》（具体格式见附件2）后代表学校行使甲方权利、履行甲方义务与责任。
                          </div>
                        </template>
                        <div class>{{ is_college3?1:3}}.负责制定本{{ isYXB ? '' : '培训' }}项目的整体培养方案，对于{{ isYXB ? '' : '培训的' }}课程设置和教师安排，甲方具有最终决定权。</div>
                        <div
                          class
                        >{{ is_college3?2:4}}.负责为乙方提供招生宣传资料并对乙方发布的招生信息进行审核，对于乙方违反国家政策法规和学校规定的招生宣传活动，有权要求乙方更改或撤销，情节严重的可中止与乙方的合作，乙方负全责。</div>
                        <div
                          class
                        >{{ is_college3?3:5}}.有权对乙方推荐或代招的学员依照规定进行学习资格审查，对于不符合招收规定的学员有权拒收，拒收学员不计为财务分成依据。</div>
                        <div class>{{ is_college3?4:6}}.负责监督或组织现场教学活动并进行教学管理。</div>
                        <div>{{ is_college3?5:7}}.学员费用必须由受训单位或学员直接向甲方账户交付，甲方负责办理校内财务结算手续，并在中国人民大学财务管理部门办理与乙方的财务分成。</div>
                        <div class>{{ is_college3?6:8}}.{{ isYXB ? '课程' : '培训' }}结束时，为完成{{ isYXB ? '' : '培训' }}学习任务的学员向中国人民大学有关部门申领并颁发结业证书。</div>
                        <div class>{{ is_college3?7:9}}.不得指派校外人员办理中国人民大学校内立项、租借、结算等各种行政手续。</div>
                        <div class>{{ is_college3?9:10}}.不向乙方提供中国人民大学域名建立招生网站。</div>
                        <div class>{{ is_college3?9:11}}.不为乙方的办公和招生工作提供中国人民大学校内办公和教学场地。</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <span class="title-mark">（三）</span>乙方的权利与义务
                      </div>
                      <div>
                        <div
                          class
                        >1.乙方承诺严格遵守中国人民大学各项规章制度，愿意接受甲方继续教育有关管理部门对{{ isYXB ? '课程班' : '培训班' }}的全流程管理。如有违规，愿意按照甲方规定接受处罚。</div>
                        <div
                          class
                        >2.乙方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他与甲方无关的{{ isYXB ? '' : '培训' }}项目中继续利用甲方进行{{ isYXB ? '' : '培训' }}宣传和招生，但可进行正常的新闻报道。</div>
                        <div class>3.乙方关于本教育{{ isYXB ? '' : '培训' }}项目所作的任何宣传，需以甲方提供的宣传资料为基础，不得向学员夸大宣传、虚假承诺。</div>
                        <div
                          class
                        >4.乙方必须在本协议列明的授权范围内办理协作事宜，除非有合理理由，对于超越权限的事务，甲方拒绝接受或承认，由此产生的责任由乙方负责；乙方必须及时处理合作事宜，除非有合理理由，对于延迟办理某项事务造成的损失，乙方应向甲方承担赔偿责任。</div>
                        <div class>5.乙方可以对{{ isYXB ? '' : '培训' }}课程的设计、招生和教学等工作提出建议。</div>
                        <div class>6.乙方开展协议约定的工作，并按协议约定取得相应报酬。</div>
                        <div class>7.甲方将乙方依据本协议应分的合法收入交付乙方后, 乙方必须为分成款出具正规并符合甲方要求的发票。</div>
                        <div class>8.尊重和保护甲方的知识产权，即使在协议中止或终止后。</div>
                        <div>9.{{ isYXB ? '课程班' : '培训班' }}招生与举办过程中，学员应直接向甲方报名，如有直接联系乙方报名的学员，乙方须在确认学员意向后，将所招收的学员名单、通讯方式、付款方式等信息完全提供给甲方，以确保服务流程的完整性。</div>
                        <div>10.学员交纳的{{ isYXB ? '' : '培训' }}费用，必须由受训单位或学员直接向甲方账户交付，乙方不得代收{{ isYXB ? '费用' : '培训费' }}。乙方不得借由与甲方合作，在招生和办学过程中向学员收取协议规定的{{ isYXB ? '' : '培训' }}费用之外的任何费用。</div>
                        <div>11.乙方机构和人员不得在合作过程中冒充中国人民大学下属单位和职工。不得假冒甲方机构和人员对外宣传和招生，在招生过程中必须向学员明示自己辅助{{ isYXB ? '' : '培训' }}单位的真实身份。</div>
                        <div>12.不经中国人民大学有关管理部门同意，不得随意使用中国人民大学形象识别系统（校名、校徽等）。</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">三、项目费用及付款</div>
                  <div>
                    <div class>
                      <div>
                        <span class="title-mark">（一）</span>该{{ isYXB ? '' : '培训' }}项目收费标准为
                      </div>
                      <div class>
                        <div v-if="showData.ks_charge===2">
                          按照课时或模块支付，具体收费方式为：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.specific_rate }}</span>
                          <span
                            v-if="checkShow&&(proData_jb.specific_rate!==showData.specific_rate)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_jb.specific_rate }}</span>
                        </div>
                        <template v-else>
                          <div v-if="showData.sfbz===1">
                            委托单位统一支付
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_dw }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.sfbz_dw!==showData.sfbz_dw)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.sfbz_dw }}</span>
                            元，（大写：
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_dw>0?showData.sfbz_dw_dx:'零圆'}}</span> 。）
                          </div>
                          <div v-if="showData.sfbz===2">
                            受训学员自行按照
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_xy }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.sfbz_xy!==showData.sfbz_xy)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.sfbz_xy }}</span>
                            元/人标准支付，大写：
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_xy>0?showData.sfbz_xy_dx:'零圆'}}</span>。
                          </div>
                          <div v-if="showData.sfbz===3">
                            委托单位统一支付
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_dw }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.sfbz_dw!==showData.sfbz_dw)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.sfbz_dw }}</span>
                            元（大写：
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_dw>0?showData.sfbz_dw_dx:'零圆'}}</span> ），
                            学员按照
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_xy }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.sfbz_xy!==showData.sfbz_xy)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.sfbz_xy }}</span>
                            元/人标准（大写：
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_xy>0?showData.sfbz_xy_dx:'零圆'}}</span> ）支付剩余部分。
                          </div>
                        </template>
                      </div>
                      <div class>上述{{ isYXB ? '费用' : '培训费' }}具体包含以下用途和项目：</div>
                      <div class>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.pxfy_desc }}</span>
                        <div v-if="checkShow&&(proData_jb.pxfy_desc!==showData.pxfy_desc)">
                          <span
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_jb.pxfy_desc }}</span>
                        </div>
                      </div>
                    </div>
                    <div class>
                      <div>
                        <span class="title-mark">（二）</span>{{ isYXB ? '费用' : '培训费' }}交付方式
                      </div>
                      <div v-if="isYXB">个人账户缴费的学员应通过“人大培训网”课程班的收费链接进行网上缴费至甲方账户，委托单位的款项直接汇款至甲方指定的银行账户,甲方负责按规定开具等额有效票据。</div>
                      <div v-else>零散招收的学员应通过“中国人民大学收费管理服务系统”进行网上交费或直接汇款至甲方指定的银行账户，委托单位的培训费用直接汇款至甲方指定的银行账户,甲方负责按规定开具等额有效发票。</div>
                      <div class>
                        <div>1.人民币汇款信息：</div>
                        <div>收款人全称：中国人民大学{{ is_college3?showData.college:''}}；</div>
                        <div>收款人账号： {{ zh}} ；</div>
                        <div>收款人开户银行： {{ khh}} ;</div>
                        <div>汇款备注栏中必须注明收款学院和{{ isYXB ? '' : '培训' }}项目名称。</div>
                        <template v-if="!is_college3">
                          <div>2.外币业务汇款信息：</div>
                          <div>BANK NAME（银行名称）： BANK OF CHINA BEIJING BRANCH RENDA SUB BRANCH / 中国银行北京人大支行</div>
                          <div>BENEFICIARY’S BANK ADDRESS（收款人银行地址）：NO.2 ChaoyangMenNei Da jie,Dongcheng District,Beijing 100010,China / 北京市东城区朝阳门内大街2号</div>
                          <div>A/C HOLDER’S NAME （收款人账户名称）：RENMIN UNIVERSITY OF CHINA / 中国人民大学</div>
                          <div>BENEFICIARY’S ADDRESS（收款人地址）：NO.59,Zhongguancun Street,Haidian Dist., Beijing100872,China / 北京市海淀区中关村大街59号</div>
                          <div>A/C NO.（账号）： 3194 5603 1681</div>
                          <div>SWIFT CODE（银行清算代码）：BKCHCNBJ110</div>
                        </template>
                      </div>
                    </div>
                    <template v-if="!isYXB && (fz202101 > proData_jb.create_time * 1000)">
                      <div class>
                        <div>
                          <span class="title-mark">（三）</span>承担与收益
                        </div>
                        <div class>
                          1.乙方承担本次{{ isYXB ? '课程班' : '培训' }}的辅助工作，负责以下费用的支出：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.yf_fyzc }}</span>
                          <span
                            v-if="checkShow&&(proData_fz.yf_fyzc!==showData.yf_fyzc)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_fz.yf_fyzc }}</span>。
                        </div>
                        <div class>
                          <div>
                            2.依据乙方承担的上述辅助工作和费用支出，乙方获得的{{ isYXB ? '计划' : '总' }}分成比例为
                            <span class="info-val" :class="{'check-val':checkShow}" >{{ showData.yf_fcbl}} {{ isYXB && (showData.yf_fcbl || 0) > -1 ? '%' : '' }}</span>
                            <span v-if="checkShow && (proData_fz.yf_fcbl != showData.yf_fcbl)"
                              class="info-val" :class="{'check-compare':checkShow}">
                              {{ proData_fz.yf_fcbl}}{{ isYXB && (proData_fz.yf_fcbl || 0) > -1 ? '%' : '' }}
                            </span>
                            <template v-if="isYXB">，具体分成核算方法为：
                              <span class="info-val" :class="{'check-val': checkShow}">{{ showData.yf_fzjtfc }}</span>
                              <span v-if="checkShow && (proData_fz.yf_fzjtfc !== showData.yf_fzjtfc)"
                                class="info-val" :class="{'check-compare': checkShow}">{{ proData_fz.yf_fzjtfc }}</span>
                            </template>。
                          </div>
                          <div>同时，乙方承诺遵守中国人民大学教育培训有关考核规定，对于办班过程中乙方出现的违规行为，双方同意视乙方合规情况调整分成比例。</div>
                          <div>
                            <div>（1）当出现以下情况之一时，乙方分成款调减50%，情节严重的不予分成，{{ isYXB ? '费用' : '培训费' }}全额收归甲方学校账户：</div>
                            <div>
                              <div>乙方擅自更改经学校和学院审定的招生简章进行虚假宣传；</div>
                              <div>乙方违规转移、下放招生的职责和权利（发展招生下线）；</div>
                              <div>乙方冒充甲方校内机构和人员招生宣传；</div>
                              <div>乙方借辅助{{ isYXB ? '课程班' : '培训' }}之机，以甲方之名在协议议定的{{ isYXB ? '课程班' : '培训班' }}之外搭车办班；</div>
                              <div>乙方恶意诋毁和攻击校内其他培训项目；</div>
                              <div>乙方违规多收{{ isYXB ? '费用' : '培训费' }}，多收部分收归甲方处理，并按上述分成方案调整分成；</div>
                              <div>乙方擅自为学员打折，从应分分成款中扣除打折部分，并按上述分成方案调整分成；</div>
                              <div>乙方代收代缴或坐收坐支学员{{ isYXB ? '费用' : '培训费' }}，加罚代收部分利息，并按上述分成方案调整分成。</div>
                            </div>
                          </div>
                          <div>
                            <div>（2）当出现以下情形之一时，{{ isYXB ? '费用' : '培训费' }}全额收归甲方学校账户，不予分成：</div>
                            <div>
                              <div>乙方冒充甲方机构和人员从事侵权和违法活动；</div>
                              <div>乙方借举办{{ isYXB ? '课程班' : '培训班' }}之机向学员集资、融资，向学员推荐投资项目。</div>
                              <div>其他违规事项，双方另行商议处罚方式和分成方式。</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <template v-if="isYXB">
                            3. 按照中国人民大学教育培训有关管理规定，甲方将保留乙方应分分成款
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.wg_bili || 0 }}</span>
                            <span
                              v-if="checkShow&&(proData_fz.wg_bili !== showData.wg_bili)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_fz.wg_bili || 0 }}</span>%，
                            待课程班全部结束后依据乙方完成辅助工作的合规情况决定是否支付。因此，甲方将分
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.yf_fqs }}</span>
                            <span
                              v-if="checkShow&&(proData_fz.yf_fqs!==showData.yf_fqs)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_fz.yf_fqs }}</span>
                            期向乙方拨付分成款，具体付款时间为：
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.yf_fqs_time }}</span>
                            <span
                              v-if="checkShow&&(proData_fz.yf_fqs_time!==showData.yf_fqs_time)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_fz.yf_fqs_time }}</span>
                          </template>
                          <template v-else>
                            3. 甲方分
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.yf_fqs }}</span>
                            <span
                              v-if="checkShow&&(proData_fz.yf_fqs!==showData.yf_fqs)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_fz.yf_fqs }}</span>
                            期向乙方拨付分成款，具体付款时间为：
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.yf_fqs_time }}</span>
                            <span
                              v-if="checkShow&&(proData_fz.yf_fqs_time!==showData.yf_fqs_time)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_fz.yf_fqs_time }}</span>
                          </template>
                        </div>
                        <div>
                          4.乙方收款账户信息（账户名称、账号、开户行，收款账户名称必须与乙方单位名称一致）：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >
                            账户名称：{{ showData.yf_dwmc }}；
                            账号：{{ showData.yf_yhzh}}；
                            开户行：{{ showData.yf_khh}}。
                          </span>
                          <template v-if="checkShow">
                            <span
                              v-if="(proData_fz.yf_dwmc!==showData.yf_dwmc)||(proData_fz.yf_yhzh!==showData.yf_yhzh)||(proData_fz.yf_khh!==showData.yf_khh)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >
                              账户名称：{{ proData_fz.yf_dwmc }}；
                              账号：{{ proData_fz.yf_yhzh}}；
                              开户行：{{ proData_fz.yf_khh}}。
                            </span>
                          </template>
                        </div>
                        <div v-if="isYXB">
                          5.课程班正式开始授课后，学员因故不能继续参加学习的，由学员个人向甲方申请，视情况办理退费。退费金额不计入总收入进行分成。
                          <div>
                            6.所有乙方协助招收的学员，必须使用“人大培训网”提供的乙方专有项目收费链接收取培训费，并以此为依据核算其招生人数和分成金额，通过汇款、现金、现场刷卡等特殊形式缴费的个人汇款，一律认定为自办招生，不予计入乙方分成人数。
                          </div>
                        </div>
                      </div>
                      <div v-if="!isYXB">
                        <span class="title-mark">（四）</span>培训班正式开始授课后，学员因故不能继续参加培训学习的，由学员个人向甲方申请，视情况办理培训费退费。退费金额不计入总收入进行分成。
                      </div>
                    </template>
                    <template v-else>
                      <div class>
                        <div>
                          <span class="title-mark">（三）</span>承担与收益
                        </div>
                        <div class>
                          1.乙方承担本次{{ isYXB ? '课程班' : '培训' }}的辅助工作，负责以下费用的支出：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.yf_fyzc }}</span>
                          <span
                            v-if="checkShow&&(proData_fz.yf_fyzc!==showData.yf_fyzc)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_fz.yf_fyzc }}</span>。
                        </div>
                        <div class>
                          <div>
                            2.依据乙方承担的上述辅助工作和费用支出，乙方获得的{{ isYXB ? '计划' : '' }}分成比例为
                            <span class="info-val" :class="{'check-val':checkShow}" >{{ showData.yf_fcbl}} {{ (showData.yf_fcbl || 0) > -1 ? '%' : '' }}</span>
                            <span v-if="checkShow && (proData_fz.yf_fcbl != showData.yf_fcbl)"
                              class="info-val" :class="{'check-compare':checkShow}">
                              {{ proData_fz.yf_fcbl}}{{ (proData_fz.yf_fcbl || 0) > -1 ? '%' : '' }}
                            </span>
                            <div>具体分成核算方法为：
                              <span class="info-val" :class="{'check-val': checkShow}">{{ showData.yf_fzjtfc }}</span>
                              <span v-if="checkShow && (proData_fz.yf_fzjtfc !== showData.yf_fzjtfc)"
                                class="info-val" :class="{'check-compare': checkShow}">{{ proData_fz.yf_fzjtfc }}</span>
                            </div>
                          </div>
                          <div>同时，乙方承诺遵守中国人民大学教育培训有关考核规定，同意甲方视乙方在以下方面的合规情况调减实际分成比例和分成金额：</div>
                          <div>
                            <div>（1）当出现以下情况之一时，乙方分成款调减50%，情节严重的不予分成，分成款全额收归甲方学校账户：</div>
                            <div>
                              <div>乙方擅自更改经学校和学院审定的招生简章进行虚假宣传；</div>
                              <div>乙方擅自在甲方批复允许的{{ isYXB ? '课程班' : '培训班' }}举办地之外的地点宣传招生和开班授课；</div>
                              <div>乙方违规转移、下放招生的职责和权利（发展招生下线）；</div>
                              <div>乙方冒充甲方校内机构和人员招生宣传；</div>
                              <div>乙方借辅助培训之机，以甲方之名在协议议定的{{ isYXB ? '课程班' : '培训班' }}之外搭车办班；</div>
                              <div>乙方恶意诋毁和攻击校内其他培训项目；</div>
                              <div>乙方擅自为学员打折，从应分分成款中扣除打折部分，并按上述分成方案调整分成；</div>
                              <div>乙方代收代缴或坐收坐支学员培训费，加罚代收部分利息，并按上述分成方案调整分成。</div>
                            </div>
                          </div>
                          <div>
                            <div>（2）当出现以下情形之一时，不予分成，分成款全额收归甲方学校账户：</div>
                            <div>
                              <div>乙方借{{ isYXB ? '课程班' : '培训班' }}之名违规收取任何其他费用，多收部分退还缴款人或缴款单位，应收部分不予分成；</div>
                              <div>乙方冒充甲方机构和人员从事侵权和违法活动；</div>
                              <div>乙方借举办{{ isYXB ? '课程班' : '培训班' }}之机向学员集资、融资，向学员推销商品、有偿服务和推荐投资项目。</div>
                            </div>
                          </div>
                          <div>
                            <div>（3）其他违规事项，双方另行商议处罚方式和分成方式。</div>
                          </div>
                        </div>
                        <div>
                          3. 按照中国人民大学教育培训有关管理规定，甲方将保留乙方应分分成款的
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.wg_bili || 0 }}</span>
                          <span
                            v-if="checkShow&&(proData_fz.wg_bili !== showData.wg_bili)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_fz.wg_bili || 0 }}</span>%，
                          待{{ isYXB ? '课程班' : '培训班' }}全部结束后依据乙方完成辅助工作的合规情况决定是否支付。因此，甲方将分
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.yf_fqs }}</span>
                          <span
                            v-if="checkShow&&(proData_fz.yf_fqs!==showData.yf_fqs)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_fz.yf_fqs }}</span>
                          期向乙方拨付分成款，具体付款时间为：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.yf_fqs_time }}</span>
                          <span
                            v-if="checkShow&&(proData_fz.yf_fqs_time!==showData.yf_fqs_time)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_fz.yf_fqs_time }}</span>
                        </div>
                        <div>
                          4.乙方收款账户信息（账户名称、账号、开户行，收款账户名称必须与乙方单位名称一致）：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >
                            账户名称：{{ showData.yf_dwmc }}；
                            账号：{{ showData.yf_yhzh}}；
                            开户行：{{ showData.yf_khh}}。
                          </span>
                          <template v-if="checkShow">
                            <span
                              v-if="(proData_fz.yf_dwmc!==showData.yf_dwmc)||(proData_fz.yf_yhzh!==showData.yf_yhzh)||(proData_fz.yf_khh!==showData.yf_khh)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >
                              账户名称：{{ proData_fz.yf_dwmc }}；
                              账号：{{ proData_fz.yf_yhzh}}；
                              开户行：{{ proData_fz.yf_khh}}。
                            </span>
                          </template>
                        </div>
                        <div>
                          5.{{ isYXB ? '课程班' : '培训班' }}正式开始授课后，学员因故不能继续参加学习的，由学员个人向甲方申请，按照{{ isYXB ? '课程班' : '培训班' }}举办单位有关规定办理培训费退费。退费金额不计入总收入，不为乙方进行分成；在退费前已经发生的分成金额，退费发生后，乙方应及时将退费部分的培训费分成款项退还甲方。
                          <div>
                            6.面向社会零散招生的{{ isYXB ? '课程班' : '培训班' }}，所有乙方协助招收的学员，必须使用“人大培训网”提供的乙方专有项目收费链接收取培训费，并以此为依据核算其招生人数和分成金额，通过汇款、现金、现场刷卡等其他形式缴费的个人培训费，不计入乙方分成。
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">四、反商业贿赂条款</div>
                  <div>
                    <div class>
                      <span class="title-mark">（一）</span>
                      甲乙双方都清楚并愿意严格遵守中华人民共和国反商业贿赂的法律规定，双方都清楚任何形式的贿赂和贪渎行为都将触犯法律，并将受到法律的严惩。
                    </div>
                    <div class>
                      <span class="title-mark">（二）</span>
                      甲方或乙方均不得向对方或对方经办人或其他相关人员索要、收受、提供、给予合同约定外的任何利益，包括但不限于明扣、暗扣、现金、购物卡、实物、有价证券、旅游或其他非物质性利益等，但如该等利益属于合法收益，则须在合同中明示。
                    </div>
                    <div class>
                      <span class="title-mark">（三）</span>
                      甲方反对乙方或乙方经办人员为了本合同之目的与本合同以外的任何第三方发生本条款第二条所列示的任何一种行为，该等行为都是违反国家法律的行为，并将受到国家法律的惩处。
                    </div>
                    <div class>
                      <span class="title-mark">（四）</span>
                      本条所称“其他相关人员”是指甲乙方经办人以外的与合同有直接或间接利益关系的人员，包括但不仅限于合同经办人的亲友。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">五、违约责任</div>
                  <div>
                    <div class>
                      协议执行期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约，由违约方承担本次约定{{ isYXB ? '授课' : '培训' }}费用
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.wyjbl}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.wyjbl!==showData.wyjbl)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.wyjbl}}</span>
                      %的违约金。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">六、合作期限</div>
                  <div>本协议自签订之日起生效，协议期限执行至{{ isYXB ? '课程班' : '培训' }}结束时自动终止，但双方都有为完成本协议相关事项在协议终止后继续履行本协议项下相关义务，或继续配合的义务。</div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">七、合同效力</div>
                  <div>
                    <div class>
                      <span class="title-mark">（一）</span>
                      本协议一式
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num1}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.xy_num1!==showData.xy_num1)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.xy_num1}}</span>
                      份，甲方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num2}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.xy_num2!==showData.xy_num2)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.xy_num2}}</span>
                      份，乙方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num3}}</span>
                      <span
                        v-if="checkShow&&(proData_fz.xy_num3!==showData.xy_num3)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_fz.xy_num3}}</span>
                      份，经双方代表签字并加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
                    </div>
                    <div class>
                      <span class="title-mark">（二）</span>
                      如发生争议，应协商解决；协议不成的，提交北京仲裁委员会仲裁解决。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">八、合同条款修改</div>
                  <div>
                    <div class>
                      <div
                        class="content-specific"
                      >本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议{{ isYXB ? '课程班' : '培训班' }}实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。</div>
                      <div>修改条款如下：（若无修改条款，请填写“无”。）</div>
                      <div>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.bgtk?showData.bgtk:'无'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">九、合同条款补充</div>
                  <div>
                    <div class>
                      <div>协议未尽事宜，经双方友好协商达成一致，可订立补充条款作为本协议的附件或订立补充协议。</div>
                      <div>补充条款如下：（若无补充条款，请填写“无”。）</div>
                      <div>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.bctk?showData.bctk:'无'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="isYXB || (proData_jb.create_time * 1000 > fz202101)" class="module-bottom">
                  <div class="title-mark">十、本协议采用网络在线形式签署，以“中国人民大学继续教育管理服务微系统”（http://xygl.peixun.ruc.edu.cn）中经过双方电子签章和电子签名数字认证的数据版本为准。其他无数字认证的下载版本、打印版本、拍照图片版本等均无法律效力，仅作为双方办理内部财务手续、档案留存和信息查阅的资料使用。</div>
                </div>
                <div class="module-bottom">
                  <div class="title-mark">{{ (!isYXB && (fz202101 > proData_jb.create_time * 1000)) ? '十' : '十一'}}、附件</div>
                  <div>
                    <div class>
                      <ul class>
                        <template v-if="is_college3">
                          <li>
                            <span class="info-val">1、乙方资质文件复印件（含营业执照复印件与法人代表身份证复印件）</span>
                          </li>
                          <template v-if="showData.attachment&&showData.attachment.length">
                            <li v-for="(item,index) in showData.attachment" :key="index">
                              <a :href="lookUrl + '/'+item.code" target="_blank">
                                <span class="info-val" :class="{'check-val':checkShow}">
                                  {{ index+2}}、{{ item.origin_name }}
                                  <span
                                    class="no-print"
                                    style="font-weight: bold"
                                  >【点击查看】</span>
                                </span>
                              </a>
                            </li>
                          </template>
                          <li v-else>
                            <span class="info-val">2、（无其他附件）</span>
                          </li>
                        </template>
                        <template v-else>
                          <li>
                            <span class="info-val">1、中国人民大学授权委托书</span>
                          </li>
                          <li>
                            <span class="info-val">2、{{ isYXB ? '课程班' : '培训' }}承办单位承诺书</span>
                          </li>
                          <li>
                            <span class="info-val">3、乙方资质文件复印件（含营业执照复印件与法人代表身份证复印件）</span>
                          </li>
                          <template v-if="showData.attachment&&showData.attachment.length">
                            <li v-for="(item,index) in showData.attachment" :key="index">
                              <a :href="lookUrl + '/'+item.code" target="_blank">
                                <span class="info-val" :class="{'check-val':checkShow}">
                                  {{ index+4}}、{{ item.origin_name }}
                                  <span
                                    class="no-print"
                                    style="font-weight: bold"
                                  >【点击查看】</span>
                                </span>
                              </a>
                            </li>
                          </template>
                          <li v-else>
                            <span class="info-val">4、（无其他附件）</span>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!checkShow" class="content-annotation">（以下无正文）</div>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div
                v-if="!checkShow"
                class="content-annotation"
                style="margin-bottom: 80px"
              >（本页无正文，为本协议签署页）</div>
            </div>
            <div v-if="!is_modListText" class="assist-content-foot">
              <!--审核-->
              <template v-if="checkShow">
                <el-form :model="form" label-width="200px">
                  <template v-if="!is_signed.status">
                    <el-form-item label="辅助协议审核结果：">
                      <el-radio-group v-model="form.status">
                        <el-radio :label="3">审核通过</el-radio>
                        <el-radio :label="2">审核不通过</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      v-if="form.status===2"
                      label="审核不通过原因："
                      :rules="[{required:true}]"
                    >
                      <el-input type="textarea" v-model.trim="form.content" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click.native="backList">返 回</el-button>
                      <el-button type="primary" @click.native="handleSubmit">确 定</el-button>
                    </el-form-item>
                  </template>
                  <el-form-item v-else>
                    <el-button @click.native="backList">返 回</el-button>
                    <el-button type="primary" @click.native="handleSigned">复核</el-button>
                  </el-form-item>
                </el-form>
              </template>
              <!--落款-->
              <div class="foot-inscribe" v-else>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div
                      class="grid-content bg-purple foot-inscribe-item clearfix"
                      style="position: relative"
                    >
                      <span class="fl">甲方（盖章）：</span>
                      <span
                        class
                        style="width: 158px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >
                        <template>
                          中国人民大学
                          <br>
                          {{ is_college3?showData.college:''}}
                        </template>
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      class="grid-content bg-purple foot-inscribe-item clearfix"
                      style="position: relative"
                    >
                      <span class="fl">乙方（盖章）：</span>
                      <span
                        class
                        style="width: 200px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >{{ showData.yf_dwmc }}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      <template v-if="is_college3">
                        <span style="display:inline-block;line-height: 20px">
                          法定代表人
                          <br>或授权代理人：
                        </span>
                        <span class="foot-inscribe-line" style="width: 152px"></span>
                      </template>
                      <template v-else>
                        <div style="padding-top: 10px">
                          <span>授权代理人：</span>
                          <span class="foot-inscribe-line" style="width: 170px"></span>
                        </div>
                      </template>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      <span style="display:inline-block;line-height: 20px">
                        法定代表人
                        <br>或授权代理人：
                      </span>
                      <span class="foot-inscribe-line" style="width: 192px"></span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      日期：
                      <span class="foot-inscribe-line" style="width: 218px"></span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple foot-inscribe-item">
                      日期：
                      <span class="foot-inscribe-line" style="width: 240px"></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="(!checkShow)&&(!is_college3)&&(!is_modListText)" class>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class>
                <h3 style="margin-bottom: 20px">附件1：</h3>
                <div>
                  <img :src="showData.create_time ? `${ URL }/static/images/wt_${ new Date(showData.create_time * 1000).getFullYear() }.jpg` : ''"
                    alt style="width: 100%">
                </div>
              </div>
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class>
                <h3 style="margin-bottom: 40px">附件2：</h3>
                <div :id="printType === 2 ? `subOutputRank-print` : ''">
                  <div class="commitment-content" :style="{paddingTop: printType === 2 ? '80px' : ''}">
                    <h2 style="text-align: center" class>{{ isYXB ? '课程班' : '培训' }}承办单位承诺书</h2>
                    <div class>
                      <div>
                        <span class="title-mark">继续教育处：</span>
                      </div>
                      <div class="shrink-section">
                        <div>
                          “{{ showData.pro_name }}”（培项字：
                          <template v-if="isYXB">
                            课
                            <template>({{ proData_jb.province && proData_jb.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                            <template>(辅)</template>
                          </template>
                          <template v-else>
                            <template v-for="(item,key,index) in proConfig.pxlx">
                              <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                            </template>
                          </template>
                          {{ showData.pro_code }}）由我单位对乙方辅助单位实施全过程管理，对于{{ isYXB ? '课程班' : '培训班' }}所涉及的管理责任和经济责任已经我单位认真研究并经我单位党政联席会议讨论通过。我单位承诺按照学校有关规定与乙方辅助单位一起认真做好此次协议议定的{{ isYXB ? '课程班' : '培训' }}宣传、招生、组织、教学等有关工作，服从学校管理，为受训单位和受训学员提供高水平的{{ isYXB ? '授课' : '培训' }}服务。
                        </div>
                        <div class>协议签订后，我单位将作为责任主体主动承担由此{{ isYXB ? '课程班' : '培训班' }}产生的经济和社会责任。</div>
                      </div>
                    </div>
                    <div style="margin-top: 50px">
                      <div style="text-align: right">
                        甲方下属{{ isYXB ? '课程班' : '培训' }}承办单位（盖章）：
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
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="$route.path.indexOf('home/') !== -1 && $route.path.indexOf('modify/list') == -1" class="four-fixed-body-top">
        <template v-if="!checkShow">
          <!-- 原协议流程 -->
          <template v-if="!isYXB && (versionTime_4_sign > xy_time) || goNoSign(showData.college)">
            <el-button type="success" size="small" @click.native="doPrint(1)">打印{{ showData.status===3?'合同':'草稿'}}</el-button>
          </template>
          <!-- PDF签章审批 -->
          <template v-else>
            <template v-if="Query.sort > 0">
              <el-button type="success" size="small" @click.native="doPrint(1)">打印{{ showData.status === 3 ? '合同' : '草稿' }}</el-button>
              <!-- <el-button v-if="Query.sort == 1 || Query.sort == 2" type="success" size="small" @click.native="doPrint(1)">打印{{ showData.status === 3 ? '合同' : '草稿' }}</el-button>
              <el-button v-if="Query.sort == 1 || Query.sort == 3" type="success" plain size="small" @click.native="doPrint(2)">打印承诺书</el-button> -->
            </template>
          </template>
        </template>
        <el-button type="info" size="small" @click.native="backList">返 回</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
import { COLLEGE } from '@/assets/js/config.special.js'


export default {
  name: "app-protocol-assist-content",
  data() {
    return {
      xy_time: null,
      loading1: false,
      showData: {},
      checkShow: false, // 审核时显示
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      PXLX: 0, // 培训类型
      form: {
        id: 0,
        uid: 0,
        pro_id: 0,
        status: 3,
        content: ""
      },
      Margin: "98px",
      imgUrl: "",
      proData_jb: {}, // 管理员审核对比的数据（基本信息）
      proData_fz: {}, // 管理员审核对比的数据（辅助信息）
      is_college3: false, // 国际学院（苏州研究院）、教育培训中心、深圳研究院
      zh: "0200007609026400244", // 账号
      khh: "中国工商银行股份有限公司北京紫竹院支行", // 开户行
      is_signed: {
        status: false,
        is_signed: 0,
        ids: 0
      },
      is_modListText: false,
      
      isYXB: false,
      Query: {},
      printType: 1,
    };
  },
  computed: {
    ...mapState(["URL", "EWM", "lookUrl", "versionTime", 'versionTime_4_sign', 'userInfo', 'fz202101'])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions([
      "getFzProtocol",
      "checkFz",
      "getProjectsData",
      "getFzForm3",
      "signFzProtocol"
    ]),
    initData(id, front) {
      this.getFzProtocol({
        data: {
          id: id
        },
        front: front
      }).then(data => {
        if (data.data.code === 200) {
          const DA = data.data.data;
          this.showData = DA;
          this.xy_time = this.showData.create_time * 1000;
          this.showPxap(this.showData.pxap);
          // if (this.showData.status === 3) {
          //   this.imgUrl = `${this.EWM}/2/id/${id}`
          // }
          // 文字预审之后显示
           if (this.showData.status > 2 && this.showData.status !== 4) {
            this.imgUrl = `${this.EWM}/2/id/${id}`
          }
          this.PXLX = DA.pxlx;
          this.$set(this.form, "pro_id", Number(DA.pro_id));
          if (this.checkShow) {
            // 是审核状态时请求项目的信息做审核的对比
            this.getProjectData(DA.pro_id, true);
          } else {
            this.getProjectData(DA.pro_id, false);
          }
          if (this.showData.college) {
            const College = this.showData.college;
            if (College.indexOf("苏州研究院") !== -1) {
              this.is_college3 = true;
              this.zh = "325605000018010120982";
              this.khh = "交通银行股份有限公司苏州科技支行";
            } else if (College.indexOf("深圳研究院") !== -1) {
              this.is_college3 = true;
              this.zh = "0412100192112";
              this.khh = "中国平安银行深圳高新技术区支行";
            } else if (College.indexOf("教育培训中心") !== -1) {
              this.is_college3 = true;
              this.zh = "0200007609201130889";
              this.khh = "中国工商银行股份有限公司北京紫竹院支行";
            } else {
              this.is_college3 = false;
              this.zh = "0200007609026400244";
              this.khh = "中国工商银行股份有限公司北京紫竹院支行";
            }
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleSubmit() {
      if (this.form.status === 2) {
        if (!this.form.content) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      }
      this.loading1 = true;
      this.checkFz({
        data: this.form
      }).then(data => {
        this.loading1 = false;
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data,
            onClose: () => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    //签署状态
    handleSigned() {
      this.signFzProtocol({
        data: {
          ids: this.is_signed.ids,
          is_signed: this.is_signed.is_signed
        }
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
            message: data.data.error
          });
        }
      });
    },
    doPrint(type) { // 1打印合同（全部）、2打印承诺书
      this.printType = type
      setTimeout(() => {
        doPrint()
      }, 100)
    },
    showPxap(strContent = "") {
      this.$nextTick(() => {
        strContent = strContent.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
        strContent = strContent.replace(/\n/g, "<br/>"); //IE7-8
        strContent = strContent.replace(/\s/g, "&nbsp;"); //空格处理
        this.$refs.pxap.innerHTML = strContent;
      });
    },
    showPxap0(strContent = "") {
      this.$nextTick(() => {
        strContent = strContent.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
        strContent = strContent.replace(/\n/g, "<br/>"); //IE7-8
        strContent = strContent.replace(/\s/g, "&nbsp;"); //空格处理
        this.$refs.pxap0.innerHTML = strContent;
      });
    },
    // 获取项目中的原数据（对比审核数据）
    getProjectData(id, isCheck) {
      // 获取基本信息
      this.getProjectsData({
        data: {
          proid: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            this.proData_jb = Data.list[0];
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      if (isCheck) {
        // 获取辅助单位
        this.getFzForm3({
          data: {
            pro_id: id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.proData_fz = Data.list[0];
              if (this.checkShow && this.proData_fz.pxap !== this.showData.pxap) {
                this.showPxap0(this.proData_fz.pxap);
              }
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
    // 返回协议列表
    backList () {
      // this.$router.push('/home/protocol/assist/list')
      this.$router.go(-1)
    },
    goNoSign (dataCollege) {
      if (!this.isYXB) {
        let CollegeStr = COLLEGE.filter(item => item.assist_noSign).map(item => item.name).join()
        if (this.userInfo.role == 1) {
          return CollegeStr.indexOf(dataCollege) !== -1
        } else if (this.userInfo.role == 2) {
          return CollegeStr.indexOf(this.userInfo.college) !== -1
        }
      }
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.$set(this.form, "uid", this.userInfo.uid)
    const Route = this.$route;
    this.Query = Route.query
    let front = 0;
    if (Route.path.indexOf("home") === -1) {
      front = 2;
    }
    if (Route.fullPath.indexOf("assistCheck") !== -1) {
      this.checkShow = true;
      if (sessionStorage.getItem("is_signed")) {
        const is_signed = JSON.parse(sessionStorage.getItem("is_signed"));
        Object.assign(this.is_signed, {
          status: true,
          is_signed: is_signed.is_signed,
          ids: is_signed.ids
        });
        // console.log(this.is_signed);
      }
    }
    if (Route.path.indexOf("/modify/list/") > 0) {
      if (sessionStorage.getItem("modifyID")) {
        this.is_modListText = true;
        const modifyID = JSON.parse(sessionStorage.getItem("modifyID"));
        this.$set(this.form, "id", modifyID.id);
        this.initData(modifyID.id, front);
      }
    } else {
      this.$set(this.form, "id", Route.params.id);
      this.initData(Route.params.id, front);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("is_signed");
  }
};
</script>

<style scoped>
.app-protocol-assist-content{
  padding: 60px 0;
}
/*样式*/
.print-content {
  font-size: 14px;
  line-height: 24px;
  font-family: "SimSun";
}
/*二维码box*/
.right-code-img {
  width: 112px;
  height: 112px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.02)
}
/*查看时插值*/
span.info-val {
  padding: 0 10px;
  border-bottom: 1px solid #000;
  color: #000;
}
/*甲乙*/
.entrust-content-body-ver1 .ja-yi span.info-val {
  display: inline-block;
  width: 400px;
}
/*审核时插值*/
span.check-val {
  color: #f56c6c;
  border-color: #f56c6c;
}
/*审核时对比值*/
span.check-compare {
  color: #5daf34;
  border-color: #5daf34;
}
/*文本的下划线背景图*/
.font-line {
  text-decoration: underline;
  /*background: url("../../../../../assets/images/font-line.jpg");*/
}
.font-line-check {
  color: #f56c6c;
  /*background: url("../../../../../assets/images/font-line-check.jpg");*/
}
.font-line-check-compare {
  color: #5daf34;
  /*background: url("../../../../../assets/images/font-line-check.jpg");*/
}
/*模块*/
.module-bottom {
  margin-bottom: 24px;
}
/*缩进*/
.shrink-section {
  text-indent: 2em;
}
/*强调*/
.title-mark {
  font-weight: bold;
}
/*头部*/
.assist-content-head {
  text-align: center;
}
.assist-content-head-title {
  height: 54px;
  line-height: 26px;
  padding-top: 20px;
  font-size: 16px;
  letter-spacing: 8px;
}
/*底部落款*/
.foot-inscribe {
  padding-top: 40px;
}
.foot-inscribe-item {
  padding: 30px 0 30px;
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
/*承诺书*/
.commitment-content {
  font-size: 18px;
  line-height: 30px;
  padding: 0 20px;
  font-family: "SimSun";
}
/*备注*/
.content-annotation {
  line-height: 40px;
}

/*打印*/
@media print {
  .no-print {
    display: none;
  }
}
.right-num {
  text-align: right;
  padding-right: 20px;
}

/****版本二****/
.ja-yi span.info-val-ver2 {
  display: inline-block;
  min-width: 400px;
}
</style>
