


function draw(data, dom,command) {
  let ctx=dom.getContext('2d');
  ctx.beginPath();
  for (let point=data[0],i=0;i<data.length;i++,point=data[i]) {
     point=point.split(',')
     let x=point[0];
     let y=point[1];
     if(command=='initial'){
      ctx.strokeStyle="#FFFFFF";
      ctx.strokeRect(x-2,y-2, 4,4 );
     }
     if(command=='close' && i==data.length-1){
      console.log('close')
      ctx.closePath();
      break;
      }
     ctx.strokeStyle="#000000";
     ctx.lineTo(x,y);
  }

  ctx.stroke();
}
let drawTools={
  draw
}
export default drawTools
