<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar v-model="resolution"></toolBar>
      <div id="draw-block" ref="drawBlock">
        <canvas id="drawArea" ref="canvas" width="200" height="200"></canvas>
      </div>
    </div>
    <trackBlock></trackBlock>
    <!-- <button @click="draw">start</button> -->
  </div>
</template>

<script>
import Layout from "@/layout/index";
import drawTools from "@/utils/draw.js";
export default {
  name: "",
  data() {
    return {
      resolution: [200, 200],
      points: [
        {
          order:0,
          time: 0,
          data: ["0,0", "500,105", "241,312"]
        }
      ],
      target: 0
    };
  },
  components: {
    toolBar: Layout.toolBar,
    trackBlock: Layout.trackBlock
  },
  mounted() {},
  methods: {
    draw: function() {
      drawTools.draw(this.points[this.target].data, this.$refs.canvas);
    }
  },
  watch: {
    resolution: function(val) {
      //设置画布分辨率
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
      c.style.width = this.resolution[0] + "px";
      c.style.height = this.resolution[1] + "px";
      c.width = this.resolution[0];
      c.height = this.resolution[1];
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
