<template>
  <div class="popover">
    <div class="content" @click="$emit('click')" @contextmenu.prevent="open">
      {{ content }}
    </div>
    <div class="popContent" ref="pop">time:{{ popContent }}</div>
    <div class="contextmenu" ref="menu">
      <div @click="adjustData" class="menu-item">adjust</div>
      <div @click="deleteData" class="menu-item">delete</div>
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
  components: {},
  mounted() {
    this.menu = this.$refs.menu;
    this.pop = this.$refs.pop;
  },
  methods: {
    deleteData: function() {
      console.log("delete");
      this.$emit("delete");
      this.manger("close");
    },
    adjustData: function() {
      console.log("adjust");
      this.$emit("adjust");
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
    padding: 1rem;
    background: rgb(50, 117, 70);
    color: white;
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
    background: rgb(23, 93, 104);
    color: white;
    z-index: 4;
    border-radius: 5px;
    transition: 1s;
    .menu-item {
      cursor: pointer;
      padding: 0.1rem 1rem;
      width: 100%;
    }
    .menu-item:nth-child(1) {
      border-bottom: 1px solid;
    }
  }
}
</style>
