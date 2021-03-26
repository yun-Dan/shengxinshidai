<template>
  <div
    class="app-finance-charge"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/finance/charge/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <template v-if="userInfo.role===1">
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
            </template>
            <el-form-item>
              <el-select v-model="getForm.province" placeholder="请选择">
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
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
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
      <div>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" width="46">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
          <el-table-column align="center" label="主办学院">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color: #909399">
                <div>{{ scope.row.college }}</div>
                <div v-if="scope.row.structure" style="line-height: 20px">{{ scope.row.structure }}</div>
                <div style="line-height: 20px">{{ scope.row.realname }}</div>
              </div>
              <template v-else>
                <div>{{ scope.row.college }}</div>
                <div
                  v-if="scope.row.structure"
                  style="color: #5E7E9F;line-height: 20px"
                >{{ scope.row.structure }}</div>
                <div style="color: #199f93;line-height: 20px">{{ scope.row.realname }}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pxlx" label="培训类型">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color: #909399">
                <span v-if="scope.row.pxlx===0">未分配</span>
                <template v-for="(val,key,index) in proConfig.pxlx">
                  <span v-if="scope.row.pxlx==key" :key="index">{{ val}}</span>
                </template>
              </div>
              <template v-else>
                <span v-if="scope.row.pxlx===0" style="color: #ff0000">未分配</span>
                <template v-for="(val,key,index) in proConfig.pxlx">
                  <span v-if="scope.row.pxlx==key" :key="index">{{ val}}</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="xklb" label="学科类别">
            <template slot-scope="scope">
              <template v-for="(val,key,index) in proConfig.xklb">
                <span v-if="scope.row.xklb==key" :key="index">{{ val}}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="user" label="联系人">
            <template slot-scope="scope">
              <el-tooltip :content="`电话：${scope.row.tel}`" placement="bottom" effect="light">
                <span>{{ scope.row.user }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收费管理">
            <template slot-scope="scope">
              <el-button type="text" @click.native="handleInfo(scope.row)">查看详情</el-button>
              <div v-if="userInfo.role===2">
                <el-button type="text" @click.native="handleLink(scope.row)">单点登录</el-button>
              </div>
              <div v-if="scope.row.fee_url">
                <el-button
                  type="text"
                  @click.native="handleUrl(scope.row)"
                  :disabled="scope.row.fee_url?false:true"
                >查看收费地址</el-button>
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
      <!--查看收费列表-->
      <el-dialog
        :title="dialogTableVisible_title"
        :visible.sync="dialogTableVisible"
        width="80%"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
      >
        <el-table :data="charge_tableData" border :header-cell-style="{backgroundColor:'#fafafa'}">
          <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
          <el-table-column align="center" label="缴费人员编号" property="rybh" width="180"></el-table-column>
          <el-table-column align="center" label="缴费人姓名" property="ryxm"></el-table-column>
          <el-table-column align="center" property="sfxmdm" label="收费项目代码"></el-table-column>
          <el-table-column align="center" property="yjje" label="应缴金额（元）"></el-table-column>
          <el-table-column align="center" property="sjje" label="实缴金额（元）"></el-table-column>
          <!--<el-table-column-->
          <!--align="center"-->
          <!--property="yhddh"-->
          <!--label="银行订单号">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--align="center"-->
          <!--label="交易时间"-->
          <!--min-width="130px">-->
          <!--<template slot-scope="scope">-->
          <!--{{ scope.row.jysj}}-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-dialog>
      <!--收费地址-->
      <el-dialog
        title="收费地址信息"
        :visible.sync="dialogVisible_url"
        width="400px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
      >
        <div style="text-align: center">
          <span>地址：</span>
          <span style="word-wrap : break-word ;">{{ fee_url}}</span>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogVisible_url = false" type="primary" size="small">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-finance-charge",
  data() {
    return {
      loading2: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        xklb: "",
        pxlx: "",
        college: null,
        structure: null,
        province: null,
        city: null,
        sea_field: "pro_code", //关键词字段(查询条件)（pro_name项目,pro_code项目编号,user联系人,tel联系方式）
        keywords: "",
        page: 1,
        limit: 20
      },
      total: 0,
      tableData: [],
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      dialogTableVisible: false,
      dialogTableVisible_title: "",
      charge_getForm: {
        code: null,
        page: 1,
        limit: 100
      },
      charge_total: 0,
      charge_tableData: [],
      //    收费地址
      dialogVisible_url: false,
      fee_url: "",
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getAreaList",
      "getFinanceChargeList",
      "getFinanceChargeLink"
    ]),
    initData() {
      this.loading2 = true;
      if (this.loading2) {
        this.getFinanceChargeList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            this.total = Data.dataCount;
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
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索关键字！",
          type: "warning"
        });
      } else {
        this.initData();
      }
    },
    handleInfo(val) {
      sessionStorage.setItem("finance_charge_info", JSON.stringify(val));
      this.$router.push("/home/finance/charge/info/" + val.pro_code);
    },
    handleUrl(val) {
      this.fee_url = val.fee_url;
      this.dialogVisible_url = true;
    },
    handleLink(val) {
      this.getFinanceChargeLink({
        data: {
          uid: val.uid,
          pro_code: val.pro_code
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          sessionStorage.setItem("charge", JSON.stringify(Data));
          // this.$router.push("/charge");
          window.open("/charge")
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
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
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
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
    }
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
    this.initData();
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
    }
  }
};
</script>
