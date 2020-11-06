<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar
        v-model="resolution"
        @events="toolEvent"
      ></toolBar>
      <div id="draw-block" ref="drawBlock">
        <canvas id="drawArea" ref="canvas" width="200" height="200"></canvas>
        <img src="@/assets/logo.png" alt="">
      </div>
    </div>
    <trackBlock
      @frameDelivery="frameDelivery"
      @choiceTarget="choiceTarget"
      @changeFrame="changeFrame"
    ></trackBlock>
  </div>
</template>

<script>
import Layout from "@/layout/index";
import drawTools from "@/utils/draw.js";
import { CreateImportCode, pointShake } from "@/utils/index.js";

export default {
  name: "",
  data() {
    return {
      resolution: [200, 200],
      points: [
        {
          order: 0,
          time: new Date(0),
          data: [],
          finish: false
        }
      ],
      image: null,
      target: 0,
      layer:0, //0代表绘图层 1代表图片层
    };
  },
  components: {
    toolBar: Layout.toolBar,
    trackBlock: Layout.trackBlock
  },
  mounted() {
    let c = this.$refs.drawBlock;
    let self = this;
    let originX = null;
    let originY = null;
    c.addEventListener(
      "click",
      function(e) {
        //绘画函数
        if (self.points[self.target].finish == true) return; //如果完成了则直接结束
        let command = null; //设置绘画命令
        //获取鼠标坐标点
        let x = e.offsetX;
        let y = e.offsetY;
        let target = self.target;

        self.points[target].data.push(x + "," + y); //记录点坐标

        if (self.points[target].data.length == 1) {
          //起始点命令
          command = "initial";
          originX = x;
          originY = y;
        } else if (Math.abs(originX - x) < 6 && Math.abs(originY - y) < 6) {
          //如果点到起始点，则闭合图形
          command = "close";
        }
        self.draw(command); //开始绘制
        if (command == "close") {
          self.points[self.target].finish = true;
        }
      },
      true
    );
  },
  methods: {
    draw: function(command) {
      drawTools.draw(this.points,this.target, this.$refs.canvas, command);
    },
    frameDelivery: function(m) {
      this.points.push({
        order: this.points.length,
        time: m,
        data: [],
        finish: false
      });
    },
    choiceTarget: function(m) {
      this.target = m;
    },
    changeFrame: function(item) {
      this.points[item.order].time = item.time;
    },
    //导出代码
    importCode: function() {
      for (const item of this.points) { //去除最后一个点，因为它实际上是废的
        item.data.pop();
      }
      this.points = pointShake(this.points);
      let code = CreateImportCode({
        points: this.points,
        viewX: this.resolution[0],
        viewY: this.resolution[1]
      });
    },
    insert: function() {
      console.log('insert');
      // let canvas = this.$refs.canvas;
      // let context = canvas.getContext("2d");
      // if (this.image == null) {
      //   let img = new Image();
      //   img.src = require("@/assets/logo.png");
      //   this.image = img;
      //   img.onload = function() {
      //     context.drawImage(this, 0, 0);
      //   };
      // } else {
      // context.drawImage(this.image,0,0,300,300,100,100,300,300);
      // }
    },
    choiceLayer:function(name){
     console.log(name);
    },
    toolEvent:function(EventName,...args){
      let eventManger={
        run:function(){
          this[EventName](...args);
        },
        importCode:this.importCode,
        insert:this.insert,
        choiceLayout:this.choiceLayer
      }
      eventManger.run();
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
      //重绘原来画好的图案
      this.draw();
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
      height: 80vh;
      border: 1px solid white;
      display: flex;
      justify-content: center;
      align-items: center;
      #drawArea {
        width: 200px;
        height: 200px;
        border: 1px solid rgb(139, 139, 139);
        background: rgba(0, 0, 0, 0);
        position: absolute;
      }
    }
  }
}
</style>
