<template>
  <div
    class="app-finance-expense"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/finance/expense/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box">
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
                <el-option label="招生对象" value="zsdx"></el-option>
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
      <div class="finance-account-main" v-cloak>
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
          <el-table-column align="center" prop="user" label="联系人"></el-table-column>
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
          <el-table-column align="center" label="项目审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.pro_status===0">未提交</span>
              <span v-if="scope.row.pro_status===1" style="color: #e6a23c">待审核</span>
              <span
                v-if="scope.row.pro_status===2||scope.row.pro_status===4"
                style="color: #f56c6c"
              >不通过</span>
              <span v-if="scope.row.pro_status===3" style="color: #67c23a">通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目报销">
            <template slot-scope="scope">
              <template v-if="scope.row.reim_data&&scope.row.reim_data.length">
                <el-button type="text" size="mini" @click.native="handleLook(scope.row)">
                  查看（报销
                  <strong>{{ scope.row.reim_data.length}}</strong>次）
                </el-button>
              </template>
              <span v-else style="color: #f56c6c">无报销数据</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--报销详情-->
    <el-dialog
      :title="dialogTableVisible_title"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="800px"
    >
      <el-table
        :data="gridData"
        border
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
        :header-cell-style="{backgroundColor:'#fafafa'}"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" label="日期" width="150">
          <template slot-scope="scope">{{ scope.row.time }}</template>
        </el-table-column>
        <el-table-column align="center" label="报销金额（元）" property="amount" width="120"></el-table-column>
        <el-table-column header-align="center" property="content" label="内容">
          <template>
            <div v-html="showContent"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-finance-expense",
  data() {
    return {
      loading2: false,
      total: 0,
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
        sea_field: "pro_code",
        keywords: "",
        page: 1,
        limit: 20
      },
      collegeList: [],
      structuresList: [],
      dialogTableVisible: false,
      dialogTableVisible_title: "",
      gridData: [], // 结算详情查看列表
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo']),
    showContent () {
      if (this.gridData[0] && this.gridData[0].content) {
        return this.gridData[0].content.replace(/,/g, ",<br/><br/>");
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapActions(["getStructures", "financeExpensePro"]),
    initData() {
      this.loading2 = true;
      this.financeExpensePro({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.total = Data.dataCount;
          this.tableData = Data.list;
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
    handleSizeChange(pageSize) {
      // pageSize 改变时会触发
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      //  currentPage 改变时会触发
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
    handleLook(val) {
      this.dialogTableVisible_title = val.pro_name + " " + val.pro_code;
      this.gridData = val.reim_data;
      this.dialogTableVisible = true;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "统计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
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
    this.initData();
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
  width: 50%;
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
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
</style>
