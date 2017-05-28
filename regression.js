var regression = require('./regression/index.js');

var table_data = require('./data/test_response').dataset_data.data;


var data = [];
table_data.forEach(function(d,i){
  data.push([i,d[1]])
})
var result = regression('polynomial', data,7);
function predict(eq,x){
  let r = 0;
  if(eq){
    eq.forEach((d,i)=>{
      console.log(i+"  "+d)
      r+=d*Math.pow(x,i);
    });
  }
  return r;
}
console.log(data,result,predict(result.equation,22))
