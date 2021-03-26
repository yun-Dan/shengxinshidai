<template>
  <div
    class="app-protocol-assist-content"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card v-if="xy_time">
      <!--版本一-->
      <template v-if="xy_time < versionTime">
        <div style="padding: 0 40px" class="print-content input-center" v-cloak>
          <!--头部-->
          <div class="assist-content-head">
            <header class>
              <div class="assist-content-head-title">
                <div style="font-weight: bold">培训辅助工作协议书</div>
              </div>
              <div class="assist-content-head-sub-title">（中国人民大学非学历非学位教育培训版）</div>
            </header>
          </div>
          <!--内容-->
          <div class="assist-content-body">
            <div class="content-annotation">
              以下
              <span class="tip-red">*</span>为协议必填写信息，请认真填写！
            </div>
            <!---->
            <div class="content-body-head">
              <div class="module-bottom ja-yi">
                <div class>
                  <span class="title-mark">甲方：</span>
                  <span class="info-val">中国人民大学{{ is_college3?addForm.college:''}}</span>
                </div>
                <div class>
                  <span class="title-mark">乙方：</span>
                  <span class="info-val">{{ addForm.yf_dwmc }}</span>
                </div>
              </div>
              <div class="module-bottom shrink-section">
                本着真诚合作、互利共赢、权利明确的原则，经友好商协，
                甲方与乙方就 “
                <div style="display: inline-block;text-indent: 0;width: 360px">
                  <el-input
                    v-model="addForm.pro_name"
                    placeholder="请输入项目名称"
                    style="width: 100%"
                    :disabled="true"
                  ></el-input>
                </div>” （培项字：
                <template v-for="(item,key,index) in proConfig.pxlx">
                  <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                </template>
                {{ protocolData.pro_code }}）培训辅助工作的委托协作达成如下协议，
                约定如下：
              </div>
            </div>
            <div class="shrink-section">
              <div class="module-bottom">
                <div class="title-mark">一、委托协作具体内容</div>
                <div class>
                  <div class>
                    <span>（一）</span>双方协作举办“
                    <span class="tip-red">*</span>
                    <div
                      style="display: inline-block;text-indent: 0;width: 320px;margin-bottom: 10px"
                    >
                      <el-input
                        v-model="addForm.pro_name"
                        placeholder="请输入项目名称"
                        style="width: 100%"
                        :disabled="isYXB"
                      ></el-input>
                    </div>”，
                    计划举办
                    <!--1-->
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.jhjbqs"
                        style="width: 90px"
                        :min="1"
                        controls-position="right"
                      ></el-input-number>
                    </div>期，
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.jhmqrs"
                        style="width: 110px"
                        :min="0"
                        controls-position="right"
                        :disabled="isYXB"
                      ></el-input-number>
                    </div>人/期。
                  </div>
                  <div class>
                    <div v-if="protocolData.zs_type===2">
                      <span>（二）</span>培训班招生时间为：
                      <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                        <span class="tip-red">*</span>
                        <el-date-picker
                          type="date"
                          placeholder="开始时间"
                          v-model="addForm.zs_start_time"
                        ></el-date-picker>
                        <el-date-picker
                          type="date"
                          placeholder="结束时间"
                          v-model="addForm.zs_end_time"
                        ></el-date-picker>
                      </div>。
                    </div>
                    <div>
                      <span v-if="protocolData.zs_type!==2">（二）</span>培训班举办时间（具体培训授课时间）为：
                      <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                        <span class="tip-red">*</span>
                        <el-date-picker
                          type="date"
                          placeholder="开始时间"
                          v-model="addForm.px_start_time"
                        ></el-date-picker>
                        <el-date-picker
                          type="date"
                          placeholder="结束时间"
                          v-model="addForm.px_end_time"
                        ></el-date-picker>
                      </div>。
                    </div>
                  </div>
                  <div class>
                    <span>（三）</span>该班在
                    <span class="tip-red">*</span>
                    <div
                      style="display: inline-block;text-indent: 0;width: 380px;margin-bottom: 10px"
                    >
                      <el-input v-model="addForm.pxdd" placeholder="请输入详细的授课地址" style="width: 100%"></el-input>
                    </div>(地点)授课。
                  </div>
                  <div class>
                    <span>（四）</span>
                    <span class="tip-red">*</span>
                    培训内容和课程安排，以及举办多期培训的时间、地点、人数安排等详细计划如下：
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.pxap"
                          style="width: 550px;font-size: 14px"
                          :rows="10"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    <span>（五）</span>协作双方的具体分工：
                  </div>
                  <div class>
                    1.
                    <span class="tip-red">*</span> 甲方负责该培训项目的课程设置、教师选用，以及：
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.jf_fzgz"
                          style="width: 550px;font-size: 14px"
                          :rows="5"
                          maxlength="300"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    2.
                    <span class="tip-red">*</span> 乙方负责：
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.yf_fzgz"
                          style="width: 550px;font-size: 14px"
                          :rows="5"
                          maxlength="300"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
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
                          <span class="tip-red">*</span>
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-select
                              v-model="addForm.college_id"
                              placeholder="请选择"
                              @change="handleChange"
                              disabled
                            >
                              <el-option
                                v-for="(item,index) in structuresList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </div>承办，
                          具体协议经济责任主要由
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>与甲方议定，
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>向中国人民大学继续教育处签定《培训承办单位承诺书》（具体格式见附件2）后代表学校具体承担甲方权利、义务与责任。
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
                    <div v-if="protocolData.ks_charge===2">
                      <span class="tip-red">*</span>
                      <div class style="padding-left: 60px;margin-top: 10px">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.specific_rate"
                            style="width: 550px"
                            :rows="4"
                            maxlength="300"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <div v-if="protocolData.sfbz===1">
                        委托单位统一支付
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_dw"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1"
                          ></el-input-number>
                        </div>元。
                      </div>
                      <div v-if="protocolData.sfbz===2">
                        受训学员自行按照
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_xy"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1"
                          ></el-input-number>
                        </div>元/人标准支付。
                      </div>
                      <div v-if="protocolData.sfbz===3">
                        委托单位统一支付
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_dw"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1"
                          ></el-input-number>
                        </div>元，
                        学员按照
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_xy"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1"
                          ></el-input-number>
                        </div>元/人标准。
                      </div>
                    </template>
                  </div>
                  <div class>
                    <span class="tip-red">*</span> 上述培训费具体包含以下用途和项目：
                  </div>
                  <div class>
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.pxfy_desc"
                          style="width: 550px"
                          :rows="8"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    <span class="title-mark">（二）</span>乙方不得代收学员或受训单位的培训费用，零散招收的学员应通过“中国人民大学收费管理服务系统”进行网上交费或直接汇款至甲方指定的银行账户，委托单位的培训费用直接汇款至甲方指定的银行账户,甲方负责按规定开具等额有效发票。
                  </div>
                  <div class>
                    <div>1.人民币汇款信息：</div>
                    <div>收款人全称：中国人民大学{{ is_college3?addForm.college:''}}；</div>
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
                    1.
                    <span class="tip-red">*</span> 乙方承担本次培训的辅助工作，负责以下费用的支出：
                    <div class style="padding-left: 60px;margin-top: 10px">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.yf_fyzc"
                          style="width: 550px"
                          :rows="3"
                          maxlength="300"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    2.依据乙方承担的上述辅助工作和费用支出，乙方获得{{ isYXB ? '最高' : '的总' }}分成比例为
                    <span class="tip-red">*</span>
                    <template v-if="isYXB">
                      <div style="display: inline-block;text-indent: 0;margin-bottom: 10px; margin-top: 10px;">
                        <el-input-number
                          v-model="addForm.yf_fcbl"
                          style="width: 100px" disabled
                          :min="0" controls-position="right"
                        ></el-input-number>
                      </div>%%（分成计算方法需要说明的情况：
                      <div class style="display: inline-block; padding-left: 60px; text-indent: 0;">
                        <el-input
                          type="textarea"
                          v-model="addForm.yf_fzjtfc"
                          style="width: 550px"
                          :rows="3"
                          maxlength="150"
                          show-word-limit
                        ></el-input>
                      </div> ）
                    </template>
                    <div v-else style="display: inline-block;text-indent: 0;width: 550px;margin-top: 10px;margin-bottom: 10px;padding-left: 60px;">
                      <el-input v-model="addForm.yf_fcbl" maxlength="150" type="textarea" rows="4" style="width: 100%" :disabled="true"></el-input>
                    </div>。
                  </div>
                  <div class style="margin-bottom: 10px">
                    3. 甲方分
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0;margin-bottom: 10px">
                      <el-input-number
                        v-model="addForm.yf_fqs"
                        style="width: 100px"
                        :min="1"
                        controls-position="right"
                      ></el-input-number>
                    </div>期向乙方拨付分成款，具体付款时间为：
                    <div class style="padding-left: 60px">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.yf_fqs_time"
                          style="width: 550px"
                          :rows="3"
                          maxlength="300"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    4.乙方收款账户信息（账户名称、账号、开户行，收款账户名称必须与乙方单位名称一致）：
                    <div style="margin-top: 10px">
                      <div style="display: inline-block;width: 110px;text-align: right">
                        <span class="tip-red">*</span>账户名称：
                      </div>
                      <div
                        style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                      >
                        <el-input v-model="addForm.yf_dwmc" style="width: 100%" :disabled="true"></el-input>
                      </div>；
                    </div>
                    <div>
                      <div style="display: inline-block;width: 110px;text-align: right">
                        <span class="tip-red">*</span>账号：
                      </div>
                      <div
                        style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                      >
                        <el-input v-model="addForm.yf_yhzh" style="width: 100%"></el-input>
                      </div>；
                    </div>
                    <div>
                      <div style="display: inline-block;width: 110px;text-align: right">
                        <span class="tip-red">*</span>开户行：
                      </div>
                      <div
                        style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                      >
                        <el-input v-model="addForm.yf_khh" style="width: 100%"></el-input>
                      </div>。
                    </div>
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
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.wyjbl"
                        style="width: 100px"
                        :min="1"
                        controls-position="right"
                      ></el-input-number>
                    </div>%的违约金。
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
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>联系地址：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 380px">
                        <el-input v-model="addForm.jf_dz" style="width: 100%"></el-input>
                      </div>（详细到街道、门牌号），
                    </div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>邮编：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 190px">
                        <el-input v-model="addForm.jf_yb" style="width: 100%"></el-input>
                      </div>，
                    </div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>具体联系人：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 190px">
                        <el-input v-model="addForm.jf_lxr" style="width: 100%"></el-input>
                      </div>（姓名），
                    </div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>联系电话：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 190px">
                        <el-input v-model="addForm.jf_lxdh" style="width: 100%"></el-input>
                      </div>。
                    </div>
                    <div>2.乙方：</div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>联系地址：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 380px">
                        <el-input v-model="addForm.yf_dz" style="width: 100%"></el-input>
                      </div>（详细到街道、门牌号），
                    </div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>邮编：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 190px">
                        <el-input v-model="addForm.yf_yb" style="width: 100%"></el-input>
                      </div>，
                    </div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>具体联系人：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 190px">
                        <el-input v-model="addForm.yf_lxr" style="width: 100%"></el-input>
                      </div>（姓名），
                    </div>
                    <div style="margin-bottom: 6px">
                      <div
                        style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      >
                        <span class="tip-red">*</span>联系电话：
                      </div>
                      <div style="display: inline-block;text-indent: 0;width: 190px">
                        <el-input v-model="addForm.yf_lxdh" style="width: 100%"></el-input>
                      </div>。
                    </div>
                  </div>
                  <div class>
                    <span class="title-mark">（二）</span>
                    本协议自签订之日起生效，协议期限执行至培训结束时自动终止，但双方都有为完成本协议相关事项在协议终止后继续履行本协议项下相关义务，或继续配合的义务。
                  </div>
                  <div class>
                    <span class="title-mark">（三）</span>
                    本协议一式
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.xy_num1"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>份，
                    甲方执
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.xy_num2"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>份，
                    乙方执
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.xy_num3"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>份，
                    经双方代表签字加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
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
                      <div class style="padding-left: 60px;margin: 10px 0">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.bgtk"
                            style="width: 550px"
                            :rows="6"
                            maxlength="600"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class>
                    <div>
                      <span class="title-mark">（六）</span>协议未尽事宜，经双方友好协商达成一致，可订立补充条款作为本协议的附件或订立补充协议。
                    </div>
                    <div>补充条款如下：（若无补充条款，请填写“无”。）</div>
                    <div>
                      <div class style="padding-left: 60px;margin: 10px 0">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.bctk"
                            style="width: 550px"
                            :rows="6"
                            maxlength="600"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="module-bottom">
                <div class="title-mark">八、附件</div>
                <div>
                  <div class>
                    <div class="upload-box" style="margin-top: 20px">
                      <el-upload
                        ref="upload"
                        class="upload"
                        :action="uploadExcelUrl1"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforeUpload"
                        :headers="headers"
                        name="attachment"
                        accept=".pdf, .PDF, .JPG, .jpg, .png, .PNG, .gif, .GIF"
                        :file-list="fileList"
                        :auto-upload="true"
                      >
                        <el-button
                          :key="1"
                          type="success"
                          size="mini"
                          icon="el-icon-upload el-icon--right"
                        >其它需要上传的附件</el-button>
                        <span>（只能上传PDF / jpg / png / gif 文件）</span>
                      </el-upload>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="assist-content-foot">
            <div class="foot-inscribe">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item" style="position: relative">
                    甲方（盖章）：
                    <span class="foot-inscribe-line" style="width: 160px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    乙方（盖章）：
                    <span class="foot-inscribe-line" style="width: 180px"></span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    授权代理人：
                    <span class="foot-inscribe-line" style="width: 170px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    法定代表人或授权代理人：
                    <span class="foot-inscribe-line" style="width: 120px"></span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--提交-->
          <div style="padding: 30px 0">
            <el-form :model="addForm" label-width="120px" style="text-align: left">
              <el-form-item v-if="is_update" label="本次修改说明：" :rules="[{required:true}]">
                <el-input type="textarea" v-model="addForm.update_note" style="width: 550px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="$router.go(-1)">返 回</el-button>
                <el-button type="primary" @click="handleTrue">保 存</el-button>
                <el-button v-if="!is_modify" type="primary" @click="handleSubmit">保存并提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
      <!--版本二-->
      <template v-else>
        <div style="padding: 0 40px" class="print-content input-center" v-cloak>
          <!--头部-->
          <div class="assist-content-head">
            <header class>
              <div class="assist-content-head-title">
                <div style="font-weight: bold">培训辅助工作协议书</div>
              </div>
              <div class="assist-content-head-sub-title">（{{ isYXB ? '在职课程培训班' : '非学历非学位教育培训' }}）</div>
            </header>
          </div>
          <!--内容-->
          <div class="assist-content-body">
            <div class="content-annotation">
              （以下
              <span class="tip-red">*</span>为协议必填写信息，请认真填写！）
            </div>
            <!---->
            <div class="content-body-head">
              <div class="module-bottom ja-yi">
                <!--甲方-->
                <div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      class="title-mark"
                    >甲方：</div>
                    <div style="display: inline-block;text-indent: 0;width: 520px">
                      <el-input
                        :value="`中国人民大学${is_college3?addForm.college:''}`"
                        style="width: 100%"
                        disabled
                      ></el-input>
                    </div>
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>联系地址：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 380px">
                      <el-input v-model="addForm.jf_dz" style="width: 100%"></el-input>
                    </div>（详细到街道、门牌号），
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>邮编：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 190px">
                      <el-input v-model="addForm.jf_yb" style="width: 100%"></el-input>
                    </div>，
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>具体联系人：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 190px">
                      <el-input v-model="addForm.jf_lxr" style="width: 100%"></el-input>
                    </div>（姓名），
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>联系电话：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 190px">
                      <el-input v-model="addForm.jf_lxdh" style="width: 100%"></el-input>
                    </div>。
                  </div>
                </div>
                <!--乙方-->
                <div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                      class="title-mark"
                    >乙方：</div>
                    <div style="display: inline-block;text-indent: 0;width: 520px">
                      <el-input v-model="addForm.yf_dwmc" style="width: 100%" disabled></el-input>
                    </div>
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>联系地址：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 380px">
                      <el-input v-model="addForm.yf_dz" style="width: 100%"></el-input>
                    </div>（详细到街道、门牌号），
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>邮编：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 190px">
                      <el-input v-model="addForm.yf_yb" style="width: 100%"></el-input>
                    </div>，
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>具体联系人：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 190px">
                      <el-input v-model="addForm.yf_lxr" style="width: 100%"></el-input>
                    </div>（姓名），
                  </div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right"
                    >
                      <span class="tip-red">*</span>联系电话：
                    </div>
                    <div style="display: inline-block;text-indent: 0;width: 190px">
                      <el-input v-model="addForm.yf_lxdh" style="width: 100%"></el-input>
                    </div>。
                  </div>
                </div>
              </div>
              <div class="module-bottom shrink-section">
                本着真诚合作、互利共赢、权利明确的原则，经友好商协，
                甲方与乙方就 “
                <div style="display: inline-block;text-indent: 0;width: 360px">
                  <el-input
                    v-model="addForm.pro_name"
                    placeholder="请输入项目名称"
                    style="width: 100%"
                    :disabled="true"
                  ></el-input>
                </div>” （培项字：
                <template v-if="isYXB">
                  课
                  <template>({{ proData.province && proData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                  <template> (辅)</template>
                </template>
                <template v-else>
                  <template v-for="(item,key,index) in proConfig.pxlx">
                    <span v-if="PXLX==key" :key="index">{{ item | chai }}</span>
                  </template>
                </template>
                {{ protocolData.pro_code }}）培训辅助工作的委托协作达成如下协议，
                约定如下：
              </div>
            </div>
            <!---->
            <div class="shrink-section">
              <div class="module-bottom">
                <div class="title-mark">一、委托协作具体内容</div>
                <div class>
                  <div class>
                    <span class="title-mark">（一）</span>双方协作举办“
                    <span class="tip-red">*</span>
                    <div
                      style="display: inline-block;text-indent: 0;width: 320px;margin-bottom: 10px"
                    >
                      <el-input
                        v-model="addForm.pro_name"
                        placeholder="请输入项目名称"
                        style="width: 100%"
                        :disabled="isYXB"
                      ></el-input>
                    </div>”，
                    计划举办
                    <!--1-->
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.jhjbqs"
                        style="width: 90px"
                        :min="1"
                        controls-position="right"
                      ></el-input-number>
                    </div>期，
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.jhmqrs"
                        style="width: 110px"
                        :min="0"
                        controls-position="right"
                        :disabled="isYXB"
                      ></el-input-number>
                    </div>人/期。
                  </div>
                  <div class>
                    <div v-if="protocolData.zs_type===2">
                      <span class="title-mark">（二）</span>{{ isYXB ? '课程班' : '培训班' }}招生时间为：
                      <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                        <span class="tip-red">*</span>
                        <el-date-picker
                          type="date"
                          placeholder="开始时间"
                          v-model="addForm.zs_start_time"
                        ></el-date-picker>至
                        <el-date-picker
                          type="date"
                          placeholder="结束时间"
                          v-model="addForm.zs_end_time"
                        ></el-date-picker>
                      </div>。
                    </div>
                    <div>
                      <span v-if="protocolData.zs_type!==2" class="title-mark">（二）</span>{{ isYXB ? '课程班' : '培训班' }}举办时间（具体{{ isYXB ? '' : '培训' }}授课时间）为：
                      <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                        <span class="tip-red">*</span>
                        <el-date-picker
                          type="date"
                          placeholder="开始时间"
                          v-model="addForm.px_start_time"
                        ></el-date-picker>至
                        <el-date-picker
                          type="date"
                          placeholder="结束时间"
                          v-model="addForm.px_end_time"
                        ></el-date-picker>
                      </div>。
                    </div>
                  </div>
                  <div class>
                    <span class="title-mark">（三）</span>该班在
                    <span class="tip-red">*</span>
                    <div
                      style="display: inline-block;text-indent: 0;width: 480px;margin-bottom: 10px"
                    >
                      <el-input v-model="addForm.pxdd" placeholder="请输入详细的授课地址" style="width: 100%"></el-input>
                    </div>(地点)授课。
                  </div>
                  <div class>
                    <span class="title-mark">（四）</span>
                    <span class="tip-red">*</span>
                    {{ isYXB ? '授课' : '培训' }}内容和课程安排，以及举办多期{{ isYXB ? '课程班' : '培训' }}的时间、地点、人数安排等详细计划如下：
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.pxap"
                          style="width: 550px;font-size: 14px"
                          :rows="10"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    <span class="title-mark">（五）</span>协作双方的具体分工：
                  </div>
                  <div class>
                    1.
                    <span class="tip-red">*</span> 甲方负责该{{ isYXB ? '' : '培训' }}项目的课程设置、教师选用，以及：
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.jf_fzgz"
                          style="width: 550px;font-size: 14px"
                          :rows="5"
                          maxlength="300"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class>
                    2.
                    <span class="tip-red">*</span> 乙方负责：
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.yf_fzgz"
                          style="width: 550px;font-size: 14px"
                          :rows="5"
                          maxlength="300"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
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
                      <div class>2.在本协议实施过程中和本协议履行完毕后，双方均不得使用、传播或公开在履行本项目过程中得到的对方商业秘密。具体要求如下：</div>
                      <div
                        class
                      >（1）甲乙双方对本协议的内容，以及在本协议履行过程中获得的对方的信息，均负有保密的义务。除甲乙双方另有约定外，保密信息包括但不限于本协议报价、协议文本以及双方标有保密字样的往来文件。</div>
                      <div
                        class
                      >（2）在未经对方书面同意前，任何一方不得将本协议及相关内容用于任何与其执行本协议无关的情况；或以任何形式向本协议以外的第三方泄漏，双方均有义务尽其一切努力防止本协议以外的他方窃取秘密信息。由于任何一方违反以上保密义务给对方造成损失，违约方对受损失方负有停止侵害、消除影响、赔偿损失的责任。</div>
                      <div class>（3）本条项下的保密义务在本协议中止或终止后依然有效。</div>
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
                          <span class="tip-red">*</span>
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-select
                              v-model="addForm.college_id"
                              placeholder="请选择"
                              @change="handleChange"
                              disabled
                            >
                              <el-option
                                v-for="(item,index) in structuresList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </div>承办，
                          具体协议经济责任主要由
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>与甲方议定，
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>向中国人民大学继续教育处签定《{{ isYXB ? '课程班' : '培训' }}承办单位承诺书》（具体格式见附件2）后代表学校行使甲方权利、履行甲方义务与责任。
                        </div>
                      </template>
                      <div class>{{ is_college3?1:3}}.负责制定本{{ isYXB ? '' : '培训' }}项目的整体培养方案，对于{{ isYXB ? '' : '培训的' }}课程设置和教师安排，甲方具有最终决定权。</div>
                      <div>{{ is_college3?2:4}}.负责为乙方提供招生宣传资料并对乙方发布的招生信息进行审核，对于乙方违反国家政策法规和学校规定的招生宣传活动，有权要求乙方更改或撤销，情节严重的可中止与乙方的合作，乙方负全责。</div>
                      <div>{{ is_college3?3:5}}.有权对乙方推荐或代招的学员依照规定进行学习资格审查，对于不符合招收规定的学员有权拒收，拒收学员不计为财务分成依据。</div>
                      <div>{{ is_college3?4:6}}.负责监督或组织现场教学活动并进行教学管理。</div>
                      <div>{{ is_college3?5:7}}.学员费用必须由受训单位或学员直接向甲方账户交付，甲方负责办理校内财务结算手续，并在中国人民大学财务管理部门办理与乙方的财务分成。</div>
                      <div>{{ is_college3?6:8}}.{{ isYXB ? '课程' : '培训' }}结束时，为完成{{ isYXB ? '' : '培训' }}学习任务的学员向中国人民大学有关部门申领并颁发结业证书。</div>
                      <div>{{ is_college3?7:9}}.不得指派校外人员办理中国人民大学校内立项、租借、结算等各种行政手续。</div>
                      <div>{{ is_college3?8:10}}.不向乙方提供中国人民大学域名建立招生网站。</div>
                      <div>{{ is_college3?9:11}}.不为乙方的办公和招生工作提供中国人民大学校内办公和教学场地。</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <span class="title-mark">（三）</span>乙方的权利与义务
                    </div>
                    <div>
                      <div>1.乙方承诺严格遵守中国人民大学各项规章制度，愿意接受甲方继续教育有关管理部门对{{ isYXB ? '课程班' : '培训班' }}的全流程管理。如有违规，愿意按照甲方规定接受处罚。</div>
                      <div>2.乙方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他与甲方无关的{{ isYXB ? '' : '培训' }}项目中继续利用甲方进行{{ isYXB ? '' : '培训' }}宣传和招生，但可进行正常的新闻报道。</div>
                      <div>3.乙方关于本教育{{ isYXB ? '' : '培训' }}项目所作的任何宣传，需以甲方提供的宣传资料为基础，不得向学员夸大宣传、虚假承诺。</div>
                      <div>4.乙方必须在本协议列明的授权范围内办理协作事宜，除非有合理理由，对于超越权限的事务，甲方拒绝接受或承认，由此产生的责任由乙方负责；乙方必须及时处理合作事宜，除非有合理理由，对于延迟办理某项事务造成的损失，乙方应向甲方承担赔偿责任。</div>
                      <div>5.乙方可以对{{ isYXB ? '' : '培训' }}课程的设计、招生和教学等工作提出建议。</div>
                      <div>6.乙方开展协议约定的工作，并按协议约定取得相应报酬。</div>
                      <div>7.甲方将乙方依据本协议应分的合法收入交付乙方后, 乙方必须为分成款出具正规并符合甲方要求的发票。</div>
                      <div>8.尊重和保护甲方的知识产权，即使在协议中止或终止后。</div>
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
                      <div v-if="protocolData.ks_charge===2">
                        <span class="tip-red">*</span>
                        <div class style="padding-left: 60px;margin-top: 10px">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.specific_rate"
                              style="width: 550px"
                              :rows="4"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                      </div>
                      <template v-else>
                        <div v-if="protocolData.sfbz===1">
                          委托单位统一支付
                          <span class="tip-red">*</span>
                          <div style="text-indent: 0px;display: inline-block">
                            <el-input-number
                              v-model="addForm.sfbz_dw"
                              controls-position="right"
                              :min="0"
                              :precision="2"
                              :step="1" disabled
                            ></el-input-number>
                          </div>元。
                        </div>
                        <div v-if="protocolData.sfbz===2">
                          受训学员自行按照
                          <span class="tip-red">*</span>
                          <div style="text-indent: 0px;display: inline-block">
                            <el-input-number
                              v-model="addForm.sfbz_xy"
                              controls-position="right"
                              :min="0"
                              :precision="2"
                              :step="1" disabled
                            ></el-input-number>
                          </div>元/人标准支付。
                        </div>
                        <div v-if="protocolData.sfbz===3">
                          委托单位统一支付
                          <span class="tip-red">*</span>
                          <div style="text-indent: 0px;display: inline-block">
                            <el-input-number
                              v-model="addForm.sfbz_dw"
                              controls-position="right"
                              :min="0"
                              :precision="2"
                              :step="1" disabled
                            ></el-input-number>
                          </div>元，
                          学员按照
                          <span class="tip-red">*</span>
                          <div style="text-indent: 0px;display: inline-block">
                            <el-input-number
                              v-model="addForm.sfbz_xy"
                              controls-position="right"
                              :min="0"
                              :precision="2"
                              :step="1" disabled
                            ></el-input-number>
                          </div>元/人标准。
                        </div>
                      </template>
                    </div>
                    <div class>
                      <span class="tip-red">*</span> 上述{{ isYXB ? '费用' : '培训费' }}具体包含以下用途和项目：
                    </div>
                    <div class>
                      <div class style="padding-left: 60px;margin: 10px 0">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.pxfy_desc"
                            style="width: 550px"
                            :rows="5"
                            maxlength="600"
                            show-word-limit
                          ></el-input>
                        </div>
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
                      <div>收款人全称：中国人民大学{{ is_college3?addForm.college:''}}；</div>
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
                  <template v-if="!isYXB && (fz202101 > proData.create_time * 1000)">
                    <div class>
                      <span class="title-mark">（三）</span>承担与收益
                    </div>
                    <div class>
                      1.
                      <span class="tip-red">*</span> 乙方承担本次{{ isYXB ? '课程班' : '培训' }}的辅助工作，负责以下费用的支出：
                      <div class style="padding-left: 60px;margin-top: 10px">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.yf_fyzc"
                            style="width: 550px"
                            :rows="4"
                            maxlength="300"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </div>
                    <div class>
                      <div>
                        2.依据乙方承担的上述辅助工作和费用支出，乙方获得{{ isYXB ? '的计划' : '的总' }}分成比例为
                        <span class="tip-red">*</span>
                        <template v-if="isYXB">
                          <div style="display: inline-block;text-indent: 0;margin-bottom: 10px; margin-top: 10px;">
                            <el-input-number
                              v-model="addForm.yf_fcbl"
                              style="width: 100px" disabled
                              :min="0" controls-position="right"
                            ></el-input-number>
                          </div>%，具体分成核算方法为：
                          <div class style="display: inline-block; padding-left: 60px; text-indent: 0;">
                            <el-input
                              type="textarea"
                              v-model="addForm.yf_fzjtfc"
                              style="width: 550px"
                              :rows="3"
                              maxlength="150"
                              show-word-limit
                              disabled
                            ></el-input>
                          </div>
                        </template>
                        <div v-else style="display: inline-block;text-indent: 0;width: 550px;margin-top: 10px;margin-bottom: 10px;padding-left: 60px;">
                          <el-input v-model="addForm.yf_fcbl" maxlength="150" type="textarea" rows="4" style="width: 100%" :disabled="true"></el-input>
                        </div>。
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
                    <div class style="margin-bottom: 10px">
                      <template v-if="isYXB">
                        3. 按照中国人民大学教育培训有关管理规定，甲方将保留乙方应分分成款
                        <span class="tip-red">*</span>
                        <div style="display: inline-block;text-indent: 0;margin-bottom: 10px">
                          <el-input-number
                            v-model="addForm.wg_bili"
                            style="width: 100px"
                            :min="0"
                            controls-position="right"
                          ></el-input-number>
                        </div>%，
                        待课程班全部结束后依据乙方完成辅助工作的合规情况决定是否支付。因此，甲方将分
                        <span class="tip-red">*</span>
                        <div style="display: inline-block;text-indent: 0;margin-bottom: 10px">
                          <el-input-number
                            v-model="addForm.yf_fqs"
                            style="width: 100px"
                            :min="1"
                            controls-position="right"
                          ></el-input-number>
                        </div>期向乙方拨付分成款，具体付款时间为：
                        <div class style="padding-left: 60px">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.yf_fqs_time"
                              style="width: 550px"
                              :rows="4"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        3. 甲方分
                        <span class="tip-red">*</span>
                        <div style="display: inline-block;text-indent: 0;margin-bottom: 10px">
                          <el-input-number
                            v-model="addForm.yf_fqs"
                            style="width: 100px"
                            :min="1"
                            controls-position="right"
                          ></el-input-number>
                        </div>期向乙方拨付分成款，具体付款时间为：
                        <div class style="padding-left: 60px">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.yf_fqs_time"
                              style="width: 550px"
                              :rows="4"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                      </template>
                    </div>
                    <div class>
                      4.乙方收款账户信息（账户名称、账号、开户行，收款账户名称必须与乙方单位名称一致）：
                      <div style="margin-top: 10px">
                        <div style="display: inline-block;width: 110px;text-align: right">
                          <span class="tip-red">*</span>账户名称：
                        </div>
                        <div
                          style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                        >
                          <el-input v-model="addForm.yf_dwmc" style="width: 100%" :disabled="true"></el-input>
                        </div>；
                      </div>
                      <div>
                        <div style="display: inline-block;width: 110px;text-align: right">
                          <span class="tip-red">*</span>账号：
                        </div>
                        <div
                          style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                        >
                          <el-input v-model="addForm.yf_yhzh" style="width: 100%"></el-input>
                        </div>；
                      </div>
                      <div>
                        <div style="display: inline-block;width: 110px;text-align: right">
                          <span class="tip-red">*</span>开户行：
                        </div>
                        <div
                          style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                        >
                          <el-input v-model="addForm.yf_khh" style="width: 100%"></el-input>
                        </div>。
                      </div>
                    </div>
                    <div v-if="isYXB">
                      5.课程班正式开始授课后，学员因故不能继续参加学习的，由学员个人向甲方申请，视情况办理退费。退费金额不计入总收入进行分成。
                      <div>
                        6.所有乙方协助招收的学员，必须使用“人大培训网”提供的乙方专有项目收费链接收取培训费，并以此为依据核算其招生人数和分成金额，通过汇款、现金、现场刷卡等特殊形式缴费的个人汇款，一律认定为自办招生，不予计入乙方分成人数。
                      </div>
                    </div>
                    <div v-if="!isYXB">
                      <span class="title-mark">（四）</span>培训班正式开始授课后，学员因故不能继续参加培训学习的，由学员个人向甲方申请，视情况办理培训费退费。退费金额不计入总收入进行分成。
                    </div>
                  </template>
                  <template v-else>
                    <div class>
                      <span class="title-mark">（三）</span>承担与收益
                    </div>
                    <div class>
                      1.
                      <span class="tip-red">*</span> 乙方承担本次{{ isYXB ? '课程班' : '培训' }}的辅助工作，负责以下费用的支出：
                      <div class style="padding-left: 60px;margin-top: 10px">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.yf_fyzc"
                            style="width: 550px"
                            :rows="4"
                            maxlength="300"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </div>
                    <div class>
                      <div>
                        2.依据乙方承担的上述辅助工作和费用支出，乙方获得的{{ isYXB ? '计划' : '' }}分成比例为
                        <span class="tip-red">*</span>
                        <div style="display: inline-block;text-indent: 0;margin-bottom: 10px; margin-top: 10px;">
                          <el-input-number
                            v-model="addForm.yf_fcbl"
                            style="width: 100px" disabled
                            :min="0" controls-position="right"
                          ></el-input-number>
                        </div>%，具体分成核算方法为：
                        <div class style="display: inline-block; padding-left: 60px; text-indent: 0;">
                          <el-input
                            type="textarea"
                            v-model="addForm.yf_fzjtfc"
                            style="width: 550px"
                            :rows="3"
                            maxlength="150"
                            show-word-limit
                            disabled
                          ></el-input>
                        </div>。
                      </div>
                      <div>同时，乙方承诺遵守中国人民大学教育培训有关考核规定，同意甲方视乙方在以下方面的合规情况调减实际分成比例和分成金额：</div>
                      <div>
                        <div>（1）当出现以下情况之一时，乙方分成款调减50%，情节严重的不予分成，分成款全额收归甲方学校账户：</div>
                        <div style="text-indent: 4em;">
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
                        <div style="text-indent: 4em;">
                          <div>乙方借{{ isYXB ? '课程班' : '培训班' }}之名违规收取任何其他费用，多收部分退还缴款人或缴款单位，应收部分不予分成；</div>
                          <div>乙方冒充甲方机构和人员从事侵权和违法活动；</div>
                          <div>乙方借举办{{ isYXB ? '课程班' : '培训班' }}之机向学员集资、融资，向学员推销商品、有偿服务和推荐投资项目。</div>
                        </div>
                      </div>
                      <div>
                        <div>（3）其他违规事项，双方另行商议处罚方式和分成方式。</div>
                      </div>
                    </div>
                    <div class style="margin-bottom: 10px">
                      3. 按照中国人民大学教育培训有关管理规定，甲方将保留乙方应分分成款的
                      <span class="tip-red">*</span>
                      <div style="display: inline-block;text-indent: 0;margin-bottom: 10px">
                        <el-input-number
                          v-model="addForm.wg_bili"
                          style="width: 100px"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                      </div>%，
                      待{{ isYXB ? '课程班' : '培训班' }}全部结束后依据乙方完成辅助工作的合规情况决定是否支付。因此，甲方将分
                      <span class="tip-red">*</span>
                      <div style="display: inline-block;text-indent: 0;margin-bottom: 10px">
                        <el-input-number
                          v-model="addForm.yf_fqs"
                          style="width: 100px"
                          :min="1"
                          controls-position="right"
                        ></el-input-number>
                      </div>期向乙方拨付分成款，具体付款时间为：
                      <div class style="padding-left: 60px">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.yf_fqs_time"
                            style="width: 550px"
                            :rows="4"
                            maxlength="300"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </div>
                    <div class>
                      4.乙方收款账户信息（账户名称、账号、开户行，收款账户名称必须与乙方单位名称一致）：
                      <div style="margin-top: 10px">
                        <div style="display: inline-block;width: 110px;text-align: right">
                          <span class="tip-red">*</span>账户名称：
                        </div>
                        <div
                          style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                        >
                          <el-input v-model="addForm.yf_dwmc" style="width: 100%" :disabled="true"></el-input>
                        </div>；
                      </div>
                      <div>
                        <div style="display: inline-block;width: 110px;text-align: right">
                          <span class="tip-red">*</span>账号：
                        </div>
                        <div
                          style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                        >
                          <el-input v-model="addForm.yf_yhzh" style="width: 100%"></el-input>
                        </div>；
                      </div>
                      <div>
                        <div style="display: inline-block;width: 110px;text-align: right">
                          <span class="tip-red">*</span>开户行：
                        </div>
                        <div
                          style="display: inline-block;text-indent: 0;width: 360px;margin-bottom: 10px"
                        >
                          <el-input v-model="addForm.yf_khh" style="width: 100%"></el-input>
                        </div>。
                      </div>
                    </div>
                    <div>
                      5.{{ isYXB ? '课程班' : '培训班' }}正式开始授课后，学员因故不能继续参加学习的，由学员个人向甲方申请，按照{{ isYXB ? '课程班' : '培训班' }}举办单位有关规定办理培训费退费。退费金额不计入总收入，不为乙方进行分成；在退费前已经发生的分成金额，退费发生后，乙方应及时将退费部分的培训费分成款项退还甲方。
                      <div>
                      6.面向社会零散招生的{{ isYXB ? '课程班' : '培训班' }}，所有乙方协助招收的学员，必须使用“人大培训网”提供的乙方专有项目收费链接收取培训费，并以此为依据核算其招生人数和分成金额，通过汇款、现金、现场刷卡等其他形式缴费的个人培训费，不计入乙方分成。
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
                <div class>
                  协议执行期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约，由违约方承担本次约定{{ isYXB ? '授课' : '培训' }}费用
                  <span class="tip-red">*</span>
                  <div style="display: inline-block;text-indent: 0">
                    <el-input-number
                      v-model="addForm.wyjbl"
                      style="width: 100px"
                      :min="1"
                      controls-position="right"
                    ></el-input-number>
                  </div>%的违约金。
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
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.xy_num1"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>份，
                    甲方执
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.xy_num2"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>份，
                    乙方执
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.xy_num3"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>份，
                    经双方代表签字加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
                  </div>
                  <div class>
                    <span class="title-mark">（二）</span>
                    如发生争议，应协商解决；协议不成的，提交北京仲裁委员会仲裁解决。
                  </div>
                </div>
              </div>
              <div class="module-bottom">
                <div class="title-mark">八、合同条款修改</div>
                <div class>
                  <div
                    class="content-specific"
                  >本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议{{ isYXB ? '课程班' : '培训班' }}实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。</div>
                  <div>变更条款如下：（若无变更条款，请填写“无”。）</div>
                  <div>
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.bgtk"
                          style="width: 550px"
                          :rows="6"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="module-bottom">
                <div class="title-mark">九、合同条款补充</div>
                <div class>
                  <div>协议未尽事宜，经双方友好协商达成一致，可订立补充条款作为本协议的附件或订立补充协议。</div>
                  <div>补充条款如下：（若无补充条款，请填写“无”。）</div>
                  <div>
                    <div class style="padding-left: 60px;margin: 10px 0">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.bctk"
                          style="width: 550px"
                          :rows="6"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isYXB || (proData.create_time * 1000 > fz202101)" class="module-bottom">
                <div class="title-mark">十、本协议采用网络在线形式签署，以“中国人民大学继续教育管理服务微系统”（http://xygl.peixun.ruc.edu.cn）中经过双方电子签章和电子签名数字认证的数据版本为准。其他无数字认证的下载版本、打印版本、拍照图片版本等均无法律效力，仅作为双方办理内部财务手续、档案留存和信息查阅的资料使用。</div>
              </div>
              <div class="module-bottom">
                <div class="title-mark">{{ (!isYXB && (fz202101 > proData.create_time * 1000)) ? '十' : '十一'}}、附件</div>
                <div>
                  <template v-if="!is_college3">
                    <div style="padding-left: 2em">1.中国人民大学授权委托书</div>
                    <div style="padding-left: 2em">2.{{ isYXB ? '课程班' : '培训' }}承办单位承诺书</div>
                  </template>
                  <div
                    style="padding-left: 2em"
                  >{{ is_college3 ? 1 : 3 }}.乙方资质文件复印件（含营业执照复印件与法人代表身份证复印件）</div>
                  <div class="upload-box" style="margin-top: 20px">
                    <el-upload
                      ref="upload"
                      class="upload"
                      :action="uploadExcelUrl1"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove"
                      :before-upload="beforeUpload"
                      :headers="headers"
                      name="attachment"
                      accept=".pdf, .PDF, .JPG, .jpg, .png, .PNG, .gif, .GIF"
                      :file-list="fileList"
                      :auto-upload="true"
                    >
                      <el-button
                        :key="1"
                        type="success"
                        size="mini"
                        icon="el-icon-upload el-icon--right"
                      >其它需要上传的附件</el-button>
                      <span>（只能上传PDF / JPG / PNG / GIF 文件）</span>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="assist-content-foot">
            <div class="foot-inscribe">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item" style="position: relative">
                    甲方（盖章）：
                    <span class="foot-inscribe-line" style="width: 160px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    乙方（盖章）：
                    <span class="foot-inscribe-line" style="width: 180px"></span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    授权代理人：
                    <span class="foot-inscribe-line" style="width: 170px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    法定代表人或授权代理人：
                    <span class="foot-inscribe-line" style="width: 120px"></span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--提交-->
          <div style="padding: 30px 0">
            <el-form :model="addForm" label-width="120px" style="text-align: left">
              <el-form-item v-if="is_update" label="本次修改说明：" :rules="[{required:true}]">
                <el-input type="textarea" v-model="addForm.update_note" style="width: 550px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="$router.go(-1)">返 回</el-button>
                <el-button type="primary" @click="handleTrue">保 存</el-button>
                <el-button v-if="!is_modify" type="primary" @click="handleSubmit">保存并提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "app-protocol-assist-content",
  data() {
    return {
      xy_time: null,
      loading1: false,
      proData: {},
      protocolData: {},
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      PXLX: 0,
      addForm: {
        pro_id: "0",
        uid: "0",
        com_id: "0",
        jf_dwmc: "中国人民大学",
        yf_dwmc: "0",
        zzwj: "0",
        zzwj_bm: "0",
        frdb: "0",
        dwxz: "0",
        yf_lxdh: "0",
        yf_dz: "0",
        yf_yb: "0",
        yf_lxr: "0",
        pxap: "0",
        jf_fzgz: "0",
        yf_fzgz: "0",
        yf_fyzc: "0",
        yf_fcbl: 0,
        yf_fzjtfc: '',
        wg_bili: '0',
        yf_fqs: "0",
        yf_fqs_time: "0",
        yf_yhzh: "0",
        yf_khh: "0",
        wyjbl: "0",
        xy_num1: "0",
        xy_num2: "0",
        xy_num3: "0",
        bgtk: "", // 变更条款
        bctk: "", // 补充条款
        update_note: "",
        attachment: [], // 附件信息

        //    20181010添加字段
        pro_name: "",
        zs_start_time: null,
        zs_end_time: null,
        px_start_time: null,
        px_end_time: null,
        pxdd: "",
        college_id: 0,
        college: "",
        sfbz_dw: null,
        sfbz_xy: null,
        specific_rate: '',
        pxfy_desc: "",
        jf_dz: "",
        jf_yb: "",
        jf_lxr: "",
        jf_lxdh: "",
        jhjbqs: 1,
        jhmqrs: 0,
        sfbz: 0,
        ks_charge: 1
      },
      structuresList: [],
      is_update: false,
      is_submit: false,
      //上传
      fileList: [], // 
      headers: {}, // 
      //申请修改
      is_modify: false,
      is_college3: false,
      zh: "0200007609026400244", // 
      khh: "中国工商银行股份有限公司北京紫竹院支行", // 
      
      isYXB: false,
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1", "versionTime", 'userInfo', 'fz202101'])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getFzForm3",
      "getFzProtocol",
      "addFzProtocol",
      "updateFzProtocol",
      "submitFz",
      "addModify",
      "getProjectsData"
    ]),
    initData() {
      const Route = this.$route;
      const ID = this.$route.params.id;
      if (this.userInfo.role === 2) {
        this.getStructures({
          data: {
            level: 1
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.structuresList = data.data.data;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
      if (Route.fullPath.indexOf("add") > 0) {
        this.xy_time = new Date().getTime();
        this.getProjectsData({
          data: {
            proid: ID
          }
        }).then(data => {
          if (data.data.code === 200 && data.data.data.list.length) {
            const Data_pro = data.data.data.list[0];
            this.proData = Data_pro
            this.PXLX = Data_pro.pxlx;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getFzForm3({
          data: {
            pro_id: Route.params.id
          }
        }).then(data => {
          if (data.data.code === 200 && data.data.data.list.length) {
            const Data = data.data.data.list[0];
            Object.assign(this.addForm, this.protocolData, Data, {
              jf_dz: this.proConfig.ruc_info.address,
              jf_yb: this.proConfig.ruc_info.zip_code,
              jf_lxr: this.protocolData.user,
              jf_lxdh: this.protocolData.tel,
              px_start_time: this.protocolData.px_start_time * 1000,
              px_end_time: this.protocolData.px_end_time * 1000,
              zs_start_time: this.protocolData.zs_start_time * 1000,
              zs_end_time: this.protocolData.zs_end_time * 1000,
              jhmqrs: this.protocolData.zsrs
            });
            for (let key in this.addForm) {
              if (!this.$options.data().addForm.hasOwnProperty(key)) {
                delete this.addForm[key];
              }
            }
            if (this.addForm.college) {
              const College = this.addForm.college;
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
              message: data.data.error,
              onClose: () => {
                this.$router.go(-1);
              }
            });
          }
        });
      } else {
        this.getFzProtocol({
          data: {
            id: ID
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            Object.assign(this.protocolData, Data);
            this.xy_time = this.protocolData.create_time * 1000;
            this.getProjectsData({
              data: {
                proid: Data.pro_id
              }
            }).then(data => {
              if (data.data.code === 200 && data.data.data.list.length) {
                this.$set(this.proData, 'create_time', data.data.data.list[0].create_time || 0)
                this.PXLX = data.data.data.list[0].pxlx;
              }
            });
            if (Data.status === 2) {
              this.is_update = true;
            } else {
              this.is_update = false;
            }
            this.fileList = Data.attachment.map(item => {
              return {
                name: item.origin_name,
                code: item.code,
                id: item.id
              };
            });
            let obj = Data.attachment.map(item => {
              return {
                origin_name: item.origin_name,
                code: item.code,
                id: item.id
              };
            });
            Object.assign(this.addForm, Data, {
              attachment: obj
            });
            for (let key in this.addForm) {
              if (!this.$options.data().addForm.hasOwnProperty(key)) {
                delete this.addForm[key];
              }
            }
            Object.assign(this.addForm, {
              id: Data.id,
              px_start_time: Data.px_start_time * 1000,
              px_end_time: Data.px_end_time * 1000,
              zs_start_time: Data.zs_start_time * 1000,
              zs_end_time: Data.zs_end_time * 1000
            });
            if (this.addForm.college) {
              const College = this.addForm.college;
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
            this.$router.go(-1);
          }
        });
      }
    },
    handleChange(val) {
      let College = this.structuresList.filter(item => {
        return val === item.id;
      });
      this.$set(this.addForm, "college", College[0].name);
    },
    handleTrue() {
      this.$set(this.addForm, "uid", this.userInfo.uid);
      const Obj = {};
      Object.assign(Obj, this.addForm);
      if (!Obj.yf_dwmc) {
        this.$message({
          type: "warning",
          message: "请输入乙方单位名称！"
        });
        return false;
      }
      if (!Obj.pro_name) {
        this.$message({
          type: "warning",
          message: "项目名称不能为空！"
        });
        return false;
      }
      if (!Obj.px_start_time || !Obj.px_end_time) {
        this.$message({
          type: "warning",
          message: "请选择培训班举办时间！"
        });
        return false;
      }
      if (!Obj.pxdd) {
        this.$message({
          type: "warning",
          message: "项目培训地点不能为空！"
        });
        return false;
      }
      if (!Obj.pxap) {
        this.$message({
          type: "warning",
          message: "请输入培训内容和课程安排！"
        });
        return false;
      }
      if (!Obj.jf_fzgz) {
        this.$message({
          type: "warning",
          message: "甲方负责的工作不能为空！"
        });
        return false;
      }
      if (!Obj.yf_fzgz) {
        this.$message({
          type: "warning",
          message: "乙方负责的工作不能为空！"
        });
        return false;
      }
      if (this.protocolData.ks_charge !== 2) {
        if (this.protocolData.sfbz === 1) {
          if (!(Obj.sfbz_dw >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入乙方单位支付金额！"
            });
            return false;
          }
        }
        if (this.protocolData.sfbz === 2) {
          if (!(Obj.sfbz_xy >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入学员自行支付金额！"
            });
            return false;
          }
        }
        if (this.protocolData.sfbz === 3) {
          if (!(Obj.sfbz_dw >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入乙方单位支付金额！"
            });
            return false;
          }
          if (!(Obj.sfbz_xy >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入学员自行支付金额！"
            });
            return false;
          }
        }
      }
      if (this.protocolData.ks_charge === 2) {
        if (!Obj.specific_rate) {
          this.$message({
            type: "warning",
            message: "请输入具体收费方式！"
          });
          return false;
        }
      }
      if (!Obj.pxfy_desc) {
        this.$message({
          type: "warning",
          message: "培训费具体包含用途和项目说明不能为空！"
        });
        return false;
      } else if (Obj.pxfy_desc.length > 600) {
        this.$message({
          type: "warning",
          message: "培训费具体包含用途和项目说明不得超出600字！"
        });
        return false;
      }
      if (!Obj.yf_fyzc) {
        this.$message({
          type: "warning",
          message: "请输入乙方负责费用支出说明！"
        });
        return false;
      } else if (Obj.yf_fyzc.length > 200) {
        this.$message({
          type: "warning",
          message: "乙方负责费用支出说明不得超出200字！"
        });
        return false;
      }
      if (!Obj.yf_fcbl) {
        this.$message({
          type: "warning",
          message: `请输入乙方获得${ this.isYXB ? '最高' : '的总' }分成比例！`
        });
        return false;
      }
      if (!Obj.yf_fzjtfc && (this.isYXB || (this.proData.create_time * 1000) > this.fz202101)) {
        this.$message({
          type: "warning",
          message: `请输入分成计算方法需要说明的情况！`
        });
        return false;
      }
      if (!Obj.yf_fqs) {
        this.$message({
          type: "warning",
          message: "请输入分成款分期数！"
        });
        return false;
      }
      if (!Obj.yf_fqs_time) {
        this.$message({
          type: "warning",
          message: "请输入分成款分期具体付款时间说明！"
        });
        return false;
      } else if (Obj.yf_fqs_time.length > 200) {
        this.$message({
          type: "warning",
          message: "分成款分期具体付款时间说明不得超出200字！"
        });
        return false;
      }
      if (!Obj.yf_yhzh) {
        this.$message({
          type: "warning",
          message: "请输入收款账号！"
        });
        return false;
      }
      if (!Obj.yf_khh) {
        this.$message({
          type: "warning",
          message: "请输入乙方开户行！"
        });
        return false;
      }
      if (!Obj.wyjbl) {
        this.$message({
          type: "warning",
          message: "请输入违约金比例！"
        });
        return false;
      }
      if (!Obj.jf_dz) {
        this.$message({
          type: "warning",
          message: "请输入请输入甲方联系地址！"
        });
        return false;
      }
      if (!Obj.jf_yb) {
        this.$message({
          type: "warning",
          message: "请输入甲方邮编！"
        });
        return false;
      }
      if (!Obj.jf_lxr) {
        this.$message({
          type: "warning",
          message: "请输入甲方联系人电话！"
        });
        return false;
      }
      if (!Obj.jf_lxdh) {
        this.$message({
          type: "warning",
          message: "请输入甲方联系人电话！"
        });
        return false;
      }
      if (!Obj.yf_dz) {
        this.$message({
          type: "warning",
          message: "请输入请输入乙方联系地址！"
        });
        return false;
      }
      if (!Obj.yf_yb) {
        this.$message({
          type: "warning",
          message: "请输入乙方邮编！"
        });
        return false;
      }
      if (!Obj.yf_lxr) {
        this.$message({
          type: "warning",
          message: "请输入乙方联系人电话！"
        });
        return false;
      }
      if (!Obj.yf_lxdh) {
        this.$message({
          type: "warning",
          message: "请输入乙方联系人电话！"
        });
        return false;
      }
      if (!Obj.xy_num1) {
        this.$message({
          type: "warning",
          message: "请输入协议总份数！"
        });
        return false;
      }
      if (!Obj.xy_num2) {
        this.$message({
          type: "warning",
          message: "请输入甲方执份数！"
        });
        return false;
      }
      if (!Obj.xy_num3) {
        this.$message({
          type: "warning",
          message: "请输入乙方执份数！"
        });
        return false;
      }
      Object.assign(Obj, this.addForm, {
        px_start_time: new Date(this.addForm.px_start_time).getTime() / 1000,
        px_end_time: new Date(this.addForm.px_end_time).getTime() / 1000,
        zs_start_time: this.addForm.zs_start_time
          ? new Date(this.addForm.zs_start_time).getTime() / 1000
          : 0,
        zs_end_time: this.addForm.zs_end_time
          ? new Date(this.addForm.zs_end_time).getTime() / 1000
          : 0
      });

      this.loading1 = true;
      if (this.$route.fullPath.indexOf("add") > 0) {
        this.addFzProtocol({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            if (this.is_submit) {
              // 新增并提交
              this.submitFz({
                data: {
                  id: data.data.data
                }
              }).then(data => {
                if (data.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.backList()
                    }
                  });
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: data.data.error,
                    onClose: () => {
                      this.loading1 = false;
                    }
                  });
                }
              });
            } else {
              //新增保存
              this.$message({
                type: "success",
                message: "操作成功",
                onClose: () => {
                  this.backList()
                }
              });
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading1 = false;
              }
            });
          }
        });
      } else {
        if (!this.is_update) {
          delete Obj.update_note;
        } else {
          if (this.is_submit) {
            Object.assign(Obj, {
              sub_cont: 3
            });
          }
        }
        if (this.is_modify) {
          delete Obj.pro_id;
          delete Obj.yf_dwmc;
          delete Obj.jf_dwmc;
          delete Obj.zzwj;
          delete Obj.zzwj_bm;
          delete Obj.frdb;
          delete Obj.dwxz;
          delete Obj.update_note;
          Object.assign(Obj, {
            cont_type: 2
          });
        }
        if (!this.is_modify) {
          this.updateFzProtocol({
            data: Obj
          }).then(data => {
            if (data.data.code === 200) {
              if (this.is_submit) {
                // 编辑并提交
                this.submitFz({
                  data: {
                    id: this.$route.params.id
                  }
                }).then(data => {
                  if (data.data.code === 200) {
                    this.$message({
                      type: "success",
                      message: data.data.data,
                      onClose: () => {
                        this.backList()
                      }
                    });
                  } else {
                    this.$notify.error({
                      title: "错误",
                      message: data.data.error,
                      onClose: () => {
                        this.loading1 = false;
                      }
                    });
                  }
                });
              } else {
                //编辑保存
                this.$message({
                  type: "success",
                  message: "操作成功",
                  onClose: () => {
                    this.backList()
                  }
                });
              }
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading1 = false;
                }
              });
            }
          });
        } else {
          this.addModify({
            data: Obj
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功",
                onClose: () => {
                  this.loading1 = false;
                  this.$router.go(-1);
                }
              });
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading1 = false;
                }
              });
            }
          });
        }
      }
    },
    handleSubmit() {
      this.is_submit = true;
      this.handleTrue();
    },
    beforeUpload(file) {
      const isTYPE =
        file.type === "application/pdf" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.name.indexOf(".jpg") !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传文件只能是 PDF/ jpg/ png/ gif 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    }, // PDF png jpg gif
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.addForm.attachment = fileList.map(item => {
          if (item.response) {
            return {
              origin_name: item.response.data.origin_name,
              code: item.response.data.code
            };
          } else {
            return {
              origin_name: item.name,
              code: item.code,
              id: item.id
            };
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove(file, fileList) {
      this.addForm.attachment = fileList.map(item => {
        if (item.response) {
          return {
            origin_name: item.response.data.origin_name,
            code: item.response.data.code
          };
        } else {
          return {
            origin_name: item.name,
            code: item.code,
            id: item.id
          };
        }
      });
    },
    backList () {
      // this.$router.push('/home/protocol/assist/list')
      this.$router.go(-1)
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"));
    if (sessionStorage.getItem("ProtocolAssist")) {
      this.protocolData = JSON.parse(sessionStorage.getItem("ProtocolAssist"));
    }
    if (sessionStorage.getItem("SQXG")) {
      this.is_modify = true;
    }
    this.initData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("ProtocolAssist");
    sessionStorage.removeItem("SQXG");
  }
};
</script>

<style scoped>
/*样式*/
.print-content {
  width: 900px;
  line-height: 24px;
  margin: 0 auto;
}
/*查看时插值*/
span.info-val {
  padding: 0 10px;
  border-bottom: 1px solid #000;
  color: #000;
}
/*输入框*/
.input-val {
  padding: 0 4px;
  border-bottom: 1px solid #f56c6c;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}
.textarea-val {
  width: 80%;
  padding: 0 4px;
  margin: 0 40px;
  /*border-color: #f56c6c;*/
  border-bottom: 1px solid #f56c6c;
  font-size: 14px;
  line-height: 20px;
  resize: vertical;
}
/*甲乙*/
.ja-yi span.info-val {
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
#subOutputRank-print .commitment-content {
  font-size: 14px;
  line-height: 28px;
}
/*备注*/
.content-annotation {
  line-height: 40px;
}
/*输入文字数量*/
.font-num-total {
  padding: 0 4px;
  font-size: 12px;
  line-height: 12px;
  color: #f56c6c;
}

.el-upload__tip {
  padding-left: 30px;
}
</style>
