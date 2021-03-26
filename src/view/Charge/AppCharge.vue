<template>
  <div
    class="app-charge"
    v-loading="loading2"
    element-loading-text="系统登陆中"
    element-loading-spinner="el-icon-loading">
    <form
      ref="form1"
      id="form1"
      method="post"
      :action="sso_url"
      accept-charset="UTF-8"
      target="_blank">
      <input type="hidden" name="zgbh" v-model="params.zgbh">
      <input type="hidden" name="DateTime" v-model="params.DateTime">
      <input type="hidden" name="bjdm" v-model="params.bjdm">
      <input type="hidden" name="sfxmdm" v-model="params.sfxmdm">
      <input type="hidden" name="sign" v-model="params.sign">
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'app-charge',
  data() {
    return {
      loading2: true,
      sso_url: '',
      params: {}
    }
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        this.$refs.form1.submit()
        setTimeout(() => {
          window.close()
        }, 500)
      })
    }
  },
  beforeMount() {
    const Charge = sessionStorage.getItem('charge')
    if (Charge) {
      const Obj = JSON.parse(Charge)
      Object.assign(this.params, {
        DateTime: Obj.DateTime,
        bjdm: Obj.bjdm,
        sfxmdm: Obj.sfxmdm,
        sign: Obj.sign,
        zgbh: Obj.zgbh
      })
      this.sso_url = Obj.sso_url
    } else {
      window.close()
    }
  },
  mounted() {
    this.initData()
  },
  beforeDestroy() {
    sessionStorage.removeItem('charge')
  }
}
</script>

<style scoped>
.app-charge {
  height: 100%;
}
</style>
