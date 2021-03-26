<template>
  <div
    class="app-protocol-college-add-edit"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <div style="padding: 0 40px" class="print-content input-center" v-cloak>
        <!--头部-->
        <div class="college-content-head">
          <header class>
            <div class="college-content-head-title">
              <div style="font-weight: bold">校 内 单 位 培 训 合 作 协 议 书</div>
            </div>
            <div class="college-content-head-sub-title">（非学历非学位教育培训）</div>
          </header>
        </div>
        <!--内容-->
        <div class="college-content-body">
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
                  <div style="display: inline-block;text-indent: 0;width:520px">
                    <el-input :value="`中国人民大学${ addForm.college }`" style="width: 100%" disabled></el-input>
                  </div>
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
                    <span class="tip-red">*</span>联系地址：
                  </div>
                  <div style="display: inline-block;text-indent: 0;width: 380px">
                    <el-input v-model="addForm.jf_dz" style="width: 100%"></el-input>
                  </div>（详细到街道、门牌号），
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
                    <span class="tip-red">*</span>邮编：
                  </div>
                  <div style="display: inline-block;text-indent: 0;width: 190px">
                    <el-input v-model="addForm.jf_yb" style="width: 100%"></el-input>
                  </div>，
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
                    <span class="tip-red">*</span>具体联系人：
                  </div>
                  <div style="display: inline-block;text-indent: 0;width: 190px">
                    <el-input v-model="addForm.jf_lxr" style="width: 100%"></el-input>
                  </div>（姓名），
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
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
                    <el-input v-model="addForm.yf_dwmc" style="width: 100%" disabled></el-input>
                  </div>
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
                    <span class="tip-red">*</span>联系地址：
                  </div>
                  <div style="display: inline-block;text-indent: 0;width: 380px">
                    <el-input v-model="addForm.yf_dz" style="width: 100%"></el-input>
                  </div>（详细到街道、门牌号），
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
                    <span class="tip-red">*</span>具体联系人：
                  </div>
                  <div style="display: inline-block;text-indent: 0;width: 190px">
                    <el-input v-model="addForm.yf_lxr" style="width: 100%"></el-input>
                  </div>（姓名），
                </div>
                <div style="margin-bottom: 6px">
                  <div style="display: inline-block;text-indent: 0;width: 100px;text-align: right">
                    <span class="tip-red">*</span>联系电话：
                  </div>
                  <div style="display: inline-block;text-indent: 0;width: 190px">
                    <el-input v-model="addForm.yf_lxdh" style="width: 100%"></el-input>
                  </div>。
                </div>
              </div>
            </div>
            <div class="module-bottom shrink-section">
              经甲乙双方友好协商，双方决定共同举办“
              <div style="display: inline-block;text-indent: 0;width: 400px">
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
              {{ propData.pro.pro_code }}
              ），达成如下协议：
            </div>
          </div>
          <div class="shrink-section">
            <div class="module-bottom">
              <div style="font-weight: bolder">一、合作项目</div>
              <div>
                <div class>
                  <span>（一）</span>甲乙双方合作举办“
                  <span class="tip-red">*</span>
                  <div style="display: inline-block;text-indent: 0;width: 380px">
                    <el-input v-model="addForm.pro_name" :disabled="isYXB" placeholder="请输入项目名称" style="width: 100%"></el-input>
                  </div>”，
                  计划举办
                  <span class="tip-red">*</span>
                  <div style="display: inline-block;text-indent: 0">
                    <el-input-number
                      v-model="addForm.jhjbqs"
                      style="width: 80px"
                      :min="1"
                      controls-position="right"
                    ></el-input-number>
                  </div>期，
                  <span class="tip-red">*</span>
                  <div style="display: inline-block;text-indent: 0">
                    <el-input-number
                      v-model="addForm.jhmqrs"
                      style="width: 90px"
                      :min="0"
                      controls-position="right"
                      :disabled="isYXB"
                    ></el-input-number>
                  </div>人/期。
                </div>
                <div class style="margin: 10px 0">
                  <span>（二）</span>培训举办时间为：
                  <div style="text-indent: 0;display: inline-block">
                    <span class="tip-red">*</span>
                    <el-date-picker type="date" placeholder="开始时间" v-model="addForm.px_start_time"></el-date-picker>至
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
                  该培训班收费方式与标准如下：
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
                            :step="1" disabled
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
                          :rows="8"
                          maxlength="600"
                          show-word-limit
                        ></el-input>
                      </div>
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
                      :rows="6"
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
                    >1.甲乙双方只能在本协议规定的项目范围内做与对方相关的宣传，不得在其他培训项目中继续利用对方的相关名称、品牌、商标或图形标志等进行培训宣传和招生，仅可进行正常的与本次培训相关的新闻报道。</div>
                    <div class>2.双方在协议执行中，应采取友好协作、相互配合的态度，协议签订后如需修改本协议的相关条款或提前终止本协议，应签订补充协议或另行签订协议。</div>
                    <div class>3.双方为对方保守商业秘密：双方为对方保守商业秘密，并且保密义务在本协议中止或终止后依然有效。</div>
                    <div
                      class
                    >4.双方坚持简朴、节约、精简、高效的原则举办培训班，除必须的现场教学和参观学习外，不得在本次培训过程中组织任何形式的旅游活动，乙方不为学员个人在培训中或培训后自行安排的旅游活动担负任何责任。</div>
                  </div>
                </div>
                <div>
                  <div>（二）甲方的权利和义务：</div>
                  <div>
                    <template v-if="!is_college3">
                      <div class="content-specific" style="font-weight: bold">
                        1.本协议所议培训班，具体由甲方
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
                        乙方
                        <div style="display: inline-block;text-indent: 0;width: 370px">
                          <el-input v-model="addForm.yf_dwmc" style="width: 100%" disabled></el-input>
                        </div>协办。
                        具体协议经济责任由甲乙双方自行议定，甲方
                        <div
                          style="text-indent: 0;display: inline-block;margin-bottom: 10px;width: 370px"
                        >
                          <el-input
                            :value="`中国人民大学${addForm.college}`"
                            style="width: 100%"
                            disabled
                          ></el-input>
                        </div>代表项目主办方向学校履行申报和各项管理手续，交纳学校管理费。
                      </div>
                    </template>
                    <div class>{{ is_college3?1:2}}.按照学校批复标准向受训单位或受训学员收取培训费，并按照本协议的约定向乙方支付培训合作费用。</div>
                    <div class>{{ is_college3?2:3}}.尊重和保护乙方的知识产权，即使在本协议中止或终止后。</div>
                    <div class>
                      {{ is_college3?3:4}}.
                      <span class="tip-red">*</span>双方约定甲方负责的主要工作包括：
                      <div>
                        <div class style="padding-left: 30px;margin: 10px 0">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.jf_fzgz"
                              style="width: 550px;font-size: 14px"
                              :rows="3"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                        <div class>
                          <span class="tip-red">*</span>依据上述分工，甲方还拥有以下权利和义务：
                          <div class style="padding-left: 30px;margin: 10px 0">
                            <div style="text-indent: 0">
                              <el-input
                                type="textarea"
                                v-model="addForm.jf_ql"
                                style="width: 550px;font-size: 14px"
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
                </div>
                <div>
                  <div>（三）乙方的权利和义务：</div>
                  <div>
                    <div>
                      1.乙方
                      <div style="display: inline-block;text-indent: 0;width: 370px">
                        <el-input v-model="addForm.yf_dwmc" style="width: 100%" disabled></el-input>
                      </div>作为项目协助方，配合甲方履行校内审批和管理手续。
                    </div>
                    <div>2.乙方不得收取受训单位或受训学员任何费用。</div>
                    <div>3.尊重和保护甲方的知识产权，即使在本协议中止或终止后。</div>
                    <div class>
                      4.
                      <span class="tip-red">*</span>双方约定乙方负责的主要工作包括：
                      <div>
                        <div class style="padding-left: 30px;margin: 10px 0">
                          <div style="text-indent: 0">
                            <el-input
                              type="textarea"
                              v-model="addForm.yf_fzgz"
                              style="width: 550px;font-size: 14px"
                              :rows="3"
                              maxlength="300"
                              show-word-limit
                            ></el-input>
                          </div>
                        </div>
                        <div class>
                          <span class="tip-red">*</span>依据上述分工，乙方还拥有以下权利和义务：
                          <div class style="padding-left: 30px;margin: 10px 0">
                            <div style="text-indent: 0">
                              <el-input
                                type="textarea"
                                v-model="addForm.yf_ql"
                                style="width: 550px;font-size: 14px"
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
                    <div>甲乙双方同为校内二级单位时，甲方向受训单位或受训学员收取培训费后，在财务处办理财务结算手续后，按照协议约定时间和金额通过校内转账为乙方办理合作分成款结算付款。</div>
                    <div>甲乙双方中任一方（或双方）为学校下属独立法人单位时，甲方向受训单位或受训学员收取培训费后，依据协议议定时间和金额通过对公汇款或校内转账向乙方支付合作分成款。采用对公汇款方式时，乙方需为甲方开具等额有效票据。</div>
                  </div>
                </div>
                <div class>
                  <span>（二）</span>
                  <span class="tip-red">*</span>乙方分成款金额与标准
                </div>
                <div class style="margin: 10px 0">
                  <div style="text-indent: 0px;display: inline-block">
                    <el-input
                      type="textarea"
                      v-model="addForm.yf_jebz"
                      style="width: 550px;font-size: 14px"
                      :rows="3"
                      maxlength="300"
                      show-word-limit
                    ></el-input>
                  </div>
                </div>
                <div class style="margin: 10px 0">
                  <div>（三）付款时间</div>
                  <div>
                    甲方分
                    <span class="tip-red">*</span>
                    <div style="display: inline-block;text-indent: 0">
                      <el-input-number
                        v-model="addForm.yf_fqs"
                        style="width: 100px"
                        :min="1"
                        controls-position="right"
                      ></el-input-number>
                    </div>期付款，
                    <span class="tip-red">*</span>具体付款安排为：
                    <div class style="padding-left: 60px;margin-top: 10px">
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
                </div>
                <div class>
                  <div>（四）乙方收款账户信息</div>
                  <div>
                    <div>收款人全称：中国人民大学{{ is_college3?addForm.college:''}}；</div>
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
              <div>本协议自签订之日起生效，本次培训结束后自动终止。但双方都有为完成本协议相关事项继续履行本协议项下相关义务，或在本协议终止后继续配合的义务。</div>
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
                  <div>1.双方同意提交中国人民大学继续教育处或中国人民大学学校办公室（合同管理办公室）协调协商解决。</div>
                  <div>2.在协调协商期间，双方应坚持维护学校办学声誉和学员利益的工作出发点，本着诚信原则继续履行本合同不涉及争议的部分。</div>
                </div>
              </div>
            </div>
            <div class="module-bottom">
              <div style="font-weight: bolder">七、协议条款修改</div>
              <div>
                <div class>
                  <div
                    class="content-specific"
                  >本协议文本为标准协议文本，如甲乙双方协商一致，认为标准条款中存在与协议所议培训班实际客观情况不符的，可进行变更。未在此处变更，自行在打印版协议上手写变更的条款无效。</div>
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
              <div style="font-weight: bolder">八、协议条款补充</div>
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
        <div class="college-content-foot">
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
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-protocol-college-add-edit",
  data() {
    return {
      xy_time: null,
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
        jf_dwmc: "中国人民大学",
        jf_dz: "",
        jf_yb: "",
        jf_lxr: "",
        jf_lxdh: "",
        yf_dwmc: "",
        yf_dz: "",
        // yf_yb: '',
        yf_lxr: "",
        yf_lxdh: "",
        jhjbqs: 1,
        jhmqrs: 0,
        pxdx: 1,
        pxap: "",
        sfbz_dw: "",
        // sfbz_dw_dx:'',
        sfbz_xy: "",
        // sfbz_xy_dw:'',
        specific_rate: '',
        wyjbl: 0,
        xy_num1: 0,
        xy_num2: 0,
        xy_num3: 0,
        zc: "北京仲裁委员会",
        bgtk: "", // 变更条款
        bctk: "", // 补充条款
        attachment: [], // 附件信息
        tp: 1,
        pro_name: "",
        px_start_time: null, //
        px_end_time: null,
        pxfy_desc: "",
        college_id: 0,
        college: "",
        sfbz: 0,
        ks_charge: 1,
        pxdd: "",
        jf_fzgz: "",
        yf_fzgz: "",
        jf_ql: "",
        yf_ql: "",
        yf_jebz: "",
        yf_fqs: 1,
        yf_fqs_time: ""
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
      //
      fileList: [], // 
      headers: {}, // 
      //
      is_modify: false,
      is_college3: false, // 
      zh: "0200007609026400244", // 
      khh: "中国工商银行股份有限公司北京紫竹院支行", // 
      // 
      isYXB: false
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1", 'userInfo'])
  },
  filters: {
    chai(str) {
      return str.substring(0, 1);
    }
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getHzForm5",
      "addHzProtocol",
      "submitHz",
      "getHzProtocol",
      "updateHzProtocol",
      "addModify",
      "getProjectsData"
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
      if (sessionStorage.getItem("collegeProtocol")) {
        if (Route.fullPath.indexOf("add") > 0) {
          this.propData = JSON.parse(sessionStorage.getItem("collegeProtocol"));
          this.proCodeMore = sessionStorage.getItem("PEO_CODE_more");
          this.sfbzVal = this.propData.sfbz;
          this.ksCharge = this.propData.ks_charge;
          const ID = this.propData.collegeProtocol.pro_com[0].pro_id;
          if (ID) {
            this.getHzForm5({
              data: {
                pro_id: ID
              }
            }).then(data => {
              if (data.data.code === 200) {
                const Data = data.data.data;
                if (Data.list && Data.list.length) {
                  const list_hz = Data.list.filter(item => {
                    return item.id == this.propData.HZ_id;
                  });
                  this.protocolData = list_hz[0];
                  Object.assign(this.addForm, this.protocolData);
                  for (let key in this.addForm) {
                    if (!this.$options.data().addForm.hasOwnProperty(key)) {
                      delete this.addForm[key];
                    }
                  }
                  Object.assign(this.addForm, this.propData.collegeProtocol, {
                    jhmqrs: this.propData.pro.zsrs,
                    pro_name: this.propData.pro.pro_name,
                    px_start_time: this.propData.pro.px_start_time * 1000,
                    px_end_time: this.propData.pro.px_end_time * 1000,
                    pxdd: this.propData.pro.pxdd,
                    pxfy_desc: this.propData.pro.pxfy_desc,
                    jf_dz: this.proConfig.ruc_info.address,
                    jf_yb: this.proConfig.ruc_info.zip_code,
                    jf_lxr: this.propData.pro.user,
                    jf_lxdh: this.propData.pro.tel,
                    college_id: this.propData.college_id,
                    college: this.propData.college,
                    sfbz: this.propData.sfbz,
                    sfbz_dw: this.propData.sfbz_dw,
                    sfbz_xy: this.propData.sfbz_xy,
                    specific_rate: this.propData.specific_rate,
                  });
                  this.pxlx = this.propData.pxlx;
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
          this.getHzProtocol({
            data: {
              id: Route.params.id
            }
          }).then(data => {
            if (data.data.code === 200) {
              this.protocolData = data.data.data;
              if (this.protocolData.status === 2) {
                this.is_update = true;
              } else {
                this.is_update = false;
              }
              this.sfbzVal = this.protocolData.sfbz;
              this.ksCharge = this.protocolData.ks_charge;
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
                this.propData.collegeProtocol
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
      if (!Obj.jhjbqs) {
        this.$message({
          type: "warning",
          message: "计划举办期数不能为空！"
        });
        return false;
      }
      if (!Obj.jhmqrs) {
        this.$message({
          type: "warning",
          message: "每期招生人数不能为空！"
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
      }
      if (this.ksCharge === 2) {
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
      }
      if (!Obj.pxap) {
        this.$message({
          type: "warning",
          message: "培训内容和课程安排不能为空！"
        });
        return false;
      }
      if (!Obj.jf_fzgz) {
        this.$message({
          type: "warning",
          message: "甲方负责的主要工作不能为空！"
        });
        return false;
      }
      if (!Obj.jf_ql) {
        this.$message({
          type: "warning",
          message: "甲方拥有的权利和义务不能为空！"
        });
        return false;
      }
      if (!Obj.yf_fzgz) {
        this.$message({
          type: "warning",
          message: "乙方负责的主要工作不能为空！"
        });
        return false;
      }
      if (!Obj.yf_ql) {
        this.$message({
          type: "warning",
          message: "乙方拥有的权利和义务不能为空！"
        });
        return false;
      }
      if (!Obj.yf_jebz) {
        this.$message({
          type: "warning",
          message: "乙方分成款金额与标准不能为空！"
        });
        return false;
      }
      if (!Obj.yf_fqs_time) {
        this.$message({
          type: "warning",
          message: "甲方具体付款安排不能为空！"
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
        this.addHzProtocol({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            if (this.is_submit) {
              this.submitHz({
                data: {
                  id: data.data.data - 0
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
            cont_type: 3
          });
        }
        if (!this.is_modify) {
          //
          this.updateHzProtocol({
            data: Obj
          }).then(data => {
            if (data.data.code === 200) {
              if (this.is_submit) {
                this.submitHz({
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
    backList () {
      // this.$router.push('/home/protocol/college/list')
      this.$router.go(-1)
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    if (sessionStorage.getItem("collegeProtocol")) {
      this.propData = JSON.parse(sessionStorage.getItem("collegeProtocol"));
    }
    if (sessionStorage.getItem("SQXG")) {
      this.is_modify = true;
    }
    this.initData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("collegeProtocol");
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
