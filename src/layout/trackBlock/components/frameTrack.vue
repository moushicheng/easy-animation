<!--
 * @Author: your name
 * @Date: 2020-11-20 21:07:16
 * @LastEditTime: 2020-11-25 09:29:36
 * @LastEditors: your name
 * @Description:
 * @FilePath: \easy_animate\src\layout\trackBlock\components\frameTrack.vue
 * @可以输入预定的版权声明、个性签名、空行等
-->
<template>
    <div class="frameTrack">
      <p class="frameTarget">cur:{{target}}</p>
      <div class="frameContainer" ref='frameContainer'>
        <frame
        v-for="item in curTrack"
        :key="item.index"
        :content="item.order"
        :popContent=" formatTime(item.time)"
        class="frame"
        ref="frame"
        @click="onFrameClick(item.order)"
        >
   <!-- @delete="deleteFrame(item.order)"
        @adjust="adjustFrame(item)"
        @drag="onDrag(item.order)"
        @mousedown.native="onDrag(item.order)" -->
      </div>
      <div class="plusBtn"  @click="addFrame">+</div>

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
import { verify } from "@/utils/form.js";
import { mapState,mapGetters,mapMutations} from 'vuex'
export default {
  name: "",
  data() {
    return {
      target:0,
      formData: {
        minute: 0,
        second: 0,
        millisecond: 0,
        type: null,
      },
      dialogVisible: false,
    };
  },
  components: { frame },
  computed:{
   ...mapState([
      'tracksData',
      'trackTarget',
      'targets'
    ]),
    ...mapGetters([
      'curData',
      'curTarget',
      'curTrack'
    ]),
  },
  methods: {
    onFrameClick: function (order) {
      this.target=order;
    },
    formatTime,
     addFrame: function (done) {
      //添加新帧
      this.formData.type = "ADD[new Frame]";
      this.dialogVisible = true;
    },
    //表单提交
    submitForm: function () {
      //对表单值进行效验
      let min = this.formData.minute;
      let second = this.formData.second;
      let ms = this.formData.millisecond;
      if (!verify(min, "range", "0,60") ||!verify(second, "range", "0,60") ||!verify(ms, "range", "0,1000"))return;
      let curTime = new Date(min * 60 * 1000 + second * 1000 + ms * 1);

      switch (this.formData.type) {
        case "ADD[new Frame]": {
          // this.target=this.data.length - 1;
          this.choiceTrack(this.trackIndex);
          this.addFrame({
            order: this.curTrack.length,
            time: curTime,
            data: [],
            cache: [],
            finish: false
          })
          // this.$store.commit('choiceTrack',this.data.length-1);
          // this.$parent.$emit("choiceTarget", this.data.length - 1);
          break;
        }
        case "[Change]Frame": {
          // this.curData.time = curTime;
          // this.$emit("changeFrame", { order: this.curTarget, time: curTime });
          // this.$emit("choiceTarget", this.curTarget);
          break;
        }
        case "[Change]MaxTime": {
          // this.maxTime = curTime;
          // this.reDrawTrack();
        }
      }
      if (this.maxTime <= curTime) this.maxTime = curTime;
        this.dialogVisible = false;
    },
    onVerifyErrot: function (message) {
      //检测表单
      this.$message({ message, type: "warning" });
    },
     ...mapMutations([
      'choiceTrack'
    ]),
  },
  props:['trackIndex'],
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
</style>
