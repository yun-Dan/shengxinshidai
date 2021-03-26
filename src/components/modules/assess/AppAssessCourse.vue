<template>
  <div class="assess-course-box">
    <AppAssessTable :id-data="2"></AppAssessTable>
  </div>
</template>

<script>
import AppAssessTable from "./components/AppAssessTable";
export default {
  name: "app-assess-course",
  components: {
    AppAssessTable
  }
};
</script>
