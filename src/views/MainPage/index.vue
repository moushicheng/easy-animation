<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar v-model="resolution"></toolBar>
      <div id="draw-block" ref="drawBlock">
        <canvas id="drawArea" ref="canvas"></canvas>
      </div>
    </div>
    <trackBlock></trackBlock>
  </div>
</template>

<script>
import Layout from "@/layout/index";

export default {
  name: "",
  data() {
    return {
      resolution: [200, 200],
      point: [
        ['100,100','200,100','100,200']
        ['300,100','400,100','300,200']
      ]
    };
  },
  components: {
    toolBar: Layout.toolBar,
    trackBlock: Layout.trackBlock
  },
  mounted() {},
  methods: {},
  watch: {
    resolution: function(val) {
      let c = this.$refs.canvas;
      let db = this.$refs.drawBlock;
      let maxHeight = db.clientHeight - 15;
      let maxWidth = db.clientWidth - 15;

      if (val[0] * 1 >= maxWidth) {
        this.resolution[0] = maxWidth;
      }
      if (val[1] * 1 >= maxHeight) {
        this.resolution[1] = maxHeight;
      }
      let w = this.resolution[0] + "px";
      let h = this.resolution[1] + "px";
      c.style.width = w;
      c.style.height = h;
    }
  }
};
</script>

<style lang="scss" scoped>
#main-page {
  display: flex;
  flex-direction: column;
  .wrapper {
    display: flex;
    #draw-block {
      flex-grow: 1;
      height: 50rem;
      border: 1px solid white;
      display: flex;
      justify-content: center;
      align-items: center;
      #drawArea {
        width: 200px;
        height: 200px;
        border: 1px solid rgb(139, 139, 139);
      }
    }
  }
}
</style>
