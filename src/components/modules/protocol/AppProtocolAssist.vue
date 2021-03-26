<template>
  <div
    class="app-protocol-assist"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <template v-if="switcher===1">
              <el-button v-if="isYXB" @click="$router.push('/home/protocol/assist/list/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
              <el-button type="primary" @click.native="handleAll" icon="el-icon-menu">全部</el-button>
              <el-button
                v-if="userInfo.role===2"
                @click.native="handleSwitcher(2)"
                type
                icon="el-icon-delete"
              >回收站</el-button>
            </template>
            <template v-else>
              <el-button
                @click.native="handleSwitcher(1)"
                type="primary"
                icon="el-icon-d-arrow-left"
              >返 回</el-button>
            </template>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline v-if="userInfo.role===1" @submit.native.prevent>
            <el-form-item>
              <el-select
                v-model="getForm.college"
                placeholder="请选择"
                @change="handleSelect"
              >
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
              <el-select
                v-model="getForm.structure"
                placeholder="请选择"
                @change="handleSelect"
              >
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
              <el-select
                v-model="getForm.province"
                placeholder="请选择"
                :disabled="false"
              >
                <el-option label="-- 不限省份 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in provincesList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.city"
                placeholder="请选择"
                :disabled="false"
                @change="handleSelect"
              >
                <el-option label="-- 不限城市 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in cityList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="协议编号" value="contract_code"></el-option>
                <el-option label="辅助单位名称" value="dwmc"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
            <el-form-item v-if="userInfo.role===2">
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="协议编号" value="contract_code"></el-option>
                <el-option label="辅助单位名称" value="dwmc"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
                key="1"
              >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="protocol-table-main" v-cloak>
        <el-table
          :data="tableData"
          :default-expand-all="true"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%;margin-top: 0px"
        >
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <ul>
                <li v-for="(item,index) in props.row.history" :key="index">
                  <template v-if="item.his_type===1">
                    <span class="danger">未通过原因【{{ item.create_time | TimestampChangeFilter }}】：</span>
                    {{ item.content }}
                  </template>
                  <template v-else-if="item.his_type===2">
                    <span class="success">修改回复【{{ item.create_time | TimestampChangeFilter }}】：</span>
                    {{ item.content }}
                  </template>
                  <template v-else-if="item.his_type===3">
                    <span class="warning">撤回原因【{{ item.create_time | TimestampChangeFilter }}】：</span>
                    {{ item.content }}
                  </template>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="48">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" label="项目编号">
            <template slot-scope="scope">
              <span v-if="scope.row.pro_code">{{ scope.row.pro_code }}</span>
              <span v-else style="color: #ff0000">未分配</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="yf_dwmc" label="辅助单位名称">
            <template slot-scope="scope">
              <div>{{ scope.row.yf_dwmc }}</div>
              <div>
                <el-button type="text" size="mini" @click="handleZZ(scope.row)">查看资质文件</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主办学院">
            <template slot-scope="scope">
              <div>{{ scope.row.college }}</div>
              <div
                v-if="scope.row.structure"
                style="color: #5E7E9F;line-height: 20px"
              >{{ scope.row.structure }}</div>
              <div v-if="userInfo.role===1" style="color: #199f93;line-height: 20px">{{ scope.row.realname }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="user" label="联系人姓名" min-width="60"></el-table-column>
          <el-table-column align="center" label="举办时间" min-width="82">
            <template slot-scope="scope">
              <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="contract_code" label="协议编号">
            <template slot-scope="scope">
              <span v-if="scope.row.contract_code">{{ scope.row.contract_code }}</span>
              <span v-else style="color: #ff0000">未分配</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="40">
            <template slot-scope="scope">
              <template v-if="scope.row.id">
                <span v-if="scope.row.status===0">未提交</span>
                <!-- 1~4 -->
                <template v-if="!isYXB && (versionTime_4_sign > (scope.row.create_time * 1000)) || goNoSign(scope.row.college)">
                  <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
                  <span v-if="scope.row.status===2||scope.row.status===4" style="color: #f56c6c">不通过</span>
                  <span v-if="scope.row.status===3" style="color: #67c23a">通过</span>
                </template>
                <!-- 1~11 -->
                <template v-else>
                  <span v-if="scope.row.status===1" class="warning">待预审</span>
                  <span v-if="scope.row.status===2||scope.row.status===4" style="color: #f56c6c">预审不通过</span>
                  <span v-if="scope.row.status===3" class="primary">预审通过</span>
                  <span v-if="scope.row.status===5" class="warning">待承诺书审核</span>
                  <span v-if="scope.row.status===6" class="warning">待乙方签署</span>
                  <span v-if="scope.row.status===7" class="danger">承诺书审核不通过</span>
                  <span v-if="scope.row.status===8" class="primary">签署成功</span>
                  <span v-if="scope.row.status===9" class="warning">待甲方签字</span>
                  <span v-if="scope.row.status===10" class="warning">待甲方签章</span>
                  <span v-if="scope.row.status===11" class="success">审核完成</span>
                </template>
              </template>
              <span v-else style="color: #f56c6c">未创建协议</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="签署状态" min-width="70">
            <template slot-scope="scope">
              <template v-if="userInfo.role===1">
                <el-switch
                  @change="handleSignChange(scope.row)"
                  v-model="scope.row.is_signed"
                  :active-value="2"
                  :inactive-value="1"
                  :disabled="userInfo.role===1?false:true"
                ></el-switch>
              </template>
              <div>
                <span v-if="scope.row.is_signed===2" style="color: #409EFF">已签署</span>
                <span v-if="scope.row.is_signed===1" style="color: #909399">未签署</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="140">
            <template slot-scope="scope">
              <template v-if="getForm.is_deleted===1">
                <!-- 状态：
                  0未提交(默认) 1待审核 2审核不通过 3审核通过 4审核不通过(重新审核按钮) 
                -->
                <!-- 原协议流程 —— 开始 -->
                <template v-if="!isYXB && (versionTime_4_sign > (scope.row.create_time * 1000)) || goNoSign(scope.row.college)">
                  <template v-if="userInfo.role===1">
                    <!-- 待审核（1） -->
                    <template v-if="scope.row.status===1">
                      <!-- 审核 -->
                      <el-button type="text" size="mini" @click.native=handleCheck(scope.row)>审核</el-button>
                      <!-- 查看详情 -->
                      <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">查看详情</el-button>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                    </template>
                    <!-- 审核不通过（2、4） -->
                    <template v-if="scope.row.status===2 || scope.row.status===4">
                      <!-- 查看详情 -->
                      <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">查看详情</el-button>
                      <!-- 编辑 -->
                      <!--<el-button type="text" size="mini" @click.native="handleEdit(scope.row.id)">编辑</el-button>-->
                      <!-- 重新审核 -->
                      <el-button type="text" size="mini" @click.native=handleCheck(scope.row)>重新审核</el-button>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                    </template>
                    <!-- 审核通过（3） -->
                    <template v-if="scope.row.status===3">
                      <!-- 打印合同 -->
                      <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">打印合同</el-button>
                      <!-- 重新审核 -->
                      <el-button type="text" size="mini" @click.native=handleCheck(scope.row)>重新审核</el-button>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                      <!-- 复 核 -->
                      <el-button type="text" size="mini" @click.native="handleSigned(scope.row)">复 核</el-button>
                      <!-- 申请修改审核 -->
                      <template v-if="scope.row.mod_apply&&scope.row.mod_apply.length">
                        <el-button type="text" size="mini" @click.native="handleEditResetCheck(scope.row)">
                          <span style="color: #e6a23c">申请修改审核</span>
                        </el-button>
                      </template>
                      <!-- 申请修改历史 -->
                      <template v-else>
                        <el-button type="text" size="mini" @click.native="handleEditResetCheck(scope.row)">申请修改历史</el-button>
                      </template>
                      <!-- 查看协议扫描件 -->
                      <template v-if="scope.row.fz_balance">
                        <el-button type="text" size="mini" @click="handleLookPDF(scope.row.fz_balance)">查看协议扫描件</el-button>
                      </template>
                    </template>
                  </template>
                  <template v-if="userInfo.role===2">
                    <!-- 已添加协议 -->
                    <template v-if="scope.row.id">
                      <!-- 草稿（0） -->
                      <template v-if="scope.row.status===0">
                        <div>
                          <!-- 编辑 -->
                          <el-button type="text" size="mini" @click.native="handleEdit(scope.row.id)">编辑</el-button>
                          <!-- 提交审核 -->
                          <el-button type="text" size="mini" @click.native="handleSubmit(scope.row.id)">提交审核</el-button>
                        </div>
                        <div>
                          <!-- 删除 -->
                          <el-button type="text" size="mini" @click.native="handleStatus(2,scope.row.id)">删除</el-button>
                          <!-- 查看详情 -->
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">查看详情</el-button>
                        </div>
                        <div>
                          <!-- 下载PDF版 -->
                          <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                        </div>
                      </template>
                      <!-- 待审核（1） -->
                      <template v-if="scope.row.status===1">
                        <!-- 下载PDF版 -->
                        <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                        <!-- 撤回 -->
                        <el-button v-if="isYXB" type="text" size="mini" @click.native="handleRollback(scope.row)">撤回</el-button>
                      </template>
                      <!-- 审核不通过（2、4） -->
                      <template v-if="scope.row.status===2 || scope.row.status===4">
                        <div>
                          <!-- 编辑 -->
                          <el-button type="text" size="mini" @click.native="handleEdit(scope.row.id)">编辑</el-button>
                          <!-- 查看详情 -->
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">查看详情</el-button>
                        </div>
                        <div>
                          <!-- 下载PDF版 -->
                          <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                          <!-- 删除 -->
                          <el-button type="text" size="mini" @click.native="handleStatus(2,scope.row.id)">删除</el-button>
                        </div>
                      </template>
                      <!-- 审核通过（3） -->
                      <template v-if="scope.row.status===3">
                        <div>
                          <!-- 打印合同 -->
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">打印合同</el-button>
                        </div>
                        <div>
                          <!-- 下载PDF版 -->
                          <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                        </div>
                        <template v-if="scope.row.mod_apply && !scope.row.mod_apply.length">
                          <div>
                            <!-- 申请修改 -->
                            <el-button type="text" size="mini" @click.native="handleEditReset(scope.row)">申请修改</el-button>
                            <!-- 申请修改历史 -->
                            <el-button type="text" size="mini" @click.native="handleEditResetCheck(scope.row)">申请修改历史</el-button>
                          </div>
                        </template>
                        <template v-else>
                          <!-- 申请修改待审核中 -->
                          <div>
                            <el-button type="text" size="mini" :disabled="true">申请修改待审核中</el-button>
                          </div>
                        </template>
                        <div>
                          <template v-if="scope.row.fz_balance">
                            <!-- 查看协议扫描件 -->
                            <el-button type="text" size="mini" @click="handleLookPDF(scope.row.fz_balance)">查看协议扫描件</el-button>
                          </template>
                        </div>
                      </template>
                    </template>
                    <!-- 新增协议 -->
                    <template v-else>
                      <!-- 新增协议 -->
                      <el-button type="text" size="mini" @click.native="handleAdd(scope.row)">新增协议</el-button>
                    </template>
                  </template>
                </template>
                <!-- 原协议流程 —— 结束 -->


                <!-- 状态：
                  0未提交(默认) 1待审核 2审核不通过 3审核通过 4审核不通过(重新审核按钮)
                  5已上传承诺书 6待签署 7已上传承诺书不通过 8签署成功 9待甲方签字 10继教处工作人员操作盖电子章
                  11继教处工作人员操作盖电子章成功
                 -->
                <!-- PDF签章审批 —— 开始 -->
                <template v-else>
                  <template v-if="userInfo.role===1">
                    <!-- 待审核（1） -->
                    <template v-if="scope.row.status===1">
                      <!-- 审核 -->
                      <el-button type="text" size="mini" @click.native=handleCheck(scope.row)>审核</el-button>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                    </template>
                    <!-- 审核不通过（2、4） -->
                    <template v-if="scope.row.status===2 || scope.row.status===4">
                      <!-- 重新审核 -->
                      <el-button type="text" size="mini" @click.native=handleCheck(scope.row)>重新审核</el-button>
                      <!-- 查看纸版合同 -->
                      <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                    </template>
                    <!-- 审核通过（3） -->
                    <template v-if="scope.row.status===3">
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                      <!-- 重新审核 -->
                      <el-button type="text" size="mini" @click.native=handleCheck(scope.row)>重新审核</el-button>
                    </template>
                    <!-- 待承诺书审核（5） -->
                    <template v-if="scope.row.status===5">
                      <!-- 审核 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleCheck(scope.row, 1)">审核承诺书</el-button>
                      </div>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                      <!-- 下载PDF版 -->
                      <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                    </template>
                    <!-- 待乙方签署（6） -->
                    <template v-if="scope.row.status===6">
                      <!-- 查看PDF承诺书 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.commitment)">查看PDF承诺书</el-button>
                      </div>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                      <div>
                        <el-button type="text" size="mini" @click.native="handleCheck(scope.row, 1)">重新审核承诺书</el-button>
                      </div>
                      <!-- 下载PDF版 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                      </div>
                    </template>
                    <!-- 承诺书审核不通过（7） -->
                    <template v-if="scope.row.status===7">
                      <!-- 审核 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleCheck(scope.row, 1)">重新审核承诺书</el-button>
                      </div>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                      <!-- 下载PDF版 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                      </div>
                    </template>
                    <!-- 签署成功（8）、待甲方签字（9） -->
                    <template v-if="scope.row.status===8 || scope.row.status===9">
                      <!-- 复审 -->
                      <div v-if="scope.row.status==8">
                        <el-button type="text" size="mini" @click.native="handleCheck(scope.row, 3)">复审</el-button>
                      </div>
                      <!-- 查看PDF版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.new_pdf, 2)">查看PDF版合同</el-button>
                      </div>
                      <!-- 查看PDF承诺书 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.commitment)">查看PDF承诺书</el-button>
                      </div>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                    </template>
                    <!-- 待甲方签章（10） -->
                    <template v-if="scope.row.status===10">
                      <!-- PDF签章 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handlePdfSign(scope.row)">签章PDF版合同</el-button>
                      </div>
                      <!-- 查看PDF版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.new_pdf, 2)">查看PDF版合同</el-button>
                      </div>
                      <!-- 查看PDF承诺书 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.commitment)">查看PDF承诺书</el-button>
                      </div>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                    </template>
                    <!-- 甲方签章完成（11） -->
                    <template v-if="scope.row.status===11">
                      <!-- 查看PDF版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.new_pdf, 2)">查看PDF版合同</el-button>
                      </div>
                      <!-- 查看PDF承诺书 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.commitment)">查看PDF承诺书</el-button>
                      </div>
                      <!-- 查看纸版合同 -->
                      <div>
                        <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                      </div>
                      <!-- 查看协议扫描件 -->
                      <div v-if="scope.row.fz_balance">
                        <el-button type="text" size="mini" @click="handleLookPDF(scope.row.fz_balance)">查看协议扫描件</el-button>
                      </div>
                      <!-- 复 核 -->
                      <el-button type="text" size="mini" @click.native="handleSigned(scope.row)">复 核</el-button>
                    </template>
                  </template>
                  <template v-if="userInfo.role===2">
                    <!-- 已添加协议 -->
                    <template v-if="scope.row.id">
                      <!-- 草稿（0） -->
                      <template v-if="scope.row.status===0">
                        <div>
                          <!-- 编辑 -->
                          <el-button type="text" size="mini" @click.native="handleEdit(scope.row.id)">编辑</el-button>
                          <!-- 提交审核 -->
                          <el-button type="text" size="mini" @click.native="handleSubmit(scope.row.id)">提交审核</el-button>
                        </div>
                        <div>
                          <!-- 删除 -->
                          <el-button type="text" size="mini" @click.native="handleStatus(2,scope.row.id)">删除</el-button>
                          <!-- 查看纸版合同 -->
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                        <!-- 下载PDF版 -->
                        <div v-if="isYXB">
                          <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                        </div>
                      </template>
                      <!-- 待审核（1） -->
                      <template v-if="scope.row.status===1">
                        <!-- 查看纸版合同 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                        <!-- 下载PDF版 -->
                        <div v-if="isYXB">
                          <el-button type="text" size="mini" @click.native="handlePdf(scope.row)">下载PDF版</el-button>
                        </div>
                        <!-- 撤回 -->
                        <div v-if="isYXB">
                          <el-button type="text" size="mini" @click.native="handleRollback(scope.row)">撤回</el-button>
                        </div>
                      </template>
                      <!-- 审核不通过（2、4） -->
                      <template v-if="scope.row.status===2 || scope.row.status===4">
                        <div>
                          <!-- 编辑 -->
                          <el-button type="text" size="mini" @click.native="handleEdit(scope.row.id)">编辑</el-button>
                          <!-- 查看纸版合同 -->
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                        <div>
                          <!-- 删除 -->
                          <el-button type="text" size="mini" @click.native="handleStatus(2,scope.row.id)">删除</el-button>
                        </div>
                      </template>
                      <!-- 审核通过（3） -->
                      <template v-if="scope.row.status===3">
                        <!-- 打印承诺书 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">打印承诺书</el-button>
                        </div>
                        <!-- 上传PDF承诺书 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleUploadPdf(scope.row)">上传PDF承诺书</el-button>
                        </div>
                        <!-- 查看纸版合同 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                      </template>
                      <!-- 待承诺书审核（5）、待乙方签署（6） -->
                      <template v-if="scope.row.status===5 || scope.row.status===6">
                        <!-- 查看PDF版合同 -->
                        <div v-if="scope.row.status===6">
                          <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.new_pdf, 2)">查看PDF版合同</el-button>
                        </div>
                        <!-- 查看PDF承诺书 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.commitment)">查看PDF承诺书</el-button>
                        </div>
                        <!-- 查看纸版合同 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                      </template>
                      <!-- 承诺书审核不通过（7） -->
                      <template v-if="scope.row.status===7">
                        <!-- 打印承诺书 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">打印承诺书</el-button>
                        </div>
                        <!-- 上传PDF承诺书 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleUploadPdf(scope.row)">上传PDF承诺书</el-button>
                        </div>
                        <!-- 查看纸版合同 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                      </template>
                      <!-- 签署成功（8）、待甲方签字（9）、待甲方签章（10）、甲方签章完成（11） -->
                      <template v-if="scope.row.status===8 || scope.row.status===9 || scope.row.status===10 || scope.row.status===11">
                        <!-- 查看PDF版合同 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.new_pdf, 2)">查看PDF版合同</el-button>
                        </div>
                        <!-- 查看PDF承诺书 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleLookPDF(scope.row.commitment)">查看PDF承诺书</el-button>
                        </div>
                        <!-- 查看纸版合同 -->
                        <div>
                          <el-button type="text" size="mini" @click.native="handleInfo(scope.row, 1, 1)">查看/打印纸版</el-button>
                        </div>
                        <!-- 查看协议扫描件 -->
                        <div v-if="scope.row.status===11 && scope.row.fz_balance">
                          <el-button type="text" size="mini" @click="handleLookPDF(scope.row.fz_balance)">查看协议扫描件</el-button>
                        </div>
                      </template>
                    </template>
                    <!-- 新增协议 -->
                    <template v-else>
                      <!-- 新增协议 -->
                      <el-button type="text" size="mini" @click.native="handleAdd(scope.row)">新增协议</el-button>
                    </template>
                  </template>
                </template>
                <!-- PDF签章审批 —— 结束 -->
              </template>
              <template v-else>
                <!-- 还原 -->
                <el-button type="text" size="mini" @click.native="handleStatus(1,scope.row.id)">还原</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
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
    <!--新增提示-->
    <el-dialog
      center
      title="重要声明"
      :visible.sync="dialogVisibleAddEdit"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="45%"
    >
      <p
        style="text-indent: 2em;font-size: 16px"
      >继续教育处依据学校有关政策和规定，对学院签订的培训协议履行协议文本的文字预审查职责，审查通过并不代表继续教育处已同意举办与协议有关的培训班，更不代表继续教育处对有关协议承担协议责任。请各学院加强对协议的审查和监管，切实承担协议的经济和法律责任、以及作为办班主体的管理和教学责任。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleAddEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!--弹窗（提交提示）-->
    <el-dialog
      width="30%"
      center
      :visible.sync="innerVisibleTip"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p class="submit-over">
        <span class="icon">
          <i class="el-icon-info"></i>
        </span>
        <span class="text">是否立即提交审核？</span>
      </p>
      <div slot="footer" class="dialog-footer" style="position: relative">
        <el-button type="success" @click.native="handleSubmitTrue(0)">确 定</el-button>
        <el-button @click.native="innerVisibleTip = false">取 消</el-button>
        <div class="dialog-footer-show" :class="{'dialog-footer-none':dialogShow}"></div>
      </div>
    </el-dialog>
    <!--弹窗（PDF承诺书上传）-->
    <el-dialog title="承诺书上传"
      width="30%" center append-to-body
      :visible.sync="pdfVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="four-align-center">
        <el-upload
          :action="uploadExcelUrl1"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :headers="headers"
          :with-credentials="true"
          name="attachment"
          accept=".pdf"
          :file-list="pdfList"
          :limit="1"
          :auto-upload="true">
          <el-button type="primary" plain size="mini"
            icon="el-icon-upload el-icon--right"
          >承诺书上传（限 PDF 文件）</el-button>
        </el-upload>
      </div>
      <div slot="footer">
        <el-button type="success" @click.native="handleUploadPdfTrue" v-loading="pdfLoading">确 定</el-button>
        <el-button @click.native="pdfVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- PDF签章 -->
    <PdfSign v-if="userInfo.role===1" ref="pdfsign" :pdf-src="pdfSrc" @onetrue="clickOnetrue" @twotrue="clickTwotrue" />
    <el-dialog
      :title="`${zzData.yf_dwmc}  ——资质信息`" append-to-body
      :visible.sync="zz" center
      width="500px">
      <div class="set-align-center">
        <el-form label-position="top">
          <el-form-item label="法人代表">
            <el-image style="width: 200px;"
            :src="`${lookUrl}/${zzData.frdb_file}`" 
            :preview-src-list="[`${lookUrl}/${zzData.frdb_file}`]"></el-image>
          </el-form-item>
          <el-form-item label="资质文件">
            <el-image style="width: 200px;"
            :src="`${lookUrl}/${zzData.zzwj_file}`" 
            :preview-src-list="[`${lookUrl}/${zzData.zzwj_file}`]"></el-image>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PdfSign from '@/components/three/PdfSign.vue'
