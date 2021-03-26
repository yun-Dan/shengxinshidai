<template>
  <div class="app-classroom-record-print">
    <div id="subOutputRank-print">
      <div class="classroom-record-print-content">
        <template v-for="item in 2">
          <div :key="item">
            <div class="classroom-record-print-content-head">
              <el-row :gutter="20">
                <el-col :span="16" :offset="4">
                  <div class="grid-content bg-purple">
                    <div class="classroom-record-print-content-title">学院自用教室出借备案表</div>
                    <div style="text-align: center">（{{ item===1?'第一联':'第二联'}}）</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="classroom-record-print-content-body">
              <div>{{ item===1?'继续教育处：':'资产与后勤管理处：'}}</div>
              <div style="text-indent: 2em">为提高学院教室使用效率，促进学校整体工作开展，经研究，现决定将我院自用教室在闲置时间向校内单位开放租借使用。</div>
              <div style="text-indent: 2em">教室具体位置、设备条件及费用标准如下表：</div>
              <div>
                <table
                  width="670"
                  border="1"
                  align="center"
                  style="border-collapse: collapse;font-family: 'SimSun'"
                >
                  <tr align="center">
                    <td style="width: 50px">序号</td>
                    <td>教室名称</td>
                    <td>教室位置</td>
                    <td>设备条件</td>
                    <td style="width: 80px;">费用标准</td>
                  </tr>
                  <tr v-for="(item,index) in showData" :key="index" align="center">
                    <td>{{ index+1}}</td>
                    <td>{{ item.a3}}</td>
                    <td>{{ item.a4}}</td>
                    <td>{{ item.a5}}</td>
                    <td>{{ item.a6}}{{ item.a7}}</td>
                  </tr>
                </table>
              </div>
              <div style="text-indent: 2em">请予备案为盼。</div>
            </div>
            <div class="classroom-record-print-content-foot">
              <el-row :gutter="20">
                <el-col :span="12" :offset="12">
                  <div class="grid-content bg-purple">
                    <div class="record-foot-item">
                      {{ college }}（盖章）：
                      <span style="width: 130px"></span>
                    </div>
                    <div class="record-foot-item">
                      学院负责人（签字）：
                      <span style="width: 100px"></span>
                    </div>
                    <div class="record-foot-item">{{ time | TimestampChangeFilter(true) }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-if="item===1" style="page-break-before:always;">
              <br>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div style="text-align: center;padding-bottom: 40px">
      <el-button type @click.native="$router.go(-1)">返 回</el-button>
      <el-button type="success" @click.native="doPrint">打 印</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-classroom-record-print",
  data() {
    return {
      showData: [],
      college: "",
      time: 0
    };
  },
  methods: {
    ...mapActions(["getClassroomRecordInfo"]),
    initData(id) {
      this.getClassroomRecordInfo({
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data && Data.length) {
            this.college = Data[0].xy;
            this.showData = Data;
          }
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
    this.time = new Date().getTime();
  }
};
</script>

<style scoped>
.classroom-record-print-content {
  width: 670px;
  margin: 0 auto;
  padding: 20px 40px;
  font-family: SimSun;
  font-size: 16px;
  line-height: 34px;
}
.classroom-record-print-content-title {
  font-size: 22px;
  letter-spacing: 6px;
  font-weight: bold;
  line-height: 60px;
  text-align: center;
}
.classroom-record-print-content-foot {
  margin-top: 50px;
}
.record-foot-item {
  text-align: right;
  line-height: 38px;
}
.record-foot-item span {
  display: inline-block;
  border-bottom: 1px solid #000;
}
</style>
