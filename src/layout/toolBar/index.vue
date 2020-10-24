<template>
  <div id="toolBar">
    <div class="tool-item">
      <p>pointer</p>
      <i class="fa fa-mouse-pointer" aria-hidden="true"></i>
    </div>
    <div class="tool-item">
      <p>pen</p>
      <i class="fa fa-pencil" aria-hidden="true"></i>
    </div>
    <div class="tool-item">
      <p>fill</p>
      <i class="fa fa-circle" aria-hidden="true"></i>
    </div>
    <div class="tool-item">
      <p>color</p>
      <i class="fa fa-braille" aria-hidden="true"></i>
    </div>
    <div class="tool-item">
      <p>showAll</p>
    </div>
    <div class="tool-item">
      <p>hideAnother</p>
    </div>
    <div class="tool-item">
      <p>insert</p>
      <i class="fa fa-file-image-o" aria-hidden="true"></i>
    </div>
    <div class="tool-item">
      <p>preview</p>
      <i class="fa fa-desktop" aria-hidden="true"></i>
    </div>
    <div class="tool-item" @click="importCode">
      <p>import</p>
      <i class="fa fa-download" aria-hidden="true"></i>
    </div>
    <div class="tool-item " id="resolution">
      <p>resolution</p>
      <div id="resolutionBlock">
        <input type="text" v-model="resolution[0]" />
        x
        <input type="text" v-model="resolution[1]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "toolBar",
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {
    importCode:function(){
      this.$emit('importCode')
    }
  },
  model: {
    prop: "resolution",
    event: "change"
  },
  props: {
    resolution: Array
  }
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
    display: flex;
    justify-content: space-between;
  }
  #resolution {
    flex-direction: column;
    #resolutionBlock {
      width: fit-content;
      input {
        border-radius: 5px;
        width: 3rem;
      }
    }
  }
}
</style>
