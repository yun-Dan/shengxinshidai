<template>
  <div
    class="app-finance-account-add"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card v-cloak>
      <div slot="header" class="clearfix">
        <el-button type="primary" @click.native="$router.go(-1)">返回</el-button>
      </div>
      <div class="clearfix" style="padding-top: 20px" v-cloak>
        <el-form label-width="140px" style="text-align: left;width: 50%;float: left" v-cloak>
          <el-form-item label="项目名称：">
            <div style="line-height: 20px;padding-top: 8px">{{ createInfo.pro_name }}</div>
          </el-form-item>
          <el-form-item label="立项收费标准：">
            <template v-if="proData.sfbz===1">单位支付{{ proData.sfbz_dw }}元</template>
            <template v-if="proData.sfbz===2">学员支付{{ proData.sfbz_xy }}元/人标准</template>
            <template v-if="proData.sfbz===3">单位支付{{ proData.sfbz_dw }}元，学员支付{{ proData.sfbz_xy }}元/人标准</template>
            <template v-if="proData.sfbz===4">
              按照课时或模块支付，具体收费方式为：{{ proData.specific_rate }}
            </template>
          </el-form-item>
          <el-form-item label="证书申领人数：">{{ proData.certf_num}} 人</el-form-item>
          <el-form-item label="计划培训天数：">{{ proData.pxts }} 天</el-form-item>
          <el-form-item
            v-cloak
            v-if="(createInfo.oneflag && (form.teachers || form.outside)) || (!createInfo.oneflag && (createInfo.teachers && createInfo.teachers.length || createInfo.outside && createInfo.outside.length))"
            label="教师信息："
          >
            <div style="margin-bottom: 20px">
              <el-table
                :data="createInfo.oneflag ? form.teachers : createInfo.teachers"
                size="mini"
                border
                :header-cell-style="{backgroundColor:'#fafafa'}"
                style="width: 100%"
              >
                <el-table-column align="center" label="校内教师">
                  <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                      <el-input v-if="createInfo.oneflag" v-model="scope.row.teacher"></el-input>
                      <span v-else>{{ scope.row.teacher }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="职工号">
                    <template slot-scope="scope">
                      <el-input v-if="createInfo.oneflag" v-model.trim="scope.row.idnumber"></el-input>
                      <span v-else>{{ scope.row.idnumber }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="课程">
                    <template slot-scope="scope">
                      <el-input v-if="createInfo.oneflag" v-model.trim="scope.row.cou_name"></el-input>
                      <span v-else>{{ scope.row.cou_name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="createInfo.oneflag" align="center" label="操作" width="56">
                    <template slot-scope="scope">
                      <div v-if="form.teachers.length !== 1">
                        <el-button type="text" @click="handleDeleteTeacher(scope.$index, 1)">删除</el-button>
                      </div>
                      <div v-if="scope.$index + 1 === form.teachers.length">
                        <el-button type="text" @click="handleAddTeacher(1)">新增</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <div>
              <el-table
                :data="createInfo.oneflag ? form.outside : createInfo.outside"
                size="mini"
                border
                :header-cell-style="{backgroundColor:'#fafafa'}"
                style="width: 100%"
              >
                <el-table-column align="center" label="校外教师">
                  <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                      <el-input v-if="createInfo.oneflag" v-model="scope.row.teacher"></el-input>
                      <span v-else>{{ scope.row.teacher }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="身份证号">
                    <template slot-scope="scope">
                      <el-input v-if="createInfo.oneflag" v-model.trim="scope.row.idnumber"></el-input>
                      <span v-else>{{ scope.row.idnumber }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="课程">
                    <template slot-scope="scope">
                      <el-input v-if="createInfo.oneflag" v-model.trim="scope.row.cou_name"></el-input>
                      <span v-else>{{ scope.row.cou_name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="createInfo.oneflag" align="center" label="操作" width="56">
                    <template slot-scope="scope">
                      <div v-if="form.outside.length !== 1">
                        <el-button type="text" @click="handleDeleteTeacher(scope.$index, 2)">删除</el-button>
                      </div>
                      <div v-if="scope.$index + 1 === form.outside.length">
                        <el-button type="text" @click="handleAddTeacher(2)">新增</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="createInfo.oneflag">
              <div
                class="danger"
                style="margin-top: 10px; line-height: 2em"
              >* 1.请在上表认真如实的填写最终确认的实际培训课程名称与上课教师信息，财务处将依据此表核对该培训班的培训课酬发放申请。</div>
              <div
                class="danger"
                style="margin-top: 10px; line-height: 2em"
              >* 2.此教师信息仅在首次结算添加，请谨慎填写。</div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="createInfo.fileflag && createInfo.oneflag && (createInfo.profz_list && createInfo.profz_list.length || createInfo.prowt_list && createInfo.prowt_list.length || createInfo.prohz_list && createInfo.prohz_list.length || createInfo.proqt_list && createInfo.proqt_list.length)"
            label="相关协议上传："
            :rules="[{required:true}]"
          >
            <div class="account-import-tip">
              * 首次添加结算请
              <strong>务必上传</strong>协议相关文件，本条结算将提交至合同办公室，请认真
              <strong>填写完整</strong>信息。
            </div>
            <el-table
              v-if="createInfo.profz_list.length"
              :data="createInfo.profz_list"
              border
              :header-cell-style="{backgroundColor:'#fafafa'}"
              style="width: 100%;margin-bottom: 20px"
            >
              <el-table-column align="center" prop="contract_code" label="辅助协议编号" width="140"></el-table-column>
              <el-table-column v-if="is_replay_con&&createInfo.oneflag" align="center" label="原附件">
                <template slot-scope="scope">
                  <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                    <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                  </a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <template v-if="createInfo.fileflag">
                    <div class="upload-box">
                      <el-upload
                        class="upload"
                        :action="uploadExcelUrl1"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforePDFUpload"
                        :headers="headers"
                        :with-credentials="true"
                        name="attachment"
                        :limit="1"
                        accept=".PDF, .pdf"
                        :auto-upload="true"
                      >
                        <template v-if="is_replay_con&&createInfo.oneflag">
                          <el-button
                            :key="1"
                            type="text"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,1,scope.$index)"
                          >【重新上传PDF】</el-button>
                        </template>
                        <template v-else>
                          <el-button
                            :key="1"
                            type="success"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,1,scope.$index)"
                          >上传PDF</el-button>
                        </template>
                      </el-upload>
                      <el-button
                        type="text"
                        v-if="contract_file[1][scope.$index]"
                        @click="handleYL(contract_file[1][scope.$index])"
                      >预览</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                      <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                    </a>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="createInfo.prowt_list.length"
              :data="createInfo.prowt_list"
              border
              :header-cell-style="{backgroundColor:'#fafafa'}"
              style="width: 100%;margin-bottom: 20px"
            >
              <el-table-column align="center" prop="contract_code" label="委托协议编号" width="140"></el-table-column>
              <el-table-column v-if="is_replay_con&&createInfo.oneflag" align="center" label="原附件">
                <template slot-scope="scope">
                  <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                    <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                  </a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <template v-if="createInfo.fileflag">
                    <div class="upload-box">
                      <el-upload
                        class="upload"
                        :action="uploadExcelUrl1"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforePDFUpload"
                        :headers="headers"
                        :with-credentials="true"
                        name="attachment"
                        :limit="1"
                        accept=".PDF, .pdf"
                        :auto-upload="true"
                      >
                        <template v-if="is_replay_con&&createInfo.oneflag">
                          <el-button
                            :key="1"
                            type="text"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,2,scope.$index)"
                          >【重新上传PDF】</el-button>
                        </template>
                        <template v-else>
                          <el-button
                            :key="1"
                            type="success"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,2,scope.$index)"
                          >上传PDF</el-button>
                        </template>
                      </el-upload>
                      <el-button
                        type="text"
                        v-if="contract_file[2][scope.$index]"
                        @click="handleYL(contract_file[2][scope.$index])"
                      >预览</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                      <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                    </a>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="createInfo.prohz_list.length"
              :data="createInfo.prohz_list"
              border
              :header-cell-style="{backgroundColor:'#fafafa'}"
              style="width: 100%;margin-bottom: 20px"
            >
              <el-table-column align="center" prop="contract_code" label="合作协议编号" width="140"></el-table-column>
              <el-table-column v-if="is_replay_con&&createInfo.oneflag" align="center" label="原附件">
                <template slot-scope="scope">
                  <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                    <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                  </a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <template v-if="createInfo.fileflag">
                    <div class="upload-box">
                      <el-upload
                        class="upload"
                        :action="uploadExcelUrl1"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforePDFUpload"
                        :headers="headers"
                        :with-credentials="true"
                        name="attachment"
                        :limit="1"
                        accept=".PDF, .pdf"
                        :auto-upload="true"
                      >
                        <template v-if="is_replay_con&&createInfo.oneflag">
                          <el-button
                            :key="1"
                            type="text"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,4,scope.$index)"
                          >【重新上传PDF】</el-button>
                        </template>
                        <template v-else>
                          <el-button
                            :key="1"
                            type="success"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,4,scope.$index)"
                          >上传PDF</el-button>
                        </template>
                      </el-upload>
                      <el-button
                        type="text"
                        v-if="contract_file[4][scope.$index]"
                        @click="handleYL(contract_file[4][scope.$index])"
                      >预览</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                      <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                    </a>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="createInfo.proqt_list.length"
              :data="createInfo.proqt_list"
              border
              :header-cell-style="{backgroundColor:'#fafafa'}"
              style="width: 100%"
            >
              <el-table-column align="center" prop="contract_code" label="其他协议编号" width="140"></el-table-column>
              <el-table-column v-if="is_replay_con&&createInfo.oneflag" align="center" label="原附件">
                <template slot-scope="scope">
                  <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                    <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                  </a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <template v-if="createInfo.fileflag">
                    <div class="upload-box">
                      <el-upload
                        class="upload"
                        :action="uploadExcelUrl1"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforePDFUpload"
                        :headers="headers"
                        :with-credentials="true"
                        name="attachment"
                        :limit="1"
                        accept=".PDF, .pdf"
                        :auto-upload="true"
                      >
                        <template v-if="is_replay_con&&createInfo.oneflag">
                          <el-button
                            :key="1"
                            type="text"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,3,scope.$index)"
                          >【重新上传PDF】</el-button>
                        </template>
                        <template v-else>
                          <el-button
                            :key="1"
                            type="success"
                            size="mini"
                            icon
                            @click="handleGetIndex(scope.row,3,scope.$index)"
                          >上传PDF</el-button>
                        </template>
                      </el-upload>
                      <el-button
                        type="text"
                        v-if="contract_file[3][scope.$index]"
                        @click="handleYL(contract_file[3][scope.$index])"
                      >预览</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <a target="_blank" :href=" lookUrl+ '/'+scope.row.contract_code_file">
                      <el-button type="text" style="padding: 0px">【点击查看】</el-button>
                    </a>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <el-form
          ref="form"
          :model="form"
          label-width="160px"
          style="text-align: left;width: 50%;float: left"
        >
          <el-form-item label="项目编号：">
            {{ createInfo.pro_code }}
            【
            <span v-for="(item,key,index) in proConfig.pxlx" :key="index">{{PXLX==key?item:''}}</span>】
          </el-form-item>
          <el-form-item label="经手人：" :rules="[{required:true}]">
            <el-row>
              <el-col :xs="24" :sm="10">
                <div class="grid-content bg-purple">
                  <el-input v-model.trim="form.js_username"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="手机号码（11位）：" :rules="[{required:true}]">
            <el-row>
              <el-col :xs="24" :sm="10">
                <div class="grid-content bg-purple">
                  <el-input v-model.trim="form.js_lxfs"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="本次结算人数：" :rules="[{required:true}]">
            <el-input-number v-model.trim="form.balan_pers" :min="0" :disabled="isYXB"></el-input-number>
          </el-form-item>
          <el-form-item label="总培训天数：" :rules="[{required:true}]">
            <el-input-number
              v-model.trim="form.balan_days"
              :min="0"
              :disabled="!createInfo.daysflag"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="本次结算金额：" :rules="[{required:true}]">
            <el-input-number
              v-model.trim="form.balan_cost"
              controls-position="right"
              :min="0"
              :precision="2"
              :step="1"
            ></el-input-number>
            <span class="end-text">元</span>
          </el-form-item>
          <el-form-item
            v-if="createInfo.fzdwflag||createInfo.pro_id=='39'||createInfo.pro_id=='81600'"
            label="辅助单位本次分款金额："
            :rules="[{required:true}]"
          >
            <el-input-number
              v-model.trim="form.balan_subcost"
              controls-position="right"
              :min="0"
              :precision="2"
              :step="1"
            ></el-input-number>
            <span class="end-text">元</span>
          </el-form-item>
          <template v-if="createInfo.college && createInfo.college.length">
            <el-form-item
              v-for="(item, index) in form.college"
              :key="index"
              :label="`合作学院【${ item.yf_dwmc}】本次分款金额：`"
              :rules="[{required:true}]"
            >
              <el-input-number
                v-model.trim="item.hz_subcost"
                controls-position="right"
                :min="0"
                :precision="2"
                :step="1"
              ></el-input-number>
              <span class="end-text">元</span>
            </el-form-item>
          </template>
          <template v-if="PXLX ===6 && !isYXB">
            <el-form-item label="政府类培训班：" :rules="[{required:true}]">
              <div style="font-size: 12px;color: #606266;line-height: 24px;padding-top: 8px">
                依据政府类培训班管理费食宿优惠政策，申请调减本次培训班管理费为：
                <strong
                  style="color: #5daf34;text-decoration: underline"
                >{{ form.manage_scale }} %</strong>。
                <br>（按照
                <strong>8%</strong>比例收取管理费的政府培训班，如安排食宿按照
                <strong>5%</strong>比例收取管理费；
                若只安排餐或者宿，按照
                <strong>7%</strong>比例收取管理费。
                因办班单位违规而取消政府类培训班管理费优惠政策的，食宿费用不予调减管理费比例。）
              </div>
            </el-form-item>
            <el-form-item label="管理费比例调减：" :rules="[{required:true}]">
              <div style="font-size: 12px;color: #8492a6">申请管理费调减必须有发票凭据，无凭据不予调减。</div>
              <el-input-number
                v-model.trim="form.manage_scale"
                :precision="2"
                :step="1"
                :min="0"
                :max="100"
                controls-position="right"
              ></el-input-number>%
            </el-form-item>
            <el-form-item label="发票凭据：">
              <div style="font-size: 12px;color: #8492a6">发票凭据只能上传 jpg / png / gif 图片。</div>
              <div class="clearfix">
                <div class="upload-box fl" style="width: 150px">
                  <el-upload
                    class="upload"
                    :action="uploadExcelUrl1"
                    :on-success="handleSuccess1"
                    :on-remove="handleRemove1"
                    :before-upload="beforePictureUpload"
                    :headers="headers"
                    :with-credentials="true"
                    :file-list="fileList1"
                    name="attachment"
                    :limit="1"
                    accept=".JPG, .jpg, .png, .PNG, .gif, .GIF"
                    :auto-upload="true"
                  >
                    <el-button :key="1" type="success" size="mini">就餐发票上传</el-button>
                  </el-upload>
                </div>
                <div class="upload-box fl" style="width: 150px">
                  <el-upload
                    class="upload"
                    :action="uploadExcelUrl1"
                    :on-success="handleSuccess2"
                    :on-remove="handleRemove2"
                    :before-upload="beforePictureUpload"
                    :file-list="fileList2"
                    :headers="headers"
                    :with-credentials="true"
                    name="attachment"
                    :limit="1"
                    accept=".JPG, .jpg, .png, .PNG"
                    :auto-upload="true"
                  >
                    <el-button :key="1" type="success" size="mini">住宿发票上传</el-button>
                  </el-upload>
                </div>
              </div>
              <div style="color: #f56c6c;font-size: 12px">* 请在上传的纸质发票的备注栏里填写本次结算的项目名称及项目编号！</div>
            </el-form-item>
          </template>
          <template v-if="isYXB">
            <el-form-item label="结算人员：" required>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
                <el-checkbox v-for="(val, ind) in studentsList" :key="ind" :label="val.id" :disabled="val.jfwc == 2">
                  {{ val.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
          <el-form-item v-if="is_replay_con" label="本次修改说明：" :rules="[{required:true}]">
            <el-row>
              <el-col :xs="24" :sm="14">
                <div class="grid-content bg-purple">
                  <el-input v-model.trim="form.replay_con" type="textarea"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-cloak>
            <el-button v-if="!createInfo.oneflag" type="primary" @click="handleTrue(0)" :key="3">保 存</el-button>
            <el-button type="primary" @click="handleTrue(1)" :key="4">保存并提交</el-button>
            <el-button @click.native="$router.go(-1)" :key="5">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-finance-account-add",
  data() {
    return {
      loading2: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      PXLX: 0,
      proData: {},
      createInfo: {
        balan_days: "",
        daysflag: true,
        fileflag: true,
        pro_code: "",
        pro_id: 0,
        pro_name: "",
        prowt_list: [],
        profz_list: [],
        proqt_list: [],
        prohz_list: [],
        oneflag: true,
        college: [],
        outside: [],
        teachers: []
      },
      form: {
        pro_id: 0,
        uid: 0,
        status: 0,
        js_username: "", 
        js_lxfs: "",
        balan_cost: "", // 
        balan_pers: "", // 
        balan_days: 0, // 
        balan_subcost: "",
        manage_scale: "",
        dining_file: "",
        house_file: "",
        contract_file: {},
        replay_con: "",
        teachers: [],
        outside: [],
        college: []
      },
      key: 1, 
      is_replay_con: false,
      headers: {},
      contract_file: {
        "1": [], // 辅助
        "2": [], // 委托
        "3": [], // 其他
        "4": [] // 合作
      },
      current_num: 0,
      current_code: "",
      current_index: 0,

      fileList1: [], // 就餐
      fileList2: [], // 住宿

      Query: {},
      
      isYXB: false,
      studentsList: [],
      checkList: [],
      checkAll: false,
      isIndeterminate: false
    };
  },
  computed: {
    ...mapState(["URL", "uploadExcelUrl1", "lookUrl", 'userInfo', 'versionTime_4'])
  },
  methods: {
    ...mapActions([
      "getFinanceAccountInfo",
      "getFinanceAccountCreateInfo",
      "addFinanceAccount",
      "updateFinanceAccount",
      "getCoursesForm1", 'getStudentsData'
    ]),
    initData() {
      this.loading2 = true;
      const route = this.$route;
      if (route.fullPath.indexOf("add") > 0) {
        this.key = 1;
        this.getFinanceAccountCreateInfo({
          data: {
            pro_id: route.params.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            Object.assign(this.createInfo, data.data.data);
            if (!this.createInfo.daysflag) {
              this.$set(this.form, "balan_days", this.createInfo.balan_days);
              Object.assign(this.form, {
                balan_days: this.createInfo.balan_days,
                manage_scale: this.createInfo.manage_scale || 0
              });
            }
            if (this.createInfo.college && this.createInfo.college.length) {
              this.$set(this.form, "college", this.createInfo.college);
            }
            if (this.createInfo.oneflag) {
              this.getProCourse(this.createInfo.pro_id);
            } else {
              this.loading2 = false;
            }
            if (this.isYXB) {
              this.getStudents(data.data.data.pro_id)
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.$router.go(-1);
                this.loading2 = false;
              }
            });
          }
        });
      } else {
        this.key = 0;
        this.getFinanceAccountInfo({
          id: route.params.id
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.status === 4) {
              this.is_replay_con = true;
            } else {
              this.is_replay_con = false;
            }
            Object.assign(this.createInfo, Data);
            Object.assign(this.form, Data);
            Object.assign(this.proData, Data);
            for (let key in this.form) {
              if (!this.$options.data().form.hasOwnProperty(key)) {
                delete this.form[key];
              }
            }
            if (this.createInfo.fileflag) {
              let list1 = Data.profz_list.map(item => {
                return {
                  contract_code: item.contract_code,
                  file_code: item.contract_code_file
                };
              });
              let list2 = Data.prowt_list.map(item => {
                return {
                  contract_code: item.contract_code,
                  file_code: item.contract_code_file
                };
              });
              let list3 = Data.proqt_list.map(item => {
                return {
                  contract_code: item.contract_code,
                  file_code: item.contract_code_file
                };
              });
              Object.assign(this.contract_file, {
                "1": list1,
                "2": list2,
                "3": list3
              });
            }
            if (this.form.dining_file) {
              this.fileList1 = [
                {
                  name: "就餐发票凭证",
                  code: this.form.dining_file
                }
              ];
            }
            if (this.form.house_file) {
              this.fileList2 = [
                {
                  name: "住宿发票凭证",
                  code: this.form.house_file
                }
              ];
            }
            if (this.isYXB) {
              let teachersid = Data.teachersid.map(item => item - 0) || []
              this.getStudents(Data.pro_id, teachersid)
            }
            this.loading2 = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      }
    },
    handleTrue(status) {
      const Obj = {};
      Object.assign(Obj, this.form);
      if (!Obj.balan_cost) {
        this.$message({
          type: "warning",
          message: "请输入本次结算金额！"
        });
        return false;
      }
      // if(!Obj.balan_pers){
      //     this.$message({
      //         type:'warning',
      //         message:'请输入本次结算人数！'
      //     });
      //     return false;
      // }
      if (this.createInfo.daysflag) {
        if (!Obj.balan_days) {
          this.$message({
            type: "warning",
            message: "请输入总培训天数！"
          });
          return false;
        }
      }
      if (!Obj.js_username) {
        this.$message({
          type: "warning",
          message: "请输入经手人姓名！"
        });
        return false;
      }
      if (!Obj.js_lxfs) {
        this.$message({
          type: "warning",
          message: "请输入手机号码！"
        });
        return false;
      } else {
        if (this.phonePublic(Obj.js_lxfs)) {
          this.$message({
            type: "warning",
            message: this.phonePublic(Obj.js_lxfs)
          });
          return false;
        }
      }
      if (this.createInfo.fzdwflag) {
        if (!(Obj.balan_subcost >= 0)) {
          this.$message({
            type: "warning",
            message: "请输入辅助单位本次分款金额！"
          });
          return false;
        }
      }
      if (this.createInfo.college && this.createInfo.college.length) {
        let empty = "";
        let f_list = Obj.college.filter(item => {
          if (!item.hz_subcost && !empty) {
            empty = item.yf_dwmc;
          }
          return item.hz_subcost;
        });
        if (f_list.length !== this.createInfo.college.length) {
          this.$message({
            type: "warning",
            message: `请输入合作学院【${empty}】本次分款金额！`
          });
          return false;
        }
      }
      // if(this.PXLX===6){
      // if(!Obj.manage_scale){
      //     this.$message({
      //         type:'warning',
      //         message:'请输入管理费比例调减！'
      //     });
      //     return false;
      // }
      // }
      if (this.createInfo.fileflag) {
        this.$set(Obj, "contract_file", this.contract_file);
      }
      if (this.is_replay_con) {
        if (!Obj.replay_con) {
          this.$message({
            type: "warning",
            message: "请输入本次修改说明！"
          });
          return false;
        }
      } else {
        delete Obj.replay_con;
      }

      const ID = this.$route.params.id;
      Object.assign(Obj, {
        pro_id: ID,
        uid: this.userInfo.uid,
        status: status
      });
      if (this.isYXB) {
        Object.assign(Obj, {
          teachersid: this.checkList
        })
      }
      if (this.createInfo.oneflag) {
        if (
          this.createInfo.profz_list.length !== Obj.contract_file["1"].length
        ) {
          this.$message({
            type: "warning",
            message: "请上传所有相关协议的附件！"
          });
          return false;
        }
        if (
          this.createInfo.prowt_list.length !== Obj.contract_file["2"].length
        ) {
          this.$message({
            type: "warning",
            message: "请上传所有相关协议的附件！"
          });
          return false;
        }
        if (
          this.createInfo.proqt_list.length !== Obj.contract_file["3"].length
        ) {
          this.$message({
            type: "warning",
            message: "请上传所有相关协议的附件！"
          });
          return false;
        }
        if (
          this.createInfo.prohz_list.length !== Obj.contract_file["4"].length
        ) {
          this.$message({
            type: "warning",
            message: "请上传所有相关协议的附件！"
          });
          return false;
        }

        Object.assign(Obj, {
          teachers: [],
          outside: []
        });
        let teachers = this.form.teachers.filter(item => {
          return item.teacher && item.idnumber && item.cou_name;
        });
        if (teachers.length) {
          let idnumberErr = teachers.some(item => {
            return item.idnumber.length !== 8;
          });
          if (idnumberErr) {
            this.$message({
              type: "warning",
              message: "请填写正确的职工号！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              teachers
            });
          }
        }
        let outside = this.form.outside.filter(item => {
          return item.teacher && item.idnumber && item.cou_name;
        });
        if (outside.length) {
          let idnumberErr = outside.some(item => {
            return item.idnumber.length !== 18;
          });
          if (idnumberErr) {
            this.$message({
              type: "warning",
              message: "请填写正确的身份证号！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              outside
            });
          }
        }
      } else {
        delete Obj.teachers;
        delete Obj.outside;
      }
      this.loading2 = true;
      if (this.key) {
        delete Obj.replay_con;
        this.addFinanceAccount({
          data: Obj
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
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      } else {
        delete Obj.pro_id;
        this.updateFinanceAccount({
          id: ID,
          data: Obj
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
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      }
    },
    beforePDFUpload(file) {
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
    beforePictureUpload(file) {
      const isTYPE =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.name.indexOf(".jpg") !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传文件只能是 jpg/ png/ gif 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    },
    handleSuccess1(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form, "dining_file", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove1(file, fileList) {
      this.$set(this.form, "dining_file", "");
      this.fileList1 = [];
    },
    handleSuccess2(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form, "house_file", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove2(file, fileList) {
      this.$set(this.form, "house_file", "");
      this.fileList2 = [];
    },
    handleGetIndex(val, num, index) {
      this.current_code = val.contract_code;
      this.current_num = num;
      this.current_index = index;
    },
    handleSuccess(response, file, fileList) {
      // 上传成功的回调
      // console.log('上传',this.current_num,this.current_code,response);
      if (response.code === 200) {
        // this.contract_file[this.current_num][this.current_index] = {
        //         contract_code:this.current_code,
        //         file_code:response.data.code,
        // };
        this.$set(this.contract_file[this.current_num], [this.current_index], {
          contract_code: this.current_code,
          file_code: response.data.code
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove(file, fileList) {
      if (file.response) {
        const code = file.response.data.code;
        if (!(this.is_replay_con && this.createInfo.oneflag)) {
          for (let key in this.contract_file) {
            let list = this.contract_file[key];
            let newList = list.filter(item => {
              return item.file_code !== code;
            });
            this.$set(this.contract_file, key, newList);
          }
        }
      }
    },
    handleYL(val) {
      window.open(this.lookUrl + "/" + val.file_code, "_blank");
    },
    getProCourse(id) {
      this.getCoursesForm1({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          const xiaonei = Data.list.xiaonei;
          const xiaowai = Data.list.xiaowai;
          let teachers = [];
          let outside = [];
          if (xiaonei.length) {
            teachers = xiaonei.map(item => {
              return {
                teacher: item.teacher,
                idnumber: item.idnumber,
                cou_name: item.cou_name
              };
            });
          } else {
            teachers.push({
              teacher: "",
              idnumber: "",
              cou_name: ""
            });
          }
          if (xiaowai.length) {
            outside = xiaowai.map(item => {
              return {
                teacher: item.teacher,
                idnumber: item.idnumber,
                cou_name: item.cou_name
              };
            });
          } else {
            outside.push({
              teacher: "",
              idnumber: "",
              cou_name: ""
            });
          }
          this.$set(
            this.form,
            "teachers",
            teachers.concat(this.$options.data().form.teachers)
          );
          this.$set(
            this.form,
            "outside",
            outside.concat(this.$options.data().form.outside)
          );
          this.loading2 = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleAddTeacher(type) {
      if (type === 1) {
        this.form.teachers.push({
          teacher: "",
          idnumber: "",
          cou_name: ""
        });
      } else if (type === 2) {
        this.form.outside.push({
          teacher: "",
          idnumber: "",
          cou_name: ""
        });
      }
    },
    handleDeleteTeacher(index, type) {
      if (type === 1) {
        this.form.teachers.splice(index, 1);
      } else if (type === 2) {
        this.form.outside.splice(index, 1);
      }
    },
    getStudents (ID, teachersid = []) {
      this.getStudentsData({
        data: {
          pro_id: ID,
          status: 2
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.studentsList = data.data.data.list || []
          this.checkList = teachersid
          this.handleCheckedChange(teachersid)
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      })
    },
    handleCheckAllChange (val) {
      this.checkList = val ? this.studentsList.map(item => item.id) : []
      this.isIndeterminate = false
      this.$set(this.form, 'balan_pers', this.checkList.length)
    },
    handleCheckedChange (value) {
      let checkedIds = value.sort((a, b) => a - b)
      let studentsIds = this.studentsList.map(item => item.id).sort((a, b) => a - b)
      this.checkAll = `${checkedIds}` === `${studentsIds}`
      this.isIndeterminate = checkedIds.length > 0 && !this.checkAll
      this.$set(this.form, 'balan_pers', checkedIds.length)
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    const route = this.$route;
    this.Query = route.query
    let finance_account_pro = sessionStorage.getItem("finance_account_pro");
    if (finance_account_pro) {
      this.proData = JSON.parse(finance_account_pro);
      this.PXLX = this.proData.pxlx;
      this.$set(this.form, "balan_days", this.proData.pxts);
      this.initData();
    } else {
      this.$router.go(-1);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("finance_account_pro");
  }
};
</script>

<style scoped>
.account-import-tip {
  font-size: 12px;
  color: #8492a6;
}
</style>
