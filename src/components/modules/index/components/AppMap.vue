<template>
  <div class="app-map-box" v-loading="loading" ref="mapBox" v-cloak>
    <el-card>
      <div slot="header" class="clearfix">
        <span>
          <i class="fa fa-map-o"></i> 人大培训分布图
        </span>
        <span class="charts-btn"></span>
        <el-switch
          v-model="chart"
          active-color="#13ce66"
          inactive-color="#409EFF"
          :active-value="2"
          :inactive-value="1"
          active-text="饼状图"
          inactive-text="地图"
        ></el-switch>
        <el-select
          v-model="nian"
          placeholder="选择年份"
          size="mini"
          style="width: 100px;margin-left: 30px"
          clearable
        >
          <el-option
            v-for="item in [2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050]"
            :key="item"
            :label="item+'年'"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <el-row v-if="chart===1" :gutter="20">
        <el-col :span="16">
          <div class="grid-content bg-purple" ref="mapP">
            <ve-map :data="chartData" :colors="colors" :settings="chartSettings" width="100%" :height="chartH1"></ve-map>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-row :gutter="10">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-table
                    v-if="showSummary"
                    :show-summary="showSummary"
                    :data="bb"
                    border
                    :header-cell-style="{backgroundColor:'#fafafa'}"
                    size="mini"
                    :default-sort="{prop: 'pv', order: 'descending'}"
                    :height="chartH1"
                    style="width: 100%; margin-top: 20px"
                  >
                    <el-table-column align="center" prop="province" label="省份" min-width="40"></el-table-column>
                    <el-table-column align="center" prop="pv" label="办班地点统计" min-width="40"></el-table-column>
                  </el-table>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-table
                    v-if="showSummary"
                    :show-summary="showSummary"
                    :data="wt"
                    border
                    :header-cell-style="{backgroundColor:'#fafafa'}"
                    :default-sort="{prop: 'pv_wtdw', order: 'descending'}"
                    size="mini"
                    :height="chartH1"
                    style="width: 100%; margin-top: 20px"
                  >
                    <el-table-column align="center" prop="province" label="省份" min-width="40"></el-table-column>
                    <el-table-column align="center" prop="pv_wtdw" label="委托单位统计" min-width="40"></el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <template v-if="chart===2">
        <el-row v-if="firstData.rows.length && secondData.rows.length" :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="chart-data-title">办班地点统计：</div>
              <ve-pie :data="firstData" :height="chartH2" :key="1" :settings="chartSettingsFirst"></ve-pie>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="chart-data-title">委托单位统计：</div>
              <ve-pie :data="secondData" :height="chartH2" :key="2" :settings="chartSettingsSecond"></ve-pie>
            </div>
          </el-col>
        </el-row>
        <div v-else :style="`height: ${chartH2}; text-align: center;padding-top: 30px`">
          <img src="../../../../assets/images/chartno.png" alt style="width: 25%">
          <h2 style="font-size: 20px;font-weight: 400;margin-top: 40px;color: #9b9b9b">本年度暂无数据</h2>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VeMap from "v-charts/lib/map.common";
