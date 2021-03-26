<template>
  <div v-cloak v-loading="dialogLoading" class="app-users-worker-form">
    <el-form label-width="120px" style="text-align: left;">
      <el-form-item label="登录账号：" :rules="[{required: true}]" :style="defaulStyle">
        <el-input v-model.trim="form.username" placeholder="登录账号为职工号，长度6到12位"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" :rules="[{required: true}]" :style="defaulStyle">
        <el-input v-model.trim="form.realname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <template v-if="!showAc">
        <el-form-item label="登录密码：" :rules="[{required: true}]" :style="defaulStyle">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :rules="[{required: true}]" :style="defaulStyle">
          <el-input v-model="repeatWord" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
      </template>
      <el-form-item v-if="showAc" label="重置密码：" :style="defaulStyle">
        <el-radio v-model="radioRepeat" :label="1">是</el-radio>
        <el-radio v-model="radioRepeat" :label="0">否</el-radio>
      </el-form-item>
      <template v-if="showAc&&radioRepeat">
        <el-form-item label="新密码：" :rules="[{required: true}]" :style="defaulStyle">
          <el-input v-model.trim="form.password" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :rules="[{required: true}]" :style="defaulStyle">
          <el-input v-model.trim="repeatWord" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="办公电话：" :style="defaulStyle">
        <el-input v-model.trim="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" :style="defaulStyle">
        <el-input v-model.trim="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" :style="defaulStyle">
        <el-input v-model.trim="form.email"></el-input>
      </el-form-item>
      <el-form-item label="学院名称：" :rules="[{required: true}]" :style="defaulStyle">
        <el-select
          v-model="form.college_id"
          placeholder="请选择学院"
          style="width: 100%" filterable
          @change="handleChangeCollegeId"
        >
          <el-option label="请选择" :value="0"></el-option>
          <el-option v-for="item in collegeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称：" :style="defaulStyle">
        <el-select v-model="form.structure_id" placeholder="请选择部门" style="width: 100%" filterable>
          <el-option label="请选择" :key="1" :value="0"></el-option>
          <el-option
            v-for="item in structuresList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务：" :style="defaulStyle">
        <el-input v-model.trim="form.job"></el-input>
      </el-form-item>
      <el-form-item label="账号密码登录权限：" :style="defaulStyle">
        <el-radio-group v-model="form.pwd_status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学院权限:" :style="defaulStyle">
        <el-radio-group v-model="form.auth_college">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门权限:" :style="defaulStyle">
        <el-radio-group v-model="form.auth_structure">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="证书权限:" :style="defaulStyle">
        <el-radio-group v-model="form.auth_cert">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学院审批权限:" :style="defaulStyle">
        <el-radio-group v-model="form.auth_xysp">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="App签字权限：" :style="defaulStyle">
        <el-radio-group v-model="form.is_app">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="form.is_app"
        label="身份证号："
        :rules="[{required: !!form.is_app}]"
        :style="defaulStyle"
      >
        <el-input v-model.trim="form.id_card" placeholder="请输入身份证号（身份证号用于App签名验证，请确保无误！）"></el-input>
      </el-form-item>
      <el-form-item label="课程评估管理自定义权限:" :style="defaulStyle">
        <div slot="label" style="line-height: 18px; padding-top: 10px">课程评估管理自定义权限:</div>
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
      <el-form-item label="系统访问权限：" :rules="[{required: true}]" :style="defaulStyle">
        <el-checkbox-group v-model="form.permissions" :min="1">
          <el-checkbox label="1">继续教育微系统</el-checkbox>
          <el-checkbox label="2">研修班</el-checkbox>
        </el-checkbox-group>
        <div style="line-height: 24px">
          <span class="danger">*</span>
          注：请至少设置一个系统的访问权限；只有在系统访问权限设置后，对应系统的功能分配设置才生效。
        </div>
      </el-form-item>
      <el-form-item label="系统菜单权限分配：">
        <el-tabs type="border-card">
          <el-tab-pane label="继续教育微系统">
            <el-form label-width="94px" style="text-align: left;">
              <el-form-item label="" class="menu-auth-tress" :style="defaulStyle">
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
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="研修班">
            <el-form label-width="94px" style="text-align: left;">
              <el-form-item label="" class="menu-auth-tress" :style="defaulStyle">
                <el-checkbox v-model="checkedAll2" @change="handleChangeAll2">全选</el-checkbox>
                <el-tree
                  :data="menu2"
                  node-key="path"
                  ref="menutree2"
                  :default-checked-keys="defaultCheckedKeys2"
                  show-checkbox
                  accordion
                  :props="defaultProps2"
                  @check="handleCheckTree2"
                ></el-tree>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click.native="handleTrue">提交</el-button>
        <el-button @click.native="$router.go(-1)">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import { yxbtree } from "@/assets/js/yxb.tree.js"
import  { menuList } from '@/assets/js/menuList.js'

