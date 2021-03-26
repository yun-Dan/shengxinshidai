<template>
  <div class="app-weixin-text">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button icon="el-icon-plus" type="primary" @click.native="handleAdd">新增</el-button>
          <el-button v-if="showAll" icon="el-icon-menu" type @click.native="handleAll">全部</el-button>
          <el-button
            v-if="showDelete"
            type="danger"
            icon="el-icon-delete"
            @click.native="deleteChecked"
          >删除</el-button>
        </el-button-group>
        <div class="search-box">
          <el-input
            placeholder="搜索回复内容关键字"
            v-model.trim="getForm.keyword"
            clearable
            style="width: 210px"
          >
            <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
          </el-input>
        </div>
      </div>
      <div class="weixin-text-main" v-cloak>
        <el-table
          :data="tableData"
          class="text-table"
          @selection-change="handleSelectionChange"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建日期" width="180">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column header-align="center" label="关键字" width="160">
            <template slot-scope="scope">{{ scope.row.keyword }}</template>
          </el-table-column>
          <el-table-column header-align="center" prop="text" label="回复内容"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click.native="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="文本管理"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-card v-cloak>
        <el-form ref="form" :model="form" label-width="90px" style="text-align: left">
          <el-form-item label="关键字：">
            <el-input v-model.trim="form.keyword"></el-input>
            <span class="input-tip">* 多个关键词请用一个空格符隔开：例如: 美丽 漂亮 好看</span>
          </el-form-item>
          <el-form-item label="回复内容：">
            <el-input type="textarea" :rows="8" v-model.trim="form.text"></el-input>
            <span class="input-tip">* 请不要多于1000字否则无法发送!</span>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native=" handleTrue">提 交</el-button>
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-weixin-text",
  data() {
    return {
      showAll: false,
      showDelete: false,
      tableData: [],
      total: 0,
      getForm: {
        keyword: "",
        page: 1,
        limit: 20,
        uid: 0
      },
      key: 1, // 新增1，编辑是0
      dialogFormVisible: false,
      form: {
        keyword: "",
        text: "",
        id: 0
      },
      ids: []
    };
  },
  methods: {
    ...mapActions([
      "getWeiXinText",
      "addWeiXinText",
      "updateWeiXinText",
      "deleteWeiXinText",
      "deleteWeiXinTextSelected"
    ]),
    initData() {
      this.getWeiXinText({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.erro
          });
        }
      });
    },
    handleAdd() {
      this.key = 1;
      Object.assign(this.form, this.$options.data().form);
      this.dialogFormVisible = true;
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
      this.showAll = false;
    },
    deleteChecked() {
      this.$confirm("此操作将彻底删除所选数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteWeiXinTextSelected({
            data: {
              ids: this.ids
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
                message: dat.data.error
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
    handleSearch() {
      if (!this.getForm.keyword) {
        this.$message({
          message: "请输入搜索内容！",
          type: "error"
        });
      } else {
        this.initData();
        this.showAll = true;
      }
    },
    handleEdit(val) {
      this.key = 0;
      Object.assign(this.form, {
        keyword: val.keyword,
        text: val.text,
        id: val.id
      });
      this.dialogFormVisible = true;
    },
    handleTrue() {
      // 编辑框的确认按钮   ===>  新增1，编辑是0
      if (!this.form.keyword) {
        this.$message({
          message: "至少输入一个关键字！",
          type: "error"
        });
        return false;
      }
      if (!this.form.text) {
        this.$message({
          message: "输入内容不能为空！",
          type: "error"
        });
        return false;
      } else if (this.form.text.length > 1000) {
        this.$message({
          message: "输入内容不能超过1000字符！",
          type: "error"
        });
        return false;
      }
      if (this.key) {
        delete this.form.id;
        this.addWeiXinText({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogFormVisible = false;
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
      } else {
        this.updateWeiXinText({
          id: this.form.id,
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogFormVisible = false;
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
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将彻底删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteWeiXinText({
            data: {
              ids: this.ids
            },
            id: id
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
      // 选中的checkbox触发的事件
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.ids = val.map(item => {
        return item.id;
      });
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  created () {
    this.initData()
  }
};
</script>

<style scoped>
.input-tip {
  font-size: 12px;
  color: #8492a6;
}
.keyword-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
