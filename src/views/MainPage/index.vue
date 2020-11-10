<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar v-model="resolution" @events="toolEvent"></toolBar>
      <div id="draw-block" ref="drawBlock">
        <div id="drawLayer" :style="drawlayerStyle">
          <canvas ref="canvas" width="200" height="200"></canvas>
        </div>
        <div id="imageLayer" :style="imagelayerStyle">
          <vue-draggable-resizable :w="100" :h="100" :parent="true" v-for="(img, index) in imgList" :key="index" >
            <img
              :src="img.url"
              @click="test"
              class="img-item"
            />
          </vue-draggable-resizable>
          <!-- <vue-draggable-resizable
            :w="100"
            :h="100"
            @dragging="onDrag"
            @resizing="onResize"
            :parent="true"
          >
            <img
              src="@/assets/logo.png"
              alt=""
              @click="test"
              class="img-item"
            />
          </vue-draggable-resizable> -->
        </div>
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
      layer: 1, //1绘图层 0图片层
      imgList: null
    };
  },
  computed: {
    imagelayerStyle: function() {
      if (this.layer == 1) {
        return `z-index:10`;
      } else {
        return `z-index:20`;
      }
    },
    drawlayerStyle: function() {
      if (this.layer == 1) {
        return `z-index:20`;
      } else {
        return `z-index:10`;
      }
    }
  },
  methods: {
    draw: function(command) {
      drawTools.draw(this.points, this.target, this.$refs.canvas, command);
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
      for (const item of this.points) {
        //去除最后一个点，因为它实际上是废的
        item.data.pop();
      }
      this.points = pointShake(this.points);
      let code = CreateImportCode({
        points: this.points,
        viewX: this.resolution[0],
        viewY: this.resolution[1]
      });
    },
    insert: function(imgList) {
      this.imgList = imgList;
    },
    choiceLayer: function(name) {
      this.layer = name;
    },
    toolEvent: function(EventName, ...args) {
      let eventManger = {
        run: function() {
          this[EventName](...args);
        },
        importCode: this.importCode,
        insert: this.insert,
        choiceLayout: this.choiceLayer
      };
      eventManger.run();
    },
    test: function() {
      console.log(1);
    }
  },
  mounted() {
    let c = this.$refs.canvas;
    let self = this;
    let originX = null;
    let originY = null;
    c.addEventListener(
      "click",
      function(e) {
        if (self.layer == 0 || e.target.className == "img-item") return; //图片层则不绘画||防误触
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
  },
  components: {
    toolBar: Layout.toolBar,
    trackBlock: Layout.trackBlock
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
      position: relative;
      #drawLayer {
        border: 1px solid rgb(139, 139, 139);
        background: rgba(0, 0, 0, 0);
        position: absolute;
        z-index: 2;
      }
      #imageLayer {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        .vdr {
          border: 1px dashed rgba(255, 255, 255, 0.3);
        }
        .img-item {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
