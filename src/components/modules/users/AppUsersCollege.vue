<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
    class="app-users-college" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button @click.native="handleUpdate(-1)" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button type icon="el-icon-menu" @click.native="handleAll">全部</el-button>
          <el-button
            v-if="showDelete"
            @click.native="handleSelectedDelete"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
        </el-button-group>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-input
                placeholder="搜索学院/部门名称"
                v-model.trim="searchInput"
                class="input-with-select"
                clearable
                style="width: 210px"
              >
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="users-college-main" v-cloak>
        <el-table
          :data="tableData"
          ref="table"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="55">-->
          <!--</el-table-column>-->
          <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
          <el-table-column align="left" label="名称">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="click">
                <el-table :data="structuresId" :border="true">
                  <el-table-column property="name" label="名称" align="center"></el-table-column>
                  <el-table-column property="en" label="英文名称" align="center"></el-table-column>
                  <el-table-column property="num" label="学院编号" align="center"></el-table-column>
                  <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status">开启</span>
                      <span v-else>禁止</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
                  </el-table-column>
                  <el-table-column align="center" label="修改时间">
                    <template slot-scope="scope">
                      <span>{{ scope.row.update_time | TimestampChangeFilter }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  @click.native="getInfo(scope.row.id)"
                  type="text"
                  slot="reference"
                >{{ scope.row.title }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="en" align="center" label="英文名称"></el-table-column>
          <el-table-column
            align="center"
            prop="level"
            label="级别"
            :filters="[{ text: '学院', value: 1 }, { text: '部门', value: 2 }]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level===1" type="success" size="mini">学院</el-tag>
              <el-tag v-else size="mini" type="info">部门</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="num" align="center" label="学院编号"></el-table-column>
          <el-table-column prop="int_num" align="center" label="内部编号"></el-table-column>
          <el-table-column align="center" label="所属学院">
            <template slot-scope="scope">
              <span v-if="scope.row.pid">{{ scope.row.p_title }}</span>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | TimestampChangeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click.native="handleUpdate(scope.row)">修改</el-button>
              <!--<el-button @click.native="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--新增、编辑-->
    <el-dialog
      title="学院部门信息"
      :visible.sync="dialogVisible"
      append-to-body
      center
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        style="text-align: left; margin-right: 50px"
        v-cloak
      >
        <el-form-item label="上级部门：">
          <el-select v-model="form.pid" style="width: 100%">
            <el-option label="无" :value="0"></el-option>
            <template v-for="item in structuresList">
              <el-option v-if="item.level === 1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" :rules="[{required: true}]">
          <el-input v-model.trim="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!form.pid" label="英文名称" :rules="[{required: true}]">
          <el-input v-model.trim="form.en" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!form.pid" label="学院编号：" :rules="[{required: true}]">
          <el-input v-model.trim="form.num" placeholder="请输入学院编号"></el-input>
        </el-form-item>
        <el-form-item v-if="!form.pid" label="内部编号：">
          <el-input v-model.trim="form.int_num" placeholder="请输入学院内部编号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="handleTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-users-college",
  data() {
    return {
      loading: false,
      showDelete: false,
      searchInput: "", // 绑定搜索内容
      tableData: [],
      key: -1,
      form: {
        pid: 0,
        name: "",
        en: "",
        num: "",
        int_num: ""
      },
      dialogVisible: false,
      ids: [],
      dialogVisible2: false,
      status: 1
    };
  },
  computed: {
    ...mapState(["structuresList", "structuresId"])
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getStructureId",
      "addStructure",
      "deleteStructure",
      "deleteSelectedStructure",
      "updateStructure"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getStructures({}).then(data => {
          if (data.data.code === 200) {
            this.tableData = this.structuresList.filter(item => {
              if (item.name) {
                if (
                  item.name.indexOf(this.searchInput) >= 0 ||
                  (item.en ? item.en.indexOf(this.searchInput) : -1) >= 0
                ) {
                  return item;
                }
              }
            });
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
    handleSearch() {
      if (!this.searchInput) {
        this.$message({
          message: "请输入搜索关键字！",
          type: "warning"
        });
      } else {
        this.initData();
      }
    },
    handleAll() {
      this.searchInput = "";
      this.initData();
    },
    handleUpdate(val) {
      // key:-1新增  其他为修改
      if (val === -1) {
        this.key = val;
        this.form = this.$options.data().form;
      } else {
        this.key = val.id;
        for (let key in this.form) {
          this.$set(this.form, key, val[key]);
        }
      }
      this.dialogVisible = true;
    },
    handleTrue() {
      let Obj = {};
      Object.assign(Obj, this.form);
      if (!Obj.name) {
        this.$message({
          type: "warning",
          message: "名称不能为空！"
        });
        return false;
      }
      if (Obj.pid === 0) {
        if (!Obj.en) {
          this.$message({
            type: "warning",
            message: "英文名称不能为空！"
          });
          return false;
        }
        if (!Obj.num) {
          this.$message({
            type: "warning",
            message: "学院编号不能为空！"
          });
          return false;
        }
      } else {
        delete Obj.en;
        delete Obj.num;
        delete Obj.int_num;
      }
      if (this.key === -1) {
        // 新增
        this.addStructure({
          data: Obj
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
              message: data.data.error,
              onClose: () => {
                this.dialogVisible = false;
              }
            });
          }
        });
      } else {
        // 编辑
        this.updateStructure({
          data: Obj,
          id: this.key
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
              message: data.data.error,
              onClose: () => {
                this.dialogVisible = false;
              }
            });
          }
        });
      }
    },
    handleSelectionChange(val) {
      // 选择框发生变化触发
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.ids = val.map(item => {
        return item.id;
      });
    },
    handleSelectedDelete() {
      // 批量删除
      this.$confirm("此操作将彻底删除所选学院及其子类部门，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteSelectedStructure({
            data: {
              ids: this.ids,
              delSon: true
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
    handleDelete(val) {
      if (val.level === 1) {
        this.$confirm(
          "此操作将删除所选中的学院及全部子类部门，是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: "warning"
          }
        )
          .then(() => {
            this.deleteStructure({
              id: val.id,
              data: {
                delSon: true
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
        this.$confirm("此操作将删除所选中的部门，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        })
          .then(() => {
            this.deleteStructure({
              id: val.id,
              data: {
                delSon: false
              }
            }).then(() => {
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
      }
    },
    getInfo(id) {
      this.getStructureId({
        id: id
      });
    },
    filterTag(value, row) {
      return row.level === value;
    }
  },
  created() {
    this.initData();
  }
};
</script>
