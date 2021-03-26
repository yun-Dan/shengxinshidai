<template>
  <div class="app-index-index clearfix" style="overflow: hidden;background-color: #f4f4f4">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="userInfo.role===1?6:7">
        <div class="grid-content bg-purple" v-cloak>
          <AdminCard v-if="userInfo.role===2" class="space-item"></AdminCard>
          <BacklogCard :prop-rh="rightH" class="space-item"></BacklogCard>
        </div>
      </el-col>
      <el-col :xs="0" :sm="userInfo.role===1?18:17">
        <div class="grid-content bg-purple">
          <el-row :gutter="20" class="space-item">
            <el-col v-for="item in totalData" :span="6" :key="item.title">
              <div class="grid-content bg-purple" v-cloak>
                <StatisticCard :prop-data="item"></StatisticCard>
              </div>
            </el-col>
          </el-row>
          <div v-cloak>
            <AppMap class="space-item" @change="handleChange"></AppMap>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <AppLine></AppLine>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import AdminCard from "./components/AdminCard.vue"
import BacklogCard from "./components/BacklogCard.vue"
import StatisticCard from "./components/StatisticCard.vue"
import AppMap from "./components/AppMap.vue"
import AppLine from "./components/AppLine.vue"

export default {
  name: "app-index-index",
  data() {
    return {
      totalData: [
        {
          title: "项目总数",
          num: 0,
          icon: "fa-shopping-bag",
          color: "#2D8CF0"
        },
        {
          title: "协议总数",
          num: 0,
          icon: "fa-newspaper-o",
          color: "#64D572"
        },
        {
          title: "人员总数",
          num: 0,
          icon: "fa-user-plus",
          color: "#FFD572"
        },
        {
          title: "证书制作总数",
          num: 0,
          icon: "fa-leanpub",
          color: "#F25E43"
        }
      ],
      rightH: 400
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    AdminCard,
    BacklogCard,
    StatisticCard,
    AppMap,
    AppLine
  },
  methods: {
    ...mapActions(["getTotalNum"]),
    initData() {
      this.getTotalNum().then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data.list;
          this.totalData = [
            {
              title: "项目总数",
              num: Data.pro_count,
              icon: "fa-shopping-bag",
              color: "#2D8CF0"
            },
            {
              title: "协议总数",
              num: Data.prowtfz_count,
              icon: "fa-newspaper-o",
              color: "#64D572"
            },
            {
              title: "人员总数",
              num: Data.pers_count,
              icon: "fa-user-plus",
              color: "#FFD572"
            },
            {
              title: "证书总数",
              num: Data.procert_count,
              icon: "fa-leanpub",
              color: "#F25E43"
            }
          ];
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleChange (rightH) {
      this.rightH = rightH
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style scoped>
.space-item {
  margin-bottom: 10px;
}
</style>
