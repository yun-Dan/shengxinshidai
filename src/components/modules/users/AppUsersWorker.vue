<template>
  <div
    class="app-users-worker"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl" style="margin-bottom: 10px">
          <el-button-group>
            <template v-if="getForm.status === 1">
              <el-button
                @click.native="handleUpdate(-1)"
                type="primary"
                icon="el-icon-plus"
                key="1"
              >新增</el-button>
              <el-button
                type="primary"
                plain
                @click.native="handleSwitch(0)"
                icon="el-icon-delete"
              >回收站</el-button>
              <el-button type @click.native="handleSearch(true)" icon="el-icon-menu" key="2">全部</el-button>
              <el-button
                v-if="showDelete"
                @click.native="handleDeleteStatus(1,-1)"
                type="danger"
                icon="el-icon-delete"
                key="3"
              >删除</el-button>
            </template>
            <template v-else>
              <el-button
                type="primary"
                @click.native="handleSwitch(1)"
                key="4"
                icon="el-icon-d-arrow-left"
              >返 回</el-button>
              <el-button
                v-if="showDelete"
                @click.native="handleDeleteStatus(0,-1)"
                key="5"
                icon="el-icon-check"
              >还 原</el-button>
              <el-button
                v-if="showDelete"
                @click.native="handleDelete(0)"
                type="danger"
                key="6"
                icon="el-icon-delete"
              >彻底删除</el-button>
            </template>
          </el-button-group>
        </div>
        <div v-if="getForm.status" class="fr query-box" @keyup.enter="handleSearch(false)">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.college_id" placeholder="请选择" @change="handleSelect">
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
              <el-select v-model="getForm.structure_id" placeholder="请选择" @change="handleSelect">
                <el-option label="-- 不限部门 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in structuresList2"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="姓名或职工号"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
                style="width: 220px"
              >
                <el-button @click.native="handleSearch(false)" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="users-worker-main">
        <el-table
          :data="tableData"
          size="mini"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="46"></el-table-column>
          <el-table-column align="center" label="序号" width="46">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" min-width="40">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="click">
                <el-table :data="userInfoArr" :border="true">
                  <el-table-column property="realname" label="姓名" align="center"></el-table-column>
                  <el-table-column property="username" label="账号" align="center"></el-table-column>
                  <el-table-column property="c_name" label="学院" align="center"></el-table-column>
                  <el-table-column property="s_name" label="部门" align="center"></el-table-column>
                  <el-table-column property="job" label="职务" align="center"></el-table-column>
                  <el-table-column property="mobile" label="手机" align="center"></el-table-column>
                  <el-table-column property="email" label="邮箱" align="center"></el-table-column>
                  <el-table-column property="tel" label="办公电话" align="center"></el-table-column>
                  <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time | showTime }}</template>
                  </el-table-column>
                  <el-table-column property="last_ip" label="最后登录IP" align="center" width="88"></el-table-column>
                </el-table>
                <el-button
                  @click.native="handleInfo(scope.row)"
                  type="text"
                  slot="reference"
                >{{ scope.row.realname }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="username" label="账号【职工号】" min-width="50"></el-table-column>
          <el-table-column align="center" label="院系" min-width="40">
            <template slot-scope="scope">
              <div>{{ scope.row.c_name }}</div>
              <div style="color: rgba(94,126,159,0.92)">{{ scope.row.s_name }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="tel" label="办公电话" min-width="50"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号码" min-width="50"></el-table-column>
          <el-table-column align="center" prop="email" label="邮箱" min-width="60"></el-table-column>
          <el-table-column align="center" label="学院权限" min-width="40">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.auth_college"
                @click.native="handleAuth(scope.row,1)"
                type="text"
                style="color: #67c23a"
              >
                <i class="fa fa-check"></i>
              </el-button>
              <el-button
                v-else
                @click.native="handleAuth(scope.row,1)"
                type="text"
                style="color: #f56c6c"
              >
                <i class="fa fa-times"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门权限" min-width="40">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.auth_structure"
                @click.native="handleAuth(scope.row,2)"
                type="text"
                style="color: #67c23a"
              >
                <i class="fa fa-check"></i>
              </el-button>
              <el-button
                v-else
                @click.native="handleAuth(scope.row,2)"
                type="text"
                style="color: #f56c6c"
              >
                <i class="fa fa-times"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证书权限" min-width="40">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.auth_cert"
                @click.native="handleAuth(scope.row,3)"
                type="text"
                style="color: #67c23a"
              >
                <i class="fa fa-check"></i>
              </el-button>
              <el-button
                v-else
                @click.native="handleAuth(scope.row,3)"
                type="text"
                style="color: #f56c6c"
              >
                <i class="fa fa-times"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="学院审批权限" min-width="40">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.auth_xysp"
                @click.native="handleAuth(scope.row, 5)"
                type="text"
                style="color: #67c23a"
              >
                <i class="fa fa-check"></i>
              </el-button>
              <el-button
                v-else
                @click.native="handleAuth(scope.row,1)"
                type="text"
                style="color: #f56c6c"
              >
                <i class="fa fa-times"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="账号密码登录权限" min-width="40">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.pwd_status"
                @click.native="handleAuth(scope.row,4)"
                type="text"
                style="color: #67c23a"
              >
                <i class="fa fa-check"></i>
              </el-button>
              <el-button
                v-else
                @click.native="handleAuth(scope.row,4)"
                type="text"
                style="color: #f56c6c"
              >
                <i class="fa fa-times"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="App签字" align="center" min-width="40">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_app" type="success" size="mini" effect="dark">开启</el-tag>
              <span v-else class="info">—</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <template v-if="getForm.status">
                <el-button @click.native="handleUpdate(scope.row)" size="mini">修改</el-button>
                <el-button
                  @click.native="handleDeleteStatus(1,scope.row.id)"
                  type="danger"
                  size="mini"
                  key="1"
                >删除</el-button>
              </template>
              <template v-else>
                <el-button @click.native="handleDeleteStatus(0,scope.row.id)" size="mini">恢复</el-button>
                <el-button
                  @click.native="handleDelete(scope.row.id)"
                  type="danger"
                  size="mini"
                  key="2"
                >彻底删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--新增、编辑-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      center
      append-to-body
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="form"
        label-width="170px"
        style="text-align: left; margin-right: 70px"
        v-cloak
        v-loading="dialogLoading"
      >
        <el-form-item label="登录账号：" :rules="[{required: true}]">
          <el-input v-model.trim="form.username" placeholder="登录账号为职工号，长度6到12位"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名：" :rules="[{required: true}]">
          <el-input v-model.trim="form.realname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <template v-if="!showAc">
          <el-form-item label="登录密码：" :rules="[{required: true}]">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" :rules="[{required: true}]">
            <el-input v-model="repeatWord" type="password" placeholder="请确认密码"></el-input>
          </el-form-item>
        </template>
        <el-form-item v-if="showAc" label="重置密码：">
          <el-radio v-model="radioRepeat" :label="1">是</el-radio>
          <el-radio v-model="radioRepeat" :label="0">否</el-radio>
        </el-form-item>
        <template v-if="showAc&&radioRepeat">
          <el-form-item label="新密码：" :rules="[{required: true}]">
            <el-input v-model.trim="form.password" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" :rules="[{required: true}]">
            <el-input v-model.trim="repeatWord" type="password" placeholder="请确认密码"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="办公电话：">
          <el-input v-model.trim="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model.trim="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model.trim="form.email"></el-input>
        </el-form-item>
        <el-form-item label="学院名称：">
          <el-select
            v-model="form.college_id"
            placeholder="请选择学院"
            style="width: 100%"
            @change="handleChangeCollegeId"
          >
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in collegeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称：">
          <el-select v-model="form.structure_id" placeholder="请选择部门" style="width: 100%">
            <el-option label="请选择" :key="1" :value="0"></el-option>
            <el-option
              v-for="item in structuresList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model.trim="form.job"></el-input>
        </el-form-item>
        <el-form-item label="App签字：">
          <el-radio-group v-model="form.is_app">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.is_app" label="身份证号：" :rules="[{required: !!form.is_app}]">
          <el-input v-model.trim="form.id_card" placeholder="请输入身份证号（身份证号用于App签名验证，请确保无误！）"></el-input>
        </el-form-item>
        <el-form-item label="学院权限:">
          <el-radio-group v-model="form.auth_college">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门权限:">
          <el-radio-group v-model="form.auth_structure">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--pwd_status-->
        <el-form-item label="证书权限:">
          <el-radio-group v-model="form.auth_cert">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学院审批权限:">
          <el-radio-group v-model="form.auth_xysp">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号密码登录权限:">
          <el-radio-group v-model="form.pwd_status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--课程评估-->
        <el-form-item label="课程评估管理自定义权限:">
          <el-radio-group v-model="form.auth_question" @change="handleChangeQuestion">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁止</el-radio>
          </el-radio-group>
          <div style="line-height: 24px">
            <span class="danger">*</span>
            注：当前“课程评估管理自定义权限”只有在
            <span class="success">开启</span> 状态时，
            以下菜单权限设置中“评估与考核管理”的子模块：“课程评估报告统计”、“预设问卷管理”、“试题管理”权限方可设置有效。
          </div>
        </el-form-item>
        <!--<el-form-item v-if="form.auth_question" label="课程评估报告统计:">-->
        <!--<el-radio-group v-model="form.auth_report">-->
        <!--<el-radio :label="1">开启</el-radio>-->
        <!--<el-radio :label="0">禁止</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="form.auth_question" label="课程评估报告分享权限:">-->
        <!--<el-radio-group v-model="form.auth_share">-->
        <!--<el-radio :label="1">开启</el-radio>-->
        <!--<el-radio :label="0">禁止</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="菜单权限：" class="menu-auth-tress">
          <el-checkbox v-model="checkedAll" @change="handleChangeAll">全选</el-checkbox>
          <el-tree
            :data="menu"
            node-key="path"
            ref="menutree"
            :default-checked-keys="defaultCheckedKeys"
            show-checkbox
            accordion
            :props="defaultProps"
            @check="handleCheckTree"
          ></el-tree>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click.native="handleTrue">提交</el-button>
          <el-button @click.native="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions } from "vuex";
import  { menuList } from '@/assets/js/menuList.js'

export default {
  name: "app-users-worker",
  data() {
    return {
      loading: false,
      showDelete: false,
      getForm: {
        tp: 2,
        keywords: "",
        page: 1,
        limit: 20,
        status: 1,
        college_id: null,
        structure_id: null
      },
      tableData: [],
      total: 0,
      key: -1, // 标识新增或修改：-1为新增，其他为修改
      form: {
        username: "",
        password: "",
        realname: "",
        tp: 2,
        mobile: "",
        email: "",
        is_app: 0, // app签名：1开启 0禁止
        id_card: "", // 身份证号
        status: 1, // 1开启 0禁止
        remark: "", //备注
        college_id: 0, // 学院id
        structure_id: 0, // 部门id
        job: "", // 职务
        tel: "", // 办公电话
        auth_college: 0,
        auth_structure: 0,
        auth_cert: 0,
        auth_xysp: 0, // 学院审批权限
        pwd_status: 1, // 密码登录权限
        auth_question: 0, // 自定义课程问卷权限
        auth_report: 1, // 报告统计
        auth_share: 1, // 报告分享
        auth_side: []
      },
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: "",
      showAc: false, // 修改和新增显示不同的控制
      repeatWord: "", // 再次输入密码
      radioRepeat: 0, // 选择重置密码
      ids: [],
      college_id: 0,
      structuresList: [], // 初始化学院列表
      structuresList2: [],
      collegeList: [], // 初始化部门列表
      userInfoArr: [],
      //    菜单权限
      checkedAll: false,
      defaultProps: {
        children: "subMenu",
        label: "title"
      },
      defaultCheckedKeys: ["/home/index/index"],
      menuList
    };
  },
  computed: {
    menu() {
      let list = this.menuList.map(item => {
        let Obj = Object.assign({}, item, {
          subMenu: []
        });
        if (item.subMenu) {
          let subMenu = item.subMenu.filter(v => {
            return v.auth === 2 || v.auth === 3;
          });
          Object.assign(Obj, {
            subMenu
          });
        }
        return Obj;
      });
      return list.filter(item => {
        return item.auth === 2 || item.auth === 3;
      });
    }
  },
  filters: {
    showTime(time) {
      let date = null;
      if ((time + "").length === 10) {
        date = new Date(time * 1000);
      } else {
        date = new Date(time);
      }
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      const D = date.getDate();
      return Y + "-" + M + "-" + D;
    }
  },
  methods: {
    ...mapActions([
      "getUsers",
      "getUserId",
      "addUser",
      "updateUser",
      "deleteSelectedUser",
      "changeStatusUsers",
      "getStructures"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getUsers({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            this.total = Data.dataCount;
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
    handleSwitch(val) {
      Object.assign(this.getForm, this.$options.data().getForm, {
        status: val
      });
      this.initData();
    },
    handleSearch(reset = false) {
      if (reset) {
        Object.assign(this.getForm, this.$options.data().getForm);
      } else {
        if (!this.getForm.keywords) {
          this.$message({
            message: "请输入搜索关键字！",
            type: "warning"
          });
          return false;
        }
      }
      this.initData();
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleInfo(val) {
      const list = [];
      list.push(val);
      this.userInfoArr = list;
    },
    handleUpdate(val) {
      // this.dialogLoading = false;
      // this.repeatWord = "";
      // this.radioRepeat = this.$options.data().radioRepeat;
      // this.checkedAll = false;
      // this.college_id = 0;
      if (val === -1) {
        // 新增
        // this.dialogTitle = "新增工作人员";
        // this.key = val;
        // this.showAc = false;
        // this.form = this.$options.data().form;
        // this.dialogVisible = true;
        // this.$nextTick(() => {
        //   this.$refs.menutree &&
        //     this.$refs.menutree.setCheckedKeys(
        //       this.$options.data().defaultCheckedKeys
        //     );
        // });
        this.$router.push({
          name: "AppUsersWorkerForm",
          query: {
            key: 1
          }
        });
      } else {
        // this.dialogTitle = "修改工作人员信息";
        // this.key = val.id;
        // this.showAc = true;
        // this.college_id = val.college_id;
        // if (this.key) {
        //   this.getInfo(val.id);
        // }

        this.$router.push({
          name: "AppUsersWorkerForm",
          query: {
            key: 0,
            id: val.id,
            college_id: val.college_id
          }
        });
      }
    },
    getInfo(id) {
      this.dialogLoading = true;
      if (this.dialogLoading) {
        this.getUserId({
          id: id
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            Object.assign(this.form, Data);
            this.$set(this.form, "password", "");
            //
            // this.$set(this.form,'auth_question',this.$options.data().form.auth_question);
            this.$set(
              this.form,
              "auth_report",
              this.$options.data().form.auth_report
            );
            this.$set(
              this.form,
              "auth_share",
              this.$options.data().form.auth_share
            );
            //
            this.dialogVisible = true;
            this.dialogLoading = false;
            this.$nextTick(() => {
              this.$refs.menutree &&
                this.$refs.menutree.setCheckedKeys(
                  Data.auth_side || this.$options.data().defaultCheckedKeys
                );
            });
          }
        });
      }
    },
    handleChangeCollegeId() {
      if (!this.college_id) {
        this.form.structure_id = 0;
      }
      if (this.form.college_id === 0) {
        this.structuresList = [];
      } else {
        this.getStructures({
          data: {
            level: 1,
            parentid: this.form.college_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.structuresList = data.data.data;
            this.college_id = false;
          }
        });
      }
    },
    handleChangeQuestion(val) {
      //获取当前勾选的菜单权限：
      let current_auth = this.$refs.menutree.getCheckedKeys();
      if (!val) {
        let list = current_auth.filter(item => {
          return (
            item !== "/home/assess" &&
            item !== "/home/assess/report" &&
            item !== "/home/assess/preset" &&
            item !== "/home/assess/exam"
          );
        });
        this.$refs.menutree && this.$refs.menutree.setCheckedKeys(list);
        this.$set(this.form, "auth_side", list);
      }
    },
    handleTrue() {
      // 保存修改 key==>  -1新增 ；其他就是修改
      if (!this.form.auth_question) {
        let auth_side = JSON.parse(JSON.stringify(this.form.auth_side));
        let list = auth_side.filter(item => {
          return (
            item !== "/home/assess" &&
            item !== "/home/assess/report" &&
            item !== "/home/assess/preset" &&
            item !== "/home/assess/exam"
          );
        });
        this.$set(this.form, "auth_side", list);
      }
      if (this.form.username.length < 6 || this.form.username.length > 12) {
        this.$message({
          message: "请输入登录账号，长度需在6到12位！",
          type: "warning"
        });
        return false;
      }
      if (!this.form.realname) {
        this.$message({
          message: "请输入姓名！",
          type: "warning"
        });
        return false;
      }
      if (this.key === -1) {
        if (!this.form.password) {
          this.$message({
            message: "请输入登录密码！",
            type: "warning"
          });
          return false;
        }
        if (!this.form.password) {
          this.$message({
            message: "登录密码不能为空格字符！",
            type: "warning"
          });
          return false;
        }
        if (this.form.password !== this.repeatWord) {
          this.$message({
            message: "两次输入的密码不同，请重新输入！",
            type: "warning",
            onClose: () => {
              this.repeatWord = "";
              this.$set(this.form, "password", "");
            }
          });
          return false;
        }
        if (this.form.is_app && !this.form.id_card) {
          this.$message({
            message: "请输入身份证号！",
            type: "warning"
          });
          return false;
        }
        this.dialogLoading = true;
        if (this.dialogLoading) {
          this.addUser({
            data: Object.assign({}, this.form, {
              id_card: this.form.is_app ? this.form.id_card : ""
            })
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.dialogVisible = false;
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.dialogLoading = false;
                }
              });
            }
          });
        }
      } else {
        const data = {};
        Object.assign(data, this.form, {
          id_card: this.form.is_app ? this.form.id_card : ""
        });
        this.toolDeleteAttr(data, [
          "create_time",
          "update_time",
          "last_time",
          "last_ip",
          "id",
          "c_name",
          "s_name"
        ]);
        if (!this.radioRepeat) {
          this.toolDeleteAttr(data, ["password"]);
        } else {
          if (!this.form.password) {
            this.$message({
              message: "请输入登录密码！",
              type: "warning"
            });
            return false;
          }
          if (!this.form.password) {
            this.$message({
              message: "登录密码不能为空格字符！",
              type: "warning"
            });
            return false;
          }
          if (this.form.password !== this.repeatWord) {
            this.$message({
              message: "两次输入的密码不同，请重新输入！",
              type: "warning",
              onClose: () => {
                this.repeatWord = "";
                this.$set(this.form, "password", "");
              }
            });
            return false;
          }
        }
        if (this.form.is_app && !this.form.id_card) {
          this.$message({
            message: "请输入身份证号！",
            type: "warning"
          });
          return false;
        }
        this.dialogLoading = true;
        if (this.dialogLoading) {
          this.updateUser({
            data,
            id: this.key
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.dialogVisible = false;
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.dialogLoading = false;
                }
              });
            }
          });
        }
      }
    },
    handleDelete(id) {
      // 0批量删除、单条删除传id
      let list = id ? [id] : this.ids;
      this.$confirm("此操作将彻底删除所选用户，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteSelectedUser({
            data: {
              ids: list
            }
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
    }, // 彻底删除
    handleDeleteStatus(current, val) {
      if (val !== -1) {
        // 删除所有选中
        this.ids = [val];
      }
      if (current) {
        this.$confirm("删除的用户可在回收站找回，是否继续删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        })
          .then(() => {
            this.changeStatusUsers({
              data: {
                ids: this.ids,
                status: 0
              }
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
      } else {
        this.changeStatusUsers({
          data: {
            ids: this.ids,
            status: 1
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
      }
    }, // 加入回收站或还原
    handleSelectionChange(val) {
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.ids = val.map(item => {
        return item.id;
      });
    },
    handleAuth(data, id) {
      const params = Object.assign({}, data);
      this.key = data.id;
      this.toolDeleteAttr(params, [
        "create_time",
        "update_time",
        "last_time",
        "last_ip",
        "id",
        "c_name",
        "s_name"
      ]);
      if (id === 1) {
        params.auth_college = !data.auth_college;
      } else if (id === 2) {
        params.auth_structure = !data.structure;
      } else if (id === 3) {
        params.auth_cert = !data.auth_cert;
      } else if (id === 4) {
        params.pwd_status = !data.pwd_status;
      } else if (id === 5) {
        params.auth_xysp = !data.auth_xysp;
      }
      this.updateUser({
        data: params,
        id: this.key
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
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    },
    toolDeleteAttr(obj, arr) {
      // obj目标对象，arr以要属性为项的数组
      for (let i = 0; i < arr.length; i++) {
        delete obj[arr[i]];
      }
    },
    handleCheckTree(node, tree) {
      this.$set(this.form, "auth_side", tree.checkedKeys);
    },
    handleChangeAll(val) {
      if (val) {
        this.$refs.menutree && this.$refs.menutree.setCheckedNodes(this.menu);
        let list = [];
        this.menu.map(item => {
          list.push(item.path);
          if (item.subMenu) {
            item.subMenu.map(v => {
              list.push(v.path);
            });
          }
        });
        this.$set(this.form, "auth_side", list);
      } else {
        this.$refs.menutree &&
          this.$refs.menutree.setCheckedKeys(
            this.$options.data().defaultCheckedKeys
          );
        this.$set(
          this.form,
          "auth_side",
          this.$options.data().defaultCheckedKeys
        );
      }
    },
    handleGetStructures() {
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
              this.structuresList2.push(item);
            }
          });
        }
      });
    }
  },
  created() {
    this.keepGetFormPublic(1);
    this.initData();
  },
  mounted() {
    this.handleGetStructures();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>
