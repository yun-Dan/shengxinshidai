<template>
  <div class="app-crumbs clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="fl">
      <el-breadcrumb-item>
        <strong>
          <i class="fa fa-home"></i>
          首页
        </strong>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in crumbs" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="fl hidden-sm-and-down">
      <FourPublicClassInfo/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FourPublicClassInfo from '@/components/four/FourPublicClassInfo.vue'

export default {
  name: 'app-crumbs',
  computed: {
    ...mapState(['crumbs'])
  },
  components: {
    FourPublicClassInfo
  }
}
</script>

<style scoped>
.app-crumbs {
  padding: 14px;
  background-color: #fff;
}
</style>
