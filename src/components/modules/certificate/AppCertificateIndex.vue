<template>
  <div
    class="app-certificate-index"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/certificate/index/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box">
          <el-form inline v-if="userInfo.role===1" @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.college" placeholder="请选择">
                <el-option label="-- 不限学院 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in collegeList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.structure" placeholder="请选择">
                <el-option label="-- 不限部门 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in structuresList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.is_sett" placeholder="请选择">
                <el-option label="-- 结算状态 --" :value="null"></el-option>
                <el-option label="未结算" value="1"></el-option>
                <el-option label="结算" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="经办人姓名" value="user_name"></el-option>
                <el-option label="经办人电话" value="user_tel"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
            <el-form-item v-if="userInfo.role==2">
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="经办人姓名" value="user_name"></el-option>
                <el-option label="经办人电话" value="user_tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="certificate-index-main" v-cloak>
        <el-table
          :data="tableData"
          :default-expand-all="true"
          style="width: 100%;margin-top: 0px"
          :header-cell-style="{backgroundColor:'#fafafa'}"
        >
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <ul>
                <li v-for="(item,index) in props.row.history" :key="index">
                  <template v-if="item.his_type===1">
                    <span class="danger">未通过原因【{{ item.create_time | TimestampChangeFilter }}】：</span>
                    {{ item.content }}
                  </template>
                  <template v-else>
                    <span class="success">修改回复【{{ item.create_time | TimestampChangeFilter }}】：</span>
                    {{ item.content }}
                  </template>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目名称" min-width="220">
            <template slot-scope="scope">
              <div>{{ scope.row.pro_name }}</div>
              <div
                v-if="scope.row.cert_name&&(scope.row.cert_name!==scope.row.pro_name)"
                style="color: #008000"
              >（{{ scope.row.cert_name }}）</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目编号" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.pro_code">{{ scope.row.pro_code }}</span>
              <span v-else style="color: #ff0000">未分配</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主办学院">
            <template slot-scope="scope">
              <div>{{ scope.row.college }}</div>
              <div
                v-if="scope.row.structure"
                style="color: #5E7E9F;line-height: 20px"
              >{{ scope.row.structure }}</div>
              <div style="color: #199f93;line-height: 20px">{{ scope.row.realname }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="举办时间" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column label="证书基本信息" min-width="152">
            <template slot-scope="scope">
              <div>
                申领类型：
                <span v-if="scope.row.is_lock" :style="`color: ${scope.row.types === 2 ? '#44acb6' : ''}`">
                  {{ scope.row.types === 2 ? '电子版证书' : '纸质版证书' }}
                </span>
              </div>
              <div>经办人： {{ scope.row.user_name }}</div>
              <div>联系方式： {{ scope.row.user_tel}}</div>
              <div>人数： {{ scope.row.stu_num}} 人</div>
              <div>
                申领状态：
                <template v-if="scope.row.is_lock===1">
                  <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
                  <span v-else-if="scope.row.status===2" style="color: #f56c6c">不通过</span>
                  <span v-else-if="scope.row.status===3" style="color: #67c23a">通过</span>
                </template>
                <span v-else-if="scope.row.is_lock===2" style="color: #008000">已锁定</span>
                <span v-else style="color: #909399">未申领</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="140">
            <template slot-scope="scope">
              <!-- 审核状态:1待审核 2审核不通过 3审核通过 -->
              <!--锁定证书申领:1否 2锁定-->
              <template v-if="userInfo.role===1">
                <template v-if="scope.row.status===1">
                  <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">审核</el-button>
                  <!--<el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>-->
                </template>
                <template v-if="scope.row.status===2">
                  <el-button type="text" @click.native="handleInfo(scope.row.id)" size="mini">申领详情</el-button>
                  <!--<el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>-->
                  <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">重新审核</el-button>
                </template>
                <template v-if="scope.row.status===3">
                  <el-button type="text" @click.native="handleInfo(scope.row.id)" size="mini">申领详情</el-button>
                  <template v-if="scope.row.is_lock===1">
                    <el-button v-if="scope.row.zip" type="text" @click.native="handleDownloadPDF(scope.row.zip)" size="mini">导出PDF版证书</el-button>
                    <el-button v-if="scope.row.types !== 2" type="text" size="mini" @click.native="handleWord(scope.row)">选择word格式并导出</el-button>
                    <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">重新审核</el-button>
                    <el-button
                      type="text"
                      @click.native="handleLock(scope.row.id,2)"
                      size="mini"
                    >锁定申领</el-button>
                  </template>
                  <template v-if="scope.row.is_lock===2">
                    <el-button
                      type="text"
                      @click.native="handleLock(scope.row.id,1)"
                      size="mini"
                    >解除锁定</el-button>
                    <el-button
                      type="text"
                      @click.native="handleLockCer(scope.row)"
                      size="mini"
                    >查看证书编号</el-button>
                  </template>
                  <!--<el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>-->
                  <el-button
                    type="text"
                    v-if="scope.row.mod_apply&&scope.row.mod_apply.length"
                    style="color: #e6a23c"
                    @click.native="handleApplyList(scope.row,1)"
                    size="mini"
                  >申请修改审核</el-button>
                  <template v-else>
                    <div v-if="scope.row.mod_list">
                      <el-button
                        type="text"
                        @click.native="handleApplyList(scope.row,1)"
                        size="mini"
                      >证书申请修改记录</el-button>
                    </div>
                  </template>
                </template>
              </template>
              <template v-if="userInfo.role===2">
                <template v-if="(!scope.row.is_lock) && scope.row.stu_num">
                  <template v-if="isYXB">
                    <template v-if="scope.row.is_evaluated && scope.row.is_evaluate && scope.row.is_evaluate_pinggulv">
                      <el-button type="text" @click.native="handleAdd(scope.row)" size="mini">新增证书申领</el-button>
                    </template>
                    <template v-else>
                      <span v-if="!scope.row.is_evaluate_pinggulv">未评估（或未达到指定评估率），不能申领证书</span>
                      <span v-else-if="!scope.row.is_evaluate">指定的课程未评估（或未达到指定评估率），不能申领证书</span>
                    </template>
                  </template>
                  <template v-else>
                    <el-button type="text" @click.native="handleAdd(scope.row)" size="mini">新增证书申领</el-button>
                  </template>
                </template>
                <template v-if="scope.row.is_lock===1">
                  <el-button type="text" @click.native="handleInfo(scope.row.id)" size="mini">申领详情</el-button>
                  <template v-if="scope.row.status===2">
                    <el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>
                  </template>
                  <template v-if="scope.row.status===3">
                    <template v-if="is_ss&&auth_cert">
                      <el-button v-if="scope.row.types !== 2" type="text" size="mini" @click.native="handleWord(scope.row)">选择word格式并导出</el-button>
                    </template>
                    <div v-if="scope.row.mod_list">
                      <el-button
                        type="text"
                        @click.native="handleApplyList(scope.row)"
                        size="mini"
                      >证书申请修改记录</el-button>
                    </div>
                  </template>
                </template>
                <template v-if="scope.row.is_lock===2">
                  <template v-if="scope.row.status===3">
                    <el-button type="text" @click.native="handleInfo(scope.row.id)" size="mini">申领详情</el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.mod_apply&&!scope.row.mod_apply.length"
                      @click.native="handleApply(scope.row)"
                      size="mini"
                    >申请修改</el-button>
                    <el-button
                      v-else
                      type="text"
                      style="color: #e6a23c"
                      @click.native="handleApplyPrint(scope.row)"
                      size="mini"
                    >申请修改打印</el-button>
                    <div v-if="scope.row.mod_list">
                      <el-button
                        type="text"
                        @click.native="handleApplyList(scope.row)"
                        size="mini"
                      >证书申请修改记录</el-button>
                    </div>
                    <template v-if="is_ss&&auth_cert">
                      <!--<el-button type="text" @click.native="handleLock(scope.row.id,1)" size="mini">解除锁定</el-button>-->
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="5"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--弹窗1（新增和编辑）-->
    <el-dialog
      center
      title="证书申领信息"
      :visible.sync="dialogVisible1"
      width="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" label-width="160px" style="text-align: left">
        <el-form-item label="项目证书名称：">
          <el-row>
            <el-col :xs="24" :sm="20">
              <div class="grid-content bg-purple">
                <el-input v-model="form.cert_name" placeholder="请输入打印证书时显示的项目名称"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="!isYXB && skfsUpline" label="申领类型：" :rules="[{required: true}]">
          <div class="danger" style="font-size:12px;">
            （只能选择一种申领类型进行证书申请）
          </div>
          <el-radio-group v-model="form.types" @change="changeTypes">
            <el-radio :label="1">纸质版证书</el-radio>
            <el-radio :label="2">电子版证书</el-radio>
          </el-radio-group>
          <span v-if="form.types === 2" class="danger" style="font-size: 12px;">
            （电子版证书均为无照片证书）
          </span>
        </el-form-item>
        <el-form-item label="课程时间：" :rules="[{required: true}]">
          <el-row>
            <el-col :xs="24" :sm="20">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="课程开始时间"
                  v-model="form.cert_start_time"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">
                <div style="text-align: center">-</div>
              </el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="课程结束时间"
                  v-model="form.cert_end_time"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-col>
          </el-row>
        </el-form-item>
        <template v-if="form.types === 1">
          <template v-if="!isYXB">
            <el-form-item label="证书类别：" :rules="[{required: true}]">
              <el-radio-group v-model="form.is_bilingual">
                <el-radio :label="1">中文版</el-radio>
                <el-radio :label="2">英文版</el-radio>
                <el-radio :label="3">中英文版</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.is_bilingual!==1" label="英文名称：" :rules="[{required: true}]">
              <el-row>
                <el-col :xs="24" :sm="20">
                  <div class="grid-content bg-purple">
                    <el-input v-model="form.cert_name_en" placeholder="请输入英文名称"></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="是否粘贴照片：" :rules="[{required: true}]">
              <el-radio-group v-model="form.is_photo">
                <el-radio :label="1">否</el-radio>
                <el-radio :label="2" :disabled="form.is_bilingual===2?true:false">是</el-radio>
              </el-radio-group>
              <span
                v-if="form.is_bilingual === 3 &&form.is_photo ===2"
                style="color: #409EFF"
              >（* 其中英文版证书为无照片格式）</span>
            </el-form-item>
          </template>
          <el-form-item label="是否全员领取证书：" :rules="[{required: true}]">
            <el-radio-group v-model="form.is_all" @change="changeAll">
              <el-radio :label="1">否</el-radio>
              <el-radio :label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item v-if="form.is_all===1" label="申领证书名单：" :rules="[{required: true}]">
          <template v-if="form.types === 2">
            <div class="danger" style="font-size:12px;">
              （未填写身份证号的学员不能申请电子版证书）
            </div>
            <el-checkbox-group v-model="form.students" @change="handleCheckedChange">
              <el-checkbox v-for="item in studentsList" :key="item.id"
                :label="JSON.stringify(item)" :disabled="!item.idcard"
                style="margin-left: 0; margin-right: 16px"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else>
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="form.students" @change="handleCheckedChange">
              <el-checkbox
                v-for="item in studentsList"
                :label="JSON.stringify(item)"
                :key="item.id"
                style="margin-left: 0;margin-right: 16px"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="经办人姓名：" :rules="[{required: true}]">
          <el-row>
            <el-col :xs="24" :sm="14">
              <div class="grid-content bg-purple">
                <el-input v-model="form.user_name" placeholder="请输入经办人姓名"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系方式：" :rules="[{required: true}]">
          <el-row>
            <el-col :xs="24" :sm="14">
              <div class="grid-content bg-purple">
                <el-input v-model="form.user_tel" placeholder="请输入联系方式"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注：">
          <el-row>
            <el-col :xs="24" :sm="14">
              <div class="grid-content bg-purple">
                <el-input type="textarea" v-model="form.note"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="status===2" label="修改说明：" :rules="[{required: true}]">
          <el-row>
            <el-col :xs="24" :sm="20">
              <div class="grid-content bg-purple">
                <el-input type="textarea" v-model="content"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="position: relative">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <template v-if="form.status===2">
          <el-button type="primary" @click="handleTrue">提 交</el-button>
        </template>
        <el-button v-else type="primary" @click="handleTrue">确 定</el-button>
        <div class="dialog-footer-show" :class="{'dialog-footer-none':dialogShow}"></div>
      </div>
    </el-dialog>
    <!--弹窗1（审核）-->
    <el-dialog
      center
      title="审核证书申领信息"
      :visible.sync="dialogVisible2"
      width="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-cloak>
        <el-form
          label-width="180px"
          style="text-align: left;margin-bottom: 20px"
          class="certificate-check-form"
          v-cloak
        >
          <el-form-item label="项目名称：">
            <span>{{ showData.pro_name }}</span>
          </el-form-item>
          <el-form-item label="项目证书名称：">
            <span style="color: #008000">{{ showData.cert_name }}</span>
          </el-form-item>
          <el-form-item v-if="!isYXB && showData.skfs == 2" label="申领类型：">
            {{ showData.types === 2 ? '电子版证书' : '纸质版证书' }}
          </el-form-item>
          <el-form-item label="课程时间：" >
            {{ showData.cert_start_time | TimestampChangeFilter }} 至 {{ showData.cert_end_time | TimestampChangeFilter }}
          </el-form-item>
          <template v-if="showData.types !== 2">
            <template v-if="!isYXB">
              <el-form-item label="证书类别：">
                <span v-if="showData.is_bilingual===1">中文版</span>
                <span v-if="showData.is_bilingual===2">英文版</span>
                <span v-if="showData.is_bilingual===3">中英文版</span>
              </el-form-item>
              <el-form-item label="英文名称：">
                <span style="color: #008000">{{ showData.cert_name_en?showData.cert_name_en:'无'}}</span>
              </el-form-item>
              <el-form-item label="是否粘贴照片：">
                <span>{{ showData.is_photo===1?'否':'是'}}</span>
              </el-form-item>
              <el-form-item label="证书类型：">
                <span>{{ showData.cert_type===1?'普通':'高级'}}</span>
              </el-form-item>
            </template>
            <el-form-item label="是否全员领取证书：">
              <span>{{ showData.is_all===1?'否':'是'}}</span>
            </el-form-item>
          </template>
          <el-form-item :label="`申领证书名单（${showData.students ? showData.students.length || 0 : 0}人）：`">
            <div style="padding-top: 10px;line-height: 24px">
              <span
                v-for="(item, index) in showData.students"
                :key="index"
                class="student-name"
              >{{ item.stu_name }}</span>
              <!-- <div v-if="showData.students">【共 <span style="color: #008000">{{ showData.students.length}}</span>名】</div> -->
            </div>
          </el-form-item>
          <el-form-item label="经办人姓名：">
            <span>{{ showData.user_name }}</span>
          </el-form-item>
          <el-form-item label="联系方式：">
            <span>{{ showData.user_tel}}</span>
          </el-form-item>
          <el-form-item label="备注：">
            <span>{{ showData.note?showData.note:'无'}}</span>
          </el-form-item>
        </el-form>
        <el-form :model="checkForm" label-width="180px" style="text-align: left">
          <el-form-item label="审核结果：" :rules="[{required: true}]">
            <el-radio-group v-model="checkForm.status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="checkForm.status===2" label="不通过原因：" :rules="[{required: true}]">
            <el-row>
              <el-col :xs="24" :sm="20">
                <div class="grid-content bg-purple">
                  <el-input type="textarea" v-model="checkForm.content"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!--弹窗（打印格式）-->
    <el-dialog
      center
      title="选择Word版本确认后导出全部学员证书"
      :visible.sync="dialogVisible3"
      width="500px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-cloak>
        <div v-if="!is_ss&&!auth_cert" style="margin-bottom: 30px;text-align: center">
          <el-radio v-model="is_new" :label="1">新版</el-radio>
          <el-radio v-model="is_new" :label="0">旧版</el-radio>
        </div>
        <template v-if="is_new">
          <div v-if="!(is_picture===2&&language===2&&is_language ===3)" style="margin-bottom: 20px">
            <el-radio-group :key="1" v-model="is_picture" size="small">
              <el-radio :key="111" :label="1" border :disabled="is_picture===1?false:true">无照片</el-radio>
              <el-radio :key="112" :label="2" border :disabled="is_picture===2?false:true">有照片</el-radio>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 20px">
            <el-radio-group :key="2" v-model="language" size="small">
              <template v-if="is_language===1">
                <el-radio :key="211" :label="1" border>中文证书</el-radio>
                <el-radio :key="212" :label="2" border :disabled="true">EN 证书</el-radio>
              </template>
              <template v-if="is_language===2">
                <el-radio :key="221" :label="1" border :disabled="true">中文证书</el-radio>
                <el-radio :key="222" :label="2" border>EN 证书</el-radio>
              </template>
              <template v-if="is_language===3">
                <el-radio :key="231" :label="1" border>中文证书</el-radio>
                <el-radio :key="232" :label="2" border>EN 证书</el-radio>
              </template>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group :key="3" v-model="wordType" size="small">
              <template v-if="is_ss">
                <!--<el-radio :key="311" v-if="language===2&&is_picture===1" :label="2" border>B5 版</el-radio>-->
                <!--<el-radio :key="312" v-if="language===1" :label="3" border>B5 暑期版</el-radio>-->
                <!--<el-radio :key="311" v-if="!(is_picture===2&&language===2)" :label="2" border>B5 版</el-radio>-->
                <template v-if="is_picture===2&&language===2&&is_language === 3">
                  <el-radio :key="322" :label="2" border>B5 版（无照片）</el-radio>
                </template>
                <template v-else>
                  <el-radio :key="322" :label="2" border>B5 版</el-radio>
                </template>
              </template>
              <template v-else>
                <template v-if="is_picture===2&&language===2&&is_language === 3">
                  <el-radio :key="321" :label="1" border disabled>A4 版</el-radio>
                  <el-radio :key="322" :label="2" border>B5 版（无照片）</el-radio>
                  <el-radio :key="323" :label="3" border disabled>B5 暑期版</el-radio>
                </template>
                <template v-else>
                  <el-radio :key="321" :label="1" border :disabled="language===2?true:false">A4 版</el-radio>
                  <el-radio
                    :key="322"
                    :label="2"
                    border
                    :disabled="is_picture===2&&language===2?true:false"
                  >B5 版</el-radio>
                  <el-radio :key="323" :label="3" border :disabled="language===2?true:false">B5 暑期版</el-radio>
                </template>
              </template>
            </el-radio-group>
          </div>
        </template>
        <template v-else>
          <div style="margin-bottom: 20px">
            <el-radio-group :key="1" v-model="is_picture" size="small">
              <el-radio :key="111" :label="1" border :disabled="is_picture===1?false:true">无照片</el-radio>
              <el-radio :key="112" :label="2" border :disabled="is_picture===2?false:true">有照片</el-radio>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 20px">
            <el-radio-group :key="2" v-model="language" size="small">
              <template v-if="is_language===1">
                <el-radio :key="211" :label="1" border>中文证书</el-radio>
                <el-radio :key="212" :label="2" border :disabled="true">EN 证书</el-radio>
              </template>
              <template v-if="is_language===2">
                <el-radio :key="221" :label="1" border :disabled="true">中文证书</el-radio>
                <el-radio :key="222" :label="2" border>EN 证书</el-radio>
              </template>
              <template v-if="is_language===3">
                <el-radio :key="231" :label="1" border>中文证书</el-radio>
                <el-radio :key="232" :label="2" border>EN 证书</el-radio>
              </template>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group :key="3" v-model="wordType" size="small">
              <template v-if="is_ss">
                <el-radio :key="311" v-if="language===2&&is_picture===1" :label="2" border>B5 版</el-radio>
              </template>
              <template v-else>
                <el-radio
                  :key="322"
                  v-if="(language===2&&is_picture===1)||language===1"
                  :label="2"
                  border
                >B5 版</el-radio>
              </template>
            </el-radio-group>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible3 = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="handlePrint"
          :disabled="!(is_picture&&language&&wordType)"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--查看证书编号-->
    <el-dialog
      center
      :title="cerInfoData.cert_name"
      :visible.sync="dialogVisibleCer"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-cloak>
        <div style="margin-bottom: 10px;">
          项目编号：<strong>{{ cerInfoData.pro_code }}</strong>，
          共 <strong style="color: #67c23a">{{ cerInfoData.students.length || 0 }}</strong> 名学员领取证书。
        </div>
        <el-table
          height="500"
          border
          size="mini"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          :data="cerInfoData.students"
          style="width: 100%"
        >
          <el-table-column align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" prop="stu_name" label="学员姓名"></el-table-column>
          <el-table-column align="center" prop="cert_code" label="证书编号"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { MATE } from '@/assets/js/config.special.js'
export default {
  name: "app-certificate-index",
  data() {
    return {
      loading2: false,
      headers: {},
      tableData: [],
      total: 0,
      getForm: {
        page: 1,
        limit: 20,
        college: null,
        structure: null,
        sea_field: "pro_code",
        keywords: "",
        is_sett: null
      },
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      collegeList: [],
      structuresList: [],
      dialogVisible1: false,
      key: 1, // 1新增      0编辑
      form: {
        uid: 0,
        pro_id: 0,
        cert_name: "", // 项目修改的名称
        cert_type: 1, // 证书类型（1普通 2高级）默认只是普通类型
        cert_start_time: null, // 课程开始时间
        cert_end_time: null,
        is_bilingual: 1, //1中文 2英文版 3中英文版
        cert_name_en: "",
        // is_photo: 1,
        is_photo: (sessionStorage.getItem('CK-T') || sessionStorage.getItem('CK')) === '2' ? 2 : 1, //是否粘贴照片（1否 2是）
        is_all: 2, // 是否全部学员领取证书（1否 2是）
        user_name: "", // 经办人
        user_tel: "",
        note: "", //备注
        students: [],
        types: 1 // 1纸质版、2电子版
      },
      studentsList: [],
      checkAll: false,
      id: 0, // 证书申领标识id
      checkForm: {
        id: 0,
        uid: 0,
        status: 3,
        content: ""
      },
      dialogVisible2: false,
      showData: {},
      dialogVisible3: false,
      /****************/
      is_picture: 0,
      is_language: 0, // 1中文证书 2英文证书 3中英文证书
      language: 1, // 1中文、2英文
      wordType: 2,
      wordId: 0,
      /****************/
      status: 0,
      content: "",
      dialogShow: true,
      dialogVisibleCer: false,
      cerInfoData: {
        students: []
      },
      //深圳研究院和国际学院（苏州研究院）工作人员自己可以在系统上查看立项通知书并打印（管理员审核通过）
      is_ss: false, // 苏州深圳
      is_ss_auth: false, // 苏州深圳的学院权限
      auth_cert: false, // 证书权限
      //    打印新版/旧版（默认新版）
      is_new: 1,
      
      isYXB: false,
      skfsUpline: false // 授课方式：线上授课
    };
  },
  computed: {
    ...mapState(["URL", "certificateExorpUrl", "certificateExorpOldUrl", 'userInfo'])
  },
  methods: {
    ...mapActions([
      "getCertificatesData",
      "getCertificatesId",
      "getStructures",
      "addCertificates",
      "updateCertificates",
      "certificatesCheck",
      "getStudentsData",
      "certificatesLock",
      "certificatesSubmit"
    ]),
    initData() {
      this.loading2 = true;
      if (this.loading2) {
        this.getCertificatesData({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
          this.loading2 = false;
        });
      }
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      // 搜索事件
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
      }
    },
    handleAdd(val) {
      this.skfsUpline = val.skfs == 2
      this.key = 1;
      this.dialogShow = true;
      this.getStudents(val.pro_id);
      Object.assign(this.form, this.$options.data().form, {
        pro_id: val.pro_id,
        uid: this.userInfo.uid,
        cert_name: val.pro_name,
        cert_start_time: val.px_start_time * 1000,
        cert_end_time: val.px_end_time * 1000,
        types: 1
      });
      for (let key in this.form) {
        if (!this.$options.data().form.hasOwnProperty(key)) {
          delete this.form[key];
        }
      }
      this.dialogVisible1 = true;
    },
    handleCheckAllChange(val) {
      let allList = this.studentsList.map(item => {
        return JSON.stringify(item);
      });
      let list = val ? allList : [];
      Object.assign(this.form, {
        students: list
      });
    },
    handleEdit(val) {
      if (val.status === 2) {
        this.status = 2;
      }
      this.key = 0;
      this.dialogShow = true;
      this.id = val.id;
      this.getStudents(val.pro_id);
      //获取证书申领信息
      if (val.id) {
        this.getCertificatesId({
          id: val.id
        }).then(data => {
          if (data.data.code === 200) {
            let list = data.data.data.students.map(item => {
              let O_val = {
                id: item["stu_id"],
                name: item["stu_name"]
                // cert_num:item["cert_code"]
              };
              return JSON.stringify(O_val);
            });
            Object.assign(this.form, data.data.data, {
              cert_start_time: data.data.data.cert_start_time * 1000,
              cert_end_time: data.data.data.cert_end_time * 1000,
              students: list
            });
            this.dialogVisible1 = true;
          }
        });
      }
    },
    handleTrue() {
      let obj = JSON.parse(JSON.stringify(this.form));
      let endList = obj.students.map(item => {
        let end = item.indexOf(',"name"');
        return item.substring(0, end) + "}";
      });
      Object.assign(obj, {
        students: endList
      });
      if (!obj.cert_start_time || !obj.cert_end_time) {
        this.$message({
          type: "warning",
          message: "请完善课程时间！"
        });
        return false;
      }
      if (obj.types === 1) {
        if (obj.is_bilingual !== 1) {
          if (!obj.cert_name_en) {
            this.$message({
              type: "warning",
              message: "请输入英文名称！"
            });
            return false;
          }
        }
      }
      if (!obj.user_name) {
        this.$message({
          type: "warning",
          message: "请输入经手人姓名！"
        });
        return false;
      }
      if (!obj.user_tel) {
        this.$message({
          type: "warning",
          message: "请输入联系方式！"
        });
        return false;
      }
      if (obj.is_all === 1) {
        if (!obj.students.length) {
          this.$message({
            type: "warning",
            message: "请选择申领证书名单！"
          });
          return false;
        } else {
          let list = obj.students.map(item => {
            return JSON.parse(item);
          });
          Object.assign(obj, {
            students: list
          });
        }
      } else if (obj.is_all === 2) {
        delete obj.students;
      }
      if (this.status === 2) {
        if (!this.content) {
          this.$message({
            type: "warning",
            message: "请输入修改说明！"
          });
          return false;
        }
        Object.assign(obj, {
          update_note: this.content
        });
      }
      Object.assign(obj, {
        cert_start_time: obj.cert_start_time ? new Date(obj.cert_start_time).getTime() / 1000 : 0,
        cert_end_time: obj.cert_end_time ? new Date(obj.cert_end_time).getTime() / 1000 : 0,
        is_bilingual: obj.types === 1 ? 1 : obj.is_bilingual,
        cert_name_en: obj.type === 1 ? '' : obj.cert_name_en,
        is_photo: obj.type === 1 ? 1 : obj.is_photo
      });
      this.dialogShow = false;
      if (this.key === 1) {
        // 新增
        this.addCertificates({
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible1 = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogShow = true;
              }
            });
          }
        });
      } else {
        // 编辑
        this.updateCertificates({
          id: this.id,
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible1 = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogShow = true;
              }
            });
          }
        });
      }
    },
    handleInfo(id) {
      // 获取证书申领信息
      this.$router.push("/home/certificate/index/info/" + id);
    },
    handleCheck(val) {
      Object.assign(this.checkForm, this.$options.data().checkForm);
      this.$set(this.checkForm, "id", val.id);
      this.$set(this.checkForm, "uid", this.userInfo.uid);
      //获取证书申领信息
      if (val.id) {
        this.getCertificatesId({
          id: val.id
        }).then(data => {
          if (data.data.code === 200) {
            this.showData = data.data.data;
            this.dialogVisible2 = true;
          }
        });
      }
    },
    handleCheckTrue() {
      if (this.checkForm.status === 2) {
        if (!this.checkForm.content) {
          this.$message({
            type: "warning",
            message: "审核不通过原因不能为空！"
          });
          return false;
        }
      }
      this.certificatesCheck({
        data: this.checkForm
      }).then(data => {
        if (data.data.code === 200) {
          this.initData();
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.dialogVisible2 = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleLock(id, lock) {
      this.certificatesLock({
        data: {
          id: id,
          is_lock: lock
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleLockCer(val) {
      // 查看证书
      this.getCertificatesId({
        id: val.id
      }).then(data => {
        if (data.data.code === 200) {
          this.cerInfoData = data.data.data;
          this.dialogVisibleCer = true;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error + " 请稍后再试"
          });
        }
      });
    },
    handleWord(val) {
      this.is_new = 1;
      this.is_picture = val.is_photo; // 1无照片、2有照片
      this.is_language = val.is_bilingual; //1中文证书 、2英文证书、 3中英文证书
      this.language = val.is_bilingual === 2 ? 2 : 1;
      this.wordType = 2;
      if (this.is_ss) {
        this.wordType = this.language == 1 ? 2 : 2;
      }
      this.dialogVisible3 = true;
      this.wordId = val.id;
    },
    handlePrint() {
      let type = "";
      const img = this.is_picture; // 1、无照片  2、有照片
      const en = this.language; // 1、中文  2、英文
      const ab = this.wordType; // 1、A4  2、B5  3、B5暑期
      if (img === 1 && en === 1 && ab === 1) {
        type = "n_a4";
      } else if (img === 1 && en === 1 && ab === 2) {
        type = "n_b5";
      } else if (img === 2 && en === 1 && ab === 1) {
        type = "img_a4";
      } else if (img === 1 && en === 1 && ab === 3) {
        type = "holi_b5";
      } else if (img === 1 && en === 2 && ab === 2) {
        type = "n_b5en";
      } else if (img === 2 && en === 1 && ab === 2) {
        type = "img_b5";
      } else if (img === 2 && en === 1 && ab === 3) {
        type = "img_holi_b5";
      } else if (img === 2 && en === 2 && ab === 2) {
        type = "n_b5en";
      }
      const hre =
        this.URL +
        (this.is_new ? this.certificateExorpUrl : this.certificateExorpOldUrl) +
        "?cert_id=" +
        this.wordId +
        "&type=" +
        type +
        "&authkey=" +
        this.headers.authkey +
        "&sessionid=" +
        this.headers.sessionid +
        "&tp=1";
      window.open(hre);
      this.dialogVisible3 = false;
    },
    handleApply(val) {
      this.$router.push("/home/certificate/index/apply");
      sessionStorage.setItem("APPLY", JSON.stringify(val));
    },
    handleApplyList(val, role) {
      if (role === 1) {
        if (val.mod_apply.length) {
          sessionStorage.setItem("CheckStatus", true);
        }
      }
      this.$router.push({
        path: "/home/certificate/index/apply_list/" + val.id,
        query: {
          types: val.types
        }
      });
      sessionStorage.setItem("apply_pro", val.pro_name);
      sessionStorage.setItem("apply_pro_info", JSON.stringify(val));
    },
    handleApplyPrint(val) {
      // 申请修改打印
      const Data = val.mod_apply.filter(item => {
        return item.status === 1;
      });
      if (Data.length === 1) {
        sessionStorage.setItem("certApplyPrint", JSON.stringify(Data[0]));
        sessionStorage.setItem("apply_pro_info", JSON.stringify(val));
        this.$router.push("/home/certificate/index/apply/print");
      } else {
        this.$notify.error({
          title: "提示",
          message: "请前往证书申请修改记录列表中打印！"
        });
      }
    },
    getStudents(id) {
      this.getStudentsData({
        data: {
          pro_id: id,
          status: 2
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.studentsList = data.data.data.list.map(item => {
            return {
              id: item.id,
              name: item.name,
              idcard: item.idcard || ''
              // cert_num:item.cert_num
            };
          });
        }
      });
    },
    handleSizeChange(pageSize) {
      // pageSize 改变时会触发
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      //  currentPage 改变时会触发
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    // 导出PDF版证书
    handleDownloadPDF (params) {
      window.open(`${this.URL}${params}`)
    },
    changeTypes (val) {
      if (val === 1) {
        this.$set(this.form, 'is_all', 2)
      } else {
        this.$set(this.form, 'is_all', 1)
      }
      this.checkAll = false
      this.$set(this.form, 'students', [])
    },
    handleCheckedChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.studentsList.length;
    },
    changeAll (val) { // 是否全员领取证书：1否、2是
      this.checkAll = false
      this.$set(this.form, 'students', [])
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    if (this.userInfo.role === 2 && this.userInfo.college) {
      if (MATE('certificate_download', this.userInfo.college)) {
        this.is_ss = true;
        if (this.userInfo.auth_college) {
          this.is_ss_auth = true;
        }
        if (this.userInfo.auth_cert) {
          this.auth_cert = true;
        }
      }
    }
    if (this.$cookie.get("headers")) {
      this.headers = JSON.parse(this.$cookie.get("headers"));
    }
    this.initData();
    this.getStructures({
      data: {}
    }).then(data => {
      if (data.data.code === 200) {
        data.data.data.forEach(item => {
          if (item.level === 1) {
            this.collegeList.push(item);
          } else if (item.level === 2) {
            this.structuresList.push(item);
          }
        });
      }
    });
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  },
  watch: {
    language() {
      //is_picture;    // 1、无照片  2、有照片
      // language    1、2
      //wordType;    // 1、A4  2、B5  3、B5暑期
      if (this.is_ss) {
        if (this.language === 1) {
          if (this.is_new) {
            this.wordType = 2;
          } else {
            this.wordType = 0;
          }
        } else if (this.language === 2) {
          if (this.is_picture === 1) {
            this.wordType = 2;
          } else if (this.is_picture === 2) {
            this.wordType = 0;
          }
        }
      } else {
        if (this.language === 1) {
          this.wordType = 2;
        } else if (this.language === 2) {
          if (this.is_picture === 1) {
            this.wordType = 2;
          } else if (this.is_picture === 2) {
            this.wordType = 0;
          }
        }
      }
    },
    dialogVisible1() {
      if (!this.dialogVisible1) {
        this.status = 0;
      }
    },
    "getForm.college"() {
      this.handleSelect();
    },
    "getForm.structure"() {
      this.handleSelect();
    },
    "getForm.is_sett"() {
      this.handleSelect();
    },
    "form.is_bilingual"() {
      if (this.dialogVisible1) {
        this.$set(this.form, "is_photo", 1);
      }
    },
    is_new() {
      this.wordType = null;
    }
  }
};
</script>

<style scoped>
.show-data-check {
  margin-bottom: 20px;
}
.show-data-check li {
  line-height: 30px;
  border-bottom: 1px solid #8492a6;
  background-color: #fafafa;
}
li strong {
  display: inline-block;
  width: 140px;
}
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
.student-name {
  padding-right: 6px;
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
</style>
