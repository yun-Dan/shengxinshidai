<template>
  <el-row :gutter="20">
    <el-col :span="8" class="index-nian-box" v-for="(item, key) in type" :key="key">
      <div v-if="item.selectY" class="nian-box">
        <el-select
          v-model="nian"
          placeholder="选择年份"
          size="mini"
          style="width: 100px;margin-left: 10px"
          :clearable="false"
          @change="initData"
        >
          <el-option
            v-for="item in [2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050]"
            :key="item"
            :label="item+'年'"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="app-line-box">
        <el-card v-cloak>
          <div slot="header" class="clearfix">
            <span v-cloak class="fl">
              <i class="fa fa-line-chart"></i>
              {{ nian}}{{ item.title }}
            </span>
          </div>
          <ve-line :data="item.chartData" :colors="colors" :settings="item.chartSettings"></ve-line>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions } from "vuex";
import VeLine from "v-charts/lib/line.common";
export default {
  name: "app-line",
  data() {
    return {
      nian: "",
      colors: ["#19d4ae", "#fa6e86"],
      type: {
        pro_line: {
          title: "年度立项统计",
          name: "项目数",
          selectY: true,
          chartData: {
            columns: ["month", "项目数", "总计数"],
            rows: []
          },
          chartSettings: {
            label: false,
            labelMap: {
              项目数: "月度项目数"
            }
          }
        },
        pers_line: {
          title: "年度学员统计",
          name: "学员数",
          selectY: false,
          chartData: {
            columns: ["month", "学员数", "总计数"],
            rows: []
          },
          chartSettings: {
            label: false,
            labelMap: {
              学员数: "月度学员数"
            }
          }
        },
        balance_line: {
          title: "年度结算统计",
          name: "创收金额",
          selectY: false,
          chartData: {
            columns: ["month", "创收金额", "总计数"],
            rows: []
          },
          chartSettings: {
            label: false,
            labelMap: {
              创收金额: "月度创收金额"
            }
          }
        }
      }
    };
  },
  components: {
    VeLine
  },
  methods: {
    ...mapActions(["getIndexLine"]),
    initData() {
      this.getIndexLine({
        data: {
          nian: this.nian
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data.list;
          for (let key in this.type) {
            let val = this.type[key];
            let rows = Data[key].map((item, index) => {
              return Object.assign({}, item, {
                month: `${item.month}月`,
                总计数: this.setData(Data[key], val.name)[index]
              });
            });
            this.$set(this.type[key].chartData, "rows", rows);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    setData(list, name) {
      let obj = {};
      for (let m = 0; m < 12; m++) {
        let num = 0;
        list.map((item, index) => {
          if (index < m || index === m) {
            num += Number(item[name]);
          }
        });
        obj[m] = num;
      }
      return obj;
    }
  },
  created() {
    let y = new Date().getFullYear();
    this.nian = y;
    this.initData();
  }
};
</script>

<style scoped>
.index-nian-box {
  position: relative;
}
.nian-box {
  position: absolute;
  top: 14px;
  right: 20px;
}
</style>
