<template>
  <div class="app-adult-recruit-form" v-loading="loading">
    <el-form
      class="el-form submit-el-form"
      label-width="110px"
    >
      <el-form-item label="专业：" :rules="[{required: !query['3']}]">
        <template v-if="query['4']==1">
          <!--  同时添加多个专业-->
          <!--<el-select-->
          <!--v-model="name"-->
          <!--multiple-->
          <!--filterable-->
          <!--allow-create-->
          <!--default-first-option-->
          <!--clearable-->
          <!--placeholder="输入一个或多个专业名称">-->
          <!--</el-select>-->
          <!-- <el-input v-model.trim="form.name" :disabled="query['3']"></el-input> -->
          <el-select v-model="form.code" placeholder="请选择">
            <el-option
              v-for="item in professionalList"
              :key="item.id"
              :label="`${item.name}（${item.code}）`"
              :value="item.code"
              :disabled="item.isshow === 2"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </template>
        <template v-else>
          <el-select v-model="form.code" placeholder="请选择" :disabled="query['3']">
            <el-option
              v-for="item in professionalList"
              :key="item.id"
              :label="`${item.name}（${item.code}）`"
              :value="item.code"
              :disabled="item.isshow === 2"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="办学层次：" :rules="[{required: !query['3']}]">
        <template v-if="proConfig.education">
          <el-select v-model="form.education" placeholder="选择办学层次" disabled>
            <el-option
              v-for="(item, key) in proConfig.education"
              :key="key"
              :label="item"
              :value="key - 0"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="办学期限：" :rules="[{required: !query['3']}]">
        <el-row>
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              value-format="yyyy-MM-dd"
              default-time="09:00:00"
              placeholder="开始日期"
              :disabled="query['3']"
              @change="changeTime1"
            ></el-date-picker>
          </el-col>
          <el-col :span="2" class="text-align-center">
            -
          </el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="form.date2"
              type="date"
              value-format="yyyy-MM-dd"
              default-time="09:00:00"
              placeholder="结束日期"
              :disabled="query['3']"
            ></el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="办学地点：" :rules="[{required: !query['3']}]">
        <el-input v-model.trim="form.url" :disabled="query['3']"></el-input>
      </el-form-item>
      <el-form-item label="招生人数：" :rules="[{required: !query['3']}]">
        <el-input-number v-model="form.introduction" :min="0" :disabled="query['3']"></el-input-number>
      </el-form-item>
      <el-form-item label="学费（元）：" :rules="[{required: !query['3']}]">
        <el-row :gutter="6" type="flex" justify="space-between">
          <el-col :span="8">
            <div class="text-align-center">{{ form.date1 ? new Date(form.date1).getFullYear() : '第 一' }} 年</div>
            <el-input-number
              v-model="form.tuition1"
              :controls="false"
              :min="0"
              :disabled="query['3']"
            ></el-input-number>
          </el-col>
          <el-col :span="8">
            <div class="text-align-center">{{ form.date1 ? new Date(form.date1).getFullYear() + 1 : '第 二' }} 年</div>
            <el-input-number
              v-model="form.tuition2"
              :controls="false"
              :min="0"
              :disabled="query['3']"
            ></el-input-number>
          </el-col>
          <el-col :span="8">
            <div class="text-align-center">{{ form.date1 ? new Date(form.date1).getFullYear() + 2 : '第 三' }} 年</div>
            <el-input-number
              v-model="form.tuition3"
              :controls="false"
              :min="0"
              :disabled="query['3']"
            ></el-input-number>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="招生章程附件：" :rules="[{required: !query['3']}]">
        <el-upload
          class="upload"
          :action="uploadExcelUrl1"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :headers="headers"
          :with-credentials="true"
          name="attachment"
          accept=".pdf, .PDF"
          :file-list="fileList"
          :limit="1"
          :auto-upload="true"
        >
          <el-button
            :key="1"
            type="primary"
            plain
            size="mini"
            icon="el-icon-upload el-icon--right"
          >附件上传（限 PDF 文件）</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="招生章程文本：" :rules="[{required: true}]">
        <UE :defaultMsg="articles" :config="UE_config.options_document" ref="ue"></UE>
      </el-form-item>
      <el-form-item class="text-align-center">
        <el-button
          v-if="userInfo.role===2 && !query['3']"
          type="primary"
          @click.native=" handleTrue(0)"
        >保 存</el-button>
        <el-button v-if="!query['3']" type="primary" @click.native=" handleTrue(1)">保存并提交</el-button>
        <el-button @click.native="handleBack">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UE from "@/components/compose/AppUE";
