<!--
 * @Author: your name
 * @Date: 2020-11-20 21:07:16
 * @LastEditTime: 2020-11-20 21:08:02
 * @LastEditors: your name
 * @Description:
 * @FilePath: \easy_animate\src\layout\trackBlock\components\frameTrack.vue
 * @可以输入预定的版权声明、个性签名、空行等
-->
<template>
    <div id="frameTrack">
      <p id="frameTarget">cur:{{target}}</p>
      <div id="frameContainer" ref='frameContainer'>
        <frame
        v-for="item in timeData"
        :key="item.index"
        :content="item.order"
        :popContent=" formatTime(item.time)"
        class="frame"
        ref="frame"
        @click=" onFrameClick(item.order)"
        @delete='deleteData(item.order)'
        @adjust='adjustData(item)'
        @drag="onDrag(item.order)"
        @mousedown.native="onDrag(item.order)"
        >
      </div>
      <div id="plusBtn" @click="addFrame">+</div>
    </div>
</template>

<script>
import {frame} from "@/components/index.js";
export default {
  name: '',
  data () {
    return {

    };
  },
  components: {frame},
  mounted () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
