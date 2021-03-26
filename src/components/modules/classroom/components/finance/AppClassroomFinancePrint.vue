<template>
  <div class="app-classroom-finance-print">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
      </div>
      <div id="subOutputRank-print" v-cloak>
        <div class="classroom-finance-print-main">
          <div class="classroom-finance-print-head">
            <el-row :gutter="20">
              <el-col :span="16" :offset="4">
                <div class="grid-content bg-purple">
                  <h3 class="classroom-finance-print-title">中国人民大学校内转账凭证</h3>
                  <div class="classroom-finance-print-sub-title">
                    <div style="border-bottom: 1px solid #000">（学院自用教室相互租借转账专用）</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="classroom-finance-print-content">
            <el-row :gutter="20">
              <el-col :span="7">
                <div class="grid-content bg-purple">编号：{{ showData.htbh}}</div>
              </el-col>
              <el-col :span="7" :offset="10">
                <div
                  class="grid-content bg-purple"
                  style="text-align: right"
                >{{ new Date().getTime() | TimestampChangeFilter(true) }}</div>
              </el-col>
            </el-row>
            <div style="margin-top: 20px">
              <table
                width="100%"
                align="center"
                border="1"
                style="border-collapse: collapse;font-size: 14px;line-height: 30px"
              >
                <tr align="center">
                  <td rowspan="3" style="width: 160px">支出单位</td>
                  <td colspan="3" align="left" style="padding: 0 4px">部门号和名称：{{ showData.a2}}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 0 4px">项目号和名称：{{ showData.a3}}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 0 4px">联系电话：{{ showData.a4}}</td>
                </tr>
                <tr align="center">
                  <td rowspan="3" style="width: 160px">
                    <div>收入单位（一）：</div>
                    <div>学院账户（80%）</div>
                  </td>
                  <td colspan="2" align="left" style="padding: 0 4px">部门号和名称：{{ showData.a8}}</td>
                  <td rowspan="3" style="width: 160px">
                    <div>收入单位（二）：</div>
                    <div>学校账户（20%）</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0 4px">项目号和名称：{{ showData.a9}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0 4px">联系电话：{{ showData.a10}}</td>
                </tr>
                <tr>
                  <td
                    colspan="4"
                    style="padding: 0 4px"
                  >转账事由：用于“{{ showData.a23}}”授课使用“{{ showData.a19}}” 。</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 0 4px">转账金额（大写）： {{ showData.a16}}</td>
                </tr>
                <tr>
                  <td colspan="4" style="padding: 0 4px">转账金额（小写）： {{ showData.a15}}元</td>
                </tr>
              </table>
            </div>
            <div style="line-height: 50px;margin-top: 20px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <div>支出学院（盖章）：{{ showData.a1}}</div>
                    <div>
                      <span style="padding-right: 60px">负责人：</span>
                      <span>经手人：</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <div>收入学院（盖章）：{{ showData.a7}}</div>
                    <div>
                      <span style="padding-right: 60px">负责人：</span>
                      <span>经手人：</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="classroom-finance-print-foot">
        <el-button type @click.native="$router.go(-1)">返 回</el-button>
        <el-button type="success" @click.native="doPrint">打 印</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-classroom-finance-print",
  data() {
    return {
      showData: {}
    };
  },
  methods: {
    ...mapActions(["getClassroomFinanceInfo"]),
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
    doPrint() {
      doPrint()
    }
  },
  beforeMount() {
    const ID = this.$route.params.id;
    this.initData(ID);
  }
};
</script>

<style scoped>
.classroom-finance-print-main {
  font-family: SimSun;
  width: 670px;
  margin: 0 auto;
  padding: 20px 40px;
}
.classroom-finance-print-title {
  font-size: 22px;
  letter-spacing: 6px;
  text-align: center;
  line-height: 70px;
}
.classroom-finance-print-sub-title {
  width: 300px;
  margin: 0 auto;
  padding-bottom: 2px;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  border-bottom: 1px solid #000;
}
.classroom-finance-print-content {
  margin-top: 40px;
}
.classroom-finance-print-foot {
  padding-top: 20px;
  text-align: center;
}
</style>
