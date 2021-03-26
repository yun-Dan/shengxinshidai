<template>
  <div class="app-classroom-finance-info">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
      </div>
      <div class="classroom-finance-info-main">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form
                ref="showData1"
                :model="showData"
                label-width="160px"
                style="text-align: left"
              >
                <el-form-item v-if="!is_check" label="【当前审核状态】" :rules="[{required:true}]">
                  <span v-if="showData.state===1">未提交</span>
                  <span v-if="showData.state===2" style="color: #e6a23c">待审核</span>
                  <span v-if="showData.state===3" style="color: #f56c6c">不通过</span>
                  <span v-if="showData.state===4" style="color: #67c23a">通过</span>
                </el-form-item>
                <el-form-item label="【申报学院名称】" :rules="[{required:true}]">{{ showData.xy }}</el-form-item>
                <el-form-item label="【申报人姓名】" :rules="[{required:true}]">{{ showData.a18}}</el-form-item>
                <el-form-item label="【教室归属学院】" :rules="[{required:true}]">{{ showData.a20}}</el-form-item>
                <el-form-item label="【教室名称】" :rules="[{required:true}]">{{ showData.a19}}</el-form-item>
                <template v-if="is_check">
                  <el-form-item
                    label="【使用时间】"
                    :rules="[{required:true}]"
                  >{{ showData.a21 | TimestampChangeFilter(true) }} - {{ showData.a22 | TimestampChangeFilter(true) }}</el-form-item>
                </template>
                <template v-else>
                  <el-form-item
                    label="【使用开始时间】"
                    :rules="[{required:true}]"
                  >{{ showData.a21 | TimestampChangeFilter(true) }}</el-form-item>
                  <el-form-item
                    label="【使用结束时间】"
                    :rules="[{required:true}]"
                  >{{ showData.a22 | TimestampChangeFilter(true) }}</el-form-item>
                </template>
                <el-form-item label="【教室使用的项目】" :rules="[{required:true}]">{{ showData.a23}}</el-form-item>
                <el-form-item
                  label="【教室费用标准】"
                  :rules="[{required:true}]"
                >{{ showData.a24}} {{ showData.a25}}</el-form-item>
                <el-form-item label="【费用总额（小）】" :rules="[{required:true}]">{{ showData.a15}} 元</el-form-item>
                <el-form-item label="【费用总额（大）】" :rules="[{required:true}]">{{NumberToChinese }}</el-form-item>
                <template v-if="is_check">
                  <el-form-item label="审核结果" :rules="[{required: true}]">
                    <el-radio-group v-model="checkForm.state">
                      <el-radio :label="4">审核通过</el-radio>
                      <el-radio :label="3">审核不通过</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-if="checkForm.state===3"
                    label="不通过原因"
                    :rules="[{required: true}]"
                  >
                    <el-input type="textarea" v-model.trim="checkForm.through"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="success" @click.native="handleCheckTrue">确 定</el-button>
                    <el-button type @click.native="$router.go(-1)">返 回</el-button>
                  </el-form-item>
                </template>
              </el-form>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form
                ref="showData2"
                :model="showData"
                label-width="240px"
                style="text-align: left"
              >
                <el-form-item label="【支出学院名称】" :rules="[{required:true}]">{{ showData.a1}}</el-form-item>
                <el-form-item label="【支出学院财务部门号和名称】" :rules="[{required:true}]">{{ showData.a2}}</el-form-item>
                <el-form-item label="【支出学院财务项目号和名称】" :rules="[{required:true}]">{{ showData.a3}}</el-form-item>
                <el-form-item label="【支出学院联系电话】" :rules="[{required:true}]">{{ showData.a4}}</el-form-item>
                <el-form-item label="【支出学院经办人】" :rules="[{required:true}]">{{ showData.a12}}</el-form-item>
                <el-form-item>
                  <span style="color: transparent">---</span>
                </el-form-item>
                <el-form-item label="【收入学院名称】" :rules="[{required:true}]">{{ showData.a7}}</el-form-item>
                <el-form-item label="【收入学院财务部门号和名称】" :rules="[{required:true}]">{{ showData.a8}}</el-form-item>
                <el-form-item label="【收入学院财务项目号和名称】" :rules="[{required:true}]">{{ showData.a9}}</el-form-item>
                <el-form-item label="【收入学院联系电话】" :rules="[{required:true}]">{{ showData.a10}}</el-form-item>
                <el-form-item label="【收入学院经办人】" :rules="[{required:true}]">{{ showData.a13}}</el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-classroom-finance-info",
  data() {
    return {
      showData: {},
      is_check: false,
      checkForm: {
        id: 0,
        state: 4,
        through: ""
      }
    };
  },
  computed: {
    // 价格转大写
    NumberToChinese() {
      let m = this.showData.a15;
      const unit = ["仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分"];
      m *= 100;
      m += "";
      var length = m.length;

      var result = "";
      for (var i = 0; i < length; i++) {
        if (i == 2) {
          result = "元" + result;
        } else if (i == 6) {
          result = "万" + result;
        }
        if (m.charAt(length - i - 1) == 0) {
          if (i != 0 && i != 1) {
            if (
              result.charAt(0) != "零" &&
              result.charAt(0) != "元" &&
              result.charAt(0) != "万"
            ) {
              result = "零" + result;
            }
          }
          continue;
        }
        let A = null;
        const A_ = m.charAt(length - i - 1);
        if (A_ === "0") {
          A = "零";
        } else if (A_ === "1") {
          A = "壹";
        } else if (A_ === "2") {
          A = "贰";
        } else if (A_ === "3") {
          A = "叁";
        } else if (A_ === "4") {
          A = "肆";
        } else if (A_ === "5") {
          A = "伍";
        } else if (A_ === "6") {
          A = "陆";
        } else if (A_ === "7") {
          A = "柒";
        } else if (A_ === "8") {
          A = "捌";
        } else if (A_ === "9") {
          A = "玖";
        }
        result = A + unit[unit.length - i - 1] + result;
      }
      result += result.charAt(result.length - 1) == "元" ? "整" : "";
      return result;
    }
  },
  methods: {
    ...mapActions(["getClassroomFinanceInfo", "checkClassroomFinance"]),
    initData(id) {
      this.getClassroomFinanceInfo({
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.showData = data.data.data;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleCheckTrue() {
      if (this.checkForm.state === 3) {
        if (!this.checkForm.through) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      }
      this.checkClassroomFinance({
        data: this.checkForm
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.$router.go(-1);
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    }
  },
  beforeMount() {
    const route = this.$route;
    this.initData(route.params.id);
    if (route.path.indexOf("check") > 0) {
      this.is_check = true;
      this.$set(this.checkForm, "id", route.params.id);
    } else {
      this.is_check = false;
    }
  }
}
</script>

<style scoped>
.classroom-finance-info-main {
  width: 80%;
  margin: 0 auto;
  padding-top: 10px;
}
</style>
