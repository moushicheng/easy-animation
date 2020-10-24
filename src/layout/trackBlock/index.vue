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
        <div class="time-item">{{timeLineData[5]}}</div>
      </div>
    </div>
    <div id="frameTrack">
      <div id="frameContaner">
        <frame  v-for="item in timeData" :key="item.index" :content="item.order" :popContent=" formatTime(item.time)" class="frame" ref="frame" @click="$emit('target',item.order);">
      </div>
      <div id="plusBtn" @click="addFrame">+</div>
    </div>

    <el-dialog title="[ADD]new frame" :visible.sync="dialogVisible" width="30%">
      <form ref="addForm" id="addForm">
        <div class="form-item">
          <p class="form-item-head">Set Time</p>
          <input type="number" max="60" min="0" name="timeMinute" />
          <span id="timeMiddle">:</span>
          <input type="number" max="60" min="0" name="timeSecond" />
          <span id="timeMiddle">.</span>
          <input type="number" max="1000" min="0" name="timemillisecond" />
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
import {verify} from "@/utils/form.js";
import {formatTime} from "@/utils/index.js"
import frame from "@/components/frame/index"

export default {
  name: "trackBlock",
  data() {
    return {
      timeData: [
        {
          order: 0,
          time: new Date(0)
        },
      ],
      dialogVisible: false,
      maxTime: new Date(2500),
      timeLineData:['00:00.000"','00:00.500"','00:01.000"','00:01.500"','00:02.000"','00:02.500"']
    };
  },
  components: {frame},
  mounted() {},
  watch:{
    timeData:{
      handler:function(){
        setTimeout(()=>{
        this.reDrawTrack();
        let frames=this.$refs.frame;
        let timeContainer=this.$refs.timeContainer;
        let tcWidth=timeContainer.clientWidth;
        let b=this.$refs.timeItem.clientWidth;


         for (const index in frames) {
          const frame=frames[index].$el;
          const data=this.timeData[index];

          let ratio=((data.time*1)/(this.maxTime*1));
          let offset=-b*ratio+'px';
          ratio=ratio*100+"%";

          frame.style.setProperty('--x',ratio);
          frame.style.setProperty('--y',offset);
         }
        })
      },
      deep:true
    }
  },

  methods: {
    addFrame: function(done) {
      this.dialogVisible = true;
    },
    submitForm: function() {
      this.dialogVisible = false;
      let form = this.$refs["addForm"];
      let min = form.timeMinute.value || 0;
      if (!verify(min, "range", "0,60", this.onVerifyErrot)) return;
      let second = form.timeSecond.value || 0;
      if (!verify(second, "range", "0,60", this.onVerifyErrot)) return;
      let ms = form.timemillisecond.value || 0;
      if (!verify(ms, "range", "0,1000", this.onVerifyErrot)) return;

      let allTime = new Date(min * 60 * 1000 + second * 1000 + ms * 1);
      this.timeData.push({
        order: this.timeData.length,
        time: allTime
      });
      if (this.maxTime <= allTime) {
        this.maxTime = allTime;
      }
      this.$emit('frame',allTime.valueOf());

    },
    onVerifyErrot: function(message) {
      this.$message({ message, type: "warning" });
    },
    reDrawTrack:function(){
     let maxT=this.maxTime;
     let t=this.maxTime/5;
     let result=['00:00.000"'];
     for(let i=1;i<5;i++){
        result.push(this.formatTime( new Date(t*i) ));
     }
     result.push(this.formatTime(maxT));
     this.timeLineData=result;
     this.timeLineData.push(); //强制更新
    },
   formatTime
  }
};
</script>

<style lang="scss" scoped>
#trackBlock {
  margin-top: 1rem;
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
    }
  }
  #frameTrack {
    margin-left: 6rem;
    margin-top: 0.5rem;
    display: flex;
    align-items:center;
    #frameContaner {
       height:1rem;
       border-top:1px solid rgba(255, 255, 255,0.5);
       border-bottom:1px solid rgba(255, 255, 255,0.5);
       flex-grow: 1;
       position: relative;
      .frame {
         --x:'0%';
         --y:'0px';
         position: absolute;
         top:0;
         left:var(--x);
         transform: translateX(var(--y));
      }
    }
    #plusBtn {
      font-size:1rem;
      font-weight: 900;
      color: white;
      cursor: pointer;
      border-radius: 50%;
      &:hover{
        color:#289baf
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
