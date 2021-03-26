<template>
  <div class="app-assess-questionnaire">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group>
            <!--<el-button @click.native="handleAdd" type="primary" icon="el-icon-plus">新增</el-button>-->
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-input
                placeholder="搜索问卷类型"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="assess-questionnaire-main">
        <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="问卷类型"></el-table-column>
          <el-table-column align="center" prop="createTime" label="添加时间">
            <template slot-scope="scope">
              <span v-cloak>{{ scope.row.optime | TimestampChangeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.is_data===0"
                size="mini"
                @click.native="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button @click.native="handleInfo(scope.row)" size="mini" type="primary">详情</el-button>
              <!--<el-button @click.native="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>-->
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
    <!--新增问卷-->
    <el-dialog
      :title="key?'新增调查问卷':'编辑调查问卷'"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      width="60%"
    >
      <el-form ref="form" :model="form" label-width="100px" style="text-align: left">
        <el-form-item label="问卷名称：" :rules="[{required: true}]">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
              <el-input v-model.trim="form.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="问卷题目：" :rules="[{required: true}]">
          <div style="font-size: 12px;color: #ff0000">* 请至少选择一项问卷题目</div>
          <el-checkbox-group v-model="form.rfields">
            <el-checkbox
              v-for="(item,index) in zdTable"
              :key="index"
              :label="item.name"
              style="margin-left: 0;margin-right: 12px"
            >{{ item.description}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!--<el-form-item label="自定义题目：">-->
        <!--<el-row>-->
        <!--<el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="16">-->
        <!--<el-input v-model.trim="form.add" clearable>-->
        <!--<el-button @click.native="handleAddTopic" slot="append">添加</el-button>-->
        <!--</el-input>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button @click.native="dialogTableVisible=false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--详情-->
    <el-dialog
      :title="infoData.name"
      center
      :visible.sync="dialogVisible1"
      width="60%"
      append-to-body
    >
      <div>
        <el-form label-width="360px" label-position="left" style="text-align: left" @submit.native.prevent>
          <template v-for="(item,index) in infoData.list">
            <el-form-item :label="item.title" :key="index">
              <template v-if="item.type==='r_adio'">
                <el-radio-group>
                  <el-radio v-for="(val,ind) in item.value" :key="ind" :label="val"></el-radio>
                </el-radio-group>
              </template>
              <template v-else>
                <el-input type="textarea" :rows="3" placeholder="请输入内容" disabled></el-input>
              </template>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-assess-questionnaire",
  data() {
    return {
      showDelete: false,
      tableData: [],
      total: 0,
      getForm: {
        sea_field: "name",
        keywords: "",
        page: 1,
        limit: 20
      },
      dialogTableVisible: false,
      form: {
        name: "", // 问卷名称
        rfields: []
        // add:''
      },
      key: 1,
      updateId: 0,
      zdTable: [],
      idarr: [],
      dialogVisible1: false,
      infoData: {}
    };
  },
  methods: {
    ...mapActions([
      "getZdFields",
      "getAssessQuestionnaire",
      "addAssessQuestionnaire",
      "getAssessQuestionnaireInfo",
      "updateAssessQuestionnaire",
      "deleteAssessQuestionnaire"
    ]),
    initData() {
      this.getAssessQuestionnaire({
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
      });
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleAdd() {
      this.key = 1;
      Object.assign(this.form, this.$options.data().form);
      this.dialogTableVisible = true;
    },
    onSubmit() {
      // 保存新增
      if (!this.form.name) {
        this.$message({
          message: "问卷名称不能为空！",
          type: "warning"
        });
        return false;
      }
      if (!this.form.rfields.length) {
        this.$message({
          message: "至少选择一个问卷题目！",
          type: "warning"
        });
        return false;
      }
      if (this.key) {
        this.addAssessQuestionnaire({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogTableVisible = false;
            this.$message({
              message: "新增问卷调查成功！",
              type: "success",
              onClose: () => {
                Object.assign(this.form, this.$options.data().form);
              }
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
        this.updateAssessQuestionnaire({
          id: this.updateId,
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogTableVisible = false;
            this.$message({
              message: "修改问卷调查成功！",
              type: "success",
              onClose: () => {
                Object.assign(this.form, this.$options.data().form);
              }
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
    handleSelectionChange(val) {
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.idarr = val.map(item => {
        return item.id;
      });
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.initData();
      }
    },
    handleEdit(val) {
      this.key = 0;
      this.updateId = val.id;
      this.getAssessQuestionnaireInfo({
        id: val.id
      }).then(data => {
        if (data.data.code === 200) {
          const DATA = data.data.data;
          let list = DATA.answert_list.map(item => {
            return item.name;
          });
          let obj = {
            name: DATA.name,
            rfields: list
          };
          Object.assign(this.form, obj);
        }
      });
      this.dialogTableVisible = true;
    },
    handleInfo(val) {
      this.getAssessQuestionnaireInfo({
        id: val.id
      }).then(data => {
        if (data.data.code === 200) {
          let list = data.data.data.answert_list.map(item => {
            if (item.d_value) {
              return {
                title: item.description,
                type: item.type,
                value: item.d_value.split("#")
              };
            } else {
              return {
                title: item.description,
                type: item.type,
                value: ""
              };
            }
          });
          this.infoData = {
            name: data.data.data.name,
            list: list
          };
          this.dialogVisible1 = true;
        }
      });
    },
    handleDelete(val) {
      // 删除当前问卷
      this.$confirm("此操作将彻底删除该问卷调查, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAssessQuestionnaire({
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
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  beforeMount() {
    this.initData();
    this.getZdFields().then(data => {
      if (data.data.code === 200) {
        this.zdTable = data.data.data.list;
      }
    });
  }
};
</script>
