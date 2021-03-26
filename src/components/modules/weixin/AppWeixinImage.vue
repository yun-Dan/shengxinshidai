<template>
  <div class="app-weixin-image">
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
          <el-input placeholder="搜索标题" v-model.trim="getForm.keyword" clearable>
            <el-button slot="append" icon="el-icon-search" @click.native="handlerSearch"></el-button>
          </el-input>
        </div>
      </div>
      <div class="weixin-image-main" v-cloak>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          class="image-table"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="标题"></el-table-column>
          <el-table-column align="center" prop="keyword" label="关键字" width="160"></el-table-column>
          <el-table-column align="center" prop="date" label="创建日期" width="180">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" prop="usort" label="排序值" width="80"></el-table-column>
          <el-table-column header-align="center" prop="description" label="简介"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click.native="handlerEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click.native="handlerDelete(scope.row.id)">删除</el-button>
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
      title="图文管理"
      :visible.sync="dialogFormVisible"
      width="800px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
      <el-form ref="form" :model="form" label-position="top" style="text-align: left">
        <el-form-item label="标题：" :rules="[{required: true}]">
          <el-input v-model.trim="form.title"></el-input>
        </el-form-item>
        <el-form-item label>
          <template slot="label">
            <span>关键字：</span>
            <span class="input-tip">（ *多个关键词请用一个空格符隔开：例如: 美丽 漂亮 好看 ）</span>
          </template>
          <el-input v-model.trim="form.keyword"></el-input>
        </el-form-item>
        <el-form-item label="链接ULR：">
          <el-input v-model.trim="form.url"></el-input>
        </el-form-item>
        <el-form-item label="简介：">
          <el-input
            type="textarea"
            :rows="6"
            v-model.trim="form.description"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="详情页内容：" style="clear: both">
          <div class="ueditor-box">
            <UE :defaultMsg="content" :config="UE_config.options_document" ref="ue"></UE>
          </div>
        </el-form-item>
        <el-form-item label="封面图片：" style="width: 50%; margin-right: 10%" class="fl">
          <div class="upload-box">
            <el-upload
              class="upload"
              :action="uploadExcelUrl1"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :headers="headers"
              name="attachment"
              accept=".jpg, .JPG, .png, .PNG"
              :file-list="fileList"
              :limit="1"
              :auto-upload="true"
            >
              <el-button
                :key="1"
                type="primary"
                size="mini"
                icon="el-icon-upload el-icon--right"
              >上 传</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="详情页是否显示封面：" style="width: 40%" class="fl">
          <el-radio-group v-model="form.showpic">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top: 20px; clear: both">
        <el-button type="primary" @click.native=" handleTrue">提 交</el-button>
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UE from "@/components/compose/AppUE";
import UE_config from '@/assets/js/UE_config.js'

export default {
  name: "app-weixin-image",
  data() {
    return {
      headers: {},
      showAll: false,
      showDelete: false,
      tableData: [],
      total: 0,
      getForm: {
        page: 1,
        limit: 20,
        keyword: ""
      },
      dialogFormVisible: false,
      key: 1, // 新增1，编辑是0
      form: {
        id: 0,
        title: "",
        keyword: "",
        description: "", //简介
        pic: "",
        content: "", //详细内容
        url: "",
        showpic: 0 //是否为封面(0否 1是)
      },
      ids: [],
      imageUrl: "",
      //上传文件列表
      fileList: [],
      //富文本编辑框
      content: "",
      UE_config
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1"])
  },
  components: {
    UE
  },
  methods: {
    ...mapActions([
      "getWeiXinImage",
      "getWeiXinImageInfo",
      "addWeiXinImage",
      "updateWeiXinImage",
      "deleteWeiXinImage",
      "deleteWeiXinImageSelected"
    ]),
    initData() {
      this.getWeiXinImage({
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
      this.fileList = [];
      Object.assign(this.form, this.$options.data().form);
      delete this.form.id;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.content = this.form.content;
      });
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
      this.showAll = false;
    },
    deleteChecked() {
      this.$confirm("此操作将删除所选中的消息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteWeiXinImageSelected({
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
    handlerSearch() {
      if (!this.getForm.keyword) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.initData();
        this.showAll = true;
      }
    },
    handlerEdit(val) {
      this.key = 0;
      this.getWeiXinImageInfo({
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
          if (this.form.pic) {
            this.fileList = [
              {
                name: "封面图片",
                code: this.form.pic
              }
            ];
          }
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.content = this.form.content;
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleTrue() {
      // 编辑框的确认按钮   ===>  新增1，编辑是0
      if (!this.form.title) {
        this.$message({
          type: "warning",
          message: "标题不能为空！"
        });
        return false;
      }
      let content = this.$refs.ue.getUEContent();
      this.$set(this.form, "content", content);
      if (this.key) {
        this.addWeiXinImage({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        this.updateWeiXinImage({
          id: this.form.id,
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogFormVisible = false;
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
    handlerDelete(id) {
      this.$confirm("此操作将彻底删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteWeiXinImage({
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
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form, "pic", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove(file, fileList) {
      this.$set(this.form, "pic", "");
      this.fileList = [];
    }
  },
  created () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    this.initData()
  }
};
</script>

<style scoped>
.input-tip {
  font-size: 12px;
  color: #8492a6;
}
</style>
