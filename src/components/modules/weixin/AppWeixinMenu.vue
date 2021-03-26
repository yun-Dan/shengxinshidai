<template>
  <div class="app-weixin-menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" icon="el-icon-plus" @click.native="handleAdd">新增</el-button>
      </div>
      <div class="weixin-menu-main">
        <el-table
          :data="tableData"
          border
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="排序" width="60px">
            <template slot-scope="scope">{{ scope.row.sort }}</template>
          </el-table-column>
          <el-table-column align="center" label="主菜单名称" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.pid" style="color: #a8aaaf;padding-left: 20px">├──</span>
              {{ scope.row.title }}
              <el-tag v-if="!scope.row.pid" type="success" size="mini">一级</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="keyword" label="关联关键词" width="180"></el-table-column>
          <el-table-column header-align="center" label="链接地址">
            <template slot-scope="scope">{{ scope.row.url?scope.row.url:'无链接地址'}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否显示" width="80px">
            <template slot-scope="scope">
              <span v-if="scope.row.is_show" style="color: #5daf34">是</span>
              <span v-else style="color: #f56c6c">否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="clearfix" style="padding: 20px 0">
          <div class="to-menu-box fr">
            <el-button type="success" @click.native="handleToMenu">生成自定义菜单</el-button>
          </div>
          <div class="menu-tip-box fl">
            * 注：
            <br>(使用前提是已经拥有了自定义菜单的用户才能够使用。)
            <br>第一步:添加菜单
            <br>第二步:点击生成
            <br>注意：一级菜单最多只能开启3个，二级子菜单最多开启5个
            <br>官方说明：修改后，需要重新关注，或者最迟隔天才会看到修改后的效果！
          </div>
        </div>
      </div>
    </el-card>
    <!--新增、编辑-->
    <el-dialog
      title="自定义菜单"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
    >
      <div>
        <el-card class="card-box">
          <el-form ref="form" :model="form" label-width="110px" style="text-align: left">
            <el-form-item label="上级菜单：">
              <el-select
                v-model="form.pid"
                placeholder="请选择上级菜单"
                style="width: 210px"
                @change="handleChange"
              >
                <template v-for="(item,index) in menuList">
                  <el-option :label="item.title" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单名称：" :rules="[{ required: true}]">
              <el-input v-model.trim="form.title" style="width: 210px"></el-input>
            </el-form-item>
            <el-form-item label="关联关键词：" :rules="[{ required: true}]">
              <el-input v-model.trim="form.keyword" style="width: 210px"></el-input>
            </el-form-item>
            <el-form-item label="链接地址：">
              <el-row>
                <el-col :xs="24" :sm="18">
                  <div class="grid-content bg-purple">
                    <el-input v-model.trim="form.url"></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="显示：">
              <el-radio-group v-model="form.is_show">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排列顺序：">
              <el-input-number v-model="form.sort" :min="1"></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "app-weixin-menu",
  data() {
    return {
      role: 2,
      uid: 0,
      tableData: [],
      level: "all", //值为时all:获取所有菜单,否则仅获取一级菜单
      dialogVisible: false,
      key: 1,
      form: {
        id: 0,
        pid: null,
        title: "",
        keyword: "",
        url: "",
        is_show: 1,
        sort: 1
      },
      menuList: [] // 一级菜单列表
    };
  },
  methods: {
    ...mapActions([
      "getWeiXinMenuList",
      "addWeiXinMenu",
      "deleteWeiXinMenu",
      "updateWeiXinMenu",
      "toWeiXinMenu"
    ]),
    initData() {
      this.getWeiXinMenuList({
        data: {
          level: this.level
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            // this.tableData = Data.list;
            const List_ = [];
            Data.list.map(item => {
              List_.push(item);
              item.child.map(val => {
                List_.push(val);
              });
            });
            this.tableData = List_;
            this.menuList = Data.list.filter(item => {
              return !item.pid;
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleAdd() {
      this.key = 1;
      const len = this.menuList.length + 1;
      Object.assign(this.form, this.$options.data().form, {
        sort: len
      });
      this.dialogVisible = true;
    },
    handleEdit(val) {
      this.key = 0;
      Object.assign(this.form, val);
      for (let key in this.form) {
        if (!this.$options.data().form.hasOwnProperty(key)) {
          delete this.form[key];
        }
      }
      Object.assign(this.form, {
        pid: val.pid ? val.pid : null
      });
      this.dialogVisible = true;
    },
    handleChange(pid) {
      const sub_list = this.tableData.filter(item => {
        return item.pid === pid;
      });
      const len = sub_list.length + 1;
      this.$set(this.form, "sort", len);
    },
    handleTrue() {
      const Obj = {};
      Object.assign(Obj, this.form, {
        pid: this.form.pid ? this.form.pid : 0
      });
      if (!Obj.title) {
        this.$message({
          type: "warning",
          message: "请输入菜单名称！"
        });
        return false;
      }
      if (!Obj.keyword) {
        this.$message({
          type: "warning",
          message: "请输入关联关键词！"
        });
        return false;
      }
      if (this.key) {
        delete Obj.id;
      }
      if (this.key) {
        this.addWeiXinMenu({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.initData();
            this.dialogVisible = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        this.updateWeiXinMenu({
          data: Obj,
          id: Obj.id
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.initData();
            this.dialogVisible = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleDelete(val) {
      this.$confirm("此操作将彻底删除该条菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteWeiXinMenu({
            id: val.id
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
    handleToMenu() {
      this.toWeiXinMenu().then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    }
  },
  beforeMount() {
    this.initData();
  }
};
</script>

<style scoped>
.weixin-menu-main {
  padding-top: 20px;
}
.to-menu-box {
  text-align: right;
}
.menu-tip-box {
  line-height: 28px;
  color: #f56c6c;
}
</style>
