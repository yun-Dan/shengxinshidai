<template>
  <div
    class="app-users-super"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button @click.native="handleUpdate(-1)" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button @click.native="handleSearch(true)" icon="el-icon-menu">全部</el-button>
          <el-button
            v-if="showDelete"
            @click.native="handleDelete(0)"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
        </el-button-group>
        <div class="fr query-box" @keyup.enter="handleSearch(false)">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-input
                placeholder="搜索姓名或账号"
                v-model="getForm.keywords"
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
      <div class="users-super-main" v-cloak>
        <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="46"></el-table-column>
          <el-table-column label="序号" align="center" width="46">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" min-width="50">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="click">
                <el-table :data="userInfoArr" :border="true">
                  <el-table-column property="username" label="账号" align="center"></el-table-column>
                  <el-table-column property="realname" label="姓名" align="center"></el-table-column>
                  <el-table-column property="job" label="职务" align="center"></el-table-column>
                  <el-table-column property="mobile" label="手机" align="center"></el-table-column>
                  <el-table-column property="email" label="邮箱" align="center"></el-table-column>
                  <el-table-column property="tel" label="办公电话" align="center"></el-table-column>
                  <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status">开启</span>
                      <span v-else>禁止</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
                  </el-table-column>
                  <el-table-column property="last_ip" label="最后登录IP" align="center" width="88"></el-table-column>
                  <el-table-column property="remark" label="备注" align="center"></el-table-column>
                </el-table>
                <el-button
                  @click.native="handleInfo(scope.row)"
                  type="text"
                  slot="reference"
                >{{ scope.row.realname }}</el-button>
              </el-popover>
              <el-tag v-if="scope.row.is_yjsy" type="primary" effect="dark" size="mini">研究生院审批人</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="username" align="center" label="登录账号" min-width="50"></el-table-column>
          <el-table-column prop="tel" align="center" label="办公电话" min-width="50"></el-table-column>
          <el-table-column prop="mobile" align="center" label="手机号码" min-width="60"></el-table-column>
          <!-- <el-table-column
                        prop="email"
                        align="center"
                        label="邮箱">
          </el-table-column>-->
          <el-table-column label="状态" align="center" min-width="50">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status"
                @click.native="handleStatus(scope.row)"
                type="text"
                style="color: #008000"
              >开启</el-button>
              <el-button
                v-else
                @click.native="handleStatus(scope.row)"
                type="text"
                style="color: #ff0000"
              >禁止</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column
                        label="App签字"
                        align="center"
                        min-width="40">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.is_app" type="success" size="mini" effect="dark">开启</el-tag>
                            <span v-else class="info">—</span>
                        </template>
          </el-table-column>-->
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button @click.native="handleUpdate(scope.row)" size="mini">修改</el-button>
              <el-button
                v-if="userInfo.isSuperman"
                @click.native="handleDelete(scope.row.id)"
                type="danger"
                size="mini"
              >删除</el-button>
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
      append-to-body
      center
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="form"
        label-width="110px"
        style="text-align: left; margin-right: 40px" v-loading="dialogLoading">
        <el-form-item label="登录账号：" :rules="[{required: true}]">
          <el-input v-model.trim="form.username" placeholder="账号长度为6到12位"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :rules="[{required: true}]">
          <el-input v-model.trim="form.realname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <template v-if="!showAc">
          <el-form-item label="密码：" :rules="[{required: true}]">
            <el-input v-model.trim="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" :rules="[{required: true}]">
            <el-input v-model.trim="repeatWord" type="password" placeholder="请确认密码"></el-input>
          </el-form-item>
        </template>
        <el-form-item v-if="showAc" label="重置密码：">
          <div class="grid-content bg-purple">
            <el-radio v-model="radioRepeat" :label="1">是</el-radio>
            <el-radio v-model="radioRepeat" :label="0">否</el-radio>
          </div>
        </el-form-item>
        <template v-if="showAc&&radioRepeat">
          <el-form-item label="新密码：" :rules="[{required: true}]">
            <el-input v-model.trim="form.password" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" :rules="[{required: true}]">
            <el-input v-model.trim="repeatWord" type="password" placeholder="请确认密码"></el-input>
          </el-form-item>
        </template>
        <!-- <el-form-item label="App签字：" :rules="[{required: true}]">
                    <el-radio-group v-model="form.is_app">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.is_app" label="身份证号：" :rules="[{required: !!form.is_app}]">
                    <el-input v-model.trim="form.id_card" placeholder="请输入身份证号（身份证号用于App签名验证，请确保无误！）"></el-input>
        </el-form-item>-->
        <el-form-item label="办公电话：" :rules="[{required: true}]">
          <el-input v-model.trim="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model.trim="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model.trim="form.email"></el-input>
        </el-form-item>
        <el-form-item v-if="showAc" label="职务：">
          <el-input v-model.trim="form.job"></el-input>
        </el-form-item>
        <el-form-item v-if="showAc" label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程班审批权限：" prop="is_yjsy">
          <div slot="label" style="line-height: 20px; padding-top: 0px">
            <span class="danger">*</span>
            （研究生院）办班专业管理审批权限：
          </div>
          <el-radio-group v-model="form.is_yjsy">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            v-model.trim="form.remark"
            :rows="2"
            maxlength="80"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item class="text-align-center">
          <el-button type="primary" @click.native="handleTrue">提 交</el-button>
          <el-button @click.native="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import  { menuList } from '@/assets/js/menuList.js'

