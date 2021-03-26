<template>
  <div class="app-news-inform">
    <AppNewsTable pid-val="1"></AppNewsTable>
  </div>
</template>

<script>
import AppNewsTable from "./components/AppNewsTable";
export default {
  name: "app-news-inform",
  components: {
    AppNewsTable
  }
};
</script>
