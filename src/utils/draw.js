import store from "@/store";

let ctx = null; //存储环境对象
let _dom = null; //canvas dom对象
let cm = {
  //commandManger
  sFunc: {
    close: function() {
      ctx.closePath();
    },
    initial: function(x, y) {
      ctx.strokeStyle = "#FFFFFF";
      ctx.strokeRect(x - 2, y - 2, 6, 6);
    }
  },
  common: {
    getPoints(point) {
      //获取一个点坐标的信息
      point = point.split(",");
      let x = point[0];
      let y = point[1];
      return { x, y };
    },
    drawLine(x, y) {
      ctx.lineTo(x, y);
    },
    clear() {
      ctx.clearRect(0, 0, _dom.width, _dom.height);
    },
    choiceLineColor(index, trackIndex) {
      let targets = store.state.targets;
      let target = targets[trackIndex];
      let trackTarget = store.state.trackTarget;
      if (index == target && trackTarget == trackIndex)
        ctx.strokeStyle = "rgba(0,0,0)";
      //黑色
      else if (trackTarget == trackIndex) ctx.strokeStyle = "rgba(0,0,0,0.5)";
      //浅色
      else ctx.strokeStyle = "rgba(0,0,0,0.3)";
    },
    fillColor(color){
      if(color){
        ctx.fillStyle=color
        ctx.fill()
      }
    },
    mergeData() {
      let tracksData = store.state.tracksData;
      let result = [];
      for (let track of tracksData) {
        result.push(
          track.map(item => {
            return {
              data: item.data,
              color: item.color
            };
          })
        );
      }
      return result;
    },
    getStoreInfo(index, trackIndex) {
      let targets = store.state.targets;
      return {
        target: targets[trackIndex],
        trackTarget: store.state.trackTarget
      };
    }
  }
};

function draw(command) {
  let targets = store.state.targets;
  let trackTarget = store.state.trackTarget;
  let tracksData = cm.common.mergeData();
  cm.common.clear();

  for (let [trackIndex, track] of Object.entries(tracksData)) {
    for (let [index, _data] of Object.entries(track)) {
      let color = _data.color;
      let data = _data.data;
      ctx.beginPath();
      for (let point = data[0], i = 0; i < data.length; i++, point = data[i]) {
        //使用所有数据点，进行一次绘画
        let { x, y } = cm.common.getPoints(point); //获得具体点数据

        if (i == 0 && targets[trackIndex] == index && trackIndex == trackTarget)
          cm.sFunc["initial"](x, y); //条件1:所绘帧第一个点 条件2:所绘帧是关键帧 条件3:所确定轨时当前轨
        if (command == "close" && i == data.length - 1){cm.sFunc['close']();break;};

        if(command!='noColor')cm.common.fillColor(color);
        cm.common.choiceLineColor(index, trackIndex);
        cm.common.drawLine(x, y);
      }
      ctx.stroke();
    }
  }
}
function getDom(dom) {
  if (!dom || !ctx) {
    _dom = dom;
    ctx = dom.getContext("2d");
  }
}
function isInside(track, x, y) {
  let result = 0;
  for (const [index, data] of Object.entries(track)) {
    for (let i = 0; i < data.length - 1; i++) {
      let o = data[i].split(",").map(item => item * 1); //默认在线段在低处的点
      let n = data[i + 1].split(",").map(item => item * 1); //高处

      if (
        o[1] > y != n[1] > y &&
        x < ((n[0] - o[0]) * (y - o[1])) / (n[1] - o[1]) + o[0]
      ) {
        result++;
      }
    }
    if (result % 2 == 1) return index;
    else result = 0;
  }

  return false;
}
let drawTools = {
  draw,
  getDom,
  isInside
};
export default drawTools;
