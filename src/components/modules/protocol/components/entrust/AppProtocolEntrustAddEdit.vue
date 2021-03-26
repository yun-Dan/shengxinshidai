<template>
  <div
    class="app-protocol-entrust-add-edit"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card v-if="xy_time">
      <!--版本一-->
      <template v-if="xy_time < versionTime">
        <div style="padding: 0 40px" class="print-content input-center" v-cloak>
          <!--头部-->
          <div class="entrust-content-head">
            <header class>
              <div class="entrust-content-head-title">
                <div style="font-weight: bold">委 托 培 训 协 议 书</div>
              </div>
              <div class="entrust-content-head-sub-title">（中国人民大学非学历非学位教育培训版）</div>
            </header>
          </div>
          <!--内容-->
          <div class="entrust-content-body">
            <div class="content-annotation">
              以下 标记
              <span class="tip-red">*</span>处 为协议必填写信息，请认真填写！
            </div>
            <!--甲乙-->
            <div class="content-body-head">
              <div class="module-bottom ja-yi">
                <div class>
                  <span>甲方：</span>
                  <span class="info-val">{{ addForm.jf_dwmc }}</span>
                </div>
                <div class>
                  <span>乙方：</span>
                  <span class="info-val">中国人民大学{{ is_college3?addForm.college:''}}</span>
                </div>
              </div>
              <div class="module-bottom shrink-section">
                乙方接受甲方委托举办“
                <div style="display: inline-block;text-indent: 0;width: 640px">
                  <el-input
                    v-model="addForm.pro_name"
                    placeholder="请输入项目名称"
                    style="width: 100%"
                    :disabled="true"
                  ></el-input>
                </div>”（
                培项字：
                <template v-if="isYXB">课</template>
                <template v-else>
                  <template v-for="(item,key,index) in proConfig.pxlx">
                    <span v-if="propData.pxlx==key" :key="index">{{ item | chai }}</span>
                  </template>
                </template>
                <!-- {{ propData.pro.pro_code }} -->
                {{ proCodeStr }}
                ），经双方友好协商，达成如下协议：
              </div>
            </div>
            <div class="shrink-section">
              <div class="module-bottom">
                <div>一、合作项目</div>
                <div>
                  <div class>
                    <span>（一）</span>乙方承办“
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0;width: 640px">
                      <el-input
                        v-model="addForm.pro_name"
                        placeholder="请输入项目名称"
                        style="width: 100%"
                        :disabled="isYXB"
                      ></el-input>
                    </div>”，
                    计划举办
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
                  <div class style="margin: 10px 0">
                    <span>（二）</span>培训班举办时间为：
                    <div style="text-indent: 0;display: inline-block">
                      <span class="tip-red">*</span>
                      <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model="addForm.px_start_time"
                      ></el-date-picker>
                      <el-date-picker type="date" placeholder="结束时间" v-model="addForm.px_end_time"></el-date-picker>
                    </div>
                  </div>
                  <div class style="margin-bottom: 10px">
                    <span>（三）</span>该班在
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0;width: 380px">
                      <el-input v-model="addForm.pxdd" placeholder="请输入详细的培训地址" style="width: 100%"></el-input>
                    </div>(地点)授课。
                  </div>
                  <div class>
                    <span>（四）</span>
                    <span class="tip-red">*</span>
                    此次培训班培训对象为：
                    <div style="margin: 10px 0">
                      <div>
                        <el-radio v-model="addForm.pxdx" :label="1">对委托单位内部员工进行培训</el-radio>
                      </div>
                      <div>
                        <el-radio v-model="addForm.pxdx" :label="2">对委托单位下属单位或会员单位学员进行培训</el-radio>
                      </div>
                      <div>
                        <el-radio v-model="addForm.pxdx" :label="3">委托单位派内部员工参加我校组织的社会散招类培训班</el-radio>
                      </div>
                    </div>
                  </div>
                  <div class>
                    <span>（五）</span>
                    <span class="tip-red">*</span>
                    <span>培训内容和课程安排，以及举办本期培训的时间、地点、人数安排列表等详细计划如下：</span>
                  </div>
                  <div class style="padding-left: 60px;margin-top: 10px">
                    <div style="text-indent: 0">
                      <el-input
                        type="textarea"
                        v-model="addForm.pxap"
                        style="width: 550px"
                        :rows="8"
                        maxlength="600"
                        show-word-limit
                      ></el-input>
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
                          具体协议经济责任由
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>与甲方议定，
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>与中国人民大学继续教育处签定《培训承办单位承诺书》（具体格式见附件2）后代表学校具体承担乙方权利、义务与责任。
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
                    <template v-if="addForm.pxdx===1">（二）此次培训为甲方内部培训，甲乙双方均不得以此培训班名义对外招生。</template>
                    <template
                      v-if="addForm.pxdx===2"
                    >（二）此次培训为甲方组织下属单位或会员单位参加的培训班，仅面向甲方下属单位或会员单位举办培训，甲乙双方均不得以此培训班名义扩大范围对外招生。</template>
                    <template
                      v-if="addForm.pxdx===3"
                    >（二）此次培训为甲方派员参加乙方组织的社会散招类培训班，甲方除选派自己单位内学员参加培训外不得对外招生，但乙方除招收甲方学员外还可正常对外招收其他学员。</template>
                  </div>
                  <div class>
                    <template v-if="sfbzVal===1">（三）费用由甲方经费统一支付，甲乙双方均不得向学员个人收取任何培训费用。</template>
                    <template v-if="sfbzVal===2">（三）此次培训，费用由学员个人或学员所在单位直接向乙方支付，甲方不得向学员个人收取任何培训费用。</template>
                    <template v-if="sfbzVal===3">（三）此次培训，部分费用由甲方经费支付，部分费用由学员个人直接向乙方支付，甲方不得向学员个人收取任何培训费用。</template>
                  </div>
                </div>
              </div>
              <div class="module-bottom">
                <div>四、项目费用及付款方式</div>
                <div>
                  <div class>
                    <span>（一）</span>培训项目收费方式与标准：
                  </div>
                  <div class style="margin: 10px 0">
                    <div v-if="ksCharge===2">
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
                      <div v-if="sfbzVal===1">
                        甲方支付合计
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
                      <div v-if="sfbzVal===2">
                        由学员个人或所在单位按照
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_xy"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1"
                          ></el-input-number>
                        </div>元/人标准向乙方支付。
                      </div>
                      <div v-if="sfbzVal===3">
                        甲方支付合计
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
                        剩余部分由学员按照
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_xy"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1"
                          ></el-input-number>
                        </div>元/人标准向乙方支付。
                      </div>
                    </template>
                  </div>
                  <div class>
                    <span class="tip-red">*</span>
                    费用具体包括：
                    <div class style="padding-left: 60px;margin-top: 10px">
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
                  <div class style="margin: 10px 0">
                    <template v-if="sfbzVal===1">
                      <span>（二）</span>甲方分
                      <span class="tip-red">*</span>
                      <div style="display: inline-block;text-indent: 0">
                        <el-input-number
                          v-model="addForm.sfbz_dw_fq"
                          style="width: 100px"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                      </div>期付款，
                      <div>
                        <span class="tip-red">*</span>
                        具体付款时间为：
                      </div>
                      <div class style="padding-left: 60px;margin-top: 10px">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.sfbz_dw_zfsj"
                            style="width: 550px"
                            :rows="3"
                            maxlength="300"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </template>
                    <template v-if="sfbzVal===2">
                      <span>（二）</span>学员或所在单位自行在培训开始前向乙方一次性缴纳。
                    </template>
                    <template v-if="sfbzVal===3">
                      <span>（二）</span>甲方负担部分分
                      <span class="tip-red">*</span>
                      <div style="display: inline-block;text-indent: 0">
                        <el-input-number
                          v-model="addForm.sfbz_dw_fq"
                          style="width: 100px"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                      </div>期付款，
                      学员负担部分学员自行在培训开始前向乙方一次性缴纳，
                      <div>
                        <span class="tip-red">*</span>具体付款时间为：
                      </div>
                      <div class style="padding-left: 60px;margin-top: 10px">
                        <div style="text-indent: 0">
                          <el-input
                            type="textarea"
                            v-model="addForm.sfbz_dw_zfsj"
                            style="width: 550px"
                            :rows="3"
                            maxlength="300"
                            show-word-limit
                          ></el-input>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class>
                    <span>（三）</span>付款方式：
                    <template v-if="sfbzVal===1">甲方将培训费用汇款至乙方指定的银行账户,乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                    <template v-if="sfbzVal===2">学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                    <template
                      v-if="sfbzVal===3"
                    >甲方负担部分由甲方将培训费用汇款至乙方指定的银行账户,学员负担部分由学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                  </div>
                  <div class>
                    <div>
                      <span>（四）</span>乙方的收款账户信息如下：
                    </div>
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
                </div>
              </div>
              <div class="module-bottom">
                <div>五、违约责任</div>
                <div>
                  <div class>
                    在本协议约定的合作期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约（包括但不局限于本协议第二条规定的保密义务或第三条规定的限制条款），
                    由违约方承担本次约定培训费用
                    <span
                      class="tip-red"
                    >*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.wyjbl"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>%的违约金。
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
                    <div>1、甲方：</div>
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
                    <div>2、乙方：</div>
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
                    <span>（二）</span>
                    本协议自签订之日起生效，本次培训结束后自动终止。但双方都有为完成本协议相关事项继续履行本协议项下相关义务，或在本协议终止后继续配合的义务。
                  </div>
                  <div class>
                    <span>（三）</span>
                    本协议A4纸打印，一式
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
                    </div>份，经双方法定代表人或其授权代表签字并盖章并加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
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
                      <span>（六）</span>协议未尽事宜，经双方友好协商达成一致，可订立补充条款。
                      补充条款如下：（若无补充条款，请填写“无”。）
                    </div>
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
              <div class="module-bottom">
                <div>七、附件</div>
                <div>
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
          <div class="entrust-content-foot">
            <!--落款-->
            <div class="foot-inscribe">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    甲方（盖章）：
                    <span class="foot-inscribe-line" style="width: 180px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    乙方（盖章）：
                    <span class="foot-inscribe-line"></span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    法定代表人或授权代理人 ：
                    <span class="foot-inscribe-line" style="width: 110px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    授权代理人：
                    <span class="foot-inscribe-line" style="width: 170px"></span>
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
                <div style="margin-top: 20px">
                  <el-button @click="$router.go(-1)">返 回</el-button>
                  <el-button type="primary" @click="handleTrueSave">保 存</el-button>
                  <el-button v-if="!is_modify" type="primary" @click="handleTrueSubmit">保存并提交</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
      <!--版本二-->
      <template v-else>
        <div style="padding: 0 40px" class="print-content input-center" v-cloak>
          <!--头部-->
          <div class="entrust-content-head">
            <header class>
              <div class="entrust-content-head-title">
                <div style="font-weight: bold">委 托 培 训 协 议 书</div>
              </div>
              <div class="entrust-content-head-sub-title">（{{isYXB ? '在职课程培训班' : '非学历非学位教育培训'}}）</div>
            </header>
          </div>
          <!--内容-->
          <div class="entrust-content-body">
            <div class="content-annotation">
              （ 以下 标记
              <span class="tip-red">*</span>处 为协议必填写信息，请认真填写！）
            </div>
            <!--甲乙-->
            <div class="content-body-head">
              <div class="module-bottom ja-yi">
                <!--甲方-->
                <div>
                  <div style="margin-bottom: 6px">
                    <div
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right; font-weight: bolder"
                    >甲方：</div>
                    <div style="display: inline-block;text-indent: 0;width: 520px">
                      <el-input v-model="addForm.jf_dwmc" :disabled="addForm.gl_type!=1" style="width: 100%"></el-input>
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
                      style="display: inline-block;text-indent: 0;width: 100px;text-align: right; font-weight: bolder"
                    >乙方：</div>
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
                乙方接受甲方委托举办“
                <div style="display: inline-block;text-indent: 0;width: 640px">
                  <el-input
                    v-model="addForm.pro_name"
                    placeholder="请输入项目名称"
                    style="width: 100%"
                    :disabled="true"
                  ></el-input>
                </div>”（
                培项字：
                <template v-if="isYXB">
                  课
                  <template>({{ propData.province && propData.province.indexOf('北京') !== -1 ? '京' : '外' }})</template>
                  <template> ({{ propData.is_fzdw > 0 ? '辅' : '自' }})</template>
                </template>
                <template v-else>
                  <template v-for="(item,key,index) in proConfig.pxlx">
                    <span v-if="propData.pxlx==key" :key="index">{{ item | chai }}</span>
                  </template>
                </template>
                <!-- {{ propData.pro.pro_code }} -->
                {{ proCodeStr }}
                ），经双方友好协商，达成如下协议：
              </div>
            </div>
            <div class="shrink-section">
              <div class="module-bottom">
                <div style="font-weight: bolder">一、合作项目</div>
                <div>
                  <div class>
                    <span>（一）</span>乙方承办“
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0;width: 640px">
                      <el-input
                        v-model="addForm.pro_name"
                        placeholder="请输入项目名称"
                        style="width: 100%"
                        :disabled="isYXB"
                      ></el-input>
                    </div>”，
                    计划举办
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
                  <div class style="margin: 10px 0">
                    <span>（二）</span>{{ isYXB ? '课程班' : '培训班' }}举办时间为：
                    <div style="text-indent: 0;display: inline-block">
                      <span class="tip-red">*</span>
                      <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model="addForm.px_start_time"
                      ></el-date-picker>至
                      <el-date-picker type="date" placeholder="结束时间" v-model="addForm.px_end_time"></el-date-picker>
                    </div>
                  </div>
                  <div class style="margin-bottom: 10px">
                    <span>（三）</span>该班在
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0;width: 380px">
                      <el-input v-model="addForm.pxdd" placeholder="请输入详细的培训地址" style="width: 100%"></el-input>
                    </div>(地点)授课。
                  </div>
                  <div class>
                    <span>（四）</span>
                    <span class="tip-red">*</span>
                    此次{{ isYXB ? '课程班授课' : '培训班培训' }}对象为：
                    <div style="margin: 10px 0">
                      <div>
                        <el-radio v-model="addForm.pxdx" :label="1">对委托单位内部员工进行培训</el-radio>
                      </div>
                      <div>
                        <el-radio v-model="addForm.pxdx" :label="2">对委托单位下属单位或会员单位学员进行培训</el-radio>
                      </div>
                      <div>
                        <el-radio v-model="addForm.pxdx" :label="3">委托单位派内部员工参加我校组织的社会散招类培训班</el-radio>
                      </div>
                    </div>
                  </div>
                  <div class>
                    <span>（五）</span>
                    <span class="tip-red">*</span>
                    <span>{{ isYXB ? '授课' : '培训' }}内容和课程安排，以及举办本期{{ isYXB ? '课程班' : '培训' }}的时间、地点、人数安排列表等详细计划如下：</span>
                  </div>
                  <div class style="padding-left: 60px;margin-top: 10px">
                    <div style="text-indent: 0">
                      <el-input
                        type="textarea"
                        v-model="addForm.pxap"
                        style="width: 550px"
                        :rows="8"
                        maxlength="600"
                        show-word-limit
                      ></el-input>
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
                      >（2）在未经对方书面同意前，任何一方不得将本协议及相关内容用于任何与其执行本协议无关的事项；或以任何形式向本协议以外的第三方泄漏，双方均有义务尽其一切努力防止本协议以外的他方窃取秘密信息。由于任何一方违反以上保密义务给对方造成损失，违约方对受损失方负有停止侵害、消除影响、赔偿损失的责任。</div>
                      <div class>（3）本条项下的保密义务在本协议中止或终止后依然有效。</div>
                      <div
                        class
                      >4.双方坚持简朴、节约、精简、高效的原则举办{{ isYXB ? '课程班' : '培训班' }}，除必须的现场教学和参观学习外，不得在本次{{ isYXB ? '授课' : '培训' }}过程中组织任何形式的旅游活动，乙方不为学员个人在{{ isYXB ? '授课' : '培训' }}中或{{ isYXB ? '授课' : '培训' }}后自行安排的旅游活动担负任何责任。</div>
                      <div class>
                        <template v-if="addForm.pxdx===1">5.此次培训为甲方内部培训，甲乙双方均不得以此培训班名义对外招生。</template>
                        <template
                          v-if="addForm.pxdx===2"
                        >5.此次培训为甲方组织下属单位或会员单位参加的培训班，仅面向甲方下属单位或会员单位举办培训，甲乙双方均不得以此培训班名义扩大范围对外招生。</template>
                        <template
                          v-if="addForm.pxdx===3"
                        >5.此次培训为甲方派员参加乙方组织的社会散招类培训班，甲方除选派自己单位内学员参加培训外不得对外招生，但乙方除招收甲方学员外还可正常对外招收其他学员。</template>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>（二）甲方的权利和义务：</div>
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
                    <div>（三）乙方的权利和义务：</div>
                    <div>
                      <template v-if="!is_college3">
                        <div
                          class="content-specific"
                          style="font-weight: bold"
                        >1.按照《中国人民大学合同管理办法（修订）》要求，中国人民大学授权中国人民大学继续教育处代表学校作为乙方审核并签订此{{ isYXB ? '课程班' : '培训工作' }}协议。合同由继续教育处负责人签署，加盖“中国人民大学合同专用章（9）”。（授权委托书见附件1）</div>
                        <div class="content-specific" style="font-weight: bold">
                          2.本协议所议{{ isYXB ? '课程班' : '培训班' }}，具体由乙方下属中国人民大学
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
                          具体协议经济责任由
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>与甲方议定，
                          <div style="text-indent: 0;display: inline-block;margin-bottom: 10px">
                            <el-input v-model="addForm.college" :disabled="true"></el-input>
                          </div>向中国人民大学继续教育处签定《{{ isYXB ? '课程班' : '培训' }}承办单位承诺书》（具体格式见附件2）后代表学校行使乙方权利、履行乙方义务与责任。
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
                    <div>
                      <span>（一）</span>付款方式
                    </div>
                    <div>
                      <template v-if="sfbzVal===1">甲方将{{ isYXB ? '课程班' : '培训' }}费用汇款至乙方指定的银行账户,乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                      <template v-if="sfbzVal===2">学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                      <template v-if="sfbzVal===3">甲方负担部分由甲方将{{ isYXB ? '课程班' : '培训' }}费用汇款至乙方指定的银行账户,学员负担部分由学员通过中国人民大学收费系统缴纳或汇款至乙方指定银行账户，乙方负责开具等额有效<template v-if="fapiaoTime > xy_time">发票</template><template v-else>中央非税收入统一票据</template>。</template>
                    </div>
                  </div>
                  <div class>
                    <span>（二）</span>{{ isYXB ? '课程班' : '培训项目' }}收费方式与标准
                  </div>
                  <div class style="margin: 10px 0">
                    <div v-if="ksCharge===2">
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
                      <div v-if="sfbzVal===1">
                        甲方支付合计
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_dw"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1" :disabled="addForm.gl_type!=1"
                          ></el-input-number>
                        </div>元。
                      </div>
                      <div v-if="sfbzVal===2">
                        由学员个人或所在单位按照
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_xy"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1" disabled
                          ></el-input-number>
                        </div>元/人标准向乙方支付。
                      </div>
                      <div v-if="sfbzVal===3">
                        甲方支付合计
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
                        剩余部分由学员按照
                        <span class="tip-red">*</span>
                        <div style="text-indent: 0px;display: inline-block">
                          <el-input-number
                            v-model="addForm.sfbz_xy"
                            controls-position="right"
                            :min="0"
                            :precision="2"
                            :step="1" disabled
                          ></el-input-number>
                        </div>元/人标准向乙方支付。
                      </div>
                    </template>
                  </div>
                  <div class>
                    <span class="tip-red">*</span>
                    费用具体包括：
                    <div class style="padding-left: 60px;margin-top: 10px">
                      <div style="text-indent: 0">
                        <el-input
                          type="textarea"
                          v-model="addForm.pxfy_desc"
                          style="width: 550px"
                          :rows="6"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class style="margin: 10px 0">
                    <div>（三）付款时间</div>
                    <div>
                      <template v-if="sfbzVal===1">
                        甲方分
                        <span class="tip-red">*</span>
                        <div style="display: inline-block;text-indent: 0">
                          <el-input-number
                            v-model="addForm.sfbz_dw_fq"
                            style="width: 100px"
                            :min="0"
                            controls-position="right"
                          ></el-input-number>
                        </div>期付款，
                        <div>
                          <span class="tip-red">*</span>
                          具体付款时间为：
                        </div>
                        <div class style="padding-left: 60px;margin-top: 10px">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.sfbz_dw_zfsj"
                              style="width: 550px"
                              :rows="3"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                      </template>
                      <template v-if="sfbzVal===2">学员或所在单位自行在{{ isYXB ? '授课' : '培训' }}开始前向乙方一次性缴纳。</template>
                      <template v-if="sfbzVal===3">
                        甲方负担部分分
                        <span class="tip-red">*</span>
                        <div style="display: inline-block;text-indent: 0">
                          <el-input-number
                            v-model="addForm.sfbz_dw_fq"
                            style="width: 100px"
                            :min="0"
                            controls-position="right"
                          ></el-input-number>
                        </div>期付款，
                        学员负担部分学员自行在{{ isYXB ? '授课' : '培训' }}开始前向乙方一次性缴纳，
                        <div>
                          <span class="tip-red">*</span>具体付款时间为：
                        </div>
                        <div class style="padding-left: 60px;margin-top: 10px">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.sfbz_dw_zfsj"
                              style="width: 550px"
                              :rows="3"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class>
                    <div>（四）付款限制</div>
                    <div>
                      <template v-if="sfbzVal===1">费用由甲方经费统一支付，甲乙双方均不得向学员个人收取任何{{ isYXB ? '' : '培训' }}费用。</template>
                      <template v-if="sfbzVal===2">此次{{ isYXB ? '课程班' : '培训' }}，费用由学员个人或学员所在单位直接向乙方支付，甲方不得向学员个人收取任何{{ isYXB ? '' : '培训' }}费用。</template>
                      <template v-if="sfbzVal===3">此次{{ isYXB ? '课程班' : '培训' }}，部分费用由甲方经费支付，部分费用由学员个人直接向乙方支付，甲方不得向学员个人收取任何{{ isYXB ? '' : '培训' }}费用。</template>
                    </div>
                  </div>
                  <div class>
                    <div>
                      <span>（五）</span>乙方收款账户信息
                    </div>
                    <div>1.人民币汇款信息：</div>
                    <div>收款人全称：中国人民大学{{ is_college3?addForm.college:''}}；</div>
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
              <div class="module-bottom">
                <div style="font-weight: bolder">四、违约责任</div>
                <div>
                  <div class>
                    在本协议约定的合作期间，任何一方提出终止协议必须征得对方同意（不可抗力与上述责任、限制条款除外）。未经对方同意的单方违约（包括但不局限于本协议第二条规定的保密义务或第三条规定的限制条款），
                    由违约方承担本次约定{{ isYXB ? '授课' : '培训' }}费用
                    <span
                      class="tip-red"
                    >*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.wyjbl"
                        style="width: 100px"
                        :min="0"
                        controls-position="right"
                      ></el-input-number>
                    </div>%的违约金。
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
                    </div>份，经双方法定代表人或其授权代表签字并盖章并加盖公章或合同专用章（另需骑缝加盖）后具有同等法律效力。
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
                <div>
                  <div class>
                    <div
                      class="content-specific"
                    >本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议{{ isYXB ? '课程班' : '培训班' }}实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。</div>
                    <div>修改条款如下：（若无修改条款，请填写“无”。）</div>
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
              </div>
              <div class="module-bottom">
                <div style="font-weight: bolder">八、合同条款补充</div>
                <div>
                  <div class>
                    <div>协议未尽事宜，经双方友好协商达成一致，可订立补充条款。</div>
                    <div>补充条款如下：（若无补充条款，请填写“无”。）</div>
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
              <div class="module-bottom">
                <div style="font-weight: bolder">九、附件</div>
                <div>
                  <template v-if="!is_college3">
                    <div style="padding-left: 2em">1.中国人民大学授权委托书</div>
                    <div style="padding-left: 2em">2.{{ isYXB ? '课程班' : '培训' }}承办单位承诺书</div>
                  </template>
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
                      :with-credentials="true"
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
                      <span>（只能上传 PDF / JPG / PNG / GIF 文件）</span>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="entrust-content-foot">
            <!--落款-->
            <div class="foot-inscribe">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    甲方（盖章）：
                    <span class="foot-inscribe-line" style="width: 180px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    乙方（盖章）：
                    <span class="foot-inscribe-line"></span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    法定代表人或授权代理人 ：
                    <span class="foot-inscribe-line" style="width: 110px"></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple foot-inscribe-item">
                    授权代理人：
                    <span class="foot-inscribe-line" style="width: 170px"></span>
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
                <div style="margin-top: 20px">
                  <el-button @click="$router.go(-1)">返 回</el-button>
                  <el-button type="primary" @click="handleTrueSave">保 存</el-button>
                  <el-button v-if="!is_modify" type="primary" @click="handleTrueSubmit">保存并提交</el-button>
                </div>
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
// “发票”文本修改成“中央非税收入统一票据”
const fapiaoTime = 1606492800000 // 2020-11-28 0:0:0
export default {
  name: "app-protocol-entrust-add-edit",
  data() {
    return {
      xy_time: null, // 创建协议时间
      loading1: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      proCodeMore: "",
      protocolData: {},
      addForm: {
        // 新增时
        pro_com: [],
        company_id: [],
        // 编辑
        id: 0,
        pro_id: 0,
        com_id: 0,
        //审核不通过填写修改说明
        update_note: "",
        //以下公用
        uid: 0,
        yf_dwmc: "中国人民大学",
        jf_dwmc: "",
        jf_yb: "",
        jf_dz: "",
        jf_lxr: "",
        jf_lxdh: "",
        jhjbqs: 1,
        jhmqrs: 0,
        pxdx: 1,
        pxap: "",
        sfbz_dw: "",
        // sfbz_dw_dx:'',
        sfbz_dw_fq: 0,
        sfbz_dw_zfsj: "",
        sfbz_xy: "",
        // sfbz_xy_dw:'',
        specific_rate: '', // 具体收费标准
        wyjbl: 0,
        xy_num1: 0,
        xy_num2: 0,
        xy_num3: 0,
        zc: "北京仲裁委员会",
        bgtk: "", // 变更条款
        bctk: "", // 补充条款
        attachment: [], // 附件信息
        tp: 1,

        //    20181009
        pro_name: "",
        px_start_time: null, //
        px_end_time: null,
        pxfy_desc: "",
        college_id: 0,
        college: "",
        sfbz: 0,
        ks_charge: 1,
        //
        pxdd: "",
        yf_dz: "",
        yf_yb: "",
        yf_lxr: "",
        yf_lxdh: ""
      },
      structuresList: [],
      propData: {
        company_id: [],
        pro_com: [{}]
      },
      sfbzVal: 3, ///
      ksCharge: 1,
      is_update: false,
      is_submit: false,
      pxlx: null,
      //上传
      fileList: [], // 上传的文件列表
      headers: {}, // 图片上传时的请求头信息
      //申请修改
      is_modify: false,
      is_college3: false, // 国际学院（苏州研究院）、教育培训中心、深圳研究院
      zh: "0200007609026400244", // 账号
      khh: "中国工商银行股份有限公司北京紫竹院支行", // 开户行
      
      isYXB: false,
      fapiaoTime,
      proCodeStr: ''
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1", "versionTime", 'userInfo'])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getWtForm2",
      "addWtProtocol",
      "submitWt",
      "getWtProtocol",
      "updateWtProtocol",
      "addModify"
    ]),
    initData() {
      const Route = this.$route;
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
      if (sessionStorage.getItem("entrustProtocol")) {
        if (Route.fullPath.indexOf("add") > 0) {
          this.xy_time = new Date().getTime();
          this.propData = JSON.parse(sessionStorage.getItem("entrustProtocol"));
          this.proCodeMore = sessionStorage.getItem("PEO_CODE_more");
          this.sfbzVal = this.propData.sfbz;
          this.ksCharge = this.propData.ks_charge
          const ID = this.propData.entrustProtocol.pro_com[0].pro_id;
          if (ID) {
            this.getWtForm2({
              data: {
                pro_id: ID
              }
            }).then(data => {
              console.log(data.data)
              if (data.data.code === 200) {
                const Data = data.data.data;
                if (Data.list && Data.list.length) {
                  const list_wt = Data.list.filter(item => {
                    return item.id == this.propData.WT_id;
                  });
                  this.protocolData = list_wt[0];
                  Object.assign(this.addForm, this.protocolData);
                  for (let key in this.addForm) {
                    if (!this.$options.data().addForm.hasOwnProperty(key)) {
                      delete this.addForm[key];
                    }
                  }
                  let proName_ = []
                  let proCode_ = []
                  if (this.propData.PROJECTs && this.propData.PROJECTs.length) {
                    this.propData.PROJECTs.forEach(v => {
                      proName_.push(v.pro_name)
                      proCode_.push(v.pro_code)
                    })
                  }
                  this.proCodeStr = proCode_.join('/') || this.propData.pro.pro_code
                  Object.assign(this.addForm, this.propData.entrustProtocol, {
                    jhmqrs: this.propData.pro.zsrs,
                    pro_name: proName_.join('/') || this.propData.pro.pro_name,
                    px_start_time: this.propData.pro.px_start_time * 1000,
                    px_end_time: this.propData.pro.px_end_time * 1000,
                    pxdd: this.propData.pro.pxdd,
                    pxfy_desc: this.propData.pro.pxfy_desc,
                    yf_dz: this.proConfig.ruc_info.address,
                    yf_yb: this.proConfig.ruc_info.zip_code,
                    yf_lxr: this.propData.pro.user,
                    yf_lxdh: this.propData.pro.tel,
                    college_id: this.propData.college_id,
                    college: this.propData.college,
                    sfbz: this.propData.sfbz,
                    ks_charge: this.propData.ks_charge || 1
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
                }
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error
                });
              }
            });
          }
        } else {
          this.getWtProtocol({
            data: {
              id: Route.params.id
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data
              this.protocolData = data.data.data;
              this.proCodeStr = Data.pro_code
              this.xy_time = this.protocolData.create_time * 1000;
              if (this.protocolData.status === 2) {
                this.is_update = true;
              } else {
                this.is_update = false;
              }
              this.sfbzVal = this.protocolData.sfbz;
              this.ksCharge = this.protocolData.ks_charge
              this.fileList = this.protocolData.attachment.map(item => {
                return {
                  name: item.origin_name,
                  code: item.code,
                  id: item.id
                };
              });
              let obj = this.protocolData.attachment.map(item => {
                return {
                  origin_name: item.origin_name,
                  code: item.code,
                  id: item.id
                };
              });
              Object.assign(this.addForm, this.protocolData);
              for (let key in this.addForm) {
                if (!this.$options.data().addForm.hasOwnProperty(key)) {
                  delete this.addForm[key];
                }
              }
              Object.assign(
                this.addForm,
                this.protocolData,
                {
                  attachment: obj,
                  px_start_time: this.protocolData.px_start_time * 1000,
                  px_end_time: this.protocolData.px_end_time * 1000
                },
                this.propData.entrustProtocol
              );
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
            }
          });
        }
      }
    },
    handleChange(val) {
      //学院选择变化时触发
      let College = this.structuresList.filter(item => {
        return val === item.id;
      });
      this.$set(this.addForm, "college", College[0].name);
    },
    handleTrue() {
      this.$set(this.addForm, "uid", this.userInfo.uid);
      const Obj = {};
      Object.assign(Obj, this.addForm, {
        px_start_time: new Date(this.addForm.px_start_time).getTime() / 1000,
        px_end_time: new Date(this.addForm.px_end_time).getTime() / 1000
      });
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
          message: "培训内容和课程安排不能为空！"
        });
        return false;
      }
      if (this.ksCharge !== 2) {
        if (this.sfbzVal === 1) {
          if (!(Obj.sfbz_dw >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入甲方单位支付金额！"
            });
            return false;
          }
        }
        if (this.sfbzVal === 2) {
          if (!(Obj.sfbz_xy >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入学员自行支付金额！"
            });
            return false;
          }
        }
        if (this.sfbzVal === 3) {
          if (!(Obj.sfbz_dw >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入甲方单位支付金额！"
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
        if (this.sfbzVal === 1 || this.sfbzVal === 3) {
          if (!(Obj.sfbz_dw_fq >= 0)) {
            this.$message({
              type: "warning",
              message: "请输入甲方分期付款数！"
            });
            return false;
          }
          if (!Obj.sfbz_dw_zfsj) {
            this.$message({
              type: "warning",
              message: "请输入甲方单位支付时间说明！"
            });
            return false;
          } else if (Obj.sfbz_dw_zfsj.length > 300) {
            this.$message({
              type: "warning",
              message: "甲方单位支付时间说明不能超过300字！"
            });
            return false;
          }
        }
      }
      if (this.ksCharge === 2 && this.sfbzVal !== 1) {
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
          message: "请输入费用具体包括说明！"
        });
        return false;
      } else if (Obj.pxfy_desc.length > 600) {
        this.$message({
          type: "warning",
          message: "费用具体包括说明不得超出600字！"
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
          message: "甲方联系地址不能为空！"
        });
        return false;
      }
      if (!Obj.jf_yb) {
        this.$message({
          type: "warning",
          message: "甲方邮编不能为空！"
        });
        return false;
      }
      if (!Obj.jf_lxr) {
        this.$message({
          type: "warning",
          message: "甲方联系人姓名不能为空！"
        });
        return false;
      }
      if (!Obj.jf_lxdh) {
        this.$message({
          type: "warning",
          message: "甲方联系人电话不能为空！"
        });
        return false;
      }
      if (!Obj.yf_dz) {
        this.$message({
          type: "warning",
          message: "乙方联系地址不能为空！"
        });
        return false;
      }
      if (!Obj.yf_yb) {
        this.$message({
          type: "warning",
          message: "乙方邮编不能为空！"
        });
        return false;
      }
      if (!Obj.yf_lxr) {
        this.$message({
          type: "warning",
          message: "乙方联系人姓名不能为空！"
        });
        return false;
      }
      if (!Obj.yf_lxdh) {
        this.$message({
          type: "warning",
          message: "乙方联系人电话不能为空！"
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
          message: "请输入甲方执协议份数！"
        });
        return false;
      }
      if (!Obj.xy_num3) {
        this.$message({
          type: "warning",
          message: "请输入乙方执协议份数！"
        });
        return false;
      }
      if (this.is_update) {
        if (!Obj.update_note) {
          this.$message({
            type: "warning",
            message: "请输入本次修改说明！"
          });
          return false;
        }
      }

      this.loading1 = true;

      const Route = this.$route;

      if (Route.fullPath.indexOf("add") > 0) {
        delete Obj.id;
        delete Obj.pro_id;
        delete Obj.com_id;
        delete Obj.update_note;
        this.addWtProtocol({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            if (this.is_submit) {
              this.submitWt({
                data: {
                  id: Number(data.data.data)
                }
              }).then(data => {
                if (data.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功",
                    onClose: () => {
                      this.loading1 = false;
                      this.backList();
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
              // 新增
              this.$message({
                type: "success",
                message: "操作成功",
                onClose: () => {
                  this.loading1 = false;
                  this.backList();
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
        delete Obj.pro_com;
        delete Obj.company_id;
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
          Object.assign(Obj, {
            cont_type: 1
          });
        }
        if (!this.is_modify) {
          //
          this.updateWtProtocol({
            data: Obj
          }).then(data => {
            if (data.data.code === 200) {
              if (this.is_submit) {
                this.submitWt({
                  data: {
                    id: Number(Route.params.id)
                  }
                }).then(data => {
                  if (data.data.code === 200) {
                    this.$message({
                      type: "success",
                      message: "操作成功",
                      onClose: () => {
                        this.loading1 = false;
                        this.backList();
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
                //
                this.$message({
                  type: "success",
                  message: "操作成功",
                  onClose: () => {
                    this.loading1 = false;
                    this.backList();
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
                  this.backList();
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
    handleTrueSave() {
      this.is_submit = false;
      this.handleTrue();
    },
    handleTrueSubmit() {
      this.is_submit = true;
      this.handleTrue();
    },
    //文件上传相关事件
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
        this.$message.error("上传文件大小不能超过 7MB!");
      }
      return isTYPE && isLtM;
    }, // PDF png jpg gif
    handleSuccess(response, file, fileList) {
      // 上传成功的回调
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
    this.headers = JSON.parse(this.$cookie.get("headers"));
    if (sessionStorage.getItem("entrustProtocol")) {
      this.propData = JSON.parse(sessionStorage.getItem("entrustProtocol"));
    }
    if (sessionStorage.getItem("SQXG")) {
      this.is_modify = true;
    }
    this.initData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("entrustProtocol");
    sessionStorage.removeItem("SQXG");
    sessionStorage.removeItem("PEO_CODE_more");
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
  /*resize：both（横纵均可拉动）horizontal（只有横向可拉）vertical（只有纵向可拉）none（禁止拉动）*/
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
</style>
