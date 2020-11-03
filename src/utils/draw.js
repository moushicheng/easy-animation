let ctx = null; //存储环境对象
let dom=null; //canvas dom对象
let commandManger = {
  sFunc: {
    close: function() {
      ctx.closePath();
    },
    initial: function(x, y) {
      ctx.strokeStyle = "#FFFFFF";
      ctx.strokeRect(x - 2, y - 2, 4, 4);
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
      ctx.strokeStyle = "#000000";
      ctx.lineTo(x, y);
    },
    clear(){
      console.log('clear');
      dom.height=dom.height;
    }
  }
};

function draw(data, dom, command) {
  if(!dom||!ctx){
    dom=dom;
    ctx = dom.getContext("2d");
  }
  commandManger.common.clear;
  ctx.beginPath();
  for (let point = data[0], i = 0; i < data.length; i++, point = data[i]) {
    //使用所有数据点，进行一次绘画
    let { x, y } = commandManger.common.getPoints(point); //获得具体点数据

    if (command == "initial") commandManger.sFunc[command](x, y);
    if (command == "close" && i == data.length - 1) {
      commandManger.sFunc[command];
    }
    commandManger.common.drawLine(x, y);
  }

  ctx.stroke();
}
let drawTools = {
  draw
};
export default drawTools;
