<template>
  <div
    class="app-helperunit-index"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
            <el-button v-if="userInfo.role===1" icon="el-icon-plus" @click="handleAddH">新 增</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select
                v-model="getForm.is_black"
                placeholder="名单类型"
                @change="handleSearch"
                clearable
                style="width: 120px"
              >
                <el-option label=" -- 全部 -- " :value="null"></el-option>
                <el-option label="白名单" :value="1"></el-option>
                <el-option label="黑名单" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索辅助单位名称"
                v-model.trim="getForm.yf_dwmc"
                class="input-with-select"
                clearable
                style="width: 200px"
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="app-helperunit-index-main" v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="yf_dwmc" label="辅助单位名称"></el-table-column>
          <el-table-column align="center" prop="pro_num" label="办班数量统计"></el-table-column>
          <el-table-column align="center" label="名单类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_black===1" type="info" size="mini">白名单</el-tag>
              <el-tag v-if="scope.row.is_black===2" type="danger" size="mini">黑名单</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <template v-if="userInfo.role===1">
                <el-button type="text" size="mini" @click.native="handleInfo(scope.row)">查看</el-button>
                <!--<el-button type="text" size="mini" @click.native="handleGrade(scope.row)">考核</el-button>-->
                <el-button type="text" size="mini" @click.native="handleBlack(scope.row)">设置名单</el-button>
                <!--<el-button type="text" size="mini" @click.native="handleGradeList(scope.row)">查看总体考核情况</el-button>-->
              </template>
              <template v-if="userInfo.role===2">
                <el-button type="primary" size="mini" @click.native="handleInfo(scope.row)" plain>查看</el-button>
                <!--<el-button type="text" size="mini" @click.native="handleGradeList(scope.row)">查看总体考核情况</el-button>-->
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
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
    <!--扣分-->
    <el-dialog
      center
      title="辅助单位考核"
      :visible.sync="dialogVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="gradeForm" v-cloak>
        <el-form-item label="当前分值：">
          <span v-if="showGrade>=60" style="color: #67c23a">{{ showGrade }}</span>
          <span v-else style="color: #f56c6c">{{ showGrade }}</span>
          分
        </el-form-item>
        <el-form-item label="本次考核扣除分数：" class="input-center" :rules="[{required:true}]">
          <el-row>
            <el-col :xs="24" :sm="18" :md="14" :lg="12">
              <div class="grid-content bg-purple">
                <el-input v-model.trim="gradeForm.decmark"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="考核说明：">
          <el-input type="textarea" v-model.trim="gradeForm.cause" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleGradeTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!--设置黑名单-->
    <el-dialog
      title="名单设置"
      center
      :visible.sync="dialogVisibleBlack"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form :model="blackForm" label-width="90px" v-cloak>
        <el-form-item label="黑名单：">{{ nowBlack===1?'未设置':'已设置'}}</el-form-item>
        <el-form-item label="设置：" :rules="[{required:true}]">
          <el-radio-group v-model="blackForm.is_black">
            <el-radio :label="1">移出黑名单</el-radio>
            <el-radio :label="2">加入黑名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设置原因：">
          <el-input type="textarea" v-model.trim="blackForm.black_note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBlack = false">取 消</el-button>
        <el-button type="primary" @click.native="handleBlackTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加黑名单-->
    <el-dialog
      title="添加名单"
      center
      :visible.sync="dialogVisibleBlack2"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form :model="blackForm2" label-position="top">
        <el-form-item label="名单类型：">
          <el-radio-group v-model="blackForm2.is_black">
            <el-radio :label="1">白名单</el-radio>
            <el-radio :label="2">黑名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位名称：">
          <el-input v-model.trim="blackForm2.yf_dwmc" placeholder="请输入单位名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBlack2 = false">取 消</el-button>
        <el-button type="primary" @click.native="handleBlackTrue2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-helperunit-index",
  data() {
    return {
      loading2: false,
      getForm: {
        yf_dwmc: "",
        page: 1,
        limit: 20,
        is_black: null
      },
      tableData: [],
      total: 0,
      gradeForm: {
        tid: 0,
        decmark: 0, // 要扣掉的分数
        cause: ""
      },
      residue: 0, // 分数
      dialogVisible: false,
      visible2: "",
      dialogVisibleBlack: false,
      blackForm: {
        id: 0,
        is_black: 1,
        black_note: ""
      },
      nowBlack: 0,
      //添加黑名单
      dialogVisibleBlack2: false,
      blackForm2: {
        yf_dwmc: "",
        uid: null,
        is_black: 1,
        score: 100
      }
    };
  },
  computed: {
    ...mapState(['userInfo']),
    showGrade() {
      return this.residue - this.gradeForm.decmark;
    }
  },
  methods: {
    ...mapActions([
      "getHelperunit",
      "helperunitBlack",
      "helperunitMark",
      "helperunitAddBlack"
    ]),
    initData() {
      this.loading2 = true;
      this.getHelperunit({
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
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      this.$set(this.getForm, "page", 1);
      this.initData();
    },
    handleAddH() {
      // 添加黑名单
      Object.assign(this.blackForm2, this.$options.data().blackForm2, {
        uid: this.userInfo.uid
      });
      this.dialogVisibleBlack2 = true;
    },
    handleBlackTrue2() {
      if (!this.blackForm2.yf_dwmc) {
        this.$message({
          type: "warning",
          message: "请输入单位名称！"
        });
        return false;
      } else {
        this.helperunitAddBlack({
          data: this.blackForm2
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisibleBlack2 = false;
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
    handleInfo(val) {
      sessionStorage.setItem("fz_dwmc", val.yf_dwmc);
      this.$router.push("/home/helperunit/index/info");
    },
    handleGrade(val) {
      this.residue = val.score;
      Object.assign(this.gradeForm, {
        id: val.id,
        decmark: 0,
        cause: ""
      });
      this.dialogVisible = true;
    },
    handleGradeTrue() {
      if (isNaN(this.gradeForm.decmark)) {
        this.$message({
          type: "warning",
          message: "扣除分数必须为数字！"
        });
        return false;
      } else {
        if (!this.gradeForm.decmark) {
          this.$message({
            type: "warning",
            message: "请输入扣除的分数！"
          });
          return false;
        }
      }

      this.helperunitMark({
        data: this.gradeForm
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.dialogVisible = false;
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleBlack(val) {
      this.nowBlack = val.is_black;
      Object.assign(this.blackForm, {
        id: val.id,
        is_black: val.is_black === 1 ? 2 : 1
      });
      this.dialogVisibleBlack = true;
    },
    handleBlackTrue() {
      this.helperunitBlack({
        data: this.blackForm
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.dialogVisibleBlack = false;
          this.initData();
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
      // console.log(this.$el.offsetParent.offsetParent,'滚动元素');
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    }
  },
  created() {
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>
