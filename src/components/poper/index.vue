<template>
  <div class="popover" ref="popover">
    <div class="content">
      {{ content }}
    </div>
    <div class="popContent" ref="pop">{{ popContent }}</div>
  </div>
</template>

<script>
export default {
  name: "popover",
  props: ["content", "popContent"]
};
</script>

<style lang="scss" scoped>
.popover {
  user-select: none;
  .content {
    cursor: pointer;
    height: 1rem;
    border-radius: 1rem;
    text-align: center;
  }

  .popContent {
    opacity: 0;
    position: absolute;
    left: calc(100% + 1rem);
    top: 0;
    text-align: left;
    padding: 0.5rem;
    color: rgb(52, 73, 94);
    background: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    z-index: 999;
    border-radius: 5px;
    transition: all 0.1s linear 0.5s;
    white-space: nowrap;
    font-size: 1rem;
  }
  &:hover {
    .popContent {
      opacity: 1;
    }
  }
}
</style>
