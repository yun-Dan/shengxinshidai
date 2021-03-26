<template>
  <div class="app-data-index" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="clearfix query-box">
          <div class="fl" style="margin-bottom: 20px">
            <el-button-group>
              <el-button type="primary" icon="el-icon-menu" @click.native="handleAll">全部</el-button>
              <el-button type icon="el-icon-close" @click.native="handleClear(true)">清除</el-button>
            </el-button-group>
          </div>
          <div class="fr">
            <el-form inline @submit.native.prevent>
              <el-form-item v-if="userInfo.role === 1">
                <el-select
                  v-model="getForm.college"
                  placeholder="项目所属学院"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
                  <el-option
                    v-for="(item,index) in collegeList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="userInfo.role === 1">
                <el-select
                  v-model="getForm.structure"
                  placeholder="项目所属部门"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
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
                  placeholder="项目举办省份"
                  clearable
                  filterable
                >
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
                  placeholder="项目举办市区"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
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
                  v-model="getForm.qy_province"
                  placeholder="企业所在省份"
                  clearable
                  filterable
                >
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
                  v-model="getForm.qy_city"
                  placeholder="企业所在市区"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
                  <el-option
                    v-for="(item,index) in dw_cityList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="getForm.pxlx"
                  placeholder="选择培训类型"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
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
                  placeholder="选择学科类别"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
                  <el-option
                    v-for="(item,key,index) in proConfig.xklb"
                    :label="item"
                    :value="key"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="fr">
            <el-form inline @submit.native.prevent>
              <el-form-item>
                <el-date-picker
                  v-model="cert_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="证书申领时间"
                  range-separator="至"
                  end-placeholder="证书申领时间"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="zssq_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="证书申请修改"
                  range-separator="至"
                  end-placeholder="证书申请修改"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="stu_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="学员入库时间"
                  range-separator="至"
                  end-placeholder="学员入库时间"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="bal_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="结算时间"
                  range-separator="至"
                  end-placeholder="结算时间"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="fr">
            <el-form inline @submit.native.prevent>
              <el-form-item>
                <el-date-picker
                  v-model="pro_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="立项时间"
                  range-separator="至"
                  end-placeholder="立项时间"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="px_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="项目培训时间"
                  range-separator="至"
                  end-placeholder="项目培训时间"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="ques_time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="评估时间"
                  range-separator="至"
                  end-placeholder="评估时间"
                  value-format="timestamp"
                  :default-time="['00:00:00', '00:00:00']"
                  style="width: 244px;"
                  :disabled="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="getForm.year"
                  type="year"
                  placeholder="选择年份"
                  value-format="yyyy"
                  style="width: 120px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-select v-model="getForm.month" clearable placeholder="请选择月份">
                  <el-option v-for="item in 12" :key="item" :label="item+'月'" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="getForm.pro_name"
                  placeholder="输入项目名称"
                  style="width: 244px;"
                  clearable
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="fr" style="clear: right">
            <el-form inline @submit.native.prevent>
              <el-form-item>
                <el-select
                  v-model="getForm.status"
                  placeholder="项目状态"
                  clearable
                  filterable
                  @change="handleSelectChange"
                >
                  <el-option label="正常" :value="0"></el-option>
                  <el-option label="已删除" :value="1"></el-option>
                  <el-option label="已作废" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="getForm.pro_code"
                  placeholder="项目编号"
                  style="width: 120px;"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="getForm.jf_dwmc"
                  placeholder="输入委托单位名称"
                  style="width: 244px;"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="getForm.yf_dwmc"
                  placeholder="输入辅助单位名称"
                  style="width: 244px;"
                  clearable
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          <div class="fl">
            <el-button
              type="text"
              icon="el-icon-sold-out"
              @click.native="handleExcel"
              style="font-size: 16px;line-height: 28px"
            >导出Excel</el-button>
          </div>
          <div class="fr">
            <div style="display: inline-block;padding-right: 20px">
              共搜索到
              <strong style="color: #5daf34">
                {{ total || 0 }}
              </strong> 条数据
            </div>
            <el-button type="success" icon="el-icon-search" @click.native="handleSearch">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="data-index-main">
        <el-table
          :data="tableData"
          border
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%;font-size: 12px;line-height: 18px"
        >
          <el-table-column align="center" label="序号" width="44">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称" min-width="38"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号" width="30">
            <template slot-scope="scope">
              <div style="width: 12px">{{ scope.row.pro_code }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="college" label="学院名称" width="38"></el-table-column>
          <el-table-column align="center" prop="structure" label="部门名称" width="38">
            <template slot-scope="scope">
              <span v-if="scope.row.structure">{{ scope.row.structure }}</span>
              <span v-else style="color: #f56c6c">无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="gl_type" label="管理类别" width="38">
            <template slot-scope="scope">{{ scope.row.gl_type | showType('gl_type',proConfig) }}</template>
          </el-table-column>
          <el-table-column align="center" prop="xklb" label="学科类别" width="38">
            <template slot-scope="scope">{{ scope.row.xklb | showType('xklb',proConfig) }}</template>
          </el-table-column>
          <el-table-column align="center" prop="pxlx" label="培训类型" width="38">
            <template slot-scope="scope">{{ scope.row.pxlx | showType('pxlx',proConfig) }}</template>
          </el-table-column>
          <el-table-column align="center" label="招生人数" width="44">
            <template slot-scope="scope">
              {{ scope.row.zsrs }}
              <br>人
            </template>
          </el-table-column>
          <el-table-column align="center" label="培训时间" width="38">
            <template slot-scope="scope">
              {{ scope.row.px_start_time | TimestampChangeFilter(true) }}
              <div style="transform:rotate(90deg)">（</div>至
              <div style="transform:rotate(90deg)">）</div>
              {{ scope.row.px_end_time | TimestampChangeFilter(true) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="培训天数" width="44">
            <template slot-scope="scope">
              {{ scope.row.pxts }}
              <br>天
            </template>
          </el-table-column>
          <el-table-column align="center" label="培训金额" width="80">
            <template slot-scope="scope">
              {{ scope.row.sr_jhsr }}
              <br>元
            </template>
          </el-table-column>
          <el-table-column align="center" label="委托单位名称" width="38">
            <template slot-scope="scope">
              <span v-if="scope.row.jf_dwmc.length">{{ scope.row.jf_dwmc.join('、') }}</span>
              <span v-else style="color: #f56c6c">无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="辅助单位名称" width="38">
            <template slot-scope="scope">
              <span v-if="scope.row.yf_dwmc">{{ scope.row.yf_dwmc }}</span>
              <span v-else style="color: #f56c6c">无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="入库学员人数" width="44">
            <template slot-scope="scope">
              {{ scope.row.students?scope.row.students:0}}
              <br>人
            </template>
          </el-table-column>
          <el-table-column align="center" label="考核结果" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.grade">{{ scope.row.grade }}</span>
              <span v-else style="color: #f56c6c">未评估</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评估得分" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.pg_nums">
                {{ scope.row.pg_score }}
                <br>分
              </span>
              <span v-else style="color: #f56c6c">未评估</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评估率" width="70">
            <template slot-scope="scope">
              <span
                v-if="scope.row.pg_nums&&scope.row.students"
              >{{ scope.row.pg_nums | showDecimal( scope.row.students , 100 ) }}%</span>
              <span v-else style="color: #f56c6c">未评估</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证书名称" width="38">
            <template slot-scope="scope">
              <span v-if="scope.row.cert_name">{{ scope.row.cert_name }}</span>
              <span v-else style="color: #f56c6c">未申领</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证书申请时间" width="38">
            <template slot-scope="scope">
              <span
                v-if="scope.row.cert_time"
              >{{ scope.row.cert_time | TimestampChangeFilter(true) }}</span>
              <span v-else style="color: #f56c6c">未申领</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="cert_nums" label="证书申领人数" width="42">
            <template slot-scope="scope">
              <span v-if="scope.row.cert_nums">{{ scope.row.cert_nums }}</span>
              <span v-else style="color: #f56c6c">未申领</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证书结算情况" width="38">
            <template slot-scope="scope">
              <span v-if="scope.row.is_sett===1" style="color: #f56c6c">证书申领未结算</span>
              <span v-else-if="scope.row.is_sett===2">证书申领已结算</span>
              <span v-else style="color: #f56c6c">未申领</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结算金额" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.balan_cost">
                {{ scope.row.balan_cost }}
                <br>元
              </div>
              <span v-else style="color: #f56c6c">未结算</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="balan_pers" label="结算人数" width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.balan_pers">{{ scope.row.balan_pers }}人</div>
              <span v-else style="color: #f56c6c">未结算</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="分成金额" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.balan_subcost">
                {{ scope.row.balan_subcost }}
                <br>元
              </div>
              <span v-else style="color: #f56c6c">无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="balan_nums" label="结算次数" width="40">
            <template slot-scope="scope">{{ scope.row.balan_nums?scope.row.balan_nums:0}}</template>
          </el-table-column>
          <el-table-column align="center" label="结算时间" width="38">
            <template slot-scope="scope">
              <template v-if="scope.row.bal_min_time">
                {{ scope.row.bal_min_time | TimestampChangeFilter(true) }}
                <template
                  v-if="scope.row.bal_max_time"
                >
                  <div style="transform:rotate(90deg)">（</div>至
                  <div style="transform:rotate(90deg)">）</div>
                  {{ scope.row.bal_max_time | TimestampChangeFilter(true) }}
                </template>
              </template>
              <span v-else style="color: #f56c6c">未结算</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pzmanage_scale" label="批准管理费比例" width="46">
            <template slot-scope="scope">
              <span v-if="scope.row.pzmanage_scale">{{ scope.row.pzmanage_scale }}%</span>
              <span v-else style="color: #f56c6c">无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="人均费用—————人均日费用" width="90">
            <template slot-scope="scope">
              <template v-if="scope.row.balan_cost">
                <span v-if="scope.row.balan_pers">
                  {{ scope.row.balan_cost | showDecimal( scope.row.balan_pers ) }}
                  <br>元
                </span>
                <span>—————</span>
                <span v-if="scope.row.balan_pers&&scope.row.balan_days">
                  {{ scope.row.balan_cost | showDecimalPlus( scope.row.balan_pers , scope.row.balan_days ) }}
                  <br>元
                </span>
              </template>
              <span v-else style="color: #f56c6c">未结算</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目状态" width="38">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" class="success">正常</span>
              <span v-if="scope.row.status === 1" class="danger">已删除</span>
              <span v-if="scope.row.status === 2" class="info">已作废</span>
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
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-data-index",
  data() {
    return {
      loading: false,
      is_clear: false,
      pro_time: "",
      stu_time: "",
      cert_time: "",
      zssq_time: "",
      bal_time: "",
      ques_time: "",
      px_time: "",
      getForm: {
        college: null,
        structure: null,
        province: null,
        city: null,
        qy_province: null,
        qy_city: null,
        pxlx: "",
        xklb: "",
        status: null,
        page: 1,
        limit: 20,
        pro_code: null,
        pro_name: "",
        yf_dwmc: "", // 辅助单位
        jf_dwmc: "", // 委托单位
        year: null,
        month: null,
        pro_start_time: null,
        pro_end_time: null,
        cert_start_time: null,
        cert_end_time: null,
        zssq_start_time: null,
        zssq_end_time: null,
        bal_start_time: null,
        bal_end_time: null,
        stu_start_time: null,
        stu_end_time: null,
        ques_start_time: null,
        ques_end_time: null,
        px_start_time: null,
        px_end_time: null
      },
      tableData: [],
      total: 0,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      dw_cityList: [],
      headers: {}
    };
  },
  computed: {
    ...mapState(["URL", "dataExorpUrl", 'userInfo'])
  },
  filters: {
    showType(val, type, proConfig) {
      let show = "";
      for (let key in proConfig[type]) {
        if (key == val) {
          show = proConfig[type][key];
        }
      }
      return show;
    },
    showDecimal(num1, num2, ratio = 1, N = 2) {
      if (num1 >= 0 && num2 > 0) {
        let Val = ((num1 / num2) * ratio).toFixed(N);
        return Val;
      } else {
        return "无";
      }
    },
    showDecimalPlus(num1, num2, num3) {
      if (num1 >= 0 && num2 > 0 && num3 > 0) {
        let Val = (num1 / num2 / num3).toFixed(2);
        return Val;
      } else {
        return "无";
      }
    }
  },
  methods: {
    ...mapActions(["getStructures", "getAreaList", "getDataTotalList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getDataTotalList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            this.total = Data.dataCount;
            this.is_clear = false;
            this.loading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleAll() {
      this.handleClear(false);
      this.initData();
    },
    handleClear(clear) {
      this.is_clear = clear;
      if (clear) {
        this.tableData = [];
        this.total = 0;
      }
      Object.assign(this.getForm, this.$options.data().getForm);
      this.pro_time = "";
      this.stu_time = "";
      this.cert_time = "";
      this.zssq_time = "";
      this.bal_time = "";
      this.ques_time = "";
      this.px_time = "";
      if (clear) {
        setTimeout(() => {
          this.is_clear = false;
        }, 1000);
      }
    },
    handleExcel() {
      const Obj = {
        authkey: this.headers.authkey,
        sessionid: this.headers.sessionid
      };
      Object.assign(Obj, this.getForm);
      for (let key in Obj) {
        if (!Obj[key]) {
          delete Obj[key];
        }
      }
      delete Obj.page;
      delete Obj.limit;
      if (Obj) {
        const params_list = [];
        for (let key in Obj) {
          params_list.push(key + "=" + Obj[key]);
        }
        const params_str = params_list.join("&");
        let hrf = this.URL + this.dataExorpUrl + "?" + params_str;
        window.open(hrf);
      }
    },
    handleSearch() {
      if (this.pro_time) {
        let start = this.pro_time[0] / 1000;
        let end = (this.pro_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "pro_start_time", start);
        this.$set(this.getForm, "pro_end_time", end);
      } else {
        this.$set(this.getForm, "pro_start_time", null);
        this.$set(this.getForm, "pro_end_time", null);
      }
      if (this.cert_time) {
        let start = this.cert_time[0] / 1000;
        let end = (this.cert_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "cert_start_time", start);
        this.$set(this.getForm, "cert_end_time", end);
      } else {
        this.$set(this.getForm, "cert_start_time", null);
        this.$set(this.getForm, "cert_end_time", null);
      }
      if (this.zssq_time) {
        let start = this.zssq_time[0] / 1000;
        let end = (this.zssq_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "zssq_start_time", start);
        this.$set(this.getForm, "zssq_end_time", end);
      } else {
        this.$set(this.getForm, "zssq_start_time", null);
        this.$set(this.getForm, "zssq_end_time", null);
      }
      if (this.stu_time) {
        let start = this.stu_time[0] / 1000;
        let end = (this.stu_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "stu_start_time", start);
        this.$set(this.getForm, "stu_end_time", end);
      } else {
        this.$set(this.getForm, "stu_start_time", null);
        this.$set(this.getForm, "stu_end_time", null);
      }
      if (this.bal_time) {
        let start = this.bal_time[0] / 1000;
        let end = (this.bal_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "bal_start_time", start);
        this.$set(this.getForm, "bal_end_time", end);
      } else {
        this.$set(this.getForm, "bal_start_time", null);
        this.$set(this.getForm, "bal_end_time", null);
      }
      if (this.ques_time) {
        let start = this.ques_time[0] / 1000;
        let end = (this.ques_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "ques_start_time", start);
        this.$set(this.getForm, "ques_end_time", end);
      } else {
        this.$set(this.getForm, "ques_start_time", null);
        this.$set(this.getForm, "ques_end_time", null);
      }
      if (this.px_time) {
        let start = this.px_time[0] / 1000;
        let end = (this.px_time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "px_start_time", start);
        this.$set(this.getForm, "px_end_time", end);
      } else {
        this.$set(this.getForm, "px_start_time", null);
        this.$set(this.getForm, "px_end_time", null);
      }
      this.initData();
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
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleSelectChange() {
      if (!this.is_clear) {
        this.handleSelect();
      }
    }
  },
  beforeMount() {
    this.getStructures({
      data: {}
    }).then(data => {
      if (data.data.code === 200) {
        const Data = data.data.data;
        Data.forEach(item => {
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
    if (this.$cookie.get("headers")) {
      this.headers = JSON.parse(this.$cookie.get("headers"));
    }
  },
  watch: {
    "getForm.province"() {
      if (!this.is_clear) {
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
      }
    },
    "getForm.qy_province"() {
      if (!this.is_clear) {
        this.handleSelect();
        this.$set(this.getForm, "qy_city", null);
        if (1) {
          this.getAreaList({
            data: {
              pid: this.getForm.qy_province
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              this.dw_cityList = Data.list;
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.data-index-main {
  padding: 20px 0;
}
.page-box {
  padding-bottom: 20px;
}
</style>
