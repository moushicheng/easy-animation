
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

export {formatTime};
