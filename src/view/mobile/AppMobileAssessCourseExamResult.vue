<template>
  <div class="app-assess-result">
    <el-card v-if="is_show">
      <div id="subOutputRank-print" :style="{minHeight: `${h}px`}">
        <div class="assess-result-head-box">
          <header class="assess-result-head">
            <div>“{{ titleData.cou_name }}”课程评估报告</div>
            <div class="assess-result-sub">{{ titleData.pro_name }}</div>
          </header>
        </div>
        <div class="assess-result-main">
          <div v-if="calculate && calculate.length" style="margin-bottom: 60px">
            <p class="assess-result-main-item" style="padding: 0 0 20px">评估结果</p>
            <el-table
              :data="calculate"
              :show-header="false"
              style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <div class="clearfix" style="font-size: 16px">
                    <div class="fl">{{ scope.$index + 1 }}、</div>
                    <div class="fl">{{ scope.row.title }}</div>
                    <div class="fr">平均分：{{ scope.row.avg_value }} 分</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div
              v-if="showData['1'].length"
              class="clearfix assess-result-main-dx"
            >
              <p class="assess-result-main-item">单选题：</p>
              <template v-for="(item, index) in showData['1']">
                <div :key="index" class="assess-result-main-pie-item">
                  <div class="assess-result-main-pie-title">{{ item.title }}</div>
                  <div class="assess-result-pie-box no-print" ref="pieresult">
                    <ve-pie :data="item.chartData" :colors="colors"></ve-pie>
                  </div>
                </div>
              </template>
            </div>
            <div v-if="showData['2'].length">
              <p class="assess-result-main-item">多选题：</p>
              <template v-for="(item, index) in showData['2']">
                <div :key="index" class="assess-result-main-pie-item">
                  <div class="assess-result-main-pie-title">{{ item.title }}</div>
                  <div class="assess-result-pie-box no-print" ref="pieresult">
                    <ve-pie :data="item.chartData" :colors="colors.slice(3, 100)"></ve-pie>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div v-if="showData['3'].length" style="margin-bottom: 40px">
            <p class="assess-result-main-item">问答题：</p>
            <el-table
              :data="showData['3']"
              :show-header="false"
              style="width: 100%; font-size: 16px"
            >
              <el-table-column>
                <template slot-scope="scope">
                  <div class="course-exam-list-title">{{ scope.$index+1}}、 {{ scope.row.title }}</div>
                  <div class="course-exam-list-answer">
                    <div
                      v-for="(item, index) in scope.row.answer"
                      :key="index"
                    >{{ index + 1 }}. {{ item }}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      class="report-index-dialog-set"
      title
      :visible.sync="dialogVisible"
      fullscreen
      append-to-body
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div v-loading="dialogVisible_loading" style="height: 100%; padding-top: 100px">
        <el-form style="width: 60%; margin: 0 auto;" size="large">
          <el-form-item>
            <div style="text-align: center; color: #6a737d; font-size: 30px;">访问密码</div>
          </el-form-item>
          <el-form-item>
            <div style="padding: 30px 0">
              <el-input v-model="pwd" placeholder="请输入访问密码" style="line-height: 66px"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                type="primary"
                @click="initData(1)"
                style="width: 100%; font-size: 26px; padding: 20px 0"
              >提 交</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import VePie from 'v-charts/lib/pie.common'