import { MATE } from '@/assets/js/config.special.js'

const urls = {
  pdf_upload: '/admin/contracts/review_fzcomm', // 提交pdf承诺书
  pdf_sign: '/admin/contracts/review_fzsize', // 甲方（继教处）提交电子签章
  fz_sign_data: '/admin/contracts/chapter', // 提交签名数据
  rollback: '/admin/contracts/rollback_to_audit' // 协议撤回
}

export default {
  name: "app-protocol-assist",
  data() {
    return {
      loading2: false,
      headers: {},
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      tableData: [], // 初始化数据
      total: 0, // 总条数
      searchInput: "", // 搜索输入框
      switcher: 1, // 1正常、2删除
      getForm: {
        college: null,
        structure: null, // 部门
        province: null,
        city: null,
        sea_field: "pro_code", //关键词字段(查询条件)：pro_name项目,contract_code协议编号,user联系人,tel联系方式,dwmc辅助单位名称
        keywords: "",
        page: 1,
        limit: 20,
        is_deleted: 1 //  1正常，2回收站
      }, // 查询条件
      statusList: ["未提交", "待审核", "审核不通过", "审核通过", "审核不通过"], // 审核状态
      innerVisibleTip: false,
      dialogShow: true,
      id: 0, //辅助协议标识id
      //新增、编辑
      add_edit_pro_id: 0,
      dialogVisibleAddEdit: false,
      key: 1,
      //    报废、恢复
      status: 1,
      list: [],
      // 上传PDF承诺书
      pdfVisible: false,
      pdfLoading: false,
      pdfList: [],
      pdfForm: {
        id: null,
        uid: null,
        pro_id: null,
        status: 5, // 5已上传承诺书
        commitment: ''
      },
      // PDF签章
      pdfSignID: null,
      pdfSrc: '',
      
      isYXB: false,
      zz: false,
      zzData: {}
    };
  },
  computed: {
    ...mapState([
      "URL", "fzExportUrl", "lookUrl",
      'uploadExcelUrl1',
      'userInfo', 'versionTime_4_sign'
    ])
  },
  filters: {
    fjName(name) {
      // 附件名显示
      let num = name.indexOf("{#}");
      if (num !== -1) {
        return name.substring(0, num);
      } else {
        return name;
      }
    }
  },
  components: {
    PdfSign
  },
  methods: {
    ...mapActions([
      'axiosHttp',
      "getStructures",
      "getAreaList",
      "getFzList",
      "getFzProtocol",
      "addFzProtocol",
      "updateFzProtocol",
      "submitFz",
      "getModify",
      "addModify",
      "submitReviewModify",
      "changeProtocolStatus",
      "signFzProtocol"
    ]),
    initData() {
      if (this.$route.fullPath.indexOf("list") > 0) {
        this.$set(this.getForm, "is_deleted", 1);
        this.switcher = 1;
      } else {
        this.$set(this.getForm, "is_deleted", 2);
        this.switcher = 2;
      }
      this.loading2 = true;
      if (this.loading2) {
        this.getFzList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            this.total = data.data.data.dataCount;
            this.tableData = data.data.data.list;
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
    handleSwitcher(is_deleted = 1) {
      const query = this.$route.query
      if (is_deleted === 2) {
        this.$router.push({
          path: "/home/protocol/assist/recycle",
          query
        });
      } else {
        this.$router.push({
          path: "/home/protocol/assist/list",
          query
        });
      }
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索关键字！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
      }
    },
    handleAdd(val) {
      this.key = 1;
      sessionStorage.setItem("ProtocolAssist", JSON.stringify(val));
      this.add_edit_pro_id = val.pro_id;
      this.dialogVisibleAddEdit = true;
    },
    handleEdit(id) {
      this.$router.push("/home/protocol/assist/edit/" + id);
    },
    handleAddEdit() {
      if (this.key) {
        this.$router.push("/home/protocol/assist/add/" + this.add_edit_pro_id);
      }
    },
    handleInfo (val, type = 0, sort = 0) {
      if (type) { // 
        if (sort === 0) { // 
          this.$router.push({
            path: `/home/protocol/assist/${val.id}`
          })
        } else if (sort === 1) { // 
          this.$router.push({
            path: `/home/protocol/assist/${val.id}`,
            query: {
              sort: sort
            }
          })
        } else if (sort === 2) { // 
          this.$router.push({
            path: `/home/protocol/assist/${val.id}`,
            query: {
              sort: sort
            }
          })
        } else if (sort === 3) { // 
          this.$router.push({
            path: `/home/protocol/assist/${val.id}`,
            query: {
              sort: sort
            }
          })
        }
      } else { // 
        this.$router.push({
          path: `/home/protocol/assist/${val.id}`
        })
      }
    },
    handleCheck (val, type = 0) {
      if (type === 0) {
        this.$router.push({
          path: `/home/protocol/assistCheck/${val.id}`
        })
      } else if (type === 1) {
        if (val.commitment) {
          this.$router.push({
            path: `/home/protocol/assistCheckPdf`,
            query: {
              id: val.id,
              uid: this.userInfo.uid,
              pro_id: val.pro_id,
              code: val.commitment,
              type: 1, // 1审核
              pdf: 1
            }
          })
        } else {
          this.$message.error('PDF版承诺书缺失！')
        }
      } else if (type === 3) {
        if (val.new_pdf) {
          this.$router.push({
            path: `/home/protocol/assistCheckPdf`,
            query: {
              id: val.id,
              uid: this.userInfo.uid,
              pro_id: val.pro_id,
              code_2: val.new_pdf,
              type: 1,
              pdf: 2
            }
          })
        } else {
          this.$message.error('PDF版合同缺失！')
        }
      }
    },
    handleSubmit(id) {
      this.id = id;
      this.innerVisibleTip = true;
      this.dialogShow = true;
    },
    handleSubmitTrue(id) {
      this.dialogShow = false;
      if (!this.dialogShow) {
        this.submitFz({
          data: {
            id: id ? id : this.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.innerVisibleTip = false;
            this.$message({
              type: "success",
              message: data.data.data
            });
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
    handlePdf(val) {
      let hrf =
        this.URL +
        this.fzExportUrl +
        "?authkey=" +
        this.headers.authkey +
        "&sessionid=" +
        this.headers.sessionid +
        "&id=" +
        val.id;
      window.open(hrf);
    },
    handleStatus(status, id) {
      // 报废？？
      this.status = status;
      let list = [];
      if (id) {
        list.push(id);
      } else {
        list = this.ids;
      }
      if (status === 2) {
        this.$confirm("删除的协议可在回收站找回，是否继续删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.changeProtocolStatus({
              data: {
                ids: list,
                is_deleted: this.status
              },
              status: this.status
            }).then(data => {
              if (data.data.code === 200) {
                this.initData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.changeProtocolStatus({
          data: {
            id: list[0],
            is_deleted: this.status
          },
          status: this.status
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
      }
    },
    handleSignChange(val) {
      this.signFzProtocol({
        data: {
          ids: val.id,
          is_signed: val.is_signed
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleSigned(val) {
      // 复核
      sessionStorage.setItem(
        "is_signed",
        JSON.stringify({
          is_signed: 2,
          ids: val.id
        })
      );
      this.$router.push("/home/protocol/assistCheck/" + val.id);
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      // console.log(this.$el.offsetParent.offsetParent,'滚动元素');
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleEditReset(val) {
      sessionStorage.setItem("SQXG", true);
      this.handleEdit(val.id);
    },
    handleEditResetCheck(val) {
      const data = {
        pro_name: val.pro_name,
        id: val.id
      };
      sessionStorage.setItem("modifyID", JSON.stringify(data));
      this.$router.push("/home/protocol/assist/modify/list/2");
    },
    handleLookPDF(params, type = 1) {
      if (params) {
        if (type === 1) {
          window.open(`${this.lookUrl}/${params}`, '_blank')
        } else if (type === 2) {
          window.open(`${this.URL}${params}`, '_blank')
        }
      } else {
        this.$message.error('PDF文件无效！')
      }
    },
    handleUploadPdf (val) {
      this.$set(this.pdfForm, 'id', val.id)
      this.$set(this.pdfForm, 'uid', this.userInfo.uid)
      this.$set(this.pdfForm, 'pro_id', val.pro_id)
      this.$set(this.pdfForm, 'commitment', '')
      this.pdfList = []
      this.pdfLoading = false
      this.pdfVisible = true
    },
    handleUploadPdfTrue () {
      if (!this.pdfForm.commitment) {
        this.$message.warning('请上传文件！')
        return false
      } else {
        this.pdfLoading = true
        if (this.pdfLoading) {
          this.axiosHttp({
            url: urls.pdf_upload,
            type: 'post',
            data: this.pdfForm,
            yxb: true
          }).then(data => {
            if (data.data.code === 200) {
              this.$message.success('提交成功！')
              this.pdfVisible = false
              this.initData()
            } else {
              this.$notify.error({
                title: '错误',
                message: data.data.error,
                onClose: () => {
                  this.pdfLoading = false
                }
              })
            }
          })
        }
      }
    },
    beforeUpload (file) {
      const isTYPE = file.type === 'application/pdf' !== -1
      const isLtM = file.size / 1024 / 1024 < 8
      if (!isTYPE) {
        this.$message.error('上传文件只能是 PDF 格式!')
      }
      if (!isLtM) {
        this.$message.error('上传文件大小不能超过 8MB!')
      }
      return isTYPE && isLtM
    },
    handleSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.pdfForm, 'commitment', response.data.code)
        this.pdfList = fileList
      } else {
        this.$notify.error({
          title: '错误',
          message: response.error
        })
        this.$set(this.pdfForm, 'commitment', '')
        this.pdfList = []
      }
    },
    handleRemove (file, fileList) {
      this.$set(this.pdfForm, 'commitment', '')
      this.pdfList = []
    },
    handlePreview (val) {
      window.open(`${this.lookUrl}/${val.url}`)
    },
    handlePdfSign (val) {
      this.pdfSignID = val.id || null
      this.pdfSrc = val.new_pdf
      this.$refs.pdfsign.getSignCertInfo()
    },
    clickOnetrue (params, data, fn, error) {
      const Obj = {
        id: this.pdfSignID,
        pageno: params.pageNum,
        left: params.left,
        top: params.top,
        right: params.right,
        bottom: params.bottom,
        sealimg: data.seal_img,
        signcert: data.sign_cert
      }
      if (Obj.id) {
        this.axiosHttp({
          url: urls.pdf_sign,
          type: 'post',
          data: Obj,
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            fn && fn(JSON.stringify(data.data.data))
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                error && error()
              }
            })
          }
        })
      }
    },
    clickTwotrue (params, fn) {
      this.axiosHttp({
        url: urls.fz_sign_data,
        type: 'post',
        data: {
          id: this.pdfSignID,
          txt: params
        },
        yxb: true
      }).then(data => {
        if (data.data.code === 200) {
          this.$message.success('签章成功！')
          fn && fn()
          this.initData()
        } else {
          this.$notify.error({
            title: '错误',
            message: data.data.error
          })
        }
      })
    },
    handleRollback (val) {
      this.$prompt('请输入撤回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /\S/,
        inputErrorMessage: '撤回原因不能为空！'
      }).then(({ value }) => {
        this.axiosHttp({
          url: urls.rollback,
          type: 'post',
          data: {
            id: val.id,
            type: 'f', // w委托、f辅助
            cause: value
          },
          yxb: true
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('撤回成功！')
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      })
    },
    goNoSign (dataCollege) {
      if (!this.isYXB) {
        return MATE('assist_noSign', this.userInfo.role == 1 ? dataCollege : this.userInfo.role == 2 ? this.userInfo.college : '')
      }
    },
    handleZZ (val) {
      this.zzData = val
      setTimeout(() => {
        this.zz = true
      }, 200)
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"));
    this.initData();
    if (this.userInfo.role === 1) {
      this.getStructures({
        data: {
          // level:1
        }
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
      this.getAreaList({
        data: {
          pid: 0
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.provincesList = Data.list;
        }
      });
    }
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  },
  watch: {
    "getForm.province"() {
      this.handleSelect();
      this.$set(this.getForm, "city", null);
      if (1) {
        this.getAreaList({
          data: {
            pid: this.getForm.province
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.cityList = Data.list;
          }
        });
      }
    },
    $route() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    pdfVisible: {
      handler () {
        this.$set(this.pdfForm, 'commitment', '')
        this.pdfList = []
        this.pdfLoading = false
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  padding: 0;
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
.mod-content .mod-item {
  margin: 6px 0;
  line-height: 28px;
}
.mod-content ul {
  padding: 0 10px;
}
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
.mod-border {
  border-bottom: 1px solid #606266;
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
