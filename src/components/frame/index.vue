<template>
  <div class="popover" ref="popover">
    <div class="content" @click="$emit('click')" @contextmenu.prevent="open">
      {{ content }}
    </div>
    <div class="popContent" ref="pop">time:{{ popContent }}</div>
    <div class="contextmenu" ref="menu">
      <div @click="event('adjust')" class="menu-item">adjust</div>
      <div @click="event('delete')" class="menu-item">delete</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "popover",
  data() {
    return {
      menu: null,
      pop: null
    };
  },
  mounted() {
    this.menu = this.$refs.menu;
    this.pop = this.$refs.pop;
  },
  methods: {
    event:function(eventName){
        this.$emit(eventName);
        this.manger("close");
    },
    open: function() {
      let menu = this.menu;
      if (menu.style.display == "block") {
        this.manger("close");
      } else {
        this.manger("open");
      }
    },
    manger: function(order) {
      let menu = this.menu;
      let pop = this.pop;
      if (order == "open") {
        menu.style.display = "block";
        pop.style.display = "none";
      } else if (order == "close") {
        menu.style.display = "none";
        pop.style.display = null;
      }
    }
  },
  props: ["content", "popContent"]
};
</script>

<style lang="scss" scoped>
.popover {
  position: relative;
  width: max-content;
 user-select: none;
  .content {
    cursor: pointer;
    width: 1.5rem;
    height: 1rem;
    border-radius: 1rem;
    color: rgb(58, 13, 13);
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  .popContent {
    display: none;
    position: absolute;
    left: 100%;
    text-align: left;
    width: fit-content;
    padding: 0.5rem;
    color:rgb(52, 73, 94);
    background: rgba(255, 255, 255, 0.8);
    font-size:1.2rem;
    z-index: 4;
    border-radius: 5px;
    transition: 1s;
  }
  .content:hover + .popContent {
    display: block;
  }
  .contextmenu {
    display: none;
    position: absolute;
    left: 100%;
    text-align: left;
    width: fit-content;
    padding: 0.1rem 0;
    color:rgb(52, 73, 94);
    background: rgba(255, 255, 255, 0.8);
    z-index: 4;
    border-radius: 5px;
    transition: 1s;
    .menu-item {
      cursor: pointer;
      padding: 0.1rem 1rem;
      width: 100%;
    }
    .menu-item:nth-last-of-type(n+2) {
      border-bottom: 1px solid;
    }
  }
}
</style>
