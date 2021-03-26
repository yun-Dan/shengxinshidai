<template>
  <div
    class="app-project-add"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <div class="project-add-main" v-cloak>
        <div class="head-step">
          <el-steps :active="step" finish-status="success" align-center>
            <el-step title="基本信息" description></el-step>
            <el-step title="课程信息" description></el-step>
            <el-step title="委托单位" description></el-step>
            <el-step title="辅助单位" description></el-step>
            <el-step title="校内合作单位" description></el-step>
            <el-step title="财务预算" description></el-step>
          </el-steps>
        </div>
        <div class="project-add-main-body step-form-box-two">
          <template v-if="step===0">
            <el-form ref="form0" :model="form0" label-width="180px" class="step-0 submit-el-form">
              <el-form-item v-if="userInfo.role===1" label="主办学院：" :rules="[{ required: true}]">
                <el-select v-model="form0.college_id" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in structuresList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="userInfo.role===2" label="主办学院：">
                <span>{{ form0.college }}</span>
              </el-form-item>
              <el-form-item label="项目名称：" :rules="[{ required: true}]">
                <div v-if="prefix" class="annotation" style="line-height: 20px; padding-top: 8px">
                  请按照 “<span class="warning">
                    20**年中国人民大学***学院****专业在职课程培训班（春季班/秋季班/苏州班/一班/二班...）
                  </span>” 格式来填写！
                </div>
                <el-input v-model.trim="form0.pro_name" placeholder="请输入项目名称"></el-input>
              </el-form-item>
              <el-form-item label="管理类型：" :rules="[{ required: true}]">
                <el-radio-group v-model="form0.gl_type" @change="handleChangeGltype" :disabled="isYXB">
                  <template v-for="(val, k, index) in proConfig.gl_type">
                    <template v-if="isYXB">
                      <el-radio
                        v-if="k == 6"
                        :label="k - 0"
                        :key="index"
                      >{{ val}}</el-radio>
                    </template>
                    <template v-else>
                      <template v-if="k != 6">
                        <el-radio
                          v-if="!key && form0.gl_type === 4"
                          :label="k - 0"
                          :key="index"
                          disabled
                        >{{ val}}</el-radio>
                        <template v-else>
                          <el-radio
                            v-if="k !== '4'"
                            :label="k - 0"
                            :key="index"
                            :disabled="modify_gl_type !==5 && k == 5 && (key == 0 && form0.pro_status != 0 && !is_modify || is_modify)"
                          >{{ val}}</el-radio>
                        </template>
                      </template>
                    </template>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form0.gl_type === 5" label="应标资质文件：">
                <p class="annotation">以下资质文件不选择，则不能打印“介绍信”。</p>
                <el-checkbox-group v-model="form0.preliminary">
                  <template v-for="(val,key,index) in proConfig.preliminary">
                    <el-checkbox :label="Number(key)" :key="index">{{ val }}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
              <template v-else>
                <el-form-item v-if="!isYXB" label="前期是否有预立项项目：" :rules="[{ required: true}]">
                  <el-radio-group
                    v-model="form0.is_preliminary"
                    @change="handleChangeIsPreliminary"
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="form0.is_preliminary"
                  label="预立项项目："
                  :rules="[{ required: true}]"
                >
                  <div class="annotation">* 请输入前期预立项项目的 “项目编号” 点击 “查询” 按钮获取项目（如： 20190001）</div>
                  <el-input placeholder="请输入项目编号" v-model="preliminary_search">
                    <div slot="prepend" style="width: 380px; overflow: hidden">
                      <i v-if="preliminaryData.pro_name" class="el-icon-circle-check success"></i>
                      <i v-else class="el-icon-circle-close danger"></i>
                      {{ preliminaryData.pro_name }}
                    </div>
                    <el-button
                      v-if="preliminary_search_loading"
                      slot="append"
                      icon="el-icon-loading"
                    ></el-button>
                    <el-button v-else slot="append" @click="handlePreliminarySearch">查 询</el-button>
                  </el-input>
                </el-form-item>
              </template>
              <el-form-item label="招生类型：" :rules="[{ required: true}]">
                <el-radio-group v-model="form0.zs_type">
                  <el-radio
                    v-for="(val, key, index) in proConfig.zs_type"
                    :label="Number(key)"
                    :key="index"
                  >{{ val}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form0.zs_type===2">
                <el-form-item label="招生简章：" :rules="[{ required: true}]">
                  <el-button
                    icon="el-icon-edit-outline"
                    type="primary"
                    plain
                    size="small"
                    @click.native="handleEditZsjz"
                  >编辑</el-button>
                  <el-button
                    icon="el-icon-search"
                    type="success"
                    plain
                    size="small"
                    @click.native="dialogVisible_zsjz_look = true"
                    v-if="form0.adm_major || form0.adm_course || form0.adm_teaching || form0.adm_study_time ||
                                        form0.adm_requirement || form0.adm_attention || form0.adm_charging || form0.adm_certificate"
                  >预览</el-button>
                  <span
                    class="danger"
                    style="padding: 0 4px"
                    v-if="!form0.adm_major || !form0.adm_course || !form0.adm_teaching || !form0.adm_study_time ||
                                        !form0.adm_requirement || !form0.adm_attention || !form0.adm_charging || !form0.adm_certificate"
                  >招生简章未完善！</span>
                </el-form-item>
                <el-form-item label="上传报名表：">
                  <div class="upload-box">
                    <el-upload
                      class="upload"
                      :action="uploadExcelUrl1"
                      :on-success="handleSuccessB"
                      :on-remove="handleRemoveB"
                      :before-upload="beforeUploadB"
                      :headers="headers"
                      :with-credentials="true"
                      name="attachment"
                      accept=".pdf, .PDF"
                      :file-list="fileListB"
                      :limit="1"
                      :auto-upload="true"
                    >
                      <el-button
                        :key="1"
                        type="primary"
                        plain
                        size="mini"
                        icon="el-icon-upload el-icon--right"
                      >文件上传（限 PDF 格式）</el-button>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="招生起始时间：" :rules="[{ required: true}]">
                  <el-row>
                    <el-col :span="11">
                      <el-date-picker
                        type="date"
                        placeholder="开始日期"
                        v-model="form0.zs_start_time"
                        style="width: 100%;"
                      ></el-date-picker>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-date-picker
                        type="date"
                        placeholder="结束日期"
                        v-model="form0.zs_end_time"
                        style="width: 100%;"
                      ></el-date-picker>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <el-form-item label="招生对象：" :rules="[{ required: true}]">
                <el-input v-model.trim="form0.zsdx" placeholder="请输入招生对象"></el-input>
              </el-form-item>
              <el-form-item label="培训起始时间：" :rules="[{ required: true}]">
                <el-row>
                  <el-col :span="11">
                    <el-date-picker
                      type="date"
                      placeholder="开始日期"
                      v-model="form0.px_start_time"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model="form0.px_end_time"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="培训天数：" :rules="[{ required: true}]">
                <el-input-number v-model="form0.pxts" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="培训总课时：" :rules="[{ required: true}]">
                <el-input-number v-model="form0.pxzks" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="招生人数：" :rules="[{ required: true}]">
                <el-input-number v-model="form0.zsrs" :min="0"></el-input-number>
              </el-form-item>
              <template v-if="form0.gl_type !== 4">
                <el-form-item label="培训地址(省/市)：" :rules="[{ required: true}]">
                  <el-cascader
                    v-model="form0.site"
                    :options="options0"
                    @active-item-change="handleItemChange0"
                    :placeholder="placeholderSite0"
                    :props="props0"
                    :disabled="isYXB"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" :rules="[{ required: true}]">
                  <p class="annotation">如：北京市海淀区中国人民大学汇贤楼 / 江苏省苏州市工业园区人大苏州研究院开太楼</p>
                  <el-input v-model.trim="form0.pxdd" placeholder="请输入详细地址"></el-input>
                </el-form-item>
              </template>
              <el-form-item label="授课方式：" :rules="[{ required: true}]">
                <el-radio-group v-model="form0.skfs" @change="handleChangeSkfs">
                  <el-radio
                    v-for="(val,key,index) in proConfig.skfs"
                    :label="Number(key)"
                    :key="index"
                  >{{ val}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form0.skfs === 2 || form0.skfs === 3">
                <el-form-item label="网络平台名称：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form0.platform_network" placeholder="请输入网络平台名称"></el-input>
                </el-form-item>
                <el-form-item label="网络平台网址：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form0.platform_site" placeholder="请输入网络平台网址"></el-input>
                </el-form-item>
                <el-form-item label="网络平台介绍：" :rules="[{ required: true}]">
                  <el-input
                    v-model.trim="form0.platform_introduced"
                    type="textarea"
                    rows="3"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入网络平台介绍"
                  ></el-input>
                </el-form-item>
              </template>
              <el-form-item label="是否零收费公益项目：" :rules="[{ required: true}]">
                <el-radio-group v-model="form0.welfare" @change="handleChangeWelfare">
                  <el-radio :label="2">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="收费标准：" :rules="[{ required: true}]">
                <el-radio-group v-model="form0.sfbz" style="line-height: inherit;">
                  <template v-for="(val,key,index) in proConfig.sfbz">
                    <el-radio :label="Number(key)" :key="index">
                      {{ val}}
                    </el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="!isYXB && form0.sfbz !== 1 && form0.welfare == 2" label="按照课时或模块支付：" :rules="[{ required: true}]">
                <el-radio-group v-model="form0.ks_charge">
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="2">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form0.ks_charge === 1">
                <el-form-item label="委托单位支付金额(元)：" v-if="form0.sfbz === 1 || form0.sfbz === 3" :rules="[{ required: true}]">
                  <el-input-number
                    v-model="form0.sfbz_dw"
                    controls-position="right"
                    :min="0"
                    :precision="2"
                    :step="1"
                    :disabled="form0.welfare === 1"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="学员自行按标准支付(元/人)：" v-if="form0.sfbz === 2 || form0.sfbz === 3" :rules="[{ required: true}]">
                  <el-input-number
                    v-model="form0.sfbz_xy"
                    controls-position="right"
                    :min="0"
                    :precision="2"
                    :step="1"
                    :disabled="form0.welfare === 1"
                  ></el-input-number>
                </el-form-item>
              </template>
              <el-form-item label="具体收费标准：" v-if="form0.ks_charge === 2" :rules="[{ required: true}]">
                <el-input
                  type="textarea"
                  v-model.trim="form0.specific_rate"
                  rows="3"
                  maxlength="300"
                  show-word-limit
                  placeholder="请输入“按照课时或模块支付”的具体收费标准说明"
                ></el-input>
              </el-form-item>
              <el-form-item label="培训费用包含用途：" :rules="[{ required: true}]">
                <el-input
                  type="textarea"
                  v-model.trim="form0.pxfy_desc"
                  rows="6"
                  maxlength="600"
                  show-word-limit
                  placeholder="请输入培训费用包含的用途和项目说明"
                ></el-input>
              </el-form-item>
              <el-form-item label="学员是否有优惠政策：" :rules="[{ required: true}]">
                <el-radio-group
                  v-model="form0.is_yhzc"
                  :disabled="is_modify"
                  @change="handleChangeIsYhzc"
                >
                  <el-radio :label="1">有</el-radio>
                  <el-radio :label="0">无</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form0.is_yhzc">
                <el-form-item label="优惠政策文件：" :rules="[{ required: true}]">
                  <p class="annotation">
                    * 填写名称（例：
                    <span>X学院2018年第1次党政联席会议纪要</span> 等），同时上传文件
                  </p>
                  <el-input v-model.trim="form0.yhzc_wjmc" placeholder="请输入优惠政策文件名称"></el-input>
                  <div class="upload-box">
                    <el-upload
                      class="upload"
                      :action="uploadExcelUrl1"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove"
                      :before-upload="beforeUpload"
                      :headers="headers"
                      name="attachment"
                      :with-credentials="true"
                      accept=".pdf, .PDF, .jpg, .JPG, .png, .PNG, .gif, .GIF"
                      :file-list="fileList"
                      :limit="1"
                      :auto-upload="true"
                    >
                      <el-button
                        :key="1"
                        type="primary"
                        plain
                        size="mini"
                        icon="el-icon-upload el-icon--right"
                      >文件上传（限 PDF/ JPG/ PNG/ GIF 格式）</el-button>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="具体优惠方案：" :rules="[{ required: true}]">
                  <p class="annotation" style="line-height: 20px; padding-top: 10px;">
                    * 如：优惠后价格
                    <span>600.00</span> 元；
                    优惠条件
                    <span>10人以上团体报名</span>
                    或
                    <span>往期培训班老学员</span>&nbsp;
                    <span class="danger" style="text-decoration: none;">（注意：请填写优惠后的实际缴费金额，不是优惠金额！）</span>
                  </p>
                  <el-table
                    :data="form0.yhzc_list"
                    size="mini"
                    border
                    :header-cell-style="{backgroundColor:'#f5f7fa'}"
                    class="input-center"
                    style="width: 100%"
                  >
                    <el-table-column align="center" label="优惠后价格（元）">
                      <template slot-scope="scope">
                        <el-input-number
                          v-model="scope.row.yhjg"
                          :controls="false"
                          :precision="2"
                          :disabled="is_modify"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yhtj" label="优惠条件">
                      <template slot-scope="scope">
                        <el-input
                          v-model.trim="scope.row.yhtj"
                          placeholder="请输入优惠条件"
                          :disabled="is_modify"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="!is_modify" header-align="center" label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button
                          v-if="scope.$index>0||form0.yhzc_list.length!==1"
                          @click.native="handleDelete(0,scope.$index)"
                          type="text"
                          size="mini"
                        >删除</el-button>
                        <el-button
                          v-if="scope.$index+1===form0.yhzc_list.length"
                          @click.native="handleAdd(0)"
                          type="text"
                          size="mini"
                        >新增</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </template>
              <el-form-item label="项目联系人：" :rules="[{ required: true}]">
                <el-input v-model.trim="form0.user" placeholder="请输入联系人姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式：" :rules="[{ required: true}]">
                <el-input v-model.trim="form0.tel" placeholder="请输入联系方式"></el-input>
              </el-form-item>
              <el-form-item label="备注：">
                <el-input
                  type="textarea"
                  v-model.trim="form0.note"
                  rows="3"
                  maxlength="300"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item class="text-align-center">
                <el-button v-if="userInfo.role != 1 && !is_modify" @click.native="handleForm00(0)" type="success" plain>保 存</el-button>
                <el-button @click.native="handleForm0" type="success">下一步</el-button>
                <el-button @click.native="handleBack" type>返 回</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="step===1">
            <el-form ref="form1" :model="form1" class="step-1">
              <el-form-item>
                <div style="padding-left: 20px">
                  <el-button
                    @click.native="handleImport"
                    type="primary"
                    icon="el-icon-upload"
                    plain
                  >导入课程</el-button>
                </div>
              </el-form-item>
              <el-form-item v-if="!readMajor">
                <el-table
                  size="mini"
                  :data="form1.courses.xiaonei"
                  border
                  class="course-box input-center"
                >
                  <el-table-column align="center" label="课程名称">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.cou_name" placeholder="请输入课程名称"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="校内教师">
                    <el-table-column align="center" label="姓名" width="80">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.teacher" placeholder="如：张三"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="职称" width="80">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.job" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="职工号" width="180">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.idnumber" placeholder="请输入8位数字职工号"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="工作单位" width="100">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.unit" placeholder></el-input>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column align="center" label="学时" width="80">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.school_hours" placeholder="如：4"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" label="操作" width="80">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index>0||form1.courses.xiaonei.length!==1"
                        @click.native="handleDelete(1,scope.$index,1)"
                        type="text"
                        size="mini"
                      >删除</el-button>
                      <el-button
                        v-if="scope.$index+1===form1.courses.xiaonei.length"
                        @click.native="handleAdd(1,scope.$index,1)"
                        type="text"
                        size="mini"
                      >新增</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  size="mini"
                  :data="form1.courses.xiaowai"
                  border
                  class="course-box input-center"
                >
                  <el-table-column align="center" label="课程名称">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.cou_name" placeholder="请输入课程名称"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="校外教师">
                    <el-table-column align="center" label="姓名" width="80">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.teacher" placeholder="如：张三"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="职称" width="80">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.job" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="身份证号" width="180">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.idnumber" placeholder="请输入身份证号"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="工作单位" width="100">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.unit" placeholder></el-input>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column align="center" label="学时" width="80">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.school_hours" placeholder="如：4"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" label="操作" width="80">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index>0||form1.courses.xiaowai.length!==1"
                        @click.native="handleDelete(1,scope.$index,2)"
                        type="text"
                        size="mini"
                      >删除</el-button>
                      <el-button
                        v-if="scope.$index+1===form1.courses.xiaowai.length"
                        @click.native="handleAdd(1,scope.$index,2)"
                        type="text"
                        size="mini"
                      >新增</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item v-if="readMajor">
                <el-table size="mini" :data="MajorCourse"
                  border class="course-box input-center">
                  <el-table-column align="center" label="课程名称">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.cou_name" placeholder="请输入课程名称"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="教师信息">
                    <el-table-column align="center" label="姓名" width="80">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.teacher" placeholder="如：张三"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="职称" width="80">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.job" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="职工号(校内) / 身份证号(校外)" width="180">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.idnumber" placeholder="请输入职工号 / 身份证号"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="工作单位" width="100">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.unit" placeholder></el-input>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column align="center" label="学时" width="80">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.school_hours" placeholder="如：4"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" label="操作" width="80">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index>0||MajorCourse.length!==1"
                        @click.native="handleDelete(1, scope.$index, 3)"
                        type="text" size="mini">删除</el-button>
                      <el-button
                        v-if="scope.$index+1===MajorCourse.length"
                        @click.native="handleAdd(1, scope.$index, 3)"
                        type="text" size="mini">新增</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item class="text-align-center">
                <div class="course-tip">
                  * 请完整填写项目所有课程，
                  <span class="must-course-item">课程名称</span>、
                  <span class="must-course-item">教师姓名</span>、
                  <span class="must-course-item">职工号（8位）</span> /
                  <span class="must-course-item">身份证号（18位）</span>、
                  <span class="must-course-item">学时</span>
                  为必填项。
                  <br>若该课程无主讲教师时，姓名、职称请填写“无”，职工号请填写“00000000” / 身份证号请填写“000000000000000000”
                </div>
                <el-button v-if="userInfo.role != 1 && !is_modify" @click.native="handleForm00(1)" type="success" plain>保 存</el-button>
                <el-button @click.native="step=0" type="success">上一步</el-button>
                <el-button @click.native="handleForm1" type="success">下一步</el-button>
                <el-button @click.native="handleBack" type>返 回</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="step===2">
            <el-form :model="form2" label-width="200px" class="submit-el-form">
              <el-form-item label="是否有委托单位" :rules="[{ required: true}]">
                <el-radio-group v-model="form2.is_wtdw">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form2.is_wtdw">
                <el-form-item>
                  <p class="annotation step-annotation">（ 重要提示：以下信息将由系统自动填充入《委托培训协议书》的文本中，请认真填报。）</p>
                </el-form-item>
              </template>
            </el-form>
            <el-collapse
              v-if="form2.is_wtdw && form2.lists"
              v-model="activeNameWT"
              accordion
              class="project-collapse"
            >
              <el-collapse-item
                v-for="(item, index) in form2.lists"
                :key="`${index + 1}`"
                :name="`${index + 1}`"
                :disabled="activeNameWT === `${index + 1}`"
              >
                <template slot="title">
                  <div style="padding-left: 0">
                    <el-button
                      type="danger"
                      size="mini"
                      circle
                      plain
                      icon="el-icon-delete-solid"
                      :disabled="form2.lists.length === 1 || activeNameWT === `${index + 1}`"
                      style="margin: 0 14px"
                      @click.native="handleDeleteWT(index)"
                    ></el-button>
                    <span style="padding-left: 0">委托单位信息（{{ index + 1 }}）</span>
                  </div>
                </template>
                <el-form label-width="200px" class="submit-el-form">
                  <el-form-item label="委托单位名称：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.jf_dwmc" placeholder="请输入委托单位名称"></el-input>
                  </el-form-item>
                  <el-form-item label="委托单位联系人：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.jf_lxr" placeholder="请输入委托单位联系人姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="委托单位联系人电话：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.jf_lxdh" placeholder="请输入委托单位联系人电话"></el-input>
                  </el-form-item>
                  <el-form-item label="委托单位地址：" :rules="[{ required: true}]" v-cloak>
                    <el-cascader
                      v-model="item.site"
                      :options="item.options2||[]"
                      @active-item-change="handleItemChange2"
                      :placeholder="item.placeholderSite2"
                      :props="item.props2"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="委托单位详细地址：" :rules="[{ required: true}]">
                    <p class="annotation">如：北京市海淀区中国人民大学汇贤楼 / 江苏省苏州市工业园区人大苏州研究院开太楼</p>
                    <el-input v-model.trim="item.jf_dz" placeholder="请输入单位地址（详细到街道、门牌号）"></el-input>
                  </el-form-item>
                  <el-form-item label="邮编：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.jf_yb" placeholder="请输入邮编"></el-input>
                  </el-form-item>
                  <el-form-item label="培训对象类型：" :rules="[{ required: true}]">
                    <div v-for="(v,k,i) in proConfig.pxdx" :key="i">
                      <el-radio v-model="item.pxdx" :label="Number(k)">{{ v }}</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item label="培训内容及课程安排：" :rules="[{ required: true}]">
                    <el-input
                      v-model.trim="item.pxap"
                      type="textarea"
                      rows="6"
                      maxlength="600"
                      show-word-limit
                      placeholder="请输入培训内容及课程安排（包括：举办多期培训的时间、地点、人数安排列表等详细计划）"
                    ></el-input>
                  </el-form-item>
                  <template v-if="(sfbzVal === 1 || sfbzVal === 3) &&  ksCharge === 1">
                    <el-form-item label="委托单位支付金额（元）：" :rules="[{ required: true}]">
                      <el-input-number
                        v-model="item.sfbz_dw"
                        controls-position="right"
                        :min="0"
                        :precision="2"
                        :step="1"
                        :disabled="welfareVal == 1"
                      ></el-input-number>
                    </el-form-item>
                    <template v-if="welfareVal == 2">
                      <el-form-item label="委托单位支付分期数（期）：" :rules="[{ required: true}]">
                        <el-input-number v-model="item.sfbz_dw_fq" :min="0" :max="12"></el-input-number>
                      </el-form-item>
                      <el-form-item label="委托单位支付时间说明：" :rules="[{ required: true}]">
                        <el-input
                          type="textarea"
                          v-model.trim="item.sfbz_dw_zfsj"
                          rows="3"
                          maxlength="300"
                          show-word-limit
                          placeholder="请输入分期支付时间详细说明"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </template>
                  <el-form-item v-if="(sfbzVal === 2 || sfbzVal === 3) &&  ksCharge === 1" label="学员自行按标准支付(元/人)：" :rules="[{ required: true}]">
                    <el-input-number
                      v-model="item.sfbz_xy"
                      controls-position="right"
                      :min="0"
                      :precision="2"
                      :step="1"
                      :disabled="welfareVal == 1"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item v-if="(sfbzVal === 2 || sfbzVal === 3) && ksCharge === 2" label="具体收费标准：">
                    <div slot="label" style="line-height: 20px; padding-top: 8px">
                      <span class="danger">*</span>
                      具体收费标准：<br/>（按照课时或模块支付）
                    </div>
                    <el-input
                      type="textarea"
                      v-model.trim="item.specific_rate"
                      rows="3"
                      maxlength="300"
                      show-word-limit
                      placeholder="请输入具体收费标准"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="违约金比例（%）：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.wyjbl" :controls="false" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="协议总份数：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.xy_num1" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="甲方执协议份数：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.xy_num2" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="乙方执协议份数：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.xy_num3" :min="0"></el-input-number>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <div style="margin-left: 200px; padding-top: 20px" class="text-align-center">
              <el-button v-if="userInfo.role != 1 && !is_modify" @click.native="handleForm00(2)" type="success" plain>保 存</el-button>
              <el-button @click.native="step=1" type="success">上一步</el-button>
              <el-button @click.native="handleForm2" type="success">下一步</el-button>
              <el-button @click.native="handleBack" type>返 回</el-button>
              <div
                v-if="form2.is_wtdw"
                style="position: fixed; right: 40px; bottom: 90px; z-index: 10;"
              >
                <el-button @click.native="handleAddWT" type="warning">新增委托单位</el-button>
              </div>
            </div>
          </template>
          <template v-if="step===3">
            <el-form ref="form3" :model="form3" label-width="220px" class="submit-el-form">
              <el-form-item label="是否有辅助单位：" :rules="[{ required: true}]">
                <el-radio-group v-model="form3.is_fzdw">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form3.is_fzdw">
                <el-form-item>
                  <p class="annotation step-annotation">（注：以下信息将由系统自动填充入《培训辅助工作协议书》的文本中，请认真填报。）</p>
                </el-form-item>
                <el-form-item label="辅助单位名称：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.yf_dwmc" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="资质文件名称：" :rules="[{ required: true}]">
                  <el-radio-group v-model="form3.zzwj">
                    <el-radio label="营业执照注册号">营业执照注册号</el-radio>
                    <el-radio label="社会统一信用代码号">社会统一信用代码号</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="资质文件上传：" :rules="[{ required: true}]">
                  <div class="upload-box">
                    <el-upload
                      class="upload"
                      :action="uploadExcelUrl1"
                      :on-success="handleZzwjSuccess"
                      :on-remove="beforeZzwjRemove"
                      :before-upload="beforePictureUpload"
                      :headers="headers"
                      :with-credentials="true"
                      name="attachment"
                      accept=".jpg, .JPG, .png, .PNG, .gif, .GIF"
                      :file-list="fileListZzwj"
                      :limit="1"
                      :auto-upload="true"
                    >
                      <el-button
                        :key="1"
                        type="primary"
                        plain
                        size="mini"
                        icon="el-icon-upload el-icon--right"
                      >上 传 （限 JPG/ PNG/ GIF 格式）</el-button>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="资质文件编码：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.zzwj_bm" placeholder="请输入相关资质文件编码"></el-input>
                </el-form-item>
                <el-form-item label="法人代表：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.frdb" placeholder="请输入法人代表"></el-input>
                </el-form-item>
                <el-form-item label="法人代表身份证上传：" :rules="[{ required: true}]">
                  <div class="upload-box">
                    <el-upload
                      class="upload"
                      :action="uploadExcelUrl1"
                      :on-success="handleFrdbSuccess"
                      :on-remove="beforeFrdbRemove"
                      :before-upload="beforePictureUpload"
                      :headers="headers"
                      :with-credentials="true"
                      name="attachment"
                      accept=".jpg, .JPG, .png, .PNG, .gif, .GIF"
                      :file-list="fileListFrdb"
                      :limit="1"
                      :auto-upload="true"
                    >
                      <el-button
                        :key="1"
                        type="primary"
                        plain
                        size="mini"
                        icon="el-icon-upload el-icon--right"
                      >上 传（限 JPG/ PNG/ GIF 格式）</el-button>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="单位性质：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.dwxz" placeholder="请输入单位性质"></el-input>
                </el-form-item>
                <el-form-item label="辅助单位联系人电话：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.yf_lxdh" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="辅助单位地址：" :rules="[{ required: true}]">
                  <p class="annotation">* 地址详细到街道、门牌号</p>
                  <el-input v-model.trim="form3.yf_dz" placeholder="请输入辅助单位详细地址"></el-input>
                </el-form-item>
                <el-form-item label="邮编：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.yf_yb" placeholder="请输入邮编"></el-input>
                </el-form-item>
                <el-form-item label="项目负责人：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.yf_lxr" placeholder="请输入项目负责人"></el-input>
                </el-form-item>
                <el-form-item label="培训内容和课程安排：" :rules="[{ required: true}]">
                  <el-input
                    v-model.trim="form3.pxap"
                    type="textarea"
                    rows="5"
                    maxlength="600"
                    show-word-limit
                    placeholder="请简要说明培训内容和课程安排"
                  ></el-input>
                </el-form-item>
                <el-form-item label="申报项目单位负责工作：" :rules="[{ required: true}]">
                  <p class="annotation">* 请勿在输入框内填写 “课程设置、教师选用，以及” ， 系统会自动生成该内容</p>
                  <el-input
                    v-model.trim="form3.jf_fzgz"
                    type="textarea"
                    rows="3"
                    maxlength="300"
                    show-word-limit
                    placeholder="请简要说明申报项目单位负责的工作"
                  ></el-input>
                </el-form-item>
                <el-form-item label="辅助单位负责工作：" :rules="[{ required: true}]">
                  <el-input
                    v-model.trim="form3.yf_fzgz"
                    type="textarea"
                    rows="3"
                    maxlength="300"
                    show-word-limit
                    placeholder="请简要说明辅助单位负责的工作"
                  ></el-input>
                </el-form-item>
                <el-form-item label="辅助单位负责的费用支出：" :rules="[{ required: true}]">
                  <el-input
                    v-model.trim="form3.yf_fyzc"
                    type="textarea"
                    rows="3"
                    maxlength="200"
                    show-word-limit
                    placeholder="请简要说明辅助单位负责的费用支出"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="isYXB ? '辅助单位获得最高分成比例（%）：' : `辅助单位获得的总分成比例${createTime > fz202101?'（%）': ''}：`" :rules="[{ required: true}]">
                  <p v-if="!isYXB && (fz202101 > createTime)" class="annotation">
                    * 如果填写分成金额请务必换算出分成比例。
                  </p>
                  <el-input-number v-if="isYXB || (createTime > fz202101)" v-model="form3.yf_fcbl" :controls="false" :min="0"></el-input-number>
                  <el-input v-else
                    v-model="form3.yf_fcbl"
                    placeholder="请输入总分成比例"
                    maxlength="150" type="textarea" rows="3"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="isYXB || (createTime > fz202101)" label="辅助单位具体分成情况：" :rules="[{ required: true}]">
                  <el-input v-model="form3.yf_fzjtfc" placeholder="请输入具体分成情况"
                    maxlength="150" type="textarea" rows="3" show-word-limit></el-input>
                </el-form-item>
                <el-form-item v-if="isYXB || (createTime > fz202101)" :label="isYXB ? '扣留乙方分成款的比例（%）：' : '辅助单位分成款暂押比例（%）：'" :rules="[{ required: true}]">
                  <el-input-number v-model="form3.wg_bili" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="辅助单位分成款分期数（期）：" :rules="[{ required: true}]">
                  <el-input-number v-model="form3.yf_fqs" :min="0" :max="12"></el-input-number>
                </el-form-item>
                <el-form-item label="分成款付款时间说明：" :rules="[{ required: true}]">
                  <el-input
                    v-model="form3.yf_fqs_time"
                    type="textarea"
                    rows="3"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入分成款付款时间说明"
                  ></el-input>
                </el-form-item>
                <el-form-item label="辅助单位银行收款账号：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.yf_yhzh" placeholder="请输入辅助单位收款银行账号"></el-input>
                </el-form-item>
                <el-form-item label="收款开户行：" :rules="[{ required: true}]">
                  <el-input v-model.trim="form3.yf_khh" placeholder="请输入开户行"></el-input>
                </el-form-item>
                <el-form-item label="违约金比例（%）：" :rules="[{ required: true}]">
                  <el-input-number v-model="form3.wyjbl" :controls="false" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="协议总份数：" :rules="[{ required: true}]">
                  <el-input-number v-model="form3.xy_num1" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="甲方执协议份数：" :rules="[{ required: true}]">
                  <el-input-number v-model="form3.xy_num2" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="乙方执协议份数：" :rules="[{ required: true}]">
                  <el-input-number v-model="form3.xy_num3" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="辅助单位权责议定方式：" :rules="[{ required: true}]">
                  <el-radio-group v-model="form3.obligation">
                    <el-radio
                      v-for="(val, key) in proConfig.obligation"
                      :label="key-0"
                      :key="key"
                    >{{ val}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="form3.obligation === 2"
                  label="谈判是否有第三方监督："
                  :rules="[{ required: true}]"
                >
                  <el-radio-group v-model="form3.obligation_type">
                    <el-radio :label="1">无</el-radio>
                    <el-radio :label="2">有</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="form3.obligation === 2 && form3.obligation_type === 2"
                  label="谈判监督人："
                  :rules="[{ required: true}]"
                >
                  <el-input v-model.trim="form3.obligation_user" placeholder="请输入谈判监督人"></el-input>
                </el-form-item>
                <el-form-item
                  v-if="form3.obligation === 2 && form3.obligation_type === 1"
                  label="无监督方的理由："
                  :rules="[{ required: true}]"
                >
                  <el-input
                    v-model="form3.obligation_reason"
                    type="textarea"
                    rows="3"
                    maxlength="100"
                    show-word-limit
                    placeholder="请输入无监督方的理由"
                  ></el-input>
                </el-form-item>
              </template>
              <el-form-item class="text-align-center">
                <el-button v-if="userInfo.role != 1 && !is_modify" @click.native="handleForm00(3)" type="success" plain>保 存</el-button>
                <el-button @click.native="handleStep2" type="success">上一步</el-button>
                <el-button @click.native="handleForm3" type="success">下一步</el-button>
                <el-button @click.native="handleBack" type>返 回</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="step===4">
            <el-form :model="form5" label-width="200px" class="submit-el-form">
              <el-form-item label="是否有校内合作单位：" :rules="[{ required: true}]">
                <el-radio-group v-model="form5.is_hzdw">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form5.is_hzdw">
                <el-form-item>
                  <p class="annotation step-annotation">（注：以下信息将由系统自动填充入《校内单位培训合作协议书》的文本中，请认真填报。）</p>
                </el-form-item>
              </template>
            </el-form>
            <el-collapse
              v-if="form5.is_hzdw && form5.lists"
              v-model="activeNameHZ"
              accordion
              class="project-collapse"
            >
              <el-collapse-item
                v-for="(item, index) in form5.lists"
                :key="`${index + 1}`"
                :name="`${index + 1}`"
                :disabled="activeNameHZ === `${index + 1}`"
              >
                <template slot="title">
                  <div>
                    <el-button
                      type="danger"
                      size="mini"
                      circle
                      plain
                      icon="el-icon-delete-solid"
                      :disabled="form5.lists.length === 1 || activeNameHZ === `${index + 1}`"
                      style="margin: 0 14px"
                      @click.native="handleDeleteHZ(index)"
                    ></el-button>
                    <span style="padding-left: 0">校内合作单位信息（{{ index+1 }}）</span>
                  </div>
                </template>
                <el-form label-width="220px" class="submit-el-form">
                  <el-form-item label="合作单位名称：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.yf_dwmc" placeholder="请输入合作单位名称"></el-input>
                  </el-form-item>
                  <el-form-item label="合作单位联系人电话：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.yf_lxdh" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                  <el-form-item label="合作单位地址：" :rules="[{ required: true}]">
                    <p class="annotation">* 地址详细到街道、门牌号</p>
                    <el-input v-model.trim="item.yf_dz" placeholder="请输入合作单位详细地址"></el-input>
                  </el-form-item>
                  <el-form-item label="项目负责人：" :rules="[{ required: true}]">
                    <el-input v-model.trim="item.yf_lxr" placeholder="请输入项目负责人"></el-input>
                  </el-form-item>
                  <el-form-item label="培训内容和课程安排：" :rules="[{ required: true}]">
                    <el-input
                      v-model.trim="item.pxap"
                      type="textarea"
                      rows="5"
                      maxlength="600"
                      show-word-limit
                      placeholder="请简要说明培训内容和课程安排"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="申报项目单位负责工作：" :rules="[{ required: true}]">
                    <el-input
                      v-model.trim="item.jf_fzgz"
                      type="textarea"
                      rows="3"
                      maxlength="300"
                      show-word-limit
                      placeholder="请简要说明申报项目单位负责的工作"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="合作单位负责工作：" :rules="[{ required: true}]">
                    <el-input
                      v-model.trim="item.yf_fzgz"
                      type="textarea"
                      rows="3"
                      maxlength="300"
                      show-word-limit
                      placeholder="请简要说明合作单位负责工作"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="合作单位负责的费用支出：" :rules="[{ required: true}]">
                    <el-input
                      v-model.trim="item.yf_fyzc"
                      type="textarea"
                      rows="3"
                      maxlength="200"
                      show-word-limit
                      placeholder="请简要说明合作单位负责的费用支出"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="isYXB ? '合作单位获得最高分成比例（%）：' : '合作单位获得的总分成比例：'" :rules="[{ required: true}]">
                    <p v-if="!isYXB" class="annotation">
                      * 如果填写分成金额请务必换算出分成比例。
                    </p>
                    <el-input-number v-if="isYXB" v-model="item.yf_fcbl" :controls="false" :min="0"></el-input-number>
                    <el-input v-else
                      v-model="item.yf_fcbl"
                      placeholder="请输入总分成比例"
                      maxlength="150" type="textarea" rows="3"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                  <el-form-item v-if="isYXB" label="合作单位具体分成情况：" :rules="[{ required: true}]">
                    <el-input v-model="item.yf_fzjtfc" placeholder="请输入具体分成情况"
                      maxlength="150" type="textarea" rows="3" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item label="合作单位分成款分期数（期）：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.yf_fqs" :min="0" :max="12"></el-input-number>
                  </el-form-item>
                  <el-form-item label="分成款付款时间说明：" :rules="[{ required: true}]">
                    <el-input
                      v-model.trim="item.yf_fqs_time"
                      type="textarea"
                      rows="3"
                      maxlength="200"
                      show-word-limit
                      placeholder="请输入分成款付款时间说明"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="违约金比例（%）：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.wyjbl" :controls="false"></el-input-number>
                  </el-form-item>
                  <el-form-item label="协议总份数：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.xy_num1" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="甲方执协议份数：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.xy_num2" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="乙方执协议份数：" :rules="[{ required: true}]">
                    <el-input-number v-model="item.xy_num3" :min="0"></el-input-number>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <div class="text-align-center" style="margin-top: 20px">
              <el-button v-if="userInfo.role != 1 && !is_modify" @click.native="handleForm00(5)" type="success" plain>保 存</el-button>
              <el-button @click.native="handleStep3" type="success">上一步</el-button>
              <el-button @click.native="handleForm5" type="success">下一步</el-button>
              <el-button @click.native="handleBack" type>返 回</el-button>
              <div
                v-if="form5.is_hzdw"
                style="position: fixed; right: 40px; bottom: 90px; z-index: 10;"
              >
                <el-button @click.native="handleAddHZ" type="warning">新增校内合作单位</el-button>
              </div>
            </div>
          </template>
          <template v-if="step===5">
            <el-form ref="form4" :model="form4" label-width="190px" class="step-1 submit-el-form">
              <el-form-item label="计划培训总收入：" :rules="[{ required: true}]">
                <el-row>
                  <el-col :span="8">
                    <el-input-number
                      v-model="form4.sr_jhsr"
                      :controls="false"
                      :precision="2"
                      :min="0"
                      :disabled="welfareVal === 1"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="text-align-center">元</el-col>
                  <el-col :span="10">
                    <el-input v-model="form4.sr_jhsr_note" placeholder="请输入备注内容" class="fy-note"></el-input>
                  </el-col>
                  <el-col :span="4" class="text-align-center">
                    <span>{{ form4.sr_jhsr|statisticsRatio([],form4.sr_jhsr,1) }}</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="学校管理费：" :rules="[{ required: true}]">
                <el-row>
                  <el-col :span="8">
                    <el-input-number
                      v-model="form4.zc_xxglf"
                      :controls="false"
                      :precision="2"
                      :min="0"
                      :disabled="welfareVal === 1"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="text-align-center">元</el-col>
                  <el-col :span="10">
                    <el-input v-model="form4.zc_xxglf_note" placeholder="请输入备注内容" class="fy-note"></el-input>
                  </el-col>
                  <el-col :span="4" class="text-align-center">
                    <span>{{ form4.zc_xxglf|statisticsRatio([],form4.sr_jhsr,1) }}</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                :label="jxjy?'学院管理费用：':'学院管理费用（选填）：'"
                :rules="jxjy?[{ required: true}]:[]"
              >
                <el-row>
                  <el-col :span="8">
                    <el-input-number
                      v-model="form4.zc_xyglfy"
                      :controls="false"
                      :precision="2"
                      :min="0"
                      :disabled="welfareVal === 1"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="text-align-center">元</el-col>
                  <el-col :span="10">
                    <el-input v-model="form4.zc_xyglfy_note" placeholder="请输入备注内容" class="fy-note"></el-input>
                  </el-col>
                  <el-col :span="4" class="text-align-center">
                    <span>{{ form4.zc_xyglfy|statisticsRatio([],form4.sr_jhsr,1) }}</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-if="is_fzdwV" label="辅助单位分成：" :rules="[{ required: true}]">
                <el-row>
                  <el-col :span="8">
                    <el-input-number
                      v-model="form4.zc_fzdwfc"
                      :controls="false"
                      :precision="2"
                      :min="0"
                      :disabled="welfareVal === 1"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="text-align-center">元</el-col>
                  <el-col :span="10">
                    <el-input v-model="form4.zc_fzdwfc_note" placeholder="请输入备注内容" class="fy-note"></el-input>
                  </el-col>
                  <el-col :span="4" class="text-align-center">
                    <span>{{ form4.zc_fzdwfc|statisticsRatio([],form4.sr_jhsr,1) }}</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <template v-if="is_hzdwV.length&&form4.hz_note">
                <el-form-item
                  v-for="(item, index) in form4.hz_note"
                  :key="index"
                  :label="`校内合作单位（${index+1}）分成：`"
                  :rules="[{ required: true}]"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-input-number
                        v-model="item.zc_hzdwfc"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :disabled="welfareVal === 1"
                      ></el-input-number>
                    </el-col>
                    <el-col :span="2" class="text-align-center">元</el-col>
                    <el-col :span="10">
                      <el-input v-model="item.zc_hzdwfc_note" placeholder="请输入备注内容" class="fy-note"></el-input>
                    </el-col>
                    <el-col :span="4" class="text-align-center">
                      <span>{{ item.zc_hzdwfc | statisticsRatio([], form4.sr_jhsr,1) }}</span>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <el-form-item label="项目支出费用：" :rules="[{ required: true}]">
                <el-row>
                  <el-col :span="8">
                    <el-input-number
                      v-model="form4.zc_xmzcfy"
                      :controls="false"
                      :precision="2"
                      :disabled="false"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="text-align-center">元</el-col>
                  <el-col :span="10">
                    <el-input v-model="form4.zc_xmzcfy_note" placeholder="请输入备注内容" class="fy-note"></el-input>
                  </el-col>
                  <el-col :span="4" class="text-align-center">
                    <span>{{ form4.zc_xmzcfy|statisticsRatio([],form4.sr_jhsr,1) }}</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="项目支出预算明细：" :rules="[{ required: true}]">
                <div class="course-tip">
                  * 请完整填写预算明细，项目、费用总计为必填项。
                  <span
                    v-if="zc_xmzcfy > 0 && form4.zc_xmzcfy > 0 && (form4.zc_xmzcfy - zc_xmzcfy !== 0 )"
                    style="color: #E6A23C"
                  >【请核对 “项目支出费用” 与 “项目支出预算明细” 总额 ！】</span>
                </div>
                <el-table
                  :data="form4.ys_zc"
                  border
                  class="input-center"
                  :header-cell-style="{backgroundColor:'#fafafa'}"
                  style="width: 100%"
                >
                  <el-table-column align="center" type="index" label="序号" width="40"></el-table-column>
                  <el-table-column align="center" label="项目" width="170">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.xm" placeholder="请输入支出款项名称" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" sortable label="费用总计">
                    <template slot-scope="scope">
                      <el-input-number
                        v-model="scope.row.fyzj"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        size="mini"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="占总收入比（%）" width="90">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.fyzj | statisticsRatio([],form4.sr_jhsr,1) }}</template>
                  </el-table-column>
                  <el-table-column align="center" label="备注（选填）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.note" placeholder="请输入" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="60">
                    <template slot-scope="scope">
                      <div>
                        <el-button
                          v-if="scope.$index>0||form4.ys_zc.length!==1"
                          @click.native="handleDelete(4,scope.$index)"
                          type="text"
                          size="mini"
                        >删除</el-button>
                      </div>
                      <div>
                        <el-button
                          v-if="scope.$index+1===form4.ys_zc.length"
                          @click.native="handleAdd(4,scope.$index)"
                          type="text"
                          size="mini"
                        >新增</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="项目支出预算备注：">
                <el-input
                  v-model="form4.note"
                  type="textarea"
                  :rows="2"
                  maxlength="100"
                  show-word-limit
                  placeholder="项目支出预算备注"
                ></el-input>
              </el-form-item>
              <template v-if="is_fzdwV">
                <el-form-item label="辅助单位支出预算明细：" :rules="[{ required: true}]">
                  <div class="course-tip">* 请完整填写预算明细，项目、费用总计为必填项。</div>
                  <el-table
                    :data="form4.ys_fz"
                    border
                    class="input-center"
                    :header-cell-style="{backgroundColor:'#fafafa'}"
                    style="width: 100%"
                  >
                    <el-table-column align="center" type="index" label="序号" width="40"></el-table-column>
                    <el-table-column align="center" label="项目" width="170">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.xm" placeholder="请输入支出款项名称" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" sortable label="费用总计">
                      <template slot-scope="scope">
                        <el-input-number
                          v-model="scope.row.fyzj"
                          :controls="false"
                          :precision="2"
                          :min="0"
                          size="mini"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="占分成比（%）" width="90">
                      <template slot-scope="scope">
                        <template v-if="isYXB">
                          <template v-if="sfbzVal != 1">
                            <template v-if="form0.zsrs*form0.sfbz_xy*(form3.yf_fcbl/100)">
                              {{ scope.row.fyzj | statisticsRatio([],(form0.zsrs*form0.sfbz_xy*(form3.yf_fcbl/100)),1) }}
                            </template>
                            <template v-else>0%</template>
                          </template>
                          <template v-else>
                            {{ scope.row.fyzj | statisticsRatio([],form4.zc_fzdwfc,1) }}
                          </template>
                        </template>
                        <template v-else>
                          {{ scope.row.fyzj | statisticsRatio([],form4.zc_fzdwfc,1) }}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="备注（选填）">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.note" placeholder="请输入" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="60">
                      <template slot-scope="scope">
                        <div>
                          <el-button
                            v-if="scope.$index>0||form4.ys_fz.length!==1"
                            @click.native="handleDelete(5,scope.$index)"
                            type="text"
                            size="mini"
                          >删除</el-button>
                        </div>
                        <div>
                          <el-button
                            v-if="scope.$index+1===form4.ys_fz.length"
                            @click.native="handleAdd(5,scope.$index)"
                            type="text"
                            size="mini"
                          >新增</el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="辅助单位支出预算备注：">
                  <el-input
                    v-model="form4.fz_note"
                    type="textarea"
                    :rows="2"
                    maxlength="100"
                    show-word-limit
                    placeholder="辅助单位支出预算备注"
                  ></el-input>
                </el-form-item>
              </template>
              <template v-if="is_hzdwV.length&&form4.ys_hz">
                <el-form-item
                  v-for="(item, index) in form4.ys_hz"
                  :key="`${index}-ys_hz`"
                  :label="`合作单位（${index+1}）支出预算明细：`"
                  :rules="[{ required: true}]"
                >
                  <div class="course-tip">* 请完整填写预算明细，项目、费用总计为必填项。</div>
                  <el-table
                    :data="item.note"
                    border
                    class="input-center"
                    :header-cell-style="{backgroundColor:'#fafafa'}"
                    style="width: 100%"
                  >
                    <el-table-column align="center" type="index" label="序号" width="40"></el-table-column>
                    <el-table-column align="center" label="项目" width="170">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.xm" placeholder="请输入支出款项名称" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" sortable label="费用总计">
                      <template slot-scope="scope">
                        <el-input-number
                          v-model="scope.row.fyzj"
                          :controls="false"
                          :precision="2"
                          :min="0"
                          size="mini"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="占分成比（%）" width="90">
                      <template slot-scope="scope">
                        <span
                          v-if="form4.hz_note && form4.hz_note[index]"
                        >{{ scope.row.fyzj | statisticsRatio([],form4.hz_note[index].zc_hzdwfc,1) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="备注（选填）">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.note" placeholder="请输入" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="60">
                      <template slot-scope="scope">
                        <div>
                          <el-button
                            v-if="scope.$index>0||item.note.length!==1"
                            @click.native="handleDelete(6,scope.$index, 0, index)"
                            type="text"
                            size="mini"
                          >删除</el-button>
                        </div>
                        <div>
                          <el-button
                            v-if="scope.$index+1===item.note.length"
                            @click.native="handleAdd(6,scope.$index, 0, index)"
                            type="text"
                            size="mini"
                          >新增</el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </template>
              <el-form-item class="text-align-center">
              <el-button v-if="userInfo.role != 1 && !is_modify" @click.native="handleForm00(4)" type="success" plain>保 存</el-button>
                <el-button @click.native="handleStep4" type="success">上一步</el-button>
                <el-button @click.native="handleForm4" type="success">下一步</el-button>
                <el-button @click.native="handleBack" type>返 回</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="step===6">
            <div style="text-align: center">
              <p class="submit-over">
                <span class="icon">
                  <i class="el-icon-info"></i>
                </span>
                <span v-if="!is_handleSubmitMod" class="text">
                  <template v-if="is_ss">
                    <template
                      v-if="is_modify"
                    >{{ is_ss_auth?'请前往核对修改申请书，确认无误后盖章并提交项目信息！':'请自行联系学院管理员前往申请书盖章并提交项目信息！'}}</template>
                    <template v-else>
                      <template v-if="gl_type_5 && false">立项信息填写完成，是否提交审核？</template>
                      <template
                        v-else
                      >{{ is_ss_auth?'请前往核对申报书，确认无误后盖章并提交项目信息！':'请自行联系学院管理员前往申报书盖章并提交项目信息！'}}</template>
                    </template>
                  </template>
                  <template v-else>{{ is_modify ? '是否提交项目申请修改审核？':'立项信息填写完成，是否提交审核？'}}</template>
                </span>
                <span v-else class="text">已提交项目申请修改，请打印。</span>
              </p>
              <template v-if="!is_handleSubmitMod">
                <template v-if="is_modify">
                  <template v-if="is_ss">
                    <el-button v-if="is_ss_auth" @click.native="handleModDeclare" type="success">盖 章</el-button>
                    <el-button v-else @click.native="handlePreviewMod" type="info" plain>预 览</el-button>
                  </template>
                  <template v-else>
                    <el-button @click.native="handlePreviewMod" type="info" plain>预 览</el-button>
                    <el-button @click.native="handleSubmitMod" type="success">提 交</el-button>
                  </template>
                </template>
                <template v-else>
                  <template v-if="is_ss">
                    <template v-if="gl_type_5 && false">
                      <el-button v-if="!tjStatus" @click.native="handleSubmit" type="success">提 交</el-button>
                      <el-button
                        v-if="tjStatus"
                        @click.native="dialogFormVisible=true"
                        type="success"
                      >提 交</el-button>
                    </template>
                    <template v-else>
                      <el-button v-if="is_ss_auth" @click.native="handlePreview" type="success">盖 章</el-button>
                      <el-button v-else @click.native="handlePreview" type="info" plain>预 览</el-button>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="gl_type_5 && false"></template>
                    <template v-else>
                      <el-button @click.native="handlePreview" type="info" plain>预 览</el-button>
                    </template>
                    <el-button v-if="!tjStatus" @click.native="handleSubmit" type="success">提 交</el-button>
                    <el-button
                      v-if="tjStatus"
                      @click.native="dialogFormVisible=true"
                      type="success"
                    >提 交</el-button>
                  </template>
                </template>
                <el-button @click.native="handleBack" type>返 回</el-button>
              </template>
              <template v-else>
                <el-button
                  v-if="is_handleSubmitMod"
                  @click.native="handleModDeclare"
                  type="success"
                >打印申请</el-button>
                <el-button @click.native="handleBack" type>返 回</el-button>
              </template>
            </div>
          </template>
        </div>
      </div>
    </el-card>
    <el-backtop target=".app-home-main-row" :visibility-height="400"></el-backtop>
    <el-dialog
      title="项目提交"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template v-if="tjStatus">
        <el-form :model="subForm" v-cloak>
          <el-form-item label="历史修改记录：">
            <el-table :data="history" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <template v-if="scope.row.his_type===1">
                    <span class="danger">未通过原因：</span>
                    {{ scope.row.content }}
                  </template>
                  <template v-else>
                    <span class="success">修改回复：</span>
                    {{ scope.row.content }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="本次修改回复：" label-width="100" :rules="[{ required: true}]">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
              v-model.trim="subForm.update_note"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <p v-else class="submit-over">
        <span class="icon">
          <i class="el-icon-info"></i>
        </span>
        <span class="text">是否立即提交当前项目？</span>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="handleSubmit">确 定</el-button>
        <div class="dialog-footer-show" :class="{'dialog-footer-none':dialogFoot}"></div>
      </div>
    </el-dialog>
    <el-dialog
      title="重要提示"
      center
      :visible.sync="dialogVisibleImport"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="45%"
    >
      <div class="import-tip-box">
        <div>1. 上传课程请下载本网站提供的Excel标准格式，不要自行添加模板内的表格字段。必填字段不能输入空格。</div>
        <div>
          2. “
          <span>课程名称</span>”、“
          <span>教师姓名</span>”、“
          <span>职工号/身份证号</span>”、“
          <span>学时</span>” 为
          <span>必填</span>信息，其中
          <span>职工号为8位数字的职工号</span>、
          <span>身份证号为18位</span>。
        </div>
        <div>
          3. 若该课程无主讲教师时，姓名、职称请填写 “
          <span>无</span>” ，职工号请填写 “
          <span>00000000</span>” 。具体可参考下载模块填写课程信息。
        </div>
        <div>
          4.上传课程成功后请“
          <span>保存</span>”或“
          <span>提交</span>” 。
        </div>
      </div>
      <div style="padding: 20px 0 0;text-align: center" v-cloak>
        <el-button @click="dialogVisibleImport = false">取 消</el-button> &nbsp;
        <el-upload
          ref="upload"
          class="upload"
          :action="uploadExcelUrl"
          accept=".xls, .xlsx, .XLS, .XLSX"
          :show-file-list="false"
          :limit="1"
          :file-list="courseFileList"
          :on-success="handleSuccessCourse"
          :headers="headers"
          name="attachment"
          :auto-upload="true"
          :with-credentials="true"
        >
          <el-button :key="1" type="primary">
            导 入
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <span slot="tip" class="el-upload__tip">
            （
            <el-button @click.native="handleDownload" type="text">
              下载
              <i class="fa fa-download"></i>
            </el-button>标准格式后上传 ）
          </span>
        </el-upload>
      </div>
    </el-dialog>
    <el-dialog
      title="招生简章"
      :visible.sync="dialogVisible_zsjz"
      width="880px"
      center
      append-to-body
      :showClose="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <el-form>
          <el-form-item>
            <el-radio-group v-model="ue_radio" size="mini" style="margin: 0 auto">
              <template v-for="(item, key) in content">
                <el-radio-button v-if="item.show || true" :key="key" :label="key">
                  <template v-if="item.divide && createTime > zsjz_divide" >{{ content[key].else_label }}</template>
                  <template v-else>{{ content[key].label }}</template>
                </el-radio-button>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="ueditor-box">
              <UE :defaultMsg="ue_content" :config="UE_config.options_pro" ref="ue"></UE>
              <div v-if="ue_radio === 'ssfs'" class="ueditor-box-ssfs">
                <div class="zsjz-look-content">
                  <div v-for="(item, key) in content" :key="key">
                    <template v-if="key === 'ssfs'">
                      <div>
                        <template v-if="createTime > zsjz_divide">
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
                            <div v-if="(createTime > zsjz_divide_4) || isYXB" style="text-indent: 2em;">
                              <p>（一）个人账户缴费：点击“人大培训网”发布简章的缴费链接，通过学校电子收费系统缴费。</p>
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
                              <p>1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。</p>
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
                          <p>1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。</p>
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
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_zsjz = false">取 消</el-button>
        <el-button type="primary" @click="handleTrueZsjz">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible_zsjz_look"
      width="800px"
      center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 760px; margin: 0 auto">
        <div class="zsjz-look-head">
          <div v-if="!isYXB">
            <template v-if="createTime > zsjz_divide_4">
              {{ new Date(form0.px_start_time || createTime).getFullYear() }}年中国人民大学{{ form0.college }}
            </template>
            <template v-else>
              中国人民大学{{ form0.college }} {{ new Date(form0.px_start_time || createTime).getFullYear() }} 年
            </template>
          </div>
          <div>{{ form0.pro_name }}</div>
          <div>招生简章</div>
        </div>
        <div class="zsjz-look-content">
          <div v-for="(item, key) in content" :key="key">
            <template v-if="item.divide && createTime > zsjz_divide">
              <div style="font-weight: bold; line-height: 2em">{{ item.order }}、{{ item.else_label }}</div>
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
                <template v-if="createTime > zsjz_divide">
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
                    <div v-if="(createTime > zsjz_divide_4) || isYXB" style="text-indent: 2em;">
                      <p>（一）个人账户缴费：点击“人大培训网”发布简章的缴费链接，通过学校电子收费系统缴费。</p>
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
                      <p>1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。</p>
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
                  <p>1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。</p>
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
import { mapState, mapActions } from "vuex";
import { MATE } from '@/assets/js/config.special.js'
import UE from "@/components/compose/AppUE";
import UE_config from '@/assets/js/UE_config.js'

const urls = {
  yxb_course: '/yxb/projects/classMajorCourse'
}

export default {
  name: "app-project-add",
  data() {
    return {
      loading1: false,
      uid: 0,
      is_ss: false,
      is_ss_auth: false,  
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      step: 0,
      activeIndex: "0",
      key: 1,
      form0: {
        uid: 0,
        college_id: "",
        college: "",
        pro_name: "",
        gl_type: (sessionStorage.getItem('CK-T') || sessionStorage.getItem('CK')) === '2' ? 6 : 1, // 管理类型（研修班：默认值为6在职课程班）
        zs_type: 1,
        zsjz_wd: "",
        adm_reg_form: "",
        zsjz: "",
        adm_major: "",
        adm_course: "",
        adm_teaching: "",
        adm_study_time: "",
        adm_requirement: "",
        adm_attention: "",
        adm_charging: "",
        adm_certificate: "",
        zs_start_time: null, // 
        zs_end_time: null, // 
        px_start_time: null, //
        px_end_time: null, // 
        pxts: 0, // 
        pxzks: 0, //
        site: [],
        province_id: 0,
        province: "", // 
        city_id: 110000,
        city: "",
        pxdd: "", // 
        zsrs: 0, // 
        zsdx: "", // 
        skfs: 1,
        sfbz: 1,
        sfbz_dw: 0,
        sfbz_xy: 0,
        ks_charge: 1,
        specific_rate: '',
        pxfy_desc: "",
        is_yhzc: 0,
        yhzc_wjmc: "",
        yhzc_wj: "",
        yhzc_list: [
          {
            yhjg: null,
            yhtj: "",
            id: null
          }
        ],
        user: "", //联系人
        tel: "", //联系电话
        note: "", // 备注
        platform_site: "",
        platform_network: "",
        platform_introduced: "",
        preliminary: [],
        is_preliminary: 0,
        pre_code: "",
        welfare: 2
      }, 
      structuresList: [],
      options0: [
        {
          label: "北京",
          cities: []
        }
      ],  
      props0: {
        value: "id",
        children: "cities"
      },  
      uidIndex0: 0, // 
      placeholderSite0: "请选择",
      preliminary_search: "", // 
      preliminary_search_loading: false,
      preliminaryData: {}, // 
      form1: {
        pro_id: JSON.parse(sessionStorage.getItem("PRO"))
          ? JSON.parse(sessionStorage.getItem("PRO")).pro_id
          : 0, //项目id
        uid: 0,
        courses: {
          xiaonei: [
            {
              cou_name: "",
              teacher: "",
              is_inschool: 1, // 1校内  2校外
              job: "",
              idnumber: "", //主讲教师职工号/身份证号
              unit: "", // 单位
              school_hours: null // 学时
            }
          ],
          xiaowai: [
            {
              cou_name: "",
              teacher: "",
              is_inschool: 2, // 1校内  2校外
              job: "",
              idnumber: "", //主讲教师职工号/身份证号
              unit: "", // 单位
              school_hours: null // 学时
            }
          ]
        }
      }, // 
      dialogVisibleImport: false,
      courseFileList: [],
      form2: {
        pro_id: JSON.parse(sessionStorage.getItem("PRO"))
          ? JSON.parse(sessionStorage.getItem("PRO")).pro_id
          : 0, //项目id
        uid: 0,
        is_wtdw: 1,
        lists: [
          {
            id: null,
            jf_dwmc: "", // 委托单位名称
            jf_lxr: "", // 委托单位联系人
            jf_yb: "", // 委托单位邮编
            jf_lxdh: "", //委托单位联系人电话

            province_id: 0,
            province: "", // 省名称
            city_id: 110000, // 市id
            city: "", // 市名称
            site: [],        
            options2: [
              {
                label: "北京",
                cities: []
              }
            ], // 
            props2: {
              value: "id",
              children: "cities"
            }, // 
            uidIndex2: 0, // 
            placeholderSite2: "请选择",

            jf_dz: "", //委托单位地址
            jhjbqs: 1,
            pxdx: 1, //培训对象类型（1委托单位内部员工培训,2委托单位培训下属单位或会员单位学员,3委托单位派内部员工参加我校组织的社会散招类培训班）
            pxap: "", //培训内容和课程安排
            sfbz_dw: 0, //收费标准委托单位支付金额
            sfbz_dw_fq: 1, //收费标准委托单位支付金额
            sfbz_dw_zfsj: "", //委托单位分期支付时间
            sfbz_xy: 0, //学员人均支付标准
            specific_rate: '',
            wyjbl: 0,
            xy_num1: 0,
            xy_num2: 0, //甲方各执份数
            xy_num3: 0 //乙方各执份数
          }
        ]
      }, 
      activeNameWT: "1",
      wt_index: 0,
      sfbzVal: 1,
      ksCharge: 1, // 
      form3: {
        pro_id: JSON.parse(sessionStorage.getItem("PRO"))
          ? JSON.parse(sessionStorage.getItem("PRO")).pro_id
          : 0, //项目id
        uid: 0,
        is_fzdw: 1, 
        yf_dwmc: "", // 辅助单位名称
        zzwj: "营业执照注册号", // 资质文件名称
        zzwj_bm: "", // 资质文件编码
        zzwj_file: "", //
        frdb: "", //法人代表
        frdb_file: "", // 法人代表身份证
        dwxz: "", //单位性质
        yf_lxdh: "", //联系电话
        yf_dz: "", //单位地址
        yf_yb: "", //邮编
        yf_lxr: "", //项目负责人
        pxap: "", //培训内容和课程安排
        jf_fzgz: "", //申报项目负责的工作
        yf_fzgz: "", //辅助单位负责的工作
        yf_fyzc: "", //
        yf_fcbl: 0, //
        yf_fzjtfc: '', // 
        wg_bili: 0, // 
        yf_fqs: 0, //
        yf_fqs_time: "", //分成款付款时间
        yf_yhzh: "", //辅助单位收款账户信息:银行账号
        yf_khh: "", //辅助单位收款账户信息:开户行
        wyjbl: 0,
        xy_num1: 0,
        xy_num2: 0, //
        xy_num3: 0, //
        obligation: 1,
        obligation_type: 1,
        obligation_user: "",
        obligation_reason: ""
      }, // 
      is_fzdwV: false,
      form5: {
        pro_id: JSON.parse(sessionStorage.getItem("PRO"))
          ? JSON.parse(sessionStorage.getItem("PRO")).pro_id
          : 0, //项目id
        uid: 0,
        is_hzdw: 1, 
        lists: [
          {
            id: null,
            yf_dwmc: "", 
            yf_lxdh: "", //联系电话
            yf_dz: "", //单位地址
            yf_yb: "", //邮编
            yf_lxr: "", //项目负责人
            pxap: "", //培训内容和课程安排
            jf_fzgz: "", //申报项目负责的工作
            yf_fzgz: "", //辅助单位负责的工作
            yf_fyzc: "", //
            yf_fcbl: 0, //
            yf_fzjtfc: '',
            yf_fqs: 0, //
            yf_fqs_time: "", //分成款付款时间
            wyjbl: 0,
            xy_num1: 0,
            xy_num2: 0, //
            xy_num3: 0, //
            index_id: null
          }
        ]
      }, // 
      activeNameHZ: "1",
      is_hzdwV: [], 
      form4: {
        pro_id: 0, 
        uid: 0,
        sr_jhsr: 0, //
        sr_jhsr_note: "", //
        zc_xxglf: 0, //
        zc_xxglf_note: "", //
        zc_xyglfy: 0, //
        zc_xyglfy_note: "", //
        zc_fzdwfc: 0, //
        zc_fzdwfc_note: "", //
        zc_xmzcfy: 0, //
        zc_xmzcfy_note: "", //
        ys_zc: [
          {
            xm: "课酬", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          },
          {
            xm: "食宿费用", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          },
          {
            xm: "培训场地费用", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          },
          {
            xm: "证书费用", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          },
          {
            xm: "培训组织费用", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          }
        ], //
        note: "", //
        ys_fz: [
          {
            xm: "", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          },
          {
            xm: "", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          },
          {
            xm: "", //项目
            fyzj: 0, //费用总计
            note: "" //备注
          }
        ],
        fz_note: "",
        ys_hz: [
          {
            pro_id: null, //项目
            uid: null,
            note: [
              {
                xm: "", //项目
                fyzj: 0, //费用总计
                note: "" //备注
              },
              {
                xm: "", //项目
                fyzj: 0, //费用总计
                note: "" //备注
              },
              {
                xm: "", //项目
                fyzj: 0, //费用总计
                note: "" //备注
              }
            ],
            index_id: null
          }
        ],
        hz_note: [
          {
            zc_hzdwfc: 0, // 分成金额
            zc_hzdwfc_note: "", // 分成备注
            index_id: null
          }
        ]
      },
      zc_xmzcfy: 0, //  
      jxjy: false, //   
      listRatio: [],
      subForm: {
        id: 0,
        update_note: "" // 项目审核不通过，工作人员修改提交审核时需要填写修改说明
      },
      dialogFormVisible: false,
      dialogFoot: true,
      tjStatus: false,
      history: [],
      headers: {}, 
      fileList: [], 
      fileList1: [],
      uploadType1: true,
      fileListZzwj: [],
      fileListFrdb: [],
      fileListZzwj2: [],
      fileListFrdb2: [],
      is_modify: false,
      mod_params: {
        pro_id: 0,
        cont: null,
        mod_id: null
      },
      is_handleSubmitMod: false,
      ue_radio: "adm_major",
      ue_content: "",
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
          content: "",
          label: "收费方式",
          order: "八"
        },
        adm_certificate: { content: "", label: "证书", order: "九", show: true }
      },
      dialogVisible_zsjz: false,
      dialogVisible_zsjz_look: false,
      fileListB: [],
      skfs2: false,
      gl_type_5: false,
      modify_gl_type: null,
      createTime: new Date().getTime(),
      welfareVal: 2,
      UE_config,
      isYXB: false,
      readMajor: false,
      MajorCourse: [],
      prefix: '',
      major_name_fixed: '',
      Query: {}
    };
  },
  computed: {
    ...mapState([
      "uploadExcelUrl1",
      "uploadExcelUrl",
      "URL",
      "zsjz_divide",
      'userInfo',
      "zsjz_divide_4",
      'fz202101'
    ])
  },
  components: {
    UE
  },
  filters: {
    statisticsRatio(num, list, total, is_total) {
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
    },
    showCollege(collegeId, list) {
      let name = "XXX学院";
      list.map(item => {
        if (item.id == collegeId) {
          name = item.name;
        }
      });
      return name;
    }
  },
  methods: {
    ...mapActions([
      'axiosHttp',
      "getStructures",
      "getProvinces",

      "addProjectForm0",
      "addCoursesForm1",
      "addWtForm2",
      "addFzForm3",
      "addHzForm5",
      "addYsForm4",

      "getProjectsData",
      "getCoursesForm1",
      "getProjectYh",
      "getWtForm2",
      "getFzForm3",
      "getHzForm5",
      "getYsForm4",

      "updateProjectForm0",
      "updateCoursesForm1",
      "updateWtForm2",
      "updateFzForm3",
      "updateHzForm5",
      "updateYsForm4",

      "submitProject",
      "coursesImport",

      "getProModifyInfoYh",
      "getProModifyInfo0",
      "getProModifyInfo1",
      "getProModifyInfo2",
      "getProModifyInfo3",
      "getProModifyInfo5",
      "getProModifyInfo4",
      "addProModify0",
      "addProModify1",
      "addProModify2",
      "addProModify3",
      "addProModify5",
      "addProModify4",
      "submitProModify",

      "getProjectFields"
    ]),
    initData(pid = 0, form, add_wt) {
      if (add_wt) {
        this.getProvinces({
          data: {
            pid: pid
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list) {
              let list = Data.list.map(item => {
                item.label = item["shortname"];
                item.cities = [];
                return item;
              });
              this.form2.lists[this.form2.lists.length - 1].options2 = list;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        if (pid === 0) {
          if (!this.step) {
            this.getStructures({
              data: {
                level: 1
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.structuresList = data.data.data;
              }
            });
          }
          this.getProvinces({
            data: {
              pid: pid
            }
          }).then(data => {
            if (data.data.code === 200) {
              let list = data.data.data.list.map(item => {
                item.label = item["shortname"];
                item.cities = [];
                return item;
              });
              this.options0 = list;
              let L = this.form2.lists.map(item => {
                let obj = {};
                Object.assign(obj, item, {
                  options2: list
                });
                return obj;
              });
              this.$set(this.form2, "lists", L);
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        } else {
          this.getProvinces({
            data: {
              pid: pid
            }
          }).then(data => {
            if (data.data.code === 200) {
              let list = [];
              list = data.data.data.list.map(item => {
                item.label = item["shortname"];
                return item;
              });
              if (form === 0) {
                this.$set(this.options0, this.uidIndex0, Object.assign(this.options0[this.uidIndex0], { cities: list }));
              } else if (form === 2) {
                let ITEM = this.form2.lists[this.wt_index];
                if (ITEM) {
                  this.$set(ITEM.options2, ITEM.uidIndex2, Object.assign(ITEM.options2[ITEM.uidIndex2], {
                    cities: list
                  }));
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
    handleBack() {
      this.$router.go(-1);
    },
    handleForm00 (end) {
      this[`handleForm${end}`](false)
    },
    handleForm0(verify = true) {
      if (verify && !this.form0.college_id) {
        this.$message({
          type: "warning",
          message: "请选择主办学院！"
        });
        return false;
      }
      if (verify && !this.form0.pro_name) {
        this.$message({
          type: "warning",
          message: "请输入项目名称！"
        });
        return false;
      } else {
        if (verify && this.major_name_fixed && this.form0.pro_name.indexOf(this.major_name_fixed) === -1) {
          this.$message({
            type: "warning",
            message: "项目名称中必须包含专业名称！"
          });
          return false;
        }
      }
      if (this.form0.gl_type === 5) {}
      if (this.form0.is_preliminary) {
        if (verify && !this.form0.pre_code) {
          this.$message({
            type: "warning",
            message: "请输入前期预立项项目编号查询！"
          });
          return false;
        }
      }
      if (this.form0.zs_type === 1) {
        Object.assign(this.form0, {
          is_gwfb: 0,
          zsjz: "",
          zsjz_wd: "",
          adm_reg_form: "",
          zs_start_time: "",
          zs_end_time: "",
          adm_major: "",
          adm_course: "",
          adm_teaching: "",
          adm_study_time: "",
          adm_requirement: "",
          adm_attention: "",
          adm_charging: "",
          adm_certificate: ""
        });
      }
      if (this.form0.zs_type === 2) {
        // if(verify && !this.form0.zsjz){
        //     this.$message({
        //         type: 'warning',
        //         message: '请输入招生简章！'
        //     });
        //     return false;
        // }
        // if(verify && !this.form0.zsjz_wd){
        //     this.$message({
        //         type: 'warning',
        //         message: '请上传招生简章附件！'
        //     });
        //     return false;
        // }
        // if(verify && !this.form0.adm_reg_form){
        //     this.$message({
        //         type: 'warning',
        //         message: '请上传报名表！'
        //     });
        //     return false;
        // }

        for (let key in this.content) {
          if (verify && this.content[key].show && !this.form0[key]) {
            this.$message.warning({
              message: `${this.content[key].label}不能为空！`
            });
            return false;
          }
        }
        if (verify && (!this.form0.zs_start_time || !this.form0.zs_end_time)) {
          this.$message({
            type: "warning",
            message: "请选择招生起止时间！"
          });
          return false;
        }
        if (verify && (this.form0.zs_start_time - this.form0.zs_end_time > 0)) {
          this.$message({
            type: "warning",
            message: "招生开始时间开始不得早于结束时间！"
          });
          return false;
        }
      }
      if (verify && !this.form0.zsdx) {
        this.$message({
          type: "warning",
          message: "请输入招生对象！"
        });
        return false;
      }
      if (verify && (!this.form0.px_start_time || !this.form0.px_end_time)) {
        this.$message({
          type: "warning",
          message: "请选择培训时间！"
        });
        return false;
      }
      if (verify && (this.form0.px_start_time - this.form0.px_end_time > 0)) {
        this.$message({
          type: "warning",
          message: "培训开始时间开始不得早于结束时间！"
        });
        return false;
      }
      if (verify && !this.form0.pxts) {
        this.$message({
          type: "warning",
          message: "请输入培训天数！"
        });
        return false;
      }
      if (verify && !this.form0.pxzks) {
        this.$message({
          type: "warning",
          message: "请输入培训总课时！"
        });
        return false;
      }
      if (verify && !this.form0.zsrs) {
        this.$message({
          type: "warning",
          message: "请输入招生人数！"
        });
        return false;
      }
      if (this.form0.gl_type !== 4) {
        if (!this.isYXB && !this.form0.site.length) {
          if (verify && this.placeholderSite0.indexOf("/") === -1) {
            this.$message({
              type: "warning",
              message: "请选择培训地址(省/市)！"
            });
            return false;
          }
        }
        if (verify && !this.form0.pxdd) {
          this.$message({
            type: "warning",
            message: "请输入培训具体地址！"
          });
          return false;
        }
      }
      // if (verify && !this.form0.skfs.length) {
      //     this.$message({
      //         type: 'warning',
      //         message: '请输入选择授课方式！'
      //     });
      //     return false;
      // }
      // if (this.skfs2) {
      if (this.form0.skfs === 2 || this.form0.skfs === 3) {
        if (verify && !this.form0.platform_network) {
          this.$message({
            type: "warning",
            message: "请输入网络平台名称！"
          });
          return false;
        }
        if (verify && !this.form0.platform_site) {
          this.$message({
            type: "warning",
            message: "请输入网络平台网址！"
          });
          return false;
        }
        if (verify && !this.form0.platform_introduced) {
          this.$message({
            type: "warning",
            message: "请输入网络平台介绍！"
          });
          return false;
        }
      }
      if (this.form0.sfbz === 1) {
        if (verify && !(this.form0.sfbz_dw >= 0)) {
          this.$message({
            type: "warning",
            message: "请输入委托单位支付金额！"
          });
          return false;
        }
        this.$set(this.form0, "sfbz_xy", 0);
      }
      if (this.form0.sfbz === 2) {
        if (verify && !(this.form0.sfbz_xy >= 0)) {
          this.$message({
            type: "warning",
            message: "请输入学员自行支付金额！"
          });
          return false;
        }
        this.$set(this.form0, "sfbz_dw", 0);
      }
      if (this.form0.sfbz === 3) {
        if (verify && !(this.form0.sfbz_dw >= 0)) {
          this.$message({
            type: "warning",
            message: "请输入委托单位支付金额！"
          });
          return false;
        }
        if (verify && !(this.form0.sfbz_xy >= 0)) {
          this.$message({
            type: "warning",
            message: "请输入学员自行支付金额！"
          });
          return false;
        }
      }
      if (this.form0.ks_charge === 2 && !this.isYXB) {
        if (verify && !this.form0.specific_rate) {
          this.$message({
            type: "warning",
            message: "请输入具体收费标准！"
          });
          return false;
        }
        this.$set(this.form0, 'sfbz_dw', 0)
        this.$set(this.form0, 'sfbz_xy', 0)
      } else {
        this.$set(this.form0, 'specific_rate', '')
      }
      if (verify && !this.form0.pxfy_desc) {
        this.$message({
          type: "warning",
          message: "请输入培训费用包含的用途和项目！"
        });
        return false;
      } else if (verify && (this.form0.pxfy_desc.length > 600)) {
        this.$message({
          type: "warning",
          message: "培训费用包含的用途和项目内容不得超出600字！"
        });
        return false;
      }
      if (this.form0.is_yhzc) {
        if (verify && !this.form0.yhzc_wjmc) {
          this.$message({
            type: "warning",
            message: "请输入优惠政策文件名称！"
          });
          return false;
        }
        if (verify && !this.form0.yhzc_wj) {
          this.$message({
            type: "warning",
            message: "请上传优惠政策附件！"
          });
          return false;
        }
        for (let i = 0; i < this.form0.yhzc_list.length; i++) {
          for (let key in this.form0.yhzc_list[i]) {
            if (key === "yhjp" && !this.form0.yhzc_list[i][key]) {
              this.$message({
                type: "warning",
                message: "请输入具体优惠方案的优惠后价格！"
              });
              return false;
            }
            if (key === "yhtj" && !this.form0.yhzc_list[i][key]) {
              this.$message({
                type: "warning",
                message: "请输入具体优惠方案的优惠条件！"
              });
              return false;
            }
          }
        }
      } else {
        this.$set(this.form0, "yhzc_wj", this.$options.data().form0.yhzc_wj);
        this.$set(
          this.form0,
          "yhzc_wjmc",
          this.$options.data().form0.yhzc_wjmc
        );
        this.$set(this.form0, "yhzc_list", []);
      }
      if (verify && !this.form0.user) {
        this.$message({
          type: "warning",
          message: "请输入联系人姓名！"
        });
        return false;
      }
      if (verify && !this.form0.tel) {
        this.$message({
          type: "warning",
          message: "请输入联系方式！"
        });
        return false;
      }

      this.$set(this.form0, "uid", this.uid);
      for (let i = 0; i < this.structuresList.length; i++) {
        if (this.structuresList[i].id === this.form0.college_id) {
          this.form0.college = this.structuresList[i].name;
          break;
        }
      }
      if (this.form0.site.length) {
        this.$set(this.form0, "province_id", this.form0.site[0]);
        this.$set(this.form0, "city_id", this.form0.site[1]);
        let list2 = [];
        for (let i = 0; i < this.options0.length; i++) {
          if (this.options0[i].id === this.form0.province_id) {
            this.form0.province = this.options0[i].shortname;
            list2 = this.options0[i].cities;
            break;
          }
        }
        for (let i = 0; i < list2.length; i++) {
          if (list2[i].id === this.form0.city_id) {
            this.form0.city = list2[i].name;
            break;
          }
        }
      }

      const yh_list_ = this.form0.yhzc_list.map(item => {
        if (item.id) {
          return item;
        } else {
          return {
            yhjg: item.yhjg,
            yhtj: item.yhtj
          };
        }
      });
      let obj = {};
      Object.assign(obj, this.form0, {
        zs_start_time: this.form0.zs_start_time
          ? new Date(this.form0.zs_start_time).getTime() / 1000
          : 0,
        zs_end_time: this.form0.zs_end_time
          ? new Date(this.form0.zs_end_time).getTime() / 1000
          : 0,
        px_start_time: new Date(this.form0.px_start_time).getTime() / 1000,
        px_end_time: new Date(this.form0.px_end_time).getTime() / 1000,
        yhzc_list: yh_list_
      });
      delete obj.site;

      this.loading1 = true;
      if (this.is_modify) {
        for (let key in obj) {
          if (!this.$options.data().form0.hasOwnProperty(key)) {
            delete obj[key];
          }
        }
        Object.assign(obj, {
          pro_id: this.mod_params.pro_id,
          uid: this.uid,
          mod_id: this.mod_params.mod_id
        });
        if (true) {
          this.addProModify0({
            data: obj
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              this.$set(this.mod_params, "mod_id", Data.mod_id);
              this.$set(this.mod_params, "cont", 1);
              sessionStorage.setItem("proModInfo", JSON.stringify(this.mod_params));
              const PRO = {
                pro_id: this.mod_params.pro_id,
                sfbz: this.form0.sfbz,
                wtdw: this.form0.zs_type,
                fzdw: this.form0.is_fzdw,
                sfbz_xy: this.form0.sfbz_xy,
                sfbz_dw: this.form0.sfbz_dw,
                ks_charge: this.form0.ks_charge,
                specific_rate: this.form0.specific_rate,
                welfare: this.form0.welfare || 2
              };
              sessionStorage.setItem("PRO", JSON.stringify(PRO));
              if (obj.gl_type == 5) {
                this.gl_type_5 = true;
                sessionStorage.setItem("gl_type_5", "1");
              }
              let list1 = this.form2.lists.map(item=>{
                  let obj = Object.assign(item,{
                      // sfbz_dw:this.form0.sfbz_dw,
                      // sfbz_xy:this.form0.sfbz_xy,
                      specific_rate: this.form0.specific_rate || ''
                  }) ;
                  return obj;
              });
              Object.assign(this.form2,{
                  lists:list1,
              });
              this.step++;
              this.$message({
                type: "success",
                message: Data.info,
                onClose: () => {
                  this.loading1 = false;
                }
              });
              this.activeIndex = `${this.step}`
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
          this.sfbzVal = this.form0.sfbz;
          this.ksCharge = this.form0.ks_charge || 1
          this.welfareVal = this.form0.welfare;
        }
      } else {
        let key0 = true;
        if (sessionStorage.getItem("PRO")) {
          key0 = false;
        }
        if (this.key && key0) {
          this.addProjectForm0({
            data: Object.assign({
              way_update: verify ? 2 : 1
            }, obj)
          }).then(data => {
            if (data.data.code === 200) {
              const ID = data.data.data.pro_id;
              this.$set(this.form1, "pro_id", ID);
              this.$set(this.form2, "pro_id", ID);
              this.$set(this.form3, "pro_id", ID);
              this.$set(this.form5, "pro_id", ID);
              this.$set(this.form4, "pro_id", ID);
              this.sfbzVal = this.form0.sfbz;
              this.ksCharge = this.form0.ks_charge || 1
              this.welfareVal = this.form0.welfare;
              const PRO = {
                pro_id: ID,
                sfbz: this.form0.sfbz,
                wtdw: this.form0.zs_type,
                fzdw: this.form0.is_fzdw,
                hzxy: this.form0.is_hzdw,
                sfbz_dw: this.form0.sfbz_dw,
                sfbz_xy: this.form0.sfbz_xy,
                ks_charge: this.form0.ks_charge,
                specific_rate: this.form0.specific_rate
              };
              sessionStorage.setItem("PRO", JSON.stringify(PRO));
              if (obj.gl_type == 5) {
                this.gl_type_5 = true;
                sessionStorage.setItem("gl_type_5", "1");
              }
              let list1 = this.form2.lists.map(item=>{
                  let obj = Object.assign(item,{
                      specific_rate: this.form0.specific_rate || ''
                  }) ;
                  return obj;
              });
              Object.assign(this.form2,{
                  lists:list1,
              });
              this.step++;
              this.$message({
                type: "success",
                message: "新增项目基本信息成功",
                onClose: () => {
                  this.loading1 = false;
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
          this.sfbzVal = this.form0.sfbz;
          this.ksCharge = this.form0.ks_charge || 1
          this.welfareVal = this.form0.welfare;
        } else {
          for (let key in obj) {
            if (!this.$options.data().form0.hasOwnProperty(key)) {
              delete obj[key];
            }
          }
          if (this.loading1) {
            this.updateProjectForm0({
              data: Object.assign({
                way_update: verify ? 2 : 1
              }, obj),
              id: this.form1.pro_id
            }).then(data => {
              if (data.data.code === 200) {
                const PRO = {
                  pro_id: this.form1.pro_id,
                  sfbz: this.form0.sfbz,
                  wtdw: this.form0.zs_type,
                  fzdw: this.form0.is_fzdw,
                  hzxy: this.form0.is_hzdw,
                  sfbz_xy: this.form0.sfbz_xy,
                  sfbz_dw: this.form0.sfbz_dw,
                  ks_charge: this.form0.ks_charge,
                  specific_rate: this.form0.specific_rate,
                  welfare: this.form0.welfare
                };
                sessionStorage.setItem("PRO", JSON.stringify(PRO));
                if (obj.gl_type == 5) {
                  this.gl_type_5 = true;
                  sessionStorage.setItem("gl_type_5", "1");
                }
                let list1 = this.form2.lists.map(item => {
                  let obj = Object.assign(item, {
                    specific_rate: this.form0.specific_rate || ''
                  });
                  return obj;
                });
                Object.assign(this.form2, {
                  lists: list1
                });
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
                  }
                });
                this.activeIndex = this.step + "";
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error,
                  onClose: () => {
                    this.loading1 = false;
                  }
                });
              }
              this.sfbzVal = this.form0.sfbz;
              this.ksCharge = this.form0.ks_charge || 1
              this.welfareVal = this.form0.welfare;
            });
          }
        }
      }
    },
    handleForm1(verify = true) {
      if (this.isYXB && this.readMajor) {
        const MC0 = this.MajorCourse.filter(item => {
          return item.cou_name || item.teacher || item.job || item.idnumber || item.unit || item.school_hours
        })
        if (MC0.length) {
          const MC1 = MC0.every(item => {
            return item.idnumber.length === 8 || item.idnumber.length === 18
          })
          if (verify && !MC1) {
            this.$message.warning('请填写正确的职工号（8位）/ 身份证号（18位）！')
            return false
          }
          const xn = []
          const xw = []
          MC0.map(item => {
            if (item.idnumber.length === 8) {
              xn.push(Object.assign(item, {
                is_inschool: 1
              }))
            } else if (item.idnumber.length === 18) {
              xw.push(Object.assign(item, {
                is_inschool: 2
              }))
            }
          })
          this.$set(this.form1.courses, 'xiaonei', xn)
          this.$set(this.form1.courses, 'xiaowai', xw)
        } else {
          this.$message.warning('请添加课程信息！')
          return false
        }
      }
      
      let Courses = JSON.parse(JSON.stringify(this.form1.courses))

      let list1 = Courses.xiaonei
      let list2 = Courses.xiaowai

      if (list1.length === 1) {
        const one = list1[0];
        if (!one.cou_name && !one.teacher && !one.idnumber && !one.school_hours) {
          delete Courses.xiaonei;
        }
      }
      if (Courses.xiaonei) {
        let newList = Courses.xiaonei.filter(item => {
          return item.cou_name || item.teacher || item.job || item.idnumber || item.unit || item.school_hours
        })
        Object.assign(Courses, {
          xiaonei: newList
        })
        let is_idnumber1 = Courses.xiaonei.some(item => {
          let str = item.idnumber + ""
          return str.trim().length !== 8
        });
        if (is_idnumber1) {
          this.$message({
            type: "warning",
            message: "请输入正确的职工号！"
          });
          return false;
        }
      }

      if (list2.length === 1) {
        const one = list2[0]
        if (!one.cou_name && !one.teacher && !one.idnumber && !one.school_hours) {
          delete Courses.xiaowai
        }
      }
      if (Courses.xiaowai) {
        let newList = Courses.xiaowai.filter(item => {
          return item.cou_name || item.teacher || item.job || item.idnumber || item.unit || item.school_hours
        })
        Object.assign(Courses, {
          xiaowai: newList
        })
        let is_idnumber2 = Courses.xiaowai.some(item => {
          let str = item.idnumber + ""
          return str.trim().length !== 18
        })
        if (is_idnumber2) {
          this.$message({
            type: "warning",
            message: "请输入正确的身份证号！"
          });
          return false;
        }
      }

      // if(!list1[last1].cou_name||!list1[last1].teacher||!list1[last1].idnumber||!list1[last1].school_hours){
      //     if(list1.length>1){
      //         this.$message({
      //             type:'warning',
      //             message:'请填写完整填写校内教师课程信息！'
      //         });
      //         return false;
      //     }else{
      //         delete Courses.xiaonei;
      //     }
      // }else if(list1[last1].cou_name&&list1[last1].teacher&&list1[last1].idnumber&&list1[last1].school_hours){
      //     if(isNaN(list1[last1].idnumber)||(list1[last1].idnumber+'').length!==8){
      //         this.$message({
      //             type:'warning',
      //             message:'请输入正确的职工号！'
      //         });
      //         return false;
      //     }
      //     if (isNaN(list1[last1].school_hours)) {
      //         this.$message({
      //             type: 'warning',
      //             message: '学时必须为数字值！',
      //             onClose: () => {
      //                 this.$set(this.form1.courses.xiaonei[last1], 'school_hours', null);
      //             }
      //         });
      //         return false;
      //     }
      // }
      //
      // if(!list2[last2].cou_name||!list2[last2].teacher||!list2[last2].idnumber||!list2[last2].school_hours){
      //     if(list2.length>1){
      //         this.$message({
      //             type:'warning',
      //             message:'请填写完整填写校内教师课程信息！'
      //         });
      //         return false;
      //     }else{
      //         delete Courses.xiaowai;
      //     }
      // }else if(list2[last2].cou_name&&list2[last2].teacher&&list2[last2].idnumber&&list2[last2].school_hours){
      //     if((list2[last2].idnumber+'').length===18){
      //         if(isNaN(list2[last2].idnumber.substring(0,17))){
      //             this.$message({
      //                 type:'warning',
      //                 message:'请输入正确的身份证号码！'
      //             });
      //             return false;
      //         }
      //     }else{  //||
      //         this.$message({
      //             type:'warning',
      //             message:'请输入正确的身份证号码！'
      //         });
      //         return false;
      //     }
      //     if (isNaN(list2[last2].school_hours)) {
      //         this.$message({
      //             type: 'warning',
      //             message: '学时必须为数字值！',
      //             onClose: () => {
      //                 this.$set(this.form1.courses.xiaowai[last2], 'school_hours', null);
      //             }
      //         });
      //         return false;
      //     }
      // }
      this.$set(this.form1, "uid", this.uid);
      if (Courses.xiaonei) {
        let xiaonei_trim = Courses.xiaonei.map(item => {
          for (let key in item) {
            if (typeof item[key] === "string") {
              Object.assign(item, {
                [key]: item[key].trim()
              });
            }
          }
          return item;
        });
        Object.assign(Courses, {
          xiaonei: xiaonei_trim
        });
      }
      if (Courses.xiaowai) {
        let xiaowai_trim = Courses.xiaowai.map(item => {
          for (let key in item) {
            if (typeof item[key] === "string") {
              Object.assign(item, {
                [key]: item[key].trim()
              });
            }
          }
          return item;
        });
        Object.assign(Courses, {
          xiaowai: xiaowai_trim
        });
      }

      this.loading1 = true;
      if (this.loading1) {
        if (this.is_modify) {
          const Obj = {
            uid: this.form1.uid,
            pro_id: this.mod_params.pro_id,
            courses: Courses,
            mod_id: this.mod_params.mod_id
          };
          if (true) {
            this.addProModify1({
              data: Obj
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data.info,
                  onClose: () => {
                    this.loading1 = false;
                  }
                });
                this.activeIndex = this.step + "";
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
        } else {
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {
            this.addCoursesForm1({
              data: {
                uid: this.form1.uid,
                pro_id: this.form1.pro_id,
                courses: Courses,
                way_update: verify ? 2 : 1
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
            for (let i = 0; i < list1.length; i++) {
              let item = list1[i];
              delete item.uid;
              delete item.pro_id;
            }
            for (let i = 0; i < list2.length; i++) {
              let item = list2[i];
              delete item.uid;
              delete item.pro_id;
            }

            if (this.loading1) {
              this.updateCoursesForm1({
                data: {
                  uid: this.form1.uid,
                  pro_id: this.form1.pro_id,
                  courses: Courses,
                  way_update: verify ? 2 : 1
                },
                id: this.form1.pro_id
              }).then(data => {
                if (data.data.code === 200) {
                  this.step++;
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.loading1 = false;
                    }
                  });
                  this.activeIndex = this.step + "";
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
        }
      }
    },
    handleForm2(verify = true) {
      if (this.form2.is_wtdw) {
        let lists0 = JSON.parse(JSON.stringify(this.form2.lists));
        let list0_1 = lists0.map(item => {
          const obj = {};
          Object.assign(obj, item, {
            province_id: item.site[0] || item.province_id,
            city_id: item.site[1] || item.city_id
          });
          let list2 = [];
          for (let i = 0; i < item.options2.length; i++) {
            if (item.options2[i].id === obj.province_id) {
              Object.assign(obj, {
                province: item.options2[i].shortname
              });
              list2 = item.options2[i].cities;
              break;
            }
          }
          for (let i = 0; i < list2.length; i++) {
            if (list2[i].id === obj.city_id) {
              Object.assign(obj, {
                city: list2[i].name
              });
              break;
            }
          }
          return obj;
        });
        this.$set(this.form2, "uid", this.uid);
        for (let i = 0; i < lists0.length; i++) {
          let Item = lists0[i];
          if (verify && !Item.jf_dwmc) {
            this.$message({
              type: "warning",
              message: `（委托单位${i + 1}）：请输入委托单位名称！`
            });
            return false;
          }
          if (verify && !Item.jf_lxr) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输入委托单位联系人！`
            });
            return false;
          }
          if (verify && !Item.jf_lxdh) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输入委托单位联系人电话！`
            });
            return false;
          }
          if (verify && !Item.jf_dz) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输委托单位详细地址！`
            });
            return false;
          }
          if (verify && !Item.jf_yb) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输邮编！！`
            });
            return false;
          }
          if (verify && !Item.pxap) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输培训内容和课程安排！`
            });
            return false;
          }
          if (this.welfareVal == 2) {
            if (this.ksCharge !== 2) {
              if (this.sfbzVal === 1 || this.sfbzVal === 3) {
                if (verify && !(Item.sfbz_dw >= 0)) {
                  this.$message({
                    type: "warning",
                    message: ` （委托单位${i + 1}）：请输入委托单位支付金额！`
                  });
                  return false;
                }
                if (verify && !(Item.sfbz_dw_fq >= 0)) {
                  this.$message({
                    type: "warning",
                    message: ` （委托单位${i + 1}）：请输入委托单位支付分期数！`
                  });
                  return false;
                }
                if (verify && !Item.sfbz_dw_zfsj) {
                  this.$message({
                    type: "warning",
                    message: ` （委托单位${i + 1}）：请输委托单位分期支付时间！`
                  });
                  return false;
                }
              }
              if (this.sfbzVal === 2 || this.sfbzVal === 3) {
                if (verify && !(Item.sfbz_xy >= 0)) {
                  this.$message({
                    type: "warning",
                    message: ` （委托单位${i + 1}）：请输入学员自行按标准支付！`
                  });
                  return false;
                }
              }
            }
            if (this.ksCharge === 2) {
              if (verify && !Item.specific_rate) {
                this.$message({
                  type: "warning",
                  message: ` （委托单位${i + 1}）：请输入具体收费标准！`
                });
                return false;
              }
            }
          }
          if (verify && !Item.wyjbl) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输入违约金比例！`
            });
            return false;
          }
          if (verify && !Item.xy_num1) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输入协议总份数！`
            });
            return false;
          }
          if (verify && !Item.xy_num2) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输入甲方执协议份数！`
            });
            return false;
          }
          if (verify && !Item.xy_num3) {
            this.$message({
              type: "warning",
              message: ` （委托单位${i + 1}）：请输入乙方执协议份数！`
            });
            return false;
          }
        }
        let pro_zf = JSON.parse(sessionStorage.getItem("PRO"));
        let sfbz_dws = 0;
        let sfbz_xys = 0;
        let sfbz_dw_xy = list0_1.map(item => {
          return {
            sfbz_dw: item.sfbz_dw,
            sfbz_xy: item.sfbz_xy
          };
        });
        sfbz_dw_xy.forEach(item => {
          sfbz_dws += Number(item.sfbz_dw);
          sfbz_xys += Number(item.sfbz_xy);
        });
        if (verify && sfbz_dws != pro_zf.sfbz_dw && (pro_zf.sfbz === 1 || pro_zf.sfbz === 3)) {
          this.$message({
            type: "warning",
            message: "请核对委托单位支付金额！"
          });
          return false;
        }

        let lists = list0_1.map(item => {
          let newItem = {};
          for (let key in item) {
            if (this.$options.data().form2.lists[0].hasOwnProperty(key)) {
              Object.assign(newItem, {
                [key]: item[key]
              });
            }
          }
          delete newItem.site;
          delete newItem.options2;
          delete newItem.props2;
          delete newItem.uidIndex2;
          delete newItem.placeholderSite2;
          return newItem;
        });
        const Params = Object.assign({}, {
            pro_id: this.form2.pro_id,
            uid: this.form2.uid,
            is_wtdw: this.form2.is_wtdw,
            lists: lists
          });
        this.loading1 = true;
        if (this.is_modify) {
          Object.assign(Params, {
            mod_id: this.mod_params.mod_id,
            pro_id: this.mod_params.pro_id
          });
          if (this.loading1) {
            this.addProModify2({
              data: Params
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data.info,
                  onClose: () => {
                    this.loading1 = false;
                  }
                });
                this.activeIndex = this.step + "";
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
        } else {
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {
            this.addWtForm2({
              data: Object.assign({
                way_update: verify ? 2 : 1
              }, Params)
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
            this.updateWtForm2({
              id: Params.pro_id,
              data: Object.assign({
                way_update: verify ? 2 : 1
              }, Params)
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
                  }
                });
                this.activeIndex = this.step + "";
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
      } else {
        this.loading1 = true;
        if (this.is_modify) {
          this.addProModify2({
            data: {
              mod_id: this.mod_params.mod_id,
              pro_id: this.mod_params.pro_id,
              uid: this.uid,
              is_wtdw: 0,
              lists: []
            }
          }).then(data => {
            if (data.data.code === 200) {
              this.step++;
              this.$message({
                type: "success",
                message: data.data.data.info,
                onClose: () => {
                  this.loading1 = false;
                }
              });
              this.activeIndex = this.step + "";
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
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {
            this.addWtForm2({
              data: {
                pro_id: this.form2.pro_id,
                uid: this.uid,
                is_wtdw: 0
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
            this.updateWtForm2({
              id: this.form2.pro_id,
              data: {
                pro_id: this.form2.pro_id,
                uid: this.form2.uid,
                is_wtdw: 0,
                lists: []
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
                  }
                });
                this.activeIndex = this.step + "";
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
      }
    },
    handleForm3(verify = true) {
      if (this.form3.is_fzdw) {
        if (verify && !this.form3.yf_dwmc) {
          this.$message({
            type: "warning",
            message: "请输入辅助单位名称！"
          });
          return false;
        }
        if (verify && !this.form3.zzwj) {
          this.$message({
            type: "warning",
            message: "请选择相关资质文件！"
          });
          return false;
        }
        if (verify && !this.form3.zzwj_bm) {
          this.$message({
            type: "warning",
            message: "请输入相关资质文件编码！"
          });
          return false;
        }
        if (verify && !this.form3.frdb) {
          this.$message({
            type: "warning",
            message: "请输入法人代表！"
          });
          return false;
        }
        if (verify && !this.form3.dwxz) {
          this.$message({
            type: "warning",
            message: "请输入单位性质！"
          });
          return false;
        }
        if (verify && !this.form3.yf_lxdh) {
          this.$message({
            type: "warning",
            message: "请输入联系电话！"
          });
          return false;
        }
        if (verify && !this.form3.yf_dz) {
          this.$message({
            type: "warning",
            message: "请输入单位地址！"
          });
          return false;
        }
        if (verify && !this.form3.yf_yb) {
          this.$message({
            type: "warning",
            message: "请输入邮编！"
          });
          return false;
        }
        if (verify && !this.form3.yf_lxr) {
          this.$message({
            type: "warning",
            message: "请输入项目负责人！"
          });
          return false;
        }
        if (verify && !this.form3.pxap) {
          this.$message({
            type: "warning",
            message: "请输入培训内容和课程安排！"
          });
          return false;
        }
        if (verify && !this.form3.jf_fzgz) {
          this.$message({
            type: "warning",
            message: "申报项目单位负责的工作！"
          });
          return false;
        }
        if (verify && !this.form3.yf_fzgz) {
          this.$message({
            type: "warning",
            message: "请输入辅助单位负责的工作！"
          });
          return false;
        }
        if (verify && !this.form3.yf_fyzc) {
          this.$message({
            type: "warning",
            message: "请输入辅助单位负责的费用支出！"
          });
          return false;
        }
        if (verify && !this.form3.yf_fcbl) {
          this.$message({
            type: "warning",
            message: this.isYXB ? '请输入辅助单位获得最高分成比例！' : "请输入辅助单位获得的总分成比例！"
          });
          return false;
        }
        if (verify && (this.isYXB || (this.createTime > this.fz202101)) && !this.form3.yf_fzjtfc) {
          this.$message({
            type: "warning",
            message: '请输入辅助单位具体分成情况！'
          });
          return false;
        }
        if (verify && !this.form3.yf_fqs) {
          this.$message({
            type: "warning",
            message: "请输入辅助单位分成款分期数！"
          });
          return false;
        }
        if (verify && !this.form3.yf_fqs_time) {
          this.$message({
            type: "warning",
            message: "请输入分成款付款时间！"
          });
          return false;
        } else if (verify && (this.form3.yf_fqs_time.length > 200)) {
          this.$message({
            type: "warning",
            message: "分成款付款时间说明不得超出200字！"
          });
          return false;
        }
        if (verify && !this.form3.yf_yhzh) {
          this.$message({
            type: "warning",
            message: "请输入收款银行账号！"
          });
          return false;
        }
        if (verify && !this.form3.yf_khh) {
          this.$message({
            type: "warning",
            message: "请输入开户行！"
          });
          return false;
        }
        if (verify && !this.form3.wyjbl) {
          this.$message({
            type: "warning",
            message: "请输入违约金比例！"
          });
          return false;
        }
        if (verify && !this.form3.xy_num1) {
          this.$message({
            type: "warning",
            message: "请输入协议总份数！"
          });
          return false;
        }
        if (verify && !this.form3.xy_num2) {
          this.$message({
            type: "warning",
            message: "请输入甲方执份数！"
          });
          return false;
        }
        if (verify && !this.form3.xy_num3) {
          this.$message({
            type: "warning",
            message: "请输入乙方执份数！"
          });
          return false;
        }
        if (this.form3.obligation === 1) {
          this.$set(this.form3, "obligation_type", 1);
          this.$set(this.form3, "obligation_user", "");
          this.$set(this.form3, "obligation_reason", "");
        } else if (this.form3.obligation === 2) {
          if (this.form3.obligation_type === 1) {
            if (verify && !this.form3.obligation_reason) {
              this.$message({
                type: "warning",
                message: "请输入无监督方的理由！"
              });
              return false;
            }
            this.$set(this.form3, "obligation_user", "");
          } else {
            if (verify && !this.form3.obligation_user) {
              this.$message({
                type: "warning",
                message: "请输入谈判监督人！"
              });
              return false;
            }
            this.$set(this.form3, "obligation_reason", "");
          }
        }
        this.$set(this.form3, "uid", this.uid);
        this.loading1 = true;
        if (this.is_modify) {
          const val = {};
          Object.assign(val, this.form3);
          delete val.id;
          for (let key in val) {
            if (!this.$options.data().form3.hasOwnProperty(key)) {
              delete val[key];
            }
          }
          Object.assign(val, {
            fz_id: this.form3.id,
            mod_id: this.mod_params.mod_id,
            pro_id: this.mod_params.pro_id
          });
          if (true) {
            this.addProModify3({
              data: val
            }).then(data => {
              if (data.data.code === 200) {
                this.is_fzdwV = true;
                sessionStorage.setItem("is_fz", 1);
                this.step++;
                this.activeIndex = this.step + "";
                this.$message({
                  type: "success",
                  message: data.data.data.info,
                  onClose: () => {
                    this.loading1 = false;
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
        } else {
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {
            this.addFzForm3({
              data: Object.assign({
                way_update: verify ? 2 : 1
              }, this.form3)
            }).then(data => {
              if (data.data.code === 200) {
                this.is_fzdwV = true;
                sessionStorage.setItem("is_fz", 1);
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
            let val = {};
            Object.assign(val, this.form3);
            delete val.id;
            for (let key in val) {
              if (!this.$options.data().form3.hasOwnProperty(key)) {
                delete val[key];
              }
            }
            Object.assign(val, {
              fz_id: this.form3.id
            });
            if (this.loading1) {
              this.updateFzForm3({
                id: this.form3.pro_id,
                data: Object.assign({
                  way_update: verify ? 2 : 1
                }, val)
              }).then(data => {
                if (data.data.code === 200) {
                  this.is_fzdwV = true;
                  sessionStorage.setItem("is_fz", 1);
                  this.step++;
                  this.activeIndex = this.step + "";
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.loading1 = false;
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
        }
      } else {
        this.loading1 = true;
        if (this.is_modify) {
          const val = {};
          Object.assign(val, this.form3);
          delete val.id;
          for (let key in val) {
            if (!this.$options.data().form3.hasOwnProperty(key)) {
              delete val[key];
            }
          }
          Object.assign(val, {
            fz_id: this.form3.id
          });
          if (true) {
            this.addProModify3({
              data: {
                pro_id: this.mod_params.pro_id,
                uid: this.uid,
                is_fzdw: 0,
                mod_id: this.mod_params.mod_id
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.is_fzdwV = false;
                sessionStorage.setItem("is_fz", 0);
                this.step++;
                this.activeIndex = this.step + "";
                this.$message({
                  type: "success",
                  message: data.data.data.info,
                  onClose: () => {
                    this.loading1 = false;
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
        } else {
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {
            this.addFzForm3({
              data: {
                pro_id: this.form3.pro_id,
                uid: this.uid,
                is_fzdw: 0
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.is_fzdwV = false;
                sessionStorage.setItem("is_fz", 0);
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
            let val = {};
            Object.assign(val, this.form3);
            delete val.id;
            for (let key in val) {
              if (!this.$options.data().form3.hasOwnProperty(key)) {
                delete val[key];
              }
            }
            Object.assign(val, {
              fz_id: this.form3.id
            });
            if (this.loading1) {
              this.updateFzForm3({
                id: this.form3.pro_id,
                data: {
                  pro_id: val.pro_id,
                  uid: this.uid,
                  is_fzdw: 0
                }
              }).then(data => {
                if (data.data.code === 200) {
                  this.is_fzdwV = false;
                  sessionStorage.setItem("is_fz", 0);
                  this.step++;
                  this.activeIndex = this.step + "";
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.loading1 = false;
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
        }
      }
    },
    handleForm5(verify = true) {
      if (this.form5.is_hzdw) {
        let lists0 = JSON.parse(JSON.stringify(this.form5.lists));
        this.$set(this.form5, "uid", this.uid);
        for (let i = 0; i < lists0.length; i++) {
          let Item = lists0[i];
          if (verify && !Item.yf_dwmc) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入合作单位名称！`
            });
            return false;
          }
          if (verify && !Item.yf_lxdh) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入联系电话！`
            });
            return false;
          }
          if (verify && !Item.yf_dz) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入地址！`
            });
            return false;
          }
          if (verify && !Item.yf_lxr) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入项目负责人！`
            });
            return false;
          }
          if (verify && !Item.pxap) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入培训内容和课程安排！`
            });
            return false;
          }
          if (verify && !Item.jf_fzgz) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：申报项目单位负责的工作！`
            });
            return false;
          }
          if (verify && !Item.yf_fzgz) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入合作单位负责的工作！`
            });
            return false;
          }
          if (verify && !Item.yf_fyzc) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入合作单位负责的费用支出！`
            });
            return false;
          }
          if (verify && !Item.yf_fcbl) {
            this.$message({
              type: "warning",
              message: this.isYXB ? `合作单位（${i + 1}）：请输入合作单位获得最高分成比例！` : `合作单位（${i + 1}）：请输入合作单位获得的总分成比例！`
            });
            return false;
          }
          if (verify && this.isYXB && !Item.yf_fzjtfc) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入合作单位具体分成情况！`
            });
            return false;
          }
          if (verify && !Item.yf_fqs) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入合作单位分成款分期数！`
            });
            return false;
          }
          if (verify && !Item.yf_fqs_time) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入分成款付款时间！`
            });
            return false;
          }
          if (verify && !Item.wyjbl) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入违约金比例！`
            });
            return false;
          }
          if (verify && !Item.xy_num1) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入协议总份数！`
            });
            return false;
          }
          if (verify && !Item.xy_num2) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入甲方执份数！`
            });
            return false;
          }
          if (verify && !Item.xy_num3) {
            this.$message({
              type: "warning",
              message: `合作单位（${i + 1}）：请输入乙方执份数！`
            });
            return false;
          }
        }
        let lists = lists0.map((item, ind) => {
          let newItem = {};
          for (let key in item) {
            if (this.$options.data().form5.lists[0].hasOwnProperty(key)) {
              Object.assign(newItem, {
                [key]: item[key]
              });
            }
          }
          Object.assign(newItem, {
            index_id: item.index_id || `${this.createTime}${ind}` - 0
          });
          return newItem;
        });
        this.loading1 = true;
        if (this.is_modify) {
          const Obj = {
            mod_id: this.mod_params.mod_id,
            pro_id: this.mod_params.pro_id,
            uid: this.form5.uid,
            is_hzdw: 1,
            lists: lists
          };
          if (this.loading1) {
            this.addProModify5({
              data: Obj
            }).then(data => {
              if (data.data.code === 200) {
                this.is_hzdwV = lists.map(item => {
                  return item.index_id;
                });
                sessionStorage.setItem("is_hz", JSON.stringify(this.is_hzdwV));
                this.hzGetCwInfo(this.mod_params.pro_id, 2, this.is_hzdwV);
                this.step++;
                this.activeIndex = this.step + "";
                this.$message({
                  type: "success",
                  message: data.data.data.info,
                  onClose: () => {
                    this.loading1 = false;
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
        } else {
          const Obj = {
            pro_id: this.form5.pro_id,
            uid: this.form5.uid,
            is_hzdw: 1,
            lists: lists
          };
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {} else {
            if (this.loading1) {
              this.updateHzForm5({
                id: this.form5.pro_id,
                data: Object.assign({
                  way_update: verify ? 2 : 1
                }, Obj)
              }).then(data => {
                if (data.data.code === 200) {
                  this.is_hzdwV = lists.map(item => {
                    return item.index_id;
                  });
                  sessionStorage.setItem(
                    "is_hz",
                    JSON.stringify(this.is_hzdwV)
                  );
                  this.hzGetCwInfo(this.form5.pro_id, 1, this.is_hzdwV);
                  this.step++;
                  this.activeIndex = this.step + "";
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.loading1 = false;
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
        }
      } else {
        this.loading1 = true;
        if (this.is_modify) {
          if (true) {
            this.addProModify5({
              data: {
                mod_id: this.mod_params.mod_id,
                pro_id: this.mod_params.pro_id,
                uid: this.uid,
                is_hzdw: 0,
                lists: []
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.is_hzdwV = [];
                sessionStorage.setItem("is_hz", JSON.stringify(this.is_hzdwV));
                this.step++;
                this.activeIndex = this.step + "";
                this.$message({
                  type: "success",
                  message: data.data.data.info,
                  onClose: () => {
                    this.loading1 = false;
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
        } else {
          let key0 = true;
          if (sessionStorage.getItem("PRO")) {
            key0 = false;
          }
          if (this.key && key0) {
            this.addHzForm5({
              data: {
                pro_id: this.form5.pro_id,
                uid: this.uid,
                is_hzdw: 0,
                lists: []
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.is_hzdwV = [];
                sessionStorage.setItem("is_hz", JSON.stringify(this.is_hzdwV));
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
            if (this.loading1) {
              this.updateHzForm5({
                id: this.form5.pro_id,
                data: {
                  pro_id: this.form5.pro_id,
                  uid: this.uid,
                  is_hzdw: 0,
                  lists: []
                }
              }).then(data => {
                if (data.data.code === 200) {
                  this.is_hzdwV = [];
                  sessionStorage.setItem(
                    "is_hz",
                    JSON.stringify(this.is_hzdwV)
                  );
                  this.step++;
                  this.activeIndex = this.step + "";
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.loading1 = false;
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
        }
      }
    },
    handleStep2() {
      this.step = 2;
      if (this.is_modify) {
        this.getProModifyInfo2({
          data: this.mod_params
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.$set(this.form2, "lists", Data.list);
              let list = this.form2.lists.map(item => {
                Object.assign(item, {
                  placeholderSite2: item.province + "/" + item.city,
                  site: [], 
                  options2: this.options0,
                  props2: {
                    value: "id",
                    children: "cities"
                  }, 
                  uidIndex2: 0
                });
                return item;
              });
              Object.assign(this.form2, {
                lists: list
              });
            } else {
              this.$set(this.form2, "is_wtdw", 0);
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        this.getWtForm2({
          data: {
            pro_id: this.form2.pro_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.$set(this.form2, "lists", Data.list);
              let list = this.form2.lists.map(item => {
                Object.assign(item, {
                  placeholderSite2: item.province + "/" + item.city,
                  site: [],
                  options2: this.options0,
                  props2: {
                    value: "id",
                    children: "cities"
                  },
                  uidIndex2: 0
                });
                return item;
              });
              Object.assign(this.form2, {
                lists: list
              });
              if (this.form0.welfare == 1) {
                this.welfareValSfbz();
              }
            } else {
              this.$set(this.form2, "is_wtdw", 0);
            }
          }
        });
      }
    },
    handleForm4(verify = true) {
      const obj = JSON.parse(JSON.stringify(this.form4));
      if (!obj.sr_jhsr && false) {
        this.$message({
          type: "warning",
          message: "请输入计划收入总培训费用！"
        });
        return false;
      }
      if (!obj.zc_xxglf && false) {
        this.$message({
          type: "warning",
          message: "请输入学校管理费用！"
        });
        return false;
      }
      if (this.jxjy && !obj.zc_xyglfy) {
        // this.$message({
        //     type: 'warning',
        //     message: '请输入学院管理费用！'
        // });
        // return false;
      }
      if (this.is_fzdwV && false) {
        if (!obj.zc_fzdwfc) {
          this.$message({
            type: "warning",
            message: "请输入辅助单位分成费用！"
          });
          return false;
        }
      }
      if (this.is_hzdwV.length) {
        if (obj.hz_note.length) {
          for (let i = 0; i < obj.hz_note.length; i++) {
            if (!obj.hz_note[i].zc_hzdwfc && false) {
              this.$message.warning(`请输入合作单位（${i + 1}）分成！`);
              return false;
            }
          }
          let hz_note = obj.hz_note.map((item, index) => {
            return Object.assign(item, {
              index_id: item.index_id || `${this.createTime}${index}` - 0
            });
          });
          this.$set(obj, "hz_note", hz_note);
        }
      }

      if (obj.ys_zc.length) {
        let list1 = obj.ys_zc.filter(item => {
          // return item.xm && item.fyzj;
          return item.xm;
        });
        if (!list1.length) {
          this.$message({
            type: "warning",
            message: "请添加项目支出预算明细！！"
          });
          return false;
        }
        this.$set(obj, "ys_zc", list1);

        let list = obj.ys_zc;
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
        // Object.assign(obj,{
        //     zc_xmzcfy:sum/m
        // });
        if (!sum / m && false) {
          this.$message({
            type: "warning",
            message: "请完善项目支出预算明细！！"
          });
          return false;
        }
      } else {
        // delete obj.ys_zc;
        this.$message({
          type: "warning",
          message: "请添加项目支出预算明细！！"
        });
        return false;
      }
      if (this.is_fzdwV) {
        if (obj.ys_fz.length) {
          let list2 = obj.ys_fz.filter(item => {
            // return item.xm && item.fyzj;
            return item.xm;
          });
          this.$set(obj, "ys_fz", list2);
        } else {
          delete obj.ys_fz;
        }
      } else {
        this.$set(obj, "zc_fzdwfc", "");
        this.$set(obj, "zc_fzdwfc_note", "");
        this.$set(obj, "fz_note", "");
        delete obj.ys_fz;
      }
      if (this.is_hzdwV.length) {
        if (obj.ys_hz.length) {
          let ys_hz = obj.ys_hz.map((item, index) => {
            let item_note = item.note.filter(v => {
              // return v.xm && v.fyzj
              return v.xm;
            });
            return Object.assign(item, {
              index_id: item.index_id || `${this.createTime}${index}` - 0,
              pro_id: obj.pro_id,
              uid: this.uid,
              note: item_note
            });
          });
          this.$set(obj, "ys_hz", ys_hz);
        }
        for (let i = 0; i < obj.ys_hz.length; i++) {
          let item = obj.ys_hz[i];
          if (item.note && !item.note.length && false) {
            this.$message.warning(`请完善合作单位（${i + 1}）支出预算！`);
            return false;
          }
        }
      } else {
        Object.assign(obj, {
          hz_note: [],
          ys_hz: []
        });
      }

      this.$set(obj, "uid", this.uid);
      this.loading1 = true;
      if (this.is_modify) {
        for (let key in obj) {
          if (!this.$options.data().form4.hasOwnProperty(key)) {
            delete obj[key];
          }
        }
        Object.assign(obj, {
          ys_id: this.form4.id,
          pro_id: this.mod_params.pro_id,
          mod_id: this.mod_params.mod_id,
          zc_fzdwfc: obj.zc_fzdwfc ? obj.zc_fzdwfc : "0.00"
        });
        if (true) {
          this.addProModify4({
            data: obj
          }).then(data => {
            if (data.data.code === 200) {
              this.step++;
              this.$message({
                type: "success",
                message: data.data.data.info,
                onClose: () => {
                  this.loading1 = false;
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
      } else {
        let key0 = true;
        if (sessionStorage.getItem("PRO")) {
          key0 = false;
        }
        if (this.key && key0) {
          this.addYsForm4({
            data: Object.assign({
              way_update: verify ? 2 : 1
            }, obj)
          }).then(data => {
            if (data.data.code === 200) {
              this.step++;
              this.$message({
                type: "success",
                message: data.data.data,
                onClose: () => {
                  this.loading1 = false;
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
          for (let key in obj) {
            if (!this.$options.data().form4.hasOwnProperty(key)) {
              delete obj[key];
            }
          }
          Object.assign(obj, {
            ys_id: this.form4.id
          });
          if (this.loading1) {
            this.updateYsForm4({
              id: obj.pro_id,
              data: Object.assign({
                way_update: verify ? 2 : 1
              }, obj)
            }).then(data => {
              if (data.data.code === 200) {
                this.step++;
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading1 = false;
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
      }
    },
    handleStep3() {
      this.step = 3;
      if (this.is_modify) {
      } else {
        this.getFzForm3({
          data: {
            pro_id: this.form3.pro_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const obj = Data.list[0];
              Object.assign(this.form3, obj, {
                obligation: obj.obligation - 0 || 1
              });
              this.is_fzdwV = true;
              sessionStorage.setItem("is_fz", 1);
              if (obj.zzwj_file) {
                this.fileListZzwj = [
                  {
                    name: "资质文件",
                    code: obj.zzwj_file
                  }
                ];
              }
              if (obj.frdb_file) {
                this.fileListFrdb = [
                  {
                    name: "法人代表身份证照片",
                    code: obj.frdb_file
                  }
                ];
              }
            } else {
              this.$set(this.form3, "is_fzdw", 0);
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
    handleStep4() {
      this.step = 4;
      if (this.is_modify) {
      } else {
        this.getHzForm5({
          data: {
            pro_id: this.form5.pro_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const obj = Data.list[0];
              Object.assign(this.form5, obj);
              this.is_hzdwV = Data.list.map(item => {
                return item.index_id;
              });
              sessionStorage.setItem("is_hz", JSON.stringify(this.is_hzdwV));
              if (obj.zzwj_file) {
                this.fileListZzwj2 = [
                  {
                    name: "资质文件",
                    code: obj.zzwj_file
                  }
                ];
              }
              if (obj.frdb_file) {
                this.fileListFrdb2 = [
                  {
                    name: "法人代表身份证照片",
                    code: obj.frdb_file
                  }
                ];
              }
            } else {
              this.$set(this.form5, "is_hzdw", 0);
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
    handleSuccessCourse(response, file, fileList) {
      if (response.code === 200) {
        this.coursesImport({
          data: {
            file_code: response.data.code
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            let xn = JSON.parse(JSON.stringify(Data["1"]));
            let xw = JSON.parse(JSON.stringify(Data["2"]));
            let MajorCourse_xn = []
            let MajorCourse_xw = []
            if (!xn.length) {
              xn = this.$options.data().form1.courses.xiaonei;
            } else {
              MajorCourse_xn = JSON.parse(JSON.stringify(Data["1"]))
            }
            if (!xw.length) {
              xw = this.$options.data().form1.courses.xiaowai;
            } else {
              MajorCourse_xw = JSON.parse(JSON.stringify(Data["2"]))
            }
            if (this.readMajor) {
              this.MajorCourse = ([].concat(MajorCourse_xn, MajorCourse_xw)).map(item => {
                return {
                  cou_name: item.cou_name|| '',
                  idnumber: item.idnumber|| '',
                  is_inschool: item.is_inschool|| null,
                  job: item.job|| '',
                  school_hours: item.school_hours|| null,
                  teacher: item.teacher|| '',
                  unit: item.unit|| ''
                }
              })
            } else {
              Object.assign(this.form1, {
                courses: {
                  xiaonei: xn,
                  xiaowai: xw
                }
              });
            }
            this.dialogVisibleImport = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleImport() {
      this.courseFileList = []
      this.dialogVisibleImport = true;
    },
    handleDownload() {
      window.open(this.URL + "/static/file/kecheng.xls");
    },
    handleSelect(key, keyPath) {
      this.step = Number(key);
    },
    handleSubmit() {
      let val = {};
      if (this.key) {
        this.$set(this.subForm, "id", this.form1.pro_id);
        this.$set(this.subForm, "update_note", "");
        Object.assign(val, this.submitForm, {
          id: JSON.parse(sessionStorage.getItem("PRO")).pro_id
        });
      } else {
        Object.assign(val, {
          id: this.subForm.id,
          update_note: this.subForm.update_note
        });
        if (this.tjStatus) {
          if (!this.subForm.update_note) {
            this.$message({
              type: "warning",
              message: "请添加本次修改回复！"
            });
            return false;
          }
          this.dialogFoot = false;
        }
      }
      this.loading1 = true;
      this.submitProject({
        data: val
      }).then(data => {
        if (data.data.code === 200) {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "项目已提交审核！",
            onClose: () => {
              this.loading1 = false;
              this.backList()
            }
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error,
            onClose: () => {
              this.loading1 = false;
              this.dialogFoot = true;
            }
          });
        }
      });
    },
    handleSubmitMod() {
      this.loading1 = true;
      if (this.loading1) {
        this.submitProModify({
          data: {
            pro_id: this.mod_params.pro_id,
            mod_id: this.mod_params.mod_id,
            need_sign: false
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogFormVisible = false;
            this.is_handleSubmitMod = true;
            this.$message({
              type: "success",
              message: "申请修改提交成功！",
              onClose: () => {
                this.loading1 = false;
                // this.$router.push('/home/project/index/list');
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
    },
    handleModDeclare() {
      const Pro = {
        mod_id: this.mod_params.mod_id
      };
      const PRO_ID = this.mod_params.pro_id;
      sessionStorage.setItem("Pro_declare_modify", JSON.stringify(Pro));
      sessionStorage.setItem("pro_declare", PRO_ID);
      this.$router.push({
        path: "/home/project/declare_modify/" + PRO_ID,
        query: {
          project: new Date().getTime()
        }
      });
    },
    handleAddWT() {
      this.form2.lists.push(this.$options.data().form2.lists[0]);
      this.activeNameWT = `${this.form2.lists.length}`;
      if (this.$route.path === "/home/project/add") {
        const pro = JSON.parse(sessionStorage.getItem("PRO"));
      } else {
        // let list = this.form2.lists.map(item=>{
        //     Object.assign(item,{
        //         sfbz_dw:this.form0.sfbz_dw,
        //         sfbz_xy:this.form0.sfbz_xy,
        //     });
        //     return item;
        // });
        // this.$set(this.form2, 'lists', list);
      }
      this.initData(0, 0, 1);
    },
    handleDeleteWT(index) {
      this.form2.lists.splice(index, 1);
    },
    handleAddHZ() {
      this.form5.lists.push(this.$options.data().form5.lists[0]);
      this.activeNameHZ = `${this.form5.lists.length}`;
    },
    handleDeleteHZ(index) {
      this.form5.lists.splice(index, 1);
    },
    handleItemChange0(val) {
      this.options0.forEach((item, index) => {
        if (item["id"] === val[0]) {
          this.uidIndex0 = index;
        }
      });
      this.initData(val[0], 0);
    },
    handleItemChange2(val, a) {
      this.form2.lists.forEach((item, index) => {
        if (!item.province_id && !item.city) {
          this.wt_index = index;
        }
      });
      if (this.form2.lists[this.wt_index]) {
        this.form2.lists[this.wt_index].options2.forEach((item, index) => {
          if (item["id"] === val[0]) {
            this.form2.lists[this.wt_index].uidIndex2 = index;
          }
        });
      }
      this.initData(val[0], 2);
    },
    handleAdd(step, index, course, hzInd) {
      if (step === 0) {
        this.form0.yhzc_list.push(this.$options.data().form0.yhzc_list[0]);
      } else if (step === 1) {
        if (course === 1) {
          let ITEM = this.form1.courses.xiaonei[index];
          if (
            ITEM.cou_name &&
            ITEM.teacher &&
            ITEM.idnumber &&
            ITEM.school_hours
          ) {
            if (isNaN(ITEM.school_hours)) {
              this.$message({
                type: "warning",
                message: "学时必须为数字值！",
                onClose: () => {
                  this.$set(
                    this.form1.courses.xiaonei[index],
                    "school_hours",
                    null
                  );
                }
              });
              return false;
            }
            if (isNaN(ITEM.idnumber) || (ITEM.idnumber + "").length !== 8) {
              this.$message({
                type: "warning",
                message: "请输入正确的职工号！"
              });
              return false;
            }
            this.form1.courses.xiaonei.push(
              this.$options.data().form1.courses.xiaonei[0]
            );
          } else {
            this.$message({
              type: "warning",
              message: "请填写完整的课程信息！"
            });
            return false;
          }
        } else if (course === 2) {
          let ITEM = this.form1.courses.xiaowai[index];
          if (
            ITEM.cou_name &&
            ITEM.teacher &&
            ITEM.idnumber &&
            ITEM.school_hours
          ) {
            if (isNaN(ITEM.school_hours)) {
              this.$message({
                type: "warning",
                message: "学时必须为数字值！",
                onClose: () => {
                  this.$set(
                    this.form1.courses.xiaowai[index],
                    "school_hours",
                    null
                  );
                }
              });
              return false;
            }
            if ((ITEM.idnumber + "").length === 18) {
              if (isNaN(ITEM.idnumber.substring(0, 17))) {
                this.$message({
                  type: "warning",
                  message: "请输入正确的身份证号码！"
                });
                return false;
              }
            } else {
              this.$message({
                type: "warning",
                message: "请输入正确的身份证号码！"
              });
              return false;
            }
            this.form1.courses.xiaowai.push(
              this.$options.data().form1.courses.xiaowai[0]
            );
          } else {
            this.$message({
              type: "warning",
              message: "请填写完整的课程信息！"
            });
            return false;
          }
        } else if (course === 3) {
          let ITEM = this.MajorCourse[index]
          if ( ITEM.cou_name && ITEM.teacher && ITEM.idnumber && ITEM.school_hours) {
            if (isNaN(ITEM.school_hours)) {
              this.$message({
                type: "warning",
                message: "学时必须为数字值！",
                onClose: () => {
                  this.$set(this.MajorCourse[index], "school_hours", null);
                }
              });
              return false;
            }
            if ((ITEM.idnumber + "").length === 18) {
              if (isNaN(ITEM.idnumber.substring(0, 17))) {
                this.$message({
                  type: "warning",
                  message: "请输入正确的身份证号！"
                });
                return false;
              }
            } else if ((ITEM.idnumber + "").length === 8) {
            } else {
              this.$message({
                type: "warning",
                message: "请输入正确的职工号（8位） / 身份证号（18位）！"
              });
              return false
            }
            this.MajorCourse.push({
              cou_name: '',
              teacher: '',
              is_inschool: null,
              job: '',
              idnumber: '',
              unit: '',
              school_hours: null
            });
          } else {
            this.$message({
              type: "warning",
              message: "请填写完整的课程信息！"
            });
            return false
          }
        }
      } else if (step === 4) {
        this.form4.ys_zc.push({
          xm: "",
          fyzj: 0,
          note: ""
        });
      } else if (step === 5) {
        this.form4.ys_fz.push({
          xm: "",
          fyzj: 0, 
          note: "" 
        });
      } else if (step === 6) {
        this.form4.ys_hz[hzInd].note.push({
          xm: "", 
          fyzj: 0, 
          note: "" 
        });
      }
    },
    handleDelete(step, index, course, hzInd) {
      if (step === 0) {
        this.form0.yhzc_list.splice(index, 1);
      } else if (step === 1) {
        if (course === 1) {
          this.form1.courses.xiaonei.splice(index, 1);
        } else if (course === 2) {
          this.form1.courses.xiaowai.splice(index, 1);
        } else if (course === 3) { 
          this.MajorCourse.splice(index, 1)
        }
      } else if (step === 4) {
        this.form4.ys_zc.splice(index, 1);
      } else if (step === 5) {
        this.form4.ys_fz.splice(index, 1);
      } else if (step === 6) {
        this.form4.ys_hz[hzInd].note.splice(index, 1);
      }
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
    }, 
    beforePictureUpload(file) {
      const isTYPE =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.name.indexOf(".jpg") !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传图片只能是 JPG/ PNG/ GIF 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传图片大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form0, "yhzc_wj", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove(file, fileList) {
      this.$set(this.form0, "yhzc_wj", "");
      this.$set(this.form0, "yhzc_wjmc", "");
      this.fileList = [];
    },
    handleSuccess1(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form0, "zsjz_wd", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove1(file, fileList) {
      this.$set(this.form0, "zsjz_wd", "");
      this.fileList1 = [];
    },
    handleZzwjSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form3, "zzwj_file", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    beforeZzwjRemove(file, fileList) {
      this.$set(this.form3, "zzwj_file", "");
      this.fileListZzwj = [];
    },
    handleFrdbSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form3, "frdb_file", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    beforeFrdbRemove(file, fileList) {
      this.$set(this.form3, "frdb_file", "");
      this.fileListFrdb = [];
    },
    beforeUploadB(file) {
      const isTYPE = file.type === "application/pdf";
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传文件只能是 PDF 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    }, 
    handleSuccessB(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form0, "adm_reg_form", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemoveB(file, fileList) {
      this.$set(this.form0, "adm_reg_form", "");
      this.fileListB = [];
    },
    handlePreview() {
      let ID = this.form1.pro_id;
      if (this.$route.params && this.$route.params.id) {
        ID = this.$route.params.id;
      }
      sessionStorage.setItem("pro_status", JSON.stringify(this.tjStatus));
      this.$router.push("/home/project/preview/" + ID);
    },
    handlePreviewMod() {
      const data = {
        pro_id: this.mod_params.pro_id,
        cont: 1,
        mod_id: this.mod_params.mod_id
      };
      sessionStorage.setItem("mod_params", JSON.stringify(data));
      this.$router.push("/home/project/preview/" + this.mod_params.pro_id);
    },
    getAllInfo(refreshAdd, ID) {
      if (sessionStorage.getItem("Edit_ProData") || refreshAdd) {
        let val = {}
        if (!refreshAdd) {
          this.key = 0;
          val = JSON.parse(sessionStorage.getItem("Edit_ProData"));
          if (val.pro_status === 2) {
            this.tjStatus = true;
          } else {
            this.tjStatus = false;
          }
          sessionStorage.setItem("pro_status", JSON.stringify(this.tjStatus));
          this.history = val.history;
          this.$set(this.form1, "pro_id", val.id);
          this.$set(this.form1, "uid", val.uid);
          this.$set(this.form2, "pro_id", val.id);
          this.$set(this.form2, "uid", val.uid);
          this.$set(this.form3, "pro_id", val.id);
          this.$set(this.form3, "uid", val.uid);
          this.$set(this.form5, "pro_id", val.id);
          this.$set(this.form5, "uid", val.uid);
          this.$set(this.form4, "pro_id", val.id);
          this.$set(this.form4, "uid", val.uid);
          this.$set(this.subForm, "id", val.id);
          this.uid = val.uid;
        } else {
          val.id = ID
        }
        this.getProjectsData({
          data: {
            proid: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              let obj = Data.list[0];
              this.createTime = obj.create_time * 1000;
              Object.assign(this.form0, obj, {
                px_start_time: obj.px_start_time * 1000,
                px_end_time: obj.px_end_time * 1000,
                zs_start_time: obj.zs_start_time
                  ? obj.zs_start_time * 1000
                  : null,
                zs_end_time: obj.zs_end_time ? obj.zs_end_time * 1000 : null,
                site: [obj.province_id, obj.city_id],
                skfs: obj.skfs - 0,
                welfare: obj.welfare - 0
              });
              this.welfareVal = this.form0.welfare;
              this.placeholderSite0 = obj.province + "/" + obj.city;
              if (obj.zsjz_wd) {
                this.fileList1 = [
                  {
                    name: "招生简章文件",
                    code: obj.zsjz_wd
                  }
                ];
              }
              if (obj.adm_reg_form) {
                this.fileListB = [
                  {
                    name: "报名表",
                    code: obj.adm_reg_form
                  }
                ];
              }
              if (obj.is_yhzc) {
                ///优惠
                if (obj.yhzc_wj) {
                  this.fileList = [
                    {
                      name: obj.yhzc_wjmc,
                      code: obj.yhzc_wj
                    }
                  ];
                }
                this.getProjectYh({
                  data: {
                    pro_id: val.id
                  }
                }).then(data => {
                  if (data.data.code === 200) {
                    let list = data.data.data.list.map(item => {
                      return {
                        yhjg: item.yhjg,
                        yhtj: item.yhtj,
                        id: item.id
                      };
                    });
                    if (list.length) {
                      this.$set(this.form0, "yhzc_list", list);
                    } else {
                      this.$set(
                        this.form0,
                        "yhzc_list",
                        this.$options.form0.yhzc_list
                      );
                    }
                  }
                });
              }
              // let list = this.form2.lists.map(item=>{
              //     Object.assign(item,{
              //         sfbz_dw:this.form0.sfbz_dw,
              //         sfbz_xy:this.form0.sfbz_xy,
              //     });
              //     return item;
              // });
              // this.$set(this.form2,'lists',list);
              // if (obj.skfs) {
              //     let skfs = obj.skfs.map(item => {
              //         return Number(item)
              //     });
              //     this.$set(this.form0, 'skfs', skfs);
              // this.handleChangeSkfs(this.form0.skfs);
              // }
              if (obj.preliminary) {
                let preliminary = obj.preliminary.map(item => {
                  return Number(item);
                });
                this.$set(this.form0, "preliminary", preliminary);
              }
              if (obj.is_preliminary) {
                this.$set(this.preliminaryData, "pro_name", obj.pre_name);
                this.preliminary_search = obj.pre_code;
              }
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getCoursesForm1({
          data: {
            pro_id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list.xiaonei.length && Data.list.xiaowai.length) {
              this.$set(this.form1, "courses", Data.list);
            } else if (!Data.list.xiaonei.length && Data.list.xiaowai.length) {
              this.$set(this.form1, "courses", {
                xiaonei: this.$options.data().form1.courses.xiaonei,
                xiaowai: Data.list.xiaowai
              });
            } else if (!Data.list.xiaowai.length && Data.list.xiaonei.length) {
              this.$set(this.form1, "courses", {
                xiaonei: Data.list.xiaonei,
                xiaowai: this.$options.data().form1.courses.xiaowai
              });
            } else {
              if (this.isYXB) {
                if (this.$route.path === "/home/project/add" || this.$route.path === "/home/project/edit") {
                  this.yxbCourse(this.$route.path === "/home/project/edit" ? val.class_major_id : null)
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
        this.getWtForm2({
          data: {
            pro_id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.activeNameWT = `${Data.list.length}`;
              this.$set(this.form2, "lists", Data.list);
              let list = this.form2.lists.map(item => {
                Object.assign(item, {
                  // sfbz_dw:this.form0.sfbz_dw,
                  // sfbz_xy:this.form0.sfbz_xy,
                  placeholderSite2: item.province + "/" + item.city,
                  site: [],
                  options2: this.options0, 
                  props2: {
                    value: "id",
                    children: "cities"
                  }, 
                  uidIndex2: 0 
                });
                return item;
              });
              Object.assign(this.form2, {
                lists: list
              });
              if (this.form0.welfare == 1) {
                this.welfareValSfbz();
              }
            } else {
              this.$set(this.form2, "is_wtdw", 0);
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getFzForm3({
          data: {
            pro_id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const obj = Data.list[0];
              Object.assign(this.form3, obj, {
                obligation: obj.obligation - 0 || 1
              });
              this.is_fzdwV = true;
              sessionStorage.setItem("is_fz", 1);
              if (obj.zzwj_file) {
                this.fileListZzwj = [
                  {
                    name: "资质文件",
                    code: obj.zzwj_file
                  }
                ];
              }
              if (obj.frdb_file) {
                this.fileListFrdb = [
                  {
                    name: "法人代表身份证照片",
                    code: obj.frdb_file
                  }
                ];
              }
            } else {
              this.$set(this.form3, "is_fzdw", 0);
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getHzForm5({
          data: {
            pro_id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              this.activeNameHZ = `${Data.list.length}`;
              this.$set(this.form5, "lists", Data.list);
              this.is_hzdwV = Data.list.map(item => {
                return item.index_id;
              });
              sessionStorage.setItem("is_hz", JSON.stringify(this.is_hzdwV));
            } else {
              this.$set(this.form5, "is_hzdw", 0);
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
        this.getYsForm4({
          data: {
            pro_id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const Obj = Data.list[0];
              Object.assign(this.form4, Obj);
              if (!Obj.ys_fz.length) {
                Object.assign(this.form4, {
                  ys_fz: [this.$options.data().form4.ys_fz[0]]
                });
              }
              if (!Obj.ys_hz.length) {
                Object.assign(this.form4, {
                  ys_hz: [this.$options.data().form4.ys_hz[0]]
                });
              }
              if (this.form0.welfare == 1) {
                this.welfareValCount();
              }
            }
          }
        });
      } else {
        if (sessionStorage.getItem("PRO_STEP")) {
          this.key = 0;
          this.step = Number(sessionStorage.getItem("PRO_STEP")) || 0;
          this.tjStatus = JSON.parse(sessionStorage.getItem("pro_status"));
        } else {
          this.$router.go(-1);
        }
      }
    },
    getAllModInfo(params) {
      this.key = 0;
      this.getProModifyInfo0({
        data: params
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data) {
            let obj = Data;
            this.$set(this.form1, "uid", obj.uid);
            this.$set(this.form2, "uid", obj.uid);
            this.$set(this.form3, "uid", obj.uid);
            this.$set(this.form5, "uid", obj.uid);
            this.$set(this.form4, "uid", obj.uid);
            this.uid = obj.uid;

            this.createTime = obj.create_time * 1000;
            Object.assign(this.form0, obj, {
              px_start_time: obj.px_start_time * 1000,
              px_end_time: obj.px_end_time * 1000,
              zs_start_time: obj.zs_start_time
                ? obj.zs_start_time * 1000
                : null,
              zs_end_time: obj.zs_end_time ? obj.zs_end_time * 1000 : null,
              // site:[obj.province_id,obj.city_id],
              skfs: obj.skfs - 0,
              welfare: obj.welfare - 0
            });
            this.welfareVal = this.form0.welfare;
            this.placeholderSite0 = obj.province + "/" + obj.city;
            if (obj.zsjz_wd) {
              this.fileList1 = [
                {
                  name: "招生简章文件",
                  code: obj.zsjz_wd
                }
              ];
            }
            if (obj.adm_reg_form) {
              this.fileListB = [
                {
                  name: "报名表",
                  code: obj.adm_reg_form
                }
              ];
            }
            if (obj.is_yhzc) {
              ///优惠
              if (obj.yhzc_wj) {
                this.fileList = [
                  {
                    name: obj.yhzc_wjmc,
                    code: obj.yhzc_wj
                  }
                ];
              }
              this.getProModifyInfoYh({
                data: params
              }).then(data => {
                if (data.data.code === 200) {
                  let list = data.data.data.list.map(item => {
                    return {
                      yhjg: item.yhjg,
                      yhtj: item.yhtj,
                      id: item.id
                    };
                  });
                  if (list.length) {
                    this.$set(this.form0, "yhzc_list", list);
                  } else {
                    this.$set(
                      this.form0,
                      "yhzc_list",
                      this.$options.form0.yhzc_list
                    );
                  }
                }
              });
            }
            // let list = this.form2.lists.map(item=>{
            //     Object.assign(item,{
            //         sfbz_dw:this.form0.sfbz_dw,
            //         sfbz_xy:this.form0.sfbz_xy,
            //     });
            //     return item;
            // });
            // this.$set(this.form2,'lists',list);
            // if (obj.skfs) {
            //     let skfs = obj.skfs.map(item => {
            //         return Number(item)
            //     });
            //     this.$set(this.form0, 'skfs', skfs);
            // this.handleChangeSkfs(this.form0.skfs);
            // }
            if (obj.gl_type) {
              this.modify_gl_type = obj.gl_type;
            }
            if (obj.is_preliminary) {
              this.$set(this.preliminaryData, "pro_name", obj.pre_name);
              this.preliminary_search = obj.pre_code;
            }
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      this.getProModifyInfo1({
        data: params
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list.xiaonei.length && Data.list.xiaowai.length) {
            this.$set(this.form1, "courses", Data.list);
          } else if (!Data.list.xiaonei.length && Data.list.xiaowai.length) {
            this.$set(this.form1, "courses", {
              xiaonei: this.$options.data().form1.courses.xiaonei,
              xiaowai: Data.list.xiaowai
            });
          } else if (!Data.list.xiaowai.length && Data.list.xiaonei.length) {
            this.$set(this.form1, "courses", {
              xiaonei: Data.list.xiaonei,
              xiaowai: this.$options.data().form1.courses.xiaowai
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      this.getProModifyInfo2({
        data: params
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            this.activeNameWT = `${Data.list.length}`;
            this.$set(this.form2, "lists", Data.list);
            let list = this.form2.lists.map(item => {
              Object.assign(item, {
                // sfbz_dw:this.form0.sfbz_dw,
                // sfbz_xy:this.form0.sfbz_xy,
                placeholderSite2: item.province + "/" + item.city,
                site: [], 
                options2: this.options0,  
                props2: {
                  value: "id",
                  children: "cities"
                }, 
                uidIndex2: 0
              });
              return item;
            });
            Object.assign(this.form2, {
              lists: list
            });
            if (this.form0.welfare == 1) {
              this.welfareValSfbz();
            }
          } else {
            this.$set(this.form2, "is_wtdw", 0);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      this.getProModifyInfo3({
        data: params
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            const obj = Data.list[0];
            if (obj) {
              Object.assign(this.form3, obj, {
                obligation: obj.obligation - 0 || 1
              });
              this.is_fzdwV = true;
              sessionStorage.setItem("is_fz", 1);
              if (obj.zzwj_file) {
                this.fileListZzwj = [
                  {
                    name: "资质文件",
                    code: obj.zzwj_file
                  }
                ];
              }
              if (obj.frdb_file) {
                this.fileListFrdb = [
                  {
                    name: "法人代表身份证照片",
                    code: obj.frdb_file
                  }
                ];
              }
            } else {
              this.$set(this.form3, "is_fzdw", 0);
            }
          } else {
            this.$set(this.form3, "is_fzdw", 0);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      this.getProModifyInfo5({
        data: params
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            this.activeNameHZ = `${Data.list.length}`;
            this.$set(this.form5, "lists", Data.list);
            this.is_hzdwV = Data.list.map(item => {
              return item.index_id;
            });
            sessionStorage.setItem("is_hz", JSON.stringify(this.is_hzdwV));
          } else {
            this.$set(this.form5, "is_hzdw", 0);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      this.getProModifyInfo4({
        data: params
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            const Obj = Data.list[0];
            Object.assign(this.form4, Obj, {
              fz_note: Obj.fz_note ? Obj.fz_note : ""
            });
            if (!Obj.ys_fz.length) {
              Object.assign(this.form4, {
                ys_fz: [this.$options.data().form4.ys_fz[0]]
              });
            }
            if (!Obj.ys_hz.length) {
              Object.assign(this.form4, {
                ys_hz: [this.$options.data().form4.ys_hz[0]]
              });
            }
            if (this.form0.welfare == 1) {
              this.welfareValCount();
            }
          }
        }
      });
    },
    hzGetCwInfo(pro_id, type = 1, is_hzdwV) {
      let len = is_hzdwV.length;
      if (type === 1) {
        this.getYsForm4({
          data: {
            pro_id: pro_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const Obj = Data.list[0];
              Object.assign(this.form4, Obj);
              if (!Obj.ys_fz.length) {
                Object.assign(this.form4, {
                  ys_fz: [this.$options.data().form4.ys_fz[0]]
                });
              }
              if (!Obj.ys_hz.length) {
                Object.assign(this.form4, {
                  ys_hz: [this.$options.data().form4.ys_hz[0]]
                });
              } else {
                if (len > Obj.ys_hz.length) {
                  let number = len - Obj.ys_hz.length;
                  let ys_hz0 = [];
                  for (let i = 0; i < number; i++) {
                    ys_hz0.push(this.$options.data().form4.ys_hz[0]);
                  }
                  let ys_hz = []
                    .concat(Obj.ys_hz, ys_hz0)
                    .map((item, index) => {
                      return Object.assign(item, {
                        index_id: item.index_id || is_hzdwV[index]
                      });
                    });
                  this.$set(this.form4, "ys_hz", ys_hz);
                }
                let ys_hz = this.form4.ys_hz.map(item => {
                  return Object.assign(item, {
                    note: item.note.length
                      ? item.note
                      : [this.$options.data().form4.ys_hz[0].note[0]]
                  });
                });
                this.$set(this.form4, "ys_hz", ys_hz);
              }
              if (!Obj.hz_note.length) {
                Object.assign(this.form4, {
                  hz_note: [this.$options.data().form4.hz_note[0]]
                });
              } else {
                if (len > Obj.hz_note.length) {
                  let number = len - Obj.hz_note.length;
                  let hz_note0 = [];
                  for (let i = 0; i < number; i++) {
                    hz_note0.push(this.$options.data().form4.hz_note[0]);
                  }
                  let hz_note = []
                    .concat(Obj.hz_note, hz_note0)
                    .map((item, index) => {
                      return Object.assign(item, {
                        index_id: item.index_id || is_hzdwV[index]
                      });
                    });
                  this.$set(this.form4, "hz_note", hz_note);
                }
              }
              if (this.form0.welfare == 1) {
                this.welfareValCount();
              }
            } else {
              let hz_note = [],
                ys_hz = [];
              for (let i = 0; i < len; i++) {
                hz_note.push(this.$options.data().form4.hz_note[0]);
                ys_hz.push(this.$options.data().form4.ys_hz[0]);
              }
              hz_note.map((item, index) => {
                return Object.assign(item, {
                  index_id: is_hzdwV[index]
                });
              });
              ys_hz.map((item, index) => {
                return Object.assign(item, {
                  index_id: is_hzdwV[index]
                });
              });
              this.$set(this.form4, "hz_note", hz_note);
              this.$set(this.form4, "ys_hz", ys_hz);
            }
          }
        });
      } else {
        this.getProModifyInfo4({
          data: this.mod_params
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const Obj = Data.list[0];
              Object.assign(this.form4, Obj);
              if (!Obj.ys_fz.length) {
                Object.assign(this.form4, {
                  ys_fz: [this.$options.data().form4.ys_fz[0]]
                });
              }
              if (!Obj.ys_hz.length) {
                Object.assign(this.form4, {
                  ys_hz: [this.$options.data().form4.ys_hz[0]]
                });
              } else {
                if (len > Obj.ys_hz.length) {
                  let number = len - Obj.ys_hz.length;
                  let ys_hz0 = [];
                  for (let i = 0; i < number; i++) {
                    ys_hz0.push(this.$options.data().form4.ys_hz[0]);
                  }
                  let ys_hz = []
                    .concat(Obj.ys_hz, ys_hz0)
                    .map((item, index) => {
                      return Object.assign(item, {
                        index_id: item.index_id || is_hzdwV[index],
                        note: item.note.length
                          ? item.note
                          : this.$options.data().form4.ys_hz[0].note[0]
                      });
                    });
                  this.$set(this.form4, "ys_hz", ys_hz);
                }
                let ys_hz = this.form4.ys_hz.map(item => {
                  return Object.assign(item, {
                    note: item.note.length
                      ? item.note
                      : [this.$options.data().form4.ys_hz[0].note[0]]
                  });
                });
                this.$set(this.form4, "ys_hz", ys_hz);
              }
              if (!Obj.hz_note.length) {
                Object.assign(this.form4, {
                  hz_note: [this.$options.data().form4.hz_note[0]]
                });
              } else {
                if (len > Obj.hz_note.length) {
                  let number = len - Obj.hz_note.length;
                  let hz_note0 = [];
                  for (let i = 0; i < number; i++) {
                    hz_note0.push(this.$options.data().form4.hz_note[0]);
                  }
                  let hz_note = []
                    .concat(Obj.hz_note, hz_note0)
                    .map((item, index) => {
                      return Object.assign(item, {
                        index_id: item.index_id || is_hzdwV[index]
                      });
                    });
                  this.$set(this.form4, "hz_note", hz_note);
                }
              }
            } else {
              let hz_note = [],
                ys_hz = [];
              for (let i = 0; i < len; i++) {
                hz_note.push(this.$options.data().form4.hz_note[0]);
                ys_hz.push(this.$options.data().form4.ys_hz[0]);
              }
              hz_note.map((item, index) => {
                return Object.assign(item, {
                  index_id: is_hzdwV[index]
                });
              });
              ys_hz.map((item, index) => {
                return Object.assign(item, {
                  index_id: is_hzdwV[index]
                });
              });
              this.$set(this.form4, "hz_note", hz_note);
              this.$set(this.form4, "ys_hz", ys_hz);
            }
          }
        });
      }
    },
    handleEditZsjz() {
      for (let key in this.content) {
        if (this.content[key].show) {
          this.content[key].content = this.form0[key];
        }
      }
      this.ue_radio = this.$options.data().ue_radio;
      let content = this.content[this.ue_radio].content;
      this.ue_content = content;
      this.dialogVisible_zsjz = true;
    },
    handleTrueZsjz() {
      let content_last = this.$refs.ue.getUEContent();
      this.$set(this.content[this.ue_radio], "content", content_last);

      for (let key in this.content) {
        let item = this.content[key];
        if (item.show && !item.content) {
          this.$message.warning({
            message: `${item.label}不能为空！`
          });
          return false;
        }
      }
      for (let key in this.content) {
        if (this.content[key].show) {
          let content = this.content[key].content;
          this.$set(this.form0, key, content);
        }
      }
      this.dialogVisible_zsjz = false;
    },
    handleChangeIsYhzc(val) {
      if (val === 1) {
        if (this.form0.yhzc_list && !this.form0.yhzc_list.length) {
          this.form0.yhzc_list.push({
            id: null,
            yhjg: 0,
            yhtj: ""
          });
        }
      }
    },
    handleChangeGltype(val) {
      if (val === 4) {
        // this.$set(this.form0, 'site', []);
        // this.$set(this.form0, 'province_id', null);
        // this.$set(this.form0, 'city_id', null);
        // this.$set(this.form0, 'province', '');
        // this.$set(this.form0, 'city', '');
        // this.$set(this.form0, 'pxdd', '');
        // this.$set(this.form0, 'skfs', [2]);
      } else {
        // this.$set(this.form0, 'skfs', []);
        if (val === 5) {
          this.$set(this.form0, "is_preliminary", 0);
          this.$set(this.form0, "pro_code", "");
        }
      }
      // this.handleChangeSkfs(this.form0.skfs);
      this.$set(this.form0, "preliminary", []);
    },
    handleChangeSkfs(val) {
      // this.skfs2 = val.some(item => {
      //     return item === 2
      // });
      // if (!this.skfs2) {
      //     this.$set(this.form0, 'platform_network', '');
      //     this.$set(this.form0, 'platform_site', '');
      //     this.$set(this.form0, 'platform_introduced', '');
      // }

      if (val === 1) {
        this.$set(this.form0, "platform_network", "");
        this.$set(this.form0, "platform_site", "");
        this.$set(this.form0, "platform_introduced", "");
      }
    },
    handlePreliminarySearch() {
      if (this.preliminary_search) {
        this.preliminary_search_loading = true;
        if (this.preliminary_search_loading) {
          this.getProjectFields({
            data: {
              fields: "id, pro_name, pro_code",
              pro_code: this.preliminary_search
            }
          }).then(data => {
            this.preliminary_search_loading = false;
            if (data.data.code === 200) {
              const list = data.data.data.list;
              if (list && list.length === 1) {
                this.$set(this.form0, "pre_code", list[0].pro_code);
                this.preliminaryData = list[0];
              } else {
                this.$message.warning("未查询到预立项项目信息");
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
        this.$message.error("请输入预立项项目编号");
      }
    },
    handleChangeIsPreliminary(val) {
      if (!val) {
        this.$set(this.form0, "pre_code", "");
      }
    },
    welfareValCount() {
      this.$set(this.form4, "sr_jhsr", 0);
      this.$set(this.form4, "zc_xxglf", 0);
      this.$set(this.form4, "zc_xyglfy", 0);
      this.$set(this.form4, "zc_fzdwfc", 0);
      this.form4.hz_note.forEach((item, index) => {
        this.$set(this.form4.hz_note[index], "zc_hzdwfc", 0);
      });
    },
    handleChangeWelfare(val) {
      if (val === 1) {
        this.$set(this.form0, "sfbz", 1);
        this.$set(this.form0, "sfbz_dw", 0);
        this.$set(this.form0, "sfbz_xy", 0);
        this.$set(this.form0, 'ks_charge', 1)
        this.$set(this.form0, 'specific_rate', '')
      }
    },
    welfareValSfbz(val) {
      this.form2.lists.forEach((item, index) => {
        this.$set(this.form2.lists[index], "sfbz_dw", 0);
        this.$set(this.form2.lists[index], "sfbz_xy", 0);
        this.$set(this.form2.lists[index], "sfbz_dw_fq", 1);
        this.$set(this.form2.lists[index], "sfbz_dw_zfsj", "");
      });
    },
    yxbCourse (id) {
      const ID = this.Query.class_major_id || id
      if (ID) {
        this.axiosHttp({
          url: urls.yxb_course,
          data: {
            class_major_id: ID
          }
        }).then(data => {
          if (data.data.code === 200) {
            const List = data.data.data || []
            const xn = [] 
            const xw = []
            List.map(item => {
              if (item.docent_idcard.length === 8) {
                xn.push({
                  cou_name: item.course_name || '',
                  teacher: item.docent_name || '',
                  is_inschool: 1,
                  job: item.docent_title || '',
                  idnumber: item.docent_idcard || '',
                  unit: item.docent_unit || '',
                  school_hours: item.course_hour || null
                })
              } else if (item.docent_idcard.length === 18) {
                xw.push({
                  cou_name: item.course_name || '',
                  teacher: item.docent_name || '',
                  is_inschool: 2,
                  job: item.docent_title || '',
                  idnumber: item.docent_idcard || '',
                  unit: item.docent_unit || '',
                  school_hours: item.course_hour || null
                })
              }
            })
            if (xn.length) {
              this.$set(this.form1.courses, 'xiaonei', [].concat(xn, this.$options.data().form1.courses.xiaonei))
            }
            if (xw.length) {
              this.$set(this.form1.courses, 'xiaowai', [].concat(xw, this.$options.data().form1.courses.xiaowai))
            }
            this.readMajor = true
            this.MajorCourse = List.map(item => {
              return {
                cou_name: item.course_name || '',
                teacher: item.docent_name || '',
                is_inschool: null,
                job: item.docent_title || '',
                idnumber: item.docent_idcard || '',
                unit: item.docent_unit || '',
                school_hours: item.course_hour || null
              }
            })
          }
        })
      }
    },
    backList () {
      this.$router.go(-1)
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
    this.uid = this.userInfo.uid; 
    if (this.userInfo.role === 2) {
      this.$set(this.form0, "college", this.userInfo.college);
      this.$set(this.form0, "college_id", this.userInfo.collegeId);
      if (MATE('project_sign', this.userInfo.college)) {
        this.is_ss = true;
        if (this.userInfo.auth_college) {
          this.is_ss_auth = true;
        }
      }
    }
    this.headers = JSON.parse(this.$cookie.get("headers"));
    this.step = Number(sessionStorage.getItem("PRO_STEP")) || 0;
    const Rou = this.$route;
    if (Rou.path === "/home/project/edit") {
      this.getAllInfo();
    } else {
      sessionStorage.removeItem("pro_status");
      if (Rou.path.indexOf("/project/modify/") > 0) {
        this.is_modify = true;
        const modParams = sessionStorage.getItem("proModInfo");
        const modParams2 = sessionStorage.getItem("proModInfo2");
        if (modParams) {
          this.mod_params = JSON.parse(modParams);
          this.getAllModInfo(this.mod_params);
        } else if (modParams2) {
          this.mod_params = JSON.parse(modParams2);
        } else {
          this.$notify.error({
            title: "错误",
            message: "数据获取失败，请稍后再试！"
          });
        }
      } else {
        if (this.isYXB && this.Query.prefix) {
          this.prefix = this.Query.prefix
          this.$set(this.form0, 'pro_name', this.prefix)
          this.$set(this.form0, 'zs_type', 2)
          this.$set(this.form0, 'sfbz', 2)
          
          if (this.Query.area) {
            let Area = this.Query.area.split(',')
            if (Area.length === 4) {
              this.$set(this.form0, 'province_id', Area[0] - 0)
              this.$set(this.form0, 'province', Area[1])
              this.$set(this.form0, 'city_id', Area[2] - 0)
              this.$set(this.form0, 'city', Area[3])
              this.$set(this.form0, 'site', [Area[0] - 0, Area[2] - 0])
              this.placeholderSite0 = `${Area[1]}/${Area[3]}`
            }
          }
        }
      }
    }

    if (sessionStorage.getItem("PRO")) {
      const pro = JSON.parse(sessionStorage.getItem("PRO"));
      this.$set(this.form1, "pro_id", pro.pro_id);
      this.$set(this.form2, "pro_id", pro.pro_id);
      this.$set(this.form3, "pro_id", pro.pro_id);
      this.$set(this.form5, "pro_id", pro.pro_id);
      this.$set(this.form4, "pro_id", pro.pro_id);
      this.$set(this.subForm, "id", pro.pro_id);
      this.sfbzVal = pro.sfbz;
      this.ksCharge = pro.ks_charge || 1;
      this.welfareVal = pro.welfare;
      let list1 = this.form2.lists.map(item=>{
          let obj = Object.assign(item,{
              // sfbz_dw:pro.sfbz_dw,
              // sfbz_xy:pro.sfbz_xy,
              specific_rate: pro.specific_rate || ''
          }) ;
          return obj;
      });
      Object.assign(this.form2,{
          lists: list1,
      });
      if (!this.is_modify) {
        this.getAllInfo(true, pro.pro_id)
      }
    } else {
      // 研修班：'新增'首次进入时读取办班专业中的课程！！
      if (this.isYXB && Rou.path === "/home/project/add") {
        this.yxbCourse()
      }
    }
    this.initData();
    if (sessionStorage.getItem("is_fz")) {
      let is_fz = Number(sessionStorage.getItem("is_fz"));
      if (is_fz) {
        this.is_fzdwV = true;
      } else {
        this.is_fzdwV = false;
      }
    }
    if (sessionStorage.getItem("is_hz")) {
      this.is_hzdwV = JSON.parse(sessionStorage.getItem("is_hz"));
    }
    if (sessionStorage.getItem("gl_type_5")) {
      this.gl_type_5 = true;
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("PRO");
    sessionStorage.removeItem("PRO_STEP");
    sessionStorage.removeItem("Edit_ProData");
    sessionStorage.removeItem("is_fz");
    sessionStorage.removeItem("is_hz");
    sessionStorage.removeItem("proModInfo");
    sessionStorage.removeItem("proModInfo2");
    sessionStorage.removeItem("gl_type_5");
  },
  watch: {
    step() {
      sessionStorage.setItem("PRO_STEP", this.step);
      if (!this.key) {
        this.activeIndex = this.step + "";
      }
      if (this.step == 2 && this.form0.welfare == 1) {
        this.welfareValSfbz();
      }
      if (this.step == 5 && this.welfareVal === 1) {
        this.welfareValCount();
      }
    },
    "form4.ys_zc": {
      handler() {
        let list = this.form4.ys_zc;
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
        this.$set(this.form4, "zc_xmzcfy", sum / m);
        this.zc_xmzcfy = sum / m;
      },
      deep: true
    },
    "form0.college"() {
      if (this.form0.college == "继续教育学院") {
        this.jxjy = true;
      } else {
        this.jxjy = false;
      }
    },
    ue_radio(cur, old) {
      this.$nextTick(() => {
        let content_old = this.$refs.ue.getUEContent();
        this.$set(this.content[old], "content", content_old);
        let content_cur = this.content[cur].content;
        this.$refs.ue.setUEContent(content_cur);
      });
    },
    "form0.welfare"() {
      if (this.form0.welfare === 1) {
        this.welfareValSfbz();
        this.welfareValCount();
      }
    }
  }
};
</script>

<style scoped>
.project-add-main {
  padding-top: 20px;
}
.project-add-main-body {
  padding-top: 20px;
  padding-bottom: 20px;
}
.submit-over {
  text-align: center;
  font-size: 20px;
}
.submit-over .icon {
  color: #67c23a;
}
.submit-over .text {
  line-height: 36px;
}
.course-tip {
  font-size: 12px;
  color: #f56c6c;
}
.must-course-item {
  text-decoration: underline;
}
.end-text {
  font-size: 12px;
  color: #606266;
}
.annotation {
  margin: 0;
  font-size: 12px;
  color: #8492a6;
}
.step-annotation {
  margin-bottom: 10px;
}
.annotation span {
  text-decoration: underline;
}
.head-step {
  position: relative;
  width: 90%;
  margin: 0 auto;
}
.head-step .tj-btn {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.add-btn-ico {
  position: fixed;
  bottom: 58px;
  right: 20px;
  width: 131px;
  height: 38px;
  color: #e6a23c;
  text-align: center;
  line-height: 38px;
  font-size: 38px;
}
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
.upload {
  display: inline-block;
}
.course-box {
  margin: 20px;
}
.dialog-footer {
  position: relative;
}
.dialog-footer-show {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.dialog-footer-none {
  display: none;
}
.import-tip-box {
  text-indent: 2em;
  line-height: 2em;
  font-size: 14px;
}
.import-tip-box span {
  color: #f56c6c;
}
.font-num-total {
  padding: 0 4px;
  font-size: 12px;
  line-height: 12px;
  color: #f56c6c;
}
.step-form-box-two {
  width: 800px;
  margin: 0 auto;
}
.ueditor-box{
  position: relative;
}
.ueditor-box-ssfs{
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  padding: 20px;
  z-index: 10000;
  background-color: #fff;
}
</style>