import VePie from "v-charts/lib/pie.common";
import { setTimeout } from 'timers';
export default {
  name: "app-map",
  data() {
    return {
      loading: false,
      nian: 2018,
      colors: ["#19d4ae", "#fa6e86"],
      chartSettings: {
        label: false,
        labelMap: {
          num: "分布"
        },
        zoom: 1,
        symbolSizeMax: 30,
        mapURLProfix: "https://unpkg.com/echarts@3.6.2/map/json/"
      },
      chartData: {
        columns: ["province", "办班地点分布", "委托单位分布"],
        rows: [
          // { 'province': '吉林', 'pv': 0, 'city': '长春'},
          // { 'province': '北京', 'pv': 0, 'city': '北京'},
          // { 'province': '上海', 'pv': 0, 'city': '上海'},
          // { 'province': '浙江', 'pv': 0, 'city': '北京'},
          // { 'province': '四川', 'pv': 0, 'city': '成都市' },
          // { 'province': '重庆', 'pv': 0, 'city': '重庆'},
          // { 'province': '山东', 'pv': 0, 'city': '济南'},
          // { 'province': '江苏', 'pv': 0, 'city': '南京市'},
          // { 'province': '湖北', 'pv': 0, 'city': '武汉市'},
          // { 'province': '黑龙江', 'pv': 0, 'city': '哈尔滨'}
        ]
      },
      bb: [], // 办班分布统计
      wt: [], // 委托单位分布统计
      chartH1: '400px',

      // chart: 1, // 1地图、2饼状图
      chart: (sessionStorage.getItem('CK-T') || sessionStorage.getItem('CK')) === '2' ? 2 : 1, // 1地图、2饼状图 
      showSummary: false,
      activeName: "first",
      firstData: {
        columns: ["province", "办班地点分布"],
        rows: []
      },
      chartSettingsFirst: {
        roseType: "",
        radius: 100,
        offsetY: 320
      },
      secondData: {
        columns: ["province", "委托单位分布"],
        rows: []
      },
      chartSettingsSecond: {
        roseType: "",
        radius: 100,
        offsetY: 320
      },
      chartH2: '494px'
    };
  },
  props: {
    change: {
      type: Function,
      default: () => () => {}
    }
  },
  components: {
    VeMap,
    VePie
  },
  computed: {
    ...mapState(["URL", "mapJsonURL", 'isDevelopment'])
  },
  methods: {
    ...mapActions(["getIndexMap"]),
    initData() {
      this.loading = true
      if (this.loading) {
        this.getIndexMap({
          data: {
            nian: this.nian
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.loading = false
            const Data = data.data.data;
            const b = [];
            const w = [];
            let rows = Data.list.map(item => {
              //合并的
              let province = item.province;
              if (province.indexOf("省") > 0) {
                let num1 = province.indexOf("省");
                province = province.slice(0, num1);
              } else if (
                province.indexOf("自治") > 0 ||
                province.indexOf("行政") > 0
              ) {
                if (province.indexOf("内蒙古") >= 0) {
                  province = "内蒙古";
                } else {
                  // let num2 = province.indexOf('自治');
                  province = province.slice(0, 2);
                }
              }
              let obj = {};
              Object.assign(obj, item, {
                province: province,
                办班地点分布: item.pv ? item.pv : null,
                委托单位分布: item.pv_wtdw ? item.pv_wtdw : "null"
              });
              //办班
              if (obj.pv) {
                b.push(obj);
              }
              //委托
              if (obj.pv_wtdw) {
                w.push(obj);
              }
              return obj;
            });
            this.bb = b;
            this.wt = w;
            this.$set(this.chartData, "rows", rows);
            this.$nextTick().then(() => {
              this.showSummary = true;
            });
            if (this.chart === 2) {
              this.pieChart();
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loading = false
              }
            });
          }
        });
      }
    },
    pieChart() {
      let list1 = this.chartData.rows.filter(item => {
        return item.pv;
      });
      const newList1 = list1.map(item => {
        const obj = {};
        Object.assign(obj, item, {
          province: item.province + "(" + item.pv + ")"
        });
        return obj;
      });
      this.$set(this.firstData, "rows", newList1.sort(this.compare("pv")));

      let list2 = this.chartData.rows.filter(item => {
        return item.pv_wtdw;
      });
      const newList2 = list2.map(item => {
        const obj = {};
        Object.assign(obj, item, {
          province: item.province + "(" + item.pv_wtdw + ")"
        });
        return obj;
      });
      this.$set(
        this.secondData,
        "rows",
        newList2.sort(this.compare("pv_wtdw"))
      );
    },
    compare(property) {
      return function(a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value2 - value1;
      };
    },
    heigthChange () {
      if (this.$refs.mapP) {
        this.chartH1 = `${this.$refs.mapP.clientWidth / 1.2}px`
        setTimeout(() => {
          this.$emit('change', this.$refs.mapBox.clientHeight)
        })
      } else if (this.$refs.mapBox) {
        setTimeout(() => {
          this.$emit('change', this.$refs.mapBox.clientHeight)
        })
      }
    }
  },
  created() {
    if (!this.isDevelopment) {
      this.$set(this.chartSettings, "mapURLProfix", this.URL + this.mapJsonURL);
    }
    this.nian = new Date().getFullYear();
    if (true) {
      // this.initData();
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.heigthChange()
    })
  },
  watch: {
    chart() {
      this.$nextTick(() => {
        if (this.chart === 2) {
          this.pieChart();
        }
        this.heigthChange()
      });
    },
    nian() {
      this.$nextTick(() => {
        this.initData();
        if (true) {
          setTimeout(() => {
            this.pieChart();
          }, 100);
        }
      });
    }
  }
};
</script>

<style scoped>
.charts-btn {
  display: inline-block;
  margin-left: 30px;
  color: #409eff;
  cursor: pointer;
}
.charts-btn:hover {
  color: #2d8cf0;
}
.chart-data-title {
  margin-bottom: 11px;
}
</style>
