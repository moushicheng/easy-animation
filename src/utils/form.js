import context from "../main";
let rules = {
  range: function(data, max, min) {
    if (data > max || data < min) {
      return false;
    }
    return true;
  }
};

function verify(data, strategy, range) {
  let min, max;
  if (range) {
    range = range.split(",");
    min = Number.parseInt(range[0]);
    max = Number.parseInt(range[1]);
  }

  let result = rules[strategy](data, max, min);
  let message = `必须在${min}~${max}范围内哟`;
  if (result == false) context.$message({ message, type: "warning" });
  return result;
}
function getCurTime(formData) {
  let min = formData.minute;
  let second = formData.second;
  let ms = formData.millisecond;
  if (
    !verify(min, "range", "0,60") ||
    !verify(second, "range", "0,60") ||
    !verify(ms, "range", "0,1000")
  )return false;
  return new Date(min * 60 * 1000 + second * 1000 + ms * 1);
}
export { verify,getCurTime };
