<template>
  <div
    class="app-protocol-college"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <template v-if="switcher===1">
              <el-button v-if="isYXB" @click="$router.push('/home/protocol/college/list/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
              <el-button
                v-if="userInfo.role===2"
                type="primary"
                icon="el-icon-plus"
                :disabled="addStatus"
                @click.native="handleAddMore"
              >新增</el-button>
              <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
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
                <el-option label="合作单位名称" value="dwmc"></el-option>
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
                <el-option label="合作单位名称" value="dwmc"></el-option>
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
          @selection-change="handleSelectionChange"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%;margin-top: 0px"
        >
          <el-table-column v-if="userInfo.role===2" type="selection" width="50"></el-table-column>
          <el-table-column align="center" label="序号" width="48">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称" min-width="160"></el-table-column>
          <el-table-column align="center" label="项目编号">
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
          <el-table-column
            align="center"
            min-width="510"
          >
            <template slot="header">
              <el-table
                :show-header="false" border
                :data="[1]"
                style="width:100%"
              >
                <el-table-column align="center" label="校内合作单位名称">校内合作单位名称</el-table-column>
                <el-table-column align="center" label="协议编号" min-width="130">协议编号</el-table-column>
                <el-table-column align="center" label="状态" min-width="40">状态</el-table-column>
                <el-table-column align="center" label="签署状态" min-width="70">签署状态</el-table-column>
                <el-table-column align="center" label="操作" width="150">操作</el-table-column>
              </el-table>
            </template>
            <template slot-scope="scope0">
              <div style="padding-top: 1px">
                <el-table
                  :show-header="false"
                  border
                  :data="scope0.row.contracts"
                  :default-expand-all="true"
                  class="college-table-table"
                  style="width:100%"
                >
                  <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                      <ul style="text-align: left">
                        <li v-for="(item,index) in props.row.history" :key="index">
                          <template v-if="item.his_type===1">
                            <span
                              class="danger"
                            >未通过原因【{{ item.create_time | TimestampChangeFilter }}】：</span>
                            {{ item.content }}
                          </template>
                          <template v-else>
                            <span
                              class="success"
                            >修改回复【{{ item.create_time | TimestampChangeFilter }}】：</span>
                            {{ item.content }}
                          </template>
                        </li>
                      </ul>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="校内合作单位名称" prop="yf_dwmc"></el-table-column>
                  <el-table-column align="center" label="协议编号" min-width="130">
                    <template slot-scope="scope">
                      <span v-if="scope.row.contract_code">{{ scope.row.contract_code }}</span>
                      <span v-else style="color: #ff0000">未分配</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="状态" min-width="40">
                    <template slot-scope="scope">
                      <template v-if="scope.row.id">
                        <span v-if="scope.row.status===0">未提交</span>
                        <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
                        <span
                          v-if="scope.row.status===2||scope.row.status===4"
                          style="color: #f56c6c"
                        >不通过</span>
                        <span v-if="scope.row.status===3" style="color: #67c23a">通过</span>
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
                        ></el-switch>
                      </template>
                      <div>
                        <span v-if="scope.row.is_signed===2" style="color: #409EFF">已签署</span>
                        <span v-if="scope.row.is_signed===1" style="color: #909399">未签署</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                      <!--协议审核状态：0未提交(默认) 1待审核 2审核不通过 3审核通过 4审核不通过(重新审核按钮)-->
                      <template v-if="getForm.is_deleted===1">
                        <template v-if="userInfo.role===1">
                          <template v-if="scope.row.status===1">
                            <el-button
                              type="text"
                              @click.native="handleCheck(scope.row, true, scope0.row, false, 0)"
                              size="mini"
                            >审核</el-button>
                            <el-button
                              v-if="scope.row.tp===1"
                              type="text"
                              @click.native="handlePdf(scope.row)"
                              size="mini"
                            >下载PDF版</el-button>
                          </template>
                          <template v-if="scope.row.status===2||scope.row.status===4">
                            <template v-if="scope.row.tp===1">
                              <el-button
                                type="text"
                                @click.native="handleCheck(scope.row,true,scope0.row, false, 0)"
                                size="mini"
                              >重新审核</el-button>
                              <el-button
                                type="text"
                                @click.native="handleInfo(scope.row,scope0.row)"
                                size="mini"
                              >查看详情</el-button>
                              <el-button
                                type="text"
                                @click.native="handlePdf(scope.row)"
                                size="mini"
                              >下载PDF版</el-button>
                            </template>
                            <template v-if="scope.row.tp===2">
                              <el-button
                                type="text"
                                @click.native="handleCheck(scope.row,true,scope0.row, false, 0)"
                                size="mini"
                              >重新审核</el-button>
                              <el-button
                                type="text"
                                @click.native="handleInfo(scope.row,scope0.row)"
                                size="mini"
                              >查看详情</el-button>
                            </template>
                            <!--<el-button type="text" @click.native="handleEdit(scope.row,scope0.row, 0)" size="mini" >编辑</el-button>-->
                          </template>
                          <template v-if="scope.row.status===3">
                            <template v-if="scope.row.tp===1">
                              <el-button
                                type="text"
                                @click.native="handlePrint(scope.row,scope0.row)"
                                size="mini"
                              >打印合同</el-button>
                              <el-button
                                type="text"
                                @click.native="handlePdf(scope.row)"
                                size="mini"
                              >下载PDF版</el-button>
                              <el-button
                                type="text"
                                @click.native="handleInfo(scope.row,scope0.row)"
                                size="mini"
                              >查看详情</el-button>
                              <el-button
                                type="text"
                                @click.native="handleCheck(scope.row,true,scope0.row, false, 0)"
                                size="mini"
                              >重新审核</el-button>
                              <el-button
                                type="text"
                                @click.native="handleCheck(scope.row,true,scope0.row,true, 0)"
                                size="mini"
                              >复核</el-button>
                              <el-button
                                v-if="scope.row.mod_apply&&scope.row.mod_apply.length"
                                type="text"
                                @click.native="handleEditResetCheck(scope.row,scope0.row)"
                                size="mini"
                              >
                                <span style="color: #e6a23c">申请修改审核</span>
                              </el-button>
                              <el-button
                                v-else
                                size="mini"
                                type="text"
                                @click.native="handleEditResetCheck(scope.row,scope0.row)"
                              >申请修改历史</el-button>
                            </template>
                            <template v-if="scope.row.tp===2">
                              <el-button
                                type="text"
                                @click.native="handleInfo(scope.row,scope0.row)"
                                size="mini"
                              >查看详情</el-button>
                              <el-button
                                type="text"
                                @click.native="handleCheck(scope.row,true,scope0.row, false, 0)"
                                size="mini"
                              >重新审核</el-button>
                              <el-button
                                type="text"
                                @click.native="handleInfo(scope.row,scope0.row,true)"
                                size="mini"
                              >复核</el-button>
                              <el-button
                                v-if="scope.row.is_sh === 1"
                                type="text"
                                @click.native="handleCheck(scope.row,true,scope0.row, false, 1)"
                                size="mini"
                              >
                                <span style="color: #e6a23c">申请修改审核</span>
                              </el-button>
                            </template>
                            <el-button
                              v-if="scope.row.hz_balance"
                              type="text"
                              @click="handleBalance(scope.row.hz_balance)"
                            >查看协议扫描件</el-button>
                            <!--<el-button type="text" @click.native="handleStatus(2,scope.row.cc_id)" size="mini" >删除</el-button>-->
                            <!--<el-button type="text" @click.native="handleEdit(scope.row,scope0.row, 0)" size="mini" >编辑</el-button>-->
                          </template>
                        </template>
                        <template v-if="userInfo.role===2">
                          <template v-if="scope.row.id">
                            <template v-if="scope.row.status===0">
                              <div>
                                <el-button
                                  type="text"
                                  @click.native="handleEdit(scope.row,scope0.row, 0)"
                                  size="mini"
                                >编辑</el-button>
                                <el-button
                                  type="text"
                                  @click.native="handleSubmit2(scope.row.id)"
                                  size="mini"
                                >提交审核</el-button>
                              </div>
                              <div>
                                <el-button
                                  type="text"
                                  @click.native="handleStatus(2,scope.row.cc_id)"
                                  size="mini"
                                >删除</el-button>
                                <el-button
                                  type="text"
                                  @click.native="handleInfo(scope.row,scope0.row)"
                                  size="mini"
                                >查看详情</el-button>
                              </div>
                              <el-button
                                type="text"
                                @click.native="handlePdf(scope.row)"
                                size="mini"
                              >下载PDF版</el-button>
                            </template>
                            <el-button
                              v-if="scope.row.tp===1&&scope.row.status===1"
                              type="text"
                              @click.native="handlePdf(scope.row)"
                              size="mini"
                            >下载PDF版</el-button>
                            <template v-if="scope.row.status===2||scope.row.status===4">
                              <template v-if="scope.row.tp===1">
                                <el-button
                                  type="text"
                                  @click.native="handleEdit(scope.row,scope0.row, 0)"
                                  size="mini"
                                >编辑</el-button>
                                <el-button
                                  type="text"
                                  @click.native="handleInfo(scope.row,scope0.row)"
                                  size="mini"
                                >查看详情</el-button>
                                <el-button
                                  type="text"
                                  @click.native="handlePdf(scope.row)"
                                  size="mini"
                                >下载PDF版</el-button>
                              </template>
                              <template v-if="scope.row.tp===2">
                                <el-button
                                  type="text"
                                  @click.native="handleEdit(scope.row,scope0.row, 0)"
                                  size="mini"
                                >编辑</el-button>
                                <el-button
                                  type="text"
                                  @click.native="handleInfo(scope.row,scope0.row)"
                                  size="mini"
                                >查看详情</el-button>
                              </template>
                              <el-button
                                type="text"
                                @click.native="handleStatus(2,scope.row.cc_id)"
                                size="mini"
                              >删除</el-button>
                            </template>
                            <template v-if="scope.row.status===3">
                              <template v-if="scope.row.tp===1">
                                <el-button
                                  type="text"
                                  @click.native="handlePrint(scope.row,scope0.row)"
                                  size="mini"
                                >打印合同</el-button>
                                <el-button
                                  type="text"
                                  @click.native="handlePdf(scope.row)"
                                  size="mini"
                                >下载PDF版</el-button>
                                <template v-if="scope.row.mod_apply&&!scope.row.mod_apply.length">
                                  <el-button
                                    type="text"
                                    @click.native="handleEditReset(scope.row,scope0.row)"
                                    size="mini"
                                  >申请修改</el-button>
                                  <el-button
                                    type="text"
                                    @click.native="handleEditResetCheck(scope.row,scope0.row)"
                                    size="mini"
                                  >申请修改历史</el-button>
                                </template>
                                <template v-else>
                                  <el-button type="text" :disabled="true" size="mini">申请修改待审核中</el-button>
                                </template>
                              </template>
                              <template v-if="scope.row.tp===2">
                                <el-button
                                  type="text"
                                  @click.native="handleInfo(scope.row,scope0.row)"
                                  size="mini"
                                >查看详情</el-button>
                                <template v-if="scope.row.is_sh === 1">
                                  <el-button type="text" :disabled="true" size="mini">申请修改待审核中</el-button>
                                </template>
                                <el-button
                                  v-else
                                  type="text"
                                  @click.native="handleEdit(scope.row,scope0.row, 1)"
                                  size="mini"
                                >申请修改</el-button>
                              </template>
                              <el-button
                                v-if="scope.row.hz_balance"
                                type="text"
                                @click="handleBalance(scope.row.hz_balance)"
                              >查看协议扫描件</el-button>
                            </template>
                          </template>
                          <template v-else>
                            <el-button
                              type="text"
                              @click.native="handleAdd1(scope.row,scope0.row,1,scope.$index)"
                              size="mini"
                            >新增协议</el-button>
                          </template>
                        </template>
                      </template>
                      <template v-else>
                        <el-button type="text" @click.native="handleStatus(1,scope.row.cc_id)">还原</el-button>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
        <el-button type="primary" @click="handleAddTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!--弹窗（提交提示）-->
    <el-dialog
      width="30%"
      center
      :visible.sync="innerVisible2"
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
        <el-button type="success" @click.native="handleSubmit(0)">确 定</el-button>
        <el-button @click.native="innerVisible2 = false">取 消</el-button>
        <div class="dialog-footer-show" :class="{'dialog-footer-none':dialogShow}"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-protocol-college",
  data() {
    return {
      loading2: false,
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      tableData: [], // 初始化数据
      total: 0, // 总条数
      switcher: 1, // 1正常、2删除
      getForm: {
        college: null,
        structure: null, // 部门
        province: null,
        city: null,
        sea_field: "pro_code", 
        keywords: "",
        page: 1,
        limit: 20,
        is_deleted: 1
      }, // 查询条件
      innerVisible2: false,
      dialogShow: true,
      id: 0, //
      selectionList: [],
      addStatus: true,
      collegeProtocolMore: {},
      //    新增、编辑
      dialogVisibleAddEdit: false,
      is_signed: false,
      signedForm: {
        ids: 0,
        is_signed: 2
      },
      status: 1, //启用、禁用
      headers: {}, // 
      type_nonstandard: 0, // 0编辑、1非标准申请修改
      isYXB: false
    };
  },
  computed: {
    ...mapState(["URL", "hzExportUrl", "lookUrl", 'userInfo'])
  },
  methods: {
    //app-protocol-college
    ...mapActions([
      "getStructures",
      "getAreaList",
      "getHzList",
      "addHzProtocol",
      "submitHz",
      "updateHzProtocol",
      "checkHz",
      "changeProtocolStatusHz",
      "signHzProtocol",
      "hzEditNonstandard",
      "hzCheckNonstandard"
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
        this.getHzList({
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
    handleAddMore() {
      sessionStorage.setItem("collegeProtocol", JSON.stringify(this.collegeProtocolMore));
      this.dialogVisibleAddEdit = true;
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSwitcher(is_deleted = 1) {
      const query = this.$route.query
      if (is_deleted === 2) {
        this.$router.push({
          path: "/home/protocol/college/recycle",
          query
        });
      } else {
        this.$router.push({
          path: "/home/protocol/college/list",
          query
        });
      }
    },
    handleSelect() {
      // this.$set(this.getForm,'keywords','');
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
    handleSelectionChange(val) {
      let Info = {};
      if (val.length > 1) {
        Object.assign(Info, {
          college: val[0].college,
          sfbz: val[0].sfbz,
          ks_charge: val[0].ks_charge || 1
        });
        let len = val.every(item => {
          if (item.contracts.length === 1) {
            if (!item.contracts[0].id) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        });
        //
        if (len) {
          let pro_com = [];
          let company_id = [];
          let pro_code_more = [];
          val.map(item => {
            const value = item.contracts[0];
            pro_com.push({
              pro_id: value.pro_id,
              com_id: value.com_id
            });
            company_id.push(value.company_id);
            pro_code_more.push(item.pro_code);
          });
          let same = company_id.every(item => {
            return item === company_id[0];
          });
          if (same) {
            Object.assign(this.collegeProtocolMore, {
              collegeProtocol: {
                pro_com: pro_com,
                company_id: company_id
              },
              sfbz: val[0].sfbz,
              ks_charge: val[0].ks_charge || 1,
              sfbz_dw: val[0].sfbz_dw,
              sfbz_xy: val[0].sfbz_xy,
              pro: val[0],
              college: val[0].college,
              college_id: val[0].college_id,
              tp: 1,
              pxlx: val[0].pxlx,
              HZ_id: val[0].contracts[0].com_id, //
              province: val[0].province,
              is_fzdw: val[0].is_fzdw || 0
            }, Info);
            const S = pro_code_more.join("、");
            sessionStorage.setItem("PEO_CODE_more", S);
            this.addStatus = false;
          } else {
            this.addStatus = true;
          }
        } else {
          this.addStatus = true;
        }
      } else {
        this.addStatus = true;
      }
    },
    handleAdd1(val, val0, tp, index) {
      const Obj = {
        collegeProtocol: {
          pro_com: [
            {
              pro_id: val.pro_id,
              com_id: val.com_id
            }
          ],
          company_id: [val.company_id]
        },
        college: val0.college,
        college_id: val0.college_id,
        sfbz: val0.sfbz,
        ks_charge: val0.ks_charge || 1,
        sfbz_dw: val0.sfbz_dw,
        sfbz_xy: val0.sfbz_xy,
        tp: tp,
        pro: val0,
        pxlx: val0.pxlx,
        HZ_id: val.com_id, ////
        province: val0.province,
        is_fzdw: val0.is_fzdw || 0
      };
      sessionStorage.setItem("collegeProtocol", JSON.stringify(Obj));
      sessionStorage.setItem("PEO_CODE_show", val0.pro_code);
      this.dialogVisibleAddEdit = true;
    },
    handleEdit(val, val0, type) {
      this.type_nonstandard = type;
      this.loading2 = true;
      const Obj = {
        collegeProtocol: {
          pro_com: [
            {
              pro_id: val.pro_id,
              com_id: val.com_id
            }
          ],
          company_id: [val.company_id]
        },
        id: val.id,
        tp: val.tp,
        pro: val0,
        // college:val0.college,
        // sfbz:val0.sfbz,
        // ks_charge: val0.ks_charge || 1,
        pxlx: val0.pxlx,
        province: val0.province,
        is_fzdw: val0.is_fzdw || 0
      };
      if (val.tp === 1) {
        sessionStorage.setItem("collegeProtocol", JSON.stringify(Obj));
        sessionStorage.setItem("PEO_CODE_show", val0.pro_code);
        this.$router.push("/home/protocol/college/edit/" + val.id);
      }
    },
    handleAddTrue() {
      this.$router.push("/home/protocol/college/add");
    },
    handleSubmit(id) {
      this.dialogShow = false;
      if (!this.dialogShow) {
        this.submitHz({
          data: {
            id: id ? id : this.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            // this.innerVisible1=false;
            this.dialogVisible = false;
            this.innerVisible2 = false;
            this.$message({
              type: "success",
              message: data.data.data,
              onClose: () => {
                this.initData();
              }
            });
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
    handleSubmit2(id) {
      this.id = id;
      this.innerVisible2 = true;
      this.dialogShow = true;
    },
    handlePdf(val) {
      let hrf =
        this.URL +
        this.hzExportUrl +
        "?authkey=" +
        this.headers.authkey +
        "&sessionid=" +
        this.headers.sessionid +
        "&id=" +
        val.id;
      window.open(hrf);
    },
    handleCheck(val, is_check, val0, is_signed, type) {
      this.type_nonstandard_check = type;
      if (is_signed) {
        if (val.tp === 1) {
          sessionStorage.setItem(
            "is_signed",
            JSON.stringify({
              is_signed: 2,
              ids: val.id
            })
          );
        }
      }
      if (val.tp === 1) {
        //
        sessionStorage.setItem("PXLX", val0.pxlx);
        sessionStorage.setItem("HZ_id", val.com_id); // 
        sessionStorage.setItem("HZ_pro_id", val.pro_id); // 
        sessionStorage.setItem("PEO_CODE_show", val0.pro_code);
        this.$router.push("/home/protocol/collegeCheck/" + val.id); // 
      }
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
            this.changeProtocolStatusHz({
              data: {
                ids: id,
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
        this.changeProtocolStatusHz({
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
    handleInfo(val, val0, is_signed) {
      if (is_signed) {
        if (val.tp === 2) {
          this.is_signed = true;
          Object.assign(this.signedForm, {
            ids: val.id,
            is_signed: 2
          });
        }
      } else {
        this.is_signed = false;
      }
      if (val.tp === 1) {
        sessionStorage.setItem("PXLX", val0.pxlx);
        sessionStorage.setItem("PEO_CODE_show", val0.pro_code);
        this.$router.push("/home/protocol/college/" + val.id);
      } else {
        this.handleCheck(val, false, val0);
      }
    },
    handlePrint(val, val0) {
      sessionStorage.setItem("PXLX", val0.pxlx);
      sessionStorage.setItem("PEO_CODE_show", val0.pro_code);
      this.$router.push("/home/protocol/college/" + val.id);
    },
    handleSignChange(val) {
      this.signHzProtocol({
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
          if (this.is_signed) {
            this.initData();
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleEditReset(val, val0) {
      sessionStorage.setItem("SQXG", true);
      this.handleEdit(val, val0);
    },
    handleEditResetCheck(val, val0) {
      const data = {
        pro_name: val0.pro_name,
        id: val.id
      };
      sessionStorage.setItem("modifyID", JSON.stringify(data));
      this.$router.push("/home/protocol/college/modify/list/3");
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleBalance(code) {
      window.open(this.lookUrl + "/" + code, "_blank");
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    this.initData();
    if (this.userInfo.role === 1) {
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
.info-border {
  padding-right: 120px;
  text-align: center;
  font-size: 18px;
  color: #303133;
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
.annotation {
  margin: 0;
  font-size: 12px;
  color: #8492a6;
}
</style>
