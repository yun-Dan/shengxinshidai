<template>
  <div
    class="app-curriculum-teacher"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl" style="margin-bottom: 10px">
          <el-button-group>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
            <el-button
              v-if="userInfo.role===1"
              icon="el-icon-plus"
              type="info"
              plain
              @click="handleAddH"
            >添加黑名单</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select
                v-model="getForm.is_black"
                placeholder="选择黑名单分类"
                @change="handleSelect"
              >
                <el-option label="-- 不限黑名单 --" :value="null"></el-option>
                <el-option label="非黑名单" :value="1"></el-option>
                <el-option label="黑名单" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.is_inschool"
                placeholder="选择教师类型"
                @change="handleSelect"
              >
                <el-option label=" -- 不限类型 -- " :value="null"></el-option>
                <el-option label="校内教师" :value="1"></el-option>
                <el-option label="校外教师" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="教师姓名" value="name"></el-option>
                <el-option label="单位名称" value="unit"></el-option>
                <el-option label="职称名称" value="job"></el-option>
                <el-option label="职工/身份证" value="idnumber"></el-option>
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
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{backgroundColor:'#fafafa'}"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="教师姓名"></el-table-column>
          <el-table-column align="center" prop="unit" label="单位名称"></el-table-column>
          <el-table-column align="center" prop="job" label="职称"></el-table-column>
          <el-table-column align="center" label="教师类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_inschool===1" type="success" size="mini">校内</el-tag>
              <el-tag v-if="scope.row.is_inschool===2" type="primary" size="mini">校外</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="idnumber" label="职工号/身份证号"></el-table-column>
          <el-table-column align="center" label="黑名单">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_black===1" type="info" size="mini">否</el-tag>
              <el-tag v-if="scope.row.is_black===2" type="danger" size="mini">黑名单</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_num" label="参与项目数"></el-table-column>
          <el-table-column align="center" prop="cou_num" label="参与课程数"></el-table-column>
          <el-table-column v-if="userInfo.role===1" align="center" label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" @click="handleLook(scope.row)">查看</el-button>
              <el-button type="text" @click.native="handleBlack(scope.row)">设置黑名单</el-button>
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
    <el-dialog
      title="黑名单设置"
      center
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form :model="blackForm" label-width="90px" style="text-align: left" v-cloak @submit.native.prevent>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="handleBlackTrue">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加黑名单"
      center
      :visible.sync="dialogVisibleBlack2"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <div v-loading="dialogLoadingBlack2">
        <el-form :model="blackForm2" label-position="top">
          <el-form-item label="教师姓名：">
            <el-input v-model.trim="blackForm2.name" placeholder="请输入教师姓名"></el-input>
          </el-form-item>
          <el-form-item label="教师类型：">
            <div style="padding-left: 20px">
              <el-radio-group v-model="blackForm2.is_inschool">
                <el-radio :label="1">校内</el-radio>
                <el-radio :label="2">校外</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="职称/职务：">
            <el-input v-model.trim="blackForm2.job" placeholder="请输入职称/职务"></el-input>
          </el-form-item>
          <el-form-item :label="blackForm2.is_inschool === 1 ? '职工号：' : '身份证号：'">
            <el-input
              v-model.trim="blackForm2.ibnumber"
              :placeholder="blackForm2.is_inschool === 1 ? '请输入职工号（8位）' : '请输入身份证号（18位）'"
            ></el-input>
          </el-form-item>
          <el-form-item label="工作单位：">
            <el-input v-model.trim="blackForm2.unit" placeholder="请输入工作单位"></el-input>
          </el-form-item>
          <el-form-item label="黒名单设置原因：">
            <el-input v-model.trim="blackForm2.black_note" placeholder="请输入原因"></el-input>
          </el-form-item>
        </el-form>
      </div>
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
  name: "app-curriculum-teacher",
  data() {
    return {
      loading2: false,
      total: 0,
      tableData: [],
      getForm: {
        is_black: null,
        is_inschool: null, //是否校内教师
        page: 1,
        limit: 20,
        sea_field: "name", //关键词字段(查询条件)(教师姓名（name）单位名称（unit）职称（job）职工、身份证号（idnumber）)
        keywords: ""
      },
      blackForm: {
        id: 0,
        is_black: 1,
        black_note: ""
      },
      dialogVisible: false,
      nowBlack: 0,
      //添加黑名单
      dialogVisibleBlack2: false,
      dialogLoadingBlack2: false,
      blackForm2: {
        name: "", // 教师姓名
        is_inschool: 1, //  是否校内教师：1是 2否
        job: "", // 职称/职务
        ibnumber: "", // 职工号/身份证号
        unit: "", // 单位
        is_black: 2,
        black_note: "", // 设置黑名单原因
        score: 100
      }
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getCurriculumTeacherList",
      "setTeacherBlack",
      "curriculumTeacherAddBlack"
    ]),
    initData() {
      this.loading2 = true;
      this.getCurriculumTeacherList({
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
      // 搜索事件
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入要搜索的教师姓名！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
        //  过滤搜索结果请求
      }
    },
    handleBlack(val) {
      this.nowBlack = val.is_black;
      Object.assign(this.blackForm, {
        id: val.id,
        is_black: val.is_black === 1 ? 2 : 1
      });
      this.dialogVisible = true;
    },
    handleBlackTrue() {
      this.setTeacherBlack({
        data: this.blackForm
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
    handleAddH() {
      // 添加黑名单
      Object.assign(this.blackForm2, this.$options.data().blackForm2);
      this.dialogVisibleBlack2 = true;
    },
    handleBlackTrue2() {
      if (!this.blackForm2.name) {
        this.$message({
          type: "warning",
          message: "请输入教师姓名！"
        });
        return false;
      }
      if (!this.blackForm2.job) {
        this.$message({
          type: "warning",
          message: "请输入职称/职务！"
        });
        return false;
      }
      if (!this.blackForm2.ibnumber) {
        this.$message({
          type: "warning",
          message: `请输入${
            this.blackForm2.is_inschool === 1 ? "职工号" : "身份证号"
          }！`
        });
        return false;
      }
      if (!this.blackForm2.unit) {
        this.$message({
          type: "warning",
          message: "请输入工作单位！"
        });
        return false;
      }
      if (!this.blackForm2.black_note) {
        this.$message({
          type: "warning",
          message: "请输入黒名单设置原因！"
        });
        return false;
      }
      this.dialogLoadingBlack2 = true;
      if (this.dialogLoadingBlack2) {
        this.curriculumTeacherAddBlack({
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
              message: data.data.error,
              onClose: () => {
                this.dialogLoadingBlack2 = false;
              }
            });
          }
        });
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
      this.$router.push({
        name: "AppCurriculumTeacherInfo",
        query: val
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
