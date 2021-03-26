<template>
  <div v-if="showData" class="app-news-article">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button
          style="float: right;padding: 12px 20px;margin-right: 6px"
          @click.native="handleBack"
          type="primary"
        >返回</el-button>
        <h1 class="title">
          {{ showData.title }}
          <el-tag v-if="showData.dotop" type="success" size="mini" effect="dark">置顶</el-tag>
        </h1>
        <p class="text">
          <span class>• </span>
          <span>创建于 {{ showData.create_time | InfoTime }}</span>
          <span class="dot">• </span>
          <span>类型 {{ showData.articletype?'外链':'文章' }}</span>
          <span class="dot">• </span>
          <span>{{ showData.click_num + 1 }} 次浏览</span>
          <span class="dot">• </span>
          <span>最后一次编辑是 {{ showData.update_time | InfoTime }}</span>
          <span class="dot">• </span>
          <span>发布系统 </span>
          <span v-if="sys_type[showData.sys_type]" :style="{color: sys_type[showData.sys_type].color}">
            {{ sys_type[showData.sys_type].label }}
          </span>
        </p>
      </div>
      <div class="news-article-main" v-cloak>
        <div v-if="showData.content" v-html="showData.content" class="news-article-main-content"></div>
        <div class="empty-box" v-else>
          <img src="../../../../assets/images/icon-nonote@2x.png" alt>
          <h2>暂无内容</h2>
          <p>请下次再来</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-news-article",
  data() {
    return {
      showData: {},
      // 系统类型
      sys_type: {
        1: {
          value: 1,
          label: '继续教育微系统',
          color: '#bb0c2d'
        },
        2: {
          value: 2,
          label: '课程班系统',
          color: '#c1a10e'
        },
        3: {
          value: 3,
          label: '成教管理',
          color: '#44acb6'
        }
      }
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  filters: {
    InfoTime(t) {
      let now = new Date().getTime();
      let cTime = t * 1000;
      let time = now - cTime;
      let m = parseInt(time / (30 * 24 * 60 * 60 * 1000));
      let d = parseInt(
        (time % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
      );
      let str = m ? `${m}个月前` : d ? `${d}天前` : "今天";
      return str;
    }
  },
  methods: {
    ...mapActions(["getArticleId"]),
    initData() {
      this.getArticleId({
        id: this.$route.params["id"],
        data: {
          uid: this.userInfo.uid
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data) {
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
    handleBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style scoped>
.title {
  font-size: 22px;
  font-weight: 700;
  line-height: 130%;
}
.text {
  font-size: 12px;
  color: #838383;
}
.dot {
  margin-left: 6px;
}
.empty-box {
  padding: 100px 0;
  color: #afb5c1;
  text-align: center;
}
.empty-box img {
  width: 120px;
}
.empty-box p {
  font-size: 16px;
}
.news-article-main {
  max-width: 800px;
  margin: 0 auto;
}
.news-article-main-content {
  padding-top: 20px;
  font-size: 16px;
}
</style>
