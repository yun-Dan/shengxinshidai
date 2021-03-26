<template>
  <div class="app-assess-preset" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group>
            <el-button v-if="isYXB" @click="$router.go(-1)" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleUpdate(1)" type="primary" icon="el-icon-plus">新增</el-button>
            <el-button @click.native="handleAll" type icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleChange">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.status" placeholder="状态" clearable @change="handleChange">
                <el-option label="禁用" :value="1"></el-option>
                <el-option label="启用" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="预设问卷标题"
                v-model.trim="getForm.title"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" @click.native="handleChange" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="assess-preset-main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="预设问卷标题"></el-table-column>
          <el-table-column align="center" prop="status" label="问卷状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change="handleChangeSwitch(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="2"
                :inactive-value="1"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="270">
            <template slot-scope="scope">
              <el-button v-if="userInfo.role === 1" size="mini" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
              <el-button
                v-if="userInfo.role === 1"
                type="danger"
                size="mini"
                @click.native="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="primary"
                @click.native="handleUpdate(0, scope.row, true)"
              >试题管理</el-button>
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
      :title="`${key ? '新增' : '编辑'}预设问卷`"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      width="700px"
      class="app-assess-exam-el-dialog app-el-transfer"
    >
      <el-form
        ref="form"
        :model="form"
        label-position="top"
        style="text-align: left"
        v-loading="dialogLoading"
      >
        <el-form-item label="预设问卷标题：" :rules="[{required: true}]">
          <el-input v-model.trim="form.title"></el-input>
        </el-form-item>
        <el-form-item label="预设问卷试题：" :rules="[{required: true}]">
          <el-transfer
            v-model="form.question_ids"
            :data="transferData"
            style="height: 500px"
            filterable
            :titles="[ '待选试题', '已选试题' ]"
            filter-placeholder="试题名称、试题类型搜索"
          ></el-transfer>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button @click.native="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleTrue">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--查看-->
    <el-dialog
      :title="showData.title"
      :visible.sync="dialogVisible2"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      width="60%"
      class="app-assess-exam-el-dialog app-el-transfer"
    >
      <div v-loading="dialogLoading">
        <el-table
          v-if="showData.questions && showData.questions.list"
          :data="showData.list"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" type="index" width="60"></el-table-column>
          <el-table-column align="center" prop="title" label="试题名称"></el-table-column>
          <el-table-column align="center" prop="types" label="试题类型">
            <template slot-scope="scope">
              <span>{{ examType[scope.row.types].label}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="is_required" label="是否必填">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_required"
                @change="handleChangeSwitchRequired(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sort" label="排序">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.sort"
                controls-position="right"
                :min="0"
                size="mini"
                style="width: 90px"
                @change="handleChangeSort(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="userInfo.role === 1"
                type="text"
                size="mini"
                @click.native="handleDeleteQue(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-assess-preset",
  data() {
    return {
      loading: false,
      getForm: {
        title: "",
        status: null,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      form: {
        title: "", // 预设问卷名称
        question_ids: []
      },
      dialogVisible: false,
      dialogLoading: false,
      key: 1,
      updateId: 0,
      examList: [],
      examType: {
        "1": {
          label: "单选",
          value: 1,
          disabled: false
        },
        "2": {
          label: "多选",
          value: 2,
          disabled: false
        },
        "3": {
          label: "问答题",
          value: 3,
          disabled: false
        },
        "4": {
          label: "填空题",
          value: 4,
          disabled: true
        },
        "5": {
          label: "填空题",
          value: 5,
          disabled: true
        }
      },
      //查看详情
      is_look: false,
      dialogVisible2: false,
      showData: {
        questions: {
          list: []
        },
        list: []
      },
      changeForm: {
        id: null,
        sort: 0, // 排序值
        is_required: 0 // 0非必填，1必填
      },
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo']),
    transferData() {
      let list = [];
      if (this.showData && this.showData.questions) {
        list = this.showData.questions.list.map(item => {
          return item.question_id;
        });
      }
      if (this.key) {
        return this.examList.map(item => {
          return {
            key: item.id,
            label: `${item.title}（${
              this.examType[item.types] ? this.examType[item.types].label : ""
            }）`,
            disabled: false
          };
        });
      } else {
        return this.examList.map(item => {
          return {
            key: item.id,
            label: `${item.title}（${
              this.examType[item.types] ? this.examType[item.types].label : ""
            }）`,
            disabled: list.indexOf(item.id) != -1
          };
        });
      }
    }
  },
  methods: {
    ...mapActions([
      "getAssessPresetList",
      "getAssessPresetInfo",
      "addAssessPreset",
      "updateAssessPreset",
      "deleteAssessPreset",
      "statusAssessPreset",
      "deleteAssessPresetQue",
      "changeAssessPresetQue",
      "getAssessExamList"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAssessPresetList({
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
    handleChange() {
      this.$set(this.getForm, "page", 1);
      this.$set(this.getForm, "limit", 20);
      this.initData();
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleUpdate(key, val, is_look = false) {
      this.is_look = is_look;
      this.key = key;
      Object.assign(this.form, this.$options.data().form);
      if (this.is_look) {
        this.dialogVisible2 = true;
      } else {
        this.dialogVisible = true;
      }
      this.getExam(key, val);
    },
    getInfo(id) {
      this.dialogLoading = true;
      if (this.dialogLoading) {
        this.getAssessPresetInfo({
          id: id
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.showData = {
              questions: {
                list: []
              },
              list: []
            };
            if (Data.questions && Data.questions.list) {
              this.showData = Data;
              this.$set(this.showData, "list", Data.questions.list);
              if (this.is_look) {
                // this.showData = Data;
                // this.$set(this.showData, 'list', Data.questions.list);
              } else {
                let question_ids = Data.questions.list.map(item => {
                  return item.question_id;
                });
                Object.assign(this.form, {
                  title: Data.title,
                  question_ids: question_ids
                });
                this.$set(this.form, "question_ids", question_ids);
              }
            }
            this.dialogLoading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    getExam(key, val) {
      // 获取试题列表
      this.dialogLoading = true;
      if (this.dialogLoading) {
        this.getAssessExamList({
          data: {
            status: 2, // 启用状态
            review_status: 3, // 审核通过
            page: 1,
            limit: 999999
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.examList = Data.list;
            this.dialogLoading = false;
            if (!key && val.id) {
              this.updateId = val.id;
              this.getInfo(val.id);
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleTrue() {
      // 保存新增
      let Obj = Object.assign({}, this.form);
      if (!Obj.title) {
        this.$message({
          message: "预设问卷标题不能为空！",
          type: "warning"
        });
        return false;
      }
      if (!Obj.question_ids.length) {
        this.$message({
          message: "请选择预设问卷试题项不能为空！",
          type: "warning"
        });
        return false;
      }
      if (this.key) {
        this.addAssessPreset({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogVisible = false;
            this.$message({
              message: "操作成功！",
              type: "success"
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
        this.updateAssessPreset({
          id: this.updateId,
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogVisible = false;
            this.$message({
              message: "操作成功！",
              type: "success"
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
    handleDelete(val) {
      // 删除当前问卷
      this.$confirm("此操作将彻底删除该预设问卷信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAssessPreset({
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
    handleDeleteQue(val) {
      // 删除当前问卷的试题
      this.$confirm("此操作将彻底删除该问卷的试题信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAssessPresetQue({
            data: {
              id: val.id
            }
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              let list = this.showData.list.filter(item => {
                return item.id !== val.id;
              });
              this.$set(this.showData, "list", list);
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
    handleChangeSwitchRequired(val) {
      // 是否必填
      this.changeAssessPresetQue({
        data: {
          is_required: val.is_required,
          id: val.id
        }
      }).then(data => {
        if (data.data.code === 200) {
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleChangeSort(val) {
      this.loading = true;
      if (this.loading) {
        this.changeAssessPresetQue({
          data: {
            sort: val.sort,
            id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    },
    handleChangeSwitch(val) {
      this.statusAssessPreset({
        data: {
          ids: [val.id],
          status: val.status
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
  },
  created () {
    this.isYXB = this.isYXBPublic()
    this.initData()
  }
}
</script>
