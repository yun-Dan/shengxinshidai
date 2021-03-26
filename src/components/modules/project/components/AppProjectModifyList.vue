<template>
  <div
    class="app-project-modify-list"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <div class="fr" style="margin-right: 20px">
          <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
        </div>
        <h3 style="line-height: 40px;text-indent: 2em">{{ pro_name }}</h3>
      </div>
      <div class="project-modify-list-main" v-cloak>
        <div v-if="is_check" style="margin-top: 20px">
          <el-form label-position="left" style="text-align: left">
            <el-form-item v-if="infoShow.status!==1" label="审核状态：">
              <span v-if="infoShow.status===2" style="color: #67c23a">通过</span>
              <span v-if="infoShow.status===3" style="color: #f56c6c">未通过</span>
            </el-form-item>
            <el-form-item label="申请日期：">{{ infoShow.create_time | TimestampChangeFilter }}</el-form-item>
            <el-form-item label="修改详情">
              <div style="padding-left: 80px">
                <el-form label-position="left" label-width="180px">
                  <template v-for="(item,index) in infoShow.modData">
                    <el-form-item :key="index">
                      <template slot="label">
                        <span>{{ index+1}}、</span>
                        <span v-if="item.model_name==='Projects'" class="model-title-strong">项目基本信息</span>
                        <span v-if="item.model_name==='ProYhzc'" class="model-title-strong">优惠政策信息</span>
                        <span
                          v-if="item.model_name==='ProCourses'"
                          class="model-title-strong"
                        >课程设置信息</span>
                        <span v-if="item.model_name==='ProWt'" class="model-title-strong">委托培训信息</span>
                        <span v-if="item.model_name==='ProFz'" class="model-title-strong">辅助培训信息</span>
                        <span v-if="item.model_name==='ProHz'" class="model-title-strong">校内合作信息</span>
                        <span v-if="item.model_name==='ProYs'" class="model-title-strong">财务预算信息</span>
                        <span v-if="item.model_name==='ProYsZc'" class="model-title-strong">项目支出预算明细</span>
                        <span v-if="item.model_name==='ProYsFz'" class="model-title-strong">辅助支出预算明细</span>
                        <span
                          v-if="item.model_name==='ProYsHz'"
                          class="model-title-strong"
                        >校内合作预算：{{ item.dwmc }}</span>
                      </template>
                      <div class="modify-list-main-list">
                        <div class="fl" v-if="item.mod_way==='add'">
                          新增【{{ item.mod_field_desc.substring(2) }}】
                          <template v-if="item.model_name==='ProYhzc'">
                            <ul class="clearfix" style="padding-left: 24px;">
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">优惠价格：</strong>
                                <div class="fl item-content">{{ item.mod_content.yhjg }}元；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">优惠条件：</strong>
                                <div class="fl item-content">{{ item.mod_content.yhtj}}。</div>
                              </li>
                            </ul>
                          </template>
                          <template v-if="item.model_name==='ProCourses'">
                            <ul class="clearfix" style="padding-left: 24px;">
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">课程：</strong>
                                <div class="fl item-content">{{ item.mod_content.cou_name }}；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">教师：</strong>
                                <div class="fl item-content">{{ item.mod_content.teacher }}；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">职称：</strong>
                                <div
                                  class="fl item-content"
                                >{{ item.mod_content.job?item.mod_content.job:'无'}}；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">职工/身份证号：</strong>
                                <div class="fl item-content">{{ item.mod_content.idnumber }}；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">工作单位：</strong>
                                <div
                                  class="fl item-content"
                                >{{ item.mod_content.unit?item.mod_content.unit:'无'}}；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">学时：</strong>
                                <div class="fl item-content">{{ item.mod_content.school_hours }}学时。</div>
                              </li>
                            </ul>
                          </template>
                          <template v-else-if="item.model_name==='ProWt'">
                            <ul style="padding-left: 24px">
                              <li class="clearfix">
                                <strong class="fl item-title">委托单位名称：</strong>
                                <div class="item-content">{{ item.mod_content.jf_dwmc }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">省/市：</strong>
                                <div
                                  class="item-content"
                                >{{ item.mod_content.province }}/{{ item.mod_content.city }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">详细地址：</strong>
                                <div class="item-content">{{ item.mod_content.jf_dz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">邮编：</strong>
                                <div class="item-content">{{ item.mod_content.jf_yb }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">联系人：</strong>
                                <div class="item-content">{{ item.mod_content.jf_lxr }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">联系人电话：</strong>
                                <div class="item-content">{{ item.mod_content.jf_lxdh}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">培训对象类型：</strong>
                                <div
                                  class="item-content"
                                >{{ item.mod_content.pxdx | showType(proConfig.pxdx) }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">培训内容和课程安排：</strong>
                                <div
                                  class="item-content"
                                  style="margin-left: 130px"
                                >{{ item.mod_content.pxap }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">收费方式与标准：</strong>
                                <div class="item-content">
                                  <p v-if="item.mod_content.specific_rate">
                                    按照课时或模块支付，{{ item.mod_content.specific_rate }}
                                  </p>
                                  <p v-else-if="item.mod_content.sfbz_dw_zfsj" >委托单位支付合计 {{ item.mod_content.sfbz_dw }} 元；分 {{ item.mod_content.sfbz_dw_fq }} 期付款；付款时间为 {{ item.mod_content.sfbz_dw_zfsj}}</p>
                                  <p v-else>学员支付 {{ item.mod_content.sfbz_xy }} 元</p>
                                </div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">违约金比例：</strong>
                                <div class="item-content">{{ item.mod_content.wyjbl}}%</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">协议份数：</strong>
                                <div
                                  class="item-content"
                                >共{{ item.mod_content.xy_num1}}份（甲方：{{ item.mod_content.xy_num2}}份、乙方：{{ item.mod_content.xy_num3}}份）</div>
                              </li>
                            </ul>
                          </template>
                          <template v-else-if="item.model_name==='ProFz'">
                            <ul v-if="item.mod_content" style="padding-left: 24px">
                              <li class="clearfix">
                                <strong class="fl item-title">辅助单位名称：</strong>
                                <div class="item-content">{{ item.mod_content.yf_dwmc }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">资质文件名称：</strong>
                                <div class="item-content">{{ item.mod_content.zzwj}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">资质文件编码：</strong>
                                <div class="item-content">{{ item.mod_content.zzwj_bm}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">资质文件附件：</strong>
                                <div class="item-content">
                                  <a
                                    target="_blank"
                                    :href=" lookUrl+ '/'+item.mod_content.zzwj_file"
                                  >
                                    <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                                  </a>
                                </div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">法人代表：</strong>
                                <div class="item-content">{{ item.mod_content.frdb }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">法人代表照片：</strong>
                                <div class="item-content">
                                  <a
                                    target="_blank"
                                    :href=" lookUrl+ '/'+item.mod_content.frdb_file"
                                  >
                                    <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                                  </a>
                                </div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">单位性质：</strong>
                                <div class="item-content">{{ item.mod_content.dwxz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">联系电话：</strong>
                                <div class="item-content">{{ item.mod_content.yf_lxdh}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">单位地址：</strong>
                                <div class="item-content">{{ item.mod_content.yf_dz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">邮编：</strong>
                                <div class="item-content">{{ item.mod_content.yf_yb }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">项目负责人：</strong>
                                <div class="item-content">{{ item.mod_content.yf_lxr }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">培训内容和课程安排：</strong>
                                <div class="item-content">{{ item.mod_content.pxap }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">申报项目单位负责的工作：</strong>
                                <div class="item-content">{{ item.mod_content.jf_fzgz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">辅助单位负责的工作：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fzgz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">辅助单位负责的费用支出：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fyzc }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">{{ isYXB ? '辅助单位获得最高分成比例：' : '辅助单位获得的总分成比例：' }}</strong>
                                <div class="item-content">{{ item.mod_content.yf_fcbl}}{{ (isYXB || (infoShow.create_time * 1000 > fz202101)) && (item.mod_content.yf_fcbl || 0) > -1 ? '%' : '' }}</div>
                              </li>
                              <li v-if="isYXB || (infoShow.create_time * 1000 > fz202101)" class="clearfix">
                                <strong class="fl item-title">辅助单位具体分成情况：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fzjtfc }}</div>
                              </li>
                              <li v-if="isYXB || (infoShow.create_time * 1000 > fz202101)" class="clearfix">
                                <strong class="fl item-title">扣留乙方分成款的比例：</strong>
                                <div class="item-content">{{ item.mod_content.wg_bili || 0}}%</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">辅助单位分成款分期数：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fqs }} 期</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">分成款付款时间：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fqs_time }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">收款银行账号：</strong>
                                <div class="item-content">{{ item.mod_content.yf_yhzh}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">收款开户行：</strong>
                                <div class="item-content">{{ item.mod_content.yf_khh}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">违约金比例：</strong>
                                <div class="item-content">{{ item.mod_content.wyjbl}} %</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">协议份数：</strong>
                                <div
                                  class="item-content"
                                >共{{ item.mod_content.xy_num1}}份（甲方：{{ item.mod_content.xy_num2}}份、乙方：{{ item.mod_content.xy_num3}}份）</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">辅助单位权责议定方式：</strong>
                                <div
                                  class="item-content"
                                >{{ proConfig.obligation[item.mod_content.obligation || '1']}}</div>
                              </li>
                              <li class="clearfix" v-if="`${item.mod_content.obligation}` === '2'">
                                <strong class="fl item-title">谈判是否有第三方监督：</strong>
                                <div
                                  class="item-content"
                                >{{ item.mod_content.obligation_type === 1 ? '无' : '有'}}</div>
                              </li>
                              <li
                                class="clearfix"
                                v-if="`${item.mod_content.obligation}` === '2' && `${item.mod_content.obligation_type}` === '2'"
                              >
                                <strong class="fl item-title">谈判监督人：</strong>
                                <div class="item-content">{{ item.mod_content.obligation_user }}</div>
                              </li>
                              <li
                                class="clearfix"
                                v-if="`${item.mod_content.obligation}` === '2' && `${item.mod_content.obligation_type}` === '1'"
                              >
                                <strong class="fl item-title">无监督方的理由：</strong>
                                <div class="item-content">{{ item.mod_content.obligation_reason}}</div>
                              </li>
                            </ul>
                          </template>
                          <template v-else-if="item.model_name==='ProHz'">
                            <ul v-if="item.mod_content" style="padding-left: 24px">
                              <li class="clearfix">
                                <strong class="fl item-title">合作单位名称：</strong>
                                <div class="item-content">{{ item.mod_content.yf_dwmc }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">联系电话：</strong>
                                <div class="item-content">{{ item.mod_content.yf_lxdh}}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">单位地址：</strong>
                                <div class="item-content">{{ item.mod_content.yf_dz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">项目负责人：</strong>
                                <div class="item-content">{{ item.mod_content.yf_lxr }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">培训内容和课程安排：</strong>
                                <div class="item-content">{{ item.mod_content.pxap }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">申报项目单位负责的工作：</strong>
                                <div class="item-content">{{ item.mod_content.jf_fzgz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">合作单位负责的工作：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fzgz }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">合作单位负责的费用支出：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fyzc }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">{{ isYXB ? '合作单位获得最高分成比例：' : '合作单位获得的总分成比例：' }}</strong>
                                <div class="item-content">{{ item.mod_content.yf_fcbl}}{{ isYXB && (item.mod_content.yf_fcbl || 0) > -1 ? '%' : '' }}</div>
                              </li>
                              <li v-if="isYXB" class="clearfix">
                                <strong class="fl item-title">合作单位具体分成情况：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fzjtfc }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">合作单位分成款分期数：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fqs }} 期</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">分成款付款时间：</strong>
                                <div class="item-content">{{ item.mod_content.yf_fqs_time }}</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">违约金比例：</strong>
                                <div class="item-content">{{ item.mod_content.wyjbl}} %</div>
                              </li>
                              <li class="clearfix">
                                <strong class="fl item-title">协议份数：</strong>
                                <div
                                  class="item-content"
                                >共{{ item.mod_content.xy_num1}}份（甲方：{{ item.mod_content.xy_num2}}份、乙方：{{ item.mod_content.xy_num3}}份）</div>
                              </li>
                            </ul>
                          </template>
                          <template
                            v-else-if="item.model_name==='ProYsZc' || item.model_name==='ProYsFz' || item.model_name==='ProYsHz' && item.mod_content && item.mod_content.xm"
                          >
                            <ul class="clearfix" style="padding-left: 24px">
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">项目：</strong>
                                <div class="fl item-content">{{ item.mod_content.xm}}；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">费用总计：</strong>
                                <div class="fl item-content">{{ item.mod_content.fyzj}} 元；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">备注：</strong>
                                <div
                                  class="fl item-content"
                                >{{ item.mod_content.note?item.mod_content.note:'无'}}。</div>
                              </li>
                            </ul>
                          </template>
                          <template
                            v-if="item.model_name==='ProYsHz' && item.mod_content && item.mod_content.index_id"
                          >
                            <ul class="clearfix" style="padding-left: 24px">
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">费用总计：</strong>
                                <div class="fl item-content">{{ item.mod_content.zc_hzdwfc }} 元；</div>
                              </li>
                              <li class="clearfix fl">
                                <strong class="fl item-title" style="padding-right: 0">备注：</strong>
                                <div
                                  class="fl item-content"
                                >{{ item.mod_content.zc_hzdwfc_note || '无'}}。</div>
                              </li>
                            </ul>
                          </template>
                        </div>
                        <div class="fl" v-if="item.mod_way==='edit'">
                          <template v-if="(!item.mod_before)&&item.mod_after">
                            <template
                              v-if="item.mod_field === 'adm_major' || item.mod_field === 'adm_course' || item.mod_field === 'adm_teaching' || item.mod_field === 'adm_study_time' ||item.mod_field === 'adm_requirement' || item.mod_field === 'adm_attention' || item.mod_field === 'adm_charging' || item.mod_field === 'adm_certificate'"
                            >
                              新增【招生简章 — {{ item.mod_field_desc.substring(2) }}】：
                              <div v-html="item.mod_after" style="padding-left: 24px"></div>
                            </template>
                            <template v-else>
                              <template v-if="item.mod_field === 'pre_code'">新增【前期预立项项目】：</template>
                              <template v-else>新增【{{ item.mod_field_desc.substring(2) }}】：</template>
                              <template v-if="item.mod_field==='zsjz_wd'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_after">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template v-if="item.mod_field==='adm_reg_form'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_after">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template v-else-if="item.mod_field==='zsjz'">
                                <a href="#zsjz2" style="color: #409EFF">【点击查看】</a>
                              </template>
                              <template v-else-if="item.mod_field==='yhzc_wj'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_after">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template
                                v-else-if="item.mod_field==='obligation'"
                              >{{ proConfig.obligation[item.mod_after]}}</template>
                              <template v-else-if="item.mod_field==='obligation_type'">
                                <span>{{ item.mod_after == 1 ? '无' : '有'}}</span>
                              </template>
                              <span v-else>{{ item.mod_after }}</span>
                            </template>
                          </template>
                          <template v-if="item.mod_before&&item.mod_after">
                            <template
                              v-if="item.mod_field === 'adm_major' || item.mod_field === 'adm_course' || item.mod_field === 'adm_teaching' || item.mod_field === 'adm_study_time' || item.mod_field === 'adm_requirement' || item.mod_field === 'adm_attention' || item.mod_field === 'adm_charging' || item.mod_field === 'adm_certificate'"
                            >
                              修改【招生简章 — {{ item.mod_field_desc.substring(2) }}】：
                              <el-row>
                                <el-col :span="12">
                                  <div style="text-align: center">（原）</div>
                                  <div v-html="item.mod_before" style="padding-left: 24px"></div>
                                </el-col>
                                <el-col :span="12">
                                  <div style="text-align: center">（新）</div>
                                  <div v-html="item.mod_after" style="padding-left: 24px"></div>
                                </el-col>
                              </el-row>
                            </template>
                            <template v-else>
                              <template v-if="item.mod_field === 'is_preliminary'">修改【前期是否有预立项】：</template>
                              <template v-else>修改【{{ item.mod_field_desc.substring(2) }}】：</template>
                              <template v-if="item.mod_field==='gl_type'">
                                <template v-for="(val,key) in proConfig.gl_type">
                                  <span v-if="key==item.mod_before" :key="key">{{ val}}</span>
                                </template>
                                修改为
                                <template
                                  v-for="(val,key) in proConfig.gl_type"
                                >
                                  <span v-if="key==item.mod_after" :key="key">{{ val}}</span>
                                </template>
                              </template>
                              <template v-else-if="item.mod_field==='is_preliminary'">
                                <span>{{ item.mod_before == 1 ? '是' : '否' }}</span>
                                修改为
                                <span>{{ item.mod_after == 1 ? '是' : '否' }}</span>
                              </template>
                              <template v-else-if="item.mod_field==='zs_type'">
                                <template v-for="(val,key) in proConfig.zs_type">
                                  <span v-if="key==item.mod_before" :key="key">{{ val}}</span>
                                </template>
                                修改为
                                <template
                                  v-for="(val,key) in proConfig.zs_type"
                                >
                                  <span v-if="key==item.mod_after" :key="key">{{ val}}</span>
                                </template>
                              </template>
                              <template v-else-if="item.mod_field==='zsjz_wd'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                                修改为
                                <a
                                  target="_blank"
                                  :href=" lookUrl+ '/'+item.mod_after"
                                >
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template v-else-if="item.mod_field==='adm_reg_form'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                                修改为
                                <a
                                  target="_blank"
                                  :href=" lookUrl+ '/'+item.mod_after"
                                >
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template v-else-if="item.mod_field==='zsjz_wd'">
                                <a href="#zsjz1" style="color: #409EFF">【点击查看】</a>
                                <a href="#zsjz2" style="color: #409EFF">【点击查看】</a>
                              </template>
                              <template
                                v-else-if="item.mod_field==='zs_start_time'||item.mod_field==='zs_end_time'"
                              >
                                <span
                                  v-if="item.mod_before>0"
                                >{{ item.mod_before | TimestampChangeFilter }}</span>
                                <template v-if="item.mod_after>0">
                                  {{ item.mod_before>0?'修改为':'新增 '}}
                                  <span>{{ item.mod_after | TimestampChangeFilter }}</span>
                                </template>
                                <template v-else>删除</template>
                              </template>
                              <template
                                v-else-if="item.mod_field==='px_start_time'||item.mod_field==='px_end_time'"
                              >
                                <span
                                  v-if="item.mod_before>0"
                                >{{ item.mod_before | TimestampChangeFilter }}</span>
                                {{ item.mod_before>0?'修改为':'新增 '}}
                                <span>{{ item.mod_after | TimestampChangeFilter }}</span>
                              </template>
                              <template v-else-if="item.mod_field==='skfs'">
                                <template v-for="(val,key) in proConfig.skfs">
                                  <span v-if="key==item.mod_before" :key="key">{{ val}}</span>
                                </template>
                                修改为
                                <template
                                  v-for="(val,key) in proConfig.skfs"
                                >
                                  <span v-if="key==item.mod_after" :key="key">{{ val}}</span>
                                </template>
                              </template>
                              <template v-else-if="item.mod_field==='sfbz'">
                                <template v-for="(val,key) in proConfig.sfbz">
                                  <span v-if="key==item.mod_before" :key="key">{{ val}}</span>
                                </template>
                                修改为
                                <template
                                  v-for="(val,key) in proConfig.sfbz"
                                >
                                  <span v-if="key==item.mod_after" :key="key">{{ val}}</span>
                                </template>
                              </template>
                              <template v-else-if="item.mod_field==='sfbz_xy'||item.mod_field==='sfbz_dw'">
                                <span>{{ item.mod_before }}元</span>
                                修改为
                                <span>{{ item.mod_after }}元</span>
                              </template>
                              <template v-else-if="item.mod_field==='ks_charge'">
                                <span>{{ item.mod_before == 2 ? '是' : '否' }}</span>
                                修改为
                                <span>{{ item.mod_after == 2 ? '是' : '否' }}</span>
                              </template>
                              <template v-else-if="item.mod_field==='welfare'">
                                <span>{{ item.mod_before == 1 ? '是' : '否' }}</span>
                                修改为
                                <span>{{ item.mod_after == 1 ? '是' : '否' }}</span>
                              </template>
                              <template v-else-if="item.mod_field==='is_yhzc'">
                                <template v-for="(val,key) in {1:'有',0:'没有'}">
                                  <span v-if="key==item.mod_before" :key="key">{{ val}}</span>
                                </template>
                                修改为
                                <template
                                  v-for="(val,key) in {1:'有',0:'没有'}"
                                >
                                  <span v-if="key==item.mod_after" :key="key">{{ val}}</span>
                                </template>
                              </template>
                              <template v-else-if="item.mod_field==='yhzc_wj'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                                修改为
                                <a
                                  target="_blank"
                                  :href=" lookUrl+ '/'+item.mod_after"
                                >
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template
                                v-else-if="item.mod_field==='zzwj_file'||item.mod_field==='frdb_file'"
                              >
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看照片】</el-button>
                                </a>
                                修改为
                                <a
                                  target="_blank"
                                  :href=" lookUrl+ '/'+item.mod_after"
                                >
                                  <el-button type="text" style="padding: 0px">【查看照片】</el-button>
                                </a>
                              </template>
                              <template v-else-if="item.mod_field==='obligation'">
                                <template v-for="(val,key) in proConfig.obligation">
                                  <span v-if="key==item.mod_before" :key="key+'o1'">{{ val}}</span>
                                </template>
                                修改为
                                <template
                                  v-for="(val,key) in proConfig.obligation"
                                >
                                  <span v-if="key==item.mod_after" :key="key+'02'">{{ val}}</span>
                                </template>
                              </template>
                              <template v-else-if="item.mod_field==='obligation_type'">
                                <span>{{ item.mod_before == 1 ? '无' : '有'}}</span>
                                修改为
                                <span>{{ item.mod_after == 1 ? '无' : '有'}}</span>
                              </template>
                              <template v-else>
                                <span>{{ item.mod_before }}</span>
                                修改为
                                <span>{{ item.mod_after }}</span>
                              </template>
                            </template>
                          </template>
                          <template v-if="item.mod_before&&(!item.mod_after)">
                            <template
                              v-if="item.mod_field === 'adm_major' || item.mod_field === 'adm_course' || item.mod_field === 'adm_teaching' || item.mod_field === 'adm_study_time' || item.mod_field === 'adm_requirement' || item.mod_field === 'adm_attention' || item.mod_field === 'adm_charging' || item.mod_field === 'adm_certificate'"
                            >
                              删除【招生简章 — {{ item.mod_field_desc.substring(2) }}】：
                              <div v-html="item.mod_before" style="padding-left: 24px"></div>
                            </template>
                            <template v-else>
                              <template v-if="item.mod_field === 'pre_code'">删除【前期预立项项目】：</template>
                              <template v-else>删除【{{ item.mod_field_desc.substring(2) }}】：</template>
                              <template v-if="item.mod_field==='yhzc_wj'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template v-else-if="item.mod_field==='zsjz_wd'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <template v-else-if="item.mod_field==='adm_reg_form'">
                                <a target="_blank" :href=" lookUrl+ '/'+item.mod_before">
                                  <el-button type="text" style="padding: 0px">【查看附件】</el-button>
                                </a>
                              </template>
                              <span v-else>{{ item.mod_before }}</span>
                            </template>
                          </template>
                        </div>
                        <div class="fl" v-if="item.mod_way==='delete'">
                          <template v-if="item.mod_field === 'pre_code'">
                            删除【前期预立项项目】：
                            <span>{{ item.mod_before }}</span>
                          </template>
                          <template v-else>
                            删除【{{ item.mod_field_desc.substring(2) }}】
                            <span>{{ item.mod_before }}</span>
                          </template>
                        </div>
                      </div>
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </el-form-item>
            <template v-if="infoShow.status===1&&userInfo.role===1">
              <el-form-item label="审核结果：" :rules="[{required:true}]">
                <el-radio-group v-model="check_status">
                  <el-radio :label="2">通过</el-radio>
                  <el-radio :label="1">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="check_status===1" label="审核不通过原因：" :rules="[{required:true}]">
                <el-row>
                  <el-col :xs="24" :sm="12">
                    <el-input type="textarea" v-model.trim="checkForm.content"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleCheckTrue">确 定</el-button>
                <el-button type @click="handleNo">取 消</el-button>
              </el-form-item>
            </template>
            <el-form-item v-else style="padding-left: 50px">
              <el-button type="primary" plain @click="handleNo">取 消</el-button>
            </el-form-item>
            <el-form-item v-if="is_zsjz">
              <div style="font-weight: bold;background-color: #ebeef5;padding: 1em">招生简章文本：</div>
              <div id="zsjz1" style="line-height: 20px;background-color: #ebeef5;padding: 2em">
                <div ref="pxap1"></div>
              </div>
              <div id="zsjz2" style="line-height: 20px;background-color: #ebeef5;padding:2em">
                <div ref="pxap2"></div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <template v-else>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
            <el-table-column align="center" prop="date" label="申请日期">
              <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="审核日期">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.review_time"
                >{{ scope.row.review_time | TimestampChangeFilter }}</span>
                <span v-else>未审核</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="申请修改数据">
              <template slot-scope="scope">
                共
                <strong>{{ scope.row.modData.length}}</strong>处修改
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.status===1"
                  style="color: #e6a23c"
                >待审核{{ is_ss&&scope.row.is_sign===1?'（待签章）':''}}</span>
                <span v-if="scope.row.status===2" style="color: #67c23a">通过</span>
                <span v-if="scope.row.status===3" style="color: #f56c6c">未通过</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <template v-if="userInfo.role===1">
                  <template v-if="scope.row.status===1">
                    <template v-if="list_is_ss">
                      <template v-if="scope.row.is_sign===2">
                        <el-button
                          type="text"
                          size="mini"
                          @click.native="handleDeclareModify(scope.row,true,scope.row.is_sign)"
                        >查看申请书</el-button>
                        <el-button type="text" @click="native=handleCheck(scope.row)">审核</el-button>
                      </template>
                      <el-button v-else type="text" size="mini" :disabled="true">{{'申请书待签章'}}</el-button>
                    </template>
                    <template v-else>
                      <el-button type="text" @click="native=handleCheck(scope.row)">审核</el-button>
                    </template>
                  </template>
                  <el-button v-else type="text" @click.native="handleLook(scope.row)">查看详情</el-button>
                </template>
                <template v-if="userInfo.role===2">
                  <el-button type="text" @click.native="handleLook(scope.row)" size="mini">查看详情</el-button>
                  <template v-if="scope.row.status===1">
                    <template v-if="is_ss">
                      <el-button
                        v-if="scope.row.is_sign===2"
                        type="text"
                        size="mini"
                        @click.native="handleDeclareModify(scope.row,true,scope.row.is_sign)"
                      >
                        <span style="color: #E6A23C ">打印申请修改</span>
                      </el-button>
                    </template>
                    <el-button
                      v-else
                      type="text"
                      size="mini"
                      @click.native="handleDeclareModify(scope.row,true)"
                    >
                      <span style="color: #E6A23C ">打印申请修改</span>
                    </el-button>
                  </template>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="userInfo.role===1&&tableData.length&&tableData[0].status===1" style="margin-top: 20px">
            <AppProjectMDC></AppProjectMDC>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import AppProjectMDC from "./AppProjectMDC";
import { MATE } from '@/assets/js/config.special.js'
import { mapState, mapActions } from "vuex";
export default {
  name: "app-project-modify-list",
  data() {
    return {
      loading2: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      pro_id: 0,
      pro_name: "",
      tableData: [],
      is_check: false,
      mod_id: null,
      infoShow: {},
      checkForm: {
        pro_id: 0,
        mod_id: 0,
        content: ""
      },
      check_status: 2,
      is_zsjz: false,
      is_ss: false,
      list_is_ss: false,
      
      isYXB: false
    };
  },
  computed: {
    ...mapState(["lookUrl", 'userInfo', 'fz202101'])
  },
  components: {
    AppProjectMDC
  },
  filters: {
    showType(val, obj) {
      for (let key in obj) {
        if (key == val) {
          return obj[key];
        }
      }
    }
  },
  methods: {
    ...mapActions(["getProModifyHistory", "checkProModify"]),
    initData() {
      this.loading2 = true;
      if (this.loading2) {
        this.getProModifyHistory({
          data: {
            pro_id: this.pro_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            let new_Data = Data.map(item => {
              const arr = [];
              for (let k in item.modData) {
                let Item_ = item.modData[k];
                if (k > -1 && k !== "") {
                  arr.push(Item_);
                }
              }
              let Obj = {};
              let list = arr.filter(item => {
                return !(
                  (item.model_name === "Projects" &&
                    item.mod_field === "is_fzdw") ||
                  (item.model_name === "Projects" &&
                    item.mod_field === "is_wtdw") ||
                  (item.model_name === "Projects" &&
                    item.mod_field === "is_hzdw")
                );
              });
              Object.assign(Obj, item, {
                modData: list
              });
              return Obj;
            });
            this.tableData = new_Data;
            this.loading2 = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleCheck(val) {
      this.is_check = true;
      this.mod_id = val.mod_id;
      Object.assign(this.checkForm, {
        pro_id: this.$route.params.id,
        mod_id: val.mod_id,
        content: ""
      });
      this.handleInfo(val);
    },
    handleCheckTrue() {
      if (this.check_status === 1) {
        if (!this.checkForm.content) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      }
      this.checkProModify({
        data: this.checkForm,
        status: this.check_status
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.initData();
          this.is_check = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleLook(val) {
      this.is_check = true;
      this.mod_id = null;
      this.handleInfo(val);
    },
    handleDeclareModify(val, need_pro_name, is_sign) {
      const Pro = {
        mod_id: val.mod_id
      };
      const PRO_ID = this.$route.params.id;
      sessionStorage.setItem("Pro_declare_modify", JSON.stringify(Pro));
      sessionStorage.setItem("pro_declare", PRO_ID);
      if (need_pro_name) {
        sessionStorage.setItem("form_mod_PRO_Name", this.pro_name);
      }
      if (is_sign === 2) {
        sessionStorage.setItem(
          "is_sign_print",
          JSON.stringify({
            is_sign: 2,
            sign_img: val.sign_img,
            sign_user: val.sign_user
          })
        );
      }
      this.$router.push("/home/project/declare_modify/" + PRO_ID);
    },
    handleInfo(val) {
      Object.assign(this.infoShow, val);
      let list = val.modData.filter(item => {
        return item.mod_field === "zsjz";
      });
      if (list.length) {
        this.is_zsjz = true;
        this.showPxap(true, list[0].mod_before, 1);
        this.showPxap(true, list[0].mod_after, 2);
      }
    },
    handleNo() {
      Object.assign(this.checkForm, this.$options.data().checkForm);
      this.is_check = false;
      this.mod_id = null;
      this.initData();
    },
    showPxap(zsjz, strContent = "", type) {
      this.$nextTick(() => {
        if (zsjz && strContent) {
          strContent = strContent.replace(/\r\n/g, "<br/>");
          strContent = strContent.replace(/\n/g, "<br/>");
          strContent = strContent.replace(/\s/g, "&nbsp;");
          if (type === 1) {
            this.$refs.pxap1.innerHTML = strContent;
          } else {
            this.$refs.pxap2.innerHTML = strContent;
          }
        }
      });
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    if (this.userInfo.role === 2) {
      if (MATE('project_sign', this.userInfo.college)) {
        this.is_ss = true
      }
    }
    this.pro_id = this.$route.params.id;
    this.pro_name = sessionStorage.getItem("PRO_Name");
    if (sessionStorage.getItem("list_is_ss")) {
      this.list_is_ss = true;
    }
    this.initData()
  },
  beforeDestroy() {
    sessionStorage.removeItem("PRO_Name");
    sessionStorage.removeItem("list_is_ss");
  }
}
</script>

<style scoped>
.project-modify-list-main {
  padding: 0 30px;
  min-width: 600px;
  max-width: 1200px;
  margin: 0 auto;
}
.modify-list-main-list {
  line-height: 1.6em !important;
}
.modify-list-main-list > .fl {
  padding-top: 9px;
}
.modify-list-main-list span {
  color: #000;
  border-bottom: 1px solid #000;
}
.model-title-strong {
  color: #e6a23c !important;
  font-weight: bolder !important;
}
</style>
