<template>
  <div id="main-page">
    <div class="wrapper">
      <toolBar v-model="resolution" @events="toolEvent"></toolBar>
      <div id="draw-block" ref="drawBlock">
        <div id="drawLayer" :style="drawlayerStyle">
          <canvas ref="canvas" width="800" height="400"></canvas>
        </div>
        <div id="imageLayer" :style="imagelayerStyle">
          <vue-draggable-resizable
            :w="100"
            :h="100"
            :parent="true"
            v-for="(img, index) in imgList"
            :key="index"
          >
            <img :src="img.url" class="img-item" />
          </vue-draggable-resizable>
        </div>
      </div>
    </div>
    <trackBlock
      @frameDelivery="frameDelivery"
      @choiceTarget="choiceTarget"
      @changeFrame="changeFrame"
    ></trackBlock>

    <div id="github">
      <div class="mask"></div>
      <div class="icon">
        <a href="https://github.com/a1163675107/easy-animation"
          ><i class="fa fa-github" aria-hidden="true"></i
        ></a>
      </div>
    </div>
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
      resolution: [800, 400],
      points: [
        {
          order: 0,
          time: new Date(0),
          data: [],
          cache: [],
          finish: false
        }
      ],
      target: 0,
      image: null,
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
      this.draw();
    },
    changeFrame: function(item) {
      this.points[item.order].time = item.time;
    },
    //导出代码
    importCode: function() {
      let cache = [];
      for (const item of this.points) {
        //去除最后一个点，因为它实际上是废的
        cache.push(item.data.pop());
      }
      this.points = this.points.sort((a, b) => {
        return a.time - b.time;
      });
      this.points = pointShake(this.points);
      CreateImportCode({
        points: this.points,
        viewX: this.resolution[0],
        viewY: this.resolution[1]
      })
        .then(res => {
          this.$alert(res, "SUCCESS", {
            confirmButtonText: "确定"
          });
        })
        .catch(err => {
          this.$alert(err, "ERROR", {
            confirmButtonText: "确定"
          });
          for (let index in this.points) {
            if(cache[index])this.points[index].data.push(cache[index]);
          }
        });
    },
    insert: function(imgList) {
      this.imgList = imgList;
    },
    choiceLayer: function(name) {
      this.layer = name;
    },
    controlStep: function(mode) {
      //0撤回 1前进
      let p = this.points[this.target];
      if (mode == 0) {
        if (p.data.length != 0) {
          p.cache.push(p.data.pop());
          if (p.finish == true) {
            //完成时回退，取消完成状态
            p.finish = false;
          }
        }
      } else {
        if (p.cache.length != 0) {
          let c = p.cache.pop();
          let o = p.data[0];
          p.data.push(c);
          c = c.split(",");
          o = o.split(",");
          if (Math.abs(o[0] - c[0]) < 6 && Math.abs(o[1] - c[1]) < 6) {
            //前进点是最终点，则确定完成状态
            p.finish = true;
          }
        }
      }
      this.draw();
    },
    toolEvent: function(EventName, ...args) {
      let eventManger = {
        run: function() {
          this[EventName](...args);
        },
        importCode: this.importCode,
        insert: this.insert,
        choiceLayout: this.choiceLayer,
        controlStep: this.controlStep
      };
      eventManger.run();
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
        self.points[self.target].cache = []; //下笔时清空点缓存区数据
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
          self.$notify({
            title: "FINISH",
            message: "完成一帧画面的绘制",
            type: "success"
          });
        }
        self.draw(command); //开始绘制
        if (command == "close") {
          self.points[self.target].finish = true;
        }
      },
      true
    );
    window.onresize = () => {
      //并无软用
      let c = this.$refs.canvas;
      let db = this.$refs.drawBlock;
      let maxHeight = db.clientHeight - 15;
      let maxWidth = db.clientWidth - 15;
      let check = true;
      if (c.width * 1 >= maxWidth || c.height * 1 >= maxHeight) {
        db.style.display = "block";
        check = false;
      }
      if (check) {
        db.style.display = "flex";
      }
    };
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
  position: relative;
  .wrapper {
    display: flex;
    #draw-block {
      flex-grow: 1;
      border: 1px solid white;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: auto;
      #drawLayer {
        background: rgba(0, 0, 0, 0);
        position: absolute;
        z-index: 20;
        canvas {
          border: 1px solid rgb(139, 139, 139);
        }
      }
      #imageLayer {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
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
  #github {
    position: absolute;
    top: 0;
    right: 0;
    .mask {
      width: 5rem;
      height: 5rem;
      background: rgba(255, 255, 255, 0.3);
      clip-path: polygon(0 0, 100% 0, 100% 100%);
    }
    .icon {
      font-size: 2rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 50;
      transition: 0.5s;
    }
    .icon:hover {
      transform: rotate(45deg);
    }
  }
}
</style>
