<template>
  <div id="toolBar">
    <div class="recommand">
      <h1>Easy-animation</h1>
      <h1>v1.0</h1>
      <main>
        <a href="https://github.com/a1163675107/easy-animation">
          welcome,please use it to draw your awesome animation before reading
          github instruction
        </a>
      </main>
    </div>
    <div class="header">Drawing tools</div>
    <div class="tool-item" @click="choiceTools(0)" :style="changeToolStyle(0)">
      <poper
        content="pointer"
        popContent="切换到图片层,可拖动图片,注意：如果图片进入中间绘图区,不使用该工具就无法拖动了！"
      ></poper>
      <div class="icon">
        <i class="fa fa-mouse-pointer" aria-hidden="true"></i>
      </div>
    </div>
    <div class="tool-item" @click="choiceTools(1)" :style="changeToolStyle(1)">
      <poper content="pen" popContent="切换到绘图层,绘制画面"></poper>
      <div class="icon">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </div>
    </div>
    <div
      class="tool-item"
      id="colorTool"
      @click="choiceTools(2)"
      :style="changeToolStyle(2)"
    >
      <div class="item-wrapper">
        <poper content="fill" popContent="填充颜色,右边的○是调色板"></poper>
        <div class="icon">
          <i
            class="fa fa-circle"
            aria-hidden="true"
            :style="'color:' + color"
          ></i>
          <el-color-picker
            v-model="color"
            size="mini"
            :show-alpha="true"
            @change="choiceColor"
          ></el-color-picker>
        </div>
      </div>
      <div id="colorPallet" @click="changeColor">
        <i
         v-for="color in colors"
         :key="color.index"
          class="fa fa-circle pallet-item"
          :style="'color:' + color"
        ></i>
      </div>
    </div>
    <!-- <div class="tool-item">
      <poper content="color" popContent="选择一个颜色(making)"></poper>
      <div class="icon">
        <i class="fa fa-braille" aria-hidden="true"></i>
      </div>
    </div> -->

    <div class="header">Auxiliary tools</div>
    <!-- <div class="tool-item">
      <p>show</p>
      <div class="icon">
        <i class="fa fa-eye" aria-hidden="true"></i>
      </div>
    </div>
    <div class="tool-item">
      <p>hide</p>
      <div class="icon">
        <i class="fa fa-eye-slash" aria-hidden="true"></i>
      </div>
    </div> -->
    <div class="tool-item" @click="control(0)">
      <poper content="back" popContent="字面意思,撤回"></poper>
      <div class="icon">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
    </div>
    <div class="tool-item" @click="control(1)">
      <poper content="go" popContent="字面意思,前进"></poper>
      <div class="icon">
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </div>
    </div>

    <div class="header">Other tools</div>
    <div class="tool-item" id="insertTool">
      <div id="insertHeader" @click="insertImage">
        <poper content="insert" popContent="插入图片"></poper>
        <div class="icon">
          <i class="fa fa-file-image-o" aria-hidden="true"></i>
        </div>
      </div>
      <div class="show-box" v-if="imgList.length != 0">
        <div v-for="(img, index) in imgList" :key="index" class="show-item">
          <p>{{ img.name }}</p>
          <div class="icon">
            <i
              class="fa fa-trash-o"
              aria-hidden="true"
              @click="deleteImg(index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="tool-item" @click="preview">
      <poper content="preview" popContent="预览动画"></poper>
      <div class="icon">
        <i class="fa fa-desktop" aria-hidden="true"></i>
      </div>
    </div>
    <div class="tool-item" @click="importCode">
      <poper content="export" popContent="导出css代码"></poper>
      <div class="icon">
        <i class="fa fa-download" aria-hidden="true"></i>
      </div>
    </div>
    <div class="tool-item" id="resolution">
      <p>resolution</p>
      <div id="resolutionBlock">
        <input type="text" v-model="resolution[0]" />
        x
        <input type="text" v-model="resolution[1]" />
      </div>
    </div>
    <input
      type="file"
      style="filter: alpha(opacity=0); opacity: 0; position: absolute"
      ref="imgUpload"
    />
  </div>
  <!-- <div class="tool-item" id="layer" @click="openLayout">
      <p>layer</p>
      <i class="fa fa-arrow-right" aria-hidden="true"></i>
      <div class="switch-box" v-if="layerShow">
        <header>Switch A Layer</header>
        <div class="switch-item" @click="choiceLayout('draw')">
          <p>draw</p>
          <i class="fa fa-check" aria-hidden="true" v-if="layer=='draw'"></i>
        </div>
        <div class="switch-item" @click="choiceLayout('image')">
          <p>image</p>
           <i class="fa fa-check" aria-hidden="true" v-if="layer=='image'"></i>
        </div>
      </div>
    </div> -->
</template>

