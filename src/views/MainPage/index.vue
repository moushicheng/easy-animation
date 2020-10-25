<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar v-model="resolution" @importCode="importCode"></toolBar>
      <div id="draw-block" ref="drawBlock">
        <canvas id="drawArea" ref="canvas" width="200" height="200"></canvas>
      </div>
    </div>
    <trackBlock @frameDelivery="frameDelivery" @choiceTarget="choiceTarget" @changeFrame="changeFrame"></trackBlock>
  </div>
</template>

<script>
import Layout from "@/layout/index";
import drawTools from "@/utils/draw.js";
import {CreateImportCode,pointShake} from "@/utils/index.js"

export default {
  name: "",
  data() {
    return {
      resolution: [200, 200],
      points: [
          {
          order: 0,
          time: new Date(0),
          data: [
          ],
          finish: false
        },
      
      ],
      target: 0
    };
  },
  components: {
    toolBar: Layout.toolBar,
    trackBlock: Layout.trackBlock
  },
  mounted() {
    let c = this.$refs.canvas;
    let self = this;
    let originX = null;
    let originY = null;
    c.addEventListener("click", function(e) { //绘画函数
      if (self.points[self.target].finish == true) return;
      let command = null;
      let x = e.offsetX;
      let y = e.offsetY;
      let target = self.target;
      self.points[target].data.push(x + "," + y);
      if (self.points[target].data.length == 1) { //起始点命令
        command = "initial";
        originX = x;
        originY = y;
      } else if (Math.abs(originX - x) < 4 && Math.abs(originY - y) < 4) { //如果点到起始点，则闭合图形
        command = "close";
      }
      self.draw(command);
      if (command == "close") { //最后一个点实际上是"废"的,因为clip-path会自动闭合
        self.points[self.target].data.pop();
        self.points[self.target].finish = true;
      }
    });
  },
  methods: {
    draw: function(command) {
      drawTools.draw(this.points[this.target].data, this.$refs.canvas, command);
    },
    frameDelivery: function(m) {
      this.points.push({
        order: this.points.length,
        time: m,
        data: [],
        finish:false,
      });
    },
    choiceTarget: function(m) {
      this.target = m;
    },
    changeFrame:function(item){
     this.points[item.order].time=item.time;
    },
    //导出代码
    importCode: function() {
      this.points=pointShake(this.points);
      let code=CreateImportCode({
        points:this.points,
        viewX:this.resolution[0],
        viewY:this.resolution[1]
      })
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
