<template>
  <div
    class="app-finance-account"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/finance/account/list/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <template v-if="userInfo.role===1">
              <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
            </template>
            <template v-if="userInfo.role===2">
              <template v-if="switcher">
                <el-button @click.native="handleRecycle(0)" type="primary" icon="el-icon-delete">回收站</el-button>
              </template>
              <template v-if="!switcher">
                <el-button
                  @click.native="handleRecycle(1)"
                  type="primary"
                  icon="el-icon-d-arrow-left"
                >返回</el-button>
              </template>
              <el-button @click.native="handleAll" type icon="el-icon-menu">全部</el-button>
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
              <el-select
                v-model="getForm.pxlx"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类型 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.pxlx"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.xklb"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类别 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.xklb"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="手机号码" value="tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="finance-account-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="序号" align="center" width="46">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目名称" prop="pro_name" align="center" min-width="100"></el-table-column>
          <el-table-column v-if="userInfo.role===1" label="项目编号" prop="pro_code" align="center"></el-table-column>
          <el-table-column label="项目信息" header-align="center" width="150">
            <template slot-scope="scope">
              <div>
                <div v-if="userInfo.role===2">
                  <strong>项目编号：</strong>
                  {{ scope.row.pro_code }}
                </div>
                <div v-if="userInfo.role===2">
                  <strong>证书申领：</strong>
                  {{ scope.row.certf_num?scope.row.certf_num:0}} 人
                </div>
                <div class="clearfix">
                  <strong class="fl">学院：</strong>
                  <span class="fl" style="width: 88px">{{ scope.row.college }}</span>
                </div>
                <div v-if="scope.row.structure" class="clearfix">
                  <strong class="fl">部门：</strong>
                  <span class="fl" style="width: 88px">{{ scope.row.structure }}</span>
                </div>
                <div>
                  <strong>联系人：</strong>
                  {{ scope.row.user }}
                </div>
                <div>
                  <strong>开始时间：</strong>
                  {{ scope.row.px_start_time | TimestampChangeFilter }}
                </div>
                <div>
                  <strong>结束时间：</strong>
                  {{ scope.row.px_end_time | TimestampChangeFilter }}
                </div>
                <div>
                  <strong>计划培训天数：</strong>
                  {{ scope.row.pxts }} 天
                </div>
                <div>
                  <strong>培训类型：</strong>
                  <span
                    v-for="(item,key,index) in proConfig.pxlx"
                    :key="index"
                  >{{ scope.row.pxlx==key?item:''}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="userInfo.role===1" label="证书申领人数" align="center" min-width="70">
            <template slot-scope="scope">{{ scope.row.certf_num || 0 }} 人</template>
          </el-table-column>
          <el-table-column label="结算信息" align="center" min-width="640">
            <template slot-scope="scope0">
              <template v-if="scope0.row.balance_list.length">
                <div v-if="switcher" style="text-align: right;padding-right: 10px">
                  <template v-if="userInfo.role===2">
                    <el-button
                      :disabled="false"
                      v-if="scope0.row.balance_list['0'].status==5&&scope0.row.balance_list[scope0.row.balance_list.length-1].status==5"
                      type="text"
                      @click.native="handleAdd(scope0.row)"
                      style="padding: 1px;color: #1bc280"
                    >
                      <i class="fa fa-plus-square"></i>
                    </el-button>
                  </template>
                </div>
                <el-table
                  :data="scope0.row.balance_list"
                  size="mini"
                  class="app-finance-account-js"
                  :default-expand-all="true"
                  :header-cell-style="{backgroundColor:'oldlace'}"
                  style="width: 100%"
                >
                  <el-table-column type="expand" width="30">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <template v-if="props.row.balan_subcost && scope0.row.is_fzdw">
                          <el-form-item label="辅助单位本次分款金额：">
                            <span>{{ props.row.balan_subcost }} 元</span>
                          </el-form-item>
                          <el-form-item label="辅助单位本次分成比例：">
                            <span>{{ (Number(props.row.balan_subscale)*100).toFixed(2) }}%</span>
                          </el-form-item>
                        </template>
                        <el-form-item label="培训总天数：">
                          <span>{{ props.row.balan_days }} 天</span>
                        </el-form-item>
                        <el-form-item label="批准管理费比例：">
                          <span v-if="props.row.pzmanage_scale">{{ props.row.pzmanage_scale }} %</span>
                          <span v-else>无</span>
                        </el-form-item>
                        <template v-if="scope0.row.pxlx==6 && !isYXB">
                          <el-form-item label="就餐发票凭据：">
                            <a
                              v-if="props.row.dining_file"
                              class="link-pz"
                              :href="URL + financeAccountFileUrl + props.row.dining_file"
                              target="_blank"
                            >点击查看</a>
                            <span v-else>无</span>
                          </el-form-item>
                          <el-form-item label="住宿发票凭据：">
                            <a
                              v-if="props.row.house_file"
                              class="link-pz"
                              :href="URL + financeAccountFileUrl + props.row.house_file"
                              target="_blank"
                            >点击查看</a>
                            <span v-else>无</span>
                          </el-form-item>
                        </template>
                        <el-form-item
                          v-if="props.row.replaylist&&props.row.replaylist.length"
                          label="历史修改记录："
                          style="width: 90%"
                        >
                          <ul>
                            <li v-for="(item,index) in props.row.replaylist" :key="index">
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
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="js_username" label="经手人" min-width="40"></el-table-column>
                  <el-table-column align="center" prop="js_lxfs" label="手机号码" min-width="100"></el-table-column>
                  <el-table-column align="center" label="结算金额" min-width="100">
                    <template slot-scope="scope">{{ scope.row.balan_cost }}元</template>
                  </el-table-column>
                  <el-table-column align="center" prop="balan_pers" label="结算人数">
                    <template slot-scope="scope">{{ scope.row.balan_pers }}人</template>
                  </el-table-column>
                  <el-table-column align="center" prop="balan_pers" label="申请日期" min-width="90">
                    <template slot-scope="scope">{{ scope.row.ins_time | TimestampChangeFilter }}</template>
                  </el-table-column>
                  <el-table-column align="center" label="状态" min-width="50">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status===0">未提交</span>
                      <span v-if="scope.row.status===1" style="color: #e68607">待继续教育处审核</span>
                      <span v-if="scope.row.status===2" style="color: #e6a23c">待合同办审核</span>
                      <span v-if="scope.row.status===4" style="color: #f56c6c">不通过</span>
                      <span v-if="scope.row.status===5" style="color: #67c23a">通过</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="126">
                    <template slot-scope="scope">
                      <template v-if="switcher">
                        <template v-if="userInfo.role===1">
                          <template v-if="scope.row.status===1">
                            <el-button
                              type="text"
                              @click.native="handleCheck(scope.row,scope0.row)"
                              size="mini"
                            >审核</el-button>
                          </template>
                          <template v-if="scope.row.status===2">
                          </template>
                          <template v-if="scope.row.status===4||scope.row.status===5">
                            <el-button
                              type="text"
                              @click.native="handleCheck(scope.row,scope0.row)"
                              size="mini"
                            >重新审核</el-button>
                          </template>
                        </template>
                        <template v-if="userInfo.role===2">
                          <template v-if="scope.row.status===0">
                            <el-button
                              type="text"
                              @click.native="handleEdit(scope.row,scope0.row)"
                              size="mini"
                            >编辑</el-button>
                            <el-button
                              type="text"
                              @click.native="handleSubmit(scope.row)"
                              size="mini"
                            >提交</el-button>
                            <el-button
                              type="text"
                              @click.native="handleDelete(scope.row.id)"
                              size="mini"
                            >删除</el-button>
                          </template>
                          <template v-if="scope.row.status===4">
                            <el-button
                              type="text"
                              @click.native="handleEdit(scope.row,scope0.row)"
                              size="mini"
                            >编辑</el-button>
                          </template>
                          <!--结算打印的状态：第一条待合同审核过，往后管理员审核过后-->
                          <template v-if="scope.row.status===5">
                            <el-button
                              type="text"
                              @click.native="handlePrint(scope.row,scope0.row)"
                              size="mini"
                            >打印结算报告</el-button>
                          </template>
                        </template>
                      </template>
                      <template v-else>
                        <el-button
                          type="text"
                          @click.native="handleRestore(scope.row)"
                          size="mini"
                        >还原</el-button>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template v-else>
                <template v-if="(scope0.row.is_evaluated && scope0.row.is_evaluate && scope0.row.is_evaluate_pinggulv) || isYXB">
                  <span>未添加结算信息</span>
                  <el-button
                    v-if="userInfo.role===2"
                    type="text"
                    :disabled="false"
                    @click.native="handleAdd(scope0.row)"
                    style="color: #1bc280"
                  >【点击新增】</el-button>
                </template>
                <template v-else>
                  <span v-if="!scope0.row.is_evaluate_pinggulv">未评估（或未达到指定评估率），不能添加结算信息</span>
                  <template v-else>
                    <span v-if="!scope0.row.is_evaluate">指定的课程未评估（或未达到指定评估率），不能添加结算信息</span>
                  </template>
                </template>
              </template>
              <div
                v-if="userInfo.role===1 && scope0.row.balance_result && scope0.row.balance_result.length"
                style="text-align: left"
              >
                <el-button
                  type="text"
                  icon="el-icon-search"
                  @click="handleBalanceResult(scope0.row)"
                >财务结算结果</el-button>
                <span
                  style="font-weight: bolder"
                >【 {{ scope0.row.balance_result | BalanceResultTotal }} 】</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <p v-if="switcher">
          <strong>结算总金额：{{ totalData.total_cost }} 元</strong>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <strong>结算总人数：{{ totalData.total_pers }} 人</strong>
        </p>
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
    <!--        财务结算结果-->
    <el-dialog
      title="财务结算结果"
      :visible.sync="dialogVisible"
      width="50%"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-loading="dialogVisible_loading">
        <p>
          <span style="font-weight: bolder">{{ info.pro_name }}</span>
          <span>（{{ info.college }}）</span>
        </p>
        <div>
          <el-table :data="info.balance_result" style="width: 100%" :show-header="false" border>
            <el-table-column align="center" type="index"></el-table-column>
            <el-table-column label="信息">
              <template slot-scope="scope">
                <el-form :inline="true" label-width="130px">
                  <el-form-item label="结算编号：">
                    <div class="info-balance-result-v">{{ scope.row.classId }}</div>
                  </el-form-item>
                  <el-form-item label="结算次数：">
                    <div class="info-balance-result-v">{{ scope.row.settleCount }} 次</div>
                  </el-form-item>
                  <el-form-item label="凭证号：">
                    <div class="info-balance-result-v">{{ scope.row.voucherId }}</div>
                  </el-form-item>
                  <el-form-item label="凭证日期：">
                    <div class="info-balance-result-v">{{ scope.row.voucherTime }}</div>
                  </el-form-item>
                  <el-form-item label="申请部门：">
                    <div
                      class="info-balance-result-v"
                    >{{ college_users.college_name[scope.row.departmentId] || scope.row.departmentId }}</div>
                  </el-form-item>
                  <el-form-item label="申请编号：">
                    <div class="info-balance-result-v">{{ scope.row.applicationId }}</div>
                  </el-form-item>
                  <el-form-item label="申请人员：">
                    <div
                      class="info-balance-result-v"
                    >{{ college_users.user_name[scope.row.userId] || scope.row.userId }}</div>
                  </el-form-item>
                  <el-form-item label="分成比例：">
                    <div class="info-balance-result-v">{{ scope.row.divideRatio }} %</div>
                  </el-form-item>
                  <el-form-item label="实际分成金额：">
                    <div class="info-balance-result-v">{{ scope.row.divideAmount }} 元</div>
                  </el-form-item>
                  <el-form-item label="实际结算金额：">
                    <div class="info-balance-result-v">{{ scope.row.settleAmount }} 元</div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-finance-account",
  data() {
    return {
      loading2: false,
      total: 0,
      switcher: true,
      tableData: [],
      totalData: {
        total_cost: 0,
        total_pers: 0
      },
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        xklb: "",
        pxlx: "",
        college: null,
        structure: null,
        province: null,
        city: null,
        sea_field: "pro_code",
        keywords: "",
        page: 1,
        limit: 20,
        fields: [
          "id",
          "pro_code",
          "pro_name",
          "college",
          "structure",
          "user",
          "px_start_time",
          "px_end_time",
          "pxlx",
          "is_evaluated",
          "pxts",
          "sfbz",
          "sfbz_dw",
          "sfbz_xy"
        ]
      },
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      dialogVisible: false,
      dialogVisible_loading: false,
      info: {},
      college_users: {
        user_name: {},
        college_name: {}
      },
      
      isYXB: false
    };
  },
  computed: {
    ...mapState(["URL", 'financeAccountFileUrl', "uploadExcelUrl1", 'userInfo'])
  },
  filters: {
    BalanceResultTotal(list) {
      let divideAmount = 0; //实际分成金额
      let settleAmount = 0; // 际结算金额
      list.forEach(item => {
        divideAmount += item.divideAmount - 0;
        settleAmount += item.settleAmount - 0;
      });
      return `实际分成总金额：${divideAmount} 元、实际结算总金额：${settleAmount} 元。`;
    }
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getAreaList",
      "financeAccountPro",
      "getFinanceAccountDeleteBox",
      "lockFinanceAccount",
      "checkFinanceAccount",
      "deleteFinanceAccount",
      "restoreFinanceAccount",
      "getFinanceAccountSettlementUser"
    ]),
    initData() {
      this.loading2 = true;
      const path = this.$route;
      if (path.fullPath.indexOf("list") > 0) {
        this.switcher = true;
      } else {
        this.switcher = false;
      }
      if (path.fullPath.indexOf("list") > 0) {
        this.financeAccountPro({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
            this.$set(this.totalData, "total_cost", data.data.data.total_cost);
            this.$set(this.totalData, "total_pers", data.data.data.total_pers);
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
          this.loading2 = false;
        });
      } else {
        this.getFinanceAccountDeleteBox({
          data: {
            page: 1,
            limit: 20
          }
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
    handleRecycle(status) {
      // 1正常 0回收站
      const query = this.$route.query
      if (status) {
        this.$router.push({
          path: "/home/finance/account/list",
          query
        });
      } else {
        this.$router.push({
          path: "/home/finance/account/recycle",
          query
        });
      }
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
        this.showAll = true;
      }
    },
    handleAdd(val) {
      sessionStorage.setItem("finance_account_pro", JSON.stringify(val));
      this.$router.push({
        path: `/home/finance/account/add/${val.pro_id}`,
        query: {
          v_time: new Date().getTime()
        }
      });
    }, // 新增
    handleEdit(val, val0) {
      sessionStorage.setItem("finance_account_pro", JSON.stringify(val0));
      this.$router.push({
        path: `/home/finance/account/edit/${val.id}`,
        query: {
          v_time: val.ins_time * 1000 || new Date().getTime()
        }
      });
    }, // 编辑
    handleDelete(id) {
      this.$confirm("删除的结算可在回收站找回，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteFinanceAccount({
            id: id
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
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
    },
    handleRestore(val) {
      this.loading2 = true;
      const obj = {
        pro_id: val.pro_id,
        idarr: [val.id + ""]
      };
      this.restoreFinanceAccount({
        data: obj
      }).then(data => {
        if (data.data.code === 200) {
          this.loading2 = false;
          this.initData();
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
    }, // 还原
    handleSubmit(val) {
      this.loading2 = true;
      this.checkFinanceAccount({
        data: {
          id: val.id,
          status: 1,
          uid: this.userInfo.uid
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data,
            onClose: () => {
              this.loading2 = false;
            }
          });
          this.initData();
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
    },
    handleCheck(val, val0) {
      sessionStorage.setItem("PXLX6", val0.pxlx);
      sessionStorage.setItem("ACPI", JSON.stringify(val0));
      this.$router.push({
        path: `/home/finance/account/check/${val.id}`,
        query: {
          ins_time: val.ins_time,
          v_time: val.ins_time * 1000 || new Date().getTime()
        }
      });
    },
    handlePrint(val, val0) {
      // 打印结算报告
      sessionStorage.setItem("ACPI2", JSON.stringify(val0));
      this.$router.push({
        path: `/home/finance/account/print/${val.id}`,
        query: {
          ins_time: val.ins_time,
          v_time: val.ins_time * 1000 || new Date().getTime()
        }
      });
    },
    handleLock(val) {
      this.lockFinanceAccount({
        data: {
          id: val.id,
          lock: val.is_lock === 1 ? 2 : 1
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
    }, // 锁定操作
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
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleBalanceResult(val) {
      this.info = val;
      let colleges = [];
      let users = [];
      val.balance_result.forEach(item => {
        colleges.push(item.departmentId);
        users.push(item.userId);
      });
      this.dialogVisible = true;
      this.dialogVisible_loading = true;
      if (this.dialogVisible_loading) {
        this.getFinanceAccountSettlementUser({
          data: {
            college_code: colleges.join(","),
            user_code: users.join(",")
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.college_users = data.data.data;
            this.dialogVisible_loading = false;
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
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    const path = this.$route;
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
.demo-table-expand {
  font-size: 0;
  text-align: left;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 32%;
}
.finance-account-check-list li {
  line-height: 30px;
  border-bottom: 1px solid #8492a6;
  background-color: #fafafa;
}
li strong {
  display: inline-block;
  width: 140px;
}
.link-pz {
  color: #3a8ee6;
}
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}

.info-balance-result-v {
  width: 120px;
}
</style>