export default {
  name: "app-users-super",
  data() {
    return {
      loading: false,
      showDelete: false,
      getForm: {
        tp: 1,
        keywords: "",
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      key: -1, // -1为新增，其他为修改
      form: {
        username: "",
        password: "",
        realname: "",
        tp: 1,
        mobile: "",
        email: "",
        is_app: 0, // app签名：1开启 0禁止
        id_card: "", // 身份证号
        status: 1, // 1开启 0禁止
        remark: "", //备注
        job: "",
        tel: "",
        auth_side: [],
        permissions: [1, 2],
        workshop: [],
        is_yjsy: 0 // 研究生院-办班专业审批权限（1是 0否）
      },
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: "",
      showAc: false, // 控制显示编辑时显示
      repeatWord: "", // 再次输入密码
      radioRepeat: 0, // 选择重置密码
      ids: [],
      status: 1,
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
    ...mapState([
      'userInfo'
    ]),
    menu() {
      let list = this.menuList.map(item => {
        let Obj = Object.assign({}, item, {
          subMenu: []
        });
        if (item.subMenu) {
          let subMenu = item.subMenu.filter(v => {
            return v.auth === 1 || v.auth === 3;
          });
          Object.assign(Obj, {
            subMenu
          });
        }
        return Obj;
      });
      return list.filter(item => {
        return item.auth === 1 || item.auth === 3;
      });
    }
  },
  methods: {
    ...mapActions([
      "getUsers",
      "getUserId",
      "addUser",
      "updateUser",
      "deleteSelectedUser",
      "changeStatusUsers"
    ]),
    initData() {
      // 初始获取用户列表数据
      this.loading = true;
      if (this.loading) {
        this.getUsers({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
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
    handleSearch(reset = false) {
      // reset是否重置：true是、false否
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
    handleInfo(val) {
      const list = [];
      list.push(val);
      this.userInfoArr = list;
    },
    handleUpdate(val) {
      this.repeatWord = "";
      this.radioRepeat = this.$options.data().radioRepeat;
      this.checkedAll = false;
      this.dialogLoading = false
      if (val === -1) {
        // 新增
        this.key = val;
        this.dialogTitle = "新增系统管理员";
        this.showAc = false;
        this.form = this.$options.data().form;
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.menutree &&
            this.$refs.menutree.setCheckedKeys(
              this.$options.data().defaultCheckedKeys
            );
        });
      } else {
        this.key = val.id;
        this.dialogTitle = "修改系统管理员信息";
        this.showAc = true;
        if (this.key) {
          this.getInfo(val.id);
        }
      }
    },
    getInfo(id) {
      this.getUserId({
        id: id
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          Object.assign(this.form, Data);
          this.$set(this.form, "password", "");
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs.menutree &&
              this.$refs.menutree.setCheckedKeys(
                Data.auth_side || this.$options.data().defaultCheckedKeys
              );
          });
        }
      });
    },
    handleTrue() {
      // 保存修改 key==>  -1新增 ；其他就是修改
      if (this.form.username.length < 6 || this.form.username.length > 12) {
        this.$message({
          message: "请输入登录账号，字符长度在6到12位！",
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
        if (!this.form.tel) {
          this.$message({
            message: "请输入办公电话！",
            type: "warning"
          });
          return false;
        }
        this.dialogLoading = true
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
        if (!this.form.tel) {
          this.$message({
            message: "请输入办公电话！",
            type: "warning"
          });
          return false;
        }
        this.dialogLoading = true
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
                  this.dialogLoading = false
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
    },
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
    handleStatus(val) {
      this.changeStatusUsers({
        data: {
          ids: [val.id],
          status: !val.status
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
    }
  },
  created() {
    this.initData()
  }
};
</script>
