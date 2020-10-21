<template>
  <div id="trackBlock">
    <hr />
    <div id="timeLine">
      <p>TimeLine </p>
      <div id="timeContainer">
        <div class="time-item">00:00</div>
        <div class="time-item">01:00</div>
        <div class="time-item">02:00</div>
        <div class="time-item">03:00</div>
        <div class="time-item">04:00</div>
        <div class="time-item">05:00</div>
      </div>
    </div>
    <div id="frameTrack">
       <div class="frame">1</div>
       <div id="plusBtn" @click="addFrame">+</div>
    </div>

  </div>
</template>

<script>
export default {
  name: "trackBlock",
  data() {
    return {
      timeData:[
        {
          order:1,
          time:0,
        }
      ]
    };
  },
  components: {},
  mounted() {},
  methods: {
    addFrame:function(){

    }
  }
};
</script>

<style lang="scss" scoped>
#trackBlock {
  margin-top: 1rem;
  #timeLine{
    display: flex;
    p{
      width:5rem;
      border-right:1px solid white;
      padding-right:1rem;
    }
    #timeContainer{
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      margin:0 1rem;
    }
  }
  #frameTrack{
    margin-left:6rem;
    margin-top:0.1rem;
    display: flex;
    .frame{
      width:2rem;
      border-radius: 1rem;
      color:rgb(58, 13, 13);
      background: rgb(250, 249, 249);
      text-align: center;
    }
    #plusBtn{
      margin-left:0.5rem;
    }
  }

}
</style>
