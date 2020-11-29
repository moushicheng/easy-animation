<template>
  <div id="trackBlock">
    <hr />

    <div id="timeLine">
      <p>TimeLine</p>
      <div id="timeContainer" ref="timeContainer">
        <div class="time-item" ref="item">{{ timeLineData[0] }}</div>
        <div class="time-item">{{ timeLineData[1] }}</div>
        <div class="time-item">{{ timeLineData[2] }}</div>
        <div class="time-item">{{ timeLineData[3] }}</div>
        <div class="time-item">{{ timeLineData[4] }}</div>
        <div class="time-item" @click="adjustMaxTime">
          {{ timeLineData[5] }}
        </div>
      </div>
    </div>

    <!-- frame-track的整体思路应该是内部存储一份数据，所有增删改查操作在内部执行，每个动作做完之后向父组件trackBlock发送改变命令，强制改变帧数据 -->
    <frame-track
      @click.native="choiceTrack(index - 1)"
      ref="frameTrack"
      v-for="index in trackTotal"
      :key="index"
      :trackIndex="index - 1"
      :itemWidth="itemWidth"

    ></frame-track>
    <div @click="addTrack" id="trackAddBtn">
      <i class="fa fa-plus" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
import { verify } from "@/utils/form.js";
import { formatTime } from "@/utils/index.js";
import frameTrack from "./components/frameTrack";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "trackBlock",
  data() {
    return {
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
      itemWidth: null,
    };
  },
  computed: {
    ...mapState(["tracksData", "trackTarget", "targets"]),
    ...mapGetters(["curData", "curTarget", "curTrack", "trackTotal"]),
  },
  methods: {
    ...mapMutations(["choiceTrack", "addTrack"]),

    adjustMaxTime: function () {
      this.formData.type = "[Change]MaxTime";
      this.dialogVisible = true;
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
  },
  mounted: function () {
    this.itemWidth = this.$refs.item.clientWidth;
  },
  components: { frameTrack },
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
  #trackAddBtn {
    width: fit-content;
    cursor: pointer;
    &:hover {
      color: #289baf;
    }
  }
}
</style>
