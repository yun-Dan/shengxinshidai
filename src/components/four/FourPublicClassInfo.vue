<template>
  <div class="four-p-class-info" v-if="class_major_number && class_major_name">
    <i class="el-icon-arrow-right" style="color: #C0C4CC;"></i>&nbsp;
    <i class="el-icon-s-flag danger"></i>【<span class="info">办班编号：</span>
    <span>{{ class_major_number }}</span>】
    【<span class="info">办班专业：</span>
    <span>{{ class_major_name }}</span>】
  </div>
</template>

<script>
export default {
  data () {
    return {
      class_major_name: '',
      class_major_number: ''
    }
  },
  methods: {
    initData () {
      const query = this.$route.query
      this.class_major_name = query.class_major_id ? query.class_major_name || '' : ''
      this.class_major_number = query.class_major_id ? query.class_major_number || '' : ''
    }
  },
  created () {
    this.initData()
  },
  watch: {
    '$route' () {
      this.initData()
    }
  }
}
</script>


<style scoped>
.four-p-class-info{
  line-height: 16px;
  margin-left: 2px;
  padding: 0 4px;
  border-radius: 3px;
  color: #5c887a;
}
</style>
