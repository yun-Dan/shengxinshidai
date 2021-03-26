<template>
  <div class="app-mobile-certificate-bill">
    <AppCertificateBillPrint />
  </div>
</template>

<script>
import AppCertificateBillPrint from '@/components/modules/certificate/components/bill/AppCertificateBillPrint'
export default {
  name: 'app-mobile-certificate-bill',
  components: {
    AppCertificateBillPrint
  }
}
</script>

<style scoped>
.app-mobile-certificate-bill {
  min-height: 100%;
  background-color: #fff;
}
</style>
