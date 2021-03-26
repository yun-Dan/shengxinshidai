<template>
  <div>
    <div :id="id" type="text/plain"></div>
  </div>
</template>

<script>
export default {
  name: 'UE',
  data() {
    return {
      editor: null
    };
  },
  props: {
    defaultMsg: {
      type: String
    },
    config: {
      type: Object
    },
    id: {
      type: String
    }
  },
  mounted() {
    const _this = this;
    this.editor = UE.getEditor(this.id, this.config);
    this.editor.addListener('ready', function() {
      _this.editor.setContent(_this.defaultMsg);
    });
  },
  methods: {
    getUEContent() {
      return this.editor.getContent();
    },
    setUEContent(content) {
      return this.editor.setContent(content);
    }
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>
