<!--
 * @Author: your name
 * @Date: 2020-11-19 12:32:37
 * @LastEditTime: 2020-12-04 15:02:25
 * @LastEditors: your name
 * @Description:
 * @FilePath: \easy_animate\src\layout\reviewWindow\index.vue
 * @可以输入预定的版权声明、个性签名、空行等
-->
<template>
  <div class="window" :style="wStyle">
    <div :class="eleStyle(i)" v-for="i in eleAmount" :key="i"></div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      eleAmount:1
    };
  },
  computed: {
    wStyle: function() {
      let c=this.canvas.getBoundingClientRect();
      return `top:${c.top}px;left:${c.left}px`
    },

  },
  mounted() {
    let eles=this.cssCode.split('||')[0];
    let animations=this.cssCode.split('||')[1];
    eles=eles.match(/.ele-\d+{[\d\D]+?}/g)
    this.eleAmount=eles.length;
    animations=animations.match(/@keyframes [^@]+}/g)
    eles.push(...animations);
    let style = document.styleSheets[0];
    for (const item of eles) {
       style.insertRule(item,style.cssRules.length); //写入样式/
    }
    //这样分开就行了!
  },
  methods:{
 eleStyle:function(i){
      return `ele-${i-1}`
    }
  },
  props: ["cssCode","canvas"]
};
</script>

<style lang="scss" scoped>
.window {
  position: fixed;
  z-index: 999;
}
</style>
