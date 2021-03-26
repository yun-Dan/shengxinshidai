<template>
  <div
    class="app-config-area"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button @click.native="handleAdd" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button
            v-if="showDelete"
            @click.native="handleSelectedDelete"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
        </el-button-group>
      </div>
      <div class="config-area-main">
        <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="级别" width="120px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pid" size="mini">市级</el-tag>
              <el-tag v-else size="mini" type="success">省级</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="地区名称"></el-table-column>
          <el-table-column align="center" prop="shortname" label="地区简称"></el-table-column>
          <el-table-column align="center" label="经纬度">
            <template slot-scope="scope">
              <div>经度：{{ scope.row.longitude }}</div>
              <div>纬度：{{ scope.row.latitude }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下级市区">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="handleChild(scope.row)">市区管理</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160px">
            <template slot-scope="scope">
              <el-button @click.native="handleEdit(scope.row)" size="mini">修改</el-button>
              <el-button
                @click.native="handleDelete(scope.row)"
                type="danger"
                size="mini"
                key="1"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box" v-cloak>
          <el-pagination :page-size="100" layout="total" :total="total"></el-pagination>
        </div>
      </div>
    </el-card>
    <!--新增、编辑-->
    <el-dialog
      title="省级地区信息"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="600px"
    >
      <el-form :model="form" label-width="120px" style="text-align: left; margin-right: 50px">
        <el-form-item label="地区名称" :rules="[{required:true}]">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地区简称" :rules="[{required:true}]">
          <el-input v-model.trim="form.shortname"></el-input>
        </el-form-item>
        <el-form-item label="地区简称拼音" :rules="[{required:true}]">
          <el-input v-model.trim="form.pinyin"></el-input>
        </el-form-item>
        <el-form-item label="经度" :rules="[{required:true}]">
          <el-input v-model.trim="form.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" :rules="[{required:true}]">
          <el-input v-model.trim="form.latitude"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-config-area",
  data() {
    return {
      role: 1,
      uid: 0,
      loading2: false,
      showDelete: false,
      getForm: {
        pid: 0,
        status: 1,
        // fields:[],
        page: 1,
        limit: 100
      },
      total: 0,
      tableData: [],
      ids: [], // 批量删除的id集合
      dialogFormVisible: false,
      key: 1, // 1新增 0修改
      edit_id: 0, // 当前编辑的id
      form: {
        pid: 0,
        name: "",
        shortname: "",
        pinyin: "",
        longitude: "",
        latitude: ""
      }
    };
  },
  methods: {
    ...mapActions([
      "getAreaList",
      "getAreaInfo",
      "addArea",
      "updateArea",
      "deleteArea",
      "deleteSelectedArea"
    ]),
    initData() {
      this.loading2 = true;
      this.getAreaList({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.loading2 = false;
          const Data = data.data.data;
          this.total = Data.dataCount;
          this.tableData = Data.list;
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
      Object.assign(this.form, this.$options.data().form);
      this.dialogFormVisible = true;
    },
    handleEdit(val) {
      this.key = 0;
      this.edit_id = val.id;
      this.getAreaInfo({
        id: val.id
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          Object.assign(this.form, Data);
          for (let key in this.form) {
            if (!this.$options.data().form.hasOwnProperty(key)) {
              delete this.form[key];
            }
          }
          this.dialogFormVisible = true;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleTrue() {
      if (!this.form.name) {
        this.$message({
          type: "warning",
          message: "请输入地区名称！"
        });
        return false;
      }
      if (!this.form.shortname) {
        this.$message({
          type: "warning",
          message: "请输入地区简称！"
        });
        return false;
      }
      if (!this.form.pinyin) {
        this.$message({
          type: "warning",
          message: "请输入地区简称的拼音！"
        });
        return false;
      }
      if (!this.form.longitude) {
        this.$message({
          type: "warning",
          message: "请输入地区经度！"
        });
        return false;
      }
      if (!this.form.latitude) {
        this.$message({
          type: "latitude",
          message: "请输入地区纬度！"
        });
        return false;
      }

      this.loading2 = true;
      if (this.key) {
        this.addArea({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.loading2 = false;
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      } else {
        this.updateArea({
          data: this.form,
          id: this.edit_id
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.loading2 = false;
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading2 = false;
              }
            });
          }
        });
      }
    },
    handleSelectedDelete() {
      this.$confirm("此操作将彻底删除所选地区信息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteSelectedArea({
            data: {
              ids: this.ids
            }
          }).then(data => {
            this.initData();
            this.$message({
              type: "success",
              message: data.data.data
            });
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
    handleDelete(val) {
      this.$confirm("此操作将彻底删除该地区信息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteArea({
            id: val.id
          }).then(data => {
            this.initData();
            this.$message({
              type: "success",
              message: data.data.data
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleChild(val) {
      sessionStorage.setItem("areaSelect", JSON.stringify(this.tableData));
      sessionStorage.setItem("areaTITLE", val.name);
      this.$router.push("/home/config/area/" + val.id);
    }
  },
  beforeMount() {
    this.initData();
  }
};
</script>
