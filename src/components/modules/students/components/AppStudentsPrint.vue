<template>
  <div class="app-students-print" v-loading="loading">
    <!-- <el-card style="padding: 20px 0"> -->
      <template v-if="studentsList.length">
        <div id="subOutputRank-print" v-cloak>
          <template v-for="sub in num">
            <table
              :key="sub"
              width="676"
              border="0"
              align="center"
              style="font-size: 12px;font-family: 'SimSun'"
            >
              <tbody>
                <tr>
                  <td colspan="2" valign="top">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <img src="../../../../assets/images/top3.jpg">
                            <div class="students-print-title">中国人民大学非学历非学位教育培训学员名单</div>
                            <div
                              style="text-align: center;font-weight: bold;line-height: 30px"
                            >（学员信息备案与项目财务结算用&nbsp;&nbsp;&nbsp;继续教育处监制）</div>
                          </td>
                          <!--二维码-->
                          <td>
                            <img :src="imgUrl" alt style="width: 111px">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table style="padding: 0">
                      <tbody>
                        <tr>
                          <td width="63px;">&nbsp;</td>
                          <td width="70px">主办学院:</td>
                          <td width="156px">
                            <div
                              style="border-bottom:solid #000000 1px; width:150px"
                            >{{ studentsList[0].pro_college }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td valign="top">
                    <table>
                      <tbody>
                        <tr>
                          <td width="63px;">&nbsp;</td>
                          <td>项目号:</td>
                          <td>
                            <div
                              style="border-bottom:solid #000000 1px; width:80px"
                            >{{ studentsList[0].pro_code }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <table>
                      <tbody>
                        <tr>
                          <td width="63px;"></td>
                          <td width="70px">项目名称:</td>
                          <td>
                            <div
                              style="border-bottom:solid #000000 1px; width:429px"
                            >{{ studentsList[0].pro_name }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" valign="top">
                    <div style="padding-top: 10px">
                      <table
                        width="676"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        border="1"
                        style="border:1px solid #000;white-space: nowrap;overflow: hidden"
                        class="spill-set-box"
                      >
                        <tbody>
                          <tr>
                            <td
                              width="78px"
                              class="cl_1"
                              align="center"
                              style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                            >序号</td>
                            <td
                              width="63px"
                              class="cl_1"
                              align="center"
                              style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                            >姓名</td>
                            <td
                              width="180"
                              class="cl_1"
                              align="center"
                              style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                            >工作单位</td>
                            <td
                              width="176px"
                              class="cl_1"
                              align="center"
                              style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                            >职务</td>
                            <td
                              width="100px"
                              class="cl_1"
                              align="center"
                              style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                            >联系方式</td>
                            <td
                              width="87px"
                              class="cl_1"
                              align="center"
                              style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                            >邮箱</td>
                          </tr>
                          <template v-for="(item,index) in studentsList">
                            <tr
                              v-if="((index+1)>((sub-1)*pageNum))&&((index+1)<=sub*pageNum)"
                              :key="index"
                            >
                              <td
                                class="cl_1"
                                width="78px"
                                style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                                align="center"
                              >{{ (index+1+'').length===1?'000'+(index+1):(index+1+'').length===2?'00'+(index+1):(index+1+'').length===3?'00'+(index+1):(index+1+'').length===4?index+1:'待序'}}</td>
                              <td
                                class="cl_1"
                                width="63px;"
                                style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                                align="center"
                              >{{ item.name }}</td>
                              <td
                                class="cl_1"
                                width="180px"
                                style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                                align="center"
                              >{{ item.company }}</td>
                              <td
                                class="cl_1"
                                align="center"
                                style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                              >{{ item.resign}}</td>
                              <td
                                class="cl_1 overflow-hidden-td"
                                align="center"
                                style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                              >{{ item.mobile }}</td>
                              <td
                                class="cl_1"
                                width="176px"
                                align="center"
                                style="border-bottom:solid #000000 1px; border-left:solid #000000 1px;"
                              >{{ item.email}}</td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
        <div v-if="$route.path.indexOf('home/') !== -1" style="padding: 50px 0 100px;text-align: center">
          <el-button @click.native="$router.go(-1)">返 回</el-button>
          <el-button type="success" @click.native="doPrint">打 印</el-button>
        </div>
      </template>
    <!-- </el-card> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'

export default {
  name: "app-students-print",
  data() {
    return {
      loading: false,
      studentsList: [],
      num: 1,
      pageNum: 34, // 每页打印人数
      imgUrl: "",
      font: true
    };
  },
  computed: {
    ...mapState(["URL", "EWM"])
  },
  methods: {
    ...mapActions(["getStudentsData"]),
    initData() {
      const ID = this.$route.params.id;
      this.loading = true;
      if (this.loading) {
        this.getStudentsData({
          data: {
            pro_id: ID,
            status: 2
          },
          font: this.font
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.studentsList = Data.list;
            this.num = Math.ceil(Data.dataCount / this.pageNum);
            this.imgUrl = `${this.EWM}/4/id/${this.$route.params.id}`
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
    doPrint() {
      doPrint()
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("home") > 0) {
      this.font = true;
    } else {
      this.font = false;
    }
    this.initData();
  }
};
</script>

<style scoped>
.app-students-print{
  padding: 30px 0;
  min-height: 100%;
  background-color: #fff;
}
.students-print-title {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.2em;
  text-align: center;
  letter-spacing: 4px;
  padding-top: 20px;
}
.spill-set-box td {
  line-height: 180%;
}
</style>
