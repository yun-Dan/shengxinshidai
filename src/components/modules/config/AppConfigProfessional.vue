<template>
  <div class="app-config-professional" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button @click.native="handleUpdate(1)" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button type icon="el-icon-menu" @click.native="handleSearch(0)">全部</el-button>
        </el-button-group>
        <div class="fr query-box">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.isshow" placeholder="状态" @change="handleSearch" clearable>
                <el-option label="开启" :value="1"></el-option>
                <el-option label="关闭" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.type" placeholder="所属类型" @change="handleSearch" clearable>
                <el-option label="成人学历教育" :value="1"></el-option>
                <el-option label="网络学历教育" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="专业名称"
                v-model.trim="getForm.name"
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
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
          <el-table-column align="center" prop="name" label="专业名称"></el-table-column>
          <el-table-column align="center" prop="enname" label="英文名称"></el-table-column>
          <el-table-column align="center" prop="code" label="专业代码"></el-table-column>
          <el-table-column align="center" label="所属类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 1" size="mini" effect="plain">成人学历教育</el-tag>
              <el-tag
                v-else-if="scope.row.type === 2"
                type="success"
                size="mini"
                effect="plain"
              >网络学历教育</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-switch
                @change="handleStatusChange(scope.row)"
                v-model="scope.row.isshow"
                :active-value="1"
                active-color="#67C23A"
                :inactive-value="2"
                inactive-color="#F56C6C"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sort" label="排序值" min-width="60"></el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click.native="handleUpdate(scope.row)">修改</el-button>
              <el-button @click.native="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--新增、编辑-->
    <el-dialog
      title="专业信息"
      :visible.sync="dialogVisible"
      append-to-body
      center
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="form"
        label-width="100px"
        style="text-align: left; margin-right: 20px"
        v-loading="dialogLoading"
      >
        <el-form-item label="专业名称：" :rules="[{required: true}]">
          <el-input v-model.trim="form.name" placeholder="请输入专业名称"></el-input>
        </el-form-item>
        <el-form-item label="英文名称：" :rules="[{required: true}]">
          <el-input v-model.trim="form.enname" placeholder="请输入英文名称"></el-input>
        </el-form-item>
        <el-form-item label="专业代码：" :rules="[{required: true}]">
          <el-input v-model.trim="form.code" placeholder="请输入专业代码"></el-input>
        </el-form-item>
        <el-form-item label="所属类型：" :rules="[{required: true}]">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">成人学历教育</el-radio>
            <el-radio :label="2">网络学历教育</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序值：">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
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
import { mapActions } from "vuex";
export default {
  name: "app-config-professional",
  data() {
    return {
      loading: false,
      getForm: {
        name: "",
        isshow: null, // 1开启、2关闭
        type: null // 1成人教育、2网络教育
      },
      tableData: [],
      total: 0,
      key: 1, // 1新增、0编辑
      id: null,
      form: {
        name: "", // 专业名称
        enname: "", // 英文名
        code: "", // 专业代码
        type: 1, // 1成教、2网教
        isshow: 1, // 是否开启：1开、2关
        sort: 0 // 排序
      },
      dialogVisible: false,
      dialogLoading: false
    };
  },
  methods: {
    ...mapActions([
      "getProfessionalList",
      "getProfessionalInfo",
      "addProfessional",
      "updateProfessional",
      "deleteProfessional"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getProfessionalList({
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
    handleSearch(type) {
      // @type: 0搜索全部
      if (type === 0) {
        Object.assign(this.getForm, this.$options.data().getForm);
      }
      this.initData();
    },
    handleUpdate(val) {
      // @val：1新增、{}编辑
      this.dialogLoading = false;
      if (val === 1) {
        this.key = 1;
        Object.assign(this.form, this.$options.data().form);
      } else {
        this.key = 0;
        this.id = val.id;
        Object.assign(this.form, {
          name: val.name,
          enname: val.enname,
          code: val.code,
          type: val.type,
          isshow: val.isshow,
          sort: val.sort
        });
      }
      this.dialogVisible = true;
    },
    handleTrue() {
      if (!this.form.name) {
        this.$message({
          type: "warning",
          message: "专业名称不能为空！"
        });
        return false;
      }
      if (!this.form.enname) {
        this.$message({
          type: "warning",
          message: "英文名称不能为空！"
        });
        return false;
      }
      if (!this.form.code) {
        this.$message({
          type: "warning",
          message: "专业代码不能为空！"
        });
        return false;
      }
      this.dialogLoading = true;
      if (this.dialogLoading) {
        if (this.key) {
          this.addProfessional({
            data: this.form
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
                  this.dialogLoading = false;
                }
              });
            }
          });
        } else {
          this.updateProfessional({
            data: this.form,
            id: this.id
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
                  this.dialogLoading = false;
                }
              });
            }
          });
        }
      }
    },
    handleDelete(val) {
      this.$confirm("是否删除所选专业信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteProfessional({
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
    handleStatusChange(val) {
      this.updateProfessional({
        data: {
          name: val.name,
          enname: val.enname,
          code: val.code,
          type: val.type,
          isshow: val.isshow,
          sort: val.sort
        },
        id: val.id
      }).then(data => {
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
  created() {
    this.initData();
  }
};
</script>
