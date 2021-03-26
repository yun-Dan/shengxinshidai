<template>
  <div class="app-assess-project">
    <AppAssessTable :id-data="1"></AppAssessTable>
  </div>
</template>

<script>
import AppAssessTable from "./components/AppAssessTable";
export default {
  name: "app-assess-project",
  components: {
    AppAssessTable
  }
};
</script>
