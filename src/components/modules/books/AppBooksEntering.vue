<template>
  <div
    class="app-books-entering"
    v-loading="loading1"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">编外项目导入</h3>
      </div>
      <div class="books-entering-main">
        <el-form ref="form" :model="form" label-width="100px" style="text-align: left">
          <el-form-item label="学院名称：" :rules="[{required:true}]">
            <el-select v-model="form.xy" placeholder="请选择学院" style="width: 225px">
              <el-option
                v-for="(item,index) in collegeList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称：" :rules="[{required:true}]">
            <el-input v-model.trim="form.item_name" style="width: 400px"></el-input>
            <span class="tip tip-rule">（ 注：项目名称请不要超过18个字 ）</span>
          </el-form-item>
          <el-form-item label="项目编号：" :rules="[{required:true}]">
            <el-input v-model="form.item_num" :disabled="true" style="width: 225px"></el-input>
          </el-form-item>
          <el-form-item label="课程时间：" :rules="[{required:true}]">
            <el-col :span="8">
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model="form.start_time"
                style="width: 100%;"
                value-format="timestamp"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="8">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model="form.stop_time"
                style="width: 100%;"
                value-format="timestamp"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="Excel：" :rules="[{required:true}]">
            <div class="upload-box">
              <el-upload
                ref="upload"
                class="upload aaa"
                :action="uploadExcelUrl"
                accept=".xls, .xlsx, .XLS, .XLSX"
                :with-credentials="true"
                :show-file-list="true"
                :limit="1"
                :file-list="fileList"
                :on-success="handleSuccess"
                :headers="headers"
                name="attachment"
                :auto-upload="true"
              >
                <el-button :key="1" type="primary">
                  上 传
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
                <span slot="tip" class="el-upload__tip">
                  （
                  <el-button @click.native="handleDownload" type="text">
                    下载
                    <i class="fa fa-download"></i>
                  </el-button>标准格式后上传 ）
                </span>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native="onSubmit">导 入</el-button>
            <el-button @click.native="handleReset">重 置</el-button>
          </el-form-item>
          <el-form-item>
            <div class="text-top">
              <span style="color: #f56c6c">*</span>注：
            </div>
            <div class="text">1.上传名单请使用本网站提供的标准格式，不要添加编号，系统将自动添加。</div>
            <div class="text">2.学员名单导入后如需添加和修改人员，请先删除证书管理中原有名单然后重新导入修改后的EXCEL表格。</div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-books-entering",
  data() {
    return {
      loading1: false,
      form: {
        xy: "", // 学院名称
        item_name: "", // 项目名称
        item_num: "", // 编号
        start_time: "", // 课程开始时间
        stop_time: "", // 课程结束时间
        scfile: "",
        uid: 0
      },
      showUpload: true,
      fileList: [],
      collegeList: []
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl", "URL", 'userInfo'])
  },
  methods: {
    ...mapActions(["getStructures", "AddBookEntering"]),
    initData() {
      this.getStructures({
        data: {
          level: 1
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.collegeList = data.data.data;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
      this.randomNumber();
    },
    // 下载模板
    handleDownload() {
      window.open(this.URL + "/static/file/bwxm.xls");
    },
    // 上传成功的回调  personsImport
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.form, "scfile", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    onSubmit() {
      this.$set(this.form, "uid", this.userInfo.uid);
      const obj = {};
      Object.assign(obj, this.form, {
        start_time: this.form.start_time / 1000,
        stop_time: this.form.stop_time / 1000
      });
      if (!obj.xy) {
        this.$message({
          type: "warning",
          message: "请选择学院名称！"
        });
        return false;
      }
      if (!obj.item_name) {
        this.$message({
          type: "warning",
          message: "请输入项目名称！"
        });
        return false;
      } else if (obj.item_name.length > 18) {
        this.$message({
          type: "warning",
          message: "项目名称不得超过18字！"
        });
        return false;
      }
      if (!obj.start_time) {
        this.$message({
          type: "warning",
          message: "请选择课程开始时间！"
        });
        return false;
      }
      if (!obj.stop_time) {
        this.$message({
          type: "warning",
          message: "请选择课程结束时间！"
        });
        return false;
      }
      if (!obj.scfile) {
        this.$message({
          type: "warning",
          message: "请上传学员名单！"
        });
        return false;
      }
      this.loading1 = true;
      if (this.loading1) {
        this.AddBookEntering({
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data,
              onClose: () => {
                this.$router.push("/home/books/query");
              }
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading1 = false;
              }
            });
          }
        });
      }
    },
    handleReset() {
      Object.assign(this.form, this.$options.data().form);
      this.$delete(this.fileList, 0);
      this.showUpload = true;
      this.randomNumber();
    },
    randomNumber() {
      // 随机产生10位的项目编号
      let random = (new Date().getTime() + "").substring(3);
      this.$set(this.form, "item_num", random);
    }
  },
  created () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    this.initData();
  }
};
</script>

<style scoped>
.books-entering-main {
  width: 60%;
  padding-top: 40px;
  margin: 0 auto;
}
.line {
  text-align: center;
}
.tip-rule {
  color: #8492a6;
}
.text-top {
  font-weight: bold;
  color: #717171;
}
.text {
  text-indent: 2em;
  color: #717171;
}
</style>
