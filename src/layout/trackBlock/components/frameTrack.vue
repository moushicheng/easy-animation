<!--
 * @Author: your name
 * @Date: 2020-11-20 21:07:16
 * @LastEditTime: 2020-11-26 20:12:21
 * @LastEditors: your name
 * @Description:
 * @FilePath: \easy_animate\src\layout\trackBlock\components\frameTrack.vue
 * @可以输入预定的版权声明、个性签名、空行等
-->
<template>
    <div class="frameTrack" :class="trackClass">
      <p class="frameTarget">cur:{{target}}</p>
      <div class="frameContainer" ref='frameContainer'>
        <frame
        v-for="item in data"
        :key="item.index"
        :content="item.order"
        :popContent=" formatTime(item.time)"
        class="frame"
        ref="frame"
        @click="onFrameClick(item.order)"
        @adjust="adjust(item)"
        @mousedown.native="onDrag(item.order)"
        >
   <!-- @delete="deleteFrame(item.order)"
        @mousedown.native="onDrag(item.order)" -->
      </div>
      <div class="plusBtn"  @click="add">
        <i class="fa fa-plus" aria-hidden="true"></i>
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
import { formatTime } from "@/utils/index.js";
import { frame } from "@/components/index.js";
import { verify, getCurTime } from "@/utils/form.js";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "",
  data() {
    return {
      formData: {
        minute: 0,
        second: 0,
        millisecond: 0,
        type: null,
      },
      data: null,
      target: 0,
      dialogVisible: false,
    };
  },
  components: { frame },
  computed: {
    ...mapState(["tracksData", "trackTarget", "targets","maxTime"]),
    ...mapGetters(["curData","curTrack"]),
    trackClass:function(){
      if(this.trackTarget==this.trackIndex)return 'checkClass';
      return ' '
    }
  },
  mounted: function () {
    this.data= this.tracksData[this.trackIndex];
  },
  methods: {
    onFrameClick: function (order) {
      this.target = order;
    },
    formatTime,
    add: function (done) {
      //添加新帧
      this.formData.type = "ADD[new Frame]";
      this.dialogVisible = true;
    },
    adjust: function (item) {
      let time = item.time;
      let order = item.order;
      this.formData.minute = time.getMinutes();
      this.formData.second = time.getSeconds();
      this.formData.millisecond = time.getMilliseconds();
      this.target = order;
      this.formData.type = "[Adjust]Frame";
      this.dialogVisible = true;
    },
     onDrag: function(order) {
      //鼠标拖动帧执行的逻辑
      this.choiceTrack(this.trackIndex)
      let frame = this.$refs.frame[order].$el;
      let container = this.$refs.frameContainer;
      let b = this.itemWidth//这个没有诶
      let self = this;
      let pop = frame.children[1];

      let x = container.offsetLeft + 24; //1rem=16
      document.onmousemove = function(e) {
        if(e.target.className=='menu-item')return;
        let ratio = (e.pageX - x) / (container.clientWidth - b);
        if (ratio <= 0) ratio = 0;
        if (ratio > 1) ratio = 1;
        self.curTrack[order].time = new Date(self.maxTime * ratio);

        // 对hover框进行操作，触底反弹,和上面的帧拖动逻辑无关,但不需要解耦（目测日后不需要维护hh
        let popLeft = pop.getBoundingClientRect().left + pop.clientWidth;
        let ww = window.innerWidth;
        if (popLeft >= ww - 150)
          pop.style.transform = `translateX(-${popLeft - ww + 50}px)`;
        else {
          pop.style.transform = null;
        }
      };
      document.onmouseup = function() {
        //清除盒子的移动事件;
        document.onmousemove = null;
      };
    },
    //表单提交
    submitForm: function () {
      //对表单值进行效验
      let curTime = getCurTime(this.formData);
      if (!curTime) return;
      switch (this.formData.type) {
        case "ADD[new Frame]": {
          let order = this.data.length;
          this.target = order;
          this.addFrame({
            order,
            time: curTime,
            data: [],
            cache: [],
            finish: false,
          });
          break;
        }
        case "[Adjust]Frame": {
          this.adjustFrame(curTime);
          break;
        }
        case "[Change]MaxTime": {
          // this.maxTime = curTime;
          // this.reDrawTrack();
        }
      }
      if (this.maxTime <= curTime) this.changeMaxTime(curTime);
      this.dialogVisible = false;
    },
    onVerifyErrot: function (message) {
      //检测表单
      this.$message({ message, type: "warning" });
    },
    ...mapMutations(["choiceTrack", "addFrame", "choiceTarget", "adjustFrame","changeMaxTime"]),
  },
  watch: {
    target: function (val) {
      this.choiceTarget(val);
    },
    data: {
      handler: function () {
        //使帧对其时间轨,根据f(时间/总时间) -> f(位置)
        setTimeout(() => {
          //对其帧位置
          let frames = this.$refs.frame;
          let container = this.$refs.frameContainer;
          let tcWidth = container.clientWidth;
          let b=this.itemWidth;
          for (const index in frames) {
            const frame = frames[index].$el;
            const data = this.data[index];
            let ratio = (data.time * 1) / (this.maxTime * 1); //粗调
            let offset = -b * ratio + "px"; //细调,消除偏移量
            ratio = ratio * 100 + "%";
            frame.style.setProperty("--x", ratio);
            frame.style.setProperty("--y", offset);
          }
        });
      },
      deep:true,
    },
  },

  props: ["trackIndex",'itemWidth'],
};
</script>

<style lang='scss' scoped>
.frameTrack {
  .frameTarget {
    margin-left: 2rem;
    width: 4rem;
  }
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  .frameContainer {
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
  .plusBtn {
    margin-left:1rem;
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
.checkClass{
      // border: 1px solid rgba(255, 255, 255, 0.2);
      background:rgba(149, 165, 166, 0.1)
}
</style>
