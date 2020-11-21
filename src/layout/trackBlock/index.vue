<template>
  <div id="trackBlock">
    <hr />

    <div id="timeLine">
      <p>TimeLine</p>
      <div id="timeContainer" ref="timeContainer" >
        <div class="time-item" ref="timeItem">{{timeLineData[0]}}</div>
        <div class="time-item">{{timeLineData[1]}}</div>
        <div class="time-item">{{timeLineData[2]}}</div>
        <div class="time-item">{{timeLineData[3]}}</div>
        <div class="time-item">{{timeLineData[4]}}</div>
        <div class="time-item" @click="adjustMaxTime" >{{timeLineData[5]}}</div>
      </div>
    </div>
    <div id="frameTrack">
      <p id="frameTarget">cur:{{curTarget}}</p>
      <div id="frameContainer" ref='frameContainer'>
        <frame
        v-for="item in curTrack"
        :key="item.index"
        :content="item.order"
        :popContent=" formatTime(item.time)"
        class="frame"
        ref="frame"
        @click="onFrameClick(item.order)"
        @delete="deleteFrame(item.order)"
        @adjust="adjustFrame(item)"
        @drag="onDrag(item.order)"
        @mousedown.native="onDrag(item.order)"
        >
      </div>
      <div id="plusBtn" @click="addFrame">+</div>
    </div>


    <el-dialog :title="formData.type" :visible.sync="dialogVisible" width="30%">
      <form ref="addForm" id="addForm">
        <div class="form-item">
          <p class="form-item-head">Set Time</p>
          <input type="number" max="60" min="0" v-model="formData.minute" />
          <span id="timeMiddle">:</span>
          <input type="number" max="60" min="0" v-model="formData.second" />
          <span id="timeMiddle">.</span>
          <input type="number" max="1000" min="0" v-model="formData.millisecond" />
        </div>
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">confirm</el-button>
        <el-button @click="dialogVisible = false">cancel</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { verify } from "@/utils/form.js";
import { formatTime } from "@/utils/index.js";
import { frame } from "@/components/index.js";

