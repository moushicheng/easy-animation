<!--
 * @Author: your name
 * @Date: 2020-11-19 12:32:37
 * @LastEditTime: 2020-11-19 20:50:46
 * @LastEditors: your name
 * @Description:
 * @FilePath: \easy_animate\src\layout\reviewWindow\index.vue
 * @可以输入预定的版权声明、个性签名、空行等
-->
<template>
  <div class="window" :style="wStyle">
    <div class="ele">
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  computed: {
    wStyle: function() {
      let c=this.canvas;
      c=c.getBoundingClientRect();
      return `top:${c.top}px;left:${c.left}px`
    }
  },
  mounted() {
    let style = document.styleSheets[0];
    //这样分开就行了!
   style.insertRule(this.cssCode.split('||')[0]); //写入样式/
   style.insertRule(this.cssCode.split('||')[1])
  },

  props: ["cssCode","canvas"]
};
</script>

<style lang="scss" scoped>
.window {
  position: absolute;
  z-index: 999;
}
</style>