export default {
  name: 'app-assess-pc-result',
  data () {
    return {
      examType: {
        '1': {
          label: '单选',
          value: 1,
          disabled: false
        },
        '2': {
          label: '多选',
          value: 2,
          disabled: false
        },
        '3': {
          label: '问答题',
          value: 3,
          disabled: false
        },
        '4': {
          label: '填空题',
          value: 4,
          disabled: true
        },
        '5': {
          label: '填空题',
          value: 5,
          disabled: true
        }
      },
      colors: [
        '#19d4ae',
        '#fa6e86',
        '#ffb980',
        '#5ab1ef',
        '#c4b4e4',
        '#ec8f6a',
        '#407088',
        '#0067a6',
        '#00da3c',
        '#ec0000',
        '#91c7ae',
        '#f6efa6',
        '#c23531',
        '#63869e',
        '#83b582',
        '#fce2ae',
        '#ffcbcb',
        '#ff6464',
        '#badfdb',
        '#943855',
        '#64c4ed'
      ],
      is_show: false,
      titleData: {},
      showData: {
        '1': [], // 单选
        '2': [], // 多选
        '3': [] // 问答
      },
      calculate: [],
      dialogVisible: false,
      dialogVisible_loading: false,
      pwd: '',
      h: 1500
    }
  },
  components: {
    VePie
  },
  methods: {
    ...mapActions(['readreportAssessCourseExam']),
    initData (type) {
      // 0：默认访问、1输入密码访问
      if (type === 1 && !this.pwd) {
        this.$notify.error({
          title: '提示',
          message: '请输入访问密码！'
        })
        return false
      }
      let id = this.$route.params.id
      this.dialogVisible_loading = true
      if (id) {
        this.readreportAssessCourseExam({
          type: 2,
          data: {
            paper_id: id,
            passwd: type ? this.pwd : null
          }
        }).then(data => {
          if (data.data.code === 200) {
            let Data = data.data.data // titleData
            Object.assign(this.titleData, {
              cou_name: Data.course_name,
              pro_name: Data.project_name
            })
            if (Data.list) {
              for (let key in Data.list) {
                let item = Data.list[key]
                if (item.types === 3) {
                  // 问答
                  this.showData[item.types].push(item)
                } else if (item.types < 3) {
                  // 单选、多选
                  let total = 0 // 总分
                  let rs = 0 // 人数
                  if (item.types === 1 && item.calculate) {
                    for (let key in item.answer) {
                      total += Number(key) * Number(item.answer[key])
                      rs += Number(item.answer[key])
                    }
                  }
                  let rows = item.default.map(v => {
                    return {
                      label: `${v}：${item.answer[v] || 0}`,
                      value: item.answer[v] || 0
                    }
                  })
                  let Obj = Object.assign({}, item, {
                    chartData: {
                      columns: ['label', 'value'],
                      rows: rows
                    },
                    ave: Math.round(total / rs)
                  })
                  this.showData[item.types].push(Obj)
                }
              }
            }
            if (Data.calculate) {
              this.calculate = []
              for (let key in Data.calculate) {
                this.calculate.push(Data.calculate[key])
              }
            }
            this.dialogVisible = false
            this.dialogVisible_loading = false
            this.is_show = true
          } else {
            this.is_show = false
            if (data.data.code == 401) {
              this.dialogVisible = true
              this.dialogVisible_loading = false
            } else {
              this.$notify.error({
                title: '错误',
                message: data.data.error,
                onClose: () => {
                  this.dialogVisible_loading = false
                }
              })
            }
          }
        })
      }
    }
  },
  created () {
    this.initData(0)
  },
  mounted () {
    this.h = document.documentElement.clientHeight
  }
}
</script>

<style scoped>
.app-assess-result {
  min-height: 1000px;
}
.assess-result-head-box{
  padding: 50px 0 20px;
  border-bottom:1px solid #ebeef5;
}
.assess-result-head {
  font-size: 30px;
  line-height: 40px;
  color: #414245;
  text-align: center;
}
.assess-result-sub {
  font-size: 24px;
}

.assess-result-main {
  width: 100%;
  margin: 0 auto;
  padding: 50px 0;
  color: #666;
}
.assess-result-main-item{
  font-size: 18px;
  text-align: center;
  padding: 40px 0;
}

.course-exam-list-title {
  font-size: 18px;
  font-weight: 600;
}
.course-exam-list-answer {
  padding: 10px;
  text-indent: 1em;
}
.assess-result-main-pie-item {
  margin-bottom: 10px;
}
.assess-result-main-pie-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  margin: 30px 0;
}
.assess-result-main-dx{
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

@media print {
  .no-print {
    display: none;
  }
}
</style>
