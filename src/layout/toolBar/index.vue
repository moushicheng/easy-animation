<template>
  <div id="toolBar">
    <div class="tool-item">pointer</div>
    <div class="tool-item">pen</div>
    <div class="tool-item">fill</div>
    <div class="tool-item">color</div>
    <div class="tool-item">
      resolution
      <div id="resolutionBlock">
        <input type="text" v-model="resolution[0]" />
        x
        <input type="text" v-model="resolution[1]" />
      </div>
    </div>
    <div class="tool-item">insert</div>
    <div class="tool-item">preview</div>
    <div class="tool-item">import</div>
  </div>
</template>

<script>
export default {
  name: "toolBar",
  data() {
    return {
    };
  },
  components: {},
  mounted() {},
  methods: {},
  props:['resolution']
};
</script>

<style lang="scss" scoped>
#toolBar {
  width: 10rem;
  border: 1px solid white;
  padding: 1rem;
  .tool-item {
    cursor: pointer;
    margin-top: 1rem;
  }
  #resolutionBlock {
    width: fit-content;
    input {
      width: 3rem;
    }
  }
}
</style>
