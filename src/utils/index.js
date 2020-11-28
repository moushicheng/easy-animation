import store from "@/store";

//格式化Date,转化为00:00.000"格式
function formatTime(time) {
  let min = time.getMinutes();
  min = suppleZero(2, min);
  let second = time.getSeconds();
  second = suppleZero(2, second);
  let ms = time.getMilliseconds();
  ms = suppleZero(3, ms);
  return `${min}:${second}.${ms}"`;
}
function suppleZero(n, num) {
  let len = num.toString().length;
  if (len < n) {
    for (let i = 0; i < n - len; i++) {
      num = "0" + num;
    }
  }
  return num;
}

//对轨道中的点信息进行处理
function mergeData(vx, vy) {
  let tracksData = JSON.parse(JSON.stringify(store.state.tracksData)); //深复制，防止更改时伤到引用对象
  let result = [];

  for (let track of tracksData) {
    //虽然这样写看着清晰，但是循环也变成3(n^2)了...
    track = pointShake(track)
      .sort((a, b) => a.time - b.time) //按时间排序
      .filter(item => item.finish == true || item.data.length != 0) //清除异常点
      .map(item => {
        //处理点数据转换成clip-path能接受的形式
        item.data = item.data.map(item => {
          item = item.split(",");
          let x = (item[0] / vx).toFixed(4);
          let y = (item[1] / vy).toFixed(4);
          return `${x}% ${y}%`;
        });
        return {
          data: item.data,
          time: item.time
        };
      });

    result.push(track);
  }
  return result;
}

//绘制导出代码的形式
function CreateImportCode(viewX, viewY) {
  let tracksData = mergeData(viewX, viewY);
  let cssCode = "";
  for (let [index, track] of Object.entries(tracksData)) {
    if (track.length == 0) continue;
    let maxTime = new Date(track[track.length - 1].time).valueOf(); //毫秒
    cssCode += `
     .ele-${index}{
       width:${viewX}px;
       height:${viewY}px;
       background: black;
       animation: move-${index} ${maxTime / 1000}s linear infinite;
     }`;
  }
  cssCode += `||`;

  for (let [index, track] of Object.entries(tracksData)) {
    if (track.length == 0) continue;
    cssCode += `
    @keyframes move-${index} {
`;
    for (const item of track) {
      let time = new Date(item.time).valueOf();
      let maxTime = new Date(track[track.length - 1].time).valueOf(); //毫秒
      let data = item.data;
      let timeRatio = (time / maxTime) * 100;
      if (Number.isNaN(timeRatio)) timeRatio = 0;
      let frame = `          ${timeRatio}%{
          clip-path: polygon(${data})
         }
       `;
      cssCode = cssCode + frame;
    }
    cssCode = cssCode + "}";
  }
  console.log(cssCode);
  return Promise.resolve(cssCode);
}

function pointShake(points) {
  //时同一轨道内的图形点数量保持一致

  let mpItemLength = -1;
  let mpIndex = -1;
  for (const [index, point] of Object.entries(points)) {
    if (point.data.length > mpItemLength) {
      mpItemLength = point.data.length;
      mpIndex = index;
    }
  }
  //开始补正
  for (let i = 0; i < points.length; i++) {
    if (i == mpIndex) continue;
    let point = points[i];
    let data = point.data; //点集 ['1,2','2,3']
    let total = mpItemLength - data.length; //补正点个数
    let interval = data.length - 1; //点间隙
    let insertNum = Math.floor(total / interval); //间隙之间的点插入数目
    let endNum = total - interval * insertNum; //'漏点'补正
    for (let i = 0; i < interval; i++) {
      let result = null;
      let t = i + insertNum * i;
      if (endNum > 0 && i == interval - 1) {
        result = countNewPoint(data[t], data[t + 1], insertNum + endNum);
      } else {
        result = countNewPoint(data[t], data[t + 1], insertNum);
      }
      data.splice(i + insertNum * i + 1, 0, ...result);
    }
    point.data = data;
  }
  return points;
}
function countNewPoint(point1, point2, amount) {
  //amount就是点插入数目
  let x1 = point1.split(",")[0];
  let y1 = point1.split(",")[1];
  let x2 = point2.split(",")[0];
  let y2 = point2.split(",")[1];
  let offsetX = (x2 - x1) / (amount + 2);
  let offsetY = (y2 - y1) / (amount + 2);

  let result = [];
  for (let i = 1; i <= amount; i++) {
    result.push(`${x1 * 1 + offsetX * i},${y1 * 1 + offsetY * i}`);
  }
  return result;
}

function check(points) {
  for (let [i, item] of Object.entries(points)) {
    if (item.finish == false) return i;
  }
  return true;
}

function copy(obj) {
  var newObj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  }
  for (var i in obj) {
    newObj[i] = typeof obj[i] === "object" ? copy(obj[i]) : obj[i];
  }
  return newObj;
}
let sayManger = {
  saySuccess: function() {
    this.$notify({
      title: "FINISH",
      message: "完成一帧画面的绘制",
      type: "success"
    });
  }
};
export { formatTime, CreateImportCode, pointShake, sayManger, mergeData };