import UE_config from '@/assets/js/UE_config.js'

export default {
  name: "app-adult-recruit-form",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      headers: {},
      query: {
        "1": false, // is_check
        "2": [], // name
        "3": false, // look  （true查看、false新增或编辑）
        "4": 1, // key（1新增，0编辑）
        "5": 0 // id
      },
      showData: {},
      form: {
        uid: 0,
        type: 1, // 类型：1成人学历 2网络学历
        name: "", // 专业名称（如果是多个中间用,分开，是英文的逗号）
        code: "", // 专业代码
        education: 3, // 层次
        date1: null, // 开始时间
        date2: null, // 结束时间
        url: "", // 地点
        introduction: null, // 人数
        tuition1: 0, // 第一年学费
        tuition2: 0, // 第二年学费
        tuition3: 0, // 第三年学费
        articles: "", // 招生章程文本
        frdb_file: "", // 招生章程附件上传PDF文件code码
        is_status: 0 // 0保存、1保存并提交
      },
      articles: "", // 招生章程文本
      fileList: [],
      name: [],
      typeConfig: {
        1: "成人学历",
        2: "网络学历"
      },
      professionalList: [], // 专业列表
      UE_config
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1", "lookUrl", 'userInfo'])
  },
  components: {
    UE
  },
  methods: {
    ...mapActions([
      "getAdultRecruitInfo",
      "addAdultRecruit",
      "editAdultRecruit",
      "getProfessionalList"
    ]),
    initData() {
      let query = this.$route.query;
      this.query = Object.assign({}, query, {
        "1":
          this.$route.query["1"] === true || this.$route.query["1"] === "true",
        "3":
          this.$route.query["3"] === true || this.$route.query["3"] === "true"
      });
      this.loading = true;
      if (this.query["4"] == 1) {
        this.loading = false;
      } else if (this.query["4"] == 0 && this.query["5"]) {
        if (this.loading) {
          this.getAdultRecruitInfo({
            id: this.query["5"],
            data: {}
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              this.showData = Data;
              this.form = JSON.parse(JSON.stringify(this.showData));
              for (let key in this.form) {
                if (!this.$options.data().form.hasOwnProperty(key)) {
                  this.$delete(this.form, key);
                }
              }
              Object.assign(this.form, {
                education: this.form.education - 0
              });
              if (this.form.frdb_file) {
                this.fileList = [
                  {
                    code: this.form.frdb_file,
                    name: "招生简章附件"
                  }
                ];
              }
              this.$nextTick(() => {
                this.articles = this.form.articles;
                if (this.$refs.ue) {
                  this.$refs.ue.setUEContent(this.form.articles);
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
      }
    },
    handleTrue(is_status) {
      // 0保存、1保存并提交
      let articles = this.$refs.ue.getUEContent();
      let Params = Object.assign({}, JSON.parse(JSON.stringify(this.form)), {
        // name: this.query['4']==1 ? this.name.join() : this.form.name, // 同时添加多个专业
        uid: this.query["4"] == 1 ? this.userInfo.uid : this.form.uid,
        articles: articles,
        is_status: is_status
      });
      if (this.query["4"] == 1) {
        // if(!this.name.length){  // 同时添加多个专业
        //     this.$message({
        //         type:'warning',
        //         message:'请至少输入一个专业名称！',
        //     });
        //     return false;
        // }
        // if(!Params.name){
        //     this.$message({
        //         type:'warning',
        //         message:'请输入专业名称！',
        //     });
        //     return false;
        // }
        if (!Params.code) {
          this.$message({
            type: "warning",
            message: "请选择专业！"
          });
          return false;
        } else {
          let zy = this.professionalList.filter(item => {
            return item.code === Params.code;
          });
          if (zy && zy.length) {
            Object.assign(Params, {
              name: zy[0].name
            });
          }
        }
      } else {
        // if(!Params.name){
        //     this.$message({
        //         type:'warning',
        //         message:'请输入专业名称！',
        //     });
        //     return false;
        // }
        if (!Params.code) {
          this.$message({
            type: "warning",
            message: "请选择专业！"
          });
          return false;
        } else {
          let zy = this.professionalList.filter(item => {
            return item.code === Params.code;
          });
          if (zy && zy.length) {
            Object.assign(Params, {
              name: zy[0].name
            });
          }
        }
      }
      if (!Params.education) {
        this.$message({
          type: "warning",
          message: "请选择办学层次！"
        });
        return false;
      }
      if (!Params.date1) {
        this.$message({
          type: "warning",
          message: "请选择办学开始日期！"
        });
        return false;
      }
      if (!Params.date2) {
        this.$message({
          type: "warning",
          message: "请选择办学结束日期！"
        });
        return false;
      }
      if (!Params.url) {
        this.$message({
          type: "warning",
          message: "请输入办学地点！"
        });
        return false;
      }
      if (!Params.introduction) {
        this.$message({
          type: "warning",
          message: "请输入招生人数 ！"
        });
        return false;
      }
      if (!Params.tuition1 || !Params.tuition2 || !Params.tuition3) {
        this.$message({
          type: "warning",
          message: "请输入三年学费金额！"
        });
        return false;
      }
      if (!Params.frdb_file) {
        this.$message({
          type: "warning",
          message: "请上传招生章程附件 ！"
        });
        return false;
      }
      if (!Params.articles) {
        this.$message({
          type: "warning",
          message: "请输入招生章程文本 ！"
        });
        return false;
      }
      if (this.query["4"] != 1) {
        delete Params.uid;
      }
      this.loading = true;
      if (this.loading) {
        if (this.query["4"] == 1) {
          // 新增
          this.addAdultRecruit({
            data: Params
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.handleBack();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading = false;
                }
              });
            }
          });
        } else {
          // 编辑
          this.editAdultRecruit({
            data: Params,
            id: this.query["5"]
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.handleBack();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading = false;
                }
              });
            }
          });
        }
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
    beforeUpload(file) {
      let format = file.name.substring(file.name.lastIndexOf(".") + 1);
      let list = ["pdf", "PDF"];
      const isTYPE = list.indexOf(format) !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传文件只能是 PDF 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    },
    handleSuccess(response, file, fileList) {
      // 上传成功的回调
      if (response.code === 200) {
        this.$set(this.form, "frdb_file", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
        this.$set(this.form, "frdb_file", "");
        this.fileList = [];
      }
    },
    handleRemove(file, fileList) {
      this.$set(this.form, "frdb_file", "");
      this.fileList = [];
    },
    changeTime1(val) {
      if (val) {
        let Y = Number(val.substring(0, 4));
        if (Y) {
          this.$set(this.form, "date2", `${Y + 3}${val.substring(4)}`);
        }
      } else {
        this.$set(this.form, "date2", null);
      }
    },
    getProfessional(fn) {
      this.getProfessionalList({
        data: {
          type: 1 // 1成人学历教育、2网络学历教育
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.professionalList = data.data.data.list;
          fn && fn();
        } else {
          this.$notify.error({
            title: "错误",
            message: "获取专业信息错误！"
          });
          this.loading = true;
        }
      });
    }
  },
  created () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
  },
  mounted() {
    // this.initData();
    this.getProfessional(this.initData);
  }
};
</script>

<style scoped>
.app-adult-recruit-form {
  min-width: 500px;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
}
</style>
