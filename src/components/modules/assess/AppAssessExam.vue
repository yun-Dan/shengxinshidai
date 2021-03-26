<template>
  <div class="app-assess-exam" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group>
            <el-button v-if="isYXB" @click="$router.go(-1)" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleAdd(false)" type="primary" icon="el-icon-plus">新增</el-button>
            <el-button @click.native="handleAll" type icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.types" placeholder="试题类型" clearable @change="handleChange">
                <template v-for="item in examType">
                  <el-option
                    :key="item.value"
                    v-if="!item.disabled"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.status" placeholder="试题状态" clearable @change="handleChange">
                <el-option label="禁用" :value="1"></el-option>
                <el-option label="启用" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.review_status"
                placeholder="审核状态"
                clearable
                @change="handleChange"
              >
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="审核通过" :value="3"></el-option>
                <el-option label="审核不通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索试题名称"
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
      <div class="assess-exam-main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="试题名称"></el-table-column>
          <el-table-column align="center" prop="types" label="试题类型">
            <template slot-scope="scope">
              <span>{{ examType[scope.row.types].label}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="realname" label="创建人">
            <template slot-scope="scope">
              <span>{{ scope.row.realname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="college" label="所属学院/部门">
            <template slot-scope="scope">
              <div>{{ scope.row.college }}</div>
              <div style="color: rgba(94,126,159,0.92)">{{ scope.row.structure }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="试题状态">
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
          <el-table-column align="center" prop="review_status" label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.review_status === 1" class="warning">待审核</span>
              <template v-if="scope.row.review_status === 2">
                <span class="danger">审核不通过</span>
                <div class="info">【未通过原因】：{{ scope.row.reason}}</div>
              </template>
              <span v-if="scope.row.review_status === 3" class="success">审核通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="270">
            <template slot-scope="scope">
              <el-button
                v-if="userInfo.role === 1 && scope.row.review_status !== 3"
                size="mini"
                type="primary"
                @click.native="handleCheck(scope.row)"
              >审核</el-button>
              <el-button
                v-if="userInfo.role === 1 || scope.row.review_status === 2"
                size="mini"
                @click.native="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="userInfo.role !== 1 && scope.row.review_status !== 2"
                size="mini"
                type="primary"
                @click.native="handleEdit(scope.row, false)"
              >查看</el-button>
              <el-button
                v-if="userInfo.role === 1 || scope.row.review_status === 2"
                :disabled="scope.row.is_used === 1"
                @click.native="handleDelete(scope.row)"
                type="danger"
                size="mini"
              >删除</el-button>
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
      :title="`${key ? '新增' : '编辑'}试题`"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      width="680px"
      class="app-assess-exam-el-dialog"
    >
      <el-form
        ref="form"
        :model="form"
        size="small"
        label-width="140px"
        style="text-align: left; margin-right: 60px"
      >
        <el-form-item label="试题类型：" :rules="[{required: !is_check}]">
          <span v-if="is_check && examType[form.types]">{{ examType[form.types].label }}</span>
          <el-select
            v-else
            v-model="form.types"
            placeholder="试题类型"
            style="width: 100%;"
            :disabled="is_check"
          >
            <template v-for="item in examType">
              <el-option
                :key="item.value"
                v-if="!item.disabled"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="试题名称：" :rules="[{required: !is_check}]">
          <span v-if="is_check">{{ form.title }}</span>
          <el-input v-else v-model.trim="form.title" :disabled="is_check"></el-input>
        </el-form-item>
        <el-form-item v-if="form.types === 1" label="是否计算平均值：" :rules="[{required: !is_check}]">
          <span v-if="is_check">{{ form.calculate ? '是' : '否' }}</span>
          <el-radio-group
            v-else
            v-model="form.calculate"
            @change="handleChangeCalculate"
            :disabled="is_check"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.types && form.types < 3"
          label="试题选项："
          :rules="[{required: !is_check}]"
        >
          <div style="height: 34px">
            <el-button v-if="!is_check" type="primary" size="mini" @click="addDomain">增加选项</el-button>
          </div>
          <div v-for="(item, index) in examOption" :key="item.key" style="margin: 4px 0">
            <el-row :gutter="10">
              <el-col :span="2">
                <div style="text-align: left">{{ index + 1 }}、</div>
              </el-col>
              <el-col :span="16">
                <template v-if="is_check">{{ item.value }} {{ form.calculate ? '分。' : '' }}</template>
                <template v-else>
                  <el-input-number
                    style="width: 100%"
                    controls-position="right"
                    v-if="form.types === 1 && form.calculate === 1"
                    v-model="item.value"
                    :min="1"
                  ></el-input-number>
                  <el-input v-else v-model.trim="item.value"></el-input>
                </template>
              </el-col>
              <el-col :span="6">
                <el-button v-if="!is_check" @click.prevent="removeDomain(item)" type="text">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="试题备注：">
          <span v-if="is_check">{{ form.note || '（无）' }}</span>
          <el-input v-else v-model.trim="form.note" type="textarea" :disabled="is_check"></el-input>
        </el-form-item>
        <el-form-item v-if="userInfo.role === 1" label="试题推荐：" :rules="[{required: !is_check}]">
          <div v-if="!is_check" class="info" style="font-size: 12px">（* 默认试题：无自定义问卷权限的用户 ）</div>
          <span v-if="is_check">{{ form.is_recommended ? '推荐' : '不推荐'}}</span>
          <el-radio-group v-else v-model="form.is_recommended" :disabled="is_check">
            <el-radio :label="0">不推荐</el-radio>
            <el-radio :label="1">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="is_check">
          <el-form-item label="审核状态：" :rules="[{required: true}]">
            <el-radio-group v-model="checkForm.review_status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="checkForm.review_status===2"
            label="不通过原因："
            :rules="[{required: true}]"
          >
            <el-input v-model.trim="checkForm.reason" type="textarea"></el-input>
          </el-form-item>
        </template>
        <el-form-item style="text-align: center">
          <el-button @click.native="dialogTableVisible=false">取 消</el-button>
          <el-button v-if="is_check" type="primary" @click="handleCheckTrue">确 定</el-button>
          <el-button v-else type="primary" @click="onSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-assess-exam",
  data() {
    return {
      loading: false,
      getForm: {
        keywords: "",
        types: null,
        status: null,
        review_status: null,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      form: {
        title: "", // 试题名称
        types: null, // 1单选、2多选、3问答题、4填空题、5排序题
        default: null, // 取值范围：空（types=3）、字符串、数组（types=1、2、5）
        calculate: 0, // 单选题是否计算平均值:0否，1是
        is_allowed: 0,
        note: "",
        is_recommended: 0 // 无自定义问卷用户默认试题推荐:0不推荐，1推荐 （超级管理员录入）
      },
      dialogTableVisible: false,
      key: 1,
      updateId: 0,
      examOption: [
        {
          value: null,
          key: 123
        }
      ], // 单选、多选的选项
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
      }, // 试题类型
      //审核
      is_check: false,
      checkForm: {
        id: null,
        review_status: 3, // 2不通过、3通过
        reason: ""
      },
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getAssessExamList",
      "addAssessExam",
      "getAssessExamInfo",
      "updateAssessExam",
      "deleteAssessExam",
      "statusAssessExam",
      "checkAssessExam"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAssessExamList({
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
    handleAdd(is_check) {
      this.is_check = is_check;
      this.key = 1;
      Object.assign(this.form, this.$options.data().form);
      this.examOption = this.$options.data().examOption;
      this.dialogTableVisible = true;
    },
    onSubmit() {
      // 保存新增
      let Obj = Object.assign({}, this.form);
      if (this.form.types > 2) {
        // 3问答题、4填空题、5排序题
        Object.assign(Obj, {
          default: null,
          calculate: 0
        });
      } else {
        // 1单选、多2选
        let list = this.examOption.filter(item => {
          return item.value;
        });
        let newList = list.map(item => {
          return this.form.types === 1 ? item.value : `${item.value}`;
        });
        Object.assign(Obj, {
          default: newList,
          calculate: this.form.types === 1 ? this.form.calculate : 0
        });
      }
      if (!Obj.types) {
        this.$message({
          message: "请选择试题类型！",
          type: "warning"
        });
        return false;
      }
      if (!Obj.title) {
        this.$message({
          message: "试题名称不能为空！",
          type: "warning"
        });
        return false;
      }
      if (Obj.default && !Obj.default.length) {
        this.$message({
          message: "请创建试题选项！",
          type: "warning"
        });
        return false;
      }
      if (this.key) {
        this.addAssessExam({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogTableVisible = false;
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
        this.updateAssessExam({
          id: this.updateId,
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogTableVisible = false;
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
    handleEdit(val, is_check) {
      this.is_check = is_check;
      this.key = 0;
      this.updateId = val.id;
      this.dialogTableVisible = true;
      if (this.dialogTableVisible) {
        this.getAssessExamInfo({
          id: val.id
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            Object.assign(this.form, this.$options.data().form, {
              title: Data.title,
              types: Data.types,
              is_allowed: Data.is_allowed,
              note: Data.note,
              is_recommended: Data.is_recommended,
              calculate: Data.calculate
            });
            if (
              Data.default &&
              Data.default.length &&
              typeof Data.default === "object"
            ) {
              this.examOption = Data.default.map((item, index) => {
                return {
                  value: item,
                  key: index
                };
              });
            }
            if (is_check) {
              Object.assign(this.checkForm, this.$options.data().checkForm, {
                id: val.id
              });
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
    handleDelete(val) {
      // 删除当前问卷
      this.$confirm("此操作将彻底删除该试题信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAssessExam({
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
    handleCheck(val) {
      this.handleEdit(val, true);
    },
    handleCheckTrue() {
      let Obj = Object.assign({}, this.checkForm);
      if (Obj.review_status === 2) {
        if (!Obj.reason) {
          this.$message.warning({
            message: "审核不通过原因不能为空！"
          });
          return false;
        }
      } else if (Obj.review_status === 3) {
        Object.assign(Obj, {
          reason: ""
        });
      }
      this.checkAssessExam({
        data: Obj
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.initData();
          this.is_check = false;
          this.dialogTableVisible = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
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
    removeDomain(item) {
      let index = this.examOption.indexOf(item);
      if (index !== -1) {
        this.examOption.splice(index, 1);
      }
    },
    addDomain() {
      this.examOption.push({
        value: "",
        key: Date.now()
      });
    },
    handleChangeSwitch(val) {
      this.statusAssessExam({
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
    },
    handleChangeCalculate(val) {
      if (val) {
        this.examOption = this.$options.data().examOption;
      } else {
        this.examOption = this.$options.data().examOption;
      }
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
    this.initData()
  }
};
</script>
