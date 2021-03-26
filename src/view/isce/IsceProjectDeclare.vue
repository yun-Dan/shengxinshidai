<template>
  <div class="isce-project-declare">
    <AppProjectDeclare v-if="isISCE" :isce="{
      id: ID,
      timeStamp: timeStamp,
      randomStr: randomStr,
      wisdom: wisdom
    }"/>
  </div>
</template>

<script>
import AppProjectDeclare from '@/components/modules/project/components/AppProjectDeclare.vue'
export default {
  name: 'isce-project-declare',
  data () {
    return {
      isISCE: false,
      ID: null,
      timeStamp: null,
      randomStr: 'TAoi6pK1oHQl', 
      tokenStr: '3tO_vie]OJETQN(!bv#s|IB5r1mf@W6Y',
      wisdom: ''
    }
  },
  components: {
    AppProjectDeclare
  },
  created () {
    const Query = this.$route.query
    const ID = this.$route.params.id
    if (ID && this.$md5(Query.t + this.randomStr + ID) === Query.w) {
      this.isISCE = true
      this.timeStamp = Query.t
      this.wisdom = this.$md5(`${this.randomStr}${Query.t}${this.tokenStr}`).toLocaleUpperCase()
      this.ID = ID - 0
    }
  }
}
</script>

<style scoped>
.isce-project-declare{
  height: 100%;
  background-color: #fff;
}
</style>
