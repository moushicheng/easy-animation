let rules = {
  range: function(data, max, min) {
    if (data > max || data < min) {
      return false;
    }
    return true;
  },
};

function  verify(data, strategy, range,callback) {
  let min,max;
  if (range) {
    range = range.split(",");
    min = Number.parseInt(range[0]);
    max = Number.parseInt(range[1]);
  }

  let result = rules[strategy](data, max, min);
  let message=`必须在${min}~${max}范围内哟`;
  if(result==false)callback(message);
  return result;
}
export {verify}