// 课程班-允许分配的模块（没有则全部可分配）
const allowArr = [
  // '/home/index/index',
  // '/home/class_major/index',
  // '/home/project/index/list'
]

export default {
  name: "app-users-worker-form",
  data() {
    return {
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
        auth_side: ["/home/index/index"],
        permissions: ["1"],
        workshop: ["/home/index/index"],
        is_yjsy: 0 // 研究生院-办班专业审批权限（1是 0否）
      },
      dialogLoading: false,
      showAc: false, // 修改和新增显示不同的控制
      repeatWord: "", // 再次输入密码
      radioRepeat: 0, // 选择重置密码
      college_id: 0,
      structuresList: [], // 初始化学院列表
      structuresList2: [],
      collegeList: [], // 初始化部门列表
      userInfo: [],
      // 菜单权限
      defaulStyle: {
        marginBottom: '10px'
      },
      // 微系统
      checkedAll: false,
      defaultProps: {
        children: 'subMenu',
        label: 'title'
      },
      defaultCheckedKeys: ['/home/index/index'],
      // 研修班2
      checkedAll2: false,
      defaultProps2: {
        children: 'subMenu',
        label: 'title'
      },
      defaultCheckedKeys2: ['/home/index/index'],
    };
  },
  computed: {
    menu() {
      let list = menuList.map(item => {
        let Obj = Object.assign({}, item, {
          subMenu: []
        });
        if (item.subMenu) {
          let subMenu = item.subMenu.filter(v => {
            return (v.auth === 2 || v.auth === 3) && v.center_key
          });
          Object.assign(Obj, {
            subMenu
          });
        }
        return Obj;
      });
      return list.filter(item => {
        return (item.auth === 2 || item.auth === 3) && item.center_key
      });
    },
    menu2() {
      let list = menuList.map(item => {
        let Obj = Object.assign({}, item, {
          subMenu: []
        })
        if (item.subMenu) {
          let subMenu = item.subMenu.filter(v => {
            return v.yxb && (v.auth === 2 || v.auth === 3)
          })
          Object.assign(Obj, {
            subMenu
          })
        }
        return Obj
      })
      return list.filter(item => {
        if (allowArr.length) {
          return item.yxb && (item.auth === 2 || item.auth === 3) && allowArr.indexOf(item.path) !== -1
        } else {
          return item.yxb && (item.auth === 2 || item.auth === 3)
        }
      })
    }
  },
  methods: {
    ...mapActions(["getUserId", "addUser", "updateUser", "getStructures"]),
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
            this.$set(this.form,"auth_report",this.$options.data().form.auth_report);
            this.$set(this.form,"auth_share",this.$options.data().form.auth_share);
            this.$set(this.form, "permissions", Data.permissions ? Data.permissions.length ? Data.permissions : ["1"] : ["1"]);
           
            //
            this.dialogLoading = false;
            this.$nextTick(() => {
              this.$refs.menutree && this.$refs.menutree.setCheckedKeys(Data.auth_side || this.$options.data().defaultCheckedKeys);
              this.$refs.menutree2 && this.$refs.menutree2.setCheckedKeys(Data.workshop || this.$options.data().defaultCheckedKeys2);
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
        let workshop = JSON.parse(JSON.stringify(this.form.workshop));
        let list2 = workshop.filter(item => {
          return (
            item !== "/home/assess" &&
            item !== "/home/assess/report" &&
            item !== "/home/assess/preset" &&
            item !== "/home/assess/exam"
          );
        });
        this.$set(this.form, "auth_side", list);
        this.$set(this.form, "workshop", workshop);
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
              this.$router.go(-1);
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
              this.$router.go(-1);
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
    handleCheckTree2(node, tree) {
      this.$set(this.form, 'workshop', tree.checkedKeys);
    },
    handleChangeAll2(val) {
      if (val) {
        this.$refs.menutree2 && this.$refs.menutree2.setCheckedNodes(this.menu2)
        let list = []
        this.menu2.map(item => {
          list.push(item.path)
          if (item.subMenu) {
            item.subMenu.map(v => {
              list.push(v.path)
            })
          }
        });
        this.$set(this.form, 'workshop', list)
      } else {
        this.$refs.menutree2 &&
          this.$refs.menutree2.setCheckedKeys(
            this.$options.data().defaultCheckedKeys2
          )
        this.$set(this.form, 'workshop', this.$options.data().defaultCheckedKeys2)
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
    const query = this.$route.query;
    if (query.key > 0) {
      // 新增
      this.key = -1;
      this.showAc = false;
    } else {
      // 编辑
      const ID = query.id - 0;
      if (ID) {
        this.key = ID;
        this.showAc = true;
        this.college_id = query.college_id;
        if (this.key) {
          this.getInfo(ID);
        }
      }
    }
  },
  mounted() {
    this.handleGetStructures();
  }
};
</script>

<style scoped>
.app-users-worker-form {
  padding: 40px 0;
  min-width: 800px;
  margin: 0 auto;
  max-width: 1000px;
}
</style>
