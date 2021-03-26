<template>
  <div class="app-news-reference">
    <AppNewsTable pid-val="2"></AppNewsTable>
  </div>
</template>

<script>
import AppNewsTable from "./components/AppNewsTable";
export default {
  name: "app-news-reference",
  components: {
    AppNewsTable
  }
};
</script>
