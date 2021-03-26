<template>
  <div
    class="app-project-check"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div class="project-check-main">
        <el-collapse v-model="activeName">
          <el-collapse-item title name="1">
            <template slot="title">
              基本信息
              <i class="header-icon el-icon-success"></i>
            </template>
            <ul class="step-list">
              <li class="clearfix">
                <strong class="fl item-title">主办学院：</strong>
                <div class="item-content">{{ form0.college }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">项目名称：</strong>
                <div class="item-content">
                  <template v-if="isYXB && major_name_fixed">
                    <div v-html="yxbProName"></div>
                  </template>
                  <template v-else>
                    {{ form0.pro_name }}
                  </template>
                </div>
              </li>
              <li v-if="isYXB && major_name_fixed" class="clearfix">
                <strong class="fl item-title">办班专业：</strong>
                <div class="item-content">
                  <strong class="warning">{{ major_name_fixed }}</strong>
                </div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">管理类型：</strong>
                <div class="item-content">{{ form0.gl_type | showType(proConfig.gl_type) }}</div>
              </li>
              <li class="clearfix" v-if="form0.gl_type === 5">
                <strong class="fl item-title">应标资质文件：</strong>
                <div
                  class="item-content"
                >{{ form0.preliminary | showType(proConfig.preliminary, 'preliminary') }}</div>
              </li>
              <li class="clearfix" v-else>
                <strong class="fl item-title">前期预立项项目：</strong>
                <div class="item-content">{{ form0.is_preliminary ? form0.pre_name : '（无）' }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">招生类型：</strong>
                <div class="item-content">{{ form0.zs_type | showType(proConfig.zs_type) }}</div>
              </li>
              <template v-if="form0.zs_type===2">
                <li class="clearfix">
                  <strong class="fl item-title">招生简章：</strong>
                  <span v-if="form0.zsjz">
                    <a href="#zsjz">查看招生简章文本</a>
                  </span>
                  <el-button v-else size="mini" type="text" @click="dialogVisible_zsjz_look = true">查看招生简章</el-button>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">报名表：</strong>
                  <div class="item-content" style="line-height: 26px;padding: 6px 0">
                    <div>
                      <span>附件：</span>
                      <a
                        v-if="form0.adm_reg_form"
                        target="_blank"
                        :href=" lookUrl+ '/'+form0.adm_reg_form"
                      >
                        <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                      </a>
                      <template v-else>（无）</template>
                    </div>
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">招生时间：</strong>
                  <div
                    class="item-content"
                  >{{ form0.zs_start_time | TimestampChangeFilter }} 至 {{ form0.zs_end_time | TimestampChangeFilter }}</div>
                </li>
              </template>
              <li class="clearfix">
                <strong class="fl item-title">招生对象：</strong>
                <div class="item-content">{{ form0.zsdx }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">举办时间：</strong>
                <div
                  class="item-content"
                >{{ form0.px_start_time | TimestampChangeFilter }} 至 {{ form0.px_end_time | TimestampChangeFilter }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">培训天数：</strong>
                <div class="item-content">{{ form0.pxts }} 天</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">培训总课时：</strong>
                <div class="item-content">{{ form0.pxzks }} 课时</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">招生人数：</strong>
                <div class="item-content">{{ form0.zsrs }} 人</div>
              </li>
              <li class="clearfix" v-if="form0.gl_type != 4">
                <strong class="fl item-title">地址：</strong>
                <div class="item-content">{{ form0.province }}/{{ form0.city }}</div>
              </li>
              <li class="clearfix" v-if="form0.gl_type != 4">
                <strong class="fl item-title">详细地址：</strong>
                <div class="item-content">{{ form0.pxdd }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">授课方式：</strong>
                <div class="item-content">{{ form0.skfs | showType(proConfig.skfs) }}</div>
              </li>
              <template v-if="form0.skfs == 2 || form0.skfs == 3">
                <li class="clearfix">
                  <strong class="fl item-title">培训网络平台：</strong>
                  <div class="item-content">{{ form0.platform_network }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">平台网址：</strong>
                  <div class="item-content">{{ form0.platform_site }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">培训平台介绍：</strong>
                  <div class="item-content">{{ form0.platform_introduced }}</div>
                </li>
              </template>
              <li class="clearfix">
                <strong class="fl item-title">是否零收费公益项目：</strong>
                <div class="item-content">{{ form0.welfare == 1 ? '是' : '否' }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">收费标准：</strong>
                <div class="item-content">
                  <template v-if="form0.ks_charge === 2">
                    <span v-if="form0.sfbz===2">学员自行按照标准支付，</span>
                    <span v-if="form0.sfbz===3">委托单位与学员共同支付，</span>
                    <span>{{ form0.specific_rate }}</span>
                  </template>
                  <template v-else>
                    <span v-if="form0.sfbz===1">委托单位统一支付 {{ form0.sfbz_dw }} 元 。</span>
                    <span v-if="form0.sfbz===2">受训学员自行按照 {{ form0.sfbz_xy }} 元/人标准支付 。</span>
                    <span v-if="form0.sfbz===3">
                      委托单位支付 {{ form0.sfbz_dw }} 元，
                      学员按照 {{ form0.sfbz_xy }} 元/人标准支付 。
                    </span>
                  </template>
                </div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">培训费用包含用途：</strong>
                <div class="item-content">{{ form0.pxfy_desc }}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">学员优惠政策：</strong>
                <template v-if="form0.is_yhzc">
                  <div class="item-content">
                    <div>
                      （一）优惠政策文件名称：{{ form0.yhzc_wjmc }}
                      <a
                        target="_blank"
                        :href=" lookUrl+ '/'+form0.yhzc_wj"
                      >
                        <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                      </a>
                    </div>
                    <div>（二）具体优惠方案：</div>
                    <div v-for="(item,index) in yhList" :key="index" style="line-height: 24px">
                      {{ index+1}}、 优惠价格：
                      <span class="show-val">{{ item.yhjg }} 元</span>，优惠条件：
                      <span class="show-val">{{ item.yhtj}}</span>。
                    </div>
                  </div>
                </template>
                <div v-else class="item-content">无</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">联系人：</strong>
                <div class="item-content">{{ form0.user||'未填写'}}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">联系人电话：</strong>
                <div class="item-content">{{ form0.tel||'未填写'}}</div>
              </li>
              <li class="clearfix">
                <strong class="fl item-title">备注：</strong>
                <div class="item-content">{{ form0.note }}</div>
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title name="2">
            <template slot="title">
              课程管理
              <i v-if="list1.length" class="header-icon el-icon-success"></i>
              <i v-else class="header-icon el-icon-warning"></i>
            </template>
            <div class="step-box">
              <template v-if="list1.length">
                <p class="annotation">* 可指定哪个老师的课程必须做评估（需要评估的课程请勾选）</p>
                <el-table
                  ref="multipleTable"
                  size="mini"
                  :data="list1"
                  @selection-change="handleSelectionChange"
                  border
                  style="width:100%"
                >
                  <el-table-column type="selection" width="38"></el-table-column>
                  <el-table-column align="center" label="课程名称" prop="cou_name"></el-table-column>
                  <el-table-column align="center" label="主讲教师">
                    <el-table-column align="center" prop="teacher" label="姓名"></el-table-column>
                    <el-table-column align="center" prop="job" label="职称"></el-table-column>
                    <el-table-column align="center" prop="idnumber" label="职工号/身份证号"></el-table-column>
                    <el-table-column align="center" prop="unit" label="工作单位"></el-table-column>
                  </el-table-column>
                  <el-table-column align="center" prop="school_hours" label="学时" width="80"></el-table-column>
                </el-table>
              </template>
              <template v-else>
                <p class="nothing">未添加课程信息！</p>
              </template>
            </div>
          </el-collapse-item>
          <el-collapse-item title name="3">
            <template slot="title">
              委托单位
              <i v-if="list2.length" class="header-icon el-icon-success"></i>
              <i v-else class="header-icon el-icon-warning"></i>
            </template>
            <template v-if="list2.length">
              <ul v-for="(item,index) in list2" class="step-list" :key="index">
                <li class="clearfix" v-if="list2.length>1">
                  <strong class="fl item-title" style="font-size: 16px">委托单位（{{ index+1}}）</strong>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">委托单位名称：</strong>
                  <div class="item-content">{{ item.jf_dwmc }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">单位地址：</strong>
                  <div class="item-content">{{ item.jf_dz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">邮编：</strong>
                  <div class="item-content">{{ item.jf_yb }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">联系人：</strong>
                  <div class="item-content">{{ item.jf_lxr }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">联系人电话：</strong>
                  <div class="item-content">{{ item.jf_lxdh}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">培训对象类型：</strong>
                  <div class="item-content">{{ item.pxdx | showType(proConfig.pxdx) }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">培训内容和课程安排：</strong>
                  <div class="item-content" style="margin-left: 220px">{{ item.pxap }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">收费方式与标准：</strong>
                  <div class="item-content">
                    <template v-if="form0.ks_charge === 2">
                      <span>{{ item.specific_rate }}</span>
                    </template>
                    <template v-else>
                      <p v-if="form0.sfbz===1">
                        委托单位支付合计：{{ item.sfbz_dw }} 元；
                        <template v-if="form0.welfare != 1">
                          分 {{ item.sfbz_dw_fq }} 期付款，
                          <template
                            v-if="item.sfbz_dw_zfsj"
                          >付款时间为 {{ item.sfbz_dw_zfsj}}</template>
                        </template>
                      </p>
                      <p v-if="form0.sfbz===2">由学员或所在单位在按照 {{ item.sfbz_xy }} 元/人标准一次性支付。</p>
                      <p v-if="form0.sfbz===3">
                        委托单位支付合计：{{ item.sfbz_dw }} 元；
                        <template v-if="form0.welfare != 1">
                          分 {{ item.sfbz_dw_fq }} 期付款，
                          <template
                            v-if="item.sfbz_dw_zfsj"
                          >付款时间为 {{ item.sfbz_dw_zfsj}}；</template>
                        </template>
                        学员支付标准：{{ item.sfbz_xy }} 元/人。
                      </p>
                    </template>
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">违约金比例：</strong>
                  <div class="item-content">{{ item.wyjbl}}%</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">协议份数：</strong>
                  <div
                    class="item-content"
                  >共{{ item.xy_num1}}份（甲方：{{ item.xy_num2}}份、乙方：{{ item.xy_num3}}份）</div>
                </li>
                <li v-if="index !== list2.length-1">
                  <p class="wt-line"></p>
                </li>
              </ul>
            </template>
          </el-collapse-item>
          <el-collapse-item title name="4">
            <template slot="title">
              辅助单位
              <i v-if="list3.length" class="header-icon el-icon-success"></i>
              <i v-else class="header-icon el-icon-warning"></i>
            </template>
            <template v-if="list3.length">
              <ul v-for="(item,index) in list3" class="step-list" :key="index">
                <li class="clearfix">
                  <strong class="fl item-title">辅助单位名称：</strong>
                  <div class="item-content">{{ item.yf_dwmc }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">资质文件名称：</strong>
                  <div class="item-content">{{ item.zzwj}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">资质文件编码：</strong>
                  <div class="item-content">{{ item.zzwj_bm}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">资质文件附件：</strong>
                  <div class="item-content">
                    <a target="_blank" :href=" lookUrl+ '/'+item.zzwj_file">
                      <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                    </a>
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">法人代表：</strong>
                  <div class="item-content">{{ item.frdb }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">法人代表照片：</strong>
                  <div class="item-content">
                    <a target="_blank" :href=" lookUrl+ '/'+item.frdb_file">
                      <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                    </a>
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">单位性质：</strong>
                  <div class="item-content">{{ item.dwxz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">联系电话：</strong>
                  <div class="item-content">{{ item.yf_lxdh}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">详细地址：</strong>
                  <div class="item-content">{{ item.yf_dz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">邮编：</strong>
                  <div class="item-content">{{ item.yf_yb }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">项目负责人：</strong>
                  <div class="item-content">{{ item.yf_lxr }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">培训内容和课程安排：</strong>
                  <div class="item-content">{{ item.pxap }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">申报项目单位负责的工作：</strong>
                  <div class="item-content">{{ item.jf_fzgz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">辅助单位负责的工作：</strong>
                  <div class="item-content">{{ item.yf_fzgz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">辅助单位负责的费用支出：</strong>
                  <div class="item-content">{{ item.yf_fyzc }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">{{ isYXB ? '辅助单位获得最高分成比例：' : '辅助单位获得的总分成比例：' }}</strong>
                  <div class="item-content">{{ item.yf_fcbl }}{{ (isYXB || (form0.create_time * 1000 > fz202101)) && (item.yf_fcbl || 0) > -1 ? '%' : '' }}</div>
                </li>
                <li v-if="isYXB || (form0.create_time * 1000 > fz202101)" class="clearfix">
                  <strong class="fl item-title">辅助单位具体分成情况：</strong>
                  <div class="item-content">{{ item.yf_fzjtfc }}</div>
                </li>
                <li v-if="isYXB || (form0.create_time * 1000 > fz202101)" class="clearfix">
                  <strong class="fl item-title">{{ isYXB ? '扣留乙方分成款的比例：' : '辅助单位分成款暂押比例：' }}</strong>
                  <div class="item-content">{{ item.wg_bili || 0}}%</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">辅助单位分成款分期数：</strong>
                  <div class="item-content">{{ item.yf_fqs }} 期</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">分成款付款时间：</strong>
                  <div class="item-content">{{ item.yf_fqs_time }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">收款银行账号：</strong>
                  <div class="item-content">{{ item.yf_yhzh}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">收款开户行：</strong>
                  <div class="item-content">{{ item.yf_khh}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">违约金比例：</strong>
                  <div class="item-content">{{ item.wyjbl}} %</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">协议份数：</strong>
                  <div
                    class="item-content"
                  >共{{ item.xy_num1}}份（甲方：{{ item.xy_num2}}份、乙方：{{ item.xy_num3}}份）</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">辅助单位权责议定方式：</strong>
                  <div class="item-content">{{ proConfig.obligation[item.obligation || '1']}}</div>
                </li>
                <li class="clearfix" v-if="`${item.obligation}` === '2'">
                  <strong class="fl item-title">谈判是否有第三方监督：</strong>
                  <div class="item-content">{{ item.obligation_type === 1 ? '无' : '有'}}</div>
                </li>
                <li
                  class="clearfix"
                  v-if="`${item.obligation}` === '2' && `${item.obligation_type}` === '2'"
                >
                  <strong class="fl item-title">谈判监督人：</strong>
                  <div class="item-content">{{ item.obligation_user }}</div>
                </li>
                <li
                  class="clearfix"
                  v-if="`${item.obligation}` === '2' && `${item.obligation_type}` === '1'"
                >
                  <strong class="fl item-title">无监督方的理由：</strong>
                  <div class="item-content">{{ item.obligation_reason}}</div>
                </li>
              </ul>
            </template>
            <p v-else class="nothing">未添加辅助单位信息！</p>
          </el-collapse-item>
          <el-collapse-item title name="8">
            <template slot="title">
              校内合作单位
              <i v-if="list5.length" class="header-icon el-icon-success"></i>
              <i v-else class="header-icon el-icon-warning"></i>
            </template>
            <template v-if="list5.length">
              <ul v-for="(item,index) in list5" class="step-list" :key="index">
                <li class="clearfix" v-if="list5.length>1">
                  <strong class="fl item-title" style="font-size: 16px">校内合作单位（{{ index+1}}）</strong>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">合作单位名称：</strong>
                  <div class="item-content">{{ item.yf_dwmc }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">联系电话：</strong>
                  <div class="item-content">{{ item.yf_lxdh}}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">详细地址：</strong>
                  <div class="item-content">{{ item.yf_dz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">项目负责人：</strong>
                  <div class="item-content">{{ item.yf_lxr }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">培训内容和课程安排：</strong>
                  <div class="item-content">{{ item.pxap }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">申报项目单位负责的工作：</strong>
                  <div class="item-content">{{ item.jf_fzgz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">合作单位负责的工作：</strong>
                  <div class="item-content">{{ item.yf_fzgz }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">合作单位负责的费用支出：</strong>
                  <div class="item-content">{{ item.yf_fyzc }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">{{ isYXB ? '合作单位获得最高分成比例：' : '合作单位获得的总分成比例：' }}</strong>
                  <div class="item-content">{{ item.yf_fcbl }}{{ isYXB && (item.yf_fcbl || 0) > -1 ? '%' : '' }}</div>
                </li>
                <li v-if="isYXB" class="clearfix">
                  <strong class="fl item-title">合作单位具体分成情况：</strong>
                  <div class="item-content">{{ item.yf_fzjtfc }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">合作单位分成款分期数：</strong>
                  <div class="item-content">{{ item.yf_fqs }} 期</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">分成款付款时间：</strong>
                  <div class="item-content">{{ item.yf_fqs_time }}</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">违约金比例：</strong>
                  <div class="item-content">{{ item.wyjbl}} %</div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">协议份数：</strong>
                  <div
                    class="item-content"
                  >共{{ item.xy_num1}}份（甲方：{{ item.xy_num2}}份、乙方：{{ item.xy_num3}}份）</div>
                </li>
                <li v-if="index !== list5.length-1">
                  <p class="wt-line"></p>
                </li>
              </ul>
            </template>
            <p v-else class="nothing">未添加校内合作单位信息！</p>
          </el-collapse-item>
          <el-collapse-item title name="5">
            <template slot="title">
              财务预算
              <i v-if="list4.length" class="header-icon el-icon-success"></i>
              <i v-else class="header-icon el-icon-warning"></i>
            </template>
            <template v-if="list4.length">
              <ul v-for="(item,index) in list4" class="step-list" :key="index">
                <li class="clearfix">
                  <strong class="fl item-title">计划培训收入：</strong>
                  <div class="item-content">
                    {{ item.sr_jhsr }} 元 （占比：{{ item.sr_jhsr|statisticsRatio([],item.sr_jhsr,1) }}
                    &nbsp;&nbsp;&nbsp;&nbsp;备注：{{ item.sr_jhsr_note?item.sr_jhsr_note:'无'}}）
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">学校管理费：</strong>
                  <div class="item-content">
                    {{ item.zc_xxglf }} 元 （占比：{{ item.zc_xxglf|statisticsRatio([],item.sr_jhsr,1) }}
                    &nbsp;&nbsp;&nbsp;&nbsp;备注：{{ item.zc_xxglf_note?item.zc_xxglf_note:'无'}}）
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">学院管理费用：</strong>
                  <div class="item-content">
                    {{ item.zc_xyglfy }} 元 （占比：{{ item.zc_xyglfy|statisticsRatio([],item.sr_jhsr,1) }}
                    &nbsp;&nbsp;&nbsp;&nbsp;备注：{{ item.zc_xyglfy_note?item.zc_xyglfy_note:'无'}}）
                  </div>
                  <span class="fl"></span>
                </li>
                <li v-if="list3.length" class="clearfix">
                  <strong class="fl item-title">辅助单位分成：</strong>
                  <div class="item-content">
                    {{ item.zc_fzdwfc }} 元 （占比：{{ item.zc_fzdwfc|statisticsRatio([],item.sr_jhsr,1) }}
                    &nbsp;&nbsp;&nbsp;&nbsp;备注：{{ item.zc_fzdwfc_note?item.zc_fzdwfc_note:'无'}}）
                  </div>
                </li>
                <template v-if="list5.length && item.hz_note && item.hz_note.length">
                  <li v-for="(val, ind) in item.hz_note" :key="ind" class="clearfix">
                    <strong class="fl item-title">
                      校内合作单位<template v-if="item.hz_note.length>1">（{{ ind + 1 }}）</template>分成：
                    </strong>
                    <div class="item-content">
                      {{ val.zc_hzdwfc }} 元 （占比：{{ val.zc_hzdwfc|statisticsRatio([],item.sr_jhsr,1) }}
                      &nbsp;&nbsp;&nbsp;&nbsp;备注：{{ val.zc_hzdwfc_note?val.zc_hzdwfc_note:'无'}}）
                    </div>
                  </li>
                </template>
                <li class="clearfix">
                  <strong class="fl item-title">项目支出费用：</strong>
                  <div class="item-content">
                    {{ item.zc_xmzcfy }} 元 （占比：{{ item.zc_xmzcfy|statisticsRatio([],item.sr_jhsr,1) }}
                    &nbsp;&nbsp;&nbsp;&nbsp;备注：{{ item.zc_xmzcfy_note?item.zc_xmzcfy_note:'无'}}）
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">项目结余：</strong>
                  <div class="item-content">
                    {{ item.sr_jhsr| subtraction(item.zc_xxglf, item.zc_xyglfy, item.zc_fzdwfc, item.zc_xmzcfy, (item.hz_note && item.hz_note.length ? hzNote(item.hz_note) : 0)) }} 元
                    （占比：
                    {{ item.sr_jhsr| subtraction(item.zc_xxglf, item.zc_xyglfy, item.zc_fzdwfc, item.zc_xmzcfy, (item.hz_note && item.hz_note.length ? hzNote(item.hz_note) : 0))|statisticsRatio([],item.sr_jhsr,1) }}）
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">
                    项目支出预算明细：
                    <br>
                    （总额：{{ item.ys_zc | showAll }} 元）
                  </strong>
                  <div class="item-content table-space">
                    <el-table size="mini" :data="item.ys_zc" border style="width:500px">
                      <el-table-column align="center" label="项目" prop="xm"></el-table-column>
                      <el-table-column align="center" label="费用总计" prop="fyzj"></el-table-column>
                      <el-table-column align="center" label="占总收入比（%）">
                        <template
                          slot-scope="scope"
                        >{{ scope.row.fyzj | statisticsRatio([],item.sr_jhsr,1) }}</template>
                      </el-table-column>
                      <el-table-column align="center" prop="note" label="备注"></el-table-column>
                    </el-table>
                  </div>
                </li>
                <li class="clearfix">
                  <strong class="fl item-title">项目支出预算备注：</strong>
                  <div class="item-content">{{ item.note }}</div>
                </li>
                <li v-if="list3.length" class="clearfix">
                  <strong class="fl item-title">
                    辅助单位支出预算明细：
                    <br>
                    （总额：{{ item.ys_fz | showAll }} 元）
                  </strong>
                  <div class="item-content table-space">
                    <el-table size="mini" :data="item.ys_fz" border style="width:500px">
                      <el-table-column align="center" label="项目" prop="xm"></el-table-column>
                      <el-table-column align="center" label="费用总计" prop="fyzj"></el-table-column>
                      <el-table-column align="center" label="占分成比（%）">
                        <template slot-scope="scope">
                          <template v-if="isYXB">
                            <template v-if="form0.sfbz != 1">
                              <template v-if="form0.zsrs*form0.sfbz_xy*(((list3[0]&&list3[0].yf_fcbl)?list3[0].yf_fcbl:0)/100)">
                                {{ scope.row.fyzj|statisticsRatio([],(form0.zsrs*form0.sfbz_xy*(((list3[0]&&list3[0].yf_fcbl)?list3[0].yf_fcbl:0)/100)),1) }}
                              </template>
                              <template v-else>0%</template>
                            </template>
                            <template v-else>
                              {{ scope.row.fyzj | statisticsRatio([],list4[0].zc_fzdwfc,1) }}
                            </template>
                          </template>
                          <template v-else>
                            {{ scope.row.fyzj | statisticsRatio([],list4[0].zc_fzdwfc,1) }}
                          </template>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="note" label="备注"></el-table-column>
                    </el-table>
                  </div>
                </li>
                <li v-if="list3.length" class="clearfix">
                  <strong class="fl item-title">辅助单位支出预算备注：</strong>
                  <div class="item-content">{{ item.fz_note }}</div>
                </li>
                <template v-if="list5.length &&  item.ys_hz.length">
                  <li v-for="(val, ind) in item.ys_hz" :key="`${ind }}ys_hz`" class="clearfix">
                    <strong class="fl item-title">
                      校内合作单位
                      <template v-if="item.ys_hz.length > 1">
                        （{{ ind + 1 }}）
                        <br>
                      </template>支出预算明细：
                      <br>
                      （总额：{{ val.note | showAll }} 元）
                    </strong>
                    <div class="item-content table-space">
                      <el-table size="mini" :data="val.note" border style="width:500px">
                        <el-table-column align="center" label="项目" prop="xm"></el-table-column>
                        <el-table-column align="center" label="费用总计" prop="fyzj"></el-table-column>
                        <el-table-column align="center" label="占分成比（%）">
                          <template
                            slot-scope="scope"
                          >{{ scope.row.fyzj | statisticsRatio([],item.hz_note[ind].zc_hzdwfc,1) }}</template>
                        </el-table-column>
                        <el-table-column align="center" prop="note" label="备注"></el-table-column>
                      </el-table>
                    </div>
                  </li>
                </template>
              </ul>
            </template>
            <p v-else class="nothing">未财务预算信息！</p>
          </el-collapse-item>
          <el-collapse-item v-if="$md5(`${userInfo.role}-1`) == Query.randome" title="审核" name="6">
            <div style="width: 90%; margin: 0 auto" class="collapse-check-box">
              <el-form :model="form" label-width="240px">
                <el-form-item v-if="(is_ss || (form0.college.indexOf('继续教育学院') != -1)) && form0.gl_type !== 5" label="查看项目申报书：">
                  <el-button
                    v-if="(is_ss && form0.is_sign_shenb===2) || (form0.college.indexOf('继续教育学院') != -1 && form0.sign_name_token && form0.sign_seal_token)"
                    type="text"
                    @click.native="handleSignLook"
                  >点击查看（已盖章）</el-button>
                  <span v-else style="color:#f56c6c;">未盖章</span>
                </el-form-item>
                <el-form-item label="学科类别：" :rules="[{required: true}]">
                  <el-radio-group v-model="form.xklb">
                    <el-radio
                      v-for="(val,key,index) in proConfig.xklb"
                      :label="key"
                      :key="index"
                    >{{ val}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否迟报漏报：" :rules="[{required: true}]">
                  <el-radio-group v-model="form.is_dgdwjs">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="培训类型：" :rules="[{required: true}]">
                  <el-radio-group v-model="form.pxlx">
                    <el-radio
                      v-for="(val,index) in pxlx"
                      :label="val.id"
                      :key="index"
                    >{{ val.title }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：">
                  <el-input
                    style="width: 90%"
                    v-model.trim="form.gly_note"
                    type="textarea"
                    maxlength="100"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <template v-if="!this.is_jypxzx && !this.is_ss">
                  <el-form-item label="是否推送至财务收费系统：" :rules="[{required: true}]">
                    <el-radio-group v-model="form.is_finance">
                      <el-radio :label="1">否</el-radio>
                      <el-radio :label="2">是</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
                <template v-if="form0.zs_type == 2">
                  <el-form-item label="是否推送到官网：" :rules="[{required: true}]">
                    <el-radio-group v-model="form.is_send_cms">
                      <el-radio :label="1">否</el-radio>
                      <el-radio :label="2">是</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
                <el-form-item label="是否通过审核：" :rules="[{required: true}]">
                  <el-radio-group v-model="form.pro_status">
                    <el-radio :label="3">审核通过</el-radio>
                    <el-radio :label="2">审核不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审核不通过原因：" :rules="[{required: true}]">
                  <el-input
                    style="width: 90%"
                    v-model.trim="form.content"
                    type="textarea"
                    maxlength="60"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <p
                    v-if="showPg"
                    class="tip-red"
                    style="color:#67C23A;"
                  >* 已指定需要做评估的课程，若取消评估，请清空课程管理的勾选项。</p>
                  <p v-else class="tip-red" style="color:#f56c6c;">* 未指定需要做评估的课程，若需评估，请前往课程管理勾选课程。</p>
                  <div class="text-align-center">
                    <el-button @click.native="handleSubmit" type="success">确 认</el-button>
                    <el-button @click.native="handleBack" type>返 回</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="form0.zsjz" title="招生简章：" name="7">
            <div id="zsjz" style="line-height: 20px;background-color: #ebeef5;padding: 20px">
              <div ref="pxap"></div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-if="$md5(`${userInfo.role}-1`) != Query.randome" class="four-align-center" style="margin-top: 20px;">
          <el-button @click.native="handleBack" type>返 回</el-button>
        </div>
      </div>
    </el-card>
    <el-backtop target=".app-home-main-row" :visibility-height="400"></el-backtop>
    <el-dialog
      :visible.sync="dialogVisible_zsjz_look"
      width="900px"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 760px; margin: 0 auto">
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
          <div v-for="(item, key) in content" :key="key">
            <template v-if="item.divide && form0.create_time * 1000 > zsjz_divide">
              <div
                style="font-weight: bold; line-height: 2em"
              >{{ item.order }}、{{ item.else_label }}</div>
            </template>
            <template v-else>
              <div style="font-weight: bold; line-height: 2em">{{ item.order }}、{{ item.label }}</div>
            </template>
            <template v-if="form0[key]">
              <div v-html="form0[key]" :class="`zsjz-look-content-${key}`"></div>
            </template>
            <template v-else>
              <div v-if="item.content" v-html="item.content" :class="`zsjz-look-content-${key}`"></div>
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
                    <p>开户行：中国工商银行北京紫竹院支行</p>
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
                      <p>开户行：中国工商银行股份有限公司北京紫竹院支行</p>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_zsjz_look = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
import { MATE } from '@/assets/js/config.special.js'
export default {
  name: "app-project-check",
  data() {
    return {
      loading1: false,
      headers: {}, 
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      pxlx: [],
      showPg: false,
      form: {
        id: 0, 
        uid: 0, 
        xklb: null, 
        is_dgdwjs: 0, 
        pxlx: null, 
        gly_note: "", 
        pro_status: 3, 
        content: "", 
        courses: [],
        is_finance: 1, 
        is_send_cms: 1
      },
      activeName: ["1", "2", "3", "4", "5", "6", "7", "8"],
      form0: {},
      list1: [],
      evaluate: [], 
      list2: [],
      list3: [],
      list5: [],
      list4: [],
      yhList: [], 
      is_ss: false,
      dialogVisible_zsjz_look: false,
      content: {
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
      major_name_fixed: '',
      Query: {}
    };
  },
  computed: {
    ...mapState([
      "lookUrl", "URL",
      "windowUrl", 'windowUrl_yxb',
      "zsjz_divide", 'userInfo',
      'versionTime_4', 'zsjz_divide_4',
      'fz202101'
    ]),
    yxbProName() {
      let str = this.form0.pro_name
      let key = this.major_name_fixed || ''
      let reg = new RegExp('(' + key + ')', 'g')
      let newstr = str.replace(reg, `<strong class="warning">${key}</strong>`)
      return newstr
    }
  },
  filters: {
    showType(val, obj, filed) {
      if (filed === "skfs" || filed === "preliminary") {
        let skfs = "";
        val.map((item, index) => {
          if (index) {
            skfs += `、${obj[item]}`;
          } else {
            skfs += `${obj[item]}`;
          }
        });
        return skfs;
      } else {
        for (let key in obj) {
          if (key == val) {
            return obj[key];
          }
        }
      }
    },
    showAll(list) {
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
      return sum / m;
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
    },
    subtraction() {
      let val = arguments[0];
      for (let k in arguments) {
        if (Number(k)) {
          val = parseFloat(val - arguments[k]).toFixed(2);
        }
      }
      return val;
    }
  },
  methods: {
    ...mapActions([
      "getCoursesForm1",
      "getWtForm2",
      "getFzForm3",
      "getHzForm5",
      "getYsForm4",
      "getProjectYh",
      "projectReview"
    ]),
    initData(id) {
      this.getCoursesForm1({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.list1 = this.list1.concat(
            data.data.data.list.xiaonei,
            data.data.data.list.xiaowai
          );
          this.evaluate = this.list1.filter(item => {
            return item.is_evaluate;
          });
          this.toggleSelection(this.evaluate);
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取课程信息" + data.data.error
          });
        }
      });
      this.getWtForm2({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.list2 = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取委托单位信息" + data.data.error
          });
        }
      });
      this.getFzForm3({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.list3 = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取辅助单位信息" + data.data.error
          });
        }
      });
      this.getHzForm5({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.list5 = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取校内合作单位信息" + data.data.error
          });
        }
      });
      this.getYsForm4({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.list4 = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取财务预算信息" + data.data.error
          });
        }
      });
      this.getProjectYh({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.yhList = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取优惠政策信息" + data.data.error
          });
        }
      });
    },
    handleSelectionChange(val) {
      let list = [];
      list = val.map(item => {
        return item.id;
      });
      if (list.length) {
        this.showPg = true;
      } else {
        this.showPg = false;
      }
      this.$set(this.form, "courses", list);
    },
    handleSubmit() {
      if (this.form.pro_status === 2) {
        if (!this.form.content) {
          this.$message({
            type: "warning",
            message: "请输入项目不通过原因！"
          });
          return false;
        }
      }
      if (this.form.pro_status === 3) {
        if (!this.form.xklb) {
          this.$message({
            type: "warning",
            message: "请选择学科类别！"
          });
          return false;
        }
        if (!this.form.pxlx || this.form.pxlx == 0) {
          this.$message({
            type: "warning",
            message: "请选择培训类型！"
          });
          return false;
        }
      }
      this.$set(this.form, "uid", this.userInfo.uid);
      this.loading1 = true;
      if (this.loading1) {
        this.projectReview({
          data: this.form
        }).then(data => {
          this.loading1 = false;
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data,
              onClose: () => {
                if (this.form.pro_status === 3) {
                  if (this.form0.gl_type === 5) {
                    this.backList()
                  } else {
                    if (this.show2020(this.form0.pro_code) || this.is_ss) {
                      this.backList()
                      this.handleInform(this.form0.id);
                    } else {
                      this.backList()
                    }
                  }
                } else {
                  this.backList()
                }
              }
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleBack() {
      this.backList()
    },
    handleSignLook() {
      sessionStorage.setItem("by_checkPro", JSON.stringify(this.form0));
      sessionStorage.setItem("pro_declare", this.form0.id);
      sessionStorage.setItem("from_sign_check", "1");
      this.$router.push("/home/project/declare/" + this.form0.id);
    },
    showPxap(strContent = "") {
      this.$nextTick(() => {
        if (this.form0.zsjz) {
          strContent = strContent.replace(/\r\n/g, "<br/>");
          strContent = strContent.replace(/\n/g, "<br/>");
          strContent = strContent.replace(/\s/g, "&nbsp;");
          this.$refs.pxap.innerHTML = strContent;
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection();
        });
      }
    },
    handleInform(id) {
      const time = new Date().getTime();
      const miwen = time + "shengxing";
      let key = this.$md5(miwen);
      let hrf =
        this.URL +
        (this.isYXB ? this.windowUrl_yxb : this.windowUrl) +
        "?authkey=" +
        this.headers.authkey +
        "&sessionid=" +
        this.headers.sessionid +
        "&pro_id=" +
        id +
        "&time=" +
        time +
        "&key=" +
        key;
      window.open(hrf);
    },
    show2020(code) {
      let y = new Date().getFullYear();
      return `${code}`.substring(0, 4) > 2019 || (!code && y > 2019);
    },
    backList () {
      this.$router.go(-1)
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
    
    this.Query = this.$route.query
    if (this.isYXB && this.Query.major_name_fixed) {
      this.major_name_fixed = this.Query.major_name_fixed
    }
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"));
    let data = JSON.parse(sessionStorage.getItem("checkPro")) || {};
    this.form0 = data;
    if (MATE('project_sign', data.college)) {
      this.is_ss = true;
    }
    if (MATE('project_noFinance', data.college)) {
      this.is_jypxzx = true;
    }
    this.initData(data.id);
    this.$set(this.form, "id", data.id);
    Object.assign(this.form, {
      id: data.id,
      pxlx: data.pxlx ? `${data.pxlx}` : this.isYXB ? '9' : null,
      xklb: data.xklb,
      gly_note: data.gly_note,
      is_dgdwjs: data.is_dgdwjs,
      // is_finance: data.is_finance,
      // is_send_cms: data.is_send_cms
      is_finance: data.pro_status == 1 ? this.isYXB ? 2 : data.is_finance : data.is_finance,
      is_send_cms: data.pro_status == 1 ? this.isYXB && data.zs_type == 2 ? 2 : data.is_send_cms : data.is_send_cms
    });
    if (data.pro_status === 2 || data.pro_status === 3) {
      Object.assign(this.form, {
        pro_status: data.pro_status
      });
    }
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
      } else if (key == 10) {
        list0[5] = {
          id: key,
          title: this.proConfig.pxlx[key]
        };
      }
    }
    this.pxlx = list0;
  },
  mounted() {
    this.showPxap(this.form0.zsjz);
  },
  beforeDestroy() {
    sessionStorage.removeItem("checkPro");
  },
  watch: {
    "form.pro_status"() {
      if (this.form.pro_status === 2) {
        Object.assign(this.form, {
          xklb: null,
          pxlx: null
        });
      }
    }
  }
};
</script>

<style scoped>
.app-project-check{
  padding-bottom: 40px;
}
.step-list,
.step-box {
  width: 80%;
  margin: 0 auto;
}
.step-list li {
  line-height: 40px;
}
.step-list li:nth-of-type(2n) {
  background-color: #fafafa;
}
.step-list li:nth-of-type(2n + 1) {
  background-color: #ebeef5;
}
.item-title {
  width: 180px;
  padding-left: 40px;
}
/*p{*/
/*margin: 0;*/
/*}*/
.table-space {
  padding: 10px 0;
}
.annotation {
  margin: 0;
  font-size: 12px;
  color: #8492a6;
}
.el-icon-warning {
  color: #f56c6c;
}
.el-icon-success {
  color: #67c23a;
}
.nothing {
  text-align: center;
  color: #f56c6c;
}
.wt-line {
  height: 2px;
  background-color: #8492a6;
}
.item-content {
  margin-left: 220px;
}
li p {
  margin: 0;
}
</style>
