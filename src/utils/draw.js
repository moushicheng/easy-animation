let ctx = null; //存储环境对象
let _dom = null; //canvas dom对象
let cm = { //commandManger
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
    choiceLineColor(index,target){
      if(index!=target)ctx.strokeStyle='rgba(0,0,0,0.5)'
      else ctx.strokeStyle='rgba(0,0,0)'
    }
  }
};

function draw(allData,target,dom, command) {
  if (!dom || !ctx) {
    _dom = dom;
    ctx = dom.getContext("2d");
  }
  cm.common.clear();

  for (let [index,item] of Object.entries(allData)) {
    ctx.beginPath();
    let data = item.data;
    for (let point = data[0], i = 0; i < data.length; i++, point = data[i]) {
      //使用所有数据点，进行一次绘画
      let { x, y } = cm.common.getPoints(point); //获得具体点数据

      if (i == 0) cm.sFunc["initial"](x, y);
      if (command == "close" && i == data.length - 1) {
        cm.sFunc[command];
      }
      cm.common.choiceLineColor(index,target)
      cm.common.drawLine(x, y);

    }
    ctx.stroke();
  }
}
let drawTools = {
  draw
};
export default drawTools;
