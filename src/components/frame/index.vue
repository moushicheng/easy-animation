<template>
  <div class="popover">
    <div class="content" @click="$emit('click')">
      {{ content }}
    </div>
    <div class="popContent">
      time:{{ popContent }}
    </div>
  </div>
</template>

<script>
export default {
  name: "popover",
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {},
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
    height:1rem;
    border-radius: 1rem;
    color: rgb(58, 13, 13);
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  .popContent {
    position: absolute;
    left: 100%;
    text-align: left;
    width: fit-content;
    padding: 1rem;
    background: rgb(29, 126, 223);
    color: white;
    z-index: 999;
    border-radius: 5px;
    opacity: 0;
    transition: 0.2s;
  }
   .content:hover + .popContent {
    opacity: 1;
  }
  .content:hover {
    color:white;
    background: rgb(29, 126, 223);
  }
}
</style>
