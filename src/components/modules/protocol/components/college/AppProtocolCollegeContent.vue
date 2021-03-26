<template>
  <div
    class="app-protocol-college-content"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div id="subOutputRank-print" v-cloak>
      <div style="padding: 0 40px" class="print-content">
        <div class="college-content-head">
          <el-row>
            <el-col :span="12" :offset="6">
              <header>
                <div class="college-content-head-title">
                  <div style="font-weight: bold;font-size: 18px">校内单位培训合作协议书</div>
                  <div v-if="showData.status!==3">（草稿）</div>
                </div>
                <div class="college-content-head-sub-title">（非学历非学位教育培训）</div>
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
        <div class="college-content-body">
          <div v-if="checkShow" class="content-annotation">
            （ 以下
            <span class="tip-red">红色区域</span>为项目校内合作协议填写信息
            <span class="check-compare">（绿色区域为协议不同于立项前的信息）</span>，请认真审核！）
          </div>
          <!--甲乙-->
          <div class="content-body-head">
            <div class="module-bottom ja-yi" style="line-height: 1.8em">
              <!--甲-->
              <div>
                <div class>
                  <span style="font-weight: bolder">甲方：</span>
                  <span
                    class="info-val info-val-ver2"
                    :class="{'check-val':checkShow}"
                  >中国人民大学{{ showData.college }}</span>
                </div>
                <div>
                  联系地址：
                  <span class="info-val" :class="{'check-val':checkShow}">{{ showData.jf_dz }}</span>
                  <span
                    v-if="checkShow&&(proConfig.ruc_info.address!==showData.jf_dz)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proConfig.ruc_info.address }}</span>
                  （详细到街道、门牌号），
                </div>
                <div>
                  邮编：
                  <span class="info-val" :class="{'check-val':checkShow}">{{ showData.jf_yb }}</span>
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
                  <span class="info-val" :class="{'check-val':checkShow}">{{ showData.jf_lxdh}}</span>
                  <span
                    v-if="checkShow&&(proData_jb.tel!==showData.jf_lxdh)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_jb.tel}}</span>。
                </div>
              </div>
              <!--乙-->
              <div>
                <div class>
                  <span style="font-weight: bolder">乙方：</span>
                  <span
                    class="info-val info-val-ver2"
                    :class="{'check-val':checkShow}"
                  >{{ showData.yf_dwmc }}</span>
                </div>
                <div>
                  联系地址：
                  <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_dz }}</span>
                  <span
                    v-if="checkShow&&(proData_hz.yf_dz!==showData.yf_dz)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.yf_dz }}</span>
                  （详细到街道、门牌号），
                </div>
                <div>
                  具体联系人：
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.yf_lxr }}</span>
                  <span
                    v-if="checkShow&&(proData_hz.yf_lxr!==showData.yf_lxr)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.yf_lxr }}</span>
                  （姓名），
                </div>
                <div>
                  联系电话：
                  <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_lxdh}}</span>
                  <span
                    v-if="checkShow&&(proData_hz.yf_lxdh!==showData.yf_lxdh)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.yf_lxdh}}</span>。
                </div>
              </div>
            </div>
            <div class="module-bottom shrink-section">
              经甲乙双方友好协商，双方决定共同举办“
              <span
                class="info-val"
                :class="{'check-val':checkShow}"
              >{{ showData.pro_name }}</span>
              <span
                v-if="checkShow&&(proData_jb.pro_name!==showData.pro_name)"
                class="info-val"
                :class="{'check-compare':checkShow}"
              >{{ proData_jb.pro_name }}</span>
              ”（
              培项字：
              <template v-if="isYXB">
                课
                <template>({{ showData.province && showData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                <template> ({{ showData.is_fzdw > 0 ? '辅' : '自' }})</template>
              </template>
              <template v-else>
                <template v-for="(item,key,index) in proConfig.pxlx" >
                  <span v-if="showData.pxlx==key" :key="index">{{ item | chai }}</span>
                </template>
              </template>
              {{ showData.pro_code }}
              ），达成如下协议：
            </div>
          </div>
          <div class="shrink-section">
            <div class="module-bottom">
              <div style="font-weight: bolder">一、合作项目</div>
              <div>
                <div class>
                  <span>（一）</span>甲乙双方合作举办“
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.pro_name }}</span>
                  <span
                    v-if="checkShow&&(proData_jb.pro_name!==showData.pro_name)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_jb.pro_name }}</span>
                  ”，计划举办
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
                  <span>（二）</span>培训班举办时间为：
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
                  >{{ proData_jb.px_end_time | TimestampChangeFilter(true) }}</span>。
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
                  <div>（四）该培训班收费方式与标准如下：</div>
                  <template>
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
                        甲方支付合计
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
                        >{{ showData.sfbz_dw>0?showData.sfbz_dw_dx:'零圆'}}</span>）。
                      </div>
                      <div v-if="showData.sfbz===2">
                        由学员个人或所在单位按照
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.sfbz_xy }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.sfbz_xy!==showData.sfbz_xy)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.sfbz_xy }}</span>
                        元/人标准向乙方支付。
                      </div>
                      <div v-if="showData.sfbz===3">
                        甲方支付合计
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
                        剩余部分由学员按照
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.sfbz_xy }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.sfbz_xy!==showData.sfbz_xy)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.sfbz_xy }}</span>
                        元/人标准向乙方支付。
                      </div>
                    </template>
                  </template>
                  <div class>
                    费用具体包括：
                    <span
                      class="info-val"
                      :class="{'check-val':checkShow}"
                    >{{ showData.pxfy_desc }}</span>
                    <span
                      v-if="checkShow&&(proData_jb.pxfy_desc!==showData.pxfy_desc)"
                      class="info-val"
                      :class="{'check-compare':checkShow}"
                    >{{ proData_jb.pxfy_desc }}</span>
                  </div>
                </div>
                <div class>
                  <div>（五）培训内容和课程安排，以及举办培训班的时间、地点、人数安排列表等详细计划如下：</div>
                  <div class>
                    <div class="font-line" :class="{'font-line-check':checkShow}" style>
                      <span style ref="pxap" class></span>
                    </div>
                    <div
                      v-if="checkShow&&(proData_hz.pxap!==showData.pxap)"
                      class="font-line"
                      :class="{'font-line-check-compare':checkShow}"
                    >
                      <span style ref="pxap0" class></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">二、双方的权利和义务</div>
              <div>
                <div>
                  <div>（一）甲乙双方经友好协商，共同遵守以下约定：</div>
                  <div>
                    <div
                      class
                    >1.甲乙双方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他培训项目中继续利用对方的相关名称、品牌、商标或图形标志等进行培训宣传和招生，仅可进行正常的与本次培训相关的新闻报道。</div>
                    <div class>2.双方在协议执行中，应采取友好协作、相互配合的态度，协议签订后如需修改本协议的相关条款或提前终止本协议，应签订补充协议或另行签订协议。</div>
                    <div>3.双方为对方保守商业秘密，并且保密义务在本协议中止或终止后依然有效。</div>
                    <div>4.双方坚持简朴、节约、精简、高效的原则举办培训班，除必须的现场教学和参观学习外，不得在本次培训过程中组织任何形式的旅游活动，乙方不为学员个人在培训中或培训后自行安排的旅游活动担负任何责任。</div>
                  </div>
                </div>
                <div>
                  <div>（二）甲方的权利和义务</div>
                  <div>
                    <template v-if="!is_college3">
                      <div class="content-specific" style="font-weight: bold">
                        2.本协议所议培训班，具体由甲方
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >中国人民大学{{ showData.college }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.college!==showData.college)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.college }}</span>
                        承办，乙方
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_dwmc }}</span>
                        协办。具体协议经济责任由甲乙双方自行议定，甲方
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >中国人民大学{{ showData.college }}</span>
                        代表项目主办方向学校履行申报和各项管理手续，交纳学校管理费。
                      </div>
                    </template>
                    <div class>{{ is_college3?1:2}}.按照学校批复标准向受训单位或受训学员收取培训费，并按照本协议的约定向乙方支付培训合作费用。</div>
                    <div class>{{ is_college3?2:3}}.尊重和保护乙方的知识产权，即使在本协议中止或终止后。</div>
                    <div class>
                      <div>{{ is_college3?3:4}}.双方约定甲方负责的主要工作包括：</div>
                      <div>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_fzgz }}</span>
                        <span
                          v-if="checkShow&&(proData_hz.jf_fzgz!==showData.jf_fzgz)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_hz.jf_fzgz }}</span>
                      </div>
                      <div>依据上述分工，甲方还拥有以下权利和义务：</div>
                      <div>
                        <span class="info-val" :class="{'check-val':checkShow}">{{ showData.jf_ql}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div>（三）乙方的权利和义务</div>
                  <div>
                    <div>
                      1.乙方
                      <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_dwmc }}</span> 作为项目协助方，配合甲方履行校内审批和管理手续。
                    </div>
                    <div class>2.乙方不得收取受训单位或受训学员任何费用。</div>
                    <div class>3.尊重和保护甲方的知识产权，即使在本协议中止或终止后。</div>
                    <div class>
                      <div>4. 双方约定乙方负责的主要工作包括：</div>
                      <div>
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_fzgz }}</span>
                        <span
                          v-if="checkShow&&(proData_hz.jf_fzgz!==showData.yf_fzgz)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_hz.jf_fzgz }}</span>
                      </div>
                      <div>依据上述分工，乙方还拥有以下权利和义务：</div>
                      <div>
                        <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_ql}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">三、项目费用及付款方式</div>
              <div>
                <div class>
                  <div>（一）付款方式</div>
                  <div>
                    <div>甲乙双方同为校内二级单位时，甲方向受训单位或受训学员收取培训费后，在财务处办理财务结算手续后，按照协议约定时间和金额通过校内转账为乙方办理合作分成款结算付款。</div>
                    <div>甲乙双方中任一方（或双方）为学校下属独立法人单位时，甲方向受训单位或受训学员收取培训费后，依据协议议定时间和金额通过对公汇款或校内转账向乙方支付合作分成款。采用对公汇款方式时，乙方需为甲方开具等额有效票据。</div>
                  </div>
                </div>
                <div class>
                  <div>（二）乙方分成款金额与标准</div>
                  <div>
                    <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_jebz }}</span>
                  </div>
                </div>
                <div class>
                  <div>（三）付款时间</div>
                  <div>
                    甲方分
                    <span class="info-val" :class="{'check-val':checkShow}">{{ showData.yf_fqs }}</span>
                    <span
                      v-if="checkShow&&(proData_hz.yf_fqs!==showData.yf_fqs)"
                      class="info-val"
                      :class="{'check-compare':checkShow}"
                    >{{ proData_hz.yf_fqs }}</span>
                    期付款，具体付款安排为：
                    <span
                      class="info-val"
                      :class="{'check-val':checkShow}"
                    >{{ showData.yf_fqs_time }}</span>
                    <span
                      v-if="checkShow&&(proData_hz.yf_fqs_time!==showData.yf_fqs_time)"
                      class="info-val"
                      :class="{'check-compare':checkShow}"
                    >{{ proData_hz.yf_fqs_time }}</span>
                  </div>
                </div>
                <div class>
                  <div>（四）乙方收款账户信息</div>
                  <div>
                    <div>收款人全称：中国人民大学{{ is_college3?showData.college:''}}；</div>
                    <div>收款人账号： {{ zh}} ；</div>
                    <div>收款人开户银行： {{ khh}} ;</div>
                    <div>汇款备注栏中必须注明收款学院和培训项目名称。</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">四、违约责任</div>
              <div>
                <div class>
                  在本协议约定的合作期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约（包括但不局限于本协议第二条规定的保密义务或第三条规定的限制条款），由违约方承担本次约定培训费用
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.wyjbl}}</span>
                  <span
                    v-if="checkShow&&(proData_hz.wyjbl!==showData.wyjbl)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.wyjbl}}</span>
                  %的违约金。
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">五、合作期限</div>
              <div>本协议自签订之日起生效，本次培训结束后自动终止。但双方都有为完成本协议相关事项继续履行本协议项下相关义务，或在本协议终止后继续配合的义务。</div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">六、合同效力</div>
              <div>
                <div class>
                  <span>（一）</span>
                  本协议A4纸打印，一式
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.xy_num1}}</span>
                  <span
                    v-if="checkShow&&(proData_hz.xy_num1!==showData.xy_num1)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.xy_num1}}</span>
                  份，甲方执
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.xy_num2}}</span>
                  <span
                    v-if="checkShow&&(proData_hz.xy_num2!==showData.xy_num2)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.xy_num2}}</span>
                  份，乙方执
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.xy_num3}}</span>
                  <span
                    v-if="checkShow&&(proData_hz.xy_num3!==showData.xy_num3)"
                    class="info-val"
                    :class="{'check-compare':checkShow}"
                  >{{ proData_hz.xy_num3}}</span>
                  份，经双方法定代表人或其授权代表签字并盖章并加盖双方公章（另需骑缝加盖）后具有同等法律效力。
                </div>
                <div class>
                  <span>（二）</span>
                  如发生争议，应协商解决；协议不成的，双方同意采用如下争议解决方式：
                  <div>1.双方同意提交中国人民大学继续教育处或中国人民大学学校办公室（合同管理办公室）协调协商解决。</div>
                  <div>2.在协调协商期间，双方应坚持维护学校办学声誉和学员利益的工作出发点，本着诚信原则继续履行本合同不涉及争议的部分。</div>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">七、协议条款修改</div>
              <div class>
                <div
                  class="content-specific"
                >本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议培训班实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。</div>
                <div>修改条款如下：（若无修改条款，请填写“无”。）</div>
                <div>
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.bgtk?showData.bgtk:'无'}}</span>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">八、协议条款补充</div>
              <div>
                <div>协议未尽事宜，经双方友好协商达成一致，可订立补充条款。</div>
                <div>补充条款如下：（若无补充条款，请填写“无”。）</div>
                <div>
                  <span
                    class="info-val"
                    :class="{'check-val':checkShow}"
                  >{{ showData.bctk?showData.bctk:'无'}}</span>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">九、附件</div>
              <div>
                <div class>
                  <ul class>
                    <template v-if="showData.attachment&&showData.attachment.length">
                      <li v-for="(item,index) in showData.attachment" :key="index">
                        <a :href="lookUrl + '/'+item.code" target="_blank">
                          <span class="info-val" :class="{'check-val':checkShow}">
                            {{ index+1}}、{{ item.origin_name }}
                            <span class="no-print">【点击查看】</span>
                          </span>
                        </a>
                      </li>
                    </template>
                    <li v-else>
                      <span class="info-val">1、（无其他附件）</span>
                    </li>
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
        <div v-if="!is_modListText" class="college-content-foot">
          <!--审核-->
          <template v-if="checkShow">
            <el-form :model="form" label-width="200px">
              <template v-if="!is_signed.status">
                <el-form-item label="合作协议审核结果：">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="3">审核通过</el-radio>
                    <el-radio :label="2">审核不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.status===2" label="审核不通过原因：" :rules="[{required:true}]">
                  <el-input type="textarea" v-model.trim="form.content" :rows="5"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click.native="backList">返 回</el-button>
                  <el-button type="primary" @click.native="handleSubmit">确 定</el-button>
                </el-form-item>
              </template>
              <el-form-item v-else>
                <el-button @click.native="backList">返 回</el-button>
                <el-button v-if="is_signed.status" type="primary" @click.native="handleSigned">复 核</el-button>
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
                    style="width: 180px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                  >中国人民大学{{ showData.college }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div
                  class="grid-content bg-purple foot-inscribe-item clearfix"
                  style="position: relative"
                >
                  <span class="fl">乙方（盖章）：</span>
                  <span
                    style="width: 170px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                  >{{ showData.yf_dwmc }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple foot-inscribe-item">
                  <span style="display:inline-block;line-height: 20px">
                    法定代表人
                    <br>或授权代理人 ：
                  </span>
                  <span class="foot-inscribe-line" style="width: 162px"></span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple foot-inscribe-item">
                  <template v-if="is_college3">
                    <span style="display:inline-block;line-height: 20px">
                      法定代表人
                      <br>或授权代理人 ：
                    </span>
                    <span class="foot-inscribe-line" style="width: 160px"></span>
                  </template>
                  <template v-else>
                    <div style="padding-top: 10px">
                      <span>授权代理人：</span>
                      <span class="foot-inscribe-line" style="width: 180px"></span>
                    </div>
                  </template>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple foot-inscribe-item">
                  日期：
                  <span class="foot-inscribe-line" style="width: 226px"></span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple foot-inscribe-item">
                  日期：
                  <span class="foot-inscribe-line" style="width: 230px"></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$route.path.indexOf('home/') !== -1&& $route.path.indexOf('modify/list') == -1" class="four-fixed-body-top">
      <el-button v-if="!checkShow && (!is_modListText)" type="success" size="small" @click.native="doPrint">打印{{ showData.status===3?'合同':'草稿'}}</el-button>
      <el-button type="info" size="small" @click.native="backList">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-protocol-college-content",
  data() {
    return {
      loading1: false,
      showProCode: null,
      showData: {},
      front: 0,
      checkShow: false, // 审核时显示
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      form: {
        id: 0,
        uid: 0,
        pro_id: 0,
        status: 3,
        content: ""
      },
      Margin: "98px",
      imgUrl: "",
      // front:false,
      proData_jb: {},
      proData_hz: {},
      is_college3: false, // 国际学院（苏州研究院）、教育培训中心、深圳研究院
      zh: "0200007609026400244", // 账号
      khh: "中国工商银行股份有限公司北京紫竹院支行", // 开户行
      is_signed: {
        status: false,
        is_signed: 0,
        ids: 0
      },
      is_modListText: false,
      
      isYXB: false
    };
  },
  computed: {
    ...mapState(["EWM", "lookUrl", 'userInfo'])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions([
      "getHzProtocol",
      "checkHz",
      "getProjectsData",
      "getHzForm5",
      "signHzProtocol"
    ]),
    initData(id) {
      this.showProCode = sessionStorage.getItem("PEO_CODE_show");
      this.getHzProtocol({
        data: {
          id: id
        },
        front: this.front
      }).then(data => {
        if (data.data.code === 200) {
          this.showData = data.data.data;
          this.$nextTick(() => {
            this.showPxap(this.showData.pxap);
          });
          if (this.showData.status === 3) {
            this.imgUrl = `${this.EWM}/1/id/${id}`
          }
          if (sessionStorage.getItem("PXLX")) {
            Object.assign(this.showData, {
              pxlx: sessionStorage.getItem("PXLX")
            });
          }
          this.$set(this.form, "pro_id", Number(this.showData.pro_id));
          if (this.checkShow) {
            this.getProjectData(this.showData.pro_id);
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
      this.checkHz({
        data: this.form
      }).then(data => {
        this.loading1 = false;
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data,
            onClose: () => {
              this.handleBack();
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
      this.signHzProtocol({
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
          this.handleBack();
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
    },
    showPxap(strContent = "") {
      this.$nextTick(() => {
        strContent = strContent.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
        strContent = strContent.replace(/\n/g, "<br/>"); //IE7-8
        strContent = strContent.replace(/\s/g, "&nbsp;"); //空格处理 &nbsp;
        this.$refs.pxap.innerHTML = strContent;
      });
    },
    showPxap0(strContent = "") {
      this.$nextTick(() => {
        strContent = strContent.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
        strContent = strContent.replace(/\n/g, "<br/>"); //IE7-8
        strContent = strContent.replace(/\s/g, "&nbsp;"); //空格处理 &nbsp;
        this.$refs.pxap0.innerHTML = strContent;
      });
    },
    // 获取项目中的原数据（对比审核数据）
    getProjectData(id) {
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
      // 获取合作单位
      this.getHzForm5({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            const comID = sessionStorage.getItem("HZ_id");
            const hz_list = Data.list.filter(item => {
              return item.id == comID;
            });
            if (hz_list.length) {
              this.proData_hz = hz_list[0];
              if (
                this.checkShow &&
                this.proData_hz.pxap !== this.showData.pxap
              ) {
                this.showPxap0(this.proData_hz.pxap);
              }
            } else {
              const ID = sessionStorage.getItem("HZ_pro_id");
              if (ID) {
                this.getProjectData(ID);
                sessionStorage.removeItem("HZ_pro_id");
              }
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
    handleBack() {
      this.$router.go(-1);
    },
    // 返回协议列表
    backList () {
      // this.$router.push('/home/protocol/college/list')
      this.$router.go(-1)
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.$set(this.form, "uid", this.userInfo.uid);
    const Route = this.$route;
    // let front = 0;
    if (Route.path.indexOf("home") === -1) {
      this.front = 2;
    }
    if (Route.fullPath.indexOf("collegeCheck") !== -1) {
      this.checkShow = true;
      if (sessionStorage.getItem("is_signed")) {
        const is_signed = JSON.parse(sessionStorage.getItem("is_signed"));
        Object.assign(this.is_signed, {
          status: true,
          is_signed: is_signed.is_signed,
          ids: is_signed.ids
        });
      }
    }

    if (Route.path.indexOf("/modify/list/") > 0) {
      if (sessionStorage.getItem("modifyID")) {
        this.is_modListText = true;
        const modifyID = JSON.parse(sessionStorage.getItem("modifyID"));
        this.$set(this.form, "id", modifyID.id);
        this.initData(modifyID.id);
      }
    } else {
      this.$set(this.form, "id", Route.params.id);
      this.initData(Route.params.id);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("PXLX");
    sessionStorage.removeItem("HZ_id");
    sessionStorage.removeItem("HZ_pro_id");
    sessionStorage.removeItem("PEO_CODE_show");
    sessionStorage.removeItem("is_signed");
  }
};
</script>

<style scoped>
.app-protocol-college-content{
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
}
.font-line-check {
  color: #f56c6c;
}
.font-line-check-compare {
  color: #5daf34;
}
/*甲乙*/
.college-content-body-ver1 .ja-yi span.info-val {
  display: inline-block;
  width: 400px;
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
.college-content-head {
  text-align: center;
}
.college-content-head-title {
  height: 54px;
  line-height: 26px;
  padding-top: 20px;
  font-size: 16px;
  letter-spacing: 6px;
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
  .app-protocol-assist-content #subOutputRank-print {
    font-size: 12px;
    font-family: "SimSun";
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
  line-height: 20px;
}
</style>
