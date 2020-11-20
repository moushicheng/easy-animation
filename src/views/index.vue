<template>
  <div class="index">
    <router-link to="/main/">enter</router-link>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'index',
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.index{
  height:100vh;
  width:100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}
</style>
