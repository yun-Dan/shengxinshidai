<template>
  <div class="app-students-check-list" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="text" icon="el-icon-d-arrow-left" @click.native="$router.go(-1)">返回</el-button>&nbsp;
        <span class="app-students-list-title">{{ query.pro_name }}</span>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="姓名" min-width="50px"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别" width="45px"></el-table-column>
          <el-table-column align="center" prop="national" label="民族" min-width="50px"></el-table-column>
          <el-table-column align="center" prop="idcard" label="身份证号"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号码"></el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
          <el-table-column align="center" prop="company" label="工作单位"></el-table-column>
          <el-table-column align="center" prop="resign" label="职务" min-width="50px"></el-table-column>
          <el-table-column align="center" label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
              <span v-if="scope.row.status===2" style="color: #67c23a">通过</span>
              <span v-if="scope.row.status===3" style="color: #f56c6c">不通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click.native="handleCheck(scope.row.id)"
                plain
              >审核</el-button>
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
      title="学员审核信息"
      :visible.sync="dialogVisible"
      center
      append-to-body
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="120px" style="text-align: left" v-cloak>
        <el-form-item label="【姓名】：">{{ studentsId.name }}</el-form-item>
        <el-form-item label="【性别】：">
          <span v-if="studentsId.sex">{{ studentsId.sex }}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【民族】：">
          <span v-if="studentsId.national">{{ studentsId.national }}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【身份证号】：">
          <span v-if="studentsId.idcard">{{ studentsId.idcard }}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【手机号码】：">
          <span v-if="studentsId.mobile">{{ studentsId.mobile }}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【邮箱】：">
          <span v-if="studentsId.email">{{ studentsId.email}}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【工作单位】：">
          <span v-if="studentsId.company">{{ studentsId.company }}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【职务】：">
          <span v-if="studentsId.resign">{{ studentsId.resign}}</span>
          <span v-else style="color: #f56c6c">未填写</span>
        </el-form-item>
        <el-form-item label="【审核状态】：">
          <span v-if="studentsId.status===1" style="color: #000">待审核</span>
          <span v-if="studentsId.status===2">审核通过</span>
          <span v-if="studentsId.status===3">审核不通过</span>
        </el-form-item>
      </el-form>
      <el-form
        ref="checkForm"
        :model="checkForm"
        label-width="120px"
        style="text-align: left; margin-right: 40px;"
      >
        <el-form-item label="审核结果：" :rules="[{required: true}]">
          <el-radio-group v-model="checkForm.status">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="checkForm.status===3" label="不通过原因：" :rules="[{required: true}]">
          <el-input type="textarea" v-model.trim="checkForm.status_btyy"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCheckTrue">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-students-check-list",
  data() {
    return {
      loading: false,
      getForm: {
        pro_id: 0,
        sea_field: "name",
        keywords: "",
        page: 1,
        limit: 20,
        status: [1, 2, 3],
        source: 2
      },
      total: 0,
      tableData: [],
      studentsId: {},
      dialogVisible: false,
      checkForm: {
        id: 0,
        status: 2,
        status_btyy: "",
        status_userid: 0
      },
      query: {}
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getStudentsData", "getStudentsId", "studentsCheck"]),
    initData() {
      let id = this.$route.params.id;
      this.$set(this.getForm, "pro_id", id);
      this.loading = true;
      if (this.loading) {
        this.getStudentsData({
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
    handleCheck(id) {
      this.getStudentsId({
        id: id
      }).then(data => {
        if (data.data.code === 200) {
          Object.assign(this.studentsId, data.data.data);
          this.dialogVisible = true;
          this.$set(this.checkForm, "id", id);
        }
      });
    },
    handleCheckTrue() {
      if (this.checkForm.status === 3) {
        if (!this.checkForm.status_btyy) {
          this.$message({
            type: "warning",
            message: "审核不通过原因不能为空！"
          });
          return false;
        }
      }
      this.$set(this.checkForm, "status_userid", this.userInfo.uid);
      this.studentsCheck({
        data: this.checkForm
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
  created() {
    this.initData();
    this.query = this.$route.query;
  }
}
</script>

<style scoped>
.app-students-list-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
ul {
  margin-bottom: 20px;
}
li {
  border-bottom: 1px solid #8492a6;
  background-color: #fafafa;
  line-height: 30px;
}
li strong {
  display: inline-block;
  width: 140px;
}
</style>
