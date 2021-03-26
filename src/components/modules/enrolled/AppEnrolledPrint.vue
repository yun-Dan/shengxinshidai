<template>
  <div class="enrolled-print-box">
    <div id="subOutputRank-print">
      <div class="enrolled-print">
        <div class="enrolled-print-title four-align-center">入校培训申请表</div>
        <div>
          <div>
            <el-row :gutter="20">
              <el-col :span="6">申请单位（公章）：</el-col>
              <el-col :span="6">分管领导（签字）：</el-col>
              <el-col :span="6">填表人（签字）：</el-col>
              <el-col :span="6">填表日期：</el-col>
            </el-row>
          </div>
          <div class="enrolled-print-table four-align-center">
            <table border="1">
              <template v-for="(val, key) in transform">
                <tr :key="`${key}-1`">
                  <td width="12%">申请入校周次</td>
                  <td width="12%">项目编号</td>
                  <td width="26%">项目名称</td>
                  <td width="26%" :colspan="2">举办时间</td>
                  <td width="12%">申请入校人数</td>
                  <td width="12%">备注</td>
                </tr>
                <tr v-for="(v, i) in val" :key="`${key}-2-${i}`">
                  <td v-if="!i" :rowspan="val.length + 1">
                    <div style="line-height: 1em; font-size: 14px; padding: 4px;">
                      {{ Number(key) | TimestampChangeFilter(true) }}<br/>-<br/>
                      {{ key | LastDay | TimestampChangeFilter(true) }}<br/>
                      <div style="line-height: 2em; font-size: 12px;">（请填写日历周）</div>
                    </div>
                  </td>
                  <td>{{ v.pro_code }}</td>
                  <td>{{ v.pro_name }}</td>
                  <td :colspan="2">{{ v.px_start_time | TimestampChangeFilter(true) }} - {{ v.px_end_time | TimestampChangeFilter(true) }}</td>
                  <td>{{ v.jtrs }}</td>
                  <td>
                    <div v-if="v.bz" style="width: 80px; margin: 0 auto;">{{ v.bz }}</div>
                    <template v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</template>
                  </td>
                </tr>
                <tr :key="`${key}-3`">
                  <td>本周总计班次</td>
                  <td>{{ val.length }}</td>
                  <td width="13%">本周总计人数</td>
                  <td :colspan="2">{{ val | Total }}</td>
                  <td></td>
                </tr>
              </template>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="four-align-center">
      <el-button type="success" @click="doPrint">打 印</el-button>
      <el-button @click="$router.go(-1)">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { doPrint } from '@/assets/js/doPrint.js'
const urls = {
  list: '/admin/enrolled_training'
}
export default {
  data () {
    return {
      loading: false,
      List: []
    }
  },
  computed: {
    transform () {
      const Obj = {}
      this.List.forEach(item => {
        item.enrolled.forEach(val => {
          let date = new Date(val.tj_time * 1000)
          let K = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - (date.getDay() || 7)).getTime()
          if (Obj[K]) {
            Obj[K].push(Object.assign({
              pro_code: item.pro_code,
              pro_name: item.pro_name,
              px_start_time: item.px_start_time,
              px_end_time: item.px_end_time
            }, val))
          } else {
            Obj[K] = [Object.assign({
              pro_code: item.pro_code,
              pro_name: item.pro_name,
              px_start_time: item.px_start_time,
              px_end_time: item.px_end_time
            }, val)]
          }
        })
      })
      return Obj
    }
  },
  filters: {
    LastDay (time) {
      let date = new Date(Number(time))
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - (date.getDay() || 7)).getTime()
    },
    Total (l, f = 'jtrs') {
      let t = 0
      l.forEach(item => {
        t += (-(-item.jtrs) || 0)
      })
      return t
    }
  },
  methods: {
    ...mapActions([
      'axiosHttp'
    ]),
    initData () {
      let query = this.$route.query
      this.loading = true
      if (this.loading && this.$md5(`${query.status || null}`) == query.ran) {
        this.axiosHttp({
          url: urls.list,
          data: {
            status: query.status || null
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data
            if (Data instanceof Array) {
              this.List = Data
            }
            this.loading = false
          }
        })
      }
    },
    doPrint() {
      doPrint()
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style scoped>
.enrolled-print-box{
  padding: 10px 10px 50px;
}
.enrolled-print{
  font-family: "SimSun";
  min-width: 640px;
  margin: 0 auto;
  padding: 10px 20px;
  line-height: 1.4em;
  color: #303133;
}
.enrolled-print-title{
  font-size: 30px;
  font-weight: 600;
  line-height: 3em;
}
.enrolled-print-table table{
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}
.enrolled-print-table td{
  padding: 4px;
}
</style>
