
  //格式化Date,转化为00:00.000"格式

function formatTime(time) {
  let min = time.getMinutes();
  min=suppleZero(2,min);
  let second = time.getSeconds();
  second=suppleZero(2,second);
  let ms = time.getMilliseconds();
  ms=suppleZero(3,ms);
  return `${min}:${second}.${ms}"`;
}
function suppleZero(n,num){
  let len=num.toString().length;
  if (len< n){
    for(let i=0;i<n-len;i++){
      num="0"+num;
    }
  }
  return num
}

//绘制导出代码的形式
function CreateImportCode({points, viewX, viewY}){
  points=points.filter(function(item) { //过滤未闭合图形
    if (item.finish == true) {
      return true;
    }
  });
  points = points.map(item => { //简化数组元素
    return {
      data:item.data,
      time:item.time
    };
  });
  let result=[];
  for (let point of points) {
      point.data=point.data.map(function(item){
       item=item.split(',')
       let x=item[0];
       let y=item[1];
       return `${x}px ${y}px`
      })
      point.data=point.data.join(',');
      result.push(point);
  }
  let maxTime=(points.pop().time.valueOf());
  let cssCode=`
  .ele{
    width:${viewX}px;
    height:${viewY}px;
    background: black;
    animation: move ${maxTime/1000}s linear infinite;
  }
  @keyframes move {

  `
  for (const item of result) {
     let time=item.time.valueOf();
     let data=item.data;
     let timeRatio=(time/maxTime)*100+"%"
     let frame=`
       ${timeRatio}{
        clip-path: polygon(${data})
       }
     `
     cssCode=cssCode+frame;
  }
  cssCode=cssCode+'}'
  console.log(cssCode);
  return cssCode
}

function pointShake(points){
  //多个图形以最多点的那个图形为基准补齐点数

  let mpItemLength=-1;
  let mpIndex=-1;
  for (const [index,point] of Object.entries(points)) {
    if(point.data.length>mpItemLength){
      mpItemLength=point.data.length;
      mpIndex=index
    }
  }
  //开始补正
  for(let i=0;i<points.length;i++){
    if(i==mpIndex)continue;
    let point=points[i]
    let data=point.data; //点集 ['1,2','2,3']
    let total=mpItemLength-data.length //补正点个数
    let interval=data.length-1; //点间隙
    let insertNum=Math.floor(total/interval) //间隙之间的点插入数目
    let endNum=total-interval*insertNum //'漏点'补正
    for(let i=0;i<interval;i++){
      let result=null;
      let t=i+insertNum*i;
       if(endNum>0&&i==interval-1){
         result=countNewPoint(data[t],data[t+1],insertNum+endNum);
       }else{
         result=countNewPoint(data[t],data[t+1],insertNum);
       }
      data.splice(i+insertNum*i+1,0,...result)
    }
    point.data=data;
  }
    return points;
}
function countNewPoint(point1,point2,amount){ //amount就是点插入数目
   let x1=point1.split(',')[0];
   let y1=point1.split(',')[1];
   let x2=point2.split(',')[0];
   let y2=point2.split(',')[1];
   let offsetX=(x2-x1)/(amount+2);
   let offsetY=(y2-y1)/(amount+2);

   let result=[];
   for (let i=1;i<=amount;i++) {
     result.push(`${x1*1+offsetX*i},${y1*1+offsetY*i}`)
   }
   return result
}

export {formatTime,CreateImportCode,pointShake};