export default {
  name: "trackBlock",
  data() {
    return {
      tracksData: [
        [
          //curTrack
          {
            //curData
            order: 0,
            time: new Date(0),
          },
        ],
        // [
        //   {
        //     order: 0,
        //     time: new Date(0),
        //   },
        // ],
      ],
      targets: [0], //curTarget
      trackTarget: 0,
      formData: {
        minute: 0,
        second: 0,
        millisecond: 0,
        type: null,
      },
      dialogVisible: false,
      maxTime: new Date(2500),
      timeLineData: [
        '00:00.000"',
        '00:00.500"',
        '00:01.000"',
        '00:01.500"',
        '00:02.000"',
        '00:02.500"',
      ],
      target: 0,
      frameX: null,
    };
  },
  computed: {
    curData: function () {
      return this.curTrack[this.curTarget];
    },
    curTarget: function () {
      return this.targets[this.trackTarget];
    },
    curTrack: function () {
      //->timeData
      return this.tracksData[this.trackTarget];
    },
  },
  watch: {
    curTrack: {
      handler: function () {
        //使帧对其时间轨,根据f(时间/总时间) -> f(位置)
        setTimeout(() => {
          //重绘时间轨
          this.reDrawTrack();
          //对其帧位置
          let frames = this.$refs.frame;
          let timeContainer = this.$refs.timeContainer;
          let tcWidth = timeContainer.clientWidth;
          let b = this.$refs.timeItem.clientWidth;

          for (const index in frames) {
            const frame = frames[index].$el;
            const data = this.curTrack[index];
            let ratio = (data.time * 1) / (this.maxTime * 1); //粗调
            let offset = -b * ratio + "px"; //细调,消除偏移量
            ratio = ratio * 100 + "%";
            frame.style.setProperty("--x", ratio);
            frame.style.setProperty("--y", offset);
          }
        });
      },
      deep: true,
    },
  },

  methods: {
    addFrame: function (done) {
      //添加新帧
      this.formData.type = "ADD[new Frame]";
      this.dialogVisible = true;
    },
    adjustFrame: function (item) {
      //重设单独帧的数据
       let time = item.time;
       let order= time.order
      this.formData.type = "[Change]Frame";
      this.dialogVisible = true;
      this.setTarget(order);
      this.formData.minute = time.getMinutes();
      this.formData.second = time.getSeconds();
      this.formData.millisecond = time.getMilliseconds();
    },
    deleteFrame: function (order) {
      this.curTrack.splice(order, 1);
      this.reDrawFrame();
    },
    adjustMaxTime: function () {
      this.formData.type = "[Change]MaxTime";
      this.dialogVisible = true;
    },
    onFrameClick: function (order) {
      this.$emit("choiceTarget", order);
      this.setTarget(order)
    },
    onDrag: function (order) { //鼠标拖动帧执行的逻辑
      let frame = this.$refs.frame[order].$el;
      let container = this.$refs.frameContainer;
      let b = this.$refs.timeItem.clientWidth;
      let self = this;
      let pop = frame.children[1];

      let x = container.offsetLeft + 16; //1rem=16
      document.onmousemove = function (e) {
        let ratio = (e.pageX - x) / (container.clientWidth - b);
        if (ratio <= 0) ratio = 0;
        if (ratio > 1) ratio = 1;
        self.curTrack[order].time = new Date(self.maxTime * ratio);

        //对hover框进行操作，触底反弹,和上面的帧拖动逻辑无关,但不需要解耦（目测日后不需要维护hh
        let popLeft = pop.getBoundingClientRect().left + pop.clientWidth;
        let ww = window.innerWidth;
        if (popLeft >= ww - 150)
          pop.style.transform = `translateX(-${popLeft - ww + 50}px)`;
        else {
          pop.style.transform = null;
        }
      };
      document.onmouseup = function () {
        //清除盒子的移动事件;
        document.onmousemove = null;
      };
    },
    reDrawFrame: function () {
      let count = 0;
      for (const item of this.curTrack) {
        item.order = count++;
      }
    },
    reDrawTrack: function () {
      //重绘轨道时间轴
      let maxT = this.maxTime;
      let t = this.maxTime / 5;
      let result = ['00:00.000"'];
      for (let i = 1; i < 5; i++) {
        result.push(this.formatTime(new Date(t * i)));
      }
      result.push(this.formatTime(maxT));
      this.timeLineData = result;
    },
    //表单提交
    submitForm: function () {
      this.dialogVisible = false;

      //对表单值进行效验
      let min = this.formData.minute;
      let second = this.formData.second;
      let ms = this.formData.millisecond;
      if (!verify(min, "range", "0,60") ||!verify(second, "range", "0,60") ||!verify(ms, "range", "0,1000"))return;
      let curTime = new Date(min * 60 * 1000 + second * 1000 + ms * 1);

      switch (this.formData.type) {
        case "ADD[new Frame]": {
          this.curTrack.push({
            order: this.curTrack.length,
            time: curTime,
          });
          //传递新帧给主页面
          this.$emit("frameDelivery", curTime.valueOf());
          this.$emit("choiceTarget", this.curTrack.length - 1);
          this.$set(this.targets, this.curTarget, this.curTrack.length - 1);
          break;
        }
        case "[Change]Frame": {
          this.curData.time = curTime;
          this.$emit("changeFrame", { order: this.curTarget, time: curTime });
          this.$emit("choiceTarget", this.curTarget);
          break;
        }
        case "[Change]MaxTime": {
          this.maxTime = curTime;
          this.reDrawTrack();
        }
      }
      if (this.maxTime <= curTime) this.maxTime = curTime;
    },

    setTarget(index){
      this.$set(this.targets,this.trackTarget,index);
    },
    formatTime, //格式化时间
  },
  components: { frame },
};
</script>

<style lang="scss" scoped>
#trackBlock {
  margin-top: 1rem;
  width: 100%;
  #timeLine {
    display: flex;
    p {
      width: 5rem;
      border-right: 1px solid white;
      padding-right: 1rem;
    }
    #timeContainer {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      margin: 0 1rem;
      margin-top: 5px;
      .time-item:nth-child(6) {
        cursor: pointer;
        background: white;
        color: rgb(52, 73, 94);
        border-radius: 5px;
        padding: 1px 5px 1px 0;
      }
      .time-item:nth-child(6):hover {
        color: rgb(52, 73, 94);
        background: rgba(255, 255, 255, 0.8);
      }
    }
  }
  #frameTrack {
    #frameTarget {
      margin-left: 2rem;
      width: 4rem;
    }
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    #frameContainer {
      height: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      flex-grow: 1;
      position: relative;
      .frame {
        --x: "0%";
        --y: "0px";
        position: absolute;
        top: 0;
        left: var(--x);
        transform: translateX(var(--y));
      }
    }
    #plusBtn {
      font-size: 1rem;
      font-weight: 900;
      color: white;
      cursor: pointer;
      border-radius: 50%;
      &:hover {
        color: #289baf;
      }
    }
  }
}
#addForm {
  padding: 0rem;
  .form-item {
    color: white;
    .form-item-head {
      font-size: 1rem;
      margin-bottom: 5px;
    }
    #timeMiddle {
      font-size: 1rem;
      font-weight: 900;
      margin: 0 0.5rem;
    }
    input {
      text-align: center;
      width: 3rem;
      height: 1.5rem;
      color: black;
      border-radius: 10px;
      background: rgb(255, 255, 255);
    }
  }
}
::v-deep .el-dialog {
  background: #34495e;
  .el-dialog__title {
    color: white;
  }
}
</style>
