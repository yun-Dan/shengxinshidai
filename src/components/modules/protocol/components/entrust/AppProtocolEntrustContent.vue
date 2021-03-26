<template>
  <div
    class="app-protocol-entrust-content"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <template v-if="xy_time">
      <div id="subOutputRank-print" v-cloak>
        <!--版本一-->
        <template v-if="xy_time < versionTime">
          <div style="padding: 0 40px" class="print-content">
            <!--头部-->
            <div class="entrust-content-head">
              <el-row>
                <el-col :span="12" :offset="6">
                  <header class>
                    <div class="entrust-content-head-title">
                      <div style="font-weight: bold;font-size: 18px">委 托 培 训 协 议 书</div>
                      <div v-if="showData.status!==3">（草稿）</div>
                    </div>
                    <div class="entrust-content-head-sub-title">（中国人民大学非学历非学位教育培训版）</div>
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
                编码：
                <span class="tip-red">{{ showData.contract_code?showData.contract_code:'审核通过后生成'}}</span>
              </div>
            </div>
            <!--内容-->
            <div class="entrust-content-body entrust-content-body-ver1">
              <div v-if="checkShow" class="content-annotation">
                以下
                <span class="tip-red">红色区域</span>为项目委托协议填写信息
                <span class="check-compare">（绿色区域为协议不同于立项前的信息）</span>，请认真审核！
              </div>
              <!--甲乙-->
              <div class="content-body-head">
                <div class="module-bottom ja-yi">
                  <div class>
                    <span>甲方：</span>
                    <span class="info-val" :class="{'check-val':checkShow}">{{ showData.jf_dwmc }}</span>
                  </div>
                  <div class>
                    <span>乙方：</span>
                    <span
                      class="info-val"
                      :class="{'check-val':checkShow}"
                    >中国人民大学{{ is_college3?showData.college:''}}</span>
                  </div>
                </div>
                <div class="module-bottom shrink-section">
                  乙方接受甲方委托举办“
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
                  <template
                    v-for="(item,key,index) in proConfig.pxlx"
                  >
                    <span v-if="showData.pxlx==key" :key="index">{{ item | chai }}</span>
                  </template>
                  {{ showData.pro_code }}
                  ），经双方友好协商，达成如下协议：
                </div>
              </div>
              <div class="shrink-section">
                <div class="module-bottom">
                  <div>一、合作项目</div>
                  <div>
                    <div class>
                      <span>（一）</span>乙方承办“
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
                      <span>（四）</span>此次培训班培训对象为：
                      <span
                        v-if="showData.pxdx===1"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >对委托单位内部员工进行培训</span>
                      <span
                        v-if="showData.pxdx===2"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >对委托单位下属单位或会员单位学员进行培训</span>
                      <span
                        v-if="showData.pxdx===3"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >委托单位派内部员工参加我校组织的社会散招类培训班</span>
                      <template v-if="checkShow&&(proData_wt.pxdx!==showData.pxdx)">
                        <span
                          v-if="proData_wt.pxdx===1"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >对委托单位内部员工进行培训</span>
                        <span
                          v-if="proData_wt.pxdx===2"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >对委托单位下属单位或会员单位学员进行培训</span>
                        <span
                          v-if="proData_wt.pxdx===3"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >委托单位派内部员工参加我校组织的社会散招类培训班</span>
                      </template>
                      。
                    </div>
                    <div class>
                      <span>（五）</span>培训内容和课程安排，以及举办本期培训的时间、地点、人数安排列表等详细计划如下：
                    </div>
                    <div class style="text-indent: 0;padding-left: 50px">
                      <div class="font-line" :class="{'font-line-check':checkShow}" style>
                        <span style ref="pxap" class></span>
                      </div>
                      <div
                        v-if="checkShow&&(proData_wt.pxap!==showData.pxap)"
                        class="font-line"
                        :class="{'font-line-check-compare':checkShow}"
                      >
                        <span style ref="pxap0" class></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div>二、双方权利义务责任</div>
                  <div>
                    <div>
                      <div>（一）双方</div>
                      <div>
                        <div
                          class
                        >1.甲乙双方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他培训项目中继续利用对方的相关名称、品牌、商标或图形标志等进行培训宣传和招生，仅可进行正常的与本次培训相关的新闻报道。</div>
                        <div
                          class
                        >2.双方在协议执行中，应采取友好协作、相互配合的态度，协议签订后如需修改本协议的相关条款或提前终止本协议，应签订补充协议或另行签订协议。</div>
                        <div class>3.双方为对方保守商业秘密，具体要求如下：</div>
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
                        <div class>1.负责选派学员参加培训，并组织学员按双方协定的时间报到入学。</div>
                        <div class>2.提出课程和师资需求，协助乙方做好课程内容的选择和师资的确定。</div>
                        <div class>3.组织学员成立临时管理机构，协助乙方共同做好学员学习期间的教学管理和生活管理工作。</div>
                        <div class>4.保证学员在学期间遵守中国人民大学的校规校纪，保证学员培训期间外出、就餐等学习之外活动的安全。</div>
                        <div class>5.按照本协议的约定支付培训费用。</div>
                        <div class>6.尊重和保护乙方的知识产权，即使在本协议中止或终止后。</div>
                      </div>
                    </div>
                    <div>
                      <div>（三）乙方</div>
                      <div>
                        <template v-if="!is_college3">
                          <div
                            class="content-specific"
                            style="font-weight: bold"
                          >1.按照《中国人民大学合同管理办法（修订）》要求，中国人民大学授权中国人民大学继续教育处代表学校作为乙方审核并签订此培训工作协议。合同由继续教育处负责人签署，加盖“中国人民大学合同专用章（9）”。（授权委托书见附件1）</div>
                          <div class="content-specific" style="font-weight: bold">
                            2.本协议所议培训班，具体由乙方下属中国人民大学
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            承办，具体协议经济责任由
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
                            向中国人民大学继续教育处签定《培训承办单位承诺书》（具体格式见附件2）后代表学校具体承担乙方权利、义务与责任。
                          </div>
                        </template>
                        <div
                          class
                        >{{ is_college3?1:3}}.负责按照双方商定的课程组织教学，提供或联合甲方提供适合的教学场地及设施，发放必须的学习资料，按照商定的课程表，遴选校内外具有丰富教学和实践经验的优秀教师授课，保证教学质量和所有教学工作的顺利进行。</div>
                        <div
                          class
                        >{{ is_college3?2:4}}.在课表确定后一般不更换师资，但因授课教师特殊情况等原因，经与甲方协商后，乙方就部分课程有权在同等条件下调换同等水平的师资。</div>
                        <div
                          class
                        >{{ is_college3?3:5}}.统一安排学员的学习和生活，为培训班配备管理人员或班主任，负责学员培训期间的教学和生活管理，同时做好服务工作，如有需要，乙方须协助甲方预定房间、安排就餐，费用由甲方自负。</div>
                        <div class>{{ is_college3?4:6}}.乙方须为甲方及学员在学期间的学习、生活提供必要的协助和帮助。</div>
                        <div class>{{ is_college3?5:7}}.培训结束时，为完成培训学习任务的学员向中国人民大学有关部门申领并颁发结业证书。</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div>三、限制</div>
                  <div>
                    <div
                      class
                    >（一）双方坚持简朴、节约、精简、高效的原则举办培训班，除必须的现场教学和参观学习外，不得在本次培训过程中组织任何形式的旅游活动，乙方不为学员个人在培训中或培训后自行安排的旅游活动担负任何责任。</div>
                    <div class>
                      <span
                        v-if="showData.pxdx===1"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                        style="border: none;padding-left: 0"
                      >（二）此次培训为甲方内部培训，甲乙双方均不得以此培训班名义对外招生。</span>
                      <span
                        v-if="showData.pxdx===2"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                        style="border: none;padding-left: 0"
                      >（二）此次培训为甲方组织下属单位或会员单位参加的培训班，仅面向甲方下属单位或会员单位举办培训，甲乙双方均不得以此培训班名义扩大范围对外招生。</span>
                      <span
                        v-if="showData.pxdx===3"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                        style="border: none;padding-left: 0"
                      >（二）此次培训为甲方派员参加乙方组织的社会散招类培训班，甲方除选派自己单位内学员参加培训外不得对外招生，但乙方除招收甲方学员外还可正常对外招收其他学员。</span>
                      <template v-if="checkShow&&(proData_wt.pxdx!==showData.pxdx)">
                        <span
                          v-if="proData_wt.pxdx===1"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                          style="border: none"
                        >此次培训为甲方内部培训，甲乙双方均不得以此培训班名义对外招生。</span>
                        <span
                          v-if="proData_wt.pxdx===2"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                          style="border: none"
                        >此次培训为甲方组织下属单位或会员单位参加的培训班，仅面向甲方下属单位或会员单位举办培训，甲乙双方均不得以此培训班名义扩大范围对外招生。</span>
                        <span
                          v-if="proData_wt.pxdx===3"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                          style="border: none"
                        >此次培训为甲方派员参加乙方组织的社会散招类培训班，甲方除选派自己单位内学员参加培训外不得对外招生，但乙方除招收甲方学员外还可正常对外招收其他学员。</span>
                      </template>
                    </div>
                    <div class>
                      <template v-if="showData.sfbz===1">（三）费用由甲方经费统一支付，甲乙双方均不得向学员个人收取任何培训费用。</template>
                      <template v-if="showData.sfbz===2">（三）此次培训，费用由学员个人或学员所在单位直接向乙方支付，甲方不得向学员个人收取任何培训费用。</template>
                      <template v-if="showData.sfbz===3">（三）此次培训，部分费用由甲方经费支付，部分费用由学员个人直接向乙方支付，甲方不得向学员个人收取任何培训费用。</template>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div>四、项目费用及付款方式</div>
                  <div>
                    <div class>
                      <span>（一）</span>培训项目收费方式与标准：
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
                          甲方支付合计
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw }}</span>
                          <span
                            v-if="checkShow&&(proData_wt.sfbz_dw!==showData.sfbz_dw)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_dw }}</span>
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
                            v-if="checkShow&&(proData_wt.sfbz_xy!==showData.sfbz_xy)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_xy }}</span>
                          元/人标准向乙方支付。
                        </div>
                        <div v-if="showData.sfbz===3">
                          甲方支付合计
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw }}</span>
                          <span
                            v-if="checkShow&&(proData_wt.sfbz_dw!==showData.sfbz_dw)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_dw }}</span>
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
                            v-if="checkShow&&(proData_wt.sfbz_xy!==showData.sfbz_xy)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_xy }}</span>
                          元/人标准向乙方支付。
                        </div>
                      </template>
                    </div>
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
                    <div class>
                      <template v-if="showData.sfbz===1">
                        <span>（二）</span>甲方分
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.sfbz_dw_fq }}</span>
                        <span
                          v-if="checkShow&&(proData_wt.sfbz_dw_fq!==showData.sfbz_dw_fq)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.sfbz_dw_fq }}</span>
                        期付款，具体付款时间为：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.sfbz_dw_zfsj}}</span>
                        <span
                          v-if="checkShow&&(proData_wt.sfbz_dw_zfsj!==showData.sfbz_dw_zfsj)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.sfbz_dw_zfsj}}</span>
                      </template>
                      <template v-if="showData.sfbz===2">
                        <span>（二）</span>学员或所在单位自行在培训开始前向乙方一次性缴纳。
                      </template>
                      <template v-if="showData.sfbz===3">
                        <span>（二）</span>甲方负担部分分
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.sfbz_dw_fq }}</span>
                        <span
                          v-if="checkShow&&(proData_wt.sfbz_dw_fq!==showData.sfbz_dw_fq)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.sfbz_dw_fq }}</span>
                        期付款，学员负担部分学员自行在培训开始前向乙方一次性缴纳，具体付款时间为：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.sfbz_dw_zfsj}}</span>
                        <span
                          v-if="checkShow&&(proData_wt.sfbz_dw_zfsj!==showData.sfbz_dw_zfsj)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.sfbz_dw_zfsj}}</span>
                      </template>
                    </div>
                    <div class>
                      <span>（三）</span>付款方式：
                      <template v-if="showData.sfbz===1">甲方将培训费用汇款至乙方指定的银行账户,乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                      <template v-if="showData.sfbz===2">学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                      <template v-if="showData.sfbz===3">甲方负担部分由甲方将培训费用汇款至乙方指定的银行账户,学员负担部分由学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                    </div>
                    <div class>
                      <div>
                        <span>（四）</span>乙方的收款账户信息如下：
                      </div>
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
                  </div>
                </div>
                <div class="module-bottom">
                  <div>五、违约责任</div>
                  <div>
                    <div class>
                      在本协议约定的合作期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约（包括但不局限于本协议第二条规定的保密义务或第三条规定的限制条款），由违约方承担本次约定培训费用
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.wyjbl}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.wyjbl!==showData.wyjbl)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.wyjbl}}</span>
                      %的违约金。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div>六、其他</div>
                  <div>
                    <div class>
                      <span>（一）</span>
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
                          v-if="checkShow&&(proData_wt.jf_dz!==showData.jf_dz)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.jf_dz }}</span>
                        （详细到街道、门牌号），
                      </div>
                      <div>
                        邮编：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_yb }}</span>
                        <span
                          v-if="checkShow&&(proData_wt.jf_yb!==showData.jf_yb)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.jf_yb }}</span>
                        ，
                      </div>
                      <div>
                        具体联系人：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_lxr }}</span>
                        <span
                          v-if="checkShow&&(proData_wt.jf_lxr!==showData.jf_lxr)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.jf_lxr }}</span>
                        （姓名），
                      </div>
                      <div>
                        联系电话：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.jf_lxdh}}</span>
                        <span
                          v-if="checkShow&&(proData_wt.jf_lxdh!==showData.jf_lxdh)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_wt.jf_lxdh}}</span>
                        。
                      </div>
                      <div>2.乙方：</div>
                      <div>
                        联系地址：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_dz }}</span>
                        <span
                          v-if="checkShow&&(proConfig.ruc_info.address!==showData.yf_dz)"
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
                        >{{ showData.yf_yb }}</span>
                        <span
                          v-if="checkShow&&(proConfig.ruc_info.zip_code!==showData.yf_yb)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proConfig.ruc_info.zip_code }}</span>
                        ，
                      </div>
                      <div>
                        具体联系人：
                        <span
                          class="info-val"
                          :class="{'check-val':checkShow}"
                        >{{ showData.yf_lxr }}</span>
                        <span
                          v-if="checkShow&&(proData_jb.user!==showData.yf_lxr)"
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
                        >{{ showData.yf_lxdh}}</span>
                        <span
                          v-if="checkShow&&(proData_jb.tel!==showData.yf_lxdh)"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >{{ proData_jb.tel}}</span>
                        。
                      </div>
                    </div>
                    <div class>
                      <span>（二）</span>
                      本协议自签订之日起生效，本次培训结束后自动终止。但双方都有为完成本协议相关事项继续履行本协议项下相关义务，或在本协议终止后继续配合的义务。
                    </div>
                    <div class>
                      <span>（三）</span>
                      本协议A4纸打印，一式
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num1}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.xy_num1!==showData.xy_num1)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.xy_num1}}</span>
                      份，甲方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num2}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.xy_num2!==showData.xy_num2)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.xy_num2}}</span>
                      份，乙方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num3}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.xy_num3!==showData.xy_num3)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.xy_num3}}</span>
                      份，经双方法定代表人或其授权代表签字并盖章并加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
                    </div>
                    <div class>
                      <span>（四）</span>
                      如发生争议，应协商解决；协议不成的，双方同意采用如下争议解决方式：
                      <div>1.双方同意提交北京仲裁委员会仲裁解决，按该会届时有效的仲裁规则在北京进行仲裁。仲裁使用语言为中文。仲裁结果是终局的，对各方均有法律约束力。除非生效裁决另有规定，本合同双方为仲裁而实际支付的费用（包括但不限于仲裁费和合理的律师费）由败诉方承担。</div>
                      <div>2.在协商和仲裁期间，双方应本着诚信原则继续履行本合同不涉及争议的部分。</div>
                    </div>
                    <div class>
                      <div class="content-specific">
                        <span>（五）</span>本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议培训班实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。
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
                        <span>（六）</span>协议未尽事宜，经双方友好协商达成一致，可订立补充条款。
                        补充条款如下：（若无补充条款，请填写“无”。）
                      </div>
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
                  <div>七、附件</div>
                  <div>
                    <div class>
                      <ul class>
                        <template v-if="is_college3">
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
                        </template>
                        <template v-else>
                          <li>
                            <span class="info-val">1、中国人民大学授权委托书</span>
                          </li>
                          <li>
                            <span class="info-val">2、培训承办单位承诺书</span>
                          </li>
                          <template v-if="showData.attachment&&showData.attachment.length">
                            <li v-for="(item,index) in showData.attachment" :key="index">
                              <a :href="lookUrl +'/'+item.code" target="_blank">
                                <span class="info-val" :class="{'check-val':checkShow}">
                                  {{ index+3}}、{{ item.origin_name }}
                                  <span class="no-print">【点击查看】</span>
                                </span>
                              </a>
                            </li>
                          </template>
                          <li v-else>
                            <span class="info-val">3、（无其他附件）</span>
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
            <div v-if="!is_modListText" class="entrust-content-foot">
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
                    <el-button
                      v-if="is_signed.status"
                      type="primary"
                      @click.native="handleSigned"
                    >复 核</el-button>
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
                        style="width: 180px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >{{ showData.jf_dwmc }}</span>
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
                        style="width: 170px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >
                        中国人民大学
                        <br>
                        {{ is_college3?showData.college:''}}
                      </span>
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
            <div v-if="(!checkShow)&&(!is_college3)&&(!is_modListText)" class>
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
                      <div>
                        “{{ showData.pro_name }}”（培项字：
                        <template
                          v-for="(item,key,index) in proConfig.pxlx"
                        >
                          <span v-if="showData.pxlx==key" :key="index">{{ item | chai }}</span>
                        </template>
                        {{ showData.pro_code }}）由我单位实施全过程管理，对于培训班所涉及的管理责任和经济责任已经我单位认真研究并经我单位党政联席会议讨论通过。我单位承诺按照学校有关规定认真做好此次培训班的宣传、组织、教学等有关工作，服从学校管理，为受训单位和受训学员提供高水平的培训服务。
                      </div>
                      <div>协议签订后，我单位将作为责任主体主动承担由此培训班产生的经济和社会责任。</div>
                    </div>
                  </div>
                  <div style="margin-top: 50px">
                    <div style="text-align: right">
                      乙方下属培训承办单位（盖章）：
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
            <div class="entrust-content-head">
              <el-row>
                <el-col :span="12" :offset="6">
                  <header class>
                    <div class="entrust-content-head-title">
                      <div style="font-weight: bold;font-size: 18px">委 托 培 训 协 议 书</div>
                      <div v-if="showData.status!==3">（草稿）</div>
                    </div>
                    <div class="entrust-content-head-sub-title">（{{isYXB ? '在职课程培训班' : '非学历非学位教育培训'}}）</div>
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
                <span
                  class="tip-red"
                >{{ showData.contract_code?showData.contract_code:'审核通过后生成'}}</span>
              </div>
            </div>
            <!--内容-->
            <div class="entrust-content-body">
              <div v-if="checkShow" class="content-annotation">
                （ 以下
                <span class="tip-red">红色区域</span>为项目委托协议填写信息
                <span class="check-compare">（绿色区域为协议不同于立项前的信息）</span>，请认真审核！）
              </div>
              <!--甲乙-->
              <div class="content-body-head">
                <div class="module-bottom ja-yi">
                  <div>
                    <div class>
                      <span style="font-weight: bolder">甲方：</span>
                      <span
                        class="info-val info-val-ver2"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_dwmc }}</span>
                    </div>
                    <div>
                      联系地址：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_dz }}</span>
                      <span
                        v-if="checkShow&&(proData_wt.jf_dz!==showData.jf_dz)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.jf_dz }}</span>
                      （详细到街道、门牌号），
                    </div>
                    <div>
                      邮编：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_yb }}</span>
                      <span
                        v-if="checkShow&&(proData_wt.jf_yb!==showData.jf_yb)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.jf_yb }}</span>
                      ，
                    </div>
                    <div>
                      具体联系人：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_lxr }}</span>
                      <span
                        v-if="checkShow&&(proData_wt.jf_lxr!==showData.jf_lxr)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.jf_lxr }}</span>
                      （姓名），
                    </div>
                    <div>
                      联系电话：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.jf_lxdh}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.jf_lxdh!==showData.jf_lxdh)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.jf_lxdh}}</span>
                      。
                    </div>
                  </div>
                  <div>
                    <div class>
                      <span style="font-weight: bolder">乙方：</span>
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
                      >{{ showData.yf_dz }}</span>
                      <span
                        v-if="checkShow&&(proConfig.ruc_info.address!==showData.yf_dz)"
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
                      >{{ showData.yf_yb }}</span>
                      <span
                        v-if="checkShow&&(proConfig.ruc_info.zip_code!==showData.yf_yb)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proConfig.ruc_info.zip_code }}</span>
                      ，
                    </div>
                    <div>
                      具体联系人：
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.yf_lxr }}</span>
                      <span
                        v-if="checkShow&&(proData_jb.user!==showData.yf_lxr)"
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
                      >{{ showData.yf_lxdh}}</span>
                      <span
                        v-if="checkShow&&(proData_jb.tel!==showData.yf_lxdh)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_jb.tel}}</span>
                      。
                    </div>
                  </div>
                </div>
                <div class="module-bottom shrink-section">
                  乙方接受甲方委托举办“
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
                  ），经双方友好协商，达成如下协议：
                </div>
              </div>
              <div class="shrink-section">
                <div class="module-bottom">
                  <div style="font-weight: bolder">一、合作项目</div>
                  <div>
                    <div class>
                      <span>（一）</span>乙方承办“
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
                      <span>（二）</span>{{ isYXB ? '课程班' : '培训班' }}举办时间为：
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
                      <span>（四）</span>此次{{ isYXB ? '课程班授课' : '培训班培训' }}对象为：
                      <span
                        v-if="showData.pxdx===1"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >对委托单位内部员工进行培训</span>
                      <span
                        v-if="showData.pxdx===2"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >对委托单位下属单位或会员单位学员进行培训</span>
                      <span
                        v-if="showData.pxdx===3"
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >委托单位派内部员工参加我校组织的社会散招类培训班</span>
                      <template v-if="checkShow&&(proData_wt.pxdx!==showData.pxdx)">
                        <span
                          v-if="proData_wt.pxdx===1"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >对委托单位内部员工进行培训</span>
                        <span
                          v-if="proData_wt.pxdx===2"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >对委托单位下属单位或会员单位学员进行培训</span>
                        <span
                          v-if="proData_wt.pxdx===3"
                          class="info-val"
                          :class="{'check-compare':checkShow}"
                        >委托单位派内部员工参加我校组织的社会散招类培训班</span>
                      </template>
                      。
                    </div>
                    <div class>
                      <span>（五）</span>{{ isYXB ? '授课' : '培训' }}内容和课程安排，以及举办本期{{ isYXB ? '课程班' : '培训' }}的时间、地点、人数安排列表等详细计划如下：
                    </div>
                    <div class style="text-indent: 0;padding-left: 50px">
                      <div class="font-line" :class="{'font-line-check':checkShow}" style>
                        <span style ref="pxap" class></span>
                      </div>
                      <div
                        v-if="checkShow&&(proData_wt.pxap!==showData.pxap)"
                        class="font-line"
                        :class="{'font-line-check-compare':checkShow}"
                      >
                        <span style ref="pxap0" class></span>
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
                        >1.甲乙双方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他{{ isYXB ? '' : '培训' }}项目中继续利用对方的相关名称、品牌、商标或图形标志等进行{{ isYXB ? '' : '培训' }}宣传和招生，仅可进行正常的与本次{{ isYXB ? '课程班' : '培训' }}相关的新闻报道。</div>
                        <div
                          class
                        >2.双方在协议执行中，应采取友好协作、相互配合的态度，协议签订后如需修改本协议的相关条款或提前终止本协议，应签订补充协议或另行签订协议。</div>
                        <div class>3.双方为对方保守商业秘密：</div>
                        <div
                          class
                        >（1）甲乙双方对本协议的内容，以及在本协议履行过程中获得的对方的信息，均负有保密的义务。除甲乙双方另有约定外，保密信息包括但不限于本协议报价、协议文本以及双方标有保密字样的往来文件。</div>
                        <div
                          class
                        >（2）在未经对方书面同意前，任何一方不得将本协议及相关内容用于任何与其执行本协议无关的情况；或以任何形式向本协议以外的第三方泄漏，双方均有义务尽其一切努力防止本协议以外的他方窃取秘密信息。由于任何一方违反以上保密义务给对方造成损失，违约方对受损失方负有停止侵害、消除影响、赔偿损失的责任。</div>
                        <div class>（3）本条项下的保密义务在本协议中止或终止后依然有效。</div>
                        <div
                          class
                        >4.双方坚持简朴、节约、精简、高效的原则举办{{ isYXB ? '课程班' : '培训班' }}，除必须的现场教学和参观学习外，不得在本次{{ isYXB ? '授课' : '培训' }}过程中组织任何形式的旅游活动，乙方不为学员个人在{{ isYXB ? '授课' : '培训' }}中或{{ isYXB ? '授课' : '培训' }}后自行安排的旅游活动担负任何责任。</div>
                        <div class>
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                            style="border: none;padding-left: 0"
                          >
                            <template v-if="showData.pxdx===1">5.此次培训为甲方内部培训，甲乙双方均不得以此培训班名义对外招生。</template>
                            <template
                              v-if="showData.pxdx===2"
                            >5.此次培训为甲方组织下属单位或会员单位参加的培训班，仅面向甲方下属单位或会员单位举办培训，甲乙双方均不得以此培训班名义扩大范围对外招生。</template>
                            <template
                              v-if="showData.pxdx===3"
                            >5.此次培训为甲方派员参加乙方组织的社会散招类培训班，甲方除选派自己单位内学员参加培训外不得对外招生，但乙方除招收甲方学员外还可正常对外招收其他学员。</template>
                          </span>
                          <template v-if="checkShow&&(proData_wt.pxdx!==showData.pxdx)">
                            <span
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                              style="border: none"
                            >
                              <template v-if="proData_wt.pxdx===1">此次培训为甲方内部培训，甲乙双方均不得以此培训班名义对外招生。</template>
                              <template
                                v-if="proData_wt.pxdx===2"
                              >此次培训为甲方组织下属单位或会员单位参加的培训班，仅面向甲方下属单位或会员单位举办培训，甲乙双方均不得以此培训班名义扩大范围对外招生。</template>
                              <template
                                v-if="proData_wt.pxdx===3"
                              >此次培训为甲方派员参加乙方组织的社会散招类培训班，甲方除选派自己单位内学员参加培训外不得对外招生，但乙方除招收甲方学员外还可正常对外招收其他学员。</template>
                            </span>
                          </template>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>（二）甲方的权利和义务</div>
                      <div>
                        <div class>1.负责选派学员参加{{ isYXB ? '授课' : '培训' }}，并组织学员按双方协定的时间报到入学。</div>
                        <div class>2.提出课程和师资需求，协助乙方做好课程内容的选择和师资的确定。</div>
                        <div class>3.组织学员成立临时管理机构，协助乙方共同做好学员学习期间的教学管理和生活管理工作。</div>
                        <div class>4.保证学员在学期间遵守中国人民大学的校规校纪，保证学员{{ isYXB ? '授课' : '培训' }}期间外出、就餐等学习之外活动的安全。</div>
                        <div class>5.按照本协议的约定支付{{ isYXB ? '课程班' : '培训' }}费用。</div>
                        <div class>6.尊重和保护乙方的知识产权，即使在本协议中止或终止后。</div>
                      </div>
                    </div>
                    <div>
                      <div>（三）乙方的权利和义务</div>
                      <div>
                        <template v-if="!is_college3">
                          <div
                            class="content-specific"
                            style="font-weight: bold"
                          >1.按照《中国人民大学合同管理办法（修订）》要求，中国人民大学授权中国人民大学继续教育处代表学校作为乙方审核并签订此{{ isYXB ? '课程班' : '培训工作' }}协议。合同由继续教育处负责人签署，加盖“中国人民大学合同专用章（9）”。（授权委托书见附件1）</div>
                          <div class="content-specific" style="font-weight: bold">
                            2.本协议所议{{ isYXB ? '课程班' : '培训班' }}，具体由乙方下属中国人民大学
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.college }}</span>
                            <span
                              v-if="checkShow&&(proData_jb.college!==showData.college)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_jb.college }}</span>
                            承办，具体协议经济责任由
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
                            向中国人民大学继续教育处签定《{{ isYXB ? '课程班' : '培训' }}承办单位承诺书》（具体格式见附件2）后代表学校行使乙方权利、履行乙方义务与责任。
                          </div>
                        </template>
                        <div>{{ is_college3?1:3}}.负责按照双方商定的课程组织教学，提供或联合甲方提供适合的教学场地及设施，发放必须的学习资料，按照商定的课程表，遴选校内外具有丰富教学和实践经验的优秀教师授课，保证教学质量和所有教学工作的顺利进行。</div>
                        <div>{{ is_college3?2:4}}.在课表确定后一般不更换师资，但因授课教师特殊情况等原因，经与甲方协商后，乙方就部分课程有权在同等条件下调换同等水平的师资。</div>
                        <template v-if="isYXB">
                          <div>{{ is_college3?3:5}}.乙方须为甲方及学员在学期间的学习、生活提供必要的协助和帮助。统一安排学员的学习和生活，为课程班配备管理人员或班主任，负责学员授课期间的教学和生活管理，同时做好服务工作，如有需要，乙方须协助甲方预定房间、安排就餐，费用由甲方自负。</div>
                          <div>{{ is_college3?4:6}}.授课结束时，为完成学习任务的学员向中国人民大学有关部门申领并颁发结业证书。</div>
                          <div>{{ is_college3?5:7}}.甲方应尊重和保护乙方的知识产权，即使在本协议中止或终止后。课程班举办过程中，除双方合作开发、且在协议中有具体规定产权归属的课程外，乙方享有未做特殊规定的所有课程相关知识产权，甲方应充分尊重乙方的权利。尤其是对在线课程和课程影音数据资料，甲方不可随意传播和转售牟利。在课程培训过程中，如果有关在线课程和课程影音数据资料需在甲方平台使用，甲方须得到乙方承办院系的使用权“授权许可”，有关许可文件应包含授权内容、授权使用方式、授权期限等具体内容，有关许可文件作为业务协议由甲方与乙方承办单位自行订立。</div>
                        </template>
                        <template v-else>
                          <div>{{ is_college3?3:5}}.统一安排学员的学习和生活，为培训班配备管理人员或班主任，负责学员培训期间的教学和生活管理，同时做好服务工作，如有需要，乙方须协助甲方预定房间、安排就餐，费用由甲方自负。</div>
                          <div>{{ is_college3?4:6}}.乙方须为甲方及学员在学期间的学习、生活提供必要的协助和帮助。</div>
                          <div>{{ is_college3?5:7}}.培训结束时，为完成培训学习任务的学员向中国人民大学有关部门申领并颁发结业证书。</div>
                        </template>
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
                        <template v-if="showData.sfbz===1">甲方将{{ isYXB ? '课程班' : '培训' }}费用汇款至乙方指定的银行账户,乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                        <template v-if="showData.sfbz===2" >学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                        <template v-if="showData.sfbz===3" >甲方负担部分由甲方将{{ isYXB ? '课程班' : '培训' }}费用汇款至乙方指定的银行账户,学员负担部分由学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                      </div>
                    </div>
                    <div class>
                      <div>（二）{{ isYXB ? '课程班' : '培训项目' }}收费方式与标准</div>
                      <template>
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
                            甲方支付合计
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_dw }}</span>
                            <span
                              v-if="checkShow&&(proData_wt.sfbz_dw!==showData.sfbz_dw)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_wt.sfbz_dw }}</span>
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
                              v-if="checkShow&&(proData_wt.sfbz_xy!==showData.sfbz_xy)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_wt.sfbz_xy }}</span>
                            元/人标准向乙方支付。
                          </div>
                          <div v-if="showData.sfbz===3">
                            甲方支付合计
                            <span
                              class="info-val"
                              :class="{'check-val':checkShow}"
                            >{{ showData.sfbz_dw }}</span>
                            <span
                              v-if="checkShow&&(proData_wt.sfbz_dw!==showData.sfbz_dw)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_wt.sfbz_dw }}</span>
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
                              v-if="checkShow&&(proData_wt.sfbz_xy!==showData.sfbz_xy)"
                              class="info-val"
                              :class="{'check-compare':checkShow}"
                            >{{ proData_wt.sfbz_xy }}</span>
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
                      <div>（三）付款时间</div>
                      <div>
                        <template v-if="showData.sfbz===1">
                          甲方分
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw_fq }}</span>
                          <span
                            v-if="checkShow&&(proData_wt.sfbz_dw_fq!==showData.sfbz_dw_fq)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_dw_fq }}</span>
                          期付款，具体付款时间为：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw_zfsj}}</span>
                          <span
                            v-if="checkShow&&(proData_wt.sfbz_dw_zfsj!==showData.sfbz_dw_zfsj)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_dw_zfsj}}</span>
                        </template>
                        <template v-if="showData.sfbz===2">学员或所在单位自行在{{ isYXB ? '授课' : '培训' }}开始前向乙方一次性缴纳。</template>
                        <template v-if="showData.sfbz===3">
                          甲方负担部分分
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw_fq }}</span>
                          <span
                            v-if="checkShow&&(proData_wt.sfbz_dw_fq!==showData.sfbz_dw_fq)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_dw_fq }}</span>
                          期付款，学员负担部分学员自行在{{ isYXB ? '授课' : '培训' }}开始前向乙方一次性缴纳，具体付款时间为：
                          <span
                            class="info-val"
                            :class="{'check-val':checkShow}"
                          >{{ showData.sfbz_dw_zfsj}}</span>
                          <span
                            v-if="checkShow&&(proData_wt.sfbz_dw_zfsj!==showData.sfbz_dw_zfsj)"
                            class="info-val"
                            :class="{'check-compare':checkShow}"
                          >{{ proData_wt.sfbz_dw_zfsj}}</span>
                        </template>
                      </div>
                    </div>
                    <div class>
                      <div>（四）付款限制</div>
                      <div>
                        <template v-if="showData.sfbz===1">费用由甲方经费统一支付，甲乙双方均不得向学员个人收取任何{{ isYXB ? '' : '培训' }}费用。</template>
                        <template v-if="showData.sfbz===2" >此次{{ isYXB ? '课程班' : '培训' }}，费用由学员个人或学员所在单位直接向乙方支付，甲方不得向学员个人收取任何{{ isYXB ? '' : '培训' }}费用。</template>
                        <template v-if="showData.sfbz===3" >此次{{ isYXB ? '课程班' : '培训' }}，部分费用由甲方经费支付，部分费用由学员个人直接向乙方支付，甲方不得向学员个人收取任何{{ isYXB ? '' : '培训' }}费用。</template>
                      </div>
                    </div>
                    <div class>
                      <div>（五）乙方收款账户信息</div>
                      <div>
                        <div>1.人民币汇款信息：</div>
                        <div>收款人全称：中国人民大学{{ is_college3?showData.college:''}}；</div>
                        <div>收款人账号： {{ zh}} ；</div>
                        <div>收款人开户银行： {{ khh}} ;</div>
                        <div>汇款备注栏中必须注明收款学院和{{ isYXB ? '课程班' : '培训' }}项目名称。</div>
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
                  </div>
                </div>
                <div class="module-bottom">
                  <div style="font-weight: bolder">四、违约责任</div>
                  <div>
                    <div class>
                      在本协议约定的合作期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约（包括但不局限于本协议第二条规定的保密义务或第三条规定的限制条款），由违约方承担本次约定{{ isYXB ? '授课' : '培训' }}费用
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.wyjbl}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.wyjbl!==showData.wyjbl)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.wyjbl}}</span>
                      %的违约金。
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div style="font-weight: bolder">五、合作期限</div>
                  <div>本协议自签订之日起生效，本次{{ isYXB ? '课程' : '培训' }}结束后自动终止。但双方都有为完成本协议相关事项继续履行本协议项下相关义务，或在本协议终止后继续配合的义务。</div>
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
                        v-if="checkShow&&(proData_wt.xy_num1!==showData.xy_num1)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.xy_num1}}</span>
                      份，甲方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num2}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.xy_num2!==showData.xy_num2)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.xy_num2}}</span>
                      份，乙方执
                      <span
                        class="info-val"
                        :class="{'check-val':checkShow}"
                      >{{ showData.xy_num3}}</span>
                      <span
                        v-if="checkShow&&(proData_wt.xy_num3!==showData.xy_num3)"
                        class="info-val"
                        :class="{'check-compare':checkShow}"
                      >{{ proData_wt.xy_num3}}</span>
                      份，经双方法定代表人或其授权代表签字并盖章并加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
                    </div>
                    <div class>
                      <span>（二）</span>
                      如发生争议，应协商解决；协议不成的，双方同意采用如下争议解决方式：
                      <div>1.双方同意提交北京仲裁委员会仲裁解决，按该会届时有效的仲裁规则在北京进行仲裁。仲裁使用语言为中文。仲裁结果是终局的，对各方均有法律约束力。除非生效裁决另有规定，本合同双方为仲裁而实际支付的费用（包括但不限于仲裁费和合理的律师费）由败诉方承担。</div>
                      <div>2.在协商和仲裁期间，双方应本着诚信原则继续履行本合同不涉及争议的部分。</div>
                    </div>
                  </div>
                </div>
                <div class="module-bottom">
                  <div style="font-weight: bolder">七、合同条款修改</div>
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
                <div class="module-bottom">
                  <div style="font-weight: bolder">八、合同条款补充</div>
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
                        <template v-if="is_college3">
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
                        </template>
                        <template v-else>
                          <li>
                            <span class="info-val">1、中国人民大学授权委托书</span>
                          </li>
                          <li>
                            <span class="info-val">2、{{ isYXB ? '课程班' : '培训' }}承办单位承诺书</span>
                          </li>
                          <template v-if="showData.attachment&&showData.attachment.length">
                            <li v-for="(item,index) in showData.attachment" :key="index">
                              <a :href="lookUrl +'/'+item.code" target="_blank">
                                <span class="info-val" :class="{'check-val':checkShow}">
                                  {{ index+3}}、{{ item.origin_name }}
                                  <span class="no-print">【点击查看】</span>
                                </span>
                              </a>
                            </li>
                          </template>
                          <li v-else>
                            <span class="info-val">3、（无其他附件）</span>
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
            <div v-if="!is_modListText" class="entrust-content-foot">
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
                    <el-button
                      v-if="is_signed.status"
                      type="primary"
                      @click.native="handleSigned"
                    >复 核</el-button>
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
                        style="width: 180px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >{{ showData.jf_dwmc }}</span>
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
                        style="width: 170px;vertical-align: bottom;position: absolute;bottom: 30px;border-bottom: 1px solid #000;left: 98px;line-height: 20px"
                      >
                        中国人民大学
                        <br>
                        {{ is_college3?showData.college:''}}
                      </span>
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
            <div v-if="(!checkShow)&&(!is_college3)&&(!is_modListText)" class>
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
              <div style="page-break-before:always;">
                <br>
              </div>
              <div class>
                <h3 style="margin-bottom: 40px">附件2：</h3>
                <div class="commitment-content">
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
                          <template>({{ showData.province && showData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                          <template> ({{ showData.is_fzdw > 0 ? '辅' : '自' }})</template>
                        </template>
                        <template v-else>
                          <template v-for="(item,key,index) in proConfig.pxlx" >
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
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="$route.path.indexOf('home/') !== -1&& $route.path.indexOf('modify/list') == -1" class="four-fixed-body-top">
        <el-button v-if="!checkShow && (!is_modListText)" type="success" size="small" @click.native="doPrint">打印{{ showData.status===3?'合同':'草稿'}}</el-button>
        <el-button type="info" size="small" @click.native="backList">返 回</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
// “发票”文本修改成“中央非税收入统一票据”
const fapiaoTime = 1606492800000 // 2020-11-28 0:0:0
export default {
  name: "app-protocol-entrust-content",
  data() {
    return {
      xy_time: null, // 创建协议时间
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
      proData_wt: {},
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
      fapiaoTime
    };
  },
  computed: {
    ...mapState(["URL", "EWM", "lookUrl", "versionTime", 'userInfo'])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions([
      "getWtProtocol",
      "checkWt",
      "getProjectsData",
      "getWtForm2",
      "signWtProtocol"
    ]),
    initData(id) {
      this.showProCode = sessionStorage.getItem("PEO_CODE_show");
      this.getWtProtocol({
        data: {
          id: id
        },
        front: this.front
      }).then(data => {
        if (data.data.code === 200) {
          this.showData = data.data.data;
          this.xy_time = this.showData.create_time * 1000;
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
      this.checkWt({
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
      this.signWtProtocol({
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
      // 获取辅助单位
      this.getWtForm2({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            const comID = sessionStorage.getItem("WT_id");
            const wt_list = Data.list.filter(item => {
              return item.id == comID;
            });
            if (wt_list.length) {
              this.proData_wt = wt_list[0];
              if (
                this.checkShow &&
                this.proData_wt.pxap !== this.showData.pxap
              ) {
                this.showPxap0(this.proData_wt.pxap);
              }
            } else {
              const ID = sessionStorage.getItem("WT_pro_id");
              if (ID) {
                this.getProjectData(ID);
                sessionStorage.removeItem("WT_pro_id");
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
    // 返回协议列表
    backList () {
      // this.$router.push('/home/protocol/entrust/list')
      this.$router.go(-1)
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.$set(this.form, "uid", this.userInfo.uid)
    const Route = this.$route;
    // let front = 0;
    if (Route.path.indexOf("home") === -1) {
      this.front = 2;
    }
    if (Route.fullPath.indexOf("entrustCheck") !== -1) {
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
    sessionStorage.removeItem("WT_id");
    sessionStorage.removeItem("WT_pro_id");
    sessionStorage.removeItem("PEO_CODE_show");
    sessionStorage.removeItem("is_signed");
  }
};
</script>

<style scoped>
.app-protocol-entrust-content{
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
/*甲乙*/
.entrust-content-body-ver1 .ja-yi span.info-val {
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
.entrust-content-head {
  text-align: center;
}
.entrust-content-head-title {
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
}
</style>