<script>
import { poper } from "@/components/index.js";
export default {
  name: "toolBar",
  data() {
    return {
      layerShow: false,
      tool: 1,
      imgList: [],
      color:"rgba(0,0,0,1)",
      colors: ["rgba(0,0,0,1)"],
    };
  },
  components: { poper },
  mounted() {
    let input = this.$refs.imgUpload;
    let self = this;
    input.addEventListener("change", function () {
      let file = this.files[0];
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          self.imgList.push({
            url: reader.result,
            name: file.name.slice(-10),
          });
          self.$emit("events", "insert", self.imgList); //似乎没有意义
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  },
  methods: {
    importCode: function () {
      this.$emit("events", "importCode");
    },
    insertImage: function () {
      let input = this.$refs.imgUpload;
      this.trigger(input, "click");
    },
    openLayout: function () {
      this.layerShow = !this.layerShow;
    },
    choiceTools: function (name) {
      this.tool = name;
      this.$emit("events", "choiceLayer", name);
    },
    changeToolStyle(name) {
      if (name == this.tool) return `color:rgb(159, 208, 212)`;
      else return ` `;
    },
    trigger(ele, event) {
      ele[event]();
    },
    deleteImg(index) {
      this.imgList.splice(index, 1);
    },
    control(mod) {
      this.$emit("events", "controlStep", mod);
    },
    preview() {
      this.$emit("events", "preview");
    },
    choiceColor(){
      this.colors.push(this.color);
    },
    changeColor(e){
      if(!e.target.style.color)return;
       this.color=e.target.style.color
    }
  },
  model: {
    prop: "resolution",
    event: "change",
  },
  props: {
    resolution: Array,
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
#toolBar {
  border: 1px solid white;
  padding: 1rem;
  min-height: 80vh;
  .recommand {
    font-size: 1.4rem;
    h1 {
      font-size: 1.3rem;
      &:nth-child(1) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      }
    }
    main {
      max-width: 10rem;
      margin-top: 5px;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 5px;
      transition: 0.3s;
      &:hover {
        color: rgb(159, 208, 212);
      }
    }
  }
  .header {
    margin: 2rem 0 1rem 0;
    font-size: 1.3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }
  .tool-item {
    position: relative;
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    transition: 0.05s;
    &:hover {
      font-size: 1.25rem;
      color: rgb(159, 208, 212);
      ::v-deep .popover {
        .popContent {
          opacity: 1;
        }
      }
    }
    p {
      margin-right: 1vw;
      width: fit-content;
    }
    .icon {
      transition: 0.3s;
      &:hover {
        transform: rotate(15deg);
      }
    }
  }
  #colorTool {
    position: relative;
    display: block;
    .item-wrapper {
      display: flex;
      justify-content: space-between;
       &:hover {
      font-size: 1.25rem;
      color: rgb(159, 208, 212);
      ::v-deep .popover {
        .popContent {
          opacity: 1;
        }
      }

    }
    }
    #colorPallet {
      max-width: 10rem;
      margin-top:0.5rem;
      overflow: hidden;
      border:1px solid rgb(154, 164, 175);
      padding:0.5rem 0 0.5rem 0.5rem;
      .pallet-item{
        float:left ;
        margin-right:0.5rem;
        font-size: 0.5rem;
      }
    }
    .el-color-picker {
      position: absolute;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
  }
  #insertTool {
    justify-content: flex-start;
    flex-direction: column;
    &:hover {
      font-size: 1rem;
      color: rgb(255, 255, 255);
    }
    #insertHeader {
      display: flex;
      justify-content: space-between;
      &:hover {
        font-size: 1.25rem;
        color: rgb(159, 208, 212);
      }
    }
    .show-box {
      height: auto;
      cursor: default;
      margin-top: 0.5rem;
      padding: 0.3rem 0.3rem 0 0.3rem;
      border-radius: 10px;
      color: rgb(52, 73, 94);
      background: rgba(255, 255, 255, 0.8);
      .show-item {
        display: flex;
        justify-content: space-between;
        height: 1.5rem;
        i:hover {
          cursor: pointer;
          font-size: 1.25rem;
          color: rgb(85, 111, 138);
        }
        p {
          font-size: 0.8rem;
          font-weight: 500;
          &:hover {
            cursor: pointer;
            font-size: 1rem;
            color: rgb(85, 111, 138);
          }
        }
      }
    }
  }
  #resolution {
    flex-direction: column;
    #resolutionBlock {
      width: fit-content;
      input {
        border-radius: 5px;
        width: 3rem;
      }
    }
  }
  #layer {
    position: relative;
    .switch-box {
      width: fit-content;
      position: absolute;
      padding: 0.3rem;
      z-index: 10;
      left: 100%;
      color: rgb(52, 73, 94);
      background: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
      margin-left: 0.3rem;
      font-size: 1rem;
      header {
        cursor: auto;
        font-weight: 300;
        font-size: 1.5rem;
      }
      .switch-item {
        margin: 0.5rem 0;
        transition: 0.05s;
        display: flex;
        justify-content: space-between;
      }
      .switch-item:hover {
        font-size: 1.25rem;
        color: rgb(85, 111, 138);
      }
      .switch-item:nth-last-child(n + 1) {
        border-bottom: 1px solid black;
      }
    }
  }
}
</style>
