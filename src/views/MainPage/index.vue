<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar :resolution="resolution" ></toolBar>
      <div id="draw-block">
        <canvas id="drawArea" ref="canvas"></canvas>
      </div>
    </div>
    <div id="timeline-block"></div>
  </div>
</template>

<script>
import Layout from "@/layout/index";

export default {
  name: "",
  data() {
    return {
      resolution: [200, 200]
    };
  },
  components: {
    toolBar: Layout.toolBar
  },
  mounted() {},
  methods: {},
  watch: {
    resolution:function(val){
     let c=this.$refs.canvas;
     let w=val[0]+'px';
     let h=val[1]+'px';
     c.style.width=w;
     c.style.height=h;
    }
  },
};
</script>

<style lang="scss" scoped>
#main-page {
  display: flex;
  flex-direction: column;
  .wrapper {
    display: flex;
    #draw-block {
      padding: 1rem;
      width: 80vw;
      height: 80vh;
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
