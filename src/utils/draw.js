function draw(data, dom) {
  let ctx=dom.getContext('2d');
  ctx.beginPath();
  let beginPoint=data[0].split(',');
  for (let point=data[0],i=0;i<data.length;i++,point=data[i]) {
     point=point.split(',')
     let x=point[0];
     let y=point[1];
     ctx.lineTo(x,y);
  }
  ctx.lineTo(beginPoint[0],beginPoint[1]);
  ctx.stroke();
}
export default draw
